'use strict';
(()=>{
const LIMITS=window.ArcCapacity?.text||{fileBytes:250*1048576,fileChars:50000000,workspaceChars:100000000,files:500};
const el=t=>document.createElement(t);
function validateFile(f,limits){if(f.size>limits.fileBytes)throw Error(f.name+' exceeds this device’s input-size limit. Use a smaller file or export it as TXT.');}
let pdfPromise,mammothPromise;
async function readFile(f,options={}){const limits={...LIMITS,...options};limits.fileBytes=Math.min(500*1048576,limits.fileBytes);limits.fileChars=Math.min(100000000,limits.fileChars);validateFile(f,limits);const ext=f.name.split('.').at(-1).toLowerCase();let text;
 if(ext==='pdf'){pdfPromise??=import('../toolkit/lib/pdf.mjs');const lib=await pdfPromise;lib.GlobalWorkerOptions.workerSrc=new URL('../toolkit/lib/pdf.worker.mjs',location.href).href;const task=lib.getDocument({data:new Uint8Array(await f.arrayBuffer()),isEvalSupported:false,standardFontDataUrl:new URL('../toolkit/lib/standard_fonts/',location.href).href,wasmUrl:new URL('../toolkit/lib/wasm/',location.href).href});const timer=setTimeout(()=>task.destroy(),600000);try{const doc=await task.promise;if(doc.numPages>(limits.pages||10000))throw Error('PDF page limit exceeded. Divide the source first.');text='';for(let i=1;i<=doc.numPages;i++){if(limits.cancelled?.())throw Error('Stopped reading PDF.');limits.onProgress?.(i);const page=await doc.getPage(i),c=await page.getTextContent();text+=c.items.map(x=>x.str+(x.hasEOL?'\n':' ')).join('')+'\n\f\n';page.cleanup();if(text.length>limits.fileChars)throw Error('PDF exceeds the selected character budget.');}}finally{clearTimeout(timer);await task.destroy();}}
 else if(ext==='docx'){if(!mammothPromise)mammothPromise=new Promise((resolve,reject)=>{const s=el('script');s.src='../toolkit/lib/mammoth.browser.js';s.onload=()=>resolve(window.mammoth);s.onerror=()=>{mammothPromise=null;reject(Error('DOCX reader could not load.'));};document.head.append(s);});const buffer=await f.arrayBuffer();checkZIP(buffer);text=(await (await mammothPromise).extractRawText({arrayBuffer:buffer},{externalFileAccess:false})).value;}
 else if(['txt','text','md','csv','conllu','conll'].includes(ext))text=await f.text();else throw Error('Use TXT, DOCX, PDF or CoNLL-U; old .doc files are not supported.');
 if(!text.trim())throw Error('No readable text in '+f.name+'. Scanned PDFs need OCR.');if(text.length>limits.fileChars)throw Error(f.name+' exceeds the selected character budget.');return text;
}
function checkZIP(buffer){const v=new DataView(buffer);let e=-1;for(let i=v.byteLength-22;i>=Math.max(0,v.byteLength-65557);i--)if(v.getUint32(i,true)===0x06054b50){e=i;break;}if(e<0)throw Error('Invalid DOCX ZIP.');let p=v.getUint32(e+16,true),total=0;const count=v.getUint16(e+10,true);if(count>1024)throw Error('DOCX has too many archive entries.');for(let i=0;i<count;i++){if(p+46>v.byteLength||v.getUint32(p,true)!==0x02014b50)throw Error('Invalid DOCX directory.');total+=v.getUint32(p+24,true);if(total>100*1024*1024)throw Error('DOCX expands beyond 100 MB. Export as TXT.');p+=46+v.getUint16(p+28,true)+v.getUint16(p+30,true)+v.getUint16(p+32,true);}}

window.PreparationFiles={readFile,LIMITS};
})();
