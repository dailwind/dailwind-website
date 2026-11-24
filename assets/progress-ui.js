/* Live progress for every Dailwind toolkit.
   While a tool works, a card shows: what is happening now, a large percentage, a modern
   progress bar, elapsed time, a small animation of pages being read with a magnifying
   glass, and an activity log of every step. It reads the tool's own progress bar and
   status messages, so the tools themselves are unchanged. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var status, prog, card, el = {}, busy = false, everBusy = false, started = 0, doneAt = 0, lastChange = 0,
    lastText = '', lastKey = '', lastPct = null, quietSince = 0;

  function findStatus() {
    var list = document.querySelectorAll('#ocr-status,#prep-status,#pdf-status,#media-status,#meta-status,.prep-status,.language-status,#status');
    for (var i = 0; i < list.length; i++) if (!list[i].closest('.dw-steps,.dw-activity,dialog')) return list[i];
    return null;
  }
  function findProgress() {
    var p = document.querySelectorAll('main progress, #main progress, .prep-main progress, body progress');
    for (var i = 0; i < p.length; i++) if (!p[i].closest('.dw-activity')) return p[i];
    return null;
  }
  function clock(ms) { var s = Math.max(0, Math.round(ms / 1000)); return s < 60 ? s + 's' : Math.floor(s / 60) + 'm ' + String(s % 60).padStart(2, '0') + 's'; }
  function now() { var d = new Date(); return [d.getHours(), d.getMinutes(), d.getSeconds()].map(function (n) { return String(n).padStart(2, '0'); }).join(':'); }

  function build() {
    card = document.createElement('section');
    card.className = 'dw-activity';
    card.hidden = true;
    card.setAttribute('aria-label', 'Progress');
    card.innerHTML =
      '<div class="dw-act-top">' +
        '<div class="dw-act-art" aria-hidden="true"><span class="dw-page p3"></span><span class="dw-page p2"></span>' +
          '<span class="dw-page p1"><i></i><i></i><i></i><i></i><i></i><b class="dw-scan"></b></span><span class="dw-lens"></span></div>' +
        '<div class="dw-act-head"><p class="dw-act-kicker">Working on your files</p><p class="dw-act-now"></p><p class="dw-act-meta"></p></div>' +
        '<div class="dw-act-pct" aria-hidden="true"><b>0</b><span>%</span></div>' +
      '</div>' +
      '<div class="dw-act-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100"><span class="dw-act-fill"></span></div>' +
      '<details class="dw-act-log"><summary>Activity log <span class="dw-act-count"></span></summary><ol></ol></details>';
    el.now = $('.dw-act-now', card); el.meta = $('.dw-act-meta', card); el.kicker = $('.dw-act-kicker', card);
    el.pct = $('.dw-act-pct', card); el.pctNum = $('.dw-act-pct b', card); el.bar = $('.dw-act-bar', card);
    el.fill = $('.dw-act-fill', card); el.log = $('.dw-act-log ol', card); el.count = $('.dw-act-count', card); el.details = $('.dw-act-log', card);
    el.details.addEventListener('toggle', function () { if (el.details.open) el.log.scrollTop = el.log.scrollHeight; });
    var anchor = prog || status;
    if (prog) {
      var label = document.querySelector('label[for="' + prog.id + '"]');
      if (label) label.classList.add('dw-hide');
      prog.classList.add('dw-hide');
    }
    anchor.insertAdjacentElement('afterend', card);
    if (prog && status && card.compareDocumentPosition(status) & Node.DOCUMENT_POSITION_FOLLOWING) status.insertAdjacentElement('afterend', card);
  }

  function percent(text) {
    if (prog && !prog.hidden && prog.hasAttribute('value')) {
      var max = +prog.max || 1, v = +prog.value || 0;
      if (v > 0) return Math.max(0, Math.min(100, v / max * 100));
    }
    var m = /(\d{1,3}(?:\.\d+)?)\s?%/.exec(text);
    if (m && +m[1] <= 100) return +m[1];
    m = /(?:page|part|file|image|video|pdf|document|item)?\s*(\d+)\s*(?:of|\/)\s*(\d+)/i.exec(text);
    if (m && +m[2] > 0 && +m[1] <= +m[2] && +m[2] > 1) return +m[1] / +m[2] * 100;
    return null;
  }
  function statusText() { return status ? status.textContent.replace(/\s+/g, ' ').trim() : ''; }
  function statusBusy(t) { return /…|\.\.\.$|\b\d{1,3}\s?%/.test(t) && !/\b(ready|done|finished|complete|completed|stopped|saved)\b\.?$/i.test(t); }
  function progActive() {
    if (!prog) return false;
    if (!prog.hasAttribute('value')) return !prog.hidden;  // indeterminate bar shown while working
    var v = +prog.value || 0, max = +prog.max || 1;
    return v > 0 && v < max;
  }

  function addLog(text) {
    if (!text) return;
    var key = text.replace(/\d+(?:\.\d+)?/g, '#');
    var li;
    if (key === lastKey && el.log.lastChild) li = el.log.lastChild;
    else { li = document.createElement('li'); li.innerHTML = '<time></time><span></span>'; el.log.appendChild(li); }
    lastKey = key;
    li.firstChild.textContent = now();
    li.lastChild.textContent = text;
    while (el.log.children.length > 200) el.log.removeChild(el.log.firstChild);
    el.count.textContent = '· ' + el.log.children.length;
    if (el.details.open) el.log.scrollTop = el.log.scrollHeight;
  }

  var armed = false;
  function tick() {
    if (!armed) return;
    var t = statusText();
    if (t !== lastText) { lastText = t; lastChange = Date.now(); if (busy || statusBusy(t)) addLog(t); }
    var p = percent(t);
    var active = progActive() || statusBusy(t);
    if (active) quietSince = 0;
    if (active && !busy) {
      busy = true; everBusy = true; started = Date.now(); doneAt = 0;
      el.log.textContent = ''; lastKey = ''; addLog(t);
      card.hidden = false; card.classList.add('is-busy'); card.classList.remove('is-done');
      el.kicker.textContent = 'Working on it';
    }
    if (busy && !active) {
      if (!quietSince) quietSince = Date.now();
      if (Date.now() - quietSince > 1200) {
        busy = false; doneAt = Date.now();
        card.classList.remove('is-busy');
        var stopped = /stop|cancel|fail|error|could not|exceed|limit/i.test(t);
        card.classList.toggle('is-done', !stopped);
        card.classList.toggle('is-stopped', stopped);
        el.kicker.textContent = stopped ? 'Stopped' : 'Finished';
        if (!stopped) p = 100;
        var lastLi = el.log.lastChild;
        if (!stopped && lastLi && lastLi.lastChild.textContent === t) lastLi.lastChild.textContent = t + ' ✓';
        else if (!stopped || !lastLi || lastLi.lastChild.textContent !== t) addLog(stopped ? t : (t ? t + ' ✓' : 'Finished ✓'));
      }
    }
    if (!everBusy) return;
    el.now.textContent = t || (busy ? 'Working…' : 'Finished');
    var known = p !== null && p !== undefined;
    if (!busy && card.classList.contains('is-done')) { p = 100; known = true; }
    if (known) { lastPct = p; } else if (busy && lastPct !== null && Date.now() - lastChange < 4000) { p = lastPct; known = true; }
    card.classList.toggle('is-indeterminate', !known);
    el.pct.hidden = !known;
    if (known) {
      var shown = p >= 100 ? 100 : p >= 10 ? Math.floor(p) : Math.floor(p * 10) / 10;
      el.pctNum.textContent = String(shown);
      el.fill.style.width = Math.max(2, Math.min(100, p)) + '%';
      el.bar.setAttribute('aria-valuenow', String(Math.round(p)));
    } else { el.fill.style.width = ''; el.bar.removeAttribute('aria-valuenow'); }
    var spent = (busy ? Date.now() : doneAt) - started, meta = 'Elapsed ' + clock(spent);
    if (busy && known && p > 3 && p < 100 && spent > 4000) meta += ' · about ' + clock(spent / p * (100 - p)) + ' left';
    if (!busy) meta = (card.classList.contains('is-done') ? 'Done in ' : 'Ran for ') + clock(spent);
    el.meta.textContent = meta;
  }

  function start() {
    status = findStatus();
    prog = findProgress();
    if (!status && !prog) return;
    build();
    if (status) status.classList.add('dw-status');
    new MutationObserver(tick).observe(status || prog, { childList: true, subtree: true, characterData: true, attributes: true });
    if (prog) new MutationObserver(tick).observe(prog, { attributes: true });
    setInterval(function () { if (!document.hidden) tick(); }, 500);
    // Only follow work the visitor starts (not messages shown while the page loads).
    ['click', 'change', 'drop', 'keydown'].forEach(function (ev) {
      document.addEventListener(ev, function (e) { if (!armed && !(e.target.closest && e.target.closest('header,nav,.dw-steps'))) { armed = true; lastText = statusText(); } }, true);
    });
    // Status line: a moving dot while the tool works.
    setInterval(function () { if (status) status.classList.toggle('is-working', busy); }, 300);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
