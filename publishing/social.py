"""Build static, page-specific share cards. No visitor data is used."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit
import hashlib, re
from PIL import Image, ImageDraw, ImageFont

class Metadata(HTMLParser):
    def __init__(self):
        super().__init__(); self.title=''; self.description=''; self.canonical=''; self.in_title=False
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if tag=='title': self.in_title=True
        if tag=='meta' and a.get('name')=='description': self.description=a.get('content','')
        if tag=='link' and a.get('rel')=='canonical': self.canonical=a.get('href','')
    def handle_endtag(self, tag):
        if tag=='title': self.in_title=False
    def handle_data(self, data):
        if self.in_title: self.title+=data

def page_metadata(text, route):
    p=Metadata(); p.feed(text)
    title=re.sub(r'\s*[—–|]\s*Dailwind Studio\s*$','',p.title).strip() or 'Dailwind Studio'
    if route=='index.html': title='Dailwind Studio'
    names={'pmc/index.html':'Pakistan Medical Corpus (PMC)','corpus-toolkit/index.html':'Dailwind Corpus Toolkit','stylistic-toolkit/index.html':'Dailwind Stylistic Toolkit','mat-cleaner/index.html':'MAT Tagger Cleaner','english-ocr/index.html':'Dailwind English OCR','metadata-studio/index.html':'Dailwind Metadata Studio','pdf-tools/index.html':'Dailwind PDF Tools','image-tools/index.html':'Dailwind Image Studio'}
    title=names.get(route,title)
    description=p.description.strip() or 'Research tools, writing and software from Dailwind Studio.'
    return {'title':title,'description':description,'url':p.canonical or 'https://dailwind.com/'+route,
            'type':'article' if route.startswith('articles/read/') else 'website'}

def font(size, bold=False):
    name='DejaVuSans'+('-Bold' if bold else '')+'.ttf'
    return ImageFont.truetype(str(Path('/usr/share/fonts/truetype/dejavu')/name),size)

def wrap(draw, text, f, width):
    lines=[]; current=''
    for word in text.split():
        trial=(current+' '+word).strip()
        if current and draw.textlength(trial,font=f)>width: lines.append(current); current=word
        else: current=trial
    return lines+([current] if current else [])

def wordmark(draw, x, y, size):
    """Text logo: bold DAILWIND, regular STUDIO, tracked, with a blue accent dot."""
    track=size*0.08
    for word,bold in (('DAILWIND',True),(' STUDIO',False)):
        f=font(size,bold)
        for ch in word:
            draw.text((x,y),ch,font=f,fill='#1d1d1f'); x+=draw.textlength(ch,font=f)+track
    r=size*0.12; cy=y+size*0.8
    draw.ellipse((x+size*0.05,cy-r,x+size*0.05+2*r,cy+r),fill='#0066cc')

def card(path, logo, meta):
    image=Image.new('RGB',(1200,630),'white'); draw=ImageDraw.Draw(image)
    wordmark(draw,80,78,30)
    draw.line((80,169,1120,169),fill='#e5e5ea',width=2)
    size=57
    while size>30:
        f=font(size,True); lines=wrap(draw,meta['title'],f,1040)
        if len(lines)<=3 and all(draw.textlength(line,font=f)<=1040 for line in lines): break
        size-=1
    y=210
    for line in lines[:3]: draw.text((80,y),line,font=f,fill='#1d1d1f'); y+=size+12
    f=font(23); description=wrap(draw,meta['description'],f,1040)
    available=max(1,min(3,(550-y-25)//33))
    if len(description)>available:
        description=description[:available]; description[-1]=description[-1].rstrip(' .')+'…'
    for line in description: draw.text((80,y+24),line,font=f,fill='#62626b'); y+=33
    draw.text((80,579),'dailwind.com',font=font(19),fill='#0066cc')
    image.save(path,optimize=True)

def prepare_social(root):
    root=Path(root); output=root/'assets/social-v870'; output.mkdir(parents=True,exist_ok=True)
    logo=None
    result={}
    pages={}
    for path in sorted(root.rglob('*.html')):
        route=path.relative_to(root).as_posix(); pages[route]=page_metadata(path.read_text(),route)
    for path in sorted(root.rglob('*.html')):
        route=path.relative_to(root).as_posix(); meta=pages[route].copy()
        canonical=urlsplit(meta['url']).path.lstrip('/')
        if not canonical or canonical.endswith('/'): canonical+='index.html'
        if canonical in pages: meta=pages[canonical].copy()
        digest=hashlib.sha256((meta['title']+'\n'+meta['description']).encode()).hexdigest()[:16]
        filename='share-'+digest+'.png'; target=output/filename
        if not target.exists(): card(target,logo,meta)
        meta['image']='https://dailwind.com/assets/social-v870/'+filename
        result[route]=meta
    return result
