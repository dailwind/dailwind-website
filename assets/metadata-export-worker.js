'use strict';
importScripts('../corpus-toolkit/exports.js','metadata-export.js?v=81');
self.onmessage=({data})=>{try{const out=ArcMetadataExport.workbook(data.sheets,CorpusExports.zip);self.postMessage({buffer:out.buffer},[out.buffer]);}catch(e){self.postMessage({error:e.message});}};
