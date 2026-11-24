"""Render publishing/apps.json into static pages: apps/index.html and, for apps
with a "slug", a detail page apps/<slug>/index.html.

The page shell (head, header, footer) is copied from toolkits/index.html so the
logo lockup and navigation stay identical. See publishing/APPS-README.md.
"""
from pathlib import Path
from html import escape
import json,re,sys
ROOT=Path(__file__).resolve().parent.parent
TITLE='Dailwind App Store | Android Apps by Dailwind App Studio'
DESC='Browse Android apps from Dailwind App Studio, including Owl Files Saver, LinguaX Arc and MedQuiz.'
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
        pv=a.get('privacy')
        if pv is not None:
            if not a.get('slug'):raise ValueError('privacy needs a slug: '+a['name'])
            if not (isinstance(pv,dict) and isinstance(pv.get('effective'),str) and isinstance(pv.get('sections'),list) and pv['sections']):raise ValueError('privacy needs effective and sections: '+a['name'])
        for x in a.get('screenshots',[]):
            if not (isinstance(x,dict) and (ROOT/x.get('src','')).exists() and x.get('alt')):raise ValueError('Bad screenshot: '+repr(x))
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

def detail_url(a):
    # Own detail page: generated /apps/<slug>/ first, else learnMoreUrl; none for apps without either.
    if a.get('slug'):return e(a['slug'])+'/'
    if a.get('learnMoreUrl'):return '../'+e(a['learnMoreUrl'])
    return ''

