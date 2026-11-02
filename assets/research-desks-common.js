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
const readFiles=async(input)=>{const out=[];for(const f of input.files){if(f.size>8*1024*1024)throw Error(f.name+' is larger than 8 MB.');if(!/\.(txt|md|csv|tsv)$/i.test(f.name)&&f.type&&!/^text\//.test(f.type))throw Error(f.name+': please add plain text (TXT, MD, CSV or TSV).');out.push({name:f.name.replace(/\.[^.]+$/,''),text:await f.text()});}return out;};
const fmt=(n,d=2)=>Number.isFinite(n)?n.toFixed(d):'—';
globalThis.DailwindDesk={$,el,words,sentences,paragraphsToSentences,splitTexts,download,toCSV,table,status,readFiles,fmt};
})();
