"""Run with: python3 publishing/tests/test_check_site.py"""
import sys,tempfile
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parent.parent))
from check_site import check

def page(title,desc,robots='index, follow',body=''):
    return f'<!doctype html><html><head><meta charset="utf-8"><title>{title}</title><meta name="description" content="{desc}"><meta name="robots" content="{robots}"></head><body>{body}</body></html>'

with tempfile.TemporaryDirectory() as tmp:
    root=Path(tmp);(root/'a').mkdir()
    (root/'index.html').write_text(page('Home','Home page',body='<a href="a/">A</a><img src="logo.png"><a href="https://example.org/x">x</a><a href="#top">t</a>'))
    (root/'logo.png').write_bytes(b'x')
    (root/'a/index.html').write_text(page('A page','About A',body='<a href="../index.html">home</a>'))
    (root/'old.html').write_text(page('A page','About A','noindex, follow','<a href="a/">moved</a>'))
    (root/'s.css').write_text('a{background:url("logo.png")} b{background:url(data:image/png;base64,AA==)}')
    assert check(root)==[],check(root)
    (root/'b.html').write_text(page('A page','','index, follow','<a href="missing.html">m</a><script src="/gone.js"></script>'))
    (root/'s.css').write_text('a{background:url(nope.png)}')
    (root/'c.html').write_text(page('','Desc','noindex'))
    errors='\n'.join(check(root))
    for expected in ['b.html: duplicate <title> "A page"','b.html: indexable page has a missing or empty','b.html: broken internal reference missing.html','b.html: broken internal reference /gone.js','s.css: broken CSS url(nope.png)','c.html: missing or empty <title>']:
        assert expected in errors,(expected,errors)
    assert 'old.html' not in errors,errors
print('Site check: metadata uniqueness, missing titles/descriptions and broken internal reference checks passed.')
