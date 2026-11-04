"""Render publishing/apps.json into static pages: apps/index.html and, for apps
with a "slug", a detail page apps/<slug>/index.html.

The page shell (head, header, footer) is copied from toolkits/index.html so the
logo lockup and navigation stay identical. See publishing/APPS-README.md.
"""
from pathlib import Path
from html import escape
import json,re,sys
ROOT=Path(__file__).resolve().parent.parent
TITLE='Dailwind App Store | Android Apps by Dailwind Studio'
DESC='Browse Android apps from Dailwind Studio, including Owl File Saver and LinguaX Arc, plus apps coming soon.'
PLAY_SVG='<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false"><path fill="currentColor" d="M4 2.8v18.4c0 .5.5.8.9.6L20.6 12.6c.5-.3.5-.9 0-1.2L4.9 2.2c-.4-.2-.9.1-.9.6Z"/></svg>'
STATUS={'live','coming-soon'}
e=lambda s:escape(s,quote=True)

def load(path=ROOT/'publishing/apps.json'):
    apps=json.loads(Path(path).read_text())
    for a in apps:
        for k in ('name','status','description'):
            if not isinstance(a.get(k),str) or not a[k].strip():raise ValueError('App is missing '+k+': '+repr(a))
        if a['status'] not in STATUS:raise ValueError('Unknown status: '+a['status'])
        if a.get('slug') and not re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*',a['slug']):raise ValueError('Invalid slug: '+a['slug'])
        url=a.get('playStoreUrl')
        if url and not re.fullmatch(r'https://play\.google\.com/store/apps/details\?id=[A-Za-z0-9._]+',url):raise ValueError('Invalid playStoreUrl: '+url)
        for k in ('icon','icon2x','learnMoreUrl'):
            v=a.get(k)
            if k=='learnMoreUrl' and a.get('slug') and v=='apps/'+a['slug']+'/':continue
            if v and (v.startswith(('/','http')) or '..' in v or not (ROOT/v).exists()):raise ValueError(k+' must be an existing site path: '+v)
        for k in ('details','features'):
            if k in a and not (isinstance(a[k],list) and all(isinstance(x,str) for x in a[k])):raise ValueError(k+' must be a list of strings')
    return apps

def initials(name):return ''.join(w[0] for w in name.split()[:2]).upper()

def icon_html(a,up,size=72,lazy=True):
    soon=a['status']=='coming-soon'
    if a.get('icon'):
        srcset=' srcset="'+up+e(a['icon'])+' 1x, '+up+e(a['icon2x'])+' 2x"' if a.get('icon2x') else ''
        return '<img class="app-icon" src="'+up+e(a['icon'])+'"'+srcset+' width="'+str(size)+'" height="'+str(size)+'" alt="'+e(a['name'])+' app icon"'+(' loading="lazy"' if lazy else '')+' decoding="async">'
    return '<span class="app-icon" aria-hidden="true">'+('+' if soon else e(initials(a['name'])))+'</span>'

def badge(a):
    if a['status']=='coming-soon':return '<span class="app-badge soon">Coming Soon</span>'
    return '<span class="app-badge live"><span class="app-dot" aria-hidden="true"></span>'+('Live on Google Play' if a.get('playStoreUrl') else 'Live')+'</span>'

def play(a):
    if a.get('playStoreUrl'):
        return '<a class="play-button" href="'+e(a['playStoreUrl'])+'" rel="noopener" aria-label="Get '+e(a['name'])+' on Google Play (opens Google Play)">'+PLAY_SVG+'<span><small>GET IT ON</small>Google Play</span></a>'
    if a['status']=='live':return '<span class="play-button" role="link" aria-disabled="true">'+PLAY_SVG+'<span><small>GOOGLE PLAY</small>Play Store link coming soon</span></span>'
    return ''

def card(a):
    soon=a['status']=='coming-soon'
    actions=[play(a)]
    if a.get('learnMoreUrl'):actions.append('<a class="app-link" href="../'+e(a['learnMoreUrl'])+'" aria-label="Learn more about '+e(a['name'])+'">Learn more <span aria-hidden="true">›</span></a>')
    actions=[x for x in actions if x]
    act='<div class="app-actions">'+''.join(actions)+'</div>' if actions else ''
    sub='<p class="app-category">'+e(a['category'])+'</p>' if a.get('category') else ''
    return ('<article class="app-card'+(' soon' if soon else '')+'"><div class="app-card-head">'+icon_html(a,'../')+'<div class="app-title"><h3 class="app-name">'+e(a['name'])+'</h3>'+sub+badge(a)+'</div></div>'
            '<p class="app-desc">'+e(a['description'])+'</p>'+act+'</article>')

def section(num,title,items,ident):
    return '<section class="wrap apps-section" aria-labelledby="'+ident+'"><header><span>'+num+'</span><h2 id="'+ident+'">'+title+'</h2></header><div class="app-grid">'+''.join(card(a) for a in items)+'</div></section>'

