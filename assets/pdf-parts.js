'use strict';
(function(root){
function plan(total,{first=1,last=total,method='parts',amount=10,custom=''}={}){
 if(!Number.isInteger(total)||total<1||total>20000)throw Error('Use a PDF with 1–20,000 pages.');
 if(!Number.isInteger(first)||!Number.isInteger(last)||first<1||last>total||last<first)throw Error('Choose a valid page range.');
 const n=last-first+1,out=[];
 if(method==='custom'){
  const terms=String(custom).split(/[,;\n]/).map(s=>s.trim()).filter(Boolean);if(!terms.length||terms.length>2000)throw Error('Enter 1–2,000 custom page ranges.');
  let previous=first-1;for(const term of terms){const m=/^(\d+)(?:\s*-\s*(\d+))?$/.exec(term);if(!m)throw Error('Use ranges such as 1-50, 51-100, 101.');const from=+m[1],to=+(m[2]||m[1]);if(from<first||to>last||to<from||from<=previous)throw Error('Custom ranges must be in order, non-overlapping and inside the selected pages.');out.push({from,to});previous=to;}
 }else{
  if(!Number.isInteger(amount)||amount<1)throw Error('Enter a positive whole number.');
  const count=method==='pages'?Math.ceil(n/amount):amount;if(count>Math.min(n,2000))throw Error('Choose at most 2,000 non-empty parts, and no more parts than selected pages.');
  let from=first;for(let i=0;i<count;i++){const length=method==='pages'?Math.min(amount,last-from+1):Math.floor(n/count)+(i<n%count?1:0);out.push({from,to:from+length-1});from+=length;}
 }
 return out;
}
function base(name){return String(name).replace(/\.pdf$/i,'').replace(/[\x00-\x1f<>:"/\\|?*]/g,'_').replace(/^\.+/,'').slice(0,100)||'PDF';}
function partName(name,index,count,range){return base(name)+'-Part-'+String(index+1).padStart(Math.max(2,String(count).length),'0')+'-pages-'+range.from+'-'+range.to+'.pdf';}
const api={plan,base,partName};root.ArcPDFParts=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof self!=='undefined'?self:globalThis);
