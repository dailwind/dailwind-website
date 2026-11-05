'use strict';
importScripts('metadata-core.js?v=81');
self.onmessage=({data})=>{try{const {id,text,options}=data;if(typeof text!=='string'||text.length>100000000)throw Error('Metadata analysis accepts up to 100 million characters per file.');self.postMessage({id,result:ArcMetadata.measure(text,options)});}catch(e){self.postMessage({id:data.id,error:e.message});}};
