'use strict';
importScripts('mat-core.js?v=82');
self.onmessage=({data})=>{try{if(typeof data.text!=='string'||data.text.length>100000000)throw Error('Use up to 100 million characters per file.');self.postMessage({id:data.id,result:ArcMAT.process(data.text,data.options)});}catch(e){self.postMessage({id:data.id,error:e.message});}};
