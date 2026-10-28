'use strict';
importScripts('../corpus-toolkit/engine.js?v=20261017');
self.onmessage=({data})=>{
 const {id,kind,docs,options={}}=data;
 try{
  if(!Array.isArray(docs)||!docs.length||docs.length>50)throw Error('Choose between 1 and 50 files.');
  let total=0;for(const d of docs){if(typeof d.name!=='string'||typeof d.text!=='string'||d.text.length>10000000)throw Error('Invalid or oversized document.');total+=d.text.length;}
  if(total>20000000)throw Error('Use at most 20,000,000 characters per workspace.');
  let outputs=[],duplicates=[];
  if(kind==='cleaner')outputs=docs.map(d=>({name:d.name,original:d.text,...ArcEngine.smartClean(d.text,options)}));
  else if(kind==='converter')outputs=docs.map(d=>({name:d.name,text:d.text,original:d.text,audit:[]}));
  else if(kind==='merger'){
   const separator=options.separator==='headings'?'headings':options.separator==='lines'?'\n\n---\n\n':'\n\n';
   const original=docs.map(d=>separator==='headings'?'### '+d.name+'\n\n'+d.text:d.text).join(separator==='headings'?'\n\n':separator);
   const clean=options.duplicates?ArcEngine.smartClean(original,{duplicates:true}):{text:original,audit:[]};
   outputs=[{name:'merged-corpus.txt',original,...clean}];
  }else if(kind==='duplicates'){
   const seen=new Map();for(const d of docs)for(const p of d.text.split(/\n\s*\n/)){
    const text=p.trim().replace(/\s+/g,' ');if(text.length<30)continue;
    const entry=seen.get(text)||{text,count:0,files:new Set()};entry.count++;entry.files.add(d.name);seen.set(text,entry);
   }
   duplicates=[...seen.values()].filter(x=>x.count>1).map(x=>({text:x.text,count:x.count,files:[...x.files]}));
  }else throw Error('Unknown preparation task.');
  self.postMessage({id,result:{outputs,duplicates,inputChars:total,inputFiles:docs.length}});
 }catch(e){self.postMessage({id,error:e.message});}
};
