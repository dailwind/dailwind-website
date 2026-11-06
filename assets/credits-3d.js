/* Recommended-by dialog: names roll upward like end credits, in a fresh random order every round.
   The plain list stays for screen readers and reduced-motion users. */
(function () {
  'use strict';
  var dlg = document.getElementById('credits-dialog');
  var openBtn = document.querySelector('[data-credits-open]');
  if (!dlg || !openBtn) return;

  var root = document.documentElement;
  var stage = dlg.querySelector('.credits-stage');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  var people = [];
  Array.prototype.forEach.call(dlg.querySelectorAll('.credits-list li'), function (li) {
    people.push(li.textContent.trim());
  });

  var roll = null;
  var blocks = [];
  var y = 0;
  var raf = 0;
  var lastTime = 0;
  var dragging = false;
  var lastY = 0;
  var coast = 0;

  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function addBlock() {
    var order = shuffle(people);
    // Do not start a round with the name that just ended the previous one.
    if (blocks.length) {
      var prev = blocks[blocks.length - 1].lastChild.textContent;
      if (order[0] === prev) { var t = order[0]; order[0] = order[1]; order[1] = t; }
    }
    var block = document.createElement('div');
    block.className = 'credits-block';
    order.forEach(function (name) {
      var line = document.createElement('p');
      line.className = 'credits-line';
      line.textContent = name;
      block.appendChild(line);
    });
    roll.appendChild(block);
    blocks.push(block);
  }

  function reset() {
    if (!stage) return;
    stage.innerHTML = '';
    roll = document.createElement('div');
    roll.className = 'credits-roll';
    stage.appendChild(roll);
    blocks = [];
    y = stage.clientHeight;
    coast = 0;
    addBlock();
    addBlock();
    roll.style.transform = 'translateY(' + y + 'px)';
  }

  function maintain() {
    var h = stage.clientHeight;
    while (blocks.length > 1 && y + blocks[0].offsetHeight < -10) {
      y += blocks[0].offsetHeight;
      roll.removeChild(blocks[0]);
      blocks.shift();
    }
    while (y + roll.offsetHeight < h + 400) addBlock();
    if (y > h) y = h;
  }

  function frame(t) {
    raf = requestAnimationFrame(frame);
    var dt = Math.min(0.05, (t - lastTime) / 1000 || 0);
    lastTime = t;
    var paused = root.classList.contains('toolkit-motion-paused') || document.hidden;
    var speed = stage.clientWidth < 600 ? 40 : 52;
    if (!dragging) {
      coast *= Math.pow(0.05, dt);
      y += coast * dt;
      if (!paused) y -= speed * dt;
    }
    maintain();
    roll.style.transform = 'translateY(' + y.toFixed(1) + 'px)';
  }

  function start() {
    if (raf || !dlg.classList.contains('credits-roll-ready')) return;
    lastTime = performance.now();
    raf = requestAnimationFrame(frame);
  }

  function stop() {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  }

  function enable() {
    if (reduce.matches || !stage || !people.length) {
      dlg.classList.remove('credits-roll-ready');
      stop();
      return;
    }
    dlg.classList.add('credits-roll-ready');
    if (!roll || !roll.parentNode) reset();
    if (dlg.open) start();
  }

  function openDialog() {
    if (typeof dlg.showModal === 'function') dlg.showModal();
    else dlg.setAttribute('open', '');
    root.classList.add('credits-lock');
    dlg.classList.remove('credits-roll-ready');
    roll = null;
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
      lastY = e.clientY;
      coast = 0;
      stage.classList.add('is-dragging');
      try { stage.setPointerCapture(e.pointerId); } catch (err) { /* not critical */ }
    });
    stage.addEventListener('pointermove', function (e) {
      if (!dragging || !roll) return;
      var dy = e.clientY - lastY;
      lastY = e.clientY;
      y += dy;
      coast = Math.max(-900, Math.min(900, dy * 30));
      maintain();
      roll.style.transform = 'translateY(' + y.toFixed(1) + 'px)';
    });
    var endDrag = function () {
      dragging = false;
      stage.classList.remove('is-dragging');
    };
    stage.addEventListener('pointerup', endDrag);
    stage.addEventListener('pointercancel', endDrag);
    stage.addEventListener('lostpointercapture', endDrag);
  }

  var onMotionChange = function () { if (dlg.open) enable(); };
  if (reduce.addEventListener) reduce.addEventListener('change', onMotionChange);
  else if (reduce.addListener) reduce.addListener(onMotionChange);
})();
