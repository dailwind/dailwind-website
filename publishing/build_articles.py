"""Build a static reading room from articles/uploads. Python standard library only."""
from pathlib import Path
from html import escape
from urllib.parse import quote,urlsplit
from datetime import date
import argparse,hashlib,json,re,shutil,unicodedata,xml.etree.ElementTree as ET

def inline(text):
    # Escape raw HTML first. Only explicitly safe link protocols are emitted.
    pattern=re.compile(r'\[([^\]\n]+)\]\(([^\s)]+)\)|\*\*([^*\n]+)\*\*|`([^`\n]+)`')
    out=[];last=0
    for m in pattern.finditer(text):
        out.append(escape(text[last:m.start()]));last=m.end()
        if m[1] is not None:
            target=m[2];u=urlsplit(target)
            if u.scheme in {'https','http','mailto'} and (u.netloc or u.scheme=='mailto'):
                out.append('<a href="'+escape(target,quote=True)+'" rel="noopener noreferrer">'+escape(m[1])+'</a>')
            else:out.append(escape(m[0]))
        elif m[3] is not None:out.append('<strong>'+escape(m[3])+'</strong>')
        else:out.append('<code>'+escape(m[4])+'</code>')
    out.append(escape(text[last:]));return ''.join(out)

def markdown(text,plain=False):
    if plain:return ''.join('<p>'+escape(p).replace('\n','<br>')+'</p>' for p in re.split(r'\n\s*\n',text.strip()) if p.strip())
    out=[];paragraph=[];items=[];list_type=None;fence=False;code=[];quotation=[]
    def flush_p():
        if paragraph:out.append('<p>'+inline(' '.join(paragraph))+'</p>');paragraph.clear()
    def flush_quote():
        if quotation:out.append('<blockquote><p>'+'<br>'.join(inline(q) for q in quotation)+'</p></blockquote>');quotation.clear()
    def flush_list():
        nonlocal list_type
        if items:out.append('<'+list_type+'>'+''.join('<li>'+inline(v)+'</li>' for v in items)+'</'+list_type+'>');items.clear()
        list_type=None
    for line in text.splitlines()+['']:
        if line.startswith('```'):
            flush_p();flush_list();flush_quote()
            if fence:out.append('<pre><code>'+escape('\n'.join(code))+'</code></pre>');code=[]
            fence=not fence;continue
        if fence:code.append(line);continue
        if not line.strip():flush_p();flush_list();flush_quote();continue
        if line.strip() in {'---','***','___'}:
            flush_p();flush_list();flush_quote();out.append('<hr>');continue
        if not (line.startswith('> ') or line.strip()=='>'):flush_quote()
        h=re.match(r'^(#{1,6})\s+(.+)',line)
        li=re.match(r'^\s*(?:([-*])|\d+[.)])\s+(.+)',line)
        if h:
            flush_p();flush_list();level=min(6,len(h[1])+1);out.append(f'<h{level}>'+inline(h[2])+f'</h{level}>')
        elif li:
            flush_p();kind='ul' if li[1] else 'ol'
            if list_type and list_type!=kind:flush_list()
            list_type=kind;items.append(li[2])
        elif line.startswith('> ') or line.strip()=='>':
            flush_p();flush_list();quotation.append(line[2:] if line.startswith('> ') else '')
        else:flush_list();paragraph.append(line.strip())
    if code:out.append('<pre><code>'+escape('\n'.join(code))+'</code></pre>')
    return '\n'.join(out)

