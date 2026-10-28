'use strict';
(function(root){
const n=typeof navigator==='undefined'?{}:navigator,small=/Android|iPhone|iPad|Mobile/i.test(n.userAgent||'')||(n.deviceMemory&&n.deviceMemory<=4);
const text=Object.freeze(small?{fileBytes:60*1048576,fileChars:10000000,workspaceChars:20000000,files:250,tokens:1000000}:{fileBytes:250*1048576,fileChars:50000000,workspaceChars:100000000,files:500,tokens:3000000});
const style=Object.freeze(small?{characters:2000000,words:300000,lines:40000,findings:5000}:{characters:5000000,words:750000,lines:100000,findings:5000});
const pdf=Object.freeze({fileBytes:(small?80:500)*1048576,pages:20000,parts:2000,outputs:(small?150:700)*1048576,zip:(small?60:250)*1048576});
const api={small,text,style,pdf};root.ArcCapacity=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof self!=='undefined'?self:globalThis);
