'use strict';
// Shared helpers for Dailwind research desks. Everything runs on this device; nothing is uploaded.
(()=>{
const $=id=>document.getElementById(id);
const el=(tag,text,cls)=>{const e=document.createElement(tag);if(text!=null)e.textContent=text;if(cls)e.className=cls;return e;};
const words=t=>(String(t).toLowerCase().normalize('NFC').match(/[\p{L}\p{N}]+(?:['’][\p{L}]+)*/gu)||[]);
const ABBR=/(?:^|\s)(?:mr|mrs|ms|dr|prof|st|vs|etc|e\.g|i\.e|fig|no|vol|pp|al|cf)\.$/i;
const sentences=t=>{const out=[];let buf='';for(const piece of String(t).replace(/\s+/g,' ').trim().split(/(?<=[.!?。！？]["'”’)\]]?)\s+|(?<=[。！？])/u)){buf=buf?buf+' '+piece:piece;if(!ABBR.test(buf)&&!/(?:^|\s)\p{Lu}\.$/u.test(buf)){out.push(buf.trim());buf='';}}if(buf.trim())out.push(buf.trim());return out.filter(Boolean);};
const paragraphsToSentences=t=>String(t).split(/\n\s*\n|\r?\n/).flatMap(p=>sentences(p));
// "### Title" lines split a box into several named texts.
const splitTexts=(t,prefix='Text')=>{const parts=[];let cur=null;for(const line of String(t).split(/\r?\n/)){const m=line.match(/^\s*#{3}\s*(.+?)\s*$/);if(m){cur={name:m[1],text:''};parts.push(cur);}else{if(!cur){cur={name:prefix+' 1',text:''};parts.push(cur);}cur.text+=line+'\n';}}return parts.filter(p=>p.text.trim()).map((p,i)=>({name:p.name||prefix+' '+(i+1),text:p.text.trim()}));};
const download=(name,text,type='text/plain')=>{const a=el('a');a.href=URL.createObjectURL(new Blob([text],{type:type+';charset=utf-8'}));a.download=name;document.body.append(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},500);};
const csvCell=v=>{const s=v==null?'':String(v);return /[",\n\r]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s;};
const toCSV=rows=>'\ufeff'+rows.map(r=>r.map(csvCell).join(',')).join('\r\n');
const table=(target,head,rows,opts={})=>{const t=$(target);t.replaceChildren();const thead=el('thead'),tr=el('tr');head.forEach(h=>{const th=el('th',h);th.scope='col';tr.append(th);});thead.append(tr);const tb=el('tbody');rows.forEach((r,ri)=>{const row=el('tr');r.forEach((c,ci)=>{const cell=el(ci===0&&opts.rowHeads?'th':'td');if(ci===0&&opts.rowHeads)cell.scope='row';if(c instanceof Node)cell.append(c);else cell.textContent=c==null?'':String(c);if(opts.cell)opts.cell(cell,c,ri,ci);row.append(cell);});tb.append(row);});t.append(thead,tb);};
const status=(msg)=>{const s=$('lab-status');if(s)s.textContent=msg;};
const CAP=(globalThis.ArcCapacity&&globalThis.ArcCapacity.desk)||{fileBytes:24*1048576,chars:12000000,texts:500,styloTexts:300,styloWork:200000000,alignSentences:30000,alignCells:6000000,responses:50000};
const num=n=>Number(n).toLocaleString('en-US'),mb=b=>Math.round(b/1048576)+' MB';
const readFiles=async(input)=>{const out=[];let chars=0;for(const f of input.files){if(f.size>CAP.fileBytes)throw Error(f.name+' is larger than this device’s '+mb(CAP.fileBytes)+' per-file limit. Split it into smaller files.');if(!/\.(txt|md|csv|tsv)$/i.test(f.name)&&f.type&&!/^text\//.test(f.type))throw Error(f.name+': please add plain text (TXT, MD, CSV or TSV).');const text=await f.text();chars+=text.length;if(chars>CAP.chars)throw Error('These files exceed this device’s '+num(CAP.chars)+'-character limit for this desk. Use fewer or smaller files.');out.push({name:f.name.replace(/\.[^.]+$/,''),text});}return out;};
const checkChars=(...parts)=>{const n=parts.reduce((a,t)=>a+String(t).length,0);if(n>CAP.chars)throw Error('This input has '+num(n)+' characters; this device’s limit for this desk is '+num(CAP.chars)+'. Split it into smaller parts.');return n;};
// One background worker per page, so long analyses never freeze the page. A new run cancels the previous one.
const WORKER_URL=typeof document!=='undefined'&&document.currentScript?new URL('research-desk-worker.js?v=20261103',document.currentScript.src).href:null;
let worker=null,pending=null;
const work=(task,payload,onProgress)=>new Promise((resolve,reject)=>{if(worker){worker.terminate();worker=null;if(pending)pending.reject(Object.assign(Error('Cancelled by a newer run.'),{cancelled:true}));}
pending={reject};try{worker=new Worker(WORKER_URL);}catch(e){pending=null;reject(Error('Background processing is unavailable in this browser.'));return;}
const w=worker,done=()=>{if(worker===w){w.terminate();worker=null;pending=null;}};
w.onmessage=e=>{const m=e.data||{};if(m.type==='progress'){if(onProgress)onProgress(m.message);else status(m.message);}else if(m.type==='result'){done();resolve(m.result);}else if(m.type==='error'){done();reject(Error(m.message));}};
w.onerror=e=>{e.preventDefault?.();done();reject(Error('The analysis ran out of memory or failed on this device. Try a smaller input.'));};
w.postMessage({task,payload});});
// Very long texts stay in memory instead of the text box: a browser text box with tens of millions of characters freezes the page.
const PREVIEW=1000000,held=new Map();
const value=id=>held.has(id)?held.get(id):$(id).value;
const release=id=>{held.delete(id);const t=$(id);if(t){t.readOnly=false;t.removeAttribute('aria-describedby');}};
const hold=(id,text)=>{const t=$(id);text=String(text);if(text.length<=PREVIEW){release(id);t.value=text;return;}held.set(id,text);t.value=text.slice(0,20000)+'\n\n… ['+num(text.length)+' characters are loaded from your files and kept on this device. Only the beginning is shown here so the page stays responsive. Press Clear to start over.]';t.readOnly=true;};
const busy=(on,...ids)=>{for(const id of ids){const b=$(id);if(b)b.disabled=!!on;}const r=$('lab-run');if(r)r.setAttribute('aria-busy',on?'true':'false');};
// Page through long result lists instead of putting every row in the page at once.
const pager=(host,total,size,page,go)=>{const h=typeof host==='string'?$(host):host;h.replaceChildren();if(total<=size)return 0;const pages=Math.ceil(total/size),p=Math.min(Math.max(0,page),pages-1);const mk=(label,to,dis)=>{const b=el('button',label);b.type='button';b.disabled=dis;b.addEventListener('click',()=>go(to));return b;};h.append(mk('← Previous',p-1,p===0),el('span',' Rows '+num(p*size+1)+'–'+num(Math.min(total,(p+1)*size))+' of '+num(total)+' '),mk('Next →',p+1,p>=pages-1));return p;};
const fmt=(n,d=2)=>Number.isFinite(n)?n.toFixed(d):'—';
if(typeof document!=='undefined'){const note=()=>{const st=document.getElementById('lab-status');if(!st||document.getElementById('lab-cap'))return;const page=location.pathname,extra=/aligner/.test(page)?' · up to '+num(CAP.alignSentences)+' sentences per side':/coder/.test(page)?' · up to '+num(CAP.responses)+' responses':/stylometry/.test(page)?' · up to '+num(CAP.styloTexts)+' texts':' · up to '+num(CAP.texts)+' texts';const p=el('p','Limits on this device: '+mb(CAP.fileBytes)+' per file · '+num(CAP.chars)+' characters per run'+extra+'. Analysis runs in the background on this device.','help');p.id='lab-cap';st.before(p);};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',note);else note();}
globalThis.DailwindDesk={$,el,words,sentences,paragraphsToSentences,splitTexts,download,toCSV,table,status,readFiles,fmt,CAP,num,checkChars,work,busy,pager,value,hold,release};
})();