def metadata(path):
    data={};text=''
    if path.suffix.lower()!='.pdf':
        text=path.read_text(encoding='utf-8-sig')
        if text.startswith('---\n'):
            end=text.find('\n---',4)
            if end<0:raise ValueError(f'{path.name}: front matter needs a closing --- line.')
            front=text[4:end];text=text[end+4:].lstrip('\r\n')
            for line in front.splitlines():
                if ':' not in line or not line.strip() or line.lstrip().startswith('#'):continue
                key,val=line.split(':',1);data[key.strip()]=val.strip().strip('"\'')
    side=path.with_suffix('.json')
    if side.is_symlink():raise ValueError('Article metadata must not be a symlink.')
    if side.exists():
        if side.stat().st_size>1024*1024:raise ValueError('Article metadata exceeds 1 MB.')
        extra=json.loads(side.read_text(encoding='utf-8-sig'))
        if not isinstance(extra,dict):raise ValueError(f'{side.name}: metadata must be a JSON object.')
        data.update(extra)
    for key in ('title','author','date','summary','category','original_title','original_author','translation_note','editorial_note'):
        if key in data and not isinstance(data[key],str):raise ValueError(f'{path.name}: {key} must be text in quotes.')
    name=re.sub(r'^\d{4}-\d{2}-\d{2}[-_ ]*','',path.stem).replace('_',' ').replace('-',' ').strip()
    title=data.get('title') or name or path.stem
    first_heading=re.search(r'^#\s+(.+)$',text,re.M)
    if not data.get('title') and first_heading:title=first_heading[1].strip();text=text[:first_heading.start()]+text[first_heading.end():]
    when=data.get('date','').strip()
    if not when and re.match(r'^\d{4}-\d{2}-\d{2}',path.stem):when=path.stem[:10]
    if when:
        try:date.fromisoformat(when)
        except ValueError:raise ValueError(f'{path.name}: date must use YYYY-MM-DD.')
    result={'title':title[:250],'author':data.get('author','').strip()[:200],'date':when,'summary':data.get('summary','').strip()[:600],'category':data.get('category','Shared reading').strip()[:100],'format':path.suffix.lower()[1:]}
    for key in ('original_title','original_author','translation_note','editorial_note'):
        if data.get(key):result[key]=data[key].strip()[:1200]
    return result,text

def slug_for(path):
    name=unicodedata.normalize('NFKD',path.stem).encode('ascii','ignore').decode().lower()
    slug=re.sub(r'[^a-z0-9]+','-',name).strip('-')[:90]
    return (slug or 'article')+'-'+hashlib.sha256(path.name.encode()).hexdigest()[:8]

