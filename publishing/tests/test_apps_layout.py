"""Optional browser layout test for /apps/ (skips if Playwright is unavailable).
Usage: python3 publishing/tests/test_apps_layout.py [base_url] (default: serves _site locally)."""
import sys,threading,functools,http.server
from pathlib import Path
WIDTHS=[320,375,414,600,768,820,900,1024,1100,1280,1440,1920]
def main():
    try:from playwright.sync_api import sync_playwright
    except ImportError:print('SKIP: playwright not installed');return 0
    base=sys.argv[1] if len(sys.argv)>1 else None;srv=None
    if not base:
        site=Path(__file__).resolve().parents[2]/'_site'
        Q=type('Q',(http.server.SimpleHTTPRequestHandler,),{'log_message':lambda *a:None});h=functools.partial(Q,directory=str(site))
        srv=http.server.ThreadingHTTPServer(('127.0.0.1',0),h);threading.Thread(target=srv.serve_forever,daemon=True).start()
        base='http://127.0.0.1:%d/'%srv.server_address[1]
    fails=[];shots=len(sys.argv)>2
    with sync_playwright() as p:
        b=p.chromium.launch()
        for path in ('apps/','apps/owl-file-saver/'):
            for w in WIDTHS:
                pg=b.new_page(viewport={'width':w,'height':900});pg.goto(base+path,wait_until='networkidle')
                r=pg.evaluate("""()=>({sw:document.documentElement.scrollWidth,names:[...document.querySelectorAll('.app-card .app-name')].map(n=>{const cs=getComputedStyle(n);return [n.textContent,n.getBoundingClientRect().height,parseFloat(cs.lineHeight)]}),cats:[...document.querySelectorAll('.app-card:not(.app-detail-card) .app-category')].map(n=>[n.textContent,n.getBoundingClientRect().height,parseFloat(getComputedStyle(n).lineHeight)]),cards:[...document.querySelectorAll('.app-card')].map(c=>c.getBoundingClientRect().width)})""")
                if r['sw']>w:fails.append((path,w,'horizontal scroll',r['sw']))
                for t,hgt,lh in r['names']+(r['cats'] if path=='apps/' else []):
                    if path=='apps/' and hgt>lh*1.5:fails.append((path,w,'wraps',t,hgt,lh))
                    if path!='apps/':
                        if hgt>lh*2.5:fails.append((path,w,'too tall',t,hgt))
                if path=='apps/' and min(r['cards'])<min(300,w-40):fails.append((path,w,'card too narrow',r['cards']))
                if shots and path=='apps/':pg.screenshot(path=sys.argv[2]+'/apps4-%d.png'%w,full_page=True)
                print(path,w,'ok' if not [f for f in fails if f[1]==w and f[0]==path] else 'FAIL',[round(c) for c in r['cards']])
                pg.close()
        b.close()
    if srv:srv.shutdown()
    for f in fails:print('FAIL',f)
    return 1 if fails else 0
if __name__=='__main__':sys.exit(main())
