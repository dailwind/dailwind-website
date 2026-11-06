/* Credits dialog: names orbit in tilted 3D rings. Drag to spin. Plain lists stay for screen readers and reduced motion. */
(function () {
  'use strict';
  var dlg = document.getElementById('credits-dialog');
  var openBtn = document.querySelector('[data-credits-open]');
  if (!dlg || !openBtn) return;

  var root = document.documentElement;
  var stage = dlg.querySelector('.credits-stage');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var PERSPECTIVE = 1400;
  var TILT = 0.2;

  var people = [];
  Array.prototype.forEach.call(dlg.querySelectorAll('.credits-doctors li'), function (li) {
    people.push({ text: li.textContent.trim(), doctor: true });
  });
  Array.prototype.forEach.call(dlg.querySelectorAll('.credits-scholars li'), function (li) {
    people.push({ text: li.textContent.trim(), doctor: false });
  });

  var nodes = [];
  var rings = [];
  var dims = { w: 0, h: 0, R: 0 };
  var raf = 0;
  var lastTime = 0;
  var dragging = false;
  var lastX = 0;
  var spin = 0;
  var built = false;

  function build() {
    if (built || !stage) return;
    built = true;
    people.forEach(function (p) {
      var el = document.createElement('span');
      el.className = 'credits-name' + (p.doctor ? ' is-doctor' : '');
      el.textContent = p.text;
      stage.appendChild(el);
      nodes.push(el);
    });
  }

  function layout() {
    if (!stage) return;
    var w = stage.clientWidth;
    var h = stage.clientHeight;
    if (!w || !h) return;
    var small = w < 600;
    var ringCount = small ? 6 : 3;
    var widths = nodes.map(function (n) { return n.offsetWidth; });
    var half = Math.max.apply(null, widths) / 2;
    var desired = small ? w * 0.33 : Math.min(w * 0.35, 300);
    var fitX = (w / 2 - half * 1.1 - 8) / 1.25;
    var R = Math.max(w * 0.22, Math.min(desired, fitX));
    var sFront = PERSPECTIVE / (PERSPECTIVE - R);
    var gapFit = ((h / 2 - 28) / sFront - R * Math.sin(TILT)) / (Math.cos(TILT) * (ringCount - 1) / 2);
    var gap = Math.min(110, Math.max(30, gapFit));
    dims = { w: w, h: h, R: R, widths: widths };

    var old = rings;
    rings = [];
    var idx = 0;
    var total = nodes.length;
    for (var i = 0; i < ringCount; i++) {
      var count = Math.floor(total / ringCount) + (i < total % ringCount ? 1 : 0);
      var members = [];
      for (var k = 0; k < count; k++) members.push(idx++);
      rings.push({
        members: members,
        y: (i - (ringCount - 1) / 2) * gap,
        dir: i % 2 ? -1 : 1,
        speed: 0.2 + i * 0.045,
        angle: old[i] ? old[i].angle : i * 0.9
      });
    }
  }

  function render() {
    var R = dims.R;
    if (!R) return;
    var cosT = Math.cos(TILT);
    var sinT = Math.sin(TILT);
    rings.forEach(function (ring) {
      var m = ring.members.length;
      ring.members.forEach(function (n, k) {
        var theta = ring.angle + (k * Math.PI * 2) / m;
        var x0 = R * Math.sin(theta);
        var z0 = R * Math.cos(theta);
        var y = ring.y * cosT + z0 * sinT;
        var z = -ring.y * sinT + z0 * cosT;
        var s = PERSPECTIVE / (PERSPECTIVE - z);
        var depth = (z + R) / (2 * R);
        var el = nodes[n];
        var maxX = Math.max(0, dims.w / 2 - (dims.widths[n] * s) / 2 - 6);
        var px = Math.max(-maxX, Math.min(maxX, x0 * s));
        el.style.transform = 'translate(-50%,-50%) translate(' + px.toFixed(1) + 'px,' + (y * s).toFixed(1) + 'px) scale(' + s.toFixed(3) + ')';
        el.style.opacity = (0.16 + 0.84 * Math.pow(depth, 1.3)).toFixed(3);
        el.style.zIndex = String(Math.round(depth * 100));
      });
    });
  }

  function frame(t) {
    raf = requestAnimationFrame(frame);
    var dt = Math.min(0.05, (t - lastTime) / 1000 || 0);
    lastTime = t;
    var paused = root.classList.contains('toolkit-motion-paused') || document.hidden;
    if (!dragging) spin *= Math.pow(0.04, dt);
    if (!paused || dragging || Math.abs(spin) > 0.001) {
      rings.forEach(function (ring) {
        ring.angle += (paused ? 0 : ring.dir * ring.speed * dt) + spin * dt;
      });
      render();
    }
  }

  function start() {
    if (raf || !dlg.classList.contains('credits-3d-ready')) return;
    lastTime = performance.now();
    raf = requestAnimationFrame(frame);
  }

  function stop() {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  }

  function enable3d() {
    if (reduce.matches || !stage) {
      dlg.classList.remove('credits-3d-ready');
      stop();
      return;
    }
    build();
    dlg.classList.add('credits-3d-ready');
    layout();
    render();
    if (dlg.open) start();
  }

  function openDialog() {
    if (typeof dlg.showModal === 'function') dlg.showModal();
    else dlg.setAttribute('open', '');
    root.classList.add('credits-lock');
    enable3d();
  }

  function closeDialog() {
    if (typeof dlg.close === 'function') dlg.close();
    else dlg.removeAttribute('open');
    onClosed();
  }

  function onClosed() {
    stop();
    root.classList.remove('credits-lock');
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
      stage.classList.add('is-dragging');
      try { stage.setPointerCapture(e.pointerId); } catch (err) { /* not critical */ }
    });
    stage.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      var dx = e.clientX - lastX;
      lastX = e.clientX;
      spin = Math.max(-6, Math.min(6, dx * 0.12));
      rings.forEach(function (ring) { ring.angle += dx * 0.008; });
      render();
    });
    var endDrag = function () {
      dragging = false;
      stage.classList.remove('is-dragging');
    };
    stage.addEventListener('pointerup', endDrag);
    stage.addEventListener('pointercancel', endDrag);
    stage.addEventListener('lostpointercapture', endDrag);
  }

  var resizeTimer = 0;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (dlg.open && dlg.classList.contains('credits-3d-ready')) { layout(); render(); }
    }, 80);
  });

  var onMotionChange = function () { if (dlg.open) enable3d(); };
  if (reduce.addEventListener) reduce.addEventListener('change', onMotionChange);
  else if (reduce.addListener) reduce.addListener(onMotionChange);
})();
