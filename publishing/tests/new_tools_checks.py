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
