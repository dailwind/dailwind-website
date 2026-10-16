"""Stage just the website, excluding repository metadata and publishing sources."""
from pathlib import Path
import json,shutil
root=Path(__file__).resolve().parent.parent;out=root/'_site'
if out.exists():shutil.rmtree(out)
out.mkdir()
for name in json.loads((root/'publishing/site-files.json').read_text()):
    if Path(name).name!=name:raise ValueError('Only website root entries are allowed.')
    source=root/name
    if source.is_symlink():raise ValueError('Website entries must not be symbolic links.')
    if source.is_dir():shutil.copytree(source,out/name,ignore=shutil.ignore_patterns('.gitkeep'))
    elif source.is_file():shutil.copy2(source,out/name)
print('Website staged in _site. Publishing tools and workflow files are excluded.')
