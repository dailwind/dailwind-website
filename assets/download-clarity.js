/* Clear download buttons in every Dailwind toolkit.
   Finds every download / export control (also ones a tool adds later), gives it a
   download icon and one clear style, groups several of them under a "Downloads" label,
   and explains why a download is not ready yet. Changes nothing a tool does. */
(function () {
  'use strict';
  var WORDS = /\b(download|export)\b/i;
  var EXACT = /^(combined txt|text-only word|separate pages zip|page report json|findings csv|word report|metadata csv|text report|save \/ backup json|share \/ save to files)$/i;
  var NOT = /release|preferences|save details|save view|^copy/i;
  var FORMATS = [[/excel|xlsx/i, 'XLSX'], [/\bword\b|docx/i, 'DOCX'], [/\bcsv\b/i, 'CSV'], [/\bjson\b/i, 'JSON'], [/\bzip\b/i, 'ZIP'],
    [/\btxt\b/i, 'TXT'], [/\bpdf\b/i, 'PDF'], [/\btmx\b/i, 'TMX'], [/\btsv\b/i, 'TSV'], [/\bjpe?g\b/i, 'JPG'], [/\bpng\b/i, 'PNG'], [/\bwebp\b/i, 'WEBP']];

  function label(el) { return (el.textContent || '').replace(/\s+/g, ' ').trim(); }
  function isDownload(el) {
    if (el.closest('header,nav,footer,.toolkit-card,.dock,.mf-folder,[data-no-dl]')) return false;
    if (el.id === 'save-preferences' || el.id === 'media-release') return false;
    var t = label(el);
    if (!t || t.length > 70 || NOT.test(t)) return false;
    if (el.tagName === 'A' && (el.hasAttribute('download') || /^blob:/.test(el.getAttribute('href') || ''))) return true;
    return WORDS.test(t) || EXACT.test(t);
  }
  function format(t) { for (var i = 0; i < FORMATS.length; i++) if (FORMATS[i][0].test(t)) return FORMATS[i][1]; return ''; }

  function mark(el) {
    if (el.classList.contains('dl-btn')) return;
    el.classList.add('dl-btn');
    var f = format(label(el));
    if (f) el.dataset.dlFormat = f;
    // "Download all" is the main download: give it the tool's full colour.
    if (/\bdownload all\b|download corpus/i.test(label(el)) && !el.classList.contains('primary')) el.classList.add('dl-main');
    var tip = function () {
      if (el.disabled || el.getAttribute('aria-disabled') === 'true') {
        if (!el.dataset.dlTitle) el.dataset.dlTitle = el.title || '';
        el.title = 'Not ready yet. Add your text or files and run the tool first; this download then switches on.';
      } else if (el.dataset.dlTitle !== undefined) { el.title = el.dataset.dlTitle; delete el.dataset.dlTitle; }
    };
    tip();
    new MutationObserver(tip).observe(el, { attributes: true, attributeFilter: ['disabled', 'aria-disabled'] });
    group(el.parentElement);
  }
  // Several download buttons side by side or stacked never touch: give their box a gap.
  function space(box, cs) {
    if (box.dataset.dlSpaced) return;
    box.dataset.dlSpaced = '1';
    if (cs.display === 'block' || cs.display === 'inline' || cs.display === 'inline-block') {
      box.style.display = 'flex'; box.style.flexWrap = 'wrap'; box.style.alignItems = 'center'; box.style.gap = '8px';
    } else if (/flex|grid/.test(cs.display) && (parseFloat(cs.rowGap) || 0) < 6 && (parseFloat(cs.columnGap) || 0) < 6) {
      box.style.gap = '8px';
    }
  }
  function group(box) {
    if (!box || box.dataset.dlGroup || box.closest('dialog')) return;
    var n = 0;
    for (var i = 0; i < box.children.length; i++) if (box.children[i].classList.contains('dl-btn')) n++;
    if (n < 2) return;
    var cs = getComputedStyle(box);
    space(box, cs);
    var flowing = cs.display === 'grid' || cs.display === 'inline-grid' || ((cs.display === 'flex' || cs.display === 'inline-flex') && cs.flexWrap !== 'nowrap' && cs.flexDirection.indexOf('row') === 0) || cs.display === 'block';
    if (!flowing) return;
    box.dataset.dlGroup = '1';
    box.classList.add('dl-group');
    var cap = document.createElement('p');
    cap.className = 'dl-caption';
    cap.setAttribute('aria-hidden', 'true');
    cap.textContent = 'Downloads';
    box.insertBefore(cap, box.firstChild);
  }
  function scan(root) {
    (root.querySelectorAll ? root.querySelectorAll('button, a') : []).forEach(function (el) { if (isDownload(el)) mark(el); });
  }
  function start() {
    scan(document);
    new MutationObserver(function (list) {
      list.forEach(function (m) {
        m.addedNodes.forEach(function (n) {
          if (n.nodeType !== 1) return;
          if ((n.tagName === 'A' || n.tagName === 'BUTTON') && isDownload(n)) mark(n);
          scan(n);
        });
        if (m.type === 'characterData' || m.type === 'childList') {
          var t = m.target.nodeType === 1 ? m.target : m.target.parentElement;
          var b = t && t.closest && t.closest('button,a');
          if (b && !b.classList.contains('dl-btn') && isDownload(b)) mark(b);
        }
      });
    }).observe(document.body, { childList: true, subtree: true, characterData: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
