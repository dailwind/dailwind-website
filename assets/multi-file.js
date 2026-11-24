/* Several files and whole folders for every Dailwind toolkit.
   - Every upload accepts several files at once.
   - An "Add folder" button sits beside each upload (computers only).
   - Folders dropped on a drop area are opened, sub-folders included.
   - Tools that read one text into a box get all chosen files as one combined text.
   Everything stays in this browser tab. */
(function () {
  'use strict';
  var SKIP = { 'restore-input': 1, 'restore': 1, 'lab-kappa-file': 1, 'pp-input': 1 };
  // Inputs whose tool reads only the first file: their files are combined into one text.
  var COMBINE = { 'wt-file': 1, 'lab-file': 1, 'lab-other-file': 1, 'tt-file': 1, 'source-file': 1, 'reference-file': 1, 'lab-src-file': 1, 'lab-tgt-file': 1 };
  // Buttons that open a hidden input (the tool may set something first, e.g. target/reference).
  var TRIGGERS = {
    'file-input': [['add-target', 'Target folder'], ['add-reference', 'Reference folder']],
    'prep-file-input': [['prep-add', 'Add folder']],
    'meta-files': [['meta-open', 'Add folder']],
    'ocr-file': [['ocr-add', 'Add folder']],
    'pdf-file': [['pdf-open', 'Add folder']],
    'media-files': [['media-open', 'Add folder']]
  };
  var SUB = /\.(srt|vtt|sbv)$/i;
  var canFolders = (function () { var i = document.createElement('input'); return 'webkitdirectory' in i; })() &&
    !matchMedia('(pointer:coarse)').matches;

  function byName(a, b) {
    return (a.webkitRelativePath || a.name).localeCompare(b.webkitRelativePath || b.name, undefined, { numeric: true, sensitivity: 'base' });
  }
  function accepts(input, file) {
    var list = (input.getAttribute('accept') || '').toLowerCase().split(',').map(function (s) { return s.trim(); }).filter(Boolean);
    if (!list.length) return !/^\./.test(file.name);
    var name = file.name.toLowerCase(), type = (file.type || '').toLowerCase();
    if (/^\./.test(name) || name === 'thumbs.db' || name === 'desktop.ini') return false;
    return list.some(function (a) {
      if (a[0] === '.') return name.slice(-a.length) === a;
      if (/\/\*$/.test(a)) return type.indexOf(a.slice(0, -1)) === 0 || (a === 'image/*' && /\.(png|jpe?g|webp|gif|bmp|avif|svg|ico|heic)$/.test(name));
      return type === a;
    });
  }
  function hand(input, files) {
    var dt = new DataTransfer();
    files.forEach(function (f) { dt.items.add(f); });
    input.files = dt.files;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }

  /* ---------- combining files for one-text tools ---------- */
  function decode(buf) {
    var b = new Uint8Array(buf);
    if (b[0] === 0xFF && b[1] === 0xFE) return new TextDecoder('utf-16le').decode(b);
    if (b[0] === 0xFE && b[1] === 0xFF) return new TextDecoder('utf-16be').decode(b);
    try { return new TextDecoder('utf-8', { fatal: true }).decode(b); } catch (e) { return new TextDecoder('windows-1252').decode(b); }
  }
  var readers = null;
  function needReaders() {
    if (window.PreparationFiles) return Promise.resolve(window.PreparationFiles);
    if (!readers) readers = new Promise(function (ok, fail) {
      var s = document.createElement('script');
      s.src = '../assets/preparation-readers.js';
      s.onload = function () { window.PreparationFiles ? ok(window.PreparationFiles) : fail(Error('PDF and Word reading is unavailable here.')); };
      s.onerror = function () { readers = null; fail(Error('PDF and Word reading could not load. Use TXT files.')); };
      document.head.appendChild(s);
    });
    return readers;
  }
  function textOf(f) {
    if (/\.(pdf|docx)$/i.test(f.name)) return needReaders().then(function (P) { return P.readFile(f); }).then(function (t) { return typeof t === 'string' ? t : (t && t.text) || ''; });
    return f.arrayBuffer().then(decode);
  }
  function say(input, msg) {
    var box = document.querySelector('[role=status]');
    if (box) box.textContent = msg;
  }
  var mine = new WeakSet();
  document.addEventListener('change', function (e) {
    var el = e.target;
    if (!el || el.type !== 'file' || !COMBINE[el.id] || el.dataset.mfCombine !== '1' || mine.has(el) || !el.files || el.files.length < 2) return;
    var files = Array.prototype.slice.call(el.files).sort(byName);
    // Subtitle files are turned into text first by the subtitle helper, which hands them back here.
    if (document.querySelector('script[src*="subtitle-support"]') && files.some(function (f) { return SUB.test(f.name); })) return;
    if (document.querySelector('script[src*="odt-support"]') && files.some(function (f) { return /\.odt$/i.test(f.name); })) return;
    e.stopImmediatePropagation();
    say(el, 'Combining ' + files.length + ' files on this device…');
    files.reduce(function (p, f) {
      return p.then(function (parts) { return textOf(f).then(function (t) { parts.push(String(t || '').replace(/^﻿/, '').replace(/\s+$/, '')); return parts; }); });
    }, Promise.resolve([])).then(function (parts) {
      var joined = parts.filter(Boolean).join('\n\n') + '\n';
      var one = new File([joined], files.length + ' files combined.txt', { type: 'text/plain' });
      mine.add(el);
      try { hand(el, [one]); } finally { mine.delete(el); }
    }).catch(function (err) { say(el, err.message || 'These files could not be combined.'); el.value = ''; });
  }, true);

  /* ---------- choosing file types when a whole folder comes in ---------- */
  function extOf(f) { var m = /\.([a-z0-9]{1,8})$/i.exec(f.name); return m ? m[1].toLowerCase() : ''; }
  var NICE = { pdf: 'PDF', docx: 'Word', doc: 'Word 97', odt: 'OpenDocument', txt: 'Text', md: 'Markdown', csv: 'CSV', srt: 'Subtitles', vtt: 'Subtitles', sbv: 'Subtitles',
    conllu: 'CoNLL-U', conll: 'CoNLL', png: 'Image', jpg: 'Image', jpeg: 'Image', webp: 'Image', gif: 'Image', bmp: 'Image', avif: 'Image', svg: 'Image', heic: 'Image', ico: 'Icon',
    xlsx: 'Excel', xls: 'Excel', pptx: 'PowerPoint', zip: 'ZIP archive', mp3: 'Audio', mp4: 'Video', json: 'JSON', html: 'Web page', rtf: 'Rich text' };
  function chooseFormats(input, all) {
    all = all.filter(function (f) { return !/^\./.test(f.name) && !/^(thumbs\.db|desktop\.ini)$/i.test(f.name); });
    var groups = {}, order = [];
    all.forEach(function (f) { var e = extOf(f); if (!groups[e]) { groups[e] = { ext: e, files: [], ok: accepts(input, f) }; order.push(e); } groups[e].files.push(f); });
    var supported = order.filter(function (e) { return groups[e].ok; });
    if (order.length < 2) return Promise.resolve(supported.length ? groups[supported[0]].files : []);
    order.sort(function (a, b) { return (groups[b].ok - groups[a].ok) || (groups[b].files.length - groups[a].files.length) || a.localeCompare(b); });
    var folder = ((all[0] && all[0].webkitRelativePath) || '').split('/')[0];
    return new Promise(function (done) {
      var dlg = document.createElement('dialog');
      dlg.className = 'mf-dialog';
      dlg.setAttribute('aria-labelledby', 'mf-dialog-title');
      dlg.innerHTML = '<form method="dialog"><p class="mf-kicker">Folder</p><h2 id="mf-dialog-title">Which file types should be added?</h2>' +
        '<p class="mf-sub"></p><div class="mf-quick"><button type="button" data-mf-all>Select all</button><button type="button" data-mf-none>Clear</button></div>' +
        '<ul class="mf-types"></ul><p class="mf-note"></p><div class="mf-actions"><button type="button" data-mf-cancel>Cancel</button><button type="submit" class="primary" data-mf-ok></button></div></form>';
      dlg.querySelector('.mf-sub').textContent = (folder ? '“' + folder + '” · ' : '') + all.length + ' files found in ' + order.length + ' formats. Tick the formats you want; the rest are left out.';
      var list = dlg.querySelector('.mf-types'), boxes = [];
      order.forEach(function (e) {
        var g = groups[e], li = document.createElement('li'), id = 'mf-t-' + (e || 'none');
        li.className = g.ok ? '' : 'is-off';
        li.innerHTML = '<label><input type="checkbox"><span class="mf-ext"></span><span class="mf-kind"></span><span class="mf-count"></span></label>';
        var cb = li.querySelector('input');
        cb.id = id; cb.checked = g.ok; cb.disabled = !g.ok; cb.value = e;
        li.querySelector('.mf-ext').textContent = e ? '.' + e.toUpperCase() : 'No ext.';
        li.querySelector('.mf-kind').textContent = g.ok ? (NICE[e] || 'File') : 'Not supported by this tool';
        li.querySelector('.mf-count').textContent = g.files.length + (g.files.length === 1 ? ' file' : ' files');
        if (g.ok) boxes.push(cb);
        list.appendChild(li);
      });
      var ok = dlg.querySelector('[data-mf-ok]'), note = dlg.querySelector('.mf-note');
      function count() {
        var n = boxes.reduce(function (t, b) { return t + (b.checked ? groups[b.value].files.length : 0); }, 0);
        ok.textContent = n ? 'Add ' + n + (n === 1 ? ' file' : ' files') : 'Choose a format';
        ok.disabled = !n;
        note.textContent = supported.length < order.length ? 'Greyed-out formats cannot be opened by this tool.' : '';
      }
      list.addEventListener('change', count);
      dlg.querySelector('[data-mf-all]').addEventListener('click', function () { boxes.forEach(function (b) { b.checked = true; }); count(); });
      dlg.querySelector('[data-mf-none]').addEventListener('click', function () { boxes.forEach(function (b) { b.checked = false; }); count(); });
      var result = null;
      dlg.querySelector('[data-mf-cancel]').addEventListener('click', function () { dlg.close(); });
      dlg.querySelector('form').addEventListener('submit', function () {
        var pick = {}; boxes.forEach(function (b) { if (b.checked) pick[b.value] = 1; });
        result = all.filter(function (f) { return pick[extOf(f)]; }).sort(byName);
      });
      dlg.addEventListener('close', function () { dlg.remove(); done(result); });
      count();
      document.body.appendChild(dlg);
      dlg.showModal();
      if (ok && !ok.disabled) ok.focus();
    });
  }

  /* ---------- folders dropped on drop areas ---------- */
  function walk(entry, out) {
    return new Promise(function (done) {
      if (!entry) return done();
      if (entry.isFile) return entry.file(function (f) {
        try { Object.defineProperty(f, 'webkitRelativePath', { value: entry.fullPath.replace(/^\//, '') }); } catch (e) {}
        out.push(f); done();
      }, function () { done(); });
      var reader = entry.createReader();
      (function more() {
        reader.readEntries(function (list) {
          if (!list.length) return done();
          Promise.all(list.map(function (x) { return walk(x, out); })).then(more);
        }, function () { done(); });
      })();
    });
  }
  var redrop = false;
  document.addEventListener('drop', function (e) {
    if (redrop || !e.dataTransfer || !e.dataTransfer.items) return;
    var entries = Array.prototype.map.call(e.dataTransfer.items, function (it) { return it.kind === 'file' && it.webkitGetAsEntry ? it.webkitGetAsEntry() : null; });
    if (!entries.some(function (x) { return x && x.isDirectory; })) return;
    var target = e.target, opts = { clientX: e.clientX, clientY: e.clientY };
    e.preventDefault();
    e.stopImmediatePropagation();
    var out = [];
    Promise.all(entries.map(function (x) { return walk(x, out); })).then(function () {
      var input = (target.closest && target.closest('label,div,section') || document).querySelector('input[type=file]') || document.querySelector('input[type=file]:not([id^=restore])');
      return (input ? chooseFormats(input, out) : Promise.resolve(out.filter(function (f) { return !/^\./.test(f.name); }))).then(function (chosen) {
      if (chosen === null) return;
      out = chosen.sort(byName);
      if (!out.length) return say(input, 'No supported files were found in that folder.');
      var dt = new DataTransfer();
      out.forEach(function (f) { dt.items.add(f); });
      redrop = true;
      try { target.dispatchEvent(new DragEvent('drop', Object.assign({ bubbles: true, cancelable: true, dataTransfer: dt }, opts))); }
      finally { redrop = false; }
      });
    });
  }, true);

  /* ---------- "Add folder" buttons ---------- */
  function folderPicker(input) {
    var picker = document.createElement('input');
    picker.type = 'file';
    picker.hidden = true;
    picker.multiple = true;
    picker.setAttribute('webkitdirectory', '');
    picker.setAttribute('aria-hidden', 'true');
    picker.tabIndex = -1;
    picker.className = 'mf-folder-input';
    picker.addEventListener('change', function (e) {
      e.stopImmediatePropagation();
      var all = Array.prototype.slice.call(picker.files || []);
      picker.value = '';
      chooseFormats(input, all).then(function (files) {
        if (files === null) return;
        if (!files.length) return say(input, 'No supported files were found in that folder.');
        hand(input, files.sort(byName));
      });
    });
    input.insertAdjacentElement('afterend', picker);
    return picker;
  }
  function addButton(after, input, label, trigger, styleFrom) {
    if (!canFolders || !after || after.parentNode.querySelector('[data-mf-for="' + input.id + '"][data-mf-label="' + label + '"]')) return;
    var picker = input._mfPicker || (input._mfPicker = folderPicker(input));
    var b = document.createElement('button');
    b.type = 'button';
    b.dataset.mfFor = input.id;
    b.dataset.mfLabel = label;
    b.className = 'mf-folder ' + ((styleFrom && styleFrom.className) || '').replace(/\bprimary\b/g, '').trim();
    b.textContent = '＋ ' + label;
    b.title = 'Choose a folder. Every supported file inside it is added, sub-folders included.';
    // Keep the tool's own disabled state for its setting buttons.
    ['data-mutates', 'data-meta-setting', 'data-ocr-setting', 'data-pdf-setting', 'data-media-setting', 'data-mt-lock'].forEach(function (a) { if (styleFrom && styleFrom.hasAttribute(a)) b.setAttribute(a, ''); });
    b.addEventListener('click', function () {
      if (trigger) {
        // Let the tool prepare (e.g. choose target or reference) without opening its file picker.
        var had = Object.prototype.hasOwnProperty.call(input, 'click'), own = input.click;
        input.click = function () {};
        try { trigger.click(); } finally { if (had) input.click = own; else delete input.click; }
      }
      picker.click();
    });
    after.insertAdjacentElement('afterend', b);
    if (styleFrom && styleFrom.disabled !== undefined) {
      new MutationObserver(function () { b.disabled = !!styleFrom.disabled; }).observe(styleFrom, { attributes: true, attributeFilter: ['disabled'] });
      b.disabled = !!styleFrom.disabled;
    }
  }
  function setup() {
    document.querySelectorAll('input[type=file]').forEach(function (input) {
      if (!input.id || SKIP[input.id] || input.classList.contains('mf-folder-input') || input.hasAttribute('webkitdirectory')) return;
      if (!input.multiple && COMBINE[input.id]) input.dataset.mfCombine = '1';
      input.multiple = true;
      if (/\.json$/i.test(input.getAttribute('accept') || '')) return;
      var known = TRIGGERS[input.id];
      if (known) {
        known.forEach(function (k) { var t = document.getElementById(k[0]); if (t) addButton(t, input, k[1], t, t); });
        return;
      }
      var wrap = input.closest('label');
      var forLabel = document.querySelector('label[for="' + input.id + '"]:not([hidden])');
      var drop = input.closest('.mt-drop,.mat-drop');
      if (drop) return addButton(drop, input, 'Add folder', null, null);
      if (wrap) return addButton(wrap, input, 'Add folder', null, wrap);
      if (forLabel) return addButton(forLabel, input, 'Add folder', null, forLabel);
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setup); else setup();
  // Words on buttons that promised one file.
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('label.language-upload').forEach(function (l) {
      var n = l.firstChild;
      if (n && n.nodeType === 3) n.textContent = n.textContent.replace('＋ Add .txt file', '＋ Add .txt files').replace(/^＋ Add file$/, '＋ Add files');
    });
  });
})();
