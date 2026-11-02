"""Fail the build when the staged _site has SEO metadata gaps or broken internal references.

Checks every HTML page in the site directory:
  1. Indexable pages (robots without "noindex") need a non-empty <title> and
     <meta name="description">, and both must be unique among indexable pages.
     Noindex and redirect pages are exempt from uniqueness but still need a title.
  2. Every internal href/src/srcset/poster/data-src reference in HTML and every
     url() in CSS must point at a file that exists in the site.
Usage: python3 publishing/check_site.py [_site]
"""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
import re,sys

ATTRS={'href','src','poster','data-src'}

class Page(HTMLParser):
    def __init__(self):
        super().__init__();self.title=None;self._in_title=False;self.description=None;self.robots='';self.refs=[]
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if tag=='title':self._in_title=True;self.title=self.title or ''
        if tag=='meta' and (a.get('name') or '').lower()=='description':self.description=a.get('content') or ''
        if tag=='meta' and (a.get('name') or '').lower()=='robots':self.robots=(a.get('content') or '').lower()
        for k,v in attrs:
            if v and k in ATTRS:self.refs.append(v)
            if v and k=='srcset':self.refs+=[x.strip().split()[0] for x in v.split(',') if x.strip()]
    def handle_endtag(self,tag):
        if tag=='title':self._in_title=False
    def handle_data(self,data):
        if self._in_title:self.title+=data

def local_target(base,ref,root):
    """Return the file a site-relative reference points at, or None for external/in-page refs."""
    ref=ref.strip();parts=urlsplit(ref)
    if parts.scheme or parts.netloc or ref.startswith('#') or not parts.path:return None
    if '${' in ref or '{{' in ref:return None
    path=unquote(parts.path)
    target=(root/path.lstrip('/')) if path.startswith('/') else (base/path)
    target=target.resolve()
    if target.is_dir() or path.endswith('/'):target=target/'index.html'
    return target

def check(root):
    root=Path(root).resolve();errors=[];titles={};descriptions={}
    for path in sorted(root.rglob('*.html')):
        route=path.relative_to(root).as_posix();page=Page();page.feed(path.read_text(errors='replace'))
        title=(page.title or '').strip();description=(page.description or '').strip()
        indexable='noindex' not in page.robots
        if not title:errors.append(f'{route}: missing or empty <title>')
        if indexable:
            if not description:errors.append(f'{route}: indexable page has a missing or empty <meta name="description">')
            if title:
                if title in titles:errors.append(f'{route}: duplicate <title> "{title}" (also on {titles[title]})')
                else:titles[title]=route
            if description:
                if description in descriptions:errors.append(f'{route}: duplicate meta description (also on {descriptions[description]})')
                else:descriptions[description]=route
        for ref in page.refs:
            target=local_target(path.parent,ref,root)
            if target is None:continue
            if not target.is_relative_to(root):errors.append(f'{route}: reference escapes the site: {ref}')
            elif not target.exists():errors.append(f'{route}: broken internal reference {ref} (no file {target.relative_to(root).as_posix()})')
    for path in sorted(root.rglob('*.css')):
        route=path.relative_to(root).as_posix();text=re.sub(r'/\*.*?\*/','',path.read_text(errors='replace'),flags=re.S)
        for ref in re.findall(r'url\(\s*["\']?([^"\')]+)["\']?\s*\)',text):
            if ref.startswith('data:'):continue
            target=local_target(path.parent,ref,root)
            if target is None:continue
            if not target.is_relative_to(root) or not target.exists():errors.append(f'{route}: broken CSS url({ref})')
    return errors

if __name__=='__main__':
    site=Path(sys.argv[1] if len(sys.argv)>1 else Path(__file__).resolve().parent.parent/'_site')
    if not site.is_dir():sys.exit(f'Site check: {site} does not exist. Run prepare_pages.py first.')
    problems=check(site)
    for problem in problems:print('ERROR '+problem,file=sys.stderr)
    if problems:sys.exit(f'Site check failed with {len(problems)} error(s).')
    print('Site check passed: titles, descriptions and internal references are valid.')
