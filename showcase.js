'use strict';
(() => {
 const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
 const scenes = ['corpus', 'kwic', 'wordlist', 'cloud', 'plot'];
 const descriptions = {
  corpus: 'A built-in sample corpus, with token counts and language statistics.',
  kwic: '“Language” in context — concordance results from the app’s own sample texts.',
  wordlist: 'Word frequencies calculated from the built-in sample corpus.',
  cloud: 'A word cloud generated from the app’s sample texts.',
  plot: 'See where “language” appears across the sample texts.'
 };
 document.querySelectorAll('[data-phone-showcase]').forEach(showcase => {
  const frame = showcase.querySelector('[data-sample-frame]');
  const buttons = [...showcase.querySelectorAll('[data-scene]')];
  const toggle = showcase.querySelector('[data-tour-toggle]');
  const description = showcase.querySelector('[data-scene-description]');
  const status = showcase.querySelector('[data-preview-status]');
  let ready = false, paused = reducedMotion.matches, visible = false, current = 'corpus', timer, transitionTimer;
  function syncTour() {
   clearInterval(timer);
   toggle.textContent = paused ? 'Play tour ▶' : 'Pause tour Ⅱ';
   toggle.setAttribute('aria-label', paused ? 'Play the sample screen tour' : 'Pause the sample screen tour');
   if (ready && visible && !paused && !document.hidden) {
    timer = setInterval(() => select(scenes[(scenes.indexOf(current) + 1) % scenes.length]), 8000);
   }
  }
  function select(scene) {
   if (!scenes.includes(scene)) return;
   current = scene;
   buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.scene === scene)));
   description.textContent = descriptions[scene];
   if (ready) {
    clearTimeout(transitionTimer);
    if (!reducedMotion.matches) showcase.classList.add('is-switching');
    transitionTimer = setTimeout(() => {
     frame.contentWindow.postMessage({ type: 'linguax-show-scene', scene }, '*');
     transitionTimer = setTimeout(() => showcase.classList.remove('is-switching'), 450);
    }, reducedMotion.matches ? 0 : 140);
   }
  }
  buttons.forEach(button => button.addEventListener('click', () => {
   paused = true;
   select(button.dataset.scene);
   syncTour();
  }));
  toggle.addEventListener('click', () => { paused = !paused; syncTour(); });
  window.addEventListener('message', event => {
   // The sandboxed frame deliberately has an opaque origin.
   if (event.source !== frame.contentWindow || event.origin !== 'null') return;
   const data = event.data;
   if (!data || typeof data !== 'object') return;
   if (data.type === 'linguax-ready') {
    ready = true;
    showcase.classList.add('is-ready');
    status.textContent = 'Preview ready. Choose a screen or watch the tour.';
    select(current);
    syncTour();
   } else if (data.type === 'linguax-scene' && data.scene === current) {
    showcase.classList.remove('is-switching');
   } else if (data.type === 'linguax-error') {
    ready = false;
    showcase.classList.remove('is-ready');
    status.textContent = 'Showing an official app screenshot. The sample preview could not start.';
    syncTour();
   }
  });
  document.addEventListener('visibilitychange', syncTour);
  reducedMotion.addEventListener('change', event => { if (event.matches) { paused = true; syncTour(); } });
  if ('IntersectionObserver' in window) {
   const observer = new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    syncTour();
   }, { threshold: .15 });
   observer.observe(showcase);
  } else visible = true;
  setTimeout(() => {
   if (!ready) status.textContent = 'Showing an official app screenshot while the sample preview loads.';
  }, 12000);
  select(current);
  syncTour();
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
