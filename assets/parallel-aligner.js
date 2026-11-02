'use strict';
// Dailwind Parallel Text Aligner: Gale–Church (1993) length-based sentence alignment with review, merge/split and TMX export.
(()=>{const D=globalThis.DailwindDesk,{$,el}=D;let rows=[],auto=[];
const sampleSrc=`The library opens at nine in the morning. Students may borrow up to five books at a time.
Laptops can be charged at the tables near the windows. Please keep your voice low in the reading room. Group study rooms must be booked online, and each booking lasts two hours.`;
const sampleTgt=`La biblioteca abre a las nueve de la mañana. Los estudiantes pueden tomar prestados hasta cinco libros a la vez.
Los portátiles se pueden cargar en las mesas junto a las ventanas. Por favor, hable en voz baja en la sala de lectura. Las salas de estudio en grupo deben reservarse en línea. Cada reserva dura dos horas.`;
const len=s=>s.replace(/[^\p{L}\p{N}]/gu,'').length;
const pnorm=z=>{const t=1/(1+0.2316419*Math.abs(z)),d=0.3989423*Math.exp(-z*z/2);const p=d*t*(0.3193815+t*(-0.3565638+t*(1.781478+t*(-1.821256+t*1.330274))));return 1-p;};
const PRIOR={'1-1':0.89,'1-0':0.0099,'0-1':0.0099,'2-1':0.089/2,'1-2':0.089/2,'2-2':0.011};
function align(A,B){const la=A.map(len),lb=B.map(len),c=(lb.reduce((a,b)=>a+b,0)||1)/(la.reduce((a,b)=>a+b,0)||1),s2=6.8;
const cost=(l1,l2,type)=>{const mean=(l1+l2/c)/2;const z=mean>0?(c*l1-l2)/Math.sqrt(mean*s2):0;const p=2*(1-pnorm(Math.abs(z)));return -Math.log(Math.max(p,1e-12))-Math.log(PRIOR[type]);};
const n=A.length,m=B.length,dp=Array.from({length:n+1},()=>new Float64Array(m+1).fill(Infinity)),bk=Array.from({length:n+1},()=>new Array(m+1));dp[0][0]=0;
const moves=[[1,1,'1-1'],[1,0,'1-0'],[0,1,'0-1'],[2,1,'2-1'],[1,2,'1-2'],[2,2,'2-2']];
for(let i=0;i<=n;i++)for(let j=0;j<=m;j++){if(!i&&!j)continue;for(const[di,dj,t]of moves){if(i<di||j<dj)continue;const prev=dp[i-di][j-dj];if(prev===Infinity)continue;let l1=0,l2=0;for(let k=i-di;k<i;k++)l1+=la[k];for(let k=j-dj;k<j;k++)l2+=lb[k];const v=prev+cost(l1,l2,t);if(v<dp[i][j]){dp[i][j]=v;bk[i][j]=[di,dj,t,v-prev];}}}
const out=[];let i=n,j=m;while(i>0||j>0){const[di,dj,t,cst]=bk[i][j];out.push({src:A.slice(i-di,i),tgt:B.slice(j-dj,j),type:t,cost:cst});i-=di;j-=dj;}return out.reverse();}
function render(){const tb=$('lab-align');tb.replaceChildren();const costs=rows.map(r=>r.cost).filter(Number.isFinite).sort((a,b)=>a-b),cut=costs[Math.floor(costs.length*0.85)]??Infinity;
const thead=el('thead'),hr=el('tr');['#',$('lab-src-lang').value||'Source',$('lab-tgt-lang').value||'Target','Type · cost','Edit'].forEach(h=>{const th=el('th',h);th.scope='col';hr.append(th);});thead.append(hr);const body=el('tbody');
rows.forEach((r,i)=>{const tr=el('tr');const flag=r.type!=='1-1'||r.cost>=cut&&rows.length>3;if(flag)tr.className='is-uncertain';const n=el('th',String(i+1));n.scope='row';const s=el('td',r.src.join(' ')),t=el('td',r.tgt.join(' '));s.lang=$('lab-src-lang').value||'';t.lang=$('lab-tgt-lang').value||'';const ty=el('td',r.type+' · '+(Number.isFinite(r.cost)?r.cost.toFixed(1):'edited')+(flag?' · check':''));const ed=el('td');ed.className='desk-row-actions';
const btn=(label,aria,fn,dis)=>{const b=el('button',label);b.type='button';b.setAttribute('aria-label',aria+' (row '+(i+1)+')');b.disabled=!!dis;b.addEventListener('click',()=>{fn();render();D.status(aria+' done for row '+(i+1)+'.');});ed.append(b);};
btn('Merge ↓','Merge with next row',()=>{const nx=rows[i+1];r.src=r.src.concat(nx.src);r.tgt=r.tgt.concat(nx.tgt);r.type='edited';r.cost=NaN;rows.splice(i+1,1);},i===rows.length-1);
btn('Split src','Move last source sentence to a new row',()=>{rows.splice(i+1,0,{src:[r.src.pop()],tgt:[],type:'edited',cost:NaN});r.type='edited';r.cost=NaN;},r.src.length<2);
btn('Split tgt','Move last target sentence to a new row',()=>{rows.splice(i+1,0,{src:[],tgt:[r.tgt.pop()],type:'edited',cost:NaN});r.type='edited';r.cost=NaN;},r.tgt.length<2);
tr.append(n,s,t,ty,ed);body.append(tr);});tb.append(thead,body);
const c=t=>rows.filter(r=>r.type===t).length;$('lab-metrics').replaceChildren(...[['Aligned rows',rows.length],['One-to-one',c('1-1')],['Merges / splits (auto)',c('2-1')+c('1-2')+c('2-2')],['Unmatched sentences',c('1-0')+c('0-1')]].map(([l,v])=>{const a=el('article');a.append(el('strong',String(v)),el('span',l));return a;}));}
function run(){const A=D.paragraphsToSentences($('lab-src').value),B=D.paragraphsToSentences($('lab-tgt').value);if(!A.length||!B.length){D.status('Add both the source text and its translation.');return;}if(A.length*B.length>4e6){D.status('These texts are too long to align in one pass here. Split them into chapters first.');return;}
rows=align(A,B);auto=rows.map(r=>({...r,src:[...r.src],tgt:[...r.tgt]}));render();$('lab-results').hidden=false;D.status('Aligned '+A.length+' source and '+B.length+' target sentences on this device. Rows marked “check” are the least certain.');}
$('lab-run').addEventListener('click',run);
$('lab-sample').addEventListener('click',()=>{$('lab-src').value=sampleSrc;$('lab-tgt').value=sampleTgt;$('lab-src-lang').value='en';$('lab-tgt-lang').value='es';run();});
$('lab-clear').addEventListener('click',()=>{$('lab-src').value='';$('lab-tgt').value='';rows=[];$('lab-results').hidden=true;D.status('Cleared. Nothing was stored.');});
$('lab-undo').addEventListener('click',()=>{rows=auto.map(r=>({...r,src:[...r.src],tgt:[...r.tgt]}));render();D.status('Restored the automatic alignment.');});
for(const[id,target]of[['lab-src-file','lab-src'],['lab-tgt-file','lab-tgt']])$(id).addEventListener('change',async e=>{try{const[f]=await D.readFiles(e.target);if(f)$(target).value=f.text;D.status('Read '+f.name+' on this device.');}catch(err){D.status(err.message);}e.target.value='';});
const esc=s=>s.replace(/[<>&"]/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c]));
$('lab-tsv').addEventListener('click',()=>rows.length&&D.download('aligned.tsv',rows.map(r=>[r.src.join(' '),r.tgt.join(' ')].map(x=>x.replace(/[\t\r\n]+/g,' ')).join('\t')).join('\n'),'text/tab-separated-values'));
$('lab-csv').addEventListener('click',()=>rows.length&&D.download('aligned.csv',D.toCSV([['row','source','target','type','cost'],...rows.map((r,i)=>[i+1,r.src.join(' '),r.tgt.join(' '),r.type,Number.isFinite(r.cost)?+r.cost.toFixed(3):''])]),'text/csv'));
$('lab-tmx').addEventListener('click',()=>{if(!rows.length)return;const sl=esc($('lab-src-lang').value||'en'),tl=esc($('lab-tgt-lang').value||'und');const tus=rows.filter(r=>r.src.length&&r.tgt.length).map(r=>`<tu><tuv xml:lang="${sl}"><seg>${esc(r.src.join(' '))}</seg></tuv><tuv xml:lang="${tl}"><seg>${esc(r.tgt.join(' '))}</seg></tuv></tu>`).join('\n');D.download('aligned.tmx',`<?xml version="1.0" encoding="UTF-8"?>\n<tmx version="1.4"><header creationtool="Dailwind Parallel Aligner" creationtoolversion="1" segtype="sentence" o-tmf="none" adminlang="en" srclang="${sl}" datatype="plaintext"/><body>\n${tus}\n</body></tmx>\n`,'application/xml');});
})();
