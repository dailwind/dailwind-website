"""DOM smoke for toolkit finder live filtering."""
import sys,threading,functools,http.server
from pathlib import Path
def main():
    try:from playwright.sync_api import sync_playwright
    except ImportError:print('SKIP: playwright not installed');return 0
    site=Path(__file__).resolve().parents[2]/'_site'
    if not site.exists():print('SKIP: no _site');return 0
    Q=type('Q',(http.server.SimpleHTTPRequestHandler,),{'log_message':lambda *a:None})
    h=functools.partial(Q,directory=str(site));srv=http.server.ThreadingHTTPServer(('127.0.0.1',0),h)
    threading.Thread(target=srv.serve_forever,daemon=True).start();base='http://127.0.0.1:%d/'%srv.server_address[1]
    fails=[]
    with sync_playwright() as p:
        b=p.chromium.launch();pg=b.new_page(viewport={'width':1280,'height':900})
        errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
        pg.goto(base+'toolkits/',wait_until='networkidle');pg.wait_for_timeout(400)
        total=pg.locator('[data-toolkit]').count();assert total>=20
        assert pg.locator('[data-toolkit]:visible').count()==total
        # Live typing
        pg.focus('#toolkit-search')
        for ch in 'passport':pg.keyboard.type(ch,delay=20)
        pg.wait_for_timeout(200)
        vis=pg.locator('[data-toolkit]:visible')
        if vis.count()!=1 or 'Passport' not in vis.first.text_content():fails.append('passport filter '+str(vis.count()))
        # Ctrl+K
        pg.keyboard.press('Control+k')
        if pg.evaluate('document.activeElement&&document.activeElement.id')!='toolkit-search':fails.append('ctrl-k')
        # Clear via empty
        pg.fill('#toolkit-search','');pg.wait_for_timeout(150)
        if pg.locator('[data-toolkit]:visible').count()!=total:fails.append('empty restore')
        # Generic should not show all
        pg.fill('#toolkit-search','grammar');pg.wait_for_timeout(150)
        g=pg.locator('[data-toolkit]:visible').count()
        if g<1 or g>=total:fails.append('grammar count '+str(g))
        # Writing category chip
        if pg.locator('[data-finder-category="Writing & media tools"]').count()!=1:fails.append('writing chip')
        if errs:fails.append('page errors '+str(errs))
        # screenshots if asked
        if len(sys.argv)>1:
            out=Path(sys.argv[1]);out.mkdir(parents=True,exist_ok=True)
            pg.fill('#toolkit-search','');pg.wait_for_timeout(100)
            pg.screenshot(path=str(out/'toolkits-search-empty-1280.png'),full_page=False)
            pg.fill('#toolkit-search','passport');pg.wait_for_timeout(200)
            pg.locator('#finder-status').scroll_into_view_if_needed()
            pg.screenshot(path=str(out/'toolkits-search-passport-1280.png'),full_page=False)
            pg.set_viewport_size({'width':375,'height':900})
            pg.fill('#toolkit-search','');pg.wait_for_timeout(100)
            pg.screenshot(path=str(out/'toolkits-search-empty-375.png'),full_page=False)
            pg.fill('#toolkit-search','passport');pg.wait_for_timeout(200)
            pg.screenshot(path=str(out/'toolkits-search-passport-375.png'),full_page=False)
        b.close()
    srv.shutdown()
    if fails:print('FAILURES',fails);return 1
    print('toolkit finder DOM smoke passed');return 0
if __name__=='__main__':sys.exit(main())
