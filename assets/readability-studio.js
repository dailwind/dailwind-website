'use strict';
// Dailwind Readability & Diversity: six readability formulas plus MTLD and HD-D, side by side for several texts.
(()=>{const D=globalThis.DailwindDesk,{$,el}=D;
const syllables=w=>{w=w.toLowerCase().replace(/[^a-z]/g,'');if(!w)return 0;if(w.length<=3)return 1;w=w.replace(/(?:[^laeiouy]es|[^laeiouy]ed|[^laeiouy]e)$/,'').replace(/^y/,'');const m=w.match(/[aeiouy]{1,2}/g);return Math.max(1,m?m.length:1);};
const mtldPass=ts=>{let factors=0,types=new Set(),count=0;for(const t of ts){types.add(t);count++;if(types.size/count<=0.72){factors++;types=new Set();count=0;}}if(count>0){const ttr=types.size/count;factors+=(1-ttr)/(1-0.72);}return factors>0?ts.length/factors:NaN;};
const mtld=ts=>ts.length<50?NaN:(mtldPass(ts)+mtldPass([...ts].reverse()))/2;
const lnC=(n,k)=>{if(k<0||k>n)return -Infinity;let s=0;for(let i=1;i<=k;i++)s+=Math.log(n-k+i)-Math.log(i);return s;};
const hdd=(ts,sample=42)=>{const N=ts.length;if(N<sample)return NaN;const f=new Map();ts.forEach(t=>f.set(t,(f.get(t)||0)+1));const all=lnC(N,sample);let sum=0;for(const c of f.values()){const p0=Math.exp(lnC(N-c,sample)-all);sum+=(1-p0)/sample;}return sum;};
function analyse(text){const sents=D.paragraphsToSentences(text),ws=D.words(text),alpha=ws.filter(w=>/\p{L}/u.test(w));const W=Math.max(1,ws.length),S=Math.max(1,sents.length);let syl=0,poly=0,complex=0,letters=0;for(const w of alpha){const s=syllables(w);syl+=s;if(s>=3){poly++;if(!/(?:es|ed|ing)$/.test(w))complex++;}}for(const w of ws)letters+=w.replace(/[^\p{L}\p{N}]/gu,'').length;
const wps=W/S,spw=syl/Math.max(1,alpha.length),L=letters/W*100,Sx=S/W*100;
const r={words:ws.length,sentences:sents.length,wps,spw,fre:206.835-1.015*wps-84.6*spw,fk:0.39*wps+11.8*spw-15.59,fog:0.4*(wps+100*complex/W),smog:1.043*Math.sqrt(poly*30/S)+3.1291,cli:0.0588*L-0.296*Sx-15.8,ari:4.71*letters/W+0.5*wps-21.43,types:new Set(ws).size,mtld:mtld(ws),hdd:hdd(ws)};r.grade=(r.fk+r.fog+r.smog+r.cli+r.ari)/5;r.hard=sents.map(s=>{const w=D.words(s);return{s,len:w.length,syl:w.reduce((a,x)=>a+syllables(x),0)};}).filter(x=>x.len).sort((a,b)=>b.len+b.syl/3-(a.len+a.syl/3)).slice(0,5);return r;}
const band=f=>f>=90?'Very easy':f>=70?'Easy':f>=60?'Plain English':f>=50?'Fairly difficult':f>=30?'Difficult (college)':'Very difficult (graduate)';
let last=null;
const sample=`### Plain-language summary
We asked 40 students how they read research articles. Most read the abstract first. Many skipped the methods. They said long sentences made the results hard to follow. Short summaries helped them decide what to read next. Teachers can use these findings to plan reading lessons. Students can use them to choose a reading order that saves time.

### Academic abstract
This exploratory investigation examines undergraduate engagement with empirical research articles through a mixed-methods design incorporating questionnaire responses and retrospective interviews. Participants predominantly prioritised the abstract, whereas methodological sections were frequently disregarded, particularly when syntactic complexity impeded comprehension of statistical procedures. Implications for discipline-specific literacy instruction, including the scaffolding of genre awareness and the explicit modelling of evaluative reading strategies, are subsequently discussed.`;
function run(){const texts=D.splitTexts($('lab-text').value);if(!texts.length){D.status('Add text first, or try the sample.');$('lab-text').focus();return;}
const res=texts.map(t=>({name:t.name,...analyse(t.text)}));last=res;const f=D.fmt;
$('lab-metrics').replaceChildren(...[['Texts',res.length],['Words (all texts)',res.reduce((a,r)=>a+r.words,0).toLocaleString()],['Avg. consensus grade',f(res.reduce((a,r)=>a+r.grade,0)/res.length,1)],['Easiest (Flesch)',res.slice().sort((a,b)=>b.fre-a.fre)[0].name]].map(([l,v])=>{const a=el('article');a.append(el('strong',String(v)),el('span',l));return a;}));
D.table('lab-output',['Text','Words','Sentences','Words/sentence','Syllables/word','Flesch Reading Ease','Band','Flesch–Kincaid','Gunning Fog','SMOG','Coleman–Liau','ARI','Consensus grade','MTLD','HD-D'],res.map(r=>[r.name,r.words,r.sentences,f(r.wps,1),f(r.spw),f(r.fre,1),band(r.fre),f(r.fk,1),f(r.fog,1),f(r.smog,1),f(r.cli,1),f(r.ari,1),f(r.grade,1),f(r.mtld,1),f(r.hdd,3)]),{rowHeads:true});
const hard=$('lab-hard');hard.replaceChildren();res.forEach(r=>{const d=el('details');d.open=res.length<3;d.append(el('summary',r.name+' · longest and densest sentences'));const ol=el('ol');r.hard.forEach(h=>{const li=el('li');li.append(el('span',h.s),el('small',' '+h.len+' words · '+h.syl+' syllables'));ol.append(li);});d.append(ol);hard.append(d);});
const notes=[];res.forEach(r=>{if(r.sentences<30)notes.push(r.name+': SMOG is calibrated on 30+ sentences; this text has '+r.sentences+'.');if(r.words<50)notes.push(r.name+': MTLD needs at least 50 words; HD-D needs 42.');});$('lab-warn').textContent=notes.join(' ');
$('lab-results').hidden=false;D.status('Analysed '+res.length+' text'+(res.length>1?'s':'')+' on this device.');$('lab-results').querySelector('h2').focus?.();}
$('lab-run').addEventListener('click',run);
$('lab-sample').addEventListener('click',()=>{$('lab-text').value=sample;run();});
$('lab-clear').addEventListener('click',()=>{$('lab-text').value='';$('lab-results').hidden=true;last=null;D.status('Cleared. Nothing was stored.');});
$('lab-file').addEventListener('change',async e=>{try{const fs=await D.readFiles(e.target);$('lab-text').value=($('lab-text').value.trim()?$('lab-text').value.trim()+'\n\n':'')+fs.map(f=>'### '+f.name+'\n'+f.text.trim()).join('\n\n');D.status('Added '+fs.length+' file(s). Press Analyze.');}catch(err){D.status(err.message);}e.target.value='';});
$('lab-csv').addEventListener('click',()=>{if(!last)return;D.download('readability-diversity.csv',D.toCSV([['text','words','sentences','words_per_sentence','syllables_per_word','flesch_reading_ease','flesch_kincaid','gunning_fog','smog','coleman_liau','ari','consensus_grade','types','mtld','hdd'],...last.map(r=>[r.name,r.words,r.sentences,r.wps,r.spw,r.fre,r.fk,r.fog,r.smog,r.cli,r.ari,r.grade,r.types,r.mtld,r.hdd].map(v=>typeof v==='number'?+v.toFixed(4):v))]),'text/csv');});
})();
