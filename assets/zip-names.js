/* Branded names for every ZIP a Dailwind toolkit downloads.
   Only ZIP files are renamed (e.g. "Dailwind-Cleaned-Files.zip"); every other
   download keeps the name the tool gives it. Runs only in this tab. */
(function () {
  'use strict';
  var slug = location.pathname.split('/').filter(function (x) { return x && x !== 'index.html'; }).pop() || '';
  var NAMES = {
    'corpus-cleaner': 'Cleaned-Files', 'file-converter': 'Converted-Files', 'corpus-merger': 'Merged-Files',
    'english-ocr': 'OCR-Pages', 'pdf-tools': 'PDF-Parts', 'image-converter': 'Converted-Images', 'image-resizer': 'Resized-Images',
    'subtitle-corpus': 'Subtitle-Corpus', 'metadata-studio': 'Corpus-Catalogue', 'corpus-toolkit': 'Corpus-Results',
    'passport-photo-maker': 'Passport-Photos'
  };
  var seen = {}, used = {};

  function kind(orig) {
    if (slug === 'image-tools') return /compress/i.test(orig) ? 'Compressed-Images' : /\.pdf\.zip$|images?-pdf/i.test(orig) ? 'Image-PDFs' : 'Page-Images';
    return NAMES[slug] || 'Processed-Files';
  }
  function brand(value) {
    var orig = String(value == null ? '' : value);
    if (!/\.zip$/i.test(orig) || /subtitle-grabber/i.test(orig)) return value;
    if (seen[orig]) return seen[orig];
    if (used[orig]) return orig; // already one of ours
    var name = 'Dailwind-' + kind(orig);
    var part = orig.match(/part[-_ ]?(\d+)/i);
    if (part) name += '-Part-' + String(+part[1]).padStart(2, '0');
    var final = name + '.zip', n = 2;
    while (used[final]) final = name + '-' + n++ + '.zip';
    seen[orig] = final;
    used[final] = orig;
    return final;
  }

  var desc = Object.getOwnPropertyDescriptor(HTMLAnchorElement.prototype, 'download');
  if (desc && desc.set) {
    Object.defineProperty(HTMLAnchorElement.prototype, 'download', {
      configurable: true, enumerable: desc.enumerable,
      get: function () { return desc.get.call(this); },
      set: function (v) { desc.set.call(this, brand(v)); }
    });
  }
  var setAttr = Element.prototype.setAttribute;
  Element.prototype.setAttribute = function (n, v) {
    if (this instanceof HTMLAnchorElement && String(n).toLowerCase() === 'download') v = brand(v);
    return setAttr.call(this, n, v);
  };
  // Links already on the page, or written as HTML: renamed at the moment of the click.
  window.addEventListener('click', function (e) {
    var a = e.target && e.target.closest && e.target.closest('a[download]');
    if (!a) return;
    var d = a.getAttribute('download');
    if (d && /\.zip$/i.test(d) && /^(blob|data):/.test(a.getAttribute('href') || '')) setAttr.call(a, 'download', brand(d));
  }, true);
  // Download dialogs that print the file name show the branded name too.
  function relabel(root) {
    (root.querySelectorAll ? root.querySelectorAll('[id*=download][id$=label],[id*=download][id$=name]') : []).forEach(function (el) {
      var t = el.textContent.trim();
      if (seen[t] && t !== seen[t]) el.textContent = seen[t];
    });
  }
  new MutationObserver(function () { relabel(document); }).observe(document.documentElement, { childList: true, subtree: true, characterData: true });
  window.DailwindZipName = brand;
})();
