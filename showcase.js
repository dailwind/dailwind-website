'use strict';
(() => {
 const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
 const captions=['Corpus workspace','Parts of speech','Punctuation pyramid','KWIC concordance','Dispersion plot','File view','Full-screen reading','Word cloud','Sentiment & tone','Analysis history'];
 document.querySelectorAll('[data-phone-showcase]').forEach(box=>{
  const slides=[...box.querySelectorAll('[data-phone-slide]')],toggle=box.querySelector('[data-tour-toggle]'),label=box.querySelector('[data-scene-description]');
  let index=0,paused=reducedMotion.matches,visible=true,timer;
  function select(n){index=(n+slides.length)%slides.length;slides.forEach((s,i)=>s.classList.toggle('is-active',i===index));label.textContent=captions[index];}
  function sync(){clearInterval(timer);toggle.textContent=paused?'Play tour ▶':'Pause tour Ⅱ';if(!paused&&visible&&!document.hidden)timer=setInterval(()=>select(index+1),4000);}
  box.querySelector('[data-slide-prev]').addEventListener('click',()=>{paused=true;select(index-1);sync();});box.querySelector('[data-slide-next]').addEventListener('click',()=>{paused=true;select(index+1);sync();});toggle.addEventListener('click',()=>{paused=!paused;sync();});
  document.addEventListener('visibilitychange',sync);reducedMotion.addEventListener('change',e=>{if(e.matches)paused=true;sync();});
  if('IntersectionObserver' in window)new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();},{threshold:.1}).observe(box);
  sync();
 });
 if('IntersectionObserver' in window&&!reducedMotion.matches){const obs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');obs.unobserve(e.target);}}),{threshold:.05});document.querySelectorAll('.section-heading,.purpose-grid,.founder-strip,.capability-grid,.ad-section,.browser-invite,.tool-grid article,.pipeline article').forEach(el=>{el.classList.add('reveal');obs.observe(el);});document.documentElement.classList.add('motion-ready');}
 document.querySelectorAll('[data-ad-slot]').forEach(slot=>{
  const video=slot.querySelector('video'),toggle=slot.querySelector('[data-video-toggle]');let manualPaused=reducedMotion.matches,loaded=false,visible=true;
  video.muted=true;video.defaultMuted=true;video.playsInline=true;video.autoplay=!manualPaused;
  function label(){toggle.textContent=video.paused?'Play video ▶':'Pause video Ⅱ';}
  async function play(){if(manualPaused||document.hidden||!visible){video.pause();return;}try{await video.play();}catch{label();}label();}
  function load(){if(loaded)return;loaded=true;video.muted=true;video.load();}
  const ready=()=>{slot.classList.add('has-video');play();};
  video.addEventListener('loadedmetadata',ready);video.addEventListener('loadeddata',ready);video.addEventListener('canplay',ready);video.addEventListener('error',()=>{label();toggle.textContent='Retry video ▶';});video.addEventListener('play',label);video.addEventListener('pause',label);
  toggle.addEventListener('click',()=>{manualPaused=!video.paused;if(manualPaused)video.pause();else{if(video.error){loaded=false;load();}video.muted=true;video.play().catch(label);}label();});document.addEventListener('visibilitychange',()=>{if(document.hidden)video.pause();else play();});
  if('IntersectionObserver' in window)new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible){load();play();}else video.pause();},{threshold:0,rootMargin:'200px'}).observe(slot);else{load();play();}label();
 });
 const track = document.querySelector('[data-gallery-track]');
 function moveGallery(direction) {
  if (!track) return;
  track.scrollBy({ left: direction * track.clientWidth * .75, behavior: reducedMotion.matches ? 'auto' : 'smooth' });
 }
 document.querySelector('[data-gallery-prev]')?.addEventListener('click', () => moveGallery(-1));
 document.querySelector('[data-gallery-next]')?.addEventListener('click', () => moveGallery(1));
 const dialog = document.querySelector('#screenshot-dialog');
 if (!dialog) return;
 const enlarged = document.querySelector('#enlarged-screenshot');
 const caption = document.querySelector('#screenshot-caption');
 document.querySelectorAll('[data-open-screenshot]').forEach(button => button.addEventListener('click', () => {
  enlarged.src = button.dataset.openScreenshot;
  enlarged.alt = button.querySelector('img').alt;
  caption.textContent = button.dataset.caption;
  dialog.showModal();
 }));
 document.querySelector('[data-close-screenshot]').addEventListener('click', () => dialog.close());
 dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const bounds = dialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
 });

})();
