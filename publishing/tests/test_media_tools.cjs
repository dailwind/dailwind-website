'use strict';
const assert=require('assert');const M=require('../../assets/media-tools-engine.js');
const px=new Uint8ClampedArray([255,0,0,255, 0,255,0,255, 0,0,255,255, 255,255,255,0]);const bmp=M.encodeBMP(px,2,2);
assert.strictEqual(String.fromCharCode(bmp[0],bmp[1]),'BM');assert.strictEqual(bmp.length,54+8*2);assert.deepStrictEqual([...bmp.slice(54,57)],[255,0,0]);/* bottom row first: blue pixel in BGR */assert.deepStrictEqual([...bmp.slice(57,60)],[255,255,255]);
const ico=M.encodeICO([{size:16,png:new Uint8Array([1,2,3])},{size:256,png:new Uint8Array([4,5])}]);assert.deepStrictEqual([...ico.slice(0,6)],[0,0,1,0,2,0]);assert.strictEqual(ico[6+16],0);assert.strictEqual(ico.length,6+32+5);
const jpg=M.setJpegDpi(new Uint8Array([0xff,0xd8,0xff,0xe0,0,16,0x4a,0x46,0x49,0x46,0,1,1,0,0,1,0,1,0,0,0xff,0xd9]),300);assert.strictEqual(jpg[13],1);assert.strictEqual(jpg[14]*256+jpg[15],300);
const noapp=M.setJpegDpi(new Uint8Array([0xff,0xd8,0xff,0xdb,0xff,0xd9]),300);assert.strictEqual(noapp[2],0xff);assert.strictEqual(noapp[3],0xe0);assert.strictEqual(noapp.length,24);
assert.strictEqual(M.crc32(new TextEncoder().encode('123456789')),0xcbf43926);
assert.deepStrictEqual(M.resizeDims(4000,3000,{mode:'pixels',width:1000}),{width:1000,height:750});assert.deepStrictEqual(M.resizeDims(400,300,{mode:'percent',percent:50}),{width:200,height:150});
assert.deepStrictEqual(M.resizeDims(400,300,{mode:'pixels',width:100,height:100,lock:false}),{width:100,height:100});
const us=M.guides(M.SPECS.find(s=>s.id==='us'));assert.strictEqual(us.width,600);assert.strictEqual(us.height,600);const head=(us.chin-us.crown)/300;assert.ok(head>=1&&head<=1.375,'US head '+head);assert.ok(600-us.eye[1]>=337&&600-us.eye[0]<=413);
for(const s of M.SPECS){const g=M.guides(s);const mm=(g.chin-g.crown)/300*25.4;assert.ok(mm>=s.head[0]-0.2&&mm<=s.head[1]+0.2,s.id+' head '+mm);assert.ok(g.crown>0&&g.chin<g.height);}
assert.strictEqual(M.guides(M.SPECS.find(s=>s.id==='schengen')).width,413);assert.strictEqual(M.guides(M.SPECS.find(s=>s.id==='schengen')).height,531);
assert.strictEqual(M.sheet('4x6',M.SPECS[0]).cells.length,6);assert.ok(M.sheet('a4',M.SPECS[2]).cells.length>=30);
const f=M.fitHead({crown:100,chin:500,cx:300},us);assert.ok(Math.abs(100*f.scale+f.y-us.crown)<1e-6&&Math.abs(300*f.scale+f.x-300)<1e-6);
const img=new Uint8ClampedArray(10*10*4);for(let i=0;i<100;i++){img.set([30,200,30,255],i*4);}for(let y=4;y<7;y++)for(let x=4;x<7;x++)img.set([200,40,40,255],(y*10+x)*4);const frac=M.replaceBackground(img,10,10,[255,255,255],40);assert.ok(frac>0.85&&frac<0.95);assert.deepStrictEqual([...img.slice(0,3)],[255,255,255]);assert.deepStrictEqual([...img.slice(55*4,55*4+3)],[200,40,40]);
assert.strictEqual(M.arpabetToIpa('P R AH0 N AH2 N S IY0 EY1 SH AH0 N'),'/pɹənˌʌnsiˈeɪʃən/');assert.strictEqual(M.parsePron('# c\nhello\tHH AH0 L OW1\n').get('hello'),'HH AH0 L OW1');
const ch=M.speechChunks('One. '.repeat(100),60);assert.ok(ch.length>5&&ch.every(c=>c.text.length<=70));assert.strictEqual(ch[1].start,ch[0].text.length);
(async()=>{const r=await M.searchQuality(async q=>Math.round(q*1000),500);assert.ok(r.met&&r.size<=500&&r.size>470);console.log('media tools engine tests passed');})();
