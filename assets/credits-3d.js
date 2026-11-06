/* Recommended-by dialog: names float on a turning ball, like a word cloud.
   Biggest: Prof. Dr. Saiqa Imtiaz Asif; next: the doctors; smallest: everyone else.
   The plain list stays for screen readers and reduced-motion users. */
(function () {
  'use strict';
  var dlg = document.getElementById('credits-dialog');
  var openBtn = document.querySelector('[data-credits-open]');
  if (!dlg || !openBtn) return;

  var root = document.documentElement;
  var stage = dlg.querySelector('.credits-stage');
  var PERSPECTIVE = 1000;

  var people = [];
  Array.prototype.forEach.call(dlg.querySelectorAll('.credits-list li'), function (li) {
    var text = li.textContent.trim();
    people.push({ text: text, tier: /^Prof\./.test(text) ? 'top' : (/^Dr\./.test(text) ? 'doctor' : 'scholar') });
  });

  var words = [];
  var pts = [];
  var dims = { w: 0, h: 0, widths: [] };
  var raf = 0;
  var lastTime = 0;
  var dragging = false;
  var lastX = 0;
  var lastY = 0;
  var vx = 0;
  var vy = 0.3;
  var tx = 0;
  var ty = 0.3;
  var nextDrift = 0;
  var clock = 0;
  var built = false;

  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function rotate(p, ax, ay) {
    var c = Math.cos(ay), s = Math.sin(ay);
    var x = p.x * c + p.z * s;
    var z = -p.x * s + p.z * c;
    var c2 = Math.cos(ax), s2 = Math.sin(ax);
    var y = p.y * c2 - z * s2;
    z = p.y * s2 + z * c2;
    p.x = x; p.y = y; p.z = z;
  }

  function build() {
    if (!stage) return;
    stage.innerHTML = '';
    words = [];
    var order = shuffle(people);
    var n = order.length;
    var golden = Math.PI * (3 - Math.sqrt(5));
    pts = [];
    order.forEach(function (p, i) {
      var el = document.createElement('span');
      el.className = 'credits-word is-' + p.tier;
      el.textContent = p.text;
      stage.appendChild(el);
      words.push(el);
      var y = 1 - (2 * (i + 0.5)) / n;
      var r = Math.sqrt(Math.max(0, 1 - y * y));
      var th = i * golden;
      var pt = { x: r * Math.cos(th), y: y, z: r * Math.sin(th) };
      // Small random push so the cloud never looks like a tidy pattern.
      pt.x += (Math.random() - 0.5) * 0.18; pt.y += (Math.random() - 0.5) * 0.18; pt.z += (Math.random() - 0.5) * 0.18;
      var len = Math.sqrt(pt.x * pt.x + pt.y * pt.y + pt.z * pt.z) || 1;
      pt.x /= len; pt.y /= len; pt.z /= len;
      pts.push(pt);
    });
    var a = Math.random() * Math.PI * 2, b = Math.random() * Math.PI * 2;
    pts.forEach(function (p) { rotate(p, a, b); });
    vy = (Math.random() < 0.5 ? -1 : 1) * (0.25 + Math.random() * 0.2);
    vx = 0;
    ty = vy;
    tx = 0;
    nextDrift = 0;
    clock = 0;
    built = true;
  }

  function measure() {
    if (!stage) return;
    dims.w = stage.clientWidth;
    dims.h = stage.clientHeight;
    dims.widths = words.map(function (el) { return el.offsetWidth; });
  }

  function render() {
    var w = dims.w, h = dims.h;
    if (!w || !h) return;
    var Rx = Math.min(w * 0.4, 360);
    var Ry = h * 0.4;
    var Rz = Math.min(Rx, Ry) * 1.1;
    for (var i = 0; i < words.length; i++) {
      var p = pts[i];
      var z = p.z * Rz;
      var s = PERSPECTIVE / (PERSPECTIVE - z);
      var depth = (p.z + 1) / 2;
      var maxX = Math.max(0, w / 2 - (dims.widths[i] * s) / 2 - 6);
      var px = Math.max(-maxX, Math.min(maxX, p.x * Rx * s));
      var py = p.y * Ry * s;
      var el = words[i];
      el.style.transform = 'translate(-50%,-50%) translate(' + px.toFixed(1) + 'px,' + py.toFixed(1) + 'px) scale(' + s.toFixed(3) + ')';
      el.style.opacity = (0.22 + 0.78 * Math.pow(depth, 1.15)).toFixed(3);
      el.style.zIndex = String(Math.round(depth * 100) + (el.classList.contains('is-top') ? 50 : 0));
    }
  }

  function frame(t) {
    raf = requestAnimationFrame(frame);
    var dt = Math.min(0.05, (t - lastTime) / 1000 || 0);
    lastTime = t;
    var paused = document.hidden || userPaused();
    if (!paused) clock += dt;
    if (!dragging) {
      if (clock >= nextDrift) {
        // Wander: pick a new random turning direction every few seconds.
        nextDrift = clock + 3 + Math.random() * 4;
        var ang = Math.random() * Math.PI * 2;
        var mag = 0.22 + Math.random() * 0.28;
        ty = Math.cos(ang) * mag;
        tx = Math.sin(ang) * mag * 0.6;
      }
      var k = 1 - Math.pow(0.35, dt);
      vx += (tx - vx) * k;
      vy += (ty - vy) * k;
      if (!paused) {
        for (var i = 0; i < pts.length; i++) rotate(pts[i], vx * dt, vy * dt);
      }
    }
    render();
  }

  function start() {
    if (raf || !dlg.classList.contains('credits-cloud-ready')) return;
    lastTime = performance.now();
    raf = requestAnimationFrame(frame);
  }

  function stop() {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  }

  function enable() {
    if (!stage || !people.length) {
      dlg.classList.remove('credits-cloud-ready');
      stop();
      return;
    }
    dlg.classList.add('credits-cloud-ready');
    if (!built) build();
    measure();
    render();
    if (dlg.open) start();
  }

  // Only the page's own "Pause automatic media" button stops the motion.
  function userPaused() {
    var btns = document.querySelectorAll('[data-motion-toggle]');
    for (var i = 0; i < btns.length; i++) {
      if (/^Resume/i.test(btns[i].textContent.trim())) return true;
    }
    return false;
  }

  function openDialog() {
    if (typeof dlg.showModal === 'function') dlg.showModal();
    else dlg.setAttribute('open', '');
    root.classList.add('credits-lock');
    built = false; // fresh random arrangement on every open
    enable();
  }

  function onClosed() {
    stop();
    root.classList.remove('credits-lock');
  }

  function closeDialog() {
    if (typeof dlg.close === 'function') dlg.close();
    else dlg.removeAttribute('open');
    onClosed();
  }

  openBtn.addEventListener('click', openDialog);
  dlg.addEventListener('close', onClosed);
  Array.prototype.forEach.call(dlg.querySelectorAll('[data-credits-close]'), function (b) {
    b.addEventListener('click', closeDialog);
  });
  dlg.addEventListener('click', function (e) {
    if (e.target === dlg) closeDialog();
  });

  if (stage) {
    stage.addEventListener('pointerdown', function (e) {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      vx = 0; vy = 0;
      stage.classList.add('is-dragging');
      try { stage.setPointerCapture(e.pointerId); } catch (err) { /* not critical */ }
    });
    stage.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      var dx = e.clientX - lastX;
      var dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      var ay = dx * 0.008;
      var ax = -dy * 0.008;
      pts.forEach(function (p) { rotate(p, ax, ay); });
      vy = Math.max(-2, Math.min(2, ay * 30));
      vx = Math.max(-2, Math.min(2, ax * 30));
      render();
    });
    var endDrag = function () {
      dragging = false;
      stage.classList.remove('is-dragging');
      nextDrift = clock + 2;
      tx = vx * 0.5; ty = vy * 0.5;
    };
    stage.addEventListener('pointerup', endDrag);
    stage.addEventListener('pointercancel', endDrag);
    stage.addEventListener('lostpointercapture', endDrag);
  }

  var resizeTimer = 0;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (dlg.open && dlg.classList.contains('credits-cloud-ready')) { measure(); render(); }
    }, 80);
  });

})();
