"""apps/index.html must match publishing/apps.json and keep CSP-safe markup."""
import sys,re,unittest
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parent.parent))
import build_apps
class AppsPage(unittest.TestCase):
    def test_up_to_date(self):
        for out,page in build_apps.build().items():self.assertEqual(out.read_text(),page,'run python3 publishing/build_apps.py')
    def test_markup(self):
        page=build_apps.build()[build_apps.ROOT/'apps/index.html']
        self.assertNotRegex(page,r'<script(?![^>]*\bsrc=)[^>]*>(?!</script>)')
        self.assertNotIn(' style="',page.split('<main')[1])
        self.assertIn('aria-current="page">App Store</a>',page)
        for a in build_apps.load():
            self.assertIn(a['name'],page)
            if a.get('playStoreUrl'):self.assertIn(a['playStoreUrl'],page)
    def test_nav_everywhere(self):
        root=build_apps.ROOT
        for p in list(root.rglob('*.html')):
            if '_site' in p.parts:continue
            s=p.read_text()
            if '>Toolkits</a>' in s and 'Main navigation' in s:self.assertIn('>App Store</a>',s,str(p))
if __name__=='__main__':unittest.main()
