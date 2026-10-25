'use strict';
importScripts('engine.js?v=20261025');
self.onmessage=e=>{try{self.postMessage({id:e.data.id,result:StyleEngine.analyze(e.data.input)});}catch(error){self.postMessage({id:e.data.id,error:error.message});}};
