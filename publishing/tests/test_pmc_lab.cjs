'use strict';
const assert=require('node:assert/strict'),{csv,sortRows,cloudRows}=require('../../assets/pmc-lab.js');
const rows=[{word:'zeta',frequency:3,logdice:2},{word:'alpha',frequency:1,logdice:6}];
assert.equal(sortRows(rows,'frequency')[0].word,'zeta');assert.equal(sortRows(rows,'alphabet')[0].word,'alpha');assert.equal(sortRows(rows,'association')[0].word,'alpha');assert.equal(rows[0].word,'zeta');
const exported=csv([{word:'=SUM(A1)',frequency:2},{word:'a,"b"',frequency:1}]);assert.ok(exported.startsWith('\uFEFF'));assert.ok(exported.includes("'="));assert.ok(exported.includes('"a,""b"""'));assert.equal(csv([]),'');
console.log('PMC lab utilities: stable display sorting, nonmutating source rows, CSV quoting and formula-prefix protection passed.');

assert.deepEqual(cloudRows([{word:'a',frequency:10},{word:'123',frequency:9},{word:'patient',frequency:8}]),[{word:'patient',frequency:8}]);

{const {cleanRows,isNoiseToken}=require('../../assets/pmc-lab.js');
for(const t of ['e','1','2','12','3.5','10-20','1–2','%','fig','Figs','et','al','vs','no','pp','(',''])assert.ok(isNoiseToken(t),t);
for(const t of ['disease','patient','covid19','il6','2a','of','ct'])assert.ok(!isNoiseToken(t),t);
assert.deepEqual(cleanRows([{word:'e',frequency:9},{word:'patients',frequency:5},{word:'fig 1',frequency:4},{word:'heart failure',frequency:3},{title:'Doc',frequency:1}]).map(r=>r.word||r.title),['patients','heart failure','Doc']);
console.log('PMC lab noise filter: single characters, pure numbers, punctuation and figure/reference labels removed; real words and alphanumerics kept.');}
