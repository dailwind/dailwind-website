# Extra smoke checks for media tools; exec'd by test_new_tools_smoke.py
import zlib,struct
def _png(w=320,h=240):
    raw=b''.join(b'\x00'+bytes([(x*255//w),(y*255//h),128]*1 if False else b''.join(bytes([(x*255)//w,(y*255)//h,140]) for x in range(w))) for y in range(h))
    c=lambda t,d:struct.pack('>I',len(d))+t+d+struct.pack('>I',zlib.crc32(t+d)&0xffffffff)
    return b'\x89PNG\r\n\x1a\n'+c(b'IHDR',struct.pack('>IIBBBBB',w,h,8,2,0,0,0))+c(b'IDAT',zlib.compress(raw))+c(b'IEND',b'')
_IMG=[{'name':'a.png','mimeType':'image/png','buffer':_png()},{'name':'b.png','mimeType':'image/png','buffer':_png(200,300)}]
def _wait_done(pg):pg.wait_for_selector('#wt-status:text("Done:")',timeout=30000)
def converter(pg):
    pg.set_input_files('#mt-input',_IMG);pg.wait_for_selector('#mt-run:not([disabled])');
    for fmt in ('jpeg','bmp','ico','webp'):
        pg.select_option('#mt-format',fmt);pg.click('#mt-run');_wait_done(pg);assert pg.locator('.mt-file a[download]').count()==2,fmt
        assert pg.locator('.mt-file a[download]').first.get_attribute('download').endswith({'jpeg':'.jpg','bmp':'.bmp','ico':'.ico','webp':'.webp'}[fmt])
    assert pg.is_visible('#mt-zip')
def resizer(pg):
    pg.set_input_files('#mt-input',_IMG);pg.wait_for_selector('#mt-run:not([disabled])');pg.fill('#mt-w','100');pg.click('#mt-run');_wait_done(pg)
    assert '100×75' in pg.text_content('#mt-files'),pg.text_content('#mt-files')
    pg.select_option('#mt-preset','0');pg.click('#mt-run');_wait_done(pg);assert '1080×1080' in pg.text_content('#mt-files')
    pg.select_option('#mt-mode','kb');pg.fill('#mt-target','8');pg.click('#mt-run');_wait_done(pg);assert '-8kb' in pg.locator('.mt-file a').first.get_attribute('download')
def passport(pg):
    pg.set_input_files('#pp-input',_IMG[1]);pg.wait_for_selector('#pp-tools:not([hidden])')
    assert pg.evaluate("document.getElementById('pp-canvas').width")==600
    pg.select_option('#pp-spec','2');assert pg.evaluate("document.getElementById('pp-canvas').width")==413
    with pg.expect_download() as d:pg.click('#pp-single')
    with pg.expect_download() as d2:pg.click('#pp-sheet')
    assert 'copies' in pg.text_content('#wt-status')
def speech(pg):
    pg.fill('#ts-word','pronunciation');pg.click('#ts-lookup');pg.wait_for_selector('#ts-ipa:text("/")',timeout=20000);assert 'ˈeɪʃən' in pg.text_content('#ts-ipa')
CHECKS.update({'image-converter/':converter,'image-resizer/':resizer,'passport-photo-maker/':passport,'text-to-speech/':speech})
# Text tools
def case_conv(pg):
    pg.fill('#tt-input','the quick brown fox: a NASA story');pg.click('[data-case=title]');assert pg.input_value('#tt-output')=='The Quick Brown Fox: A NASA Story',pg.input_value('#tt-output')
    pg.click('[data-case=snake]');assert pg.input_value('#tt-output')=='the_quick_brown_fox_a_nasa_story'
def text_stats(pg):
    assert pg.locator('#tt-kw .tool-empty').count()==1
    pg.click('#tt-sample');pg.wait_for_selector('#tt-kw table');assert pg.locator('#tt-stats div').count()==12;pg.click('[data-n="2"]');assert pg.locator('#tt-kw tbody tr').count()>=1
    with pg.expect_download() as d:pg.click('#tt-csv')
    assert d.value.suggested_filename=='text-statistics.csv'
def citation(pg):
    pg.evaluate('localStorage.removeItem("dailwind:citations")');pg.reload()
    assert pg.locator('#cg-out .tool-empty').count()==1
    pg.select_option('#cg-type','journal');pg.fill('#cg-authors','Smith, John');pg.fill('#cg-title','a study of things');pg.fill('#cg-container','journal of studies');pg.fill('#cg-date','2019');pg.fill('#cg-volume','12')
    assert 'Smith, J. (2019). A study of things. Journal of Studies, 12.' in pg.text_content('#cg-out'),pg.text_content('#cg-out')
    pg.click('[data-style=mla]');assert '“A Study of Things.”' in pg.text_content('#cg-out')
    pg.click('#cg-add');assert pg.locator('#cg-bib li [data-del]').count()==1
    pg.reload();assert pg.locator('#cg-bib li [data-del]').count()==1;pg.click('[data-del]');assert pg.locator('#cg-bib .tool-empty').count()==1
    csp=pg.get_attribute('meta[http-equiv="Content-Security-Policy"]','content');assert "connect-src 'self' https://api.crossref.org;" in csp,csp
def synonyms(pg):
    assert pg.locator('#se-out .tool-empty').count()==1
    pg.fill('#se-q','happy');pg.click('#se-form button[type=submit]');pg.wait_for_selector('.tt-sense',timeout=30000)
    assert pg.locator('.tt-chip.ant').count()>=1;pg.locator('.tt-sense .tt-chip').first.click();pg.wait_for_timeout(300);assert pg.input_value('#se-q')!='happy'
    pg.click('#se-back');assert pg.input_value('#se-q')=='happy'
CHECKS.update({'case-converter/':case_conv,'text-statistics/':text_stats,'citation-generator/':citation,'synonym-explorer/':synonyms})
