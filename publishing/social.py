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

# Logo lockup variants: (dominant bold line, secondary regular line).
VARIANTS={'v1':('DAILWIND','APP STUDIO'),'v2':('APP STUDIO','DAILWIND')}

def tracked(draw, xy, text, f, spacing, fill):
    x,y=xy
    for ch in text:
        draw.text((x,y),ch,font=f,fill=fill); x+=draw.textlength(ch,font=f)+spacing
    return x-spacing

def justified(draw, x0, x1, y, text, f, fill):
    # Spread letters so the first glyph's ink starts at x0 and the last glyph's ink ends at x1; a word space counts as two gaps.
    words=text.split(); letters=[c for w in words for c in w]
    ink=[draw.textbbox((0,0),c,font=f) for c in letters]
    gaps=len(letters)-1+(len(words)-1)
    gap=((x1-x0)-sum(b[2]-b[0] for b in ink))/gaps
    x=x0; i=0
    for wi,w in enumerate(words):
        for c in w:
            b=ink[i]; draw.text((x-b[0],y),c,font=f,fill=fill); x+=b[2]-b[0]+gap; i+=1
        x+=gap

def lockup(draw, image, logo, variant='v1', x=80, y=57, height=78):
    # Logo mark, then a stacked wordmark whose two lines fill the logo height (5:3 split, like the site header).
    mark=logo.copy(); mark.thumbnail((height,height),Image.Resampling.LANCZOS)
    image.paste(mark,(x+(height-mark.width)//2,y+(height-mark.height)//2),mark)
    top,bottom=VARIANTS[variant]; tx=x+height+20
    if variant=='v1':  # logo build of Montserrat (crossbar-less A), matching the site lockup
        fonts=Path(__file__).with_name('fonts'); big=ImageFont.truetype(str(fonts/'dailwind-logo-800.ttf'),round(height*.5)); small=ImageFont.truetype(str(fonts/'dailwind-logo-400.ttf'),round(height*.24))
    else: big=font(round(height*.53),True); small=font(round(height*.235))
    bb=draw.textbbox((0,0),top,font=big); sb=draw.textbbox((0,0),bottom,font=small)
    left=draw.textbbox((0,0),top[0],font=big)[0]
    end=tracked(draw,(tx-left,y-bb[1]+round(height*.04)),top,big,round(height*.03),'#1d1d1f')
    last=top[-1]; end=end-draw.textlength(last,font=big)+draw.textbbox((0,0),last,font=big)[2]
    justified(draw,tx,end,y+height-sb[3]-round(height*.02),bottom,small,'#3a3a3f')

def card(path, logo, meta, variant='v1'):
    image=Image.new('RGB',(1200,630),'white'); draw=ImageDraw.Draw(image)
    lockup(draw,image,logo,variant)
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
    root=Path(root); output=root/'assets/social-v875'; output.mkdir(parents=True,exist_ok=True)
    with Image.open(root/'assets/dailwind-logo-v866.webp') as source:
        rgba=source.convert('RGBA'); logo=rgba.crop(rgba.getbbox())
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
        meta['image']='https://dailwind.com/assets/social-v875/'+filename
        result[route]=meta
    return result
