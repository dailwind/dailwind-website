/* "Our apps, in your pocket." — home page showcase (file name kept for cache history).
   One phone presents each Dailwind app in turn: it changes by itself every few seconds,
   the icons under the phone (or a swipe on the phone) pick an app, and hovering pauses it. */
(function () {
  'use strict';
  var root = document.querySelector('[data-app-show]');
  if (!root) return;
  var slides = Array.prototype.slice.call(root.querySelectorAll('[data-ps-slide]'));
  var picks = Array.prototype.slice.call(root.querySelectorAll('[data-ps-pick]'));
  var n = slides.length;
  if (!n) return;
  var cur = 0, timer = 0, paused = false, userPaused = false, visible = true;
  var STEP = 4800;

  function accentOf(i) { return getComputedStyle(slides[i]).getPropertyValue('--accent').trim() || '#0071e3'; }
  function links(i) { slides.forEach(function (s, k) { s.querySelectorAll('a').forEach(function (a) { a.tabIndex = k === i ? 0 : -1; }); }); }
  function show(i) {
    i = (i + n) % n;
    if (i === cur) return;
    var old = slides[cur];
    old.classList.remove('is-on'); old.classList.add('is-out'); old.setAttribute('aria-hidden', 'true');
    setTimeout(function () { old.classList.remove('is-out'); }, 700);
    slides[i].classList.add('is-on'); slides[i].removeAttribute('aria-hidden');
    picks.forEach(function (p, k) { p.classList.toggle('is-on', k === i); p.setAttribute('aria-pressed', k === i ? 'true' : 'false'); });
    root.style.setProperty('--show-accent', accentOf(i));
    links(i);
    cur = i;
  }
  function schedule() {
    clearTimeout(timer);
    timer = setTimeout(function () {
      if (!paused && !userPaused && visible && !document.hidden) show(cur + 1);
      schedule();
    }, STEP);
  }

  picks.forEach(function (p, k) { p.addEventListener('click', function () { show(k); schedule(); }); });
  root.addEventListener('keydown', function (e) {
    if (!e.target.closest('.show-picks')) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); show(cur + 1); picks[cur].focus(); schedule(); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); show(cur - 1); picks[cur].focus(); schedule(); }
  });
  var phone = root.querySelector('.show-phone');
  phone.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') paused = true; });
  phone.addEventListener('pointerleave', function () { paused = false; });
  root.addEventListener('focusin', function (e) { if (e.target.closest('.show-phone')) paused = true; });
  root.addEventListener('focusout', function () { paused = false; });
  var sx = null;
  phone.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
  phone.addEventListener('touchend', function (e) {
    if (sx === null) return;
    var dx = e.changedTouches[0].clientX - sx; sx = null;
    if (Math.abs(dx) > 40) { show(cur + (dx < 0 ? 1 : -1)); schedule(); }
  }, { passive: true });
  // Only a click on the site's "Pause automatic media" button stops the slideshow.
  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('[data-motion-toggle]');
    if (t) setTimeout(function () { userPaused = t.getAttribute('aria-pressed') === 'true'; }, 0);
  });
  if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { visible = en[0].isIntersecting; }).observe(root);
  root.style.setProperty('--show-accent', accentOf(0));
  links(0);
  schedule();
})();