def shell_parts(shell,title,desc,url,up):
    head=shell[:shell.index('</head>')]
    head=re.sub(r'<title>.*?</title>','<title>'+escape(title)+'</title>',head,flags=re.S)
    for pat in (r'(<meta name="description" content=")[^"]*',r'(<meta property="og:description" content=")[^"]*'):head=re.sub(pat,lambda m:m[1]+e(desc),head)
    head=re.sub(r'(<meta property="og:title" content=")[^"]*',lambda m:m[1]+e(title),head)
    head=head.replace('https://dailwind.com/toolkits/',url)
    # Drop toolkit-finder scripts and styles; keep shared site assets.
    head=re.sub(r'<script[^>]*src="\.\./assets/(toolkit-catalog|toolkit-finder|workspace-guide|toolkit-icon-motion|toolkit-enhance)\.js[^"]*"[^>]*></script>','',head)
    head=re.sub(r'<link rel="stylesheet" href="\.\./assets/workspace-guide\.css[^"]*">','',head)
    head+='<link rel="stylesheet" href="../assets/apps.css?v=2"><script src="../assets/apps-motion.js?v=2" defer></script>'
    header='<body class="apps-body">'+shell[shell.index('<body>')+6:shell.index('<main id="main">')].replace(' aria-current="page"','').replace('<a href="../apps/" >','<a href="../apps/" aria-current="page">')
    if 'aria-current="page"' not in header:raise ValueError('Navigation is missing the Apps link.')
    footer=shell[shell.index('</main>')+7:]
    if up!='../':
        fix=lambda s:s.replace('="../','="'+up)
        head,header,footer=fix(head),fix(header),fix(footer)
    return head+'</head>',header,footer

def render(apps,shell):
    head,header,footer=shell_parts(shell,TITLE,DESC,'https://dailwind.com/apps/','../')
    live=[a for a in apps if a['status']=='live'];soon=[a for a in apps if a['status']=='coming-soon']
    main='<main id="main" class="apps-page"><section class="wrap apps-hero"><p class="eyebrow">DAILWIND APPS / ANDROID</p><h1>Dailwind App Store</h1><p class="lede">Apps by Arslan Tahir and Dailwind Studio.<br>Available now on Google Play, with more on the way.</p></section>'
    n=1
    if live:main+=section('0'+str(n),'Available now',live,'apps-live');n+=1
    if soon:main+=section('0'+str(n),'Coming soon',soon,'apps-soon')
    return head+header+main+'</main>'+footer

def video(a,up):
    v=a.get('video')
    if not v:return ''
    return ('<figure class="app-video"><video data-app-video src="'+up+e(v['src'])+'" poster="'+up+e(v['poster'])+'" width="'+str(v['width'])+'" height="'+str(v['height'])+'" muted loop playsinline preload="none" aria-label="'+e(v['label'])+'"></video></figure>')

def render_detail(a,shell):
    title=a['name']+' for Android | Dailwind App Store';desc=a['description']
    head,header,footer=shell_parts(shell,title,desc,'https://dailwind.com/apps/'+a['slug']+'/','../../')
    body=''.join('<p>'+e(p)+'</p>' for p in a.get('details',[]))
    feats='<h2>Features</h2><ul class="app-features">'+''.join('<li>'+e(f)+'</li>' for f in a['features'])+'</ul>' if a.get('features') else ''
    main=('<main id="main" class="apps-page"><section class="wrap app-detail"><p class="eyebrow"><a class="app-link" href="../">← Back to Apps</a></p>'
          '<article class="app-card app-detail-card"><div class="app-detail-head">'+icon_html(a,'../../',96,False)+'<div><h1 class="app-name">'+e(a['name'])+'</h1>'+('<p class="app-category">'+e(a['category'])+'</p>' if a.get('category') else '')+badge(a)+'</div></div>'
          '<p class="lede app-desc">'+e(a['description'])+'</p>'+video(a,'../../')+body+feats+'<div class="app-actions">'+play(a)+'<a class="app-link" href="../">Back to Apps</a></div></article></section></main>')
    return head+header+main+footer

def build():
    apps=load();shell=(ROOT/'toolkits/index.html').read_text()
    pages={ROOT/'apps/index.html':render(apps,shell)}
    for a in apps:
        if a.get('slug'):pages[ROOT/'apps'/a['slug']/'index.html']=render_detail(a,shell)
    return pages

if __name__=='__main__':
    pages=build()
    if '--check' in sys.argv:
        stale=[str(p.relative_to(ROOT)) for p,t in pages.items() if not p.exists() or p.read_text()!=t]
        if stale:sys.exit('Out of date: '+', '.join(stale)+'; run python3 publishing/build_apps.py')
        print('App pages are up to date.')
    else:
        for p,t in pages.items():p.parent.mkdir(parents=True,exist_ok=True);p.write_text(t);print('Wrote',p.relative_to(ROOT))
