'use strict';
importScripts('../toolkit/pdf-lib/pdf-lib.min.js','../toolkit/linguistics/fontkit-1.1.1.js');
let fontBytes;
async function textPDF(text,progress=()=>{}){
 if(typeof text!=='string'||!text.trim())throw Error('There is no text to export.');if(text.length>2000000)throw Error('Text-only PDF supports up to 2,000,000 characters per document. Use TXT/Word or divide your text first.');
 fontBytes??=await(async()=>{const r=await fetch('../toolkit/lib/standard_fonts/LiberationSans-Regular.ttf');if(!r.ok)throw Error('The local PDF font could not load.');return new Uint8Array(await r.arrayBuffer());})();
 const doc=await PDFLib.PDFDocument.create();doc.registerFontkit(DailwindFontkit);const font=await doc.embedFont(fontBytes,{subset:true}),supported=new Set(font.getCharacterSet()),textN=text.normalize('NFC').replace(/\r\n?/g,'\n').replace(/\t/g,'    '),size=11,step=16,margin=54,maxWidth=487.28;
 for(const ch of textN)if(!/[\n\f]/u.test(ch)&&!supported.has(ch.codePointAt(0)))throw Error('The PDF font cannot represent U+'+ch.codePointAt(0).toString(16).toUpperCase()+'. No character was discarded. Choose UTF-8 TXT or Word.');
 let page,y,pages=0,done=0;const add=()=>{if(++pages>2000)throw Error('PDF page budget exceeded. Use a smaller document or TXT/Word.');page=doc.addPage([595.28,841.89]);y=841.89-margin-size;};add();const line=s=>{if(y<margin)add();if(s)page.drawText(s,{x:margin,y,size,font,color:PDFLib.rgb(.10,.13,.18)});y-=step;};
 function wrap(p){if(!p){line('');return;}let current='';for(const token of p.match(/\S+| +/gu)||[]){if(font.widthOfTextAtSize(current+token,size)<=maxWidth){current+=token;continue;}if(current.trim()){line(current.trimEnd());current='';}if(!token.trim())continue;if(font.widthOfTextAtSize(token,size)<=maxWidth){current=token;continue;}for(const ch of token){if(font.widthOfTextAtSize(current+ch,size)>maxWidth){line(current);current='';}current+=ch;}}if(current.trim())line(current.trimEnd());}
 for(const [i,section]of textN.split('\f').entries()){if(i)add();for(const p of section.split('\n')){wrap(p);done+=p.length+1;if(done%10000<p.length+1)progress(pages);}}doc.setTitle('Dailwind text-only document');doc.setProducer('Dailwind File Converter / pdf-lib / fontkit');return doc.save();
}
self.DailwindTextPDF=textPDF;self.onmessage=async({data})=>{try{const bytes=await textPDF(data.text,pages=>self.postMessage({progress:pages}));self.postMessage({bytes},[bytes.buffer]);}catch(e){self.postMessage({error:e.message||'PDF export could not finish on this device.'});}};
