"""Stage just the website, excluding repository metadata and publishing sources."""
from pathlib import Path
import json,shutil
from security import assert_safe_tree,harden_site
root=Path(__file__).resolve().parent.parent;out=root/'_site'
if out.exists():shutil.rmtree(out)
out.mkdir()
for name in json.loads((root/'publishing/site-files.json').read_text()):
    if not isinstance(name,str) or name in {'','.', '..','_site','publishing'} or (name.startswith('.') and name not in {'.nojekyll','.well-known'}) or Path(name).name!=name:raise ValueError('Only website root entries are allowed.')
    source=root/name
    if not source.exists():raise ValueError('Missing website entry: '+name)
    assert_safe_tree(source)
    if source.is_dir():shutil.copytree(source,out/name,ignore=shutil.ignore_patterns('.gitkeep'))
    elif source.is_file():shutil.copy2(source,out/name)
retired=root/'publishing/retired-files.json'
if retired.exists():
    for name in json.loads(retired.read_text()):
        if not isinstance(name,str) or Path(name).is_absolute() or '..' in Path(name).parts or not name.startswith('assets/'):raise ValueError('Invalid retired website asset.')
        candidate=out/name
        if candidate.is_file():candidate.unlink()
harden_site(out)
print('Website staged in _site. Publishing tools and workflow files are excluded.')
