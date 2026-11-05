export function makeHandler(env,send=fetch){
 const cors={'Access-Control-Allow-Origin':'https://dailwind.com','Access-Control-Allow-Headers':'authorization,apikey,content-type','Access-Control-Allow-Methods':'POST,OPTIONS','Cache-Control':'no-store','Vary':'Origin'};
 const reply=(status,body)=>new Response(JSON.stringify(body),{status,headers:{...cors,'Content-Type':'application/json'}});
 return async req=>{
  if(req.headers.get('Origin')!=='https://dailwind.com')return reply(403,{error:'origin_not_allowed'});
  if(req.method==='OPTIONS')return new Response(null,{status:204,headers:cors});
  if(req.method!=='POST')return reply(405,{error:'method_not_allowed'});
  const token=req.headers.get('Authorization')||'';if(!/^Bearer [A-Za-z0-9_.-]+$/.test(token))return reply(401,{error:'sign_in_required'});
  const url=env('SUPABASE_URL'),anon=env('SUPABASE_ANON_KEY'),secret=env('SUPABASE_SERVICE_ROLE_KEY');if(!url||!anon||!secret)return reply(503,{error:'service_setup_required'});
  let reader;
  try{
   reader=req.body?.getReader();let bytes=0,chunks=[];if(reader){while(true){const part=await reader.read();if(part.done)break;bytes+=part.value.byteLength;if(bytes>1024){await reader.cancel();return reply(413,{error:'request_too_large'});}chunks.push(part.value);}}
   const body=JSON.parse(new TextDecoder().decode(Uint8Array.from(chunks.flatMap(x=>Array.from(x)))));if(!['mat','pmc'].includes(body.tool))return reply(400,{error:'unknown_service'});
   const userResponse=await send(url+'/auth/v1/user',{headers:{apikey:anon,Authorization:token},signal:AbortSignal.timeout(10000)});if(!userResponse.ok)return reply(401,{error:'sign_in_required'});const user=await userResponse.json();if(!user.id||!user.email_confirmed_at||user.is_anonymous)return reply(401,{error:'verified_email_required'});
   let target=user.id;if(body.user_id&&body.user_id!==user.id){if(!/^[a-f0-9-]{36}$/i.test(body.user_id))return reply(400,{error:'invalid_member'});const check=await send(url+'/rest/v1/rpc/dw_status',{method:'POST',headers:{apikey:anon,Authorization:token,'Content-Type':'application/json'},body:'{}',signal:AbortSignal.timeout(10000)});if(!check.ok||(await check.json()).admin!==true)return reply(403,{error:'owner_required'});target=body.user_id;}
   const apiKey=env('ACCESS_EMAIL_API_KEY'),from=env('ACCESS_EMAIL_FROM');if(!apiKey||!from)return reply(503,{error:'email_setup_required',request_saved:true});
   const rpc=async(name,data)=>{const r=await send(url+'/rest/v1/rpc/'+name,{method:'POST',headers:{apikey:secret,Authorization:'Bearer '+secret,'Content-Type':'application/json'},body:JSON.stringify(data),signal:AbortSignal.timeout(10000)});if(!r.ok)throw Error('notification_store_unavailable');return r.status===204?null:r.json();};
   const item=await rpc('dw_claim_access_mail',{p_user:target,p_tool:body.tool});if(!item)return reply(200,{state:'already_sent_or_not_pending'});
   let sent=false;
   try{const result=await send('https://api.resend.com/emails',{method:'POST',headers:{Authorization:'Bearer '+apiKey,'Content-Type':'application/json','Idempotency-Key':'dailwind-access-'+item.id},body:JSON.stringify({from,to:[item.to_email],subject:(item.tool==='mat'?'MAT Tagger Cleaner':'PMC')+' access request — Dailwind Studio',text:['A verified member has requested access.','', 'Service: '+(item.tool==='mat'?'MAT Tagger Cleaner (paid)':'PMC research'),'Name: '+item.full_name,'Institute: '+(item.institute||'Not supplied'),'Email: '+item.email,'','Purpose:',item.note,'','Review securely: https://dailwind.com/manage/','Signing in or receiving this email does not approve access. Confirm payment before granting MAT access.'].join('\n')}),signal:AbortSignal.timeout(15000)});sent=result.ok;}catch{}
   await rpc('dw_finish_access_mail',{p_id:item.id,p_sent:sent});return reply(sent?200:502,{state:sent?'sent':'delivery_failed',request_saved:true});
  }catch{return reply(503,{error:'notification_unavailable',request_saved:true});}
 };
}
