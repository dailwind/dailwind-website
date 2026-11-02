'use strict';
// Dailwind Parallel Text Aligner: Gale–Church (1993) length-based sentence alignment with review, merge/split and TMX export.
(()=>{const D=globalThis.DailwindDesk,{$,el}=D;let rows=[],auto=[];
const sampleSrc=`The library opens at nine in the morning. Students may borrow up to five books at a time.
Laptops can be charged at the tables near the windows. Please keep your voice low in the reading room. Group study rooms must be booked online, and each booking lasts two hours.`;
const sampleTgt=`La biblioteca abre a las nueve de la mañana. Los estudiantes pueden tomar prestados hasta cinco libros a la vez.
Los portátiles se pueden cargar en las mesas junto a las ventanas. Por favor, hable en voz baja en la sala de lectura. Las salas de estudio en grupo deben reservarse en línea. Cada reserva dura dos horas.`;
let page=0;const PAGE=200;
function render(){const tb=$('lab-align');tb.replaceChildren();const costs=rows.map(r=>r.cost).filter(Number.isFinite).sort((a,b)=>a-b),cut=costs[Math.floor(costs.length*0.85)]??Infinity;
const thead=el('thead'),hr=el('tr');['#',$('lab-src-lang').value||'Source',$('lab-tgt-lang').value||'Target','Type · cost','Edit'].forEach(h=>{const th=el('th',h);th.scope='col';hr.append(th);});thead.append(hr);const body=el('tbody');
page=D.pager('lab-pages',rows.length,PAGE,page,p=>{page=p;render();});const first=page*PAGE;
rows.slice(first,first+PAGE).forEach((r,k)=>{const i=first+k;const tr=el('tr');const flag=r.type!=='1-1'||r.cost>=cut&&rows.length>3;if(flag)tr.className='is-uncertain';const n=el('th',String(i+1));n.scope='row';const s=el('td',r.src.join(' ')),t=el('td',r.tgt.join(' '));s.lang=$('lab-src-lang').value||'';t.lang=$('lab-tgt-lang').value||'';const ty=el('td',r.type+' · '+(Number.isFinite(r.cost)?r.cost.toFixed(1):'edited')+(flag?' · check':''));const ed=el('td');ed.className='desk-row-actions';
const btn=(label,aria,fn,dis)=>{const b=el('button',label);b.type='button';b.setAttribute('aria-label',aria+' (row '+(i+1)+')');b.disabled=!!dis;b.addEventListener('click',()=>{fn();render();D.status(aria+' done for row '+(i+1)+'.');});ed.append(b);};
btn('Merge ↓','Merge with next row',()=>{const nx=rows[i+1];r.src=r.src.concat(nx.src);r.tgt=r.tgt.concat(nx.tgt);r.type='edited';r.cost=NaN;rows.splice(i+1,1);},i===rows.length-1);
btn('Split src','Move last source sentence to a new row',()=>{rows.splice(i+1,0,{src:[r.src.pop()],tgt:[],type:'edited',cost:NaN});r.type='edited';r.cost=NaN;},r.src.length<2);
btn('Split tgt','Move last target sentence to a new row',()=>{rows.splice(i+1,0,{src:[],tgt:[r.tgt.pop()],type:'edited',cost:NaN});r.type='edited';r.cost=NaN;},r.tgt.length<2);
tr.append(n,s,t,ty,ed);body.append(tr);});tb.append(thead,body);
const c=t=>rows.filter(r=>r.type===t).length;$('lab-metrics').replaceChildren(...[['Aligned rows',rows.length],['One-to-one',c('1-1')],['Merges / splits (auto)',c('2-1')+c('1-2')+c('2-2')],['Unmatched sentences',c('1-0')+c('0-1')]].map(([l,v])=>{const a=el('article');a.append(el('strong',String(v)),el('span',l));return a;}));}
async function run(){let A,B,res;try{const src=D.value('lab-src'),tgt=D.value('lab-tgt');if(!src.trim()||!tgt.trim()){D.status('Add both the source text and its translation.');return;}D.checkChars(src,tgt);
D.busy(true,'lab-sample','lab-undo');D.status('Aligning on this device…');res=await D.work('align',{src,tgt});}catch(err){if(!err.cancelled)D.status(err.message);return;}finally{D.busy(false,'lab-sample','lab-undo');}
rows=res.rows;A={length:res.n};B={length:res.m};page=0;auto=rows.map(r=>({...r,src:[...r.src],tgt:[...r.tgt]}));render();$('lab-results').hidden=false;D.status('Aligned '+D.num(A.length)+' source and '+D.num(B.length)+' target sentences on this device'+(res.banded?' (long-text mode: searched '+D.num(res.band)+' sentences either side of the diagonal)':'')+'. Rows marked “check” are the least certain.');}
$('lab-run').addEventListener('click',run);
$('lab-sample').addEventListener('click',()=>{D.release('lab-src');D.release('lab-tgt');$('lab-src').value=sampleSrc;$('lab-tgt').value=sampleTgt;$('lab-src-lang').value='en';$('lab-tgt-lang').value='es';run();});
$('lab-clear').addEventListener('click',()=>{D.release('lab-src');D.release('lab-tgt');$('lab-src').value='';$('lab-tgt').value='';rows=[];$('lab-results').hidden=true;D.status('Cleared. Nothing was stored.');});
$('lab-undo').addEventListener('click',()=>{rows=auto.map(r=>({...r,src:[...r.src],tgt:[...r.tgt]}));render();D.status('Restored the automatic alignment.');});
for(const[id,target]of[['lab-src-file','lab-src'],['lab-tgt-file','lab-tgt']])$(id).addEventListener('change',async e=>{try{const[f]=await D.readFiles(e.target);if(f)D.hold(target,f.text);D.status('Read '+f.name+' on this device.');}catch(err){D.status(err.message);}e.target.value='';});
const esc=s=>s.replace(/[<>&"]/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c]));
$('lab-tsv').addEventListener('click',()=>rows.length&&D.download('aligned.tsv',rows.map(r=>[r.src.join(' '),r.tgt.join(' ')].map(x=>x.replace(/[\t\r\n]+/g,' ')).join('\t')).join('\n'),'text/tab-separated-values'));
$('lab-csv').addEventListener('click',()=>rows.length&&D.download('aligned.csv',D.toCSV([['row','source','target','type','cost'],...rows.map((r,i)=>[i+1,r.src.join(' '),r.tgt.join(' '),r.type,Number.isFinite(r.cost)?+r.cost.toFixed(3):''])]),'text/csv'));
$('lab-tmx').addEventListener('click',()=>{if(!rows.length)return;const sl=esc($('lab-src-lang').value||'en'),tl=esc($('lab-tgt-lang').value||'und');const tus=rows.filter(r=>r.src.length&&r.tgt.length).map(r=>`<tu><tuv xml:lang="${sl}"><seg>${esc(r.src.join(' '))}</seg></tuv><tuv xml:lang="${tl}"><seg>${esc(r.tgt.join(' '))}</seg></tuv></tu>`).join('\n');D.download('aligned.tmx',`<?xml version="1.0" encoding="UTF-8"?>\n<tmx version="1.4"><header creationtool="Dailwind Parallel Aligner" creationtoolversion="1" segtype="sentence" o-tmf="none" adminlang="en" srclang="${sl}" datatype="plaintext"/><body>\n${tus}\n</body></tmx>\n`,'application/xml');});
})();
