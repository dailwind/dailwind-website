import assert from 'node:assert/strict';
import {makeHandler} from '../functions/access-request-email/handler.mjs';
const actor='11111111-1111-4111-8111-111111111111',other='22222222-2222-4222-8222-222222222222';
const base={SUPABASE_URL:'https://project.supabase.co',SUPABASE_ANON_KEY:'public-key',SUPABASE_SERVICE_ROLE_KEY:'server-only-key',ACCESS_EMAIL_API_KEY:'mail-only-key',ACCESS_EMAIL_FROM:'Research <research@example.org>'};
const user={id:actor,email_confirmed_at:'2026-11-01',is_anonymous:false};
const request=(body={tool:'mat'},headers={})=>new Request('https://function.example',{method:'POST',headers:{Origin:'https://dailwind.com',Authorization:'Bearer test.token.value',...headers},body:JSON.stringify(body)});
function fixture({settings=base,verified=user,admin=false,provider=200,item=true}={}){let calls=[];const fetcher=async(url,opts)=>{calls.push({url,opts});if(url.endsWith('/auth/v1/user'))return Response.json(verified);if(url.endsWith('dw_status'))return Response.json({admin});if(url.endsWith('dw_claim_access_mail'))return Response.json(item?{id:'mail-id',tool:'mat',email:'member@example.org',full_name:'Member',institute:'Institute',note:'Research purpose',to_email:'owner@example.org'}:null);if(url.endsWith('dw_finish_access_mail'))return new Response(null,{status:204});if(url==='https://api.resend.com/emails')return Response.json({id:'provider-id'},{status:provider});throw Error('Unexpected request');};return {run:makeHandler(name=>settings[name],fetcher),calls};}
let f=fixture();assert.equal((await f.run(request({}, {Origin:'https://attacker.example'}))).status,403);assert.equal(f.calls.length,0);
f=fixture();assert.equal((await f.run(request({}, {Authorization:''}))).status,401);
f=fixture();assert.equal((await f.run(request({tool:'unknown'}))).status,400);
f=fixture({verified:{...user,email_confirmed_at:null}});assert.equal((await f.run(request())).status,401);
f=fixture({settings:{...base,ACCESS_EMAIL_API_KEY:''}});assert.equal((await f.run(request())).status,503);assert(!f.calls.some(x=>x.url.includes('resend.com')));
f=fixture();assert.equal((await f.run(request())).status,200);let sent=f.calls.find(x=>x.url.includes('resend.com'));let body=JSON.parse(sent.opts.body);assert.deepEqual(body.to,['owner@example.org']);assert(body.text.includes('https://dailwind.com/manage/'));assert(body.text.includes('does not approve access'));assert.equal(sent.opts.headers['Idempotency-Key'],'dailwind-access-mail-id');assert.equal(JSON.parse(f.calls.at(-1).opts.body).p_sent,true);
f=fixture({provider:429});assert.equal((await f.run(request())).status,502);assert.equal(JSON.parse(f.calls.at(-1).opts.body).p_sent,false);
f=fixture();assert.equal((await f.run(request({tool:'mat',user_id:other}))).status,403);assert(!f.calls.some(x=>x.url.includes('dw_claim_access_mail')));
f=fixture({admin:true});assert.equal((await f.run(request({tool:'mat',user_id:other}))).status,200);assert.equal(JSON.parse(f.calls.find(x=>x.url.includes('dw_claim_access_mail')).opts.body).p_user,other);
f=fixture({item:false});assert.equal((await f.run(request())).status,200);assert(!f.calls.some(x=>x.url.includes('resend.com')));
console.log('Email notifications: authentication, origin, private recipient, owner-only retry, missing setup, idempotency and failure checks passed. No email was sent.');
