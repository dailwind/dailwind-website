'use strict';
// Reading Room: gentle reveal-on-scroll. Skipped entirely when the visitor prefers reduced motion.
(()=>{
 const reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 if(reduce||!('IntersectionObserver' in window))return;
 const items=[...document.querySelectorAll('.reading-greek .greek-painting,.reading-greek .greek-intro,.reading-greek .articles-toolbar,.reading-greek .article-row,.reading-greek .submission-note,.reading-greek .article-header,.reading-greek .article-body')];
 if(!items.length)return;
 document.documentElement.classList.add('rr-motion');
 const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(!entry.isIntersecting)return;entry.target.classList.add('rr-in');observer.unobserve(entry.target);});},{rootMargin:'0px 0px -6% 0px',threshold:.08});
 items.forEach((item,i)=>{if(item.classList.contains('article-row'))item.style.setProperty('--rr-delay',(i%2)*70+'ms');observer.observe(item);});
 // Anything already scrolled past (fast scrolls, anchor jumps) is revealed at once.
 let queued=false;const sweep=()=>{queued=false;items.forEach(item=>{if(!item.classList.contains('rr-in')&&item.getBoundingClientRect().top<innerHeight){item.classList.add('rr-in');observer.unobserve(item);}});};
 addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(sweep);}},{passive:true});
 // Safety net: never leave content hidden if an observer callback is missed.
 setTimeout(()=>items.forEach(item=>item.classList.add('rr-in')),2500);
})();
