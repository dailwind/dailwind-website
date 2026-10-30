"""Static-page safeguards shared by local builds and GitHub Pages staging."""
from pathlib import Path
from urllib.parse import urlsplit,urlunsplit,parse_qsl,urlencode,unquote
import base64,hashlib,re
import posixpath
from html import escape,unescape

POLICY="default-src 'none'; script-src 'self' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; media-src 'self' blob:; connect-src 'self'; worker-src 'self'; frame-src 'self'; object-src 'none'; base-uri 'none'; form-action 'none'"

def harden_html(text,path,root):
    # Keep optional consent-based analytics on studio pages, never on text-processing desks.
    policy=POLICY
    if re.search(r'<script[^>]+src="(?:\.\./)*app\.js',text):
        policy=policy.replace("script-src 'self' 'wasm-unsafe-eval'", "script-src 'self' 'wasm-unsafe-eval' https://www.googletagmanager.com").replace("connect-src 'self'", "connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com")
    route=path.relative_to(root).as_posix()
    if route in {'pmc/index.html','pmc/account/index.html','manage/index.html','mat-cleaner/index.html'}:
        policy=policy.replace("connect-src 'self'", "connect-src 'self' https://*.supabase.co")
    if route=='mat-cleaner/index.html':
        policy=policy.replace("script-src 'self'", "script-src 'self' blob:").replace("worker-src 'self'", "worker-src 'self' blob:")
    # Every shared route uses the supplied Dailwind logo on a white card.
    # This is static HTML: crawlers do not have to run JavaScript.
    canonical=re.search(r'<link\b[^>]*rel="canonical"[^>]*href="([^"]+)"',text,re.I)
    origin='https://dailwind.com'
    if canonical:
        parsed=urlsplit(unescape(canonical[1]))
        if parsed.scheme=='https' and parsed.netloc:origin='https://'+parsed.netloc
    text=re.sub(r'<meta\b[^>]*(?:property|name)="(?:og:image(?:\:[a-z_]+)?|twitter:image(?:\:alt)?|twitter:card)"[^>]*>','',text,flags=re.I)
    preview=origin+'/assets/dailwind-share-v861.png'
    # Version every route's icons, including aliases and standalone workspaces.
    text=re.sub(r'<link\b[^>]*rel="(?:icon|shortcut icon|apple-touch-icon)"[^>]*>','',text,flags=re.I)
    prefix=posixpath.relpath('assets',posixpath.dirname(route) or '.')+'/'
    text=text.replace('</head>','<link rel="icon" type="image/png" sizes="64x64" href="'+prefix+'favicon-v861.png"><link rel="apple-touch-icon" sizes="180x180" href="'+prefix+'apple-touch-icon-v861.png"></head>',1)
    tags='<meta property="og:image" content="'+preview+'"><meta property="og:image:secure_url" content="'+preview+'"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:type" content="image/png"><meta property="og:image:alt" content="Dailwind Studio logo on a white background"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:image" content="'+preview+'"><meta name="twitter:image:alt" content="Dailwind Studio logo on a white background">'
    title=re.search(r'<title>(.*?)</title>',text,re.S|re.I)
    if title and not re.search(r'property="og:title"',text,re.I):tags+='<meta property="og:title" content="'+escape(unescape(title[1]),quote=True)+'">'
    if not re.search(r'property="og:type"',text,re.I):tags+='<meta property="og:type" content="website">'
    text=text.replace('</head>',tags+'</head>',1)
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
    text=re.sub(r'<script\b[^>]*>',script,text,flags=re.I)
    # Refresh shared layout fixes on every route, including cached nested pages.
    def stylesheet(m):
        tag=m[0]
        if not re.search(r'\brel="stylesheet"',tag,re.I):return tag
        href=re.search(r'\bhref="([^"]+)"',tag)
        if not href:return tag
        url=urlsplit(unescape(href[1]))
        if url.scheme or url.netloc:return tag
        target=(root/unquote(url.path.lstrip('/')) if url.path.startswith('/') else path.parent/unquote(url.path)).resolve()
        if not target.is_relative_to(root.resolve()) or not target.is_file():raise ValueError('Stylesheet path escapes the website or is missing: '+href[1])
        query=[(k,v) for k,v in parse_qsl(url.query) if k!='h']+[('h',hashlib.sha256(target.read_bytes()).hexdigest()[:12])]
        versioned=urlunsplit(('', '',url.path,urlencode(query),url.fragment))
        return tag[:href.start(1)]+versioned+tag[href.end(1):]
    return re.sub(r'<link\b[^>]*>',stylesheet,text,flags=re.I)

def validate_pmc_auth_config(root):
    path=Path(root)/'assets/pmc-auth-config.js'
    if not path.exists():return
    text=path.read_text()
    fields={}
    for key in ['supabaseUrl','publishableKey','researchOrigin']:
        match=re.search(r"\b"+key+r"\s*:\s*(['\"])([^'\"\n]*)\1",text)
        if not match:raise ValueError('PMC config must contain literal string fields: '+key)
        fields[key]=match[2]
    url,key=fields['supabaseUrl'],fields['publishableKey']
    if bool(url)!=bool(key):raise ValueError('Set the Supabase Project URL and publishable key together, or leave both empty.')
    if key and not re.fullmatch(r'sb_publishable_[A-Za-z0-9_-]{12,300}',key):raise ValueError('PMC browser config accepts a publishable key only. Never publish a secret or service-role key.')
    if url and not re.fullmatch(r'https://[a-z0-9-]+\.supabase\.co',url):raise ValueError('Use the hosted HTTPS Supabase Project URL without a trailing slash.')
    if fields['researchOrigin'] not in {'','https://pmc.dailwind.com'}:raise ValueError('Public PMC account handoff supports https://pmc.dailwind.com only; leave empty before deployment.')

def harden_site(root):
    root=Path(root).resolve()
    validate_pmc_auth_config(root)
    for path in root.rglob('*.html'):
        if 'publishing' in path.relative_to(root).parts:continue
        path.write_text(harden_html(path.read_text(),path,root))

def assert_safe_tree(path):
    forbidden={'.git','.github','.env','node_modules','__pycache__'}
    for p in [path,*path.rglob('*')] if path.is_dir() else [path]:
        if p.is_symlink():raise ValueError('Symlinks must never be published: '+str(p))
        if p.name in {'mat-worker-v86.js','mat-window-v86.js'}:raise ValueError('Private toolkit activation files must never be published: '+str(p))
        if (p.name.startswith('.') and p.name not in {'.well-known','.nojekyll','.gitkeep'}) or p.name in forbidden or p.name.startswith('.env.') or p.suffix.lower() in {'.pem','.key','.p12','.pfx'}:
            raise ValueError('Private/build files must never be published: '+str(p))
        if p.is_file():
            with p.open('rb') as f:head=f.read(8192)
            if re.search(rb'-----BEGIN (?:[A-Z0-9 ]* )?PRIVATE KEY-----',head):raise ValueError('Private key material must never be published: '+str(p))
