'use strict';
(()=>{
 // Decorative media is silent. The only motion control lives in the page footer.
 // The phone slideshow always runs (it only rests while the tab is hidden); reduced motion gets a plain crossfade.
 const reduce=window.matchMedia?window.matchMedia('(prefers-reduced-motion: reduce)'):null;
 let motionPaused=!!(reduce&&reduce.matches);
 const syncs=[];
 function syncAll(){syncs.forEach(sync=>sync());}
 function label(){document.querySelectorAll('[data-motion-toggle]').forEach(b=>{b.textContent=motionPaused?'Resume automatic media':'Pause automatic media';b.setAttribute('aria-pressed',String(motionPaused));});}
 document.querySelectorAll('[data-motion-toggle]').forEach(button=>button.addEventListener('click',()=>{motionPaused=!motionPaused;label();syncAll();}));
 label();
 document.addEventListener('visibilitychange',syncAll);
 window.addEventListener('pageshow',syncAll);
 document.querySelectorAll('[data-phone-showcase]').forEach(box=>{
  const slides=[...box.querySelectorAll('[data-phone-slide]')];if(!slides.length)return;
  const label=box.querySelector('[data-scene-description]'),count=box.querySelector('[data-slide-counter]');
  const captions=['Corpus workspace','Parts of speech','Punctuation pyramid','KWIC concordance','Dispersion plot','File view','Full-screen reading','Word cloud','Sentiment & tone','Analysis history'];
  let index=0,timer=null;
  function load(i){const img=slides[i];if(!img.getAttribute('src')&&img.dataset.src)img.src=img.dataset.src;}
  function select(i){index=(i+slides.length)%slides.length;load(index);slides.forEach((s,n)=>s.classList.toggle('is-active',n===index));if(label)label.textContent=captions[index]||'App screen';if(count)count.textContent=String(index+1).padStart(2,'0')+' / '+slides.length;load((index+1)%slides.length);}
  function sync(){if(timer!==null)clearInterval(timer);timer=null;if(!document.hidden)timer=setInterval(()=>select(index+1),2000);}
  select(0);syncs.push(sync);sync();
 });
 // Videos always autoplay muted and loop; no pause state, footer toggle or reduced-motion setting stops them.
 document.querySelectorAll('[data-autoplay-player]').forEach(box=>{
  const video=box.querySelector('video');if(!video)return;let pending=false;
  video.controls=false;video.removeAttribute('controls');video.muted=true;video.defaultMuted=true;video.loop=true;video.playsInline=true;video.autoplay=true;video.preload='auto';
  function attempt(){if(pending||!video.paused&&!video.ended)return;pending=true;try{const request=video.play();Promise.resolve(request).catch(()=>{}).finally(()=>{pending=false;});}catch{pending=false;}}
  for(const event of ['loadedmetadata','loadeddata','canplay','canplaythrough','pause','stalled'])video.addEventListener(event,attempt);
  video.addEventListener('ended',()=>{video.currentTime=0;attempt();});
  // Browsers can deny autoplay. A normal page interaction retries without a player overlay.
  document.addEventListener('pointerdown',attempt,{passive:true});document.addEventListener('keydown',attempt);
  document.addEventListener('visibilitychange',attempt);window.addEventListener('pageshow',attempt);window.addEventListener('focus',attempt);
  attempt();setInterval(attempt,1000);
 });
 const dialog=document.getElementById('screenshot-dialog');if(!dialog)return;
 const enlarged=document.getElementById('enlarged-screenshot'),caption=document.getElementById('screenshot-caption');let opener;
 document.querySelectorAll('[data-open-screenshot]').forEach(b=>b.addEventListener('click',()=>{opener=b;enlarged.src=b.dataset.openScreenshot;enlarged.alt=b.querySelector('img').alt;caption.textContent=b.dataset.caption;dialog.showModal();}));document.querySelector('[data-close-screenshot]')?.addEventListener('click',()=>dialog.close());dialog.addEventListener('close',()=>opener?.focus());
})();
