'use strict';
importScripts('ocr-image.js?v=20261028');
self.onmessage=({data})=>{try{const pixels=new Uint8ClampedArray(data.buffer);OCRImage.processPixels(pixels,data.width,data.height,data.mode,data.despeckle);self.postMessage({buffer:pixels.buffer},[pixels.buffer]);}catch(e){self.postMessage({error:e.message});}};
