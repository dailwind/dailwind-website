'use strict';
// Background worker for the Dailwind research desks. Everything runs on this device; nothing is uploaded.
if(typeof importScripts==='function'&&typeof DailwindDesk==='undefined')importScripts('capacity.js?v=20261103','research-desks-common.js?v=20261103');
(()=>{const D=globalThis.DailwindDesk,CAP=D.CAP,num=D.num;
let report=()=>{};
const tick=(()=>{let last=0;return msg=>{const t=Date.now();if(t-last>250){last=t;report(msg);}};})();

// Readability & Diversity
const syllables=w=>{w=w.toLowerCase().replace(/[^a-z]/g,'');if(!w)return 0;if(w.length<=3)return 1;w=w.replace(/(?:[^laeiouy]es|[^laeiouy]ed|[^laeiouy]e)$/,'').replace(/^y/,'');const m=w.match(/[aeiouy]{1,2}/g);return Math.max(1,m?m.length:1);};
const mtldPass=(ts,rev)=>{let factors=0,types=new Set(),count=0;const N=ts.length;for(let q=0;q<N;q++){const t=ts[rev?N-1-q:q];types.add(t);count++;if(types.size/count<=0.72){factors++;types=new Set();count=0;}}if(count>0){const ttr=types.size/count;factors+=(1-ttr)/(1-0.72);}return factors>0?ts.length/factors:NaN;};
const mtld=ts=>ts.length<50?NaN:(mtldPass(ts,false)+mtldPass(ts,true))/2;
const lnC=(n,k)=>{if(k<0||k>n)return -Infinity;let s=0;for(let i=1;i<=k;i++)s+=Math.log(n-k+i)-Math.log(i);return s;};
const hdd=(ts,sample=42)=>{const N=ts.length;if(N<sample)return NaN;const f=new Map();for(const t of ts)f.set(t,(f.get(t)||0)+1);const all=lnC(N,sample);let sum=0;for(const c of f.values()){const p0=Math.exp(lnC(N-c,sample)-all);sum+=(1-p0)/sample;}return sum;};
function analyse(text){const sents=D.paragraphsToSentences(text),ws=D.words(text);const W=Math.max(1,ws.length),S=Math.max(1,sents.length);let syl=0,poly=0,complex=0,letters=0,alpha=0;const L1=/\p{L}/u;
for(const w of ws){letters+=w.replace(/[^\p{L}\p{N}]/gu,'').length;if(!L1.test(w))continue;alpha++;const s=syllables(w);syl+=s;if(s>=3){poly++;if(!/(?:es|ed|ing)$/.test(w))complex++;}}
const wps=W/S,spw=syl/Math.max(1,alpha),L=letters/W*100,Sx=S/W*100;
const r={words:ws.length,sentences:sents.length,wps,spw,fre:206.835-1.015*wps-84.6*spw,fk:0.39*wps+11.8*spw-15.59,fog:0.4*(wps+100*complex/W),smog:1.043*Math.sqrt(poly*30/S)+3.1291,cli:0.0588*L-0.296*Sx-15.8,ari:4.71*letters/W+0.5*wps-21.43,types:new Set(ws).size,mtld:mtld(ws),hdd:hdd(ws)};r.grade=(r.fk+r.fog+r.smog+r.cli+r.ari)/5;
// Keep only the five hardest sentences instead of sorting every sentence.
const top=[];for(const s of sents){const w=D.words(s);if(!w.length)continue;let sy=0;for(const x of w)sy+=syllables(x);const k=w.length+sy/3;if(top.length<5||k>top[top.length-1].k){top.push({s:s.length>2000?s.slice(0,2000)+'…':s,len:w.length,syl:sy,k});top.sort((a,b)=>b.k-a.k);if(top.length>5)top.pop();}}
r.hard=top.map(({s,len,syl})=>({s,len,syl}));return r;}
function readability({value}){report('Reading the texts…');const texts=D.splitTexts(value);value=null;if(!texts.length)throw Error('Add text first, or try the sample.');if(texts.length>CAP.texts)throw Error('Up to '+num(CAP.texts)+' texts can be analysed at once on this device. Split the set into smaller batches.');return texts.map((t,i)=>{report('Analysing text '+num(i+1)+' of '+num(texts.length)+'…');return{name:t.name,...analyse(t.text)};});}

// Stylometry (Burrows, Cosine and Eder's Delta)
function stylometry({value,mfw,measure,culling}){const texts=D.splitTexts(value);value=null;if(texts.length<3)throw Error('Add at least three texts, each starting with a "### Title" line. Delta needs a reference group to standardise word frequencies.');const D2=texts.length;if(D2>CAP.styloTexts)throw Error('Up to '+num(CAP.styloTexts)+' texts can be compared at once on this device. Compare smaller groups.');
const docs=texts.map((t,i)=>{tick('Counting words in text '+num(i+1)+' of '+num(D2)+'…');const c=new Map();let n=0;for(const x of D.words(t.text)){c.set(x,(c.get(x)||0)+1);n++;}return{name:t.name,n:Math.max(n,0),c};});
const total=new Map(),df=new Map();docs.forEach(d=>d.c.forEach((v,k)=>{total.set(k,(total.get(k)||0)+v/Math.max(1,d.n));df.set(k,(df.get(k)||0)+1);}));
const need=Math.ceil(docs.length*culling/100);const feats=[...total.entries()].filter(([k])=>df.get(k)>=need).sort((a,b)=>b[1]-a[1]||(a[0]<b[0]?-1:1)).slice(0,mfw).map(x=>x[0]);const F=feats.length;
if(D2*D2*Math.max(1,F)>CAP.styloWork)throw Error(num(D2)+' texts × '+num(F)+' features is more than this device can compare smoothly. Lower the number of most-frequent words or compare fewer texts.');
const rel=docs.map(d=>Float64Array.from(feats,f=>(d.c.get(f)||0)/Math.max(1,d.n)*100));const mu=new Float64Array(F),sd=new Float64Array(F);
for(let j=0;j<F;j++){let a=0;for(const r of rel)a+=r[j];mu[j]=a/rel.length;let v=0;for(const r of rel)v+=(r[j]-mu[j])**2;sd[j]=Math.sqrt(v/Math.max(1,rel.length-1))||1;}
const z=rel.map(r=>Float64Array.from(r,(v,j)=>(v-mu[j])/sd[j]));
const dist=(a,b)=>{if(measure==='cosine'){let d=0,na=0,nb=0;for(let j=0;j<F;j++){d+=a[j]*b[j];na+=a[j]**2;nb+=b[j]**2;}return 1-d/(Math.sqrt(na*nb)||1);}if(measure==='eder'){let s=0;for(let j=0;j<F;j++)s+=Math.abs(a[j]-b[j])*(F-j)/F;return s/F;}let s=0;for(let j=0;j<F;j++)s+=Math.abs(a[j]-b[j]);return s/F;};
const M=z.map(()=>new Float64Array(D2));for(let i=0;i<D2;i++){tick('Comparing texts: '+Math.round(i/D2*100)+'%');for(let j=i;j<D2;j++){const v=i===j?0:dist(z[i],z[j]);M[i][j]=v;M[j][i]=v;}}
let max=0;for(const row of M)for(const v of row)if(v>max)max=v;
const near=M.map((row,i)=>{let a=-1,b=-1;for(let j=0;j<D2;j++){if(j===i)continue;if(a<0||row[j]<row[a]){b=a;a=j;}else if(b<0||row[j]<row[b])b=j;}return[a,b];});
return{docs:docs.map(d=>({name:d.name,n:d.n})),feats,z,M,mu,sd,max,near};}

// Parallel aligner: Gale–Church (1993) length-based alignment; long texts use a diagonal band so memory stays bounded.
const len=s=>s.replace(/[^\p{L}\p{N}]/gu,'').length;
const pnorm=z=>{const t=1/(1+0.2316419*Math.abs(z)),d=0.3989423*Math.exp(-z*z/2);const p=d*t*(0.3193815+t*(-0.3565638+t*(1.781478+t*(-1.821256+t*1.330274))));return 1-p;};
const PRIOR={'1-1':0.89,'1-0':0.0099,'0-1':0.0099,'2-1':0.089/2,'1-2':0.089/2,'2-2':0.011};
const DI=[1,1,0,2,1,2],DJ=[1,0,1,1,2,2],MOVES=[[1,1,'1-1'],[1,0,'1-0'],[0,1,'0-1'],[2,1,'2-1'],[1,2,'1-2'],[2,2,'2-2']];
function align({src,tgt}){report('Splitting sentences…');const A=D.paragraphsToSentences(src),B=D.paragraphsToSentences(tgt);src=tgt=null;if(!A.length||!B.length)throw Error('Add both the source text and its translation.');const n=A.length,m=B.length;if(Math.max(n,m)>CAP.alignSentences)throw Error('Each side can have up to '+num(CAP.alignSentences)+' sentences on this device; this one has '+num(Math.max(n,m))+'. Split the texts into chapters first.');
const la=A.map(len),lb=B.map(len),c=(lb.reduce((a,b)=>a+b,0)||1)/(la.reduce((a,b)=>a+b,0)||1),s2=6.8;
const cost=(l1,l2,type)=>{const mean=(l1+l2/c)/2;const z=mean>0?(c*l1-l2)/Math.sqrt(mean*s2):0;const p=2*(1-pnorm(Math.abs(z)));return -Math.log(Math.max(p,1e-12))-Math.log(PRIOR[type]);};
const full=(n+1)*(m+1)<=CAP.alignCells;const slope=n?m/n:0,minW=Math.ceil(3*Math.max(1,slope))+60;
const W=full?m+1:Math.min(m+1,Math.max(minW,Math.floor(CAP.alignCells/(n+1)/2)));const width=full?m+1:2*W+1;
if(!full&&(n+1)*width>CAP.alignCells*1.05)throw Error('These texts differ too much in length to align in one pass here. Split them into matching chapters first.');
const lo=i=>full?0:Math.round(i*slope)-W;const dp=new Float64Array((n+1)*width).fill(Infinity),bk=new Int8Array((n+1)*width).fill(-1);
const at=(i,j)=>{const o=j-lo(i);return o<0||o>=width?-1:i*width+o;};dp[at(0,0)]=0;
for(let i=0;i<=n;i++){if(!(i&1023))tick('Aligning: '+Math.round(i/(n+1)*100)+'%');const a=Math.max(0,lo(i)),b=Math.min(m,lo(i)+width-1);for(let j=a;j<=b;j++){if(!i&&!j)continue;const here=at(i,j);let best=Infinity,mv=-1;
for(let k=0;k<6;k++){const di=DI[k],dj=DJ[k];if(i<di||j<dj)continue;const pi=at(i-di,j-dj);if(pi<0)continue;const prev=dp[pi];if(prev===Infinity)continue;const l1=(di>0?la[i-1]:0)+(di>1?la[i-2]:0),l2=(dj>0?lb[j-1]:0)+(dj>1?lb[j-2]:0);const v=prev+cost(l1,l2,MOVES[k][2]);if(v<best){best=v;mv=k;}}
dp[here]=best;bk[here]=mv;}}
const out=[];let i=n,j=m;if(at(n,m)<0||bk[at(n,m)]<0)throw Error('No alignment path was found. Check that the two texts are translations of each other, or split them into chapters.');
while(i>0||j>0){const here=at(i,j),k=bk[here];if(k<0)throw Error('No alignment path was found. Split the texts into chapters first.');const[di,dj,t]=MOVES[k];const prev=dp[at(i-di,j-dj)];out.push({src:A.slice(i-di,i),tgt:B.slice(j-dj,j),type:t,cost:dp[here]-prev});i-=di;j-=dj;}
return{rows:out.reverse(),banded:!full,band:full?null:W,n,m};}

// Qualitative coder: keyword suggestions for every response.
const esc=k=>k.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const matcher=c=>{const res=c.kws.map(k=>k.includes(' ')?null:new RegExp('(?:^|[^\\p{L}])'+esc(k)+'[\\p{L}]{0,3}(?:[^\\p{L}]|$)','u'));return text=>{const low=' '+text.toLowerCase()+' ';return c.kws.some((k,i)=>res[i]?res[i].test(low):low.includes(k));};};
function suggest({responses,codes}){if(responses.length>CAP.responses)throw Error('Up to '+num(CAP.responses)+' responses can be coded at once on this device.');const ms=codes.map(matcher),out=[];
for(let i=0;i<responses.length;i++){if(!(i&2047))tick('Checking keywords: '+Math.round(i/responses.length*100)+'%');const hit=[];for(let k=0;k<ms.length;k++)if(ms[k](responses[i]))hit.push(k);out.push(hit);}return out;}

const TASKS={readability,stylometry,align,suggest};
globalThis.DailwindDeskTasks=TASKS;
if(typeof WorkerGlobalScope!=='undefined'&&self instanceof WorkerGlobalScope){report=message=>self.postMessage({type:'progress',message});
self.onmessage=e=>{const{task,payload}=e.data||{};try{if(!TASKS[task])throw Error('Unknown task.');self.postMessage({type:'result',result:TASKS[task](payload)});}catch(err){self.postMessage({type:'error',message:err&&err.message||String(err)});}};}
})();
