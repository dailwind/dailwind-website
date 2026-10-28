'use strict';
importScripts('../assets/capacity.js?v=81','engine.js?v=81');
self.onmessage=e=>{try{self.postMessage({id:e.data.id,result:StyleEngine.analyze(e.data.input)});}catch(error){self.postMessage({id:e.data.id,error:error.message});}};
