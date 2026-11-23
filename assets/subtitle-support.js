/* Subtitle file support for Dailwind text tools.
   Lets every text tool accept SRT, WebVTT and SBV subtitle files: each one is turned
   into clean plain text (no cue numbers, timings or formatting tags) and handed to the
   tool as a .txt file, so the tool itself needs no changes. Runs only in this tab. */
(function () {
  'use strict';
  var SUB = /\.(srt|vtt|sbv)$/i;
  var EXTRA = ',.srt,.vtt,.sbv';
  var TIME = /^\s*(?:\d+:)?\d{1,2}:\d{2}[.,]\d{1,3}\s*(?:-->|,)\s*(?:\d+:)?\d{1,2}:\d{2}[.,]\d{1,3}/;

  function decode(buf) {
    var b = new Uint8Array(buf);
    if (b[0] === 0xFF && b[1] === 0xFE) return new TextDecoder('utf-16le').decode(b);
    if (b[0] === 0xFE && b[1] === 0xFF) return new TextDecoder('utf-16be').decode(b);
    try { return new TextDecoder('utf-8', { fatal: true }).decode(b); }
    catch (e) { return new TextDecoder('windows-1252').decode(b); }
  }

  function subtitleToText(name, body) {
    var text = String(body || '').replace(/^﻿/, '').replace(/\r\n?/g, '\n');
    var vtt = /^WEBVTT/.test(text) || /\.vtt$/i.test(name);
    var out = [], skip = false;
    text.split('\n').forEach(function (line) {
      var l = line.trim();
      if (!l) { skip = false; return; }
      if (skip) return;
      if (vtt && /^WEBVTT/.test(l)) return;
      if (vtt && /^(NOTE|STYLE|REGION)\b/.test(l)) { skip = true; return; }
      if (vtt && /^(Kind|Language):/i.test(l) && !out.length) return;
      if (/^\d+$/.test(l)) return;                    // SRT cue number
      if (TIME.test(l) || /-->/.test(l)) return;       // timing line
      l = l.replace(/<\d{1,2}:\d{2}(?::\d{2})?[.,]\d{1,3}>/g, '')
           .replace(/<\/?[a-z][^>]*>/gi, '')
           .replace(/\{\\[^}]*\}/g, '')
           .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
           .replace(/\s+/g, ' ').trim();
      if (l && out[out.length - 1] !== l) out.push(l); // auto-captions repeat the previous line
    });
    return out.join('\n') + '\n';
  }

  function hasSubs(files) { for (var i = 0; i < (files ? files.length : 0); i++) if (SUB.test(files[i].name)) return true; return false; }

  function convert(files) {
    return Promise.all(Array.prototype.map.call(files, function (f) {
      if (!SUB.test(f.name)) return f;
      return f.arrayBuffer().then(function (buf) {
        var txt = subtitleToText(f.name, decode(buf));
        return new File([txt], f.name.replace(SUB, '') + '.txt', { type: 'text/plain', lastModified: f.lastModified });
      });
    })).then(function (list) {
      var dt = new DataTransfer();
      list.forEach(function (f) { dt.items.add(f); });
      return dt;
    });
  }

  function textInput(el) {
    var a = (el.getAttribute('accept') || '').toLowerCase();
    return el.type === 'file' && /\.txt|text\/plain/.test(a);
  }
  function widen(root) {
    (root.querySelectorAll ? root.querySelectorAll('input[type=file][accept]') : []).forEach(function (el) {
      if (textInput(el) && !/\.srt/i.test(el.getAttribute('accept'))) el.setAttribute('accept', el.getAttribute('accept') + EXTRA);
    });
  }

  // File pickers: swap subtitle files for converted text files before the tool sees them.
  var busy = new WeakSet();
  document.addEventListener('change', function (e) {
    var el = e.target;
    if (!el || el.type !== 'file' || busy.has(el) || !textInput(el) || !hasSubs(el.files)) return;
    e.stopImmediatePropagation();
    convert(el.files).then(function (dt) {
      busy.add(el);
      el.files = dt.files;
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
      busy.delete(el);
    });
  }, true);

  // Drag and drop onto a tool's drop area.
  var redispatching = false;
  document.addEventListener('drop', function (e) {
    if (redispatching || !e.dataTransfer || !hasSubs(e.dataTransfer.files)) return;
    var target = e.target;
    e.preventDefault();
    e.stopImmediatePropagation();
    convert(e.dataTransfer.files).then(function (dt) {
      redispatching = true;
      try { target.dispatchEvent(new DragEvent('drop', { bubbles: true, cancelable: true, dataTransfer: dt })); }
      finally { redispatching = false; }
    });
  }, true);

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { widen(document); });
  else widen(document);
  new MutationObserver(function (m) { m.forEach(function (r) { r.addedNodes.forEach(function (n) { if (n.nodeType === 1) { if (n.matches && n.matches('input[type=file]')) widen(n.parentNode || document); else widen(n); } }); }); })
    .observe(document.documentElement, { childList: true, subtree: true });

  window.DailwindSubtitles = { toText: subtitleToText };
})();
