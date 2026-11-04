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
