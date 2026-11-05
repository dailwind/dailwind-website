'use strict';
(function(root){
 function config(value={}){const url=String(value.supabaseUrl||'').replace(/\/$/,''),key=String(value.publishableKey||'');if(!/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(url)||!/^sb_publishable_[A-Za-z0-9_-]{12,300}$/.test(key))throw Error('Email signup is awaiting setup. No code has been sent.');return {url,key};}
 function profile(name,institute=''){name=String(name||'').trim();institute=String(institute||'').trim();if(name.length<2||name.length>120||institute.length>180||/[\u0000-\u001f\u007f]/.test(name+institute))throw Error('Enter your name (2–120 characters) and optional institute (up to 180 characters).');return {full_name:name,institute};}
 function create(value,fetcher=root.fetch.bind(root)){const c=config(value);let session=null;
  const redirect=()=>{const u=root.location;return u&&u.origin==='https://dailwind.com'&&['/pmc/','/pmc/account/','/manage/','/mat-cleaner/'].includes(u.pathname)?u.origin+u.pathname:'https://dailwind.com/pmc/account/';};
  function remember(data){const user=data.user;if(!data.access_token||!user?.id||!user?.email||!user.email_confirmed_at||user.is_anonymous)throw Error('A verified email account is required.');session={token:data.access_token,id:user.id,email:user.email,expires:Date.now()+Math.max(1,Math.min(3600,Number(data.expires_in)||3600))*1000};return {id:session.id,email:session.email};}
  async function request(path,method='GET',data,token){const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),path==='/rest/v1/rpc/dw_pmc_finish'?45000:15000);try{const r=await fetcher(c.url+path,{method,headers:{apikey:c.key,...(data!==undefined?{'Content-Type':'application/json'}:{}),...(token?{Authorization:'Bearer '+token}:{})},...(data!==undefined?{body:JSON.stringify(data)}:{}),credentials:'omit',cache:'no-store',referrerPolicy:'no-referrer',signal:controller.signal});let result;try{result=await r.json();}catch{result={};}if(!r.ok){const err=Error(result.error_code==='over_email_send_rate_limit'?'The email provider has reached its sending limit. Please wait before retrying or contact arslan@dailwind.com.':result.error_code==='email_address_not_authorized'?'Email delivery is not yet enabled for this address. Contact arslan@dailwind.com.':result.error_code==='otp_disabled'?'New account registration is not enabled yet. Existing members can choose Sign in, or contact Dailwind for access.':r.status===429?'Too many requests. Wait before trying again.':r.status>=500?'The service is unavailable. Try again later.':'The request could not be completed. Check the details or contact the operator.');err.status=r.status;err.code=String(result.error_code||result.code||'');throw err;}return result;}catch(e){if(e.name==='AbortError')throw Error('The request timed out. Check your connection and try again.');throw e;}finally{clearTimeout(timer);}}
  const active=()=>{if(!session||session.expires<=Date.now())throw Error('Your account-page session has expired. Request a new sign-in email.');return session;};
  return {
   async send(email,signup,details){email=String(email||'').trim();if(email.length>254||!/^\S+@[^\s@]+\.[^\s@]+$/.test(email))throw Error('Enter a valid email address.');const p=signup?profile(details?.full_name,details?.institute):undefined;try{await request('/auth/v1/otp?redirect_to='+encodeURIComponent(redirect()),'POST',{email,create_user:!!signup,...(p?{data:p}:{})});}catch(e){if(!signup&&['user_not_found','signup_disabled'].includes(e.code))return;throw e;}},
   async verify(email,code){if(!/^\d{6,10}$/.test(code))throw Error('Enter the numeric verification code from your email.');let data;try{data=await request('/auth/v1/verify','POST',{email,token:code,type:'email'});}catch(e){if(e.status===400||e.status===401||e.status===403||e.status===422)throw Error('The code is invalid or has expired. Request a new code and use the latest email.');throw e;}
    return remember(data);
   },
   async resume(payload){
    if(!payload)return null;
    if(payload.error||payload.error_code)throw Error('This sign-in link is invalid, expired or already used. Request a new email and use the latest link once.');
    if(payload.code)throw Error('This sign-in link uses an unsupported return format. Request a new sign-in email from this page.');
    if(payload.token_hash){
     if(!['email','signup','magiclink'].includes(payload.type||'email'))throw Error('Request a fresh sign-in email from this page.');
     return remember(await request('/auth/v1/verify','POST',{token_hash:payload.token_hash,type:payload.type||'email'}));
    }
    if(!payload.access_token)return null;
    if(!/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(payload.access_token)||payload.access_token.length>8192)throw Error('This sign-in link is invalid. Request a new email.');
    if(payload.type&&!['email','signup','magiclink'].includes(payload.type))throw Error('Request a fresh sign-in email from this page.');
    // Validate with Auth, never trust identity claims supplied by the URL.
    let user;try{user=await request('/auth/v1/user','GET',undefined,payload.access_token);}catch{throw Error('This sign-in link is invalid or expired. Request a new email and use the latest link.');}
    return remember({access_token:payload.access_token,expires_in:payload.expires_in,user});
   },
   async notifyRequest(tool,userId){if(!['mat','pmc'].includes(tool))throw Error('Unknown service.');return request('/functions/v1/access-request-email','POST',{tool,...(userId?{user_id:userId}:{})},active().token);},
   async loadProfile(){const s=active();const rows=await request('/rest/v1/pmc_profiles?id=eq.'+encodeURIComponent(s.id)+'&select=id,full_name,institute,updated_at','GET',undefined,s.token);if(!Array.isArray(rows))throw Error('Profile storage is unavailable. Contact Dailwind support.');return rows[0]||null;},
   async saveProfile(name,institute){const s=active(),p=profile(name,institute);await request('/rest/v1/pmc_profiles','POST',{id:s.id,...p},s.token).catch(async e=>{if(e.status!==409)throw e;await request('/rest/v1/pmc_profiles?id=eq.'+encodeURIComponent(s.id),'PATCH',p,s.token);});return p;},
   async logout(){const s=session;session=null;if(s)await request('/auth/v1/logout?scope=local','POST',undefined,s.token);},
   researchToken(){return active().token;},
   async publicRpc(name,args={}){if(!['dw_pmc_public_summary','dw_pmc_public_search','dw_pmc_analyze'].includes(name))throw Error('Unknown public preview action.');return request('/rest/v1/rpc/'+name,'POST',args);},
   async rpc(name,args={}){if(!/^dw_[a-z_]+$/.test(name))throw Error('Invalid research action.');return request('/rest/v1/rpc/'+name,'POST',args,active().token);},
   async asset(name){if(!['mat-worker-v86.js','mat-window-v86.js'].includes(name))throw Error('Unknown toolkit asset.');const s=active(),controller=new AbortController(),timer=setTimeout(()=>controller.abort(),20000);try{const r=await fetcher(c.url+'/storage/v1/object/authenticated/dailwind-premium/'+name,{headers:{apikey:c.key,Authorization:'Bearer '+s.token},credentials:'omit',cache:'no-store',referrerPolicy:'no-referrer',signal:controller.signal});if(!r.ok)throw Error('This toolkit needs active approval, or its private files have not been activated yet.');const blob=await r.blob();if(blob.size>2097152)throw Error('Unexpected toolkit file size.');return blob;}finally{clearTimeout(timer);}},
   async uploadAsset(name,file){if(!['mat-worker-v86.js','mat-window-v86.js'].includes(name)||file.size>2097152)throw Error('Choose a supplied toolkit activation file (up to 2 MiB).');const r=await fetcher(c.url+'/storage/v1/object/dailwind-premium/'+name,{method:'POST',headers:{apikey:c.key,Authorization:'Bearer '+active().token,'Content-Type':'application/javascript','x-upsert':'true','cache-control':'no-store'},body:file,credentials:'omit',cache:'no-store',referrerPolicy:'no-referrer'});if(!r.ok)throw Error('Activation upload failed. Check operator permission and private-bucket policies.');}
  };
 }
 root.DailwindPMCAuth={config,profile,create};if(typeof module!=='undefined'&&module.exports)module.exports=root.DailwindPMCAuth;
})(typeof self!=='undefined'?self:globalThis);
