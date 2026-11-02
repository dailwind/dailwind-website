'use strict';
(function(root){
const n=typeof navigator==='undefined'?{}:navigator,small=/Android|iPhone|iPad|Mobile/i.test(n.userAgent||'')||(n.deviceMemory&&n.deviceMemory<=4);
const text=Object.freeze(small?{fileBytes:100*1048576,fileChars:20000000,workspaceChars:40000000,files:1000,tokens:2000000}:{fileBytes:400*1048576,fileChars:100000000,workspaceChars:200000000,files:2000,tokens:8000000});
const style=Object.freeze(small?{characters:3000000,words:450000,lines:60000,findings:5000}:{characters:8000000,words:1200000,lines:160000,findings:5000});
const pdf=Object.freeze({fileBytes:(small?80:500)*1048576,pages:20000,parts:2000,outputs:(small?150:700)*1048576,zip:(small?60:250)*1048576});
// Research desks (readability, stylometry, aligner, coder) run in a Web Worker; ceilings measured in headless Chromium, Nov 2026.
const desk=Object.freeze(small?{fileBytes:24*1048576,chars:12000000,texts:500,styloTexts:300,styloWork:200000000,alignSentences:30000,alignCells:6000000,responses:50000}:{fileBytes:96*1048576,chars:45000000,texts:2000,styloTexts:1000,styloWork:1000000000,alignSentences:100000,alignCells:24000000,responses:200000});
// Focused language desks (characters per input); analysis runs in language-worker.js.
const lang=Object.freeze(small?{sentiment:40000,lexical:2000000,register:2000000,forensic:600000,parse:200000,conllu:1000000}:{sentiment:100000,lexical:6000000,register:6000000,forensic:2000000,parse:600000,conllu:3000000});
const api={small,text,style,pdf,desk,lang};root.ArcCapacity=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof self!=='undefined'?self:globalThis);
