"""Checks the staged _site for the meta-level security policy and private-file exclusions."""
from pathlib import Path
import re,sys
site=Path(sys.argv[1] if len(sys.argv)>1 else Path(__file__).resolve().parents[2]/'_site')
assert site.is_dir(),'Run prepare_pages.py first.'
pages=list(site.rglob('*.html'));assert pages
for page in pages:
    text=page.read_text()
    csp=re.search(r'<meta http-equiv="Content-Security-Policy" content="([^"]+)"',text)
    assert csp,page
    for d in ("default-src 'none'","object-src 'none'","base-uri 'none'","form-action 'none'","upgrade-insecure-requests"):
        assert d in csp[1],(page,d)
    assert "'unsafe-inline'" not in csp[1].split('script-src')[1].split(';')[0],page
    assert '<meta name="referrer" content="strict-origin-when-cross-origin">' in text,page
    head=text.split('</head>')[0]
    assert re.search(r'<script data-frame-guard src="[^"]*frame-guard\.js\?h=[0-9a-f]+" integrity="sha384-',head),page
    assert head.index('data-frame-guard')<head.index('data-auth-return'),page
    assert not re.search(r'(?:src|href)="http://',text),page
bad=[p for p in site.rglob('*') if p.name.startswith('.env') or p.name in {'.git','.DS_Store'} or p.suffix.lower() in {'.bak','.sql','.map','.pem','.key','.py'} or p.name.endswith('~')]
assert not bad,bad
assert not (site/'assets/linguax/preview.html').exists() and not (site/'assets/linguax/preview.js').exists()
for p in site.rglob('*'):
    if p.is_file() and p.suffix in {'.js','.html','.json'}:
        t=p.read_text(errors='ignore')
        assert not re.search(r'sb_secret_|service_role"?\s*[:=]\s*["\']ey',t),p
print('Security hardening checks passed for',len(pages),'pages.')
