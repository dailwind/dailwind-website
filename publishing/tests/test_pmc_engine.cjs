'use strict';
const assert=require('node:assert/strict');
const {DEMO,tokens,analyze}=require('../../assets/pmc-engine.js');
const all=tokens(DEMO.map(d=>d.text).join(' '));
const words=analyze({tool:'words'});
assert.equal(words.tokens,all.length);
assert.equal(words.rows.reduce((n,r)=>n+r.count,0),all.length);
const clinical=all.filter(t=>t.key==='clinical').length;
assert.equal(analyze({query:'clinical'}).hits,clinical);
assert.equal(analyze({query:'clinical',caseSensitive:true}).hits,all.filter(t=>t.word==='clinical').length);
assert.equal(analyze({query:'CLINICAL',caseSensitive:true}).hits,0);
for(const size of [2,3,4,5]){
 const r=analyze({tool:'ngrams',ngram:size});
 assert.equal(r.rows.reduce((n,row)=>n+row.count,0),DEMO.reduce((n,d)=>n+Math.max(0,tokens(d.text).length-size+1),0));
 const expected=new Map();for(const d of DEMO){const ts=tokens(d.text);for(let i=0;i<=ts.length-size;i++){const key=ts.slice(i,i+size).map(t=>t.key).join(' ');expected.set(key,(expected.get(key)||0)+1);}}
 assert.deepEqual(new Map(r.rows.map(x=>[x.word,x.count])),expected);
 assert.deepEqual(r,analyze({tool:'ngrams',ngram:size}));
}
for(const genre of new Set(DEMO.map(d=>d.genre))){const r=analyze({genre,tool:'words'});assert.equal(r.files,DEMO.filter(d=>d.genre===genre).length);assert.equal(r.tokens,DEMO.filter(d=>d.genre===genre).reduce((n,d)=>n+tokens(d.text).length,0));}
assert.equal(analyze({query:'clinical',tool:'distribution'}).rows.reduce((n,r)=>n+r.count,0),clinical);
assert.ok(analyze({query:'clinical',tool:'collocates',window:10}).rows.reduce((n,r)=>n+r.count,0)>analyze({query:'clinical',tool:'collocates',window:3}).rows.reduce((n,r)=>n+r.count,0));
assert.throws(()=>analyze({query:''}));assert.throws(()=>analyze({query:'a'.repeat(81)}));
console.log('PMC engine: token totals, case matching, all n-gram sizes, document boundaries, genre filters, distribution and context windows passed.');