def card(a):
    soon=a['status']=='coming-soon'
    actions=[play(a)]
    links=[]
    if a.get('learnMoreUrl'):links.append('<a class="app-link" href="../'+e(a['learnMoreUrl'])+'" aria-label="Learn more about '+e(a['name'])+'">Learn more <span aria-hidden="true">›</span></a>')
    if a.get('privacy'):links.append('<a class="app-link app-privacy-link" href="'+e(a['slug'])+'/privacy/" aria-label="'+e(a['name'])+' privacy policy">Privacy Policy</a>')
    if links:actions.append('<span class="app-links">'+''.join(links)+'</span>')
    actions=[x for x in actions if x]
    act='<div class="app-actions">'+''.join(actions)+'</div>' if actions else ''
    sub='<p class="app-category">'+e(a['category'])+'</p>' if a.get('category') else ''
    url=detail_url(a)
    icon=icon_html(a,'../');name=e(a['name'])
    if url:
        # Icon link duplicates the name link, so keep it out of the tab order and accessibility tree.
        icon='<a class="app-icon-link" href="'+url+'" tabindex="-1" aria-hidden="true" aria-label="'+e(a['name'])+' details">'+icon+'</a>'
        name='<a class="app-name-link" href="'+url+'">'+name+'</a>'
    return ('<article class="app-card'+(' soon' if soon else '')+'"><div class="app-card-head">'+icon+'<div class="app-title"><h3 class="app-name">'+name+'</h3>'+sub+badge(a)+'</div></div>'
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
    # Toolkits-only extras (icon motion styles, Recommended-by dialog) do not belong on app pages.
    head=re.sub(r'<script[^>]*src="\.\./assets/credits-3d\.js[^"]*"[^>]*></script>','',head)
    head=re.sub(r'<link rel="stylesheet" href="\.\./assets/(academic-review|credits-3d)\.css[^"]*">','',head)
    head+='<link rel="stylesheet" href="../assets/apps.css?v=3"><script src="../assets/apps-motion.js?v=2" defer></script>'
    header='<body class="apps-body">'+shell[re.search(r'<body[^>]*>',shell).end():re.search(r'<main id="main"[^>]*>',shell).start()].replace(' aria-current="page"','').replace('<a href="../apps/" >','<a href="../apps/" aria-current="page">')
    if 'aria-current="page"' not in header:raise ValueError('Navigation is missing the Apps link.')
    footer=shell[shell.index('</main>')+7:]
    footer=re.sub(r'<dialog id="credits-dialog".*?</dialog>','',footer,flags=re.S)
    if up!='../':
        fix=lambda s:s.replace('="../','="'+up)
        head,header,footer=fix(head),fix(header),fix(footer)
    return head+'</head>',header,footer

def render(apps,shell):
    head,header,footer=shell_parts(shell,TITLE,DESC,'https://dailwind.com/apps/','../')
    live=[a for a in apps if a['status']=='live'];soon=[a for a in apps if a['status']=='coming-soon']
    main='<main id="main" class="apps-page"><section class="wrap apps-hero"><p class="eyebrow">DAILWIND APPS / ANDROID</p><h1>Dailwind App Store</h1><p class="lede">Apps by Arslan Tahir and Dailwind App Studio.<br>Available now on Google Play, with more on the way.</p></section>'
    n=1
    if live:main+=section('0'+str(n),'Available now',live,'apps-live');n+=1
    if soon:main+=section('0'+str(n),'Coming soon',soon,'apps-soon')
    return head+header+main+'</main>'+footer

def video(a,up):
    v=a.get('video')
    if not v:return ''
    return ('<figure class="app-video"><video data-app-video src="'+up+e(v['src'])+'" poster="'+up+e(v['poster'])+'" width="'+str(v['width'])+'" height="'+str(v['height'])+'" muted loop playsinline preload="none" aria-label="'+e(v['label'])+'"></video></figure>')

def screenshots(a,up):
    shots=a.get('screenshots') or []
    if not shots:return ''
    items=''.join('<li><a href="'+up+e(x['src'])+'" class="app-shot" aria-label="Open screenshot: '+e(x['alt'])+'"><img src="'+up+e(x['src'])+'" width="'+str(x['width'])+'" height="'+str(x['height'])+'" alt="'+e(x['alt'])+'" loading="lazy" decoding="async"></a></li>' for x in shots)
    return '<section class="app-shots" aria-label="'+e(a['name'])+' screenshots"><h2>Screenshots</h2><ul class="app-shot-track">'+items+'</ul></section>'

def render_detail(a,shell):
    title=a['name']+' for Android | Dailwind App Store';desc=a['description']
    head,header,footer=shell_parts(shell,title,desc,'https://dailwind.com/apps/'+a['slug']+'/','../../')
    body=''.join('<p>'+e(p)+'</p>' for p in a.get('details',[]))
    feats='<h2>Features</h2><ul class="app-features">'+''.join('<li>'+e(f)+'</li>' for f in a['features'])+'</ul>' if a.get('features') else ''
    main=('<main id="main" class="apps-page"><section class="wrap app-detail"><p class="eyebrow"><a class="app-link" href="../">← Back to Apps</a></p>'
          '<article class="app-card app-detail-card"><div class="app-detail-head">'+icon_html(a,'../../',96,False)+'<div><h1 class="app-name">'+e(a['name'])+'</h1>'+('<p class="app-category">'+e(a['category'])+'</p>' if a.get('category') else '')+badge(a)+'</div></div>'
          '<p class="lede app-desc">'+e(a['description'])+'</p>'+video(a,'../../')+screenshots(a,'../../')+body+feats+'<div class="app-actions">'+play(a)+'<span class="app-links">'+('<a class="app-link" href="privacy/">Privacy Policy</a>' if a.get('privacy') else '')+'<a class="app-link" href="../">Back to Apps</a></span></div></article></section></main>')
    return head+header+main+footer

def linkify(text):
    out=e(text)
    out=re.sub(r'https://[A-Za-z0-9./_-]+[A-Za-z0-9/]',lambda m:'<a href="'+m[0]+'" rel="noopener">'+m[0]+'</a>',out)
    out=re.sub(r'[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}',lambda m:'<a href="mailto:'+m[0]+'">'+m[0]+'</a>',out)
    return out

def render_privacy(a,shell):
    pv=a['privacy'];title='Privacy Policy for '+a['name']+' | Dailwind App Store'
    desc='Privacy Policy for '+a['name']+' by Dailwind App Studio: what the app stores on your device, the permissions it uses and how to contact us.'
    head,header,footer=shell_parts(shell,title,desc,'https://dailwind.com/apps/'+a['slug']+'/privacy/','../../../')
    facts=''.join('<div><dt>'+e(k)+'</dt><dd>'+linkify(v)+'</dd></div>' for k,v in pv.get('facts',[]))
    emails=[x for k,v in pv.get('facts',[]) if 'mail' in k.lower() for x in re.findall(r'[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}',v)]
    sites=[v for k,v in pv.get('facts',[]) if k.lower()=='website']
    body=''
    for sec in pv['sections']:
        body+='<section><h2>'+e(sec['h'])+'</h2>'+''.join('<p>'+linkify(x)+'</p>' for x in sec.get('p',[]))
        if sec.get('ul'):body+='<ul>'+''.join('<li>'+linkify(x)+'</li>' for x in sec['ul'])+'</ul>'
        body+=''.join('<p>'+linkify(x)+'</p>' for x in sec.get('after',[]))
        if sec.get('contact'):
            body+='<ul class="app-policy-contact">'+''.join('<li>Email: <a href="mailto:'+e(m)+'">'+e(m)+'</a></li>' for m in emails)+''.join('<li>Website: '+linkify(w)+'</li>' for w in sites)+'</ul>'
        body+='</section>'
    main=('<main id="main" class="apps-page"><section class="wrap app-detail app-policy"><p class="eyebrow"><a class="app-link" href="../">← Back to '+e(a['name'])+'</a></p>'
          '<article class="app-card app-detail-card"><div class="app-detail-head">'+icon_html(a,'../../../',72,False)+'<div><p class="app-category">'+e(a['name'])+' · Privacy</p><h1 class="app-name">Privacy Policy for '+e(a['name'])+'</h1>'
          '<p class="app-policy-date">Effective Date: '+e(pv['effective'])+'</p></div></div>'+('<dl class="app-policy-facts">'+facts+'</dl>' if facts else '')+body+
          '<div class="app-actions"><span class="app-links"><a class="app-link" href="../">About '+e(a['name'])+'</a><a class="app-link" href="../../">All apps</a></span></div></article></section></main>')
    return head+header+main+footer

ORBIT_START='<!-- app-orbit:start -->';ORBIT_END='<!-- app-orbit:end -->'

def render_orbit(apps):
    """Home page showcase: every app with an icon circles the Dailwind mark."""
    shown=[a for a in apps if a.get('icon')]
    icons='';cards=''
    for i,a in enumerate(shown):
        src=e(a.get('icon2x') or a['icon']);acc=e(a.get('accent','#0071e3'))
        icons+=('<li><button class="orbit-app" type="button" data-orbit-i="'+str(i)+'" style="--accent:'+acc+'" aria-label="'+e(a['name'])+'" aria-controls="orbit-card-'+str(i)+'">'
                '<img src="'+src+'" width="112" height="112" alt="" decoding="async"></button></li>')
        soon=a['status']=='coming-soon'
        badge='<span class="orbit-badge'+(' soon' if soon else '')+'">'+('Coming soon' if soon else 'On Google Play')+'</span>'
        more=('<a class="button outline" href="'+e(a['learnMoreUrl'])+'">Learn more</a>' if a.get('learnMoreUrl') else '')
        get=('<a class="button" href="'+e(a['playStoreUrl'])+'" rel="noopener">Get it on Google Play</a>' if a.get('playStoreUrl') else '')
        cards+=('<article class="orbit-info" id="orbit-card-'+str(i)+'" data-orbit-card="'+str(i)+'" style="--accent:'+acc+'"'+('' if i==0 else ' hidden')+'>'
                '<img class="orbit-info-icon" src="'+e(a['icon'])+'" width="56" height="56" alt="" loading="lazy" decoding="async">'
                '<div class="orbit-info-text"><p class="orbit-info-cat">'+e(a.get('category',''))+' '+badge+'</p><h3>'+e(a['name'])+'</h3>'
                '<p class="orbit-info-tag">'+e(a.get('tagline') or a['description'])+'</p></div>'
                '<div class="orbit-info-actions">'+get+more+'</div></article>')
    return (ORBIT_START+'<section class="app-orbit" aria-labelledby="orbit-title" data-app-orbit>'
            '<div class="orbit-copy"><p class="product-overline">DAILWIND APP STUDIO · ANDROID</p><h2 id="orbit-title">Our apps, in orbit.</h2>'
            '<p class="banner-tagline">Private, offline apps for study and research.</p></div>'
            '<div class="orbit-stage"><canvas class="orbit-trails" aria-hidden="true"></canvas><span class="orbit-ring" aria-hidden="true"></span><span class="orbit-ring two" aria-hidden="true"></span>'
            '<div class="orbit-sun orbit-logo" aria-hidden="true"><img src="assets/dailwind-wordmark-v1.webp" width="640" height="148" alt="" decoding="async"></div>'
            '<ul class="orbit-apps" aria-label="Dailwind apps">'+icons+'</ul></div>'
            '<div class="orbit-cards">'+cards+'</div>'
            '<p class="orbit-all"><a class="underlink" href="apps/">See all apps in the Dailwind App Store <span aria-hidden="true">›</span></a></p>'
            '</section>'+ORBIT_END)

def home_with_orbit(apps):
    home=(ROOT/'index.html').read_text()
    block=render_orbit(apps)
    if ORBIT_START in home:
        a=home.index(ORBIT_START);b=home.index(ORBIT_END)+len(ORBIT_END)
        return home[:a]+block+home[b:]
    anchor='<section class="product-banner first-product">'
    if anchor not in home:raise ValueError('Home page anchor for the app showcase is missing.')
    return home.replace(anchor,block+' '+anchor,1)

def build():
    apps=load();shell=(ROOT/'toolkits/index.html').read_text()
    pages={ROOT/'apps/index.html':render(apps,shell),ROOT/'index.html':home_with_orbit(apps)}
    for a in apps:
        if a.get('slug'):pages[ROOT/'apps'/a['slug']/'index.html']=render_detail(a,shell)
        if a.get('privacy'):pages[ROOT/'apps'/a['slug']/'privacy'/'index.html']=render_privacy(a,shell)
    return pages

if __name__=='__main__':
    pages=build()
    if '--check' in sys.argv:
        stale=[str(p.relative_to(ROOT)) for p,t in pages.items() if not p.exists() or p.read_text()!=t]
        if stale:sys.exit('Out of date: '+', '.join(stale)+'; run python3 publishing/build_apps.py')
        print('App pages are up to date.')
    else:
        for p,t in pages.items():p.parent.mkdir(parents=True,exist_ok=True);p.write_text(t);print('Wrote',p.relative_to(ROOT))
