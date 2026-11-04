"""Toolkits page extras and tool cross-links (skips without Playwright)."""
import sys,threading,functools,http.server,json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
def main():
    tools=['grammar-checker','ai-text-detector','text-humanizer','citation-generator','synonym-explorer','text-statistics','case-converter','image-converter','image-resizer','passport-photo-maker','text-to-speech']
    for t in tools:
        s=(ROOT/t/'index.html').read_text();assert s.count('class="tool-related"')==1,t;assert 'tool-links.js' in s,t
        for href in __import__('re').findall(r'<nav class="tool-related".*?</nav>',s)[0].split('href="../')[1:]:assert (ROOT/href.split('/')[0]/'index.html').exists(),(t,href)
    try:from playwright.sync_api import sync_playwright
    except ImportError:print('SKIP: playwright');return 0
    site=ROOT/'_site';base=sys.argv[1] if len(sys.argv)>1 else None;srv=None
    if not base:
        Q=type('Q',(http.server.SimpleHTTPRequestHandler,),{'log_message':lambda *a:None});srv=http.server.ThreadingHTTPServer(('127.0.0.1',0),functools.partial(Q,directory=str(site)));threading.Thread(target=srv.serve_forever,daemon=True).start();base='http://127.0.0.1:%d/'%srv.server_address[1]
    with sync_playwright() as p:
        b=p.chromium.launch();pg=b.new_page()
        for t in ('case-converter','synonym-explorer'):pg.goto(base+t+'/')
        pg.goto(base+'toolkits/');chips=pg.locator('.finder-recent-chip');assert chips.count()==2,chips.count();assert 'Synonym' in chips.first.text_content()
        pg.locator('body').click(position={'x':5,'y':5});pg.keyboard.press('Control+k');assert pg.evaluate('document.activeElement.id')=='toolkit-search'
        pg.locator('body').click(position={'x':5,'y':5});pg.keyboard.press('/');assert pg.evaluate('document.activeElement.id')=='toolkit-search'
        pg.click('.finder-recent .finder-resume-clear');assert pg.locator('.finder-recent').count()==0;pg.reload();assert pg.locator('.finder-recent').count()==0
        b.close()
    if srv:srv.shutdown()
    print('toolkit extras ok');return 0
if __name__=='__main__':sys.exit(main())
