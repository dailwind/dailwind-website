"""Static-page safeguards shared by local builds and GitHub Pages staging."""
from pathlib import Path
from urllib.parse import urlsplit,urlunsplit,parse_qsl,urlencode,unquote
import base64,hashlib,re
import posixpath
from social import prepare_social
from discovery import apply_discovery
from html import escape,unescape

POLICY="default-src 'none'; script-src 'self' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; media-src 'self' blob:; connect-src 'self'; worker-src 'self'; frame-src 'self'; object-src 'none'; base-uri 'none'; form-action 'none'; upgrade-insecure-requests"

def harden_html(text,path,root,social=None):
    # Keep optional consent-based analytics on studio pages, never on text-processing desks.
    policy=POLICY
    if re.search(r'<script[^>]+src="(?:\.\./)*app\.js',text):
        policy=policy.replace("script-src 'self' 'wasm-unsafe-eval'", "script-src 'self' 'wasm-unsafe-eval' https://www.googletagmanager.com").replace("connect-src 'self'", "connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com")
    route=path.relative_to(root).as_posix()
    if route in {'pmc/index.html','pmc/account/index.html','manage/index.html','mat-cleaner/index.html'}:
        policy=policy.replace("connect-src 'self'", "connect-src 'self' https://kotxgvwbffengeuvaoca.supabase.co")
    if route=='mat-cleaner/index.html':
        policy=policy.replace("script-src 'self'", "script-src 'self' blob:").replace("worker-src 'self'", "worker-src 'self' blob:")
    hashes=['\'sha256-'+base64.b64encode(hashlib.sha256(code.encode()).digest()).decode()+'\'' for code in re.findall(r'<script[^>]*type="application/ld\+json"[^>]*>(.*?)</script>',text,re.S)]
    if hashes:policy=policy.replace("script-src 'self'","script-src 'self' "+' '.join(hashes))
    # Keep the supplied studio mark consistent in headers, footers and launchers.
    # Keep the supplied studio mark consistent in headers, footers and launchers.
    text=text.replace('dailwind-logo-v861.webp','dailwind-logo-v871.webp').replace('dailwind-logo-v866.webp','dailwind-logo-v871.webp')
    # Every shared route uses the supplied Dailwind logo on a white card.
    # This is static HTML: crawlers do not have to run JavaScript.
    canonical=re.search(r'<link\b[^>]*rel="canonical"[^>]*href="([^"]+)"',text,re.I)
    origin='https://dailwind.com'
    if canonical:
        parsed=urlsplit(unescape(canonical[1]))
        if parsed.scheme=='https' and parsed.netloc:origin='https://'+parsed.netloc
    text=re.sub(r'<meta\b[^>]*(?:property|name)="(?:og:[a-z_:]+|twitter:[a-z_:]+)"[^>]*>','',text,flags=re.I)
    preview=social['image'] if social else origin+'/assets/dailwind-share-v866.png'
    text=re.sub(r'<link\b[^>]*rel="(?:icon|shortcut icon|apple-touch-icon)"[^>]*>','',text,flags=re.I)
    prefix=posixpath.relpath('assets',posixpath.dirname(route) or '.')+'/'
    # Preload the self-hosted logo font so the Variant 1 lockup renders in its final face from the first frame.
    if 'brand-v1' in text:text=text.replace('</head>',''.join('<link rel="preload" href="'+prefix+'fonts/dailwind-logo-'+w+'.woff2" as="font" type="font/woff2" crossorigin>' for w in ('800','400'))+'</head>',1)
    text=text.replace('</head>','<link rel="icon" type="image/png" sizes="64x64" href="'+prefix+'favicon-v876.png"><link rel="apple-touch-icon" sizes="180x180" href="'+prefix+'apple-touch-icon-v876.png"></head>',1)
    fields={'og:image':preview,'og:image:secure_url':preview,'og:image:width':'1200','og:image:height':'630','og:image:type':'image/png','og:image:alt':'Dailwind App Studio logo'+(' and '+social['title'] if social and social['title']!='Dailwind Studio' else '')+' on a white background','og:site_name':'Dailwind Studio','og:type':social['type'] if social else 'website'}
    if social:fields.update({'og:title':social['title'],'og:description':social['description'],'og:url':social['url']})
    tags=''.join('<meta property="'+key+'" content="'+escape(value,quote=True)+'">' for key,value in fields.items())
    twitter={'card':'summary_large_image','image':preview,'image:alt':fields['og:image:alt']}
    if social:twitter.update({'title':social['title'],'description':social['description']})
    tags+=''.join('<meta name="twitter:'+key+'" content="'+escape(value,quote=True)+'">' for key,value in twitter.items())
    text=text.replace('</head>',tags+'</head>',1)
    # A tiny synchronous bridge handles legacy email links returning to Home.
    text=re.sub(r'<script\b[^>]*data-auth-return[^>]*></script>','',text,flags=re.I)
    bridge=posixpath.relpath('assets/auth-return.js',posixpath.dirname(route) or '.')
    text=re.sub(r'<script\b[^>]*data-frame-guard[^>]*></script>','',text,flags=re.I)
    guard=posixpath.relpath('assets/frame-guard.js',posixpath.dirname(route) or '.')
    text=text.replace('<head>','<head><script data-frame-guard src="'+guard+'"></script><script data-auth-return src="'+bridge+'"></script>',1)
    # Themed select popover for touch and narrow screens; desktop keeps the native control.
    text=re.sub(r'<script\b[^>]*data-dailwind-select[^>]*></script>','',text,flags=re.I)
    picker=posixpath.relpath('assets/mobile-select.js',posixpath.dirname(route) or '.')
    if re.search(r'<select\b',text,flags=re.I) or re.search(r'<script\b[^>]*\bsrc=',text,flags=re.I):
        text=text.replace('</head>','<script data-dailwind-select defer src="'+picker+'"></script></head>',1)
    text=re.sub(r'<meta\b[^>]*http-equiv=["\']Content-Security-Policy["\'][^>]*>','',text,flags=re.I)
    text=re.sub(r'<meta\b[^>]*name=["\']referrer["\'][^>]*>','',text,flags=re.I)
    text=re.sub(r'<head\b[^>]*>',lambda m:m[0]+'<meta http-equiv="Content-Security-Policy" content="'+policy+'"><meta name="referrer" content="strict-origin-when-cross-origin">',text,count=1,flags=re.I)
    # The character encoding must be the first element in <head>.
    text=re.sub(r'<meta\b[^>]*\bcharset=["\']?[\w-]+["\']?[^>]*>','',text,flags=re.I)
    text=re.sub(r'<head\b[^>]*>',lambda m:m[0]+'<meta charset="utf-8">',text,count=1,flags=re.I)
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
    # One shared control theme across studio pages and standalone toolkits.
    # Keep it last so existing per-tool styles do not push arrows to the edge.
    text=re.sub(r'<link\b[^>]*\bdata-dailwind-controls(?:="[^"]*")?[^>]*>','',text,flags=re.I)
    controls=posixpath.relpath('assets/form-controls.css',posixpath.dirname(route) or '.')
    text=text.replace('</head>','<link rel="stylesheet" data-dailwind-controls href="'+controls+'"></head>',1)
    tool_routes={'corpus-toolkit','stylistic-toolkit','corpus-cleaner','mat-cleaner','corpus-merger','file-converter','english-ocr','pdf-tools','image-tools','metadata-studio','lexical-metrics','morphology-explorer','syntax-explorer','sentiment-studio','register-profile','forensic-compare','readability-studio','stylometry-lab','parallel-aligner','qualitative-coder'}
    tool=route.split('/')[0]
    if tool in tool_routes and route==tool+'/index.html':
        def workspace_body(m):
            tag=m[0]
            tag=re.sub(r'\s+data-dailwind-tool="[^"]*"','',tag)
            classes=re.search(r'\bclass="([^"]*)"',tag)
            if classes:
                names=classes[1].split()
                if 'dailwind-workspace' not in names:names.append('dailwind-workspace')
                tag=tag[:classes.start(1)]+' '.join(names)+tag[classes.end(1):]
            else:tag=tag[:-1]+' class="dailwind-workspace">'
            return tag[:-1]+' data-dailwind-tool="'+tool+'">'
        text=re.sub(r'<body\b[^>]*>',workspace_body,text,count=1,flags=re.I)
        text=re.sub(r'<link\b[^>]*\bdata-dailwind-workspace(?:="[^"]*")?[^>]*>','',text,flags=re.I)
        theme=posixpath.relpath('assets/research-workspace.css',posixpath.dirname(route) or '.')
        text=text.replace('</head>','<link rel="stylesheet" data-dailwind-workspace href="'+theme+'"></head>',1)
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
    apply_discovery(root)
    social=prepare_social(root)
    for path in root.rglob('*.html'):
        if 'publishing' in path.relative_to(root).parts:continue
        path.write_text(harden_html(path.read_text(),path,root,social.get(path.relative_to(root).as_posix())))

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
