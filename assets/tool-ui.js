/* One control system for every Dailwind toolkit.
   Marks the toolkit's own buttons, upload buttons, drop-downs and text fields so that
   assets/tool-ui.css can give them the same height, text size, shape and alignment in
   every tool (36px on computers, 40px on phones). Button groups get even spacing.
   Works for tools added later and for buttons a tool creates after a run. */
(function () {
  'use strict';
  var SKIP = '.dw-site-header,.dsh-local,.dw-steps,.desk-dock,dialog,.dw-activity,.mf-dialog,table,[role=tablist],[role=menu],[role=listbox],.dw-cite,.cite-dialog,[data-no-ui]';
  var BUTTONS = 'button,a.button,a.dl-btn,label.language-upload,label.file-button,input[type=submit],input[type=button],input[type=reset]';
  var FIELDS = 'select,input:not([type]),input[type=text],input[type=search],input[type=number],input[type=url],input[type=email],input[type=tel],input[type=date],input[type=password]';
  var root = document.querySelector('main') || document.getElementById('main') || document.body;

  function label(el) { return (el.textContent || el.value || '').replace(/\s+/g, ' ').trim(); }
  function mark(el) {
    if (el.dataset.ui || el.closest(SKIP)) return;
    if (el.matches(FIELDS)) {
      if (el.tagName === 'SELECT' && (el.multiple || el.size > 1)) return;   // list boxes keep their height
      el.dataset.ui = 'field';
      el.classList.add('dw-field');
      return;
    }
    if (!el.matches(BUTTONS)) return;
    var t = label(el);
    // Icon-only buttons (×, ↑, ⋯) keep their own small size.
    if (t.length <= 2) { el.dataset.ui = 'icon'; return; }
    el.dataset.ui = 'btn';
    el.classList.add('dw-btn');
    fit(el);
    group(el.parentElement);
  }
  // A label squeezed onto two lines by its row takes the width it needs instead, so the row
  // wraps rather than the words. Only a label wider than the whole row keeps two lines.
  function fit(el) {
    requestAnimationFrame(function () {
      if (!el.isConnected || !el.offsetWidth) return;
      var h = parseFloat(getComputedStyle(document.body).getPropertyValue('--ui-h')) || 44;
      if (el.offsetHeight <= h + 2) return;
      var box = el.parentElement, cs = box && getComputedStyle(box);
      if (!cs || !/flex/.test(cs.display) || cs.flexDirection.indexOf('row') !== 0) return;
      el.style.flexBasis = 'auto';
      if (cs.flexWrap === 'nowrap') box.style.flexWrap = 'wrap';
    });
  }
  // A label and its field next to buttons ("Search [ ]  [Go]"): every control sits on one line.
  function align(row) {
    if (!row || row.dataset.uiRow || row === document.body || row.closest(SKIP)) return;
    var cs = getComputedStyle(row);
    if (!/flex/.test(cs.display) || cs.flexDirection.indexOf('row') !== 0) return;
    var kids = Array.prototype.filter.call(row.children, function (c) {
      return c.offsetParent !== null && !/^(DATALIST|SCRIPT|TEMPLATE)$/.test(c.tagName) && !(c.tagName === 'INPUT' && c.type === 'hidden');
    });
    if (kids.length < 2) return;
    var wrapped = 0;
    for (var i = 0; i < kids.length; i++) {
      var k = kids[i];
      if (k.classList.contains('dw-btn') || k.classList.contains('dw-field') || k.classList.contains('mf-folder')) continue;
      if (!k.querySelector('.dw-btn,.dw-field') || k.offsetHeight > 160 || k.querySelectorAll('.dw-btn,.dw-field').length > 4) return;
      wrapped++;
    }
    if (!wrapped) return;
    row.dataset.uiRow = '1';
    row.style.alignItems = 'flex-end';
    if ((parseFloat(cs.rowGap) || 0) < 10) row.style.rowGap = '12px';
    kids.forEach(function (k) { k.style.marginTop = '0'; k.style.marginBottom = '0'; });
  }
  // Buttons that sit together never touch and line up on one baseline.
  function group(box) {
    if (!box || box.dataset.uiGroup || box === document.body || box.closest(SKIP)) return;
    var kids = Array.prototype.filter.call(box.children, function (c) { return !c.hidden && c.nodeType === 1 && getComputedStyle(c).display !== 'none'; });
    var ctl = kids.filter(function (c) { return c.classList.contains('dw-btn') || c.classList.contains('dw-field') || c.classList.contains('mf-folder'); });
    if (ctl.length < 2 || ctl.length < kids.length * 0.6) return;
    box.dataset.uiGroup = '1';
    var cs = getComputedStyle(box);
    if (cs.display === 'block' || cs.display === 'inline-block') {
      box.style.display = 'flex'; box.style.flexWrap = 'wrap'; box.style.alignItems = 'center';
    }
    if ((parseFloat(cs.rowGap) || 0) < 8 || (parseFloat(cs.columnGap) || 0) < 8) box.style.gap = '10px';
    if (/flex/.test(box.style.display || cs.display) && cs.alignItems === 'stretch' && cs.flexDirection.indexOf('row') === 0) box.style.alignItems = 'center';
    // when some buttons in a row stretch and others do not, they all stretch the same way
    if (/flex/.test(box.style.display || cs.display)) {
      var btns = ctl.filter(function (c) { return c.classList.contains('dw-btn'); });
      var grow = Math.max.apply(null, btns.map(function (c) { return parseFloat(getComputedStyle(c).flexGrow) || 0; }));
      if (grow > 0) btns.forEach(function (c) { if (!(parseFloat(getComputedStyle(c).flexGrow) > 0)) c.style.flexGrow = String(grow); });
    }
  }
  function scan(r) {
    if (!r || !r.querySelectorAll) return;
    if (r.matches && (r.matches(BUTTONS) || r.matches(FIELDS))) mark(r);
    r.querySelectorAll(BUTTONS + ',' + FIELDS).forEach(mark);
    rows(r);
  }
  // On a phone a row of four small fields becomes two per line, so no drop-down is cut to a letter.
  function narrow(box) {
    if (box.dataset.uiGrid || window.innerWidth > 760) return;
    var cs = getComputedStyle(box);
    if (cs.display === 'grid') {
      var cols = cs.gridTemplateColumns.split(' ').map(parseFloat).filter(function (n) { return n > 0; });
      if (cols.length < 3 || Math.min.apply(null, cols) >= 120) return;
      box.dataset.uiGrid = '1';
      box.style.gridTemplateColumns = 'repeat(2,minmax(0,1fr))';
      return;
    }
    if (!/flex/.test(cs.display) || cs.flexDirection.indexOf('row') !== 0) return;
    var kids = Array.prototype.filter.call(box.children, function (c) { return c.offsetParent !== null; });
    if (kids.length < 3) return;
    var small = 0;
    for (var i = 0; i < kids.length; i++) {
      if (!kids[i].querySelector('.dw-field') && !kids[i].classList.contains('dw-field')) return;
      if (kids[i].offsetWidth < 120) small++;
    }
    if (!small) return;
    box.dataset.uiGrid = '1';
    box.style.flexWrap = 'wrap';
    var gap = Math.max(parseFloat(cs.columnGap) || 0, 12);
    box.style.columnGap = gap + 'px';
    kids.forEach(function (k) { k.style.flex = '1 1 calc(50% - ' + gap + 'px)'; k.style.minWidth = '0'; });
  }
  function rows(r) {
    var seen = [];
    (r.querySelectorAll ? r : root).querySelectorAll('.dw-btn,.dw-field').forEach(function (c) {
      var p = c.parentElement;
      for (var d = 0; d < 3 && p && p !== root; d++, p = p.parentElement) {
        if (seen.indexOf(p) < 0) { seen.push(p); align(p); narrow(p); }
      }
    });
  }
  // iPhones zoom into any field whose text is under 16px; stop that zoom (pinch zoom still works there).
  function noFocusZoom() {
    if (!/iPhone|iPad|iPod/.test(navigator.userAgent)) return;
    var m = document.querySelector('meta[name=viewport]');
    if (m && !/maximum-scale/.test(m.content)) m.content += ', maximum-scale=1';
  }
  function start() {
    document.body.classList.add('dw-ui');
    noFocusZoom();
    scan(root);
    // a second pass once groups exist (groups need both buttons marked)
    root.querySelectorAll('.dw-btn').forEach(function (b) { group(b.parentElement); });
    new MutationObserver(function (list) {
      list.forEach(function (m) { m.addedNodes.forEach(function (n) { if (n.nodeType === 1) scan(n); }); });
    }).observe(root, { childList: true, subtree: true });
    // panels that were hidden at load are checked again once they open
    document.addEventListener('click', function () { setTimeout(function () { rows(root); }, 60); }, true);
    window.addEventListener('resize', function () { root.querySelectorAll('.dw-btn').forEach(fit); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
