'use strict';
importScripts('engine.js?v=20261013');
let docs=[],reference=[],pairs=[];
self.onmessage=event=>{const {id,type,payload}=event.data;try{let result;if(type==='load'){docs=ArcEngine.prepare(payload.docs);reference=ArcEngine.prepare(payload.reference);pairs=ArcEngine.parsePairs(payload.parallel||'');result={files:docs.map(d=>({id:d.id,name:d.name,tokens:d.tokens.length,annotated:d.annotated})),tokens:docs.reduce((n,d)=>n+d.tokens.length,0)};}else result=ArcEngine.analyze({...payload,docs:docs.filter(d=>!payload.ids||payload.ids.includes(d.id)),ref:reference,pairs});self.postMessage({id,result});}catch(error){self.postMessage({id,error:error.message});}};
