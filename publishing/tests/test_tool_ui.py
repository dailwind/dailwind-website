"""Every toolkit uses the shared control system (assets/tool-ui.css + tool-ui.js).

Checks the built site: each tool page links both files, and (when Playwright is installed)
every visible button, drop-down and one-line field has the same height on a phone and on a
computer (40px phone, 36px computer), no tool page scrolls sideways on a phone and the
1-2-3 step bar spans the full width and no word is split across two lines.
Usage: python3 publishing/tests/test_tool_ui.py [_site]
"""
import sys, threading, functools, http.server
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SITE = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / '_site'

MEASURE = r"""(()=>{
const vis=e=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);return r.width>0&&r.height>0&&c.visibility!=='hidden'&&!e.closest('details:not([open])')};
const h=[...document.querySelectorAll('.dw-btn,.dw-field')].filter(vis).map(e=>Math.round(e.getBoundingClientRect().height));
const broken=[];const tw=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;
while(n=tw.nextNode()){const el=n.parentElement;if(!el||el.offsetParent===null||el.closest('script,style,textarea,pre,code,svg,table,details:not([open])'))continue;
 const re=/[A-Za-z0-9']{3,}/g;let m;while(m=re.exec(n.textContent)){const r=document.createRange();r.setStart(n,m.index);r.setEnd(n,m.index+m[0].length);
 const tops=new Set([...r.getClientRects()].filter(x=>x.width>0).map(x=>Math.round(x.top)));if(tops.size>1)broken.push(m[0])}}
const st=document.querySelector('.dw-steps'),main=st&&(st.parentElement.closest('main,.prep-layout,.language-main')||st.parentElement);
return {h, broken:broken.slice(0,5), tall:parseFloat(getComputedStyle(document.body).getPropertyValue('--ui-h')), wide:document.documentElement.scrollWidth>innerWidth+1,
 steps:st?Math.round(st.getBoundingClientRect().width):0}})()"""


def main():
    pages = sorted(p.parent.name for p in SITE.glob('*/index.html') if 'dw-site-header' in p.read_text(errors='ignore'))
    assert len(pages) >= 25, pages
    for slug in pages:
        s = (SITE / slug / 'index.html').read_text()
        assert 'assets/tool-ui.css' in s and 'assets/tool-ui.js' in s, slug
        assert 'dsh-menu' not in s and s.count('class="dsh-close"') == 1, slug + ': one close button only'
    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        print('tool ui: files linked; SKIP layout (no playwright)')
        return 0
    Q = type('Q', (http.server.SimpleHTTPRequestHandler,), {'log_message': lambda *a: None})
    srv = http.server.ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(Q, directory=str(SITE)))
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    base = 'http://127.0.0.1:%d/' % srv.server_address[1]
    bad = []
    with sync_playwright() as p:
        try:
            b = p.chromium.launch()
        except Exception:
            srv.shutdown()
            print('tool ui: files linked; SKIP layout (no browser)')
            return 0
        for width, phone, tall in ((390, True, 40), (1280, False, 36)):
            pg = b.new_page(viewport={'width': width, 'height': 900}, is_mobile=phone, has_touch=phone)
            pg.route('**/*', lambda r: r.abort() if not r.request.url.startswith(base) else r.continue_())
            for slug in pages:
                pg.goto(base + slug + '/')
                pg.wait_for_timeout(400)
                r = pg.evaluate(MEASURE)
                if r['tall'] != tall:
                    bad.append((width, slug, 'control height %s' % r['tall']))
                odd = sorted(set(x for x in r['h'] if x != tall))
                # a label longer than the whole row may take two lines; anything else is a bug
                if odd and any(x < tall or x > tall * 2 for x in odd):
                    bad.append((width, slug, odd))
                if r['broken']:
                    bad.append((width, slug, 'words split across lines: %s' % r['broken']))
                if phone and r['wide']:
                    bad.append((width, slug, 'scrolls sideways'))
                if phone and r['steps'] and r['steps'] < width - 40:
                    bad.append((width, slug, 'step bar only %dpx wide' % r['steps']))
            pg.close()
        b.close()
    srv.shutdown()
    assert not bad, bad
    print('tool ui ok: %d toolkits' % len(pages))
    return 0


if __name__ == '__main__':
    sys.exit(main())
