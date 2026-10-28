'use strict';
(()=>{
const LIMITS={fileBytes:20*1024*1024,fileChars:10000000,workspaceChars:20000000,files:50};
const el=t=>document.createElement(t);
function validateFile(f){if(f.size>LIMITS.fileBytes)throw Error(f.name+' exceeds 20 MB. Use a smaller file or export it as TXT.');}
let pdfPromise,mammothPromise;
async function readFile(f){validateFile(f);const ext=f.name.split('.').at(-1).toLowerCase();let text;
 if(ext==='pdf'){pdfPromise??=import('../toolkit/lib/pdf.mjs');const lib=await pdfPromise;lib.GlobalWorkerOptions.workerSrc=new URL('../toolkit/lib/pdf.worker.mjs',location.href).href;const task=lib.getDocument({data:new Uint8Array(await f.arrayBuffer()),isEvalSupported:false,standardFontDataUrl:new URL('../toolkit/lib/standard_fonts/',location.href).href,wasmUrl:new URL('../toolkit/lib/wasm/',location.href).href});const timer=setTimeout(()=>task.destroy(),60000);try{const doc=await task.promise;if(doc.numPages>1000)throw Error('PDF limit: 1,000 pages.');text='';for(let i=1;i<=doc.numPages;i++){const page=await doc.getPage(i),c=await page.getTextContent();text+=c.items.map(x=>x.str+(x.hasEOL?'\n':' ')).join('')+'\n\f\n';page.cleanup();if(text.length>LIMITS.fileChars)throw Error('PDF exceeds 10,000,000 characters.');}}finally{clearTimeout(timer);await task.destroy();}}
 else if(ext==='docx'){if(!mammothPromise)mammothPromise=new Promise((resolve,reject)=>{const s=el('script');s.src='../toolkit/lib/mammoth.browser.js';s.onload=()=>resolve(window.mammoth);s.onerror=()=>{mammothPromise=null;reject(Error('DOCX reader could not load.'));};document.head.append(s);});const buffer=await f.arrayBuffer();checkZIP(buffer);text=(await (await mammothPromise).extractRawText({arrayBuffer:buffer},{externalFileAccess:false})).value;}
 else if(['txt','text','md','csv','conllu','conll'].includes(ext))text=await f.text();else throw Error('Use TXT, DOCX, PDF or CoNLL-U; old .doc files are not supported.');
 if(!text.trim())throw Error('No readable text in '+f.name+'. Scanned PDFs need OCR.');if(text.length>LIMITS.fileChars)throw Error(f.name+' exceeds 10,000,000 characters.');return text;
}
function checkZIP(buffer){const v=new DataView(buffer);let e=-1;for(let i=v.byteLength-22;i>=Math.max(0,v.byteLength-65557);i--)if(v.getUint32(i,true)===0x06054b50){e=i;break;}if(e<0)throw Error('Invalid DOCX ZIP.');let p=v.getUint32(e+16,true),total=0;const count=v.getUint16(e+10,true);if(count>1024)throw Error('DOCX has too many archive entries.');for(let i=0;i<count;i++){if(p+46>v.byteLength||v.getUint32(p,true)!==0x02014b50)throw Error('Invalid DOCX directory.');total+=v.getUint32(p+24,true);if(total>30*1024*1024)throw Error('DOCX expands beyond 30 MB. Export as TXT.');p+=46+v.getUint16(p+28,true)+v.getUint16(p+30,true)+v.getUint16(p+32,true);}}

window.PreparationFiles={readFile,LIMITS};
})();
