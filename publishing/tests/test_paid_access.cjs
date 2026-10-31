const assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),crypto=require('node:crypto');
(async()=>{
 const events={},nodes=new Map(),workers=[],revoked=[];let state={admin:false,tools:{mat:{active:false,state:'not_requested'},pmc:{active:false,state:'not_requested'}}},fail=false,assetReads=0;
 const client={rpc:async()=>{if(fail)throw Error('offline');return state;},asset:async()=>{assetReads++;return new Blob(['approved bundle']);}};
 const window={addEventListener:()=>{},DailwindMATManifest:{'mat-worker-v86.js':crypto.createHash('sha256').update('approved bundle').digest('hex')}};
 const document={hidden:false,getElementById:id=>nodes.get(id)||null,addEventListener:(name,fn)=>events[name]=fn};
 const context={window,document,crypto:crypto.webcrypto,Blob,URL:{createObjectURL:()=> 'blob:approved',revokeObjectURL:url=>revoked.push(url)},Worker:class{constructor(){this.stopped=false;workers.push(this);}terminate(){this.stopped=true;}},setInterval:()=>0,Promise,Error,Map,Set,Date};
 vm.runInNewContext(fs.readFileSync(require.resolve('../../assets/member-access.js'),'utf8'),context);
 const access=window.DailwindAccess;await events['dailwind-auth']({detail:{client}});
 await assert.rejects(()=>access.worker(),/approval/);assert.equal(assetReads,0);
 state={admin:false,tools:{mat:{active:true,state:'approved',expires_at:'2026-12-01'},pmc:{active:false,state:'not_requested'}}};
 await access.refresh();await access.worker();assert.equal(assetReads,1);assert.equal(workers.length,1);
 fail=true;await assert.rejects(()=>access.refresh(),/offline/);assert.equal(access.status.tools.mat.active,false);assert.equal(workers[0].stopped,true);assert.equal(revoked.length,1);await assert.rejects(()=>access.worker(),/offline/);assert.equal(assetReads,1);
 fail=false;state={admin:false,tools:{mat:{active:false,state:'revoked'}}};await access.refresh();await assert.rejects(()=>access.worker(),/approval/);assert.equal(assetReads,1);
 console.log('Paid access: unapproved accounts denied, approval checked before private assets, failure/revocation locks workspace and terminates workers.');
})().catch(error=>{console.error(error);process.exitCode=1;});
