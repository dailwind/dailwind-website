'use strict';
(()=>{
 const $=id=>document.getElementById(id),small=()=>matchMedia('(max-width:760px)').matches;
 let file=null,pages=0,mode='split',worker=null,loaded=false,pdf=null,pdfTask=null,renderTask=null,results=[],busy=false,cancelled=false,serial=0,runToken=0,zipURL=null;
 const pending=new Map(),bytes=n=>n>=1048576?(n/1048576).toFixed(2)+' MB':(n/1024).toFixed(1)+' KB',say=s=>{$('pdf-status').textContent=s;};
 function lock(on){busy=on;document.querySelectorAll('[data-pdf-setting]').forEach(n=>n.disabled=on);$('pdf-run').disabled=on||!pages;$('pdf-stop').hidden=!on;updateZip();}
 function stopWorker(error){worker?.terminate();worker=null;loaded=false;for(const p of pending.values()){clearTimeout(p.timer);p.reject(error);}pending.clear();}
 function request(type,payload={},transfer=[]){
  if(!worker){worker=new Worker('../assets/pdf-tools-worker.js?v=20261028');worker.onmessage=({data})=>{const p=pending.get(data.id);if(!p)return;clearTimeout(p.timer);pending.delete(data.id);data.error?p.reject(Error(data.error)):p.resolve(data.result);};worker.onerror=()=>stopWorker(Error('The PDF worker could not run. Reload the hosted page and retry.'));}
  return new Promise((resolve,reject)=>{const id=++serial,timer=setTimeout(()=>stopWorker(Error('PDF processing timed out. Try a smaller file or page range.')),120000);pending.set(id,{resolve,reject,timer});worker.postMessage({id,type,payload},transfer);});
 }
 async function load(){if(loaded)return;const buffer=await file.arrayBuffer();const info=await request('load',{buffer},[buffer]);loaded=true;pages=info.pages;}
 function clearResults(){for(const r of results)URL.revokeObjectURL(r.url);results=[];$('pdf-downloads').replaceChildren();if(zipURL)URL.revokeObjectURL(zipURL);zipURL=null;updateZip();}
 function updateZip(){const size=results.reduce((n,r)=>n+r.blob.size,0),limit=(small()?25:100)*1048576;$('pdf-zip').disabled=busy||!results.length||size>limit;$('pdf-summary').textContent=results.length+' generated file(s) · '+bytes(size)+(size>limit?' · ZIP exceeds this device’s limit; download parts individually.':'');}
 function plan(){if(!pages)return[];return ArcPDFParts.plan(pages,{first:+$('pdf-first').value,last:+$('pdf-last').value,method:$('pdf-method').value,amount:+$('pdf-amount').value,custom:$('pdf-custom').value});}
 function previewPlan(){
  $('amount-field').hidden=$('pdf-method').value==='custom';$('custom-field').hidden=$('pdf-method').value!=='custom';$('pdf-amount').max=$('pdf-method').value==='pages'?Math.max(1,pages):1000;$('amount-label').textContent=$('pdf-method').value==='pages'?'Pages per part':'Number of parts';$('pdf-plan').replaceChildren();if(!pages)return;
  try{const ranges=plan();const summary=document.createElement('p');summary.className='tiny';summary.textContent=ranges.length+' part(s) · '+ranges.reduce((n,r)=>n+r.to-r.from+1,0)+' included pages';$('pdf-plan').append(summary);
   ranges.slice(0,40).forEach((r,i)=>{const card=document.createElement('div');card.className='pdf-plan-card';const title=document.createElement('strong');title.textContent='Part '+(i+1);const info=document.createElement('span');info.textContent='Pages '+r.from+'–'+r.to+' · '+(r.to-r.from+1)+' pages';const name=document.createElement('small');name.textContent=ArcPDFParts.partName(file.name,i,ranges.length,r);card.append(title,info,name);$('pdf-plan').append(card);});if(ranges.length>40){const p=document.createElement('p');p.className='tiny';p.textContent='First 40 parts shown. All '+ranges.length+' parts will be generated.';$('pdf-plan').append(p);}
  }catch(e){const p=document.createElement('p');p.className='error';p.textContent=e.message;$('pdf-plan').append(p);}
 }
 function setMode(value){if(busy)return;mode=value;$('mode-split').setAttribute('aria-pressed',String(mode==='split'));$('mode-compress').setAttribute('aria-pressed',String(mode==='compress'));$('split-options').hidden=mode!=='split';$('compress-explanation').hidden=mode!=='compress';$('pdf-run').textContent=mode==='split'?'Create PDF parts':'Compress PDF';}
 async function open(f){
  if(busy||!f)return;const limit=(small()?60:200)*1048576;if(!/\.pdf$/i.test(f.name))return say('Please choose a PDF file.');if(f.size>limit)return say('This device accepts PDFs up to '+bytes(limit)+'.');if(results.length&&!confirm('Open another PDF? Download the current results before replacing this session.'))return;
  lock(true);cancelled=false;runToken++;stopWorker(Error('Replacing source'));clearResults();if(pdf)await pdf.destroy();pdf=null;file=f;pages=0;
  try{say('Opening '+f.name+' locally…');await load();$('pdf-first').value='1';$('pdf-last').value=pages;$('pdf-amount').value=Math.min(10,pages);$('pdf-source').textContent=f.name+' · '+pages.toLocaleString()+' pages · '+bytes(f.size);previewPlan();say('PDF ready. Choose your parts or compression settings. Original file stays unchanged.');}catch(e){say(e.message);pages=0;}finally{lock(false);}
 }
 function check(t){if(cancelled||t!==runToken)throw Error('Stopped. Completed PDF parts remain available below.');}
 async function raster(range,options,t){
  if(!pdf){const lib=await import('../toolkit/lib/pdf.mjs');lib.GlobalWorkerOptions.workerSrc=new URL('../toolkit/lib/pdf.worker.mjs',location.href).href;pdfTask=lib.getDocument({data:new Uint8Array(await file.arrayBuffer()),isEvalSupported:false,standardFontDataUrl:new URL('../toolkit/lib/standard_fonts/',location.href).href,wasmUrl:new URL('../toolkit/lib/wasm/',location.href).href});pdf=await pdfTask.promise;}
  check(t);await request('raster-start');
  for(let n=range.from;n<=range.to;n++){
   check(t);say('Rendering page '+n+' of '+pages+' · completed parts: '+results.length);const page=await pdf.getPage(n),original=page.getViewport({scale:1}),wanted=page.getViewport({scale:options.dpi/72});const factor=Math.min(1,Math.sqrt((small()?2000000:4000000)/(wanted.width*wanted.height)),8192/wanted.width,8192/wanted.height),viewport=page.getViewport({scale:options.dpi/72*factor}),canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.floor(viewport.width));canvas.height=Math.max(1,Math.floor(viewport.height));
   try{renderTask=page.render({canvasContext:canvas.getContext('2d'),viewport,background:'rgb(255,255,255)'});await renderTask.promise;renderTask=null;check(t);const jpg=await new Promise(resolve=>canvas.toBlob(resolve,'image/jpeg',options.quality));if(!jpg)throw Error('The browser could not create this page image. Try lower resolution.');const buffer=await jpg.arrayBuffer();await request('raster-page',{buffer,width:original.width,height:original.height},[buffer]);}finally{canvas.width=canvas.height=1;page.cleanup();}
  }
  return request('raster-save');
 }
 function append(blob,name,range,detail){
  if(results.reduce((n,r)=>n+r.blob.size,0)+blob.size>(small()?100:300)*1048576)throw Error('Output memory limit reached. Download completed parts and use a smaller page range.');
  const url=URL.createObjectURL(blob);results.push({blob,name,range,url});const row=document.createElement('div');row.className='pdf-download';const copy=document.createElement('div'),title=document.createElement('strong'),info=document.createElement('small'),link=document.createElement('a');title.textContent=name;info.textContent='Pages '+range.from+'–'+range.to+' · '+bytes(blob.size)+(detail?' · '+detail:'');link.textContent='Download PDF';link.className='button';link.href=url;link.download=name;copy.append(title,info);row.append(copy,link);$('pdf-downloads').append(row);updateZip();
 }
 async function run(){
  if(busy||!pages)return;const options={scan:$('pdf-treatment').value==='scan',dpi:+$('pdf-dpi').value,quality:+$('pdf-quality').value/100};if(options.scan&&!$('pdf-scan-ack').checked)return say('Please confirm the image-only scan-mode tradeoff before continuing.');
  let ranges;try{ranges=mode==='split'?plan():[{from:1,to:pages}];}catch(e){return say(e.message);}if(results.length&&!confirm('Replace the generated results? Download any files you want to keep first.'))return;
  clearResults();lock(true);cancelled=false;const t=++runToken;$('pdf-progress').value=0;
  try{
   await load();check(t);
   for(let i=0;i<ranges.length;i++){
    const range=ranges[i];say('Creating '+(mode==='split'?'part '+(i+1)+' of '+ranges.length:'compressed copy')+'…');
    const data=options.scan?await raster(range,options,t):await request(mode==='compress'?'optimize':'part',range);check(t);
    let blob=new Blob([data],{type:'application/pdf'}),detail='';
    if(mode==='compress'){
     if(!options.scan&&blob.size>=file.size){blob=file;detail='No smaller structural result; original-size copy.';}
     else{const change=(1-blob.size/file.size)*100;detail=change>0?change.toFixed(1)+'% smaller than source':Math.abs(change).toFixed(1)+'% larger; try lower scan quality.';}
    }
    const name=mode==='split'?ArcPDFParts.partName(file.name,i,ranges.length,range):ArcPDFParts.base(file.name)+(options.scan?'-compressed-scan.pdf':'-optimized.pdf');append(blob,name,range,detail);$('pdf-progress').value=(i+1)/ranges.length;
   }
   say('Ready. '+results.length+' PDF file(s) generated locally. Review the PDFs before sharing.');
  }catch(e){say(cancelled?'Stopped. Completed PDF parts remain available below.':e.message);}finally{lock(false);$('pdf-results').scrollIntoView({block:'start',behavior:'auto'});}
 }
 $('pdf-open').addEventListener('click',()=>$('pdf-file').click());$('pdf-file').addEventListener('change',async e=>{await open(e.target.files[0]);e.target.value='';});
 $('mode-split').addEventListener('click',()=>setMode('split'));$('mode-compress').addEventListener('click',()=>setMode('compress'));
 for(const id of ['pdf-first','pdf-last','pdf-method','pdf-amount','pdf-custom'])$(id).addEventListener('input',previewPlan);
 $('pdf-treatment').addEventListener('change',()=>{$('scan-options').hidden=$('pdf-treatment').value!=='scan';});$('pdf-quality').addEventListener('input',()=>{$('pdf-quality-label').textContent=$('pdf-quality').value+' / 100';});
 $('pdf-run').addEventListener('click',run);$('pdf-stop').addEventListener('click',()=>{cancelled=true;runToken++;renderTask?.cancel();stopWorker(Error('Stopped. Completed PDF parts remain available below.'));say('Stopping. Completed parts remain available.');});
 $('pdf-zip').addEventListener('click',async()=>{if(busy||!results.length)return;lock(true);$('pdf-stop').hidden=true;try{say('Preparing ZIP on this device…');const files=[];for(const r of results)files.push({name:r.name,data:new Uint8Array(await r.blob.arrayBuffer())});const blob=new Blob([CorpusExports.zip(files)],{type:'application/zip'});if(zipURL)URL.revokeObjectURL(zipURL);zipURL=URL.createObjectURL(blob);$('pdf-download-link').href=zipURL;$('pdf-download-link').download=ArcPDFParts.base(file.name)+'-PDF-parts.zip';$('pdf-download-name').textContent=results.length+' PDFs · '+bytes(blob.size);$('pdf-download-dialog').showModal();say('ZIP ready. Individual PDF downloads remain available.');}catch(e){say(e.message);}finally{lock(false);}});
 $('pdf-download-close').addEventListener('click',()=>$('pdf-download-dialog').close());
 $('pdf-demo').addEventListener('click',async()=>{if(busy)return;const response=await fetch('../assets/pdf-demo.pdf');if(!response.ok)return say('Sample PDF could not load.');await open(new File([await response.blob()],'Arc-Sample-Book.pdf',{type:'application/pdf'}));});
 setMode('split');lock(false);
})();
