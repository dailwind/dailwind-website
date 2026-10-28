'use strict';
(()=>{
 const $=id=>document.getElementById(id);
 let source=null,pdfLib=null,ocrWorker=null,creating=null,pixelWorker=null,records=[],busy=false,cancelled=false,token=0,activeReject=null,downloadURL=null,completed=0,batchSize=1;
 const small=()=>ArcCapacity.small;
 const note=text=>{$('ocr-status').textContent=text;};
 function lock(on){busy=on;document.querySelectorAll('[data-ocr-setting]').forEach(n=>n.disabled=on);$('ocr-run').disabled=on||!source;$('ocr-continue').disabled=on||!source;$('ocr-stop').hidden=!on;$('ocr-result-page').disabled=on||!records.length;$('ocr-editor').disabled=on||!records.length;document.querySelectorAll('[data-ocr-export]').forEach(n=>n.disabled=on||!records.length);}
 function guard(promise,ms,label){return new Promise((resolve,reject)=>{let settled=false;const finish=(fn,v)=>{if(settled)return;settled=true;clearTimeout(timer);if(activeReject===abort)activeReject=null;fn(v);};const abort=e=>finish(reject,e);const timer=setTimeout(()=>{ocrWorker?.terminate();ocrWorker=null;pixelWorker?.terminate();pixelWorker=null;finish(reject,Error(label+' timed out. Try a smaller page or lighter settings.'));},ms);activeReject=abort;promise.then(v=>finish(resolve,v),e=>finish(reject,e));});}
 function check(t){if(cancelled||t!==token)throw Error('Stopped. Completed pages are available for download.');}
 function options(){return {dpi:+$('ocr-quality').value,layout:$('ocr-layout').value,enhance:$('ocr-enhance').value,despeckle:$('ocr-despeckle').checked,rotate:+$('ocr-rotate').value,skew:Math.max(-5,Math.min(5,+$('ocr-skew').value||0)),crop:Math.max(0,Math.min(12,+$('ocr-crop').value||0)),embedded:$('ocr-embedded').checked};}
 async function library(){if(!pdfLib){pdfLib=await import('../toolkit/lib/pdf.mjs');pdfLib.GlobalWorkerOptions.workerSrc=new URL('../toolkit/lib/pdf.worker.mjs',location.href).href;}return pdfLib;}
 function clearRecords(){records=[];renderRecords();$('ocr-editor').value='';$('ocr-confidence').textContent='No recognized pages yet.';$('ocr-progress').value=0;}
 async function replaceSource(next){
  if(source?.doc)await source.doc.loadingTask.destroy();source?.bitmap?.close();source=next;clearRecords();$('ocr-source').textContent=next.name+' · '+next.pages+' page(s)';for(const id of ['ocr-from','ocr-to'])$(id).max=next.pages;$('ocr-from').value='1';$('ocr-to').value=String(next.pages);
 }
 async function openFile(file){
  if(busy||!file)return;if(records.length&&!confirm('Open a new source? Download your current OCR results before replacing this session.'))return;
  const isPDF=/\.pdf$/i.test(file.name);if(file.size>(isPDF?(small()?80:500):40)*1024*1024)return note(isPDF?'PDF exceeds this device’s input budget (desktop 500 MB; mobile/low-memory 80 MB). Divide the source first.':'Image limit: 40 MB.');
  if(!isPDF&&!/\.(png|jpe?g|webp)$/i.test(file.name))return note('Use PDF, PNG, JPEG or WebP.');
  lock(true);$('ocr-stop').hidden=true;cancelled=false;const t=++token;
  try{
   note('Opening '+file.name+' on this device…');
   if(isPDF){const lib=await library();const task=lib.getDocument({data:new Uint8Array(await file.arrayBuffer()),isEvalSupported:false,standardFontDataUrl:new URL('../toolkit/lib/standard_fonts/',location.href).href,wasmUrl:new URL('../toolkit/lib/wasm/',location.href).href});let doc;try{doc=await guard(task.promise,60000,'PDF loading');}catch(e){await task.destroy();throw e;}if(doc.numPages>20000){await doc.loadingTask.destroy();throw Error('PDF limit: 20,000 pages. Split the book first.');}await replaceSource({kind:'pdf',name:file.name,doc,pages:doc.numPages});}
   else{const bitmap=await createImageBitmap(file);if(bitmap.width*bitmap.height>40000000){bitmap.close();throw Error('Image limit: 40 megapixels. Resize the image first.');}await replaceSource({kind:'image',name:file.name,bitmap,pages:1});}
   await canvasFor(1,options(),t);note('Source ready. Preview the settings, then run English OCR.');
  }catch(e){note(e.message||'Could not open this source. Check the file; password-protected PDFs must be unlocked first.');}finally{lock(false);}
 }
 function fit(width,height,max){const scale=Math.min(1,Math.sqrt(max/(width*height)));return {width:Math.max(1,Math.round(width*scale)),height:Math.max(1,Math.round(height*scale))};}
 async function pixels(canvas,o,t){
  if(o.enhance==='original')return;
  const ctx=canvas.getContext('2d',{willReadFrequently:true}),image=ctx.getImageData(0,0,canvas.width,canvas.height);
  pixelWorker??=new Worker('../assets/ocr-preprocess-worker.js?v=20261028');
  const promise=new Promise((resolve,reject)=>{pixelWorker.onmessage=({data})=>data.error?reject(Error(data.error)):resolve(data.buffer);pixelWorker.onerror=()=>reject(Error('Image enhancement failed. Try Original image.'));pixelWorker.postMessage({buffer:image.data.buffer,width:canvas.width,height:canvas.height,mode:o.enhance,despeckle:o.despeckle},[image.data.buffer]);});
  const buffer=await guard(promise,30000,'Image enhancement');check(t);ctx.putImageData(new ImageData(new Uint8ClampedArray(buffer),canvas.width,canvas.height),0,0);
 }
 async function canvasFor(pageNo,o,t){
  check(t);const cap=matchMedia('(max-width:760px)').matches?4000000:8000000;let canvas=document.createElement('canvas');
  if(source.kind==='pdf'){
   const page=await source.doc.getPage(pageNo);check(t);const basic=page.getViewport({scale:o.dpi/72});const size=fit(basic.width,basic.height,cap);const viewport=page.getViewport({scale:basic.scale*size.width/basic.width});canvas.width=Math.max(1,Math.floor(viewport.width));canvas.height=Math.max(1,Math.floor(viewport.height));
   try{await guard(page.render({canvasContext:canvas.getContext('2d'),viewport,background:'rgb(255,255,255)'}).promise,60000,'PDF rendering');}finally{page.cleanup();}
  }else{const b=source.bitmap;const targetScale=Math.min(2,Math.max(1,2000/Math.max(b.width,b.height)));const size=fit(b.width*targetScale,b.height*targetScale,cap);canvas.width=size.width;canvas.height=size.height;const c=canvas.getContext('2d');c.fillStyle='#fff';c.fillRect(0,0,canvas.width,canvas.height);c.drawImage(b,0,0,canvas.width,canvas.height);}
  check(t);
  if(o.crop){const w=Math.round(canvas.width*(1-o.crop/50)),h=Math.round(canvas.height*(1-o.crop/50)),next=document.createElement('canvas');next.width=w;next.height=h;next.getContext('2d').drawImage(canvas,(canvas.width-w)/2,(canvas.height-h)/2,w,h,0,0,w,h);canvas.width=canvas.height=1;canvas=next;}
  const angle=(o.rotate+o.skew)*Math.PI/180;
  if(angle){const w=canvas.width,h=canvas.height,next=document.createElement('canvas');const bounds=fit(Math.ceil(Math.abs(w*Math.cos(angle))+Math.abs(h*Math.sin(angle))),Math.ceil(Math.abs(h*Math.cos(angle))+Math.abs(w*Math.sin(angle))),cap);next.width=bounds.width;next.height=bounds.height;const ctx=next.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,next.width,next.height);ctx.translate(next.width/2,next.height/2);const scale=Math.min(next.width/(Math.abs(w*Math.cos(angle))+Math.abs(h*Math.sin(angle))),next.height/(Math.abs(h*Math.cos(angle))+Math.abs(w*Math.sin(angle))));ctx.scale(scale,scale);ctx.rotate(angle);ctx.drawImage(canvas,-w/2,-h/2);canvas.width=canvas.height=1;canvas=next;}
  await pixels(canvas,o,t);check(t);const preview=$('ocr-canvas');preview.width=canvas.width;preview.height=canvas.height;preview.getContext('2d').drawImage(canvas,0,0);$('ocr-preview-note').textContent='Page '+pageNo+' · '+canvas.width+' × '+canvas.height+' pixels · '+o.enhance+' · '+(cap===4000000?'mobile':'desktop')+' image limit';return canvas;
 }
 async function engine(t){
  if(ocrWorker)return ocrWorker;
  const base=new URL('../toolkit/ocr/',location.href).href;
  creating=Tesseract.createWorker('eng',1,{workerPath:base+'worker.min.js',corePath:base,langPath:base.replace(/\/$/,''),workerBlobURL:false,cacheMethod:'none',gzip:true,logger:m=>{if(!busy||cancelled)return;note('English OCR · '+m.status+(typeof m.progress==='number'?' · '+Math.round(m.progress*100)+'%':''));if(m.status==='recognizing text')$('ocr-progress').value=(completed+Math.min(1,m.progress||0))/batchSize;}});
  creating.then(w=>{if(t!==token||cancelled)w.terminate();},()=>{});
  ocrWorker=await guard(creating,120000,'English engine loading');check(t);return ocrWorker;
 }
 function renderRecords(selected){
  records.sort((a,b)=>a.page-b.page);const select=$('ocr-result-page');select.replaceChildren();for(const r of records){const option=document.createElement('option');option.value=r.page;option.textContent='Page '+r.page+(r.error?' · needs retry':r.embedded?' · embedded text':' · score '+Math.round(r.confidence))+(r.edited?' · edited':'');select.append(option);}if(selected)select.value=String(selected);if(!records.length){const option=document.createElement('option');option.textContent='No recognized pages yet';select.append(option);}
  $('ocr-summary').textContent=records.length+' page result(s) · '+records.filter(r=>r.error).length+' error(s) · '+records.filter(r=>!r.error&&!r.embedded&&r.confidence<65).length+' low-score page(s) for review.';
 }
 function displayRecord(){const r=records.find(r=>r.page===+$('ocr-result-page').value);if(!r)return;$('ocr-editor').value=r.text;const info=$('ocr-confidence');info.dataset.review=String(!!r.error||(!r.embedded&&r.confidence<65));info.textContent=r.error?'Page needs another attempt: '+r.error:r.embedded?'Embedded PDF text used; this page was not OCR-recognized.':('Engine confidence score: '+r.confidence.toFixed(1)+' / 100.'+(r.confidence<65?' Low score: careful review is recommended.':' Review against the scan before research use.'));}
 async function run(){
  if(busy||!source)return;
  const from=+$('ocr-from').value,to=+$('ocr-to').value;if(!Number.isInteger(from)||!Number.isInteger(to)||from<1||to<from||to>source.pages )return note('Choose a valid page range within this source. All selected pages can run sequentially.');
  if(records.some(r=>r.page>=from&&r.page<=to&&r.edited)&&!confirm('Rerun this range and replace your edited page text? Download the current version first.'))return;
  const o=options();records=records.filter(r=>r.page<from||r.page>to);cancelled=false;const t=++token;completed=0;batchSize=to-from+1;lock(true);$('ocr-progress').value=0;
  try{
   for(let page=from;page<=to;page++){
    check(t);note('Preparing page '+page+' of '+to+'…');let entry;
    try{
     let embedded='';if(o.embedded&&source.kind==='pdf'){const p=await source.doc.getPage(page),content=await guard(p.getTextContent(),30000,'Embedded text reading');embedded=content.items.map(x=>x.str+(x.hasEOL?'\n':' ')).join('');p.cleanup();}
     let canvas=null;
     if(embedded.trim().length>=30)entry={page,text:embedded.trim(),confidence:null,embedded:true,settings:o};
     else{canvas=await canvasFor(page,o,t);const worker=await engine(t);await worker.setParameters({tessedit_pageseg_mode:o.layout,preserve_interword_spaces:'1',user_defined_dpi:String(o.dpi)});const result=await guard(worker.recognize(canvas,{}, {text:true,blocks:false,hocr:false,tsv:false}),180000,'Page recognition');check(t);entry={page,text:result.data.text||'',confidence:Number(result.data.confidence)||0,embedded:false,settings:o};}if(canvas)canvas.width=canvas.height=1;

    }catch(e){check(t);entry={page,text:'',error:e.message,confidence:0,settings:o};}
    if(records.reduce((n,r)=>n+r.text.length,0)+(entry.text?.length||0)>(small()?20000000:100000000))throw Error('OCR text budget reached. Download completed text and use another source/range.');
    records.push(entry);completed++;$('ocr-progress').value=completed/batchSize;if(completed===1||completed%10===0||page===to){renderRecords(page);displayRecord();}await new Promise(r=>setTimeout(r,0));
   }
   note('Batch complete. Review the recognized pages and download your text. Difficult scans may need another enhancement or manual correction.');
  }catch(e){note(e.message);}finally{lock(false);renderRecords();if(records.length)displayRecord();}
 }
 async function preview(page){if(busy||!source)return;cancelled=false;const t=++token;lock(true);try{await canvasFor(page||+$('ocr-from').value||1,options(),t);note('Preview ready. Check orientation, cropping and letter clarity before running OCR.');}catch(e){note(e.message);}finally{lock(false);}}
 function stop(){cancelled=true;token++;ocrWorker?.terminate();ocrWorker=null;pixelWorker?.terminate();pixelWorker=null;activeReject?.(Error('Stopped. Completed pages are available for download.'));note('Stopping. Completed pages will remain available.');}
 function combined(){return records.map(r=>'[Page '+r.page+']\n'+(r.error?'[OCR failed: '+r.error+']':r.text)).join('\n\n');}
 function download(data,name,type){if(downloadURL)URL.revokeObjectURL(downloadURL);downloadURL=URL.createObjectURL(new Blob([data],{type}));$('ocr-download-link').href=downloadURL;$('ocr-download-link').download=name;$('ocr-download-name').textContent=name;$('ocr-download').showModal();}
 $('ocr-add').addEventListener('click',()=>$('ocr-file').click());$('ocr-file').addEventListener('change',async e=>{await openFile(e.target.files[0]);e.target.value='';});
 $('ocr-sample').addEventListener('click',async()=>{if(busy)return;const c=document.createElement('canvas');c.width=1200;c.height=1600;const x=c.getContext('2d');x.fillStyle='#f8f4e9';x.fillRect(0,0,c.width,c.height);x.fillStyle='#242420';x.font='42px Georgia';x.fillText('THE STUDY OF LANGUAGE',115,190);x.font='30px Georgia';const lines=['A printed English sample for the OCR desk.','Language connects people across time.','Old books preserve ideas, stories and evidence.','Careful reading brings the written record to life.','','Researchers examine words and patterns.','A clear scan helps a machine recognize letters.','Review every name, date and unusual spelling.','','This page is an original demonstration sample.','No historical source or author is claimed.'];lines.forEach((line,i)=>x.fillText(line,115,300+i*65));x.font='24px Georgia';x.fillText('1',590,1490);const blob=await new Promise(resolve=>c.toBlob(resolve,'image/png'));await openFile(new File([blob],'english-sample-scan.png',{type:'image/png'}));});
 $('ocr-run').addEventListener('click',run);$('ocr-continue').addEventListener('click',()=>{if(busy||!source)return;const last=records.length?Math.max(...records.map(r=>r.page)):0;if(last>=source.pages)return note('All pages have a result. Choose a page range to retry any failed pages.');$('ocr-from').value=last+1;$('ocr-to').value=source.pages;run();});$('ocr-stop').addEventListener('click',stop);$('ocr-preview-button').addEventListener('click',()=>preview());
 $('ocr-result-page').addEventListener('change',async()=>{displayRecord();const r=records.find(r=>r.page===+$('ocr-result-page').value);if(!r||busy)return;cancelled=false;const t=++token;lock(true);try{await canvasFor(r.page,r.settings,t);}catch(e){note(e.message);}finally{lock(false);}});
 $('ocr-editor').addEventListener('input',()=>{const r=records.find(r=>r.page===+$('ocr-result-page').value);if(r){r.text=$('ocr-editor').value;r.edited=true;}});
 const name=ext=>CorpusExports.names([{name:source?.name||'English-OCR'}],ext)[0];
 $('ocr-txt').addEventListener('click',()=>download(combined(),name('txt'),'text/plain;charset=utf-8'));
 $('ocr-word').addEventListener('click',()=>download(CorpusExports.docx(combined()),name('docx'),'application/vnd.openxmlformats-officedocument.wordprocessingml.document'));
 $('ocr-zip').addEventListener('click',()=>{const base=name('txt').replace(/\.txt$/,'');download(CorpusExports.zip(records.map(r=>({name:base+'-page-'+r.page+'.txt',data:r.error?'[OCR failed: '+r.error+']':r.text}))),base+'-pages.zip','application/zip');});
 $('ocr-report').addEventListener('click',()=>download(JSON.stringify({source:source?.name,engine:'Tesseract.js 7.0.0 / English best-int LSTM',method:'Local OCR; confidence is not verified accuracy',pages:records.map(({text,...r})=>({...r,characters:text.length}))},null,2),name('json'),'application/json'));
 $('ocr-download-close').addEventListener('click',()=>$('ocr-download').close());
 const c=$('ocr-canvas').getContext('2d');c.fillStyle='#faf8f2';c.fillRect(0,0,600,760);c.fillStyle='#a0a7ae';c.font='22px Georgia';c.fillText('Your page preview',200,380);lock(false);
})();
