'use strict';
// Dailwind Qualitative Coder: codebook, keyword suggestions, manual coding, co-occurrence and Cohen's kappa. Saved only in this browser.
(()=>{const D=globalThis.DailwindDesk,{$,el}=D,KEY='dailwind:qualitative-coder:v1';
let state={codebook:'',responses:[],codes:[],coding:{},memo:{}};
const sampleCodes=`Workload: too much, deadline, busy, time, overwhelmed
Feedback: feedback, comments, marked, grade
Peer support: friends, classmates, group, together
Teaching quality: lecture, explained, clear, confusing, tutor
Wellbeing: stress, anxious, tired, sleep, happy`;
const sampleResp=`The lectures were clear but the deadlines all came in the same week and I felt overwhelmed.
I wish feedback on essays came sooner; by the time it was marked I had moved on.
Studying together with classmates helped me more than anything else.
My tutor explained the statistics really well.
Honestly I was tired and anxious most of the term because of the workload.
Group projects were stressful, but my friends kept me going.
Comments on drafts were detailed and helped my grade.
Some lectures were confusing and the slides were not shared.`;
const parseCodes=t=>t.split(/\r?\n/).map(l=>l.trim()).filter(Boolean).map(l=>{const i=l.indexOf(':');const name=(i<0?l:l.slice(0,i)).trim();const kws=i<0?[]:l.slice(i+1).split(',').map(k=>k.trim().toLowerCase()).filter(Boolean);return{name,kws};}).filter(c=>c.name).filter((c,i,a)=>a.findIndex(x=>x.name.toLowerCase()===c.name.toLowerCase())===i);
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(state));}catch{}};
const has=(ri,code)=>!!(state.coding[ri]||[]).includes(code);
const toggle=(ri,code,on)=>{const s=new Set(state.coding[ri]||[]);on?s.add(code):s.delete(code);state.coding[ri]=[...s];save();summary();};
const matches=(text,c)=>{const low=' '+text.toLowerCase()+' ';return c.kws.some(k=>k.includes(' ')?low.includes(k):new RegExp('(?:^|[^\\p{L}])'+k.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'[\\p{L}]{0,3}(?:[^\\p{L}]|$)','u').test(low));};
function load(){state.codes=parseCodes($('lab-codes').value);state.codebook=$('lab-codes').value;state.responses=$('lab-text').value.split(/\r?\n/).map(s=>s.trim()).filter(Boolean);if(!state.codes.length||!state.responses.length){D.status('Add at least one code and one response (one response per line).');return false;}const names=new Set(state.codes.map(c=>c.name));for(const k of Object.keys(state.coding)){state.coding[k]=(state.coding[k]||[]).filter(c=>names.has(c));}save();return true;}
function render(){const list=$('lab-coding');list.replaceChildren();const q=$('lab-filter').value.trim().toLowerCase();let shown=0;
state.responses.forEach((r,ri)=>{if(q&&!r.toLowerCase().includes(q)&&!(state.coding[ri]||[]).some(c=>c.toLowerCase().includes(q)))return;shown++;const li=el('li');li.className='coder-item';const p=el('p',r);p.id='resp-'+ri;const fs=el('fieldset');const lg=el('legend','Codes for response '+(ri+1));lg.className='sr-only';fs.append(lg);
state.codes.forEach(c=>{const lab=el('label');lab.className='coder-chip';const cb=el('input');cb.type='checkbox';cb.checked=has(ri,c.name);cb.setAttribute('aria-describedby',p.id);if(!cb.checked&&matches(r,c))lab.classList.add('is-suggested');cb.addEventListener('change',()=>{toggle(ri,c.name,cb.checked);lab.classList.toggle('is-on',cb.checked);});lab.classList.toggle('is-on',cb.checked);lab.append(cb,el('span',c.name));fs.append(lab);});
const memo=el('input');memo.type='text';memo.placeholder='Memo (optional)';memo.value=state.memo[ri]||'';memo.setAttribute('aria-label','Memo for response '+(ri+1));memo.addEventListener('input',()=>{state.memo[ri]=memo.value;save();});
const num=el('span',String(ri+1),'coder-num');li.append(num,p,fs,memo);list.append(li);});$('lab-shown').textContent=shown+' of '+state.responses.length+' responses shown';summary();}
function summary(){const N=state.responses.length;const counts=state.codes.map(c=>state.responses.reduce((a,_,i)=>a+(has(i,c.name)?1:0),0));const coded=state.responses.filter((_,i)=>(state.coding[i]||[]).length).length;
$('lab-metrics').replaceChildren(...[['Responses',N],['Coded',coded+' ('+(N?Math.round(coded/N*100):0)+'%)'],['Codes',state.codes.length],['Codes applied',counts.reduce((a,b)=>a+b,0)]].map(([l,v])=>{const a=el('article');a.append(el('strong',String(v)),el('span',l));return a;}));
D.table('lab-freq',['Code','Responses','% of responses','Example'],state.codes.map((c,k)=>{const ex=state.responses.find((_,i)=>has(i,c.name));return[c.name,counts[k],N?(counts[k]/N*100).toFixed(1)+'%':'0%',ex?ex.slice(0,120)+(ex.length>120?'…':''):'—'];}),{rowHeads:true});
const names=state.codes.map(c=>c.name);D.table('lab-cooc',['',...names],names.map(a=>[a,...names.map(b=>state.responses.reduce((s,_,i)=>s+(has(i,a)&&has(i,b)?1:0),0))]),{rowHeads:true,cell:(cell,v,ri,ci)=>{if(ci&&ri===ci-1)cell.className='is-self';else if(ci&&v>0)cell.style.background='rgba(18,89,165,'+Math.min(.55,.1+v*.12).toFixed(2)+')';}});}
function apply(){let n=0;state.responses.forEach((r,ri)=>state.codes.forEach(c=>{if(!has(ri,c.name)&&matches(r,c)){const s=new Set(state.coding[ri]||[]);s.add(c.name);state.coding[ri]=[...s];n++;}}));save();render();D.status('Applied '+n+' keyword suggestion'+(n===1?'':'s')+'. Review each one; suggestions are only a starting point.');}
function exportRows(){const names=state.codes.map(c=>c.name);return[['response_id','response',...names,'memo'],...state.responses.map((r,i)=>[i+1,r,...names.map(n=>has(i,n)?1:0),state.memo[i]||''])];}
const parseCSV=t=>{const rows=[];let row=[],f='',q=false;t=t.replace(/^\ufeff/,'');for(let i=0;i<t.length;i++){const ch=t[i];if(q){if(ch==='"'){if(t[i+1]==='"'){f+='"';i++;}else q=false;}else f+=ch;}else if(ch==='"')q=true;else if(ch===','){row.push(f);f='';}else if(ch==='\n'||ch==='\r'){if(ch==='\r'&&t[i+1]==='\n')i++;row.push(f);rows.push(row);row=[];f='';}else f+=ch;}if(f||row.length){row.push(f);rows.push(row);}return rows;};
function kappa(other){const head=other[0],idx=new Map(head.map((h,i)=>[h,i]));const out=[];for(const c of state.codes){const j=idx.get(c.name);if(j==null){out.push([c.name,'—','—','Not in other file']);continue;}let a=0,b=0,cc=0,d=0,n=0;other.slice(1).forEach(r=>{const id=+r[0]-1;if(!(id>=0&&id<state.responses.length))return;const x=has(id,c.name),y=r[j]==='1';n++;if(x&&y)a++;else if(x)b++;else if(y)cc++;else d++;});const po=n?(a+d)/n:NaN,pe=n?((a+b)*(a+cc)+(cc+d)*(b+d))/(n*n):NaN,k=pe===1?1:(po-pe)/(1-pe);out.push([c.name,n,(po*100).toFixed(1)+'%',Number.isFinite(k)?k.toFixed(3)+(k>=.8?' · strong':k>=.6?' · substantial':k>=.4?' · moderate':' · weak'):'—']);}D.table('lab-kappa',['Code','Shared responses','Percent agreement',"Cohen's kappa"],out,{rowHeads:true});$('lab-kappa-wrap').hidden=false;}
$('lab-run').addEventListener('click',()=>{if(load()){render();$('lab-results').hidden=false;D.status('Ready to code '+state.responses.length+' responses. Your work is saved in this browser only.');}});
$('lab-sample').addEventListener('click',()=>{$('lab-codes').value=sampleCodes;$('lab-text').value=sampleResp;state.coding={};state.memo={};if(load()){render();$('lab-results').hidden=false;apply();}});
$('lab-suggest').addEventListener('click',apply);
$('lab-filter').addEventListener('input',render);
$('lab-clear').addEventListener('click',()=>{state={codebook:'',responses:[],codes:[],coding:{},memo:{}};try{localStorage.removeItem(KEY);}catch{}$('lab-codes').value='';$('lab-text').value='';$('lab-results').hidden=true;D.status('Cleared, including the copy saved in this browser.');});
$('lab-csv').addEventListener('click',()=>state.responses.length&&D.download('coded-responses.csv',D.toCSV(exportRows()),'text/csv'));
$('lab-json').addEventListener('click',()=>state.responses.length&&D.download('qualitative-coding-project.json',JSON.stringify({tool:'Dailwind Qualitative Coder',version:1,codebook:state.codes,responses:state.responses.map((r,i)=>({id:i+1,text:r,codes:state.coding[i]||[],memo:state.memo[i]||''}))},null,2),'application/json'));
$('lab-file').addEventListener('change',async e=>{try{const[f]=await D.readFiles(e.target);if(f)$('lab-text').value=f.text.split(/\r?\n/).map(s=>s.trim()).filter(Boolean).join('\n');D.status('Read '+f.name+'. One line = one response. Press Start coding.');}catch(err){D.status(err.message);}e.target.value='';});
$('lab-kappa-file').addEventListener('change',async e=>{try{const[f]=await D.readFiles(e.target);kappa(parseCSV(f.text));D.status("Compared your coding with "+f.name+". Cohen's kappa is shown per code.");}catch(err){D.status(err.message);}e.target.value='';});
try{const s=JSON.parse(localStorage.getItem(KEY)||'null');if(s&&s.responses?.length){state=s;$('lab-codes').value=s.codebook||'';$('lab-text').value=s.responses.join('\n');render();$('lab-results').hidden=false;D.status('Restored your saved coding from this browser ('+s.responses.length+' responses).');}}catch{}
})();
