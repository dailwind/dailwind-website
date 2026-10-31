'use strict';
// Capture auth fragments before optional analytics. Never store credentials.
(()=>{
 const keys=['access_token','refresh_token','expires_in','expires_at','token_type','type','token_hash','error','error_code','error_description','code'];
 const hash=new URLSearchParams(location.hash.slice(1)),query=new URLSearchParams(location.search),payload={};
 for(const key of keys){const value=hash.get(key)||query.get(key);if(value)payload[key]=value;}
 if(!payload.access_token&&!payload.token_hash&&!payload.error&&!payload.error_code&&!payload.code)return;
 const callbackPaths=['/pmc/','/pmc/index.html','/pmc/account/','/pmc/account/index.html','/manage/','/manage/index.html','/mat-cleaner/','/mat-cleaner/index.html'];
 if(!callbackPaths.includes(location.pathname)){
  location.replace('/pmc/account/#'+new URLSearchParams(payload).toString());return;
 }
 // Remove credentials immediately; the account controller consumes them once.
 for(const key of keys)query.delete(key);
 history.replaceState(null,'',location.pathname+(query.size?'?'+query.toString():''));
 Object.defineProperty(window,'DailwindAuthReturn',{value:payload,configurable:true});
})();
