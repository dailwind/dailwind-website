"""Render publishing/apps.json into the static page apps/index.html.

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

def load(path=ROOT/'publishing/apps.json'):
    apps=json.loads(Path(path).read_text())
    for a in apps:
        for k in ('name','status','description'):
            if not isinstance(a.get(k),str) or not a[k].strip():raise ValueError('App is missing '+k+': '+repr(a))
        if a['status'] not in STATUS:raise ValueError('Unknown status: '+a['status'])
        url=a.get('playStoreUrl')
        if url and not re.fullmatch(r'https://play\.google\.com/store/apps/details\?id=[A-Za-z0-9._]+',url):raise ValueError('Invalid playStoreUrl: '+url)
        for k in ('icon','icon2x','learnMoreUrl'):
            v=a.get(k)
            if v and (v.startswith(('/','http')) or '..' in v or not (ROOT/v).exists()):raise ValueError(k+' must be an existing site path: '+v)
    return apps

def initials(name):return ''.join(w[0] for w in name.split()[:2]).upper()

def card(a):
    e=lambda s:escape(s,quote=True)
    soon=a['status']=='coming-soon'
    if a.get('icon'):
        srcset=' srcset="../'+e(a['icon'])+' 1x, ../'+e(a['icon2x'])+' 2x"' if a.get('icon2x') else ''
        icon='<img class="app-icon" src="../'+e(a['icon'])+'"'+srcset+' width="72" height="72" alt="'+e(a['name'])+' app icon" loading="lazy" decoding="async">'
    else:icon='<span class="app-icon" aria-hidden="true">'+('+' if soon else e(initials(a['name'])))+'</span>'
    badge='<span class="app-badge soon">Coming Soon</span>' if soon else '<span class="app-badge live">Live on Google Play</span>' if a.get('playStoreUrl') else '<span class="app-badge live">Live</span>'
    actions=[]
    if a.get('playStoreUrl'):
        actions.append('<a class="play-button" href="'+e(a['playStoreUrl'])+'" rel="noopener" aria-label="Get '+e(a['name'])+' on Google Play (opens Google Play)">'+PLAY_SVG+'<span><small>GET IT ON</small>Google Play</span></a>')
    elif not soon:
        actions.append('<span class="play-button" role="link" aria-disabled="true">'+PLAY_SVG+'<span><small>GOOGLE PLAY</small>Play Store link coming soon</span></span>')
    if a.get('learnMoreUrl'):actions.append('<a class="app-link" href="../'+e(a['learnMoreUrl'])+'" aria-label="Learn more about '+e(a['name'])+'">Learn more →</a>')
    act='<div class="app-actions">'+''.join(actions)+'</div>' if actions else ''
    return '<article class="app-card'+(' soon' if soon else '')+'"><div class="app-card-top">'+icon+badge+'</div><h3>'+e(a['name'])+'</h3><p>'+e(a['description'])+'</p>'+act+'</article>'

def section(num,title,items,ident):
    return '<section class="wrap apps-section" aria-labelledby="'+ident+'"><header><span>'+num+'</span><h2 id="'+ident+'">'+title+'</h2></header><div class="app-grid">'+''.join(card(a) for a in items)+'</div></section>'

def render(apps,shell):
    head_end=shell.index('</head>');head=shell[:head_end]
    head=re.sub(r'<title>.*?</title>','<title>'+escape(TITLE)+'</title>',head,flags=re.S)
    head=re.sub(r'(<meta name="description" content=")[^"]*',lambda m:m[1]+escape(DESC,quote=True),head)
    head=re.sub(r'(<meta property="og:title" content=")[^"]*',lambda m:m[1]+escape(TITLE,quote=True),head)
    head=re.sub(r'(<meta property="og:description" content=")[^"]*',lambda m:m[1]+escape(DESC,quote=True),head)
    head=head.replace('https://dailwind.com/toolkits/','https://dailwind.com/apps/')
    # Drop toolkit-finder scripts and styles; keep shared site assets.
    head=re.sub(r'<script[^>]*src="\.\./assets/(toolkit-catalog|toolkit-finder|workspace-guide|toolkit-icon-motion|toolkit-enhance)\.js[^"]*"[^>]*></script>','',head)
    head=re.sub(r'<link rel="stylesheet" href="\.\./assets/workspace-guide\.css[^"]*">','',head)
    head+='<link rel="stylesheet" href="../assets/apps.css">'
    body_start=shell.index('<body>');main_start=shell.index('<main id="main">');main_end=shell.index('</main>')+7
    header=shell[body_start:main_start].replace(' aria-current="page"','').replace('<a href="../apps/" >','<a href="../apps/" aria-current="page">')
    if 'aria-current="page"' not in header:raise ValueError('Navigation is missing the Apps link.')
    live=[a for a in apps if a['status']=='live'];soon=[a for a in apps if a['status']=='coming-soon']
    main='<main id="main"><section class="wrap apps-hero"><p class="eyebrow">DAILWIND APPS / ANDROID</p><h1>Dailwind App Store</h1><p class="lede">Apps by Arslan Tahir and Dailwind Studio.<br>Available now on Google Play, with more on the way.</p></section>'
    n=1
    if live:main+=section('0'+str(n),'Available now',live,'apps-live');n+=1
    if soon:main+=section('0'+str(n),'Coming soon',soon,'apps-soon')
    main+='</main>'
    return head+'</head>'+header+main+shell[main_end:]

def build():
    page=render(load(),(ROOT/'toolkits/index.html').read_text())
    out=ROOT/'apps/index.html';out.parent.mkdir(exist_ok=True)
    return page,out

if __name__=='__main__':
    page,out=build()
    if '--check' in sys.argv:
        if not out.exists() or out.read_text()!=page:sys.exit('apps/index.html is out of date; run python3 publishing/build_apps.py')
        print('apps/index.html is up to date.')
    else:out.write_text(page);print('Wrote',out.relative_to(ROOT))
