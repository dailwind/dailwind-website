'use strict';
const assert=require('node:assert/strict'),{csv,sortRows}=require('../../assets/pmc-lab.js');
const rows=[{word:'zeta',frequency:3,logdice:2},{word:'alpha',frequency:1,logdice:6}];
assert.equal(sortRows(rows,'frequency')[0].word,'zeta');assert.equal(sortRows(rows,'alphabet')[0].word,'alpha');assert.equal(sortRows(rows,'association')[0].word,'alpha');assert.equal(rows[0].word,'zeta');
const exported=csv([{word:'=SUM(A1)',frequency:2},{word:'a,"b"',frequency:1}]);assert.ok(exported.startsWith('\uFEFF'));assert.ok(exported.includes("'="));assert.ok(exported.includes('"a,""b"""'));assert.equal(csv([]),'');
console.log('PMC lab utilities: stable display sorting, nonmutating source rows, CSV quoting and formula-prefix protection passed.');
