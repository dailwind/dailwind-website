'use strict';
(()=>{
 // Decorative media is silent. The only motion control lives in the page footer.
 let motionPaused=false;
 const syncs=[];
 const allowed=()=>!motionPaused&&!document.hidden;
 function syncAll(){syncs.forEach(sync=>sync());}
 document.querySelectorAll('[data-motion-toggle]').forEach(button=>button.addEventListener('click',()=>{motionPaused=!motionPaused;document.querySelectorAll('[data-motion-toggle]').forEach(b=>{b.textContent=motionPaused?'Resume automatic media':'Pause automatic media';b.setAttribute('aria-pressed',String(motionPaused));});syncAll();}));
 document.addEventListener('visibilitychange',syncAll);
 window.addEventListener('pageshow',syncAll);
 document.querySelectorAll('[data-phone-showcase]').forEach(box=>{
  const slides=[...box.querySelectorAll('[data-phone-slide]')];if(!slides.length)return;
  const label=box.querySelector('[data-scene-description]'),count=box.querySelector('[data-slide-counter]');
  const captions=['Corpus workspace','Parts of speech','Punctuation pyramid','KWIC concordance','Dispersion plot','File view','Full-screen reading','Word cloud','Sentiment & tone','Analysis history'];
  let index=0,visible=true,timer=null;
  function load(i){const img=slides[i];if(!img.getAttribute('src')&&img.dataset.src)img.src=img.dataset.src;}
  function select(i){index=(i+slides.length)%slides.length;load(index);slides.forEach((s,n)=>s.classList.toggle('is-active',n===index));if(label)label.textContent=captions[index]||'App screen';if(count)count.textContent=String(index+1).padStart(2,'0')+' / '+slides.length;load((index+1)%slides.length);}
  function sync(){if(timer!==null)clearInterval(timer);timer=null;if(allowed()&&visible)timer=setInterval(()=>select(index+1),3500);}
  select(0);syncs.push(sync);sync();
  if('IntersectionObserver'in window)new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();},{threshold:0,rootMargin:'160px'}).observe(box);
 });
 document.querySelectorAll('[data-autoplay-player]').forEach(box=>{
  const video=box.querySelector('video');if(!video)return;let visible=true,pending=false,retry=null;
  video.controls=false;video.removeAttribute('controls');video.muted=true;video.defaultMuted=true;video.loop=true;video.playsInline=true;video.autoplay=true;
  const active=()=>allowed()&&visible;
  function attempt(){if(!active()){if(!video.paused)video.pause();return;}if(pending||!video.paused&&!video.ended)return;pending=true;try{const request=video.play();Promise.resolve(request).catch(()=>{}).finally(()=>{pending=false;if(!active()&&!video.paused)video.pause();});}catch{pending=false;}}
  function sync(){if(retry!==null)clearTimeout(retry);retry=null;attempt();}
  function recover(){if(active()){if(retry!==null)clearTimeout(retry);retry=setTimeout(()=>{retry=null;attempt();},180);}}
  for(const event of ['loadeddata','canplay','canplaythrough'])video.addEventListener(event,attempt);
  video.addEventListener('ended',()=>{if(active()){video.currentTime=0;attempt();}});
  video.addEventListener('pause',recover);video.addEventListener('stalled',recover);
  // Browsers can deny autoplay. A normal page interaction retries without a player overlay.
  document.addEventListener('pointerdown',attempt,{passive:true});document.addEventListener('keydown',attempt);
  window.addEventListener('focus',attempt);syncs.push(sync);sync();
  if('IntersectionObserver'in window)new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();},{threshold:0,rootMargin:'160px'}).observe(box);
  setInterval(()=>{if(active()&&(video.paused||video.ended))attempt();},2500);
 });
 const dialog=document.getElementById('screenshot-dialog');if(!dialog)return;
 const enlarged=document.getElementById('enlarged-screenshot'),caption=document.getElementById('screenshot-caption');let opener;
 document.querySelectorAll('[data-open-screenshot]').forEach(b=>b.addEventListener('click',()=>{opener=b;enlarged.src=b.dataset.openScreenshot;enlarged.alt=b.querySelector('img').alt;caption.textContent=b.dataset.caption;dialog.showModal();}));document.querySelector('[data-close-screenshot]')?.addEventListener('click',()=>dialog.close());dialog.addEventListener('close',()=>opener?.focus());
})();
