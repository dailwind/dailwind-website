/* OpenDocument Text (.odt) support for Dailwind text tools.
   Every text tool accepts .odt files (LibreOffice / OpenOffice / Google Docs export).
   Each one is read in this tab: its paragraphs, headings, lists and tables become
   plain text, handed to the tool as a .txt file, so the tool itself needs no changes. */
(function () {
  'use strict';
  var ODT = /\.odt$/i;
  var NS = 'urn:oasis:names:tc:opendocument:xmlns:text:1.0';
  var TABLE = 'urn:oasis:names:tc:opendocument:xmlns:table:1.0';
  var MAX = 200 * 1024 * 1024;

  /* ---- reading the ZIP container (stored or deflated entries) ---- */
  function entry(buf, wanted) {
    var v = new DataView(buf), end = -1;
    for (var i = buf.byteLength - 22; i >= Math.max(0, buf.byteLength - 65557); i--) if (v.getUint32(i, true) === 0x06054b50) { end = i; break; }
    if (end < 0) throw Error('This .odt file is damaged or is not an OpenDocument file.');
    var count = v.getUint16(end + 10, true), p = v.getUint32(end + 16, true), dec = new TextDecoder();
    for (var n = 0; n < count && p + 46 <= buf.byteLength; n++) {
      if (v.getUint32(p, true) !== 0x02014b50) break;
      var method = v.getUint16(p + 10, true), size = v.getUint32(p + 20, true), real = v.getUint32(p + 24, true),
        nameLen = v.getUint16(p + 28, true), extra = v.getUint16(p + 30, true), note = v.getUint16(p + 32, true), local = v.getUint32(p + 42, true);
      var name = dec.decode(new Uint8Array(buf, p + 46, nameLen));
      if (name === wanted) {
        if (real > MAX) throw Error('This .odt file is too large to read here.');
        var start = local + 30 + v.getUint16(local + 26, true) + v.getUint16(local + 28, true);
        var data = new Uint8Array(buf, start, size);
        if (method === 0) return Promise.resolve(data);
        if (method !== 8) throw Error('This .odt file uses an unsupported compression.');
        if (typeof DecompressionStream === 'undefined') throw Error('Please update your browser to open .odt files.');
        return new Response(new Blob([data]).stream().pipeThrough(new DecompressionStream('deflate-raw'))).arrayBuffer().then(function (b) { return new Uint8Array(b); });
      }
      p += 46 + nameLen + extra + note;
    }
    throw Error('No text was found in this .odt file.');
  }

  /* ---- turning content.xml into plain text ---- */
  function inline(node) {
    var out = '';
    node.childNodes.forEach(function (c) {
      if (c.nodeType === 3) { out += c.nodeValue; return; }
      if (c.nodeType !== 1) return;
      if (c.namespaceURI === NS) {
        if (c.localName === 's') { out += ' '.repeat(Math.min(200, +(c.getAttributeNS(NS, 'c') || 1))); return; }
        if (c.localName === 'tab') { out += '\t'; return; }
        if (c.localName === 'line-break') { out += '\n'; return; }
        if (/^(note|annotation|tracked-changes|bookmark|sequence-decls|soft-page-break)$/.test(c.localName)) return;
      }
      if (c.localName === 'annotation') return;
      out += inline(c);
    });
    return out;
  }
  function blocks(node, lines) {
    node.childNodes.forEach(function (c) {
      if (c.nodeType !== 1) return;
      if (c.namespaceURI === NS && (c.localName === 'p' || c.localName === 'h')) { lines.push(inline(c).replace(/[  ]+$/g, '')); return; }
      if (c.namespaceURI === NS && /^(tracked-changes|sequence-decls|variable-decls|user-field-decls|table-of-content|index-title)$/.test(c.localName)) return;
      if (c.namespaceURI === TABLE && c.localName === 'table-row') {
        var cells = [];
        c.childNodes.forEach(function (cell) { if (cell.nodeType === 1 && cell.localName === 'table-cell') { var l = []; blocks(cell, l); cells.push(l.join(' ').trim()); } });
        lines.push(cells.join('\t'));
        return;
      }
      blocks(c, lines);
    });
  }
  function odtToText(buf) {
    return entry(buf, 'content.xml').then(function (bytes) {
      var xml = new DOMParser().parseFromString(new TextDecoder('utf-8').decode(bytes), 'application/xml');
      if (xml.getElementsByTagName('parsererror').length) throw Error('This .odt file could not be read.');
      var body = xml.getElementsByTagNameNS(NS, 'text')[0] || xml.documentElement, lines = [];
      blocks(body, lines);
      return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n';
    });
  }

  function hasOdt(files) { for (var i = 0; i < (files ? files.length : 0); i++) if (ODT.test(files[i].name)) return true; return false; }
  function convert(files) {
    return Promise.all(Array.prototype.map.call(files, function (f) {
      if (!ODT.test(f.name)) return f;
      if (f.size > MAX) throw Error(f.name + ' is too large to read here.');
      return f.arrayBuffer().then(odtToText).then(function (txt) {
        var file = new File([txt], f.name.replace(ODT, '') + '.txt', { type: 'text/plain', lastModified: f.lastModified });
        if (f.webkitRelativePath) try { Object.defineProperty(file, 'webkitRelativePath', { value: f.webkitRelativePath.replace(ODT, '.txt') }); } catch (e) {}
        return file;
      }, function (err) { throw Error(f.name + ': ' + (err.message || 'could not be read.')); });
    })).then(function (list) { var dt = new DataTransfer(); list.forEach(function (f) { dt.items.add(f); }); return dt; });
  }
  function say(msg) { var b = document.querySelector('[role=status]'); if (b) b.textContent = msg; }

  function textInput(el) {
    var a = (el.getAttribute('accept') || '').toLowerCase();
    return el.type === 'file' && /\.txt|\.docx|text\/plain/.test(a) && !/^\.json$/.test(a);
  }
  function widen(root) {
    (root.querySelectorAll ? root.querySelectorAll('input[type=file][accept]') : []).forEach(function (el) {
      if (textInput(el) && !/\.odt/i.test(el.getAttribute('accept'))) el.setAttribute('accept', el.getAttribute('accept') + ',.odt');
    });
  }

  var busy = new WeakSet();
  document.addEventListener('change', function (e) {
    var el = e.target;
    if (!el || el.type !== 'file' || busy.has(el) || !textInput(el) || !hasOdt(el.files)) return;
    e.stopImmediatePropagation();
    say('Reading OpenDocument text on this device…');
    convert(el.files).then(function (dt) {
      busy.add(el);
      try {
        el.files = dt.files;
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      } finally { busy.delete(el); }
    }, function (err) { el.value = ''; say(err.message); });
  }, true);

  var redispatching = false;
  document.addEventListener('drop', function (e) {
    if (redispatching || !e.dataTransfer || !hasOdt(e.dataTransfer.files)) return;
    var target = e.target;
    e.preventDefault();
    e.stopImmediatePropagation();
    convert(e.dataTransfer.files).then(function (dt) {
      redispatching = true;
      try { target.dispatchEvent(new DragEvent('drop', { bubbles: true, cancelable: true, dataTransfer: dt })); }
      finally { redispatching = false; }
    }, function (err) { say(err.message); });
  }, true);

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { widen(document); });
  else widen(document);
  new MutationObserver(function (m) { m.forEach(function (r) { r.addedNodes.forEach(function (n) { if (n.nodeType === 1) { if (n.matches && n.matches('input[type=file]')) widen(n.parentNode || document); else widen(n); } }); }); })
    .observe(document.documentElement, { childList: true, subtree: true });

  window.DailwindODT = { toText: odtToText };
})();
