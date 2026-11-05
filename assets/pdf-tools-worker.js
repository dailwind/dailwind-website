'use strict';
importScripts('../toolkit/pdf-lib/pdf-lib.min.js');
let source=null,draft=null;
self.onmessage=async({data:{id,type,payload={}}})=>{
 try{
  let result;
  if(type==='load'){
   source=await PDFLib.PDFDocument.load(payload.buffer,{updateMetadata:false,throwOnInvalidObject:true});
   const pages=source.getPageCount();if(pages<1||pages>20000){source=null;throw Error('PDF limit: 20,000 pages.');}result={pages};
  }else if(type==='part'){
   if(!source)throw Error('Open a PDF first.');const {from,to}=payload;if(!Number.isInteger(from)||!Number.isInteger(to)||from<1||to<from||to>source.getPageCount())throw Error('Invalid page range.');
   const out=await PDFLib.PDFDocument.create();for(const p of await out.copyPages(source,Array.from({length:to-from+1},(_,i)=>from-1+i)))out.addPage(p);
   out.setProducer('LinguaX Arc PDF Tools');result=await out.save({useObjectStreams:true,objectsPerTick:30});
  }else if(type==='optimize'){
   if(!source)throw Error('Open a PDF first.');result=await source.save({useObjectStreams:true,objectsPerTick:30});
  }else if(type==='raster-start'){draft=await PDFLib.PDFDocument.create();result={ready:true};}
  else if(type==='raster-page'){
   if(!draft||!Number.isFinite(payload.width)||!Number.isFinite(payload.height)||payload.width<=0||payload.height<=0||payload.width>14400||payload.height>14400)throw Error('Invalid rendered page.');
   const image=await draft.embedJpg(payload.buffer);const page=draft.addPage([payload.width,payload.height]);page.drawImage(image,{x:0,y:0,width:payload.width,height:payload.height});result={pages:draft.getPageCount()};
  }else if(type==='raster-save'){if(!draft)throw Error('No rendered pages.');draft.setProducer('LinguaX Arc PDF Tools');result=await draft.save({useObjectStreams:true,objectsPerTick:30});draft=null;}
  else throw Error('Unknown PDF operation.');
  if(result instanceof Uint8Array)self.postMessage({id,result:result.buffer},[result.buffer]);else self.postMessage({id,result});
 }catch(e){self.postMessage({id,error:/encrypt|password/i.test(e.message)?'Encrypted PDFs are not supported. Open an unencrypted copy you are authorized to use.':e.message});}
};
