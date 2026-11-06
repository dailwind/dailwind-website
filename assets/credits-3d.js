/* Recommended-by dialog: names sit on a turning globe, like Earth.
   Biggest: Prof. Dr. Saiqa Imtiaz Asif; next: the doctors; smallest: everyone else.
   The plain list stays for screen readers and when the script cannot run. */
(function () {
  'use strict';
  var dlg = document.getElementById('credits-dialog');
  var openBtn = document.querySelector('[data-credits-open]');
  if (!dlg || !openBtn) return;

  var root = document.documentElement;
  var stage = dlg.querySelector('.credits-stage');
  var PERSPECTIVE = 1100;
  var AXIS_LEAN = -0.41;       // Earth's axis is tilted about 23.5 degrees
  var BASE_SPEED = 0.32;       // radians per second, west to east

  var people = [];
  Array.prototype.forEach.call(dlg.querySelectorAll('.credits-list li'), function (li) {
    var text = li.textContent.trim();
    people.push({ text: text, tier: /^Prof\./.test(text) ? 'top' : (/^Dr\./.test(text) ? 'doctor' : 'scholar') });
  });

  var words = [];
  var pts = [];
  var canvas = null;
  var ctx = null;
  var dims = { w: 0, h: 0, R: 0, dpr: 1, widths: [] };
  var raf = 0;
  var lastTime = 0;
  var dragging = false;
  var lastX = 0;
  var lastY = 0;
  var spin = 0;
  var pitch = 0.32;
  var extra = 0;               // extra speed from a flick, fades back to the steady turn
  var built = false;

  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  // Globe frame -> view: turn around the axis, lean the axis, tip the globe toward the viewer.
  var cS = 1, sS = 0, cL = 1, sL = 0, cP = 1, sP = 0;
  function setTransform() {
    cS = Math.cos(spin); sS = Math.sin(spin);
    cL = Math.cos(AXIS_LEAN); sL = Math.sin(AXIS_LEAN);
    cP = Math.cos(pitch); sP = Math.sin(pitch);
  }
  function project(x, y, z, out) {
    var x1 = x * cS + z * sS;
    var z1 = -x * sS + z * cS;
    var x2 = x1 * cL - y * sL;
    var y2 = x1 * sL + y * cL;
    var y3 = y2 * cP - z1 * sP;
    var z3 = y2 * sP + z1 * cP;
    out.x = x2; out.y = y3; out.z = z3;
    return out;
  }

  function build() {
    if (!stage) return;
    stage.innerHTML = '';
    canvas = document.createElement('canvas');
    canvas.className = 'credits-globe';
    canvas.setAttribute('aria-hidden', 'true');
    stage.appendChild(canvas);
    ctx = canvas.getContext ? canvas.getContext('2d') : null;

    words = [];
    pts = [];
    var order = shuffle(people);
    var n = order.length;
    var golden = Math.PI * (3 - Math.sqrt(5));
    order.forEach(function (p, i) {
      var el = document.createElement('span');
      el.className = 'credits-word is-' + p.tier;
      el.textContent = p.text;
      stage.appendChild(el);
      words.push(el);
      var y = 1 - (2 * (i + 0.5)) / n;
      var r = Math.sqrt(Math.max(0, 1 - y * y));
      var th = i * golden;
      pts.push({ x: r * Math.cos(th), y: y, z: r * Math.sin(th) });
    });
    spin = Math.random() * Math.PI * 2;
    pitch = 0.32;
    extra = 0;
    built = true;
  }

  function measure() {
    if (!stage || !canvas) return;
    dims.w = stage.clientWidth;
    dims.h = stage.clientHeight;
    dims.dpr = Math.min(2, window.devicePixelRatio || 1);
    dims.R = Math.min(dims.w * 0.36, dims.h * 0.43);
    dims.widths = words.map(function (el) { return el.offsetWidth; });
    canvas.width = Math.round(dims.w * dims.dpr);
    canvas.height = Math.round(dims.h * dims.dpr);
  }

  var tmp = { x: 0, y: 0, z: 0 };

  function drawGlobe() {
    if (!ctx) return;
    var w = dims.w, h = dims.h, R = dims.R;
    ctx.setTransform(dims.dpr, 0, 0, dims.dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    var cx = w / 2, cy = h / 2;

    var g = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.35, R * 0.1, cx, cy, R);
    g.addColorStop(0, 'rgba(70,130,220,0.20)');
    g.addColorStop(0.7, 'rgba(30,70,140,0.10)');
    g.addColorStop(1, 'rgba(20,50,110,0.03)');
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.fillStyle = g;
    ctx.fill();
    ctx.lineWidth = 1.2;
    ctx.strokeStyle = 'rgba(130,180,255,0.35)';
    ctx.stroke();

    var front = new Path2D();
    var back = new Path2D();
    var STEP = Math.PI / 36;
    function trace(fn) {
      var prevX = 0, prevY = 0, prevZ = 0, has = false;
      for (var a = 0; a <= Math.PI * 2 + 0.001; a += STEP) {
        var q = fn(a);
        project(q[0], q[1], q[2], tmp);
        var s = PERSPECTIVE / (PERSPECTIVE - tmp.z * R);
        var X = cx + tmp.x * R * s;
        var Y = cy - tmp.y * R * s;
        if (has) {
          var path = (prevZ + tmp.z) > 0 ? front : back;
          path.moveTo(prevX, prevY);
          path.lineTo(X, Y);
        }
        prevX = X; prevY = Y; prevZ = tmp.z; has = true;
      }
    }
    var lat, lon;
    for (lat = -60; lat <= 60; lat += 30) {
      var la = lat * Math.PI / 180, cl = Math.cos(la), sl = Math.sin(la);
      trace(function (a) { return [cl * Math.cos(a), sl, cl * Math.sin(a)]; });
    }
    for (lon = 0; lon < 180; lon += 30) {
      var lo = lon * Math.PI / 180, co = Math.cos(lo), so = Math.sin(lo);
      trace(function (a) { return [Math.cos(a) * co, Math.sin(a), Math.cos(a) * so]; });
    }
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(120,170,255,0.09)';
    ctx.stroke(back);
    ctx.strokeStyle = 'rgba(140,190,255,0.26)';
    ctx.stroke(front);
  }

  function render() {
    var w = dims.w, h = dims.h, R = dims.R;
    if (!w || !h) return;
    setTransform();
    drawGlobe();
    for (var i = 0; i < words.length; i++) {
      var p = pts[i];
      project(p.x, p.y, p.z, tmp);
      var s = PERSPECTIVE / (PERSPECTIVE - tmp.z * R);
      var depth = (tmp.z + 1) / 2;
      var maxX = Math.max(0, w / 2 - (dims.widths[i] * s) / 2 - 6);
      var px = Math.max(-maxX, Math.min(maxX, tmp.x * R * s));
      var py = -tmp.y * R * s;
      var el = words[i];
      el.style.transform = 'translate(-50%,-50%) translate(' + px.toFixed(1) + 'px,' + py.toFixed(1) + 'px) scale(' + s.toFixed(3) + ')';
      el.style.opacity = (0.16 + 0.84 * Math.pow(depth, 1.25)).toFixed(3);
      el.style.zIndex = String(Math.round(depth * 100) + (el.classList.contains('is-top') ? 50 : 0));
    }
  }

  // Only the page's own "Pause automatic media" button stops the motion.
  function userPaused() {
    var btns = document.querySelectorAll('[data-motion-toggle]');
    for (var i = 0; i < btns.length; i++) {
      if (/^Resume/i.test(btns[i].textContent.trim())) return true;
    }
    return false;
  }

  function frame(t) {
    raf = requestAnimationFrame(frame);
    var dt = Math.min(0.05, (t - lastTime) / 1000 || 0);
    lastTime = t;
    if (!dragging) {
      extra *= Math.pow(0.08, dt);
      if (!document.hidden && !userPaused()) spin += (BASE_SPEED + extra) * dt;
      else spin += extra * dt;
      // Settle the tip of the globe back toward its resting angle.
      pitch += (0.32 - pitch) * (1 - Math.pow(0.4, dt));
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
      extra = 0;
      stage.classList.add('is-dragging');
      try { stage.setPointerCapture(e.pointerId); } catch (err) { /* not critical */ }
    });
    stage.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      var dx = e.clientX - lastX;
      var dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      spin += dx * 0.009;
      pitch = Math.max(-0.7, Math.min(1.0, pitch + dy * 0.006));
      extra = Math.max(-3, Math.min(3, dx * 0.5));
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
      if (dlg.open && dlg.classList.contains('credits-cloud-ready')) { measure(); render(); }
    }, 80);
  });
})();
