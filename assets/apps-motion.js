'use strict';
// Staggered entrance for App Store cards, same approach as showcase.js (.reveal + .is-visible).
(()=>{
 if(matchMedia('(prefers-reduced-motion: reduce)').matches||!('IntersectionObserver' in window))return;
 const cards=document.querySelectorAll('.apps-page .apps-hero>*,.apps-page .app-card,.apps-page .apps-section>header');
 if(!cards.length)return;
 document.documentElement.classList.add('apps-motion');
 const obs=new IntersectionObserver(entries=>entries.forEach(en=>{if(en.isIntersecting){en.target.classList.add('is-visible');obs.unobserve(en.target);}}),{threshold:.08,rootMargin:'0px 0px -6% 0px'});
 cards.forEach(c=>obs.observe(c));
})();

// Owl demo video: muted loop that plays only while on screen; respects reduced motion and the site "Pause automatic media" toggle.
(()=>{
 const vids=document.querySelectorAll('video[data-app-video]');if(!vids.length)return;
 const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const paused=()=>[...document.querySelectorAll('[data-motion-toggle]')].some(b=>b.getAttribute('aria-pressed')==='true');
 vids.forEach(v=>{v.muted=true;
  if(reduce||!('IntersectionObserver' in window)){v.controls=true;v.preload='metadata';return;}
  let seen=false;const sync=()=>{if(seen&&!paused()&&!document.hidden){v.play().catch(()=>{v.controls=true;});}else v.pause();};
  new IntersectionObserver(en=>{seen=en[0].isIntersecting;sync();},{threshold:.25}).observe(v);
  document.addEventListener('visibilitychange',sync);
  document.querySelectorAll('[data-motion-toggle]').forEach(b=>b.addEventListener('click',()=>setTimeout(sync,0)));
 });
})();
