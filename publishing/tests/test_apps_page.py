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
        self.assertIn('aria-current="page">Apps</a>',page)
        for a in build_apps.load():
            self.assertIn(a['name'],page)
            if a.get('playStoreUrl'):self.assertIn(a['playStoreUrl'],page)
    def test_nav_everywhere(self):
        root=build_apps.ROOT
        for p in list(root.rglob('*.html')):
            if '_site' in p.parts:continue
            s=p.read_text()
            if '>Toolkits</a>' in s and 'Main navigation' in s:self.assertIn('>Apps</a>',s,str(p));self.assertNotIn('>App</a>',s,str(p));self.assertNotIn('>App Store</a>',s,str(p))
    def test_owl_video(self):
        page=build_apps.build()[build_apps.ROOT/'apps/owl-file-saver/index.html']
        m=re.search(r'<video [^>]*>',page);self.assertTrue(m)
        for att in ('muted','loop','playsinline','preload="none"','poster="'):self.assertIn(att,m[0])
        self.assertNotIn('autoplay',m[0])
        for f in re.findall(r'(?:src|poster)="\.\./\.\./([^"]+)"',m[0]):self.assertTrue((build_apps.ROOT/f).exists(),f)
    def test_name_and_icon_links(self):
        page=build_apps.build()[build_apps.ROOT/'apps/index.html']
        for a in build_apps.load():
            url=build_apps.detail_url(a);n=re.escape(build_apps.e(a['name']))
            if url:
                self.assertRegex(page,r'<h3 class="app-name"><a class="app-name-link" href="'+re.escape(url)+'">'+n+'</a></h3>')
                self.assertRegex(page,r'<a class="app-icon-link" href="'+re.escape(url)+'" tabindex="-1" aria-hidden="true" aria-label="'+n+' details"><(img|span) class="app-icon"')
            else:
                self.assertIn('<h3 class="app-name">'+build_apps.e(a['name'])+'</h3>',page)
        self.assertIn('href="owl-file-saver/"',page);self.assertIn('href="../linguax-arc/"',page)
if __name__=='__main__':unittest.main()
