 'use strict';
importScripts('engine.js?v=20261017');
let docs=[],reference=[],pairs=[];
function summary(){return {files:docs.map(d=>({id:d.id,name:d.name,tokens:d.tokens.length,annotated:d.annotated})),tokens:docs.reduce((n,d)=>n+d.tokens.length,0)};}
self.onmessage=event=>{const {id,type,payload}=event.data;try{let result;if(type==='load'){const next=ArcEngine.prepareWorkspace(payload.docs,payload.reference),aligned=ArcEngine.parsePairs(payload.parallel||'');docs=next.docs;reference=next.reference;pairs=aligned;result=summary();}else if(type==='append'){
 const all=[...docs,...reference];if(all.reduce((n,d)=>n+(d.sourceChars??d.text.length),0)+payload.doc.text.length>ArcEngine.LIMITS.workspaceChars)throw Error('Workspace limit: 20,000,000 characters across target and reference corpora. Remove some files or use a smaller subcorpus.');
 const bucket=payload.role==='reference'?reference:docs;if(bucket.length>=50)throw Error('Maximum 50 files per corpus.');
 const remaining=ArcEngine.LIMITS.tokens-all.reduce((n,d)=>n+d.tokens.length,0),next=ArcEngine.prepare([payload.doc],remaining)[0];if(payload.role==='reference')reference=[...reference,next];else docs=[...docs,next];result=summary();
 }else result=ArcEngine.analyze({...payload,docs:docs.filter(d=>!payload.ids||payload.ids.includes(d.id)),ref:reference,pairs});self.postMessage({id,result});}catch(error){self.postMessage({id,error:error.message});}};
