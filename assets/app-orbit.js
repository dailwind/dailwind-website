/* "Our apps, in orbit." — home page showcase.
   App icons circle the Dailwind mark on a tilted 3D orbit, leaving comet trails in each
   app's colour. The app passing in front lights up the stage and shows its card.
   Tap an icon to bring it to the front. Hover pauses. Reduced motion: icons stay still. */
(function () {
  'use strict';
  var root = document.querySelector('[data-app-orbit]');
  if (!root) return;
  var stage = root.querySelector('.orbit-stage');
  var buttons = Array.prototype.slice.call(root.querySelectorAll('.orbit-app'));
  var cards = Array.prototype.slice.call(root.querySelectorAll('[data-orbit-card]'));
  var canvas = root.querySelector('.orbit-trails');
  var ctx = canvas && canvas.getContext ? canvas.getContext('2d') : null;
  var n = buttons.length;
  if (!n) return;
  root.classList.add('is-live');

  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Visitors with "reduce motion" still see a calm, slower orbit (no trails, no pulse); the site's
  // "Pause automatic media" button and hovering both stop it.
  var PERIOD = reduce ? 48000 : 26000;     // one full orbit, ms
  var phase = 0, speed = 1, target = 1, front = -1, seek = null, hold = 0, last = 0, visible = true;
  var W = 0, H = 0, rx = 0, ry = 0, cx = 0, cy = 0, dpr = 1;
  var accents = buttons.map(function (b) { return getComputedStyle(b).getPropertyValue('--accent').trim() || '#0071e3'; });
  var prev = buttons.map(function () { return null; });

  function size() {
    var r = stage.getBoundingClientRect();
    W = r.width; H = r.height;
    var sun = root.querySelector('.orbit-sun'), icon = buttons[0].offsetWidth || 112;
    var sunR = (sun ? sun.offsetWidth : 132) / 2 + 14;
    cx = W / 2; cy = H / 2 - icon * 0.12;
    // The orbit always clears the Dailwind mark: in front, behind and at the sides.
    rx = Math.max(sunR + icon * 0.62, Math.min(W / 2 - icon * 0.62, 340));
    ry = Math.max(sunR + icon * 0.64, rx * 0.34);
    root.querySelectorAll('.orbit-ring').forEach(function (r, k) {
      var f = k ? 1.2 : 1;
      r.style.width = (rx * 2 * f) + 'px'; r.style.height = (ry * 2 * f) + 'px';
      r.style.left = cx + 'px'; r.style.top = cy + 'px';
    });
    if (sun) { sun.style.left = cx + 'px'; sun.style.top = cy + 'px'; }
    if (ctx) {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    prev = prev.map(function () { return null; });
  }

  function angleOf(i) { return phase + i * (Math.PI * 2 / n); }

  function place() {
    var best = -2, bestI = 0;
    for (var i = 0; i < n; i++) {
      var a = angleOf(i), z = Math.cos(a);            // z = 1 in front, -1 behind
      var x = cx + Math.sin(a) * rx, y = cy + z * ry;
      var depth = (z + 1) / 2;
      var scale = 0.58 + depth * 0.52;
      var b = buttons[i];
      var h = b.offsetWidth / 2;
      b.style.transform = 'translate(' + (x - h).toFixed(1) + 'px,' + (y - h).toFixed(1) + 'px) scale(' + scale.toFixed(3) + ')';
      b.style.zIndex = String(z > 0 ? 60 + Math.round(depth * 40) : 10 + Math.round(depth * 30));
      b.style.opacity = (0.5 + depth * 0.5).toFixed(3);
      b.style.filter = 'saturate(' + (0.55 + depth * 0.45).toFixed(2) + ') brightness(' + (0.86 + depth * 0.14).toFixed(2) + ')';
      if (z > best) { best = z; bestI = i; }
      if (ctx && !reduce) {
        var p = prev[i];
        if (p) {
          ctx.strokeStyle = accents[i];
          ctx.globalAlpha = 0.25 + depth * 0.55;
          ctx.lineWidth = 2 + depth * 7;
          ctx.lineCap = 'round';
          ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(x, y); ctx.stroke();
        }
        prev[i] = [x, y];
      }
    }
    if (bestI !== front) show(bestI);
  }

  function show(i) {
    front = i;
    buttons.forEach(function (b, k) { b.classList.toggle('is-front', k === i); b.setAttribute('aria-pressed', k === i ? 'true' : 'false'); });
    cards.forEach(function (c, k) { c.hidden = k !== i; if (k === i) { c.classList.remove('is-in'); void c.offsetWidth; c.classList.add('is-in'); } });
    root.style.setProperty('--orbit-accent', accents[i]);
  }

  function fade() {
    if (!ctx) return;
    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.globalAlpha = 0.016;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }

  function frame(t) {
    if (!last) last = t;
    var dt = Math.min(64, t - last); last = t;
    if (visible && !document.hidden && !userPaused) {
      if (seek !== null) {
        var diff = seek - phase;
        if (Math.abs(diff) < 0.004) { phase = seek; seek = null; hold = t + 5000; target = 0; }
        else phase += diff * Math.min(1, dt / 160);
      } else {
        if (hold && t > hold) { hold = 0; target = 1; }
        speed += (target - speed) * Math.min(1, dt / 420);
        phase -= speed * dt / PERIOD * Math.PI * 2;
      }
      if (!reduce) fade();
      place();
    }
    requestAnimationFrame(frame);
  }

  // Bring app i to the front along the shorter way round.
  function bring(i) {
    var want = -i * (Math.PI * 2 / n);
    var d = want - phase;
    d = Math.atan2(Math.sin(d), Math.cos(d));
    seek = phase + d;
  }

  buttons.forEach(function (b, i) {
    b.addEventListener('click', function () { if (front === i && seek === null) { var c = cards[i] && cards[i].querySelector('a'); if (c) c.focus(); } bring(i); });
    b.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); var j = (i + 1) % n; bring(j); buttons[j].focus(); }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); var k = (i - 1 + n) % n; bring(k); buttons[k].focus(); }
    });
  });
  stage.addEventListener('pointerenter', function () { if (seek === null) target = 0.08; });
  stage.addEventListener('pointerleave', function () { if (!hold) target = 1; });
  root.addEventListener('focusin', function () { target = 0; });
  root.addEventListener('focusout', function () { if (!hold) target = 1; });
  root.querySelector('.orbit-cards').addEventListener('pointerenter', function () { target = 0; });
  root.querySelector('.orbit-cards').addEventListener('pointerleave', function () { if (!hold) target = 1; });

  // Only a click on the site's "Pause automatic media" button stops the orbit (its automatic
  // default for reduced-motion visitors does not; they get the calmer orbit instead).
  var userPaused = false;
  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('[data-motion-toggle]');
    if (t) setTimeout(function () { userPaused = t.getAttribute('aria-pressed') === 'true'; }, 0);
  });
  if ('IntersectionObserver' in window) new IntersectionObserver(function (en) { visible = en[0].isIntersecting; }).observe(root);
  window.addEventListener('resize', function () { size(); place(); });
  size();
  show(0);
  // Entrance: icons spiral out from the Dailwind mark.
  if (!reduce) root.classList.add('is-entering');
  setTimeout(function () { root.classList.remove('is-entering'); }, 1400);
  requestAnimationFrame(frame);
})();
