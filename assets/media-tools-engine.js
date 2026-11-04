/* Dailwind media engine: pure helpers for image conversion, resizing, passport photos and pronunciation. No network. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.DailwindMedia=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const CRC=Uint32Array.from({length:256},(_,n)=>{for(let k=0;k<8;k++)n=n&1?0xedb88320^(n>>>1):n>>>1;return n>>>0;});
function crc32(b){let c=0xffffffff;for(let i=0;i<b.length;i++)c=CRC[(c^b[i])&255]^(c>>>8);return(c^0xffffffff)>>>0;}
/* 24-bit BMP from RGBA pixels (BITMAPINFOHEADER, bottom-up rows padded to 4 bytes) */
function encodeBMP(rgba,w,h){const row=(w*3+3)&~3,size=54+row*h,b=new Uint8Array(size),v=new DataView(b.buffer);b[0]=66;b[1]=77;v.setUint32(2,size,true);v.setUint32(10,54,true);v.setUint32(14,40,true);v.setInt32(18,w,true);v.setInt32(22,h,true);v.setUint16(26,1,true);v.setUint16(28,24,true);v.setUint32(34,row*h,true);v.setInt32(38,11811,true);v.setInt32(42,11811,true);
 for(let y=0;y<h;y++){const src=(h-1-y)*w*4,dst=54+y*row;for(let x=0;x<w;x++){const a=rgba[src+x*4+3]/255,bl=c=>Math.round(c*a+255*(1-a));b[dst+x*3]=bl(rgba[src+x*4+2]);b[dst+x*3+1]=bl(rgba[src+x*4+1]);b[dst+x*3+2]=bl(rgba[src+x*4]);}}return b;}
/* ICO container with embedded PNG images (Vista+ format). images: [{size,png:Uint8Array}] */
function encodeICO(images){const n=images.length,head=6+16*n;let total=head;images.forEach(i=>total+=i.png.length);const b=new Uint8Array(total),v=new DataView(b.buffer);v.setUint16(2,1,true);v.setUint16(4,n,true);let off=head;images.forEach((im,k)=>{const e=6+16*k;b[e]=im.size>=256?0:im.size;b[e+1]=im.size>=256?0:im.size;v.setUint16(e+4,1,true);v.setUint16(e+6,32,true);v.setUint32(e+8,im.png.length,true);v.setUint32(e+12,off,true);b.set(im.png,off);off+=im.png.length;});return b;}
/* Write DPI into a JPEG's JFIF APP0 (inserting one if absent) */
function setJpegDpi(bytes,dpi){const b=new Uint8Array(bytes);if(b[0]!==0xff||b[1]!==0xd8)throw Error('Not a JPEG');if(b[2]===0xff&&b[3]===0xe0&&b[6]===0x4a&&b[7]===0x46){b[13]=1;b[14]=dpi>>8;b[15]=dpi&255;b[16]=dpi>>8;b[17]=dpi&255;return b;}
 const app=new Uint8Array([0xff,0xe0,0,16,0x4a,0x46,0x49,0x46,0,1,1,1,dpi>>8,dpi&255,dpi>>8,dpi&255,0,0]);const o=new Uint8Array(b.length+18);o.set(b.subarray(0,2));o.set(app,2);o.set(b.subarray(2),20);return o;}
/* Insert a pHYs chunk (pixels per metre) after IHDR in a PNG */
function setPngDpi(bytes,dpi){const b=new Uint8Array(bytes);const ppm=Math.round(dpi/0.0254);const data=new Uint8Array(13),v=new DataView(data.buffer);data.set([0x70,0x48,0x59,0x73]);v.setUint32(4,ppm);v.setUint32(8,ppm);data[12]=1;
 const chunk=new Uint8Array(21),cv=new DataView(chunk.buffer);cv.setUint32(0,9);chunk.set(data,4);cv.setUint32(17,crc32(data));const at=33;const o=new Uint8Array(b.length+21);o.set(b.subarray(0,at));o.set(chunk,at);o.set(b.subarray(at),at+21);return o;}
/* Resize dimension maths */
function resizeDims(w,h,o){let W,H;if(o.mode==='percent'){const f=Math.max(1,Math.min(1000,+o.percent||100))/100;W=w*f;H=h*f;}else{W=+o.width||0;H=+o.height||0;if(o.lock!==false){if(W&&!H)H=W*h/w;else if(H&&!W)W=H*w/h;else if(W&&H&&o.fit==='contain'){const f=Math.min(W/w,H/h);W=w*f;H=h*f;}}if(!W)W=w;if(!H)H=h;}
 return{width:Math.max(1,Math.min(16384,Math.round(W))),height:Math.max(1,Math.min(16384,Math.round(H)))};}