def build(site,template):
    source=site/'articles/uploads';read=site/'articles/read';source.mkdir(parents=True,exist_ok=True)
    shell=template.read_text();entries=[];pages=[]
    for path in sorted(source.iterdir()):
        if path.is_symlink():raise ValueError('Article sources must be ordinary files, not links.')
        if not path.is_file() or path.name.startswith('.') or path.suffix.lower() not in {'.md','.txt','.pdf'}:continue
        if path.stat().st_size>(50*1024*1024 if path.suffix.lower()=='.pdf' else 5*1024*1024):raise ValueError('Article exceeds publishing size limit: '+path.name)
        meta,text=metadata(path);slug=slug_for(path);meta['slug']=slug;meta['url']='read/'+slug+'.html';meta['file']='uploads/'+quote(path.name)
        if path.suffix.lower()=='.pdf':
            with path.open('rb') as f:
                if not f.read(1024).lstrip().startswith(b'%PDF-'):raise ValueError(f'{path.name} is not a PDF. Export it as PDF first.')
            body='<div class="pdf-note"><span class="pdf-label">PDF DOCUMENT</span><p>This article is available as a PDF. Open it in your browser or download a copy.</p><div class="button-row"><a class="button" href="../'+escape(meta['file'],quote=True)+'">Open PDF ↗</a><a class="underlink" href="../'+escape(meta['file'],quote=True)+'" download>Download PDF</a></div><p class="small-text">'+f'{path.stat().st_size/1024/1024:.1f} MB'+'</p></div>'
        else:body=markdown(text,path.suffix.lower()=='.txt')
        notices=[]
        if meta.get('translation_note'):
            original=''
            if meta.get('original_title'):original='<p>Original title: <bdi lang="ur" dir="rtl">'+escape(meta['original_title'])+'</bdi></p>'
            if meta.get('original_author'):original+='<p>Original byline: <bdi lang="ur" dir="rtl">'+escape(meta['original_author'])+'</bdi></p>'
            notices.append('<aside class="translation-note" aria-label="Translation details"><p>'+escape(meta['translation_note'])+'</p>'+original+'</aside>')
        if meta.get('editorial_note'):notices.append('<aside class="translation-note" aria-label="Editorial note"><p>'+escape(meta['editorial_note'])+'</p></aside>')
        body=''.join(notices)+body
        byline=' · '.join(filter(None,[escape(meta['author']),escape(meta['date']),{'md':'Article','txt':'Text','pdf':'PDF'}[meta['format']]]))
        mapping={'__ARTICLE_TITLE__':escape(meta['title'],quote=True),'__ARTICLE_DESCRIPTION__':escape(meta['summary'] or ('A shared PDF document.' if meta['format']=='pdf' else 'An article from the Dailwind Studio reading room.'),quote=True),'__ARTICLE_CATEGORY__':escape(meta['category']),'__ARTICLE_BYLINE__':byline,'__ARTICLE_SLUG__':slug,'__ARTICLE_BODY__':body}
        page=re.sub(r'__ARTICLE_(?:TITLE|DESCRIPTION|CATEGORY|BYLINE|SLUG|BODY)__',lambda m:mapping[m[0]],shell)
        pages.append((slug+'.html',page));entries.append(meta)
    entries.sort(key=lambda e:(e['date'],e['title'].casefold()),reverse=True)
    # Commit generated files only once every input has validated.
    if read.exists():shutil.rmtree(read)
    read.mkdir(parents=True)
    for name,html in pages:(read/name).write_text(html)
    rows=[]
    for item in entries:
        title=escape(item['title']);url=escape(item['url'],quote=True);fmt=item['format'];meta=' · '.join(filter(None,[escape(item['author']),escape(item['date']),fmt.upper() if fmt!='md' else 'ARTICLE']))
        search=escape(' '.join([item.get(k,'') for k in ('title','author','summary','category','original_title','original_author')]).casefold(),quote=True)
        rows.append(f'<article class="article-row" data-article-row data-format="{fmt}" data-search="{search}"><div class="article-row-meta"><span>{escape(item["category"])}</span><span>{fmt.upper() if fmt!="md" else "ARTICLE"}</span></div><div><h2><a href="{url}">{title}</a></h2><p>{escape(item["summary"])}</p><p class="article-byline">{meta}</p></div><a class="article-arrow" href="{url}" aria-label="Read {title}">↗</a></article>')
    empty='<div class="articles-empty"><span class="empty-mark" aria-hidden="true">¶</span><h2>The reading room is open.</h2><p>New articles will be collected here as they are shared. Come back for writing on language, education and research.</p></div>'
    index=site/'articles/index.html';html=index.read_text();html=re.sub(r'<!-- ARTICLE_LIST_START -->.*?<!-- ARTICLE_LIST_END -->',lambda m:'<!-- ARTICLE_LIST_START -->'+(''.join(rows) or empty)+'<!-- ARTICLE_LIST_END -->',html,flags=re.S)
    html=re.sub(r'(<p id="article-count"[^>]*>).*?(</p>)',lambda m:m[1]+str(len(entries))+(' article' if len(entries)==1 else ' articles')+m[2],html)
    index.write_text(html);(site/'articles/catalog.json').write_text(json.dumps(entries,indent=2,ensure_ascii=False)+'\n')
    sitemap=site/'sitemap.xml'
    if sitemap.exists():
        ns={'m':'http://www.sitemaps.org/schemas/sitemap/0.9'};ET.register_namespace('',ns['m']);tree=ET.parse(sitemap);root=tree.getroot();base=None
        for node in list(root):
            loc=node.find('m:loc',ns)
            if loc is None:continue
            if base is None:base=loc.text.split('/articles/')[0] if '/articles/' in loc.text else urlsplit(loc.text).scheme+'://'+urlsplit(loc.text).netloc
            if '/articles/read/' in loc.text:root.remove(node)
        for entry in entries:
            node=ET.SubElement(root,'{'+ns['m']+'}url');ET.SubElement(node,'{'+ns['m']+'}loc').text=(base or 'https://dailwind.com')+'/articles/'+entry['url']
        tree.write(sitemap,encoding='unicode',xml_declaration=True)
    print(f'Articles built: {len(entries)}; no manual catalog editing required.')
    return entries

if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--site',type=Path,default=Path(__file__).resolve().parent.parent);parser.add_argument('--template',type=Path,default=Path(__file__).resolve().parent/'article-template.html');args=parser.parse_args();build(args.site.resolve(),args.template.resolve())
