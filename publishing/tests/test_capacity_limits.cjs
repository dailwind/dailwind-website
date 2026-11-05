'use strict';
// Capacity ceilings and the research-desk worker logic (run in Node without a browser).
const assert=require('assert'),vm=require('vm'),fs=require('fs'),path=require('path');const root=path.resolve(__dirname,'../..');
const load=(ua,files)=>{const c={console,navigator:{userAgent:ua},Float64Array,Int8Array,Map,Set};c.self=c;c.globalThis=c;vm.createContext(c);for(const f of files)vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),c,{filename:f});return c;};
const desk=['assets/capacity.js','assets/research-desks-common.js','assets/research-desk-worker.js'];
const big=load('Mozilla/5.0 (X11; Linux x86_64)',desk),small=load('Mozilla/5.0 (iPhone)',desk);
const B=big.ArcCapacity,S=small.ArcCapacity;
assert.equal(B.text.files,2000);assert.equal(B.text.tokens,8000000);assert.equal(B.text.fileChars,100000000);assert.equal(B.text.workspaceChars,200000000);assert.equal(B.text.fileBytes,400*1048576);
assert.equal(S.text.files,1000);assert.equal(S.text.tokens,2000000);assert.equal(S.text.fileBytes,100*1048576);
assert.equal(B.style.characters,8000000);assert.equal(S.style.characters,3000000);
assert.equal(B.desk.chars,45000000);assert.equal(S.desk.chars,12000000);assert.equal(B.desk.alignSentences,100000);assert.equal(B.desk.responses,200000);
assert.equal(B.lang.sentiment,100000);assert.equal(S.lang.parse,200000);
for(const tier of [B,S])for(const k of ['text','style','pdf','desk','lang'])for(const v of Object.values(tier[k]))assert.ok(Number.isFinite(v)&&v>0);
assert.ok(S.desk.chars<B.desk.chars&&S.text.tokens<B.text.tokens,'mobile tier must stay lower');
const T=big.DailwindDeskTasks,TS=small.DailwindDeskTasks;
// Aligner: full and banded modes both recover the true 1-1 / 2-1 alignment.
const sents=n=>{const a=[],b=[];for(let i=0;i<n;i++){const x='Sentence '+i+' has '+'w '.repeat((i*7)%23)+'end.';a.push(x);if(i%10===3)b[b.length-1]=b[b.length-1].replace(/end\.$/,'end,')+' '+x;else b.push(x);}return{src:a.join('\n'),tgt:b.join('\n')};};
let r=T.align(sents(300));assert.equal(r.banded,false);assert.equal(r.rows.filter(x=>x.type==='2-1').length,30);
r=TS.align(sents(3000));assert.equal(r.banded,true);assert.equal(r.rows.filter(x=>x.type==='2-1').length,300);assert.equal(r.rows.filter(x=>x.type==='1-1').length,2400);
assert.throws(()=>TS.align(sents(30001)),/up to 30,000 sentences/);
// Stylometry: 500+ texts no longer overflow Math.max(...spread); matrix stays symmetric.
const W='the of and a to in is was it for on that with as he she by at from this be have or one'.split(' ');
const doc=(k,o)=>Array.from({length:k},(_,i)=>W[(i*7+i*i*o+o)%W.length]).join(' ');
let value='';for(let i=0;i<500;i++)value+='### T'+i+'\n'+doc(300,i)+'\n';
const st=T.stylometry({value,mfw:20,measure:'burrows',culling:0});assert.equal(st.docs.length,500);assert.ok(st.max>0);assert.equal(st.M[3][7],st.M[7][3]);assert.equal(st.near.length,500);
assert.throws(()=>TS.stylometry({value:value+'### extra\n'+doc(50,1),mfw:20,measure:'burrows',culling:0}),/Up to 300 texts/);
// Readability and coder suggestions.
const rd=T.readability({value:'### A\n'+'The cat sat on the mat. '.repeat(200)});assert.equal(rd[0].words,1200);assert.equal(rd[0].hard.length,5);
const hits=T.suggest({responses:['too much time','water please','none'],codes:[{name:'Time',kws:['time']},{name:'Water',kws:['water']}]});assert.deepEqual(hits.map(h=>[...h]),[[0],[1],[]]);
assert.throws(()=>TS.suggest({responses:new Array(50001).fill('x'),codes:[]}),/50,000 responses/);
// Language desks follow the shared ceilings.
const L=load('Mozilla/5.0 (X11; Linux x86_64)',['assets/capacity.js','assets/language-engine.js']);
assert.throws(()=>L.DailwindLanguage.run('lexical-metrics','word '.repeat(1200001),{},{}),/6,000,000 characters/);
assert.ok(L.DailwindLanguage.run('lexical-metrics','word '.repeat(500000),{},{}));
console.log('PASS: capacity tiers, banded aligner, stylometry 500 texts, readability, coder suggestions and language-desk ceilings.');