const PRESETS=[['Instagram post','1080x1080'],['Instagram portrait','1080x1350'],['Instagram / TikTok story','1080x1920'],['Facebook post','1200x630'],['Facebook cover','1640x624'],['X (Twitter) post','1600x900'],['X (Twitter) header','1500x500'],['LinkedIn post','1200x627'],['LinkedIn banner','1584x396'],['YouTube thumbnail','1280x720'],['YouTube banner','2560x1440'],['Pinterest pin','1000x1500'],['WhatsApp DP','500x500'],['Full HD','1920x1080'],['4K UHD','3840x2160']].map(([name,s])=>{const[w,h]=s.split('x').map(Number);return{name,width:w,height:h};});
/* Find the highest quality whose encoded size <= target bytes. encode(q)->Promise<size> */
async function searchQuality(encode,target,{min=0.05,max=0.95,steps=8}={}){let lo=min,hi=max,best=null;const top=await encode(hi);if(top<=target)return{quality:hi,size:top,met:true};for(let i=0;i<steps;i++){const mid=(lo+hi)/2,s=await encode(mid);if(s<=target){best={quality:mid,size:s,met:true};lo=mid;}else hi=mid;}if(best)return best;const s=await encode(min);return{quality:min,size:s,met:s<=target};}
/* Passport / visa specs. head = chin-to-crown height range in mm; eye = eye line from bottom edge range in mm (where specified).
   Sources (checked Nov 2026; always confirm with the issuing authority):
   Verified 2026-11-05 against official pages (URL on each spec, shown in the UI):
   US 2x2 in, head 25-35 mm, eyes 28-35 mm from bottom; UK printed 35x45, head 29-34; Schengen 35x45, 32-36 (ICAO);
   China 33x48, 28-33; Canada 50x70, 31-36; India visa 2x2 in, 25-35; India passport 630x810 px, face 80-85%;
   Pakistan 35x45 (DGIP gives no head range: ICAO 32-36 used); Saudi 2x2 in, face 70-80%; UAE 43x55 (ICP ICAO guide);
   Australia 35-40 x 45-50, head 32-36; Japan 35x45, head 34 +/- 2 mm. */
const SPECS=[
 {id:'us',name:'United States passport / visa',w:50.8,h:50.8,head:[25.4,34.9],eye:[28.6,34.9],bg:'#ffffff',src:'travel.state.gov',url:'https://travel.state.gov/en/passports/apply/help/photos.html'},
 {id:'uk',name:'United Kingdom passport (printed)',w:35,h:45,head:[29,34],bg:'#f2f2f2',src:'gov.uk',url:'https://www.gov.uk/photos-for-passports/photo-requirements'},
 {id:'schengen',name:'Schengen / EU visa & passports',w:35,h:45,head:[32,36],bg:'#f2f2f2',src:'france-visas.gouv.fr (ICAO / ISO 19794-5)',url:'https://www.france-visas.gouv.fr/documents/d/france-visas/iso_iec_fv_visa_photograph_requirements_en'},
 {id:'cn',name:'China visa',w:33,h:48,head:[28,33],bg:'#ffffff',src:'visaforchina.cn',url:'https://www.visaforchina.cn/SYD4_EN/qianzhengyewu/jichuzhishi/changjianwenti/552371235904950309.html'},
 {id:'ca',name:'Canada passport',w:50,h:70,head:[31,36],bg:'#ffffff',src:'canada.ca',url:'https://www.canada.ca/en/immigration-refugees-citizenship/services/canadian-passports/photos.html'},
 {id:'in-visa',name:'India visa',w:50.8,h:50.8,head:[25,35],bg:'#ffffff',src:'indianvisaonline.gov.in',url:'https://indianvisaonline.gov.in/visa/instruction.html'},
 {id:'in-pp',name:'India passport (630 × 810 px, face 80–85%)',w:35,h:45,head:[36,38],bg:'#ffffff',src:'Embassy of India (Passport Seva ICAO guidelines, 2025)',url:'https://www.eoivienna.gov.in/public_files/assets/pdf/Guidelines_29_08_2025.pdf'},
 {id:'pk',name:'Pakistan passport',w:35,h:45,head:[32,36],bg:'#ffffff',src:'onlinemrp.dgip.gov.pk (size; head range per ICAO)',url:'https://onlinemrp.dgip.gov.pk/photo-requirements/'},
 {id:'sa',name:'Saudi Arabia visa',w:50.8,h:50.8,head:[36,41],bg:'#ffffff',src:'Saudi embassy / visa.visitsaudi.com (face 70–80%)',url:'https://www.saudiembassy.net/guideline-accepted-photographs-saudi-visas'},
 {id:'ae',name:'United Arab Emirates visa',w:43,h:55,head:[32,36],bg:'#ffffff',src:'icp.gov.ae (ICAO guidelines)',url:'https://icp.gov.ae/wp-content/uploads/2021/11/ICA-photography-Visa-guidelines-.pdf'},
 {id:'au',name:'Australia passport',w:35,h:45,head:[32,36],bg:'#ffffff',src:'passports.gov.au',url:'https://www.passports.gov.au/passports-explained/how-apply/passport-photo-guidelines'},
 {id:'jp',name:'Japan passport',w:35,h:45,head:[32,36],bg:'#ffffff',src:'mofa.go.jp (34 ± 2 mm)',url:'https://www.mofa.go.jp/mofaj/toko/passport/ic_photo.html'}];
