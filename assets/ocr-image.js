'use strict';
(function(root){
function processPixels(data,width,height,mode='contrast',despeckle=false){
 if(width*height>8000000||data.length!==width*height*4)throw Error('Image exceeds the processing limit.');
 const n=width*height,gray=new Uint8Array(n),hist=new Uint32Array(256);
 for(let i=0;i<n;i++){const p=i*4,a=data[p+3]/255;const v=Math.round((.299*data[p]+.587*data[p+1]+.114*data[p+2])*a+255*(1-a));gray[i]=v;hist[v]++;}
 if(mode==='contrast'||mode==='adaptive'){
  let low=0,high=255,sum=0;for(let i=0;i<256;i++){sum+=hist[i];if(sum>=n*.015){low=i;break;}}sum=0;for(let i=255;i>=0;i--){sum+=hist[i];if(sum>=n*.015){high=i;break;}}
  if(high-low>15)for(let i=0;i<n;i++)gray[i]=Math.max(0,Math.min(255,Math.round((gray[i]-low)*255/(high-low))));
 }
 if(mode==='otsu'){
  let total=0;for(let i=0;i<256;i++)total+=i*hist[i];let left=0,leftSum=0,best=-1,threshold=127;
  for(let i=0;i<256;i++){left+=hist[i];if(!left)continue;const right=n-left;if(!right)break;leftSum+=i*hist[i];const d=leftSum/left-(total-leftSum)/right,v=left*right*d*d;if(v>best){best=v;threshold=i;}}
  for(let i=0;i<n;i++)gray[i]=gray[i]<=threshold?0:255;
 }
 if(mode==='adaptive'){
  const stride=width+1,integral=new Uint32Array(stride*(height+1));
  for(let y=0;y<height;y++){let row=0;for(let x=0;x<width;x++){row+=gray[y*width+x];integral[(y+1)*stride+x+1]=integral[y*stride+x+1]+row;}}
  const original=gray.slice(),radius=Math.max(12,Math.min(45,Math.round(width/55)));
  for(let y=0;y<height;y++)for(let x=0;x<width;x++){const l=Math.max(0,x-radius),r=Math.min(width,x+radius+1),t=Math.max(0,y-radius),b=Math.min(height,y+radius+1),mean=(integral[b*stride+r]-integral[t*stride+r]-integral[b*stride+l]+integral[t*stride+l])/((r-l)*(b-t));gray[y*width+x]=original[y*width+x]<mean-10?0:255;}
 }
 if(despeckle&&['otsu','adaptive'].includes(mode)){
  const copy=gray.slice();for(let y=1;y<height-1;y++)for(let x=1;x<width-1;x++){const i=y*width+x;if(copy[i]!==0)continue;let count=0;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)if((dx||dy)&&copy[i+dy*width+dx]===0)count++;if(count===0)gray[i]=255;}
 }
 for(let i=0;i<n;i++){const p=i*4;data[p]=data[p+1]=data[p+2]=gray[i];data[p+3]=255;}return data;
}
root.OCRImage={processPixels};if(typeof module!=='undefined'&&module.exports)module.exports=root.OCRImage;
})(typeof self!=='undefined'?self:globalThis);
