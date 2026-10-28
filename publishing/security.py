"""Static-page safeguards shared by local builds and GitHub Pages staging."""
from pathlib import Path
from urllib.parse import urlsplit,urlunsplit,parse_qsl,urlencode,unquote
import base64,hashlib,re

POLICY="default-src 'none'; script-src 'self' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; media-src 'self' blob:; connect-src 'self'; worker-src 'self'; frame-src 'self'; object-src 'none'; base-uri 'none'; form-action 'none'"

def harden_html(text,path,root):
    # Keep optional consent-based analytics on studio pages, never on text-processing desks.
    policy=POLICY
    if re.search(r'<script[^>]+src="(?:\.\./)*app\.js',text):
        policy=policy.replace("script-src 'self' 'wasm-unsafe-eval'", "script-src 'self' 'wasm-unsafe-eval' https://www.googletagmanager.com").replace("connect-src 'self'", "connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com")
    text=re.sub(r'<meta\b[^>]*http-equiv=["\']Content-Security-Policy["\'][^>]*>','',text,flags=re.I)
    text=re.sub(r'<meta\b[^>]*name=["\']referrer["\'][^>]*>','',text,flags=re.I)
    text=re.sub(r'<head\b[^>]*>',lambda m:m[0]+'<meta http-equiv="Content-Security-Policy" content="'+policy+'"><meta name="referrer" content="strict-origin-when-cross-origin">',text,count=1,flags=re.I)
    def script(m):
        tag=m[0];src=re.search(r'\bsrc="([^"]+)"',tag)
        if not src:return tag
        url=urlsplit(src[1])
        if url.scheme or url.netloc:raise ValueError('Initial script must be hosted locally: '+src[1])
        target=(root/unquote(url.path.lstrip('/')) if url.path.startswith('/') else path.parent/unquote(url.path)).resolve()
        if not target.is_relative_to(root.resolve()) or not target.is_file():raise ValueError('Script path escapes the website or is missing: '+src[1])
        digest='sha384-'+base64.b64encode(hashlib.sha384(target.read_bytes()).digest()).decode()
        tag=re.sub(r'\s+integrity="[^"]*"','',tag)
        query=[(k,v) for k,v in parse_qsl(url.query) if k!='h']+[('h',hashlib.sha256(target.read_bytes()).hexdigest()[:12])]
        versioned=urlunsplit(('', '',url.path,urlencode(query),url.fragment))
        tag=tag[:src.start(1)]+versioned+tag[src.end(1):]
        return tag[:-1]+' integrity="'+digest+'">'
    return re.sub(r'<script\b[^>]*>',script,text,flags=re.I)

def harden_site(root):
    root=Path(root).resolve()
    for path in root.rglob('*.html'):
        if 'publishing' in path.relative_to(root).parts:continue
        path.write_text(harden_html(path.read_text(),path,root))

def assert_safe_tree(path):
    forbidden={'.git','.github','.env','node_modules','__pycache__'}
    for p in [path,*path.rglob('*')] if path.is_dir() else [path]:
        if p.is_symlink():raise ValueError('Symlinks must never be published: '+str(p))
        if (p.name.startswith('.') and p.name not in {'.well-known','.nojekyll','.gitkeep'}) or p.name in forbidden or p.name.startswith('.env.') or p.suffix.lower() in {'.pem','.key','.p12','.pfx'}:
            raise ValueError('Private/build files must never be published: '+str(p))
        if p.is_file():
            with p.open('rb') as f:head=f.read(8192)
            if re.search(rb'-----BEGIN (?:[A-Z0-9 ]* )?PRIVATE KEY-----',head):raise ValueError('Private key material must never be published: '+str(p))