const mmToPx=(mm,dpi=300)=>Math.round(mm/25.4*dpi);
/* Target layout in output pixels: crown line, chin line, eye band */
function guides(spec,dpi=300){const W=mmToPx(spec.w,dpi),H=mmToPx(spec.h,dpi);const head=(spec.head[0]+spec.head[1])/2;const top=(spec.h-head)/2*0.62;/* slightly more space below chin than above crown */
 const crown=mmToPx(top,dpi),chin=mmToPx(top+head,dpi);let eye;if(spec.eye)eye=[H-mmToPx(spec.eye[1],dpi),H-mmToPx(spec.eye[0],dpi)];else{const e=crown+(chin-crown)*0.45;eye=[Math.round(e-(chin-crown)*0.06),Math.round(e+(chin-crown)*0.06)];}
 return{width:W,height:H,crown,chin,headMin:mmToPx(spec.head[0],dpi),headMax:mmToPx(spec.head[1],dpi),eye};}
/* Given a detected head (crown/chin y and centre x in source px) compute scale & offset to map into output */
function fitHead(head,g){const s=(g.chin-g.crown)/Math.max(1,head.chin-head.crown);return{scale:s,x:g.width/2-head.cx*s,y:g.crown-head.crown*s};}
function headFromFace(box){/* face box from FaceDetector covers brows→chin; crown is ~45% of box height above its top */return{crown:box.y-box.height*0.45,chin:box.y+box.height*1.02,cx:box.x+box.width/2};}
/* Print sheet layout: paper in mm, photo in mm, 2 mm gap, 4 mm margin */
function sheet(paper,spec,dpi=300,gap,margin){if(gap===undefined){const a=sheet(paper,spec,dpi,2,4),b=sheet(paper,spec,dpi,0,0);return b.cells.length>a.cells.length?b:a;}const P={'4x6':[152.4,101.6],a4:[210,297],letter:[215.9,279.4]}[paper]||[152.4,101.6];const[pw,ph]=P;const fit=(aw,ah)=>{const c=Math.floor((aw-2*margin+gap)/(spec.w+gap)),r=Math.floor((ah-2*margin+gap)/(spec.h+gap));return{c:Math.max(0,c),r:Math.max(0,r)};};
 let o=fit(pw,ph),W=pw,H=ph;const o2=fit(ph,pw);if(o2.c*o2.r>o.c*o.r){o=o2;W=ph;H=pw;}const gw=o.c*spec.w+(o.c-1)*gap,gh=o.r*spec.h+(o.r-1)*gap;const x0=(W-gw)/2,y0=(H-gh)/2;const cells=[];for(let r=0;r<o.r;r++)for(let c=0;c<o.c;c++)cells.push({x:mmToPx(x0+c*(spec.w+gap),dpi),y:mmToPx(y0+r*(spec.h+gap),dpi)});
 return{width:mmToPx(W,dpi),height:mmToPx(H,dpi),cols:o.c,rows:o.r,cells,photoW:mmToPx(spec.w,dpi),photoH:mmToPx(spec.h,dpi),gap};}
