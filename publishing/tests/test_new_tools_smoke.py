"""Browser smoke test for the writing & media tools (skips if Playwright is unavailable).
Usage: python3 publishing/tests/test_new_tools_smoke.py [base_url] [screenshot_dir]"""
import sys,threading,functools,http.server
from pathlib import Path
def grammar(pg):
    pg.click('#wt-sample');pg.wait_for_selector('#wt-status:text("Ready.")',timeout=20000);pg.wait_for_timeout(400)
    n=pg.locator('#wt-backdrop mark').count();assert n>=8,n
    assert pg.locator('.wt-sug.c-correctness').count()>=5
    pg.locator('.wt-sug button.fix').first.click();pg.wait_for_timeout(500);assert pg.locator('#wt-backdrop mark').count()<n
    assert pg.text_content('#wt-score').strip().isdigit()
def detector(pg):
    assert pg.locator('#wt-mode').count()==1
    pg.click('#wt-sample');pg.wait_for_selector('#wt-big b',timeout=20000);pg.wait_for_timeout(200)
    assert int(pg.text_content('#wt-big b').rstrip('%'))>=60;assert pg.locator('#wt-sents span').count()>=5
    assert 'not proof' in pg.text_content('.wt-disclaimer')
    assert pg.locator('#wt-metrics article').count()>=4
    assert pg.locator('#wt-phrases .wt-chips span').count()>=1
    pg.click('#wt-sample-academic');pg.wait_for_selector('#wt-big b',timeout=20000);pg.wait_for_timeout(200)
    assert int(pg.text_content('#wt-big b').rstrip('%'))<=45
def humanizer(pg):
    pg.click('#wt-sample');out=pg.input_value('#wt-out');assert out and 'Furthermore' not in out;pg.click('[data-view=diff]');assert pg.locator('#wt-diff ins').count()>3
CHECKS={'grammar-checker/':grammar,'ai-text-detector/':detector,'text-humanizer/':humanizer}
EXTRA=Path(__file__).with_name('new_tools_checks.py')
if EXTRA.exists():exec(EXTRA.read_text())
def main():
    try:from playwright.sync_api import sync_playwright
    except ImportError:print('SKIP: playwright not installed');return 0
    base=(sys.argv[1] if len(sys.argv)>1 else '') or None;srv=None
    if not base:
        site=Path(__file__).resolve().parents[2]/'_site'
        Q=type('Q',(http.server.SimpleHTTPRequestHandler,),{'log_message':lambda *a:None});h=functools.partial(Q,directory=str(site))
        srv=http.server.ThreadingHTTPServer(('127.0.0.1',0),h);threading.Thread(target=srv.serve_forever,daemon=True).start()
        base='http://127.0.0.1:%d/'%srv.server_address[1]
    base=base.rstrip('/')+'/';fails=[]
    with sync_playwright() as p:
        b=p.chromium.launch()
        for path,fn in CHECKS.items():
            for w in (1280,375):
                pg=b.new_page(viewport={'width':w,'height':900});errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
                try:
                    pg.goto(base+path);fn(pg)
                    sw=pg.evaluate('document.documentElement.scrollWidth')
                    if sw>w+1:fails.append((path,w,'horizontal scroll',sw))
                    if len(sys.argv)>2:pg.screenshot(path='%s/tools-%s-%d.png'%(sys.argv[2],path.strip('/'),w))
                except Exception as e:fails.append((path,w,repr(e)[:300]))
                if errs:fails.append((path,w,'page errors',errs))
                print(path,w,'ok' if not [f for f in fails if f[:2]==(path,w)] else 'FAIL');pg.close()
        b.close()
    if srv:srv.shutdown()
    if fails:print('FAILURES',fails);return 1
    print('new tools smoke test passed');return 0
if __name__=='__main__':sys.exit(main())