/* Simple background replacement: flood fill from the border over pixels close to the border's median colour */
function replaceBackground(px,w,h,rgb,tol=38){const n=w*h,seen=new Uint8Array(n),q=new Int32Array(n);let qs=0,qe=0;const samples=[];for(let x=0;x<w;x+=Math.max(1,w>>5)){samples.push(x,(h-1)*w+x>=0?x:0);}
 const border=[];for(let x=0;x<w;x++){border.push(x);}for(let y=0;y<h;y++){border.push(y*w,y*w+w-1);} /* top + sides (not bottom: shoulders) */
 const med=k=>{const a=border.filter((_,i)=>i%7===0).map(p=>px[p*4+k]).sort((a,b)=>a-b);return a[a.length>>1];};const ref=[med(0),med(1),med(2)];const t2=tol*tol;
 const near=p=>{const r=px[p*4]-ref[0],g=px[p*4+1]-ref[1],b=px[p*4+2]-ref[2];return r*r+g*g+b*b<=t2;};for(const p of border)if(!seen[p]&&near(p)){seen[p]=1;q[qe++]=p;}
 while(qs<qe){const p=q[qs++],x=p%w;const nb=[x>0?p-1:-1,x<w-1?p+1:-1,p-w,p+w];for(const m of nb){if(m<0||m>=n||seen[m])continue;if(near(m)){seen[m]=1;q[qe++]=m;}}}
 for(let i=0;i<qe;i++){const p=q[i]*4;px[p]=rgb[0];px[p+1]=rgb[1];px[p+2]=rgb[2];px[p+3]=255;}void samples;return qe/n;}
/* ARPAbet (CMUdict) → IPA (General American) */
const ARPA={AA:'ɑ',AE:'æ',AH:'ʌ',AO:'ɔ',AW:'aʊ',AY:'aɪ',B:'b',CH:'tʃ',D:'d',DH:'ð',EH:'ɛ',ER:'ɝ',EY:'eɪ',F:'f',G:'ɡ',HH:'h',IH:'ɪ',IY:'i',JH:'dʒ',K:'k',L:'l',M:'m',N:'n',NG:'ŋ',OW:'oʊ',OY:'ɔɪ',P:'p',R:'ɹ',S:'s',SH:'ʃ',T:'t',TH:'θ',UH:'ʊ',UW:'u',V:'v',W:'w',Y:'j',Z:'z',ZH:'ʒ'};
function arpabetToIpa(arpa){const ph=arpa.trim().split(/\s+/);let out='';ph.forEach(p=>{const m=p.match(/^([A-Z]+)([012])?$/);if(!m)return;let s=ARPA[m[1]]||'';if(m[2]==='0'){if(m[1]==='AH')s='ə';else if(m[1]==='ER')s='ɚ';}if(m[2]==='1')out+='ˈ';else if(m[2]==='2')out+='ˌ';out+=s;});return'/'+out+'/';}
function parsePron(text){const map=new Map();for(const line of text.split('\n')){if(!line||line[0]==='#')continue;const t=line.indexOf('\t');if(t>0)map.set(line.slice(0,t),line.slice(t+1));}return map;}
/* Split long text into speakable chunks (Chrome stops utterances after ~15 s) keeping character offsets */
function speechChunks(text,max=220){const out=[];const re=/[^.!?;\n]+[.!?;]*\s*|\n+/g;let m,cur='',start=0;while((m=re.exec(text))){if(re.lastIndex===m.index){re.lastIndex++;continue;}if(cur&&(cur+m[0]).length>max){out.push({text:cur,start});start=m.index;cur='';}if(!cur)start=m.index;cur+=m[0];if(cur.length>max){/* hard split on spaces */while(cur.length>max){let k=cur.lastIndexOf(' ',max);if(k<40)k=max;out.push({text:cur.slice(0,k),start});start+=k;cur=cur.slice(k);}}}if(cur.trim())out.push({text:cur,start});return out.filter(c=>c.text.trim());}
function formatBytes(n){return n<1024?n+' B':n<1048576?(n/1024).toFixed(1)+' KB':(n/1048576).toFixed(2)+' MB';}
return{crc32,encodeBMP,encodeICO,setJpegDpi,setPngDpi,resizeDims,PRESETS,searchQuality,SPECS,mmToPx,guides,fitHead,headFromFace,sheet,replaceBackground,arpabetToIpa,parsePron,speechChunks,formatBytes};});
