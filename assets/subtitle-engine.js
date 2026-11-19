/* Subtitle Corpus Builder engine: link parsing, subtitle file reading, cleaning,
   file naming, metadata CSV and a small ZIP writer. No network, no DOM. */
(function (root) {
  'use strict';

  var ID = /^[A-Za-z0-9_-]{11}$/;

  function parseLinks(text, opts) {
    opts = opts || {};
    var videos = [], playlists = [], bad = [], seenV = {}, seenL = {};
    function addV(id) { if (ID.test(id) && !seenV[id]) { seenV[id] = 1; videos.push(id); } }
    function addL(l) { if (/^[A-Za-z0-9_-]{10,80}$/.test(l) && !/^RD/.test(l) && !seenL[l]) { seenL[l] = 1; playlists.push(l); } }
    String(text || '').split(/[\s,;]+/).forEach(function (raw) {
      var s = raw.trim().replace(/^[<("']+|[>)"'.]+$/g, '');
      if (!s) return;
      if (ID.test(s)) { addV(s); return; }
      var u;
      try { u = new URL(/^https?:\/\//i.test(s) ? s : 'https://' + s); } catch (e) { bad.push(raw); return; }
      var host = u.hostname.replace(/^www\.|^m\.|^music\./, '');
      var list = u.searchParams.get('list') || '';
      var id = '';
      if (host === 'youtu.be') id = u.pathname.slice(1).split('/')[0];
      else if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
        if (u.pathname === '/watch') id = u.searchParams.get('v') || '';
        else {
          var m = u.pathname.match(/^\/(?:shorts|embed|live|v)\/([A-Za-z0-9_-]{11})/);
          if (m) id = m[1];
        }
      } else { bad.push(raw); return; }
      if (u.pathname === '/playlist' && list) { addL(list); return; }
      if (id && ID.test(id)) {
        addV(id);
        if (list && opts.wholePlaylist) addL(list);
        return;
      }
      if (list) { addL(list); return; }
      bad.push(raw);
    });
    return { videos: videos, playlists: playlists, bad: bad };
  }

  var TIME = /^\s*(?:\d+:)?\d{1,2}:\d{2}[.,]\d{1,3}\s*(?:-->|,)\s*(?:\d+:)?\d{1,2}:\d{2}[.,]\d{1,3}.*$/;

  // Read SRT, WebVTT, SBV or plain text into subtitle lines.
  function parseSubtitleFile(name, body) {
    var text = String(body || '').replace(/^﻿/, '').replace(/\r\n?/g, '\n');
    var lower = (name || '').toLowerCase();
    var isVtt = /^WEBVTT/.test(text) || /\.vtt$/.test(lower);
    var isTimed = isVtt || /\.(srt|sbv)$/.test(lower) || TIME.test(text.split('\n').slice(0, 6).join('\n').split('\n').filter(Boolean)[1] || '');
    if (!isTimed) return text.split('\n').map(function (l) { return l.trim(); }).filter(Boolean);
    var out = [], skip = false;
    text.split('\n').forEach(function (line) {
      var l = line.trim();
      if (!l) { skip = false; return; }
      if (skip) return;
      if (isVtt && (/^WEBVTT/.test(l) || /^(NOTE|STYLE|REGION)\b/.test(l))) { skip = /^(NOTE|STYLE|REGION)\b/.test(l); return; }
      if (/^\d+$/.test(l)) return;               // SRT cue number
      if (TIME.test(l) || /-->/.test(l)) return;  // timing line
      l = l.replace(/<\d{1,2}:\d{2}(?::\d{2})?[.,]\d{1,3}>/g, '').replace(/<\/?[a-z][^>]*>/gi, '').replace(/\{\\[^}]*\}/g, '');
      l = l.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, ' ').trim();
      if (l) out.push(l);
    });
    // VTT auto-captions repeat the previous line as the next cue's first line.
    return dedupeRolling(out);
  }

  function dedupeRolling(lines) {
    var out = [];
    lines.forEach(function (l) { if (out[out.length - 1] !== l) out.push(l); });
    return out;
  }

  var SOUND = /\[(?:[^\]]{0,40})\]|\((?:music|applause|laughter|laughs|cheering|inaudible|silence|background music|music playing|bell rings|sighs)\)|[♪♫♬]+/gi;

  // Turn subtitle lines into corpus text.
  function cleanLines(lines, opts) {
    opts = opts || {};
    var out = (lines || []).map(function (l) {
      var s = String(l);
      if (opts.removeSound !== false) s = s.replace(SOUND, ' ');
      if (opts.removeSpeakers !== false) s = s.replace(/^\s*(?:>>+|-{1,2})\s*/, '').replace(/\s>>+\s/g, ' ');
      return s.replace(/\s+/g, ' ').trim();
    }).filter(Boolean);
    out = dedupeRolling(out);
    if (opts.layout === 'lines') return out.join('\n');
    // Running text: join, then start a new paragraph after every 6 sentences.
    var joined = out.join(' ').replace(/\s+([,.;:!?])/g, '$1');
    var sentences = joined.match(/[^.!?。！？]+[.!?。！？]+["')\]]*\s*|[^.!?。！？]+$/g) || [joined];
    var paras = [], cur = [];
    sentences.forEach(function (s) { cur.push(s.trim()); if (cur.length >= 6) { paras.push(cur.join(' ')); cur = []; } });
    if (cur.length) paras.push(cur.join(' '));
    return paras.filter(Boolean).join('\n\n');
  }

  function countWords(text) {
    var m = String(text || '').match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu);
    return m ? m.length : 0;
  }

  function slug(s, max) {
    var t = String(s || '').normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-+|-+$/g, '');
    return (t.slice(0, max || 60).replace(/-+$/, '')) || 'untitled';
  }

  function fileName(index, item) {
    var n = String(index + 1).padStart(3, '0');
    return n + '_' + slug(item.title, 60) + (item.id ? '_' + item.id : '') + '.txt';
  }

  function header(item, style) {
    if (style === 'none') return '';
    if (style === 'tags') {
      var a = function (k, v) { return v ? ' ' + k + '="' + String(v).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;') + '"' : ''; };
      return '<text' + a('id', item.id) + a('title', item.title) + a('channel', item.channel) + a('date', item.publishDate) + a('language', item.languageLabel) + a('source', item.url) + '>\n';
    }
    return '=== ' + (item.title || item.id || 'Untitled') + ' ===\n' + [item.channel, item.publishDate, item.languageLabel, item.url].filter(Boolean).join(' | ') + '\n\n';
  }

  function combined(items, style) {
    return items.map(function (it) {
      return header(it, style) + it.text + (style === 'tags' ? '\n</text>' : '');
    }).join('\n\n');
  }

  function csv(rows) {
    return rows.map(function (r) {
      return r.map(function (v) {
        var s = v == null ? '' : String(v);
        if (/^[=+\-@\t\r]/.test(s)) s = "'" + s; // keep spreadsheets from running formulas
        return /[",\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
      }).join(',');
    }).join('\r\n');
  }

  // Minimal ZIP writer (stored, UTF-8 names). Returns a Uint8Array.
  var CRC = (function () {
    var t = new Uint32Array(256);
    for (var n = 0; n < 256; n++) { var c = n; for (var k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; }
    return t;
  })();
  function crc32(bytes) { var c = 0xFFFFFFFF; for (var i = 0; i < bytes.length; i++) c = CRC[(c ^ bytes[i]) & 0xFF] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; }

  function zip(files) {
    var enc = new TextEncoder(), parts = [], central = [], offset = 0;
    var d = new Date(), time = (d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1);
    var date = ((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate();
    files.forEach(function (f) {
      var name = enc.encode(f.name), data = typeof f.data === 'string' ? enc.encode(f.data) : f.data, crc = crc32(data);
      var h = new DataView(new ArrayBuffer(30));
      h.setUint32(0, 0x04034b50, true); h.setUint16(4, 20, true); h.setUint16(6, 0x0800, true); h.setUint16(8, 0, true);
      h.setUint16(10, time, true); h.setUint16(12, date, true); h.setUint32(14, crc, true);
      h.setUint32(18, data.length, true); h.setUint32(22, data.length, true); h.setUint16(26, name.length, true); h.setUint16(28, 0, true);
      parts.push(new Uint8Array(h.buffer), name, data);
      var c = new DataView(new ArrayBuffer(46));
      c.setUint32(0, 0x02014b50, true); c.setUint16(4, 20, true); c.setUint16(6, 20, true); c.setUint16(8, 0x0800, true); c.setUint16(10, 0, true);
      c.setUint16(12, time, true); c.setUint16(14, date, true); c.setUint32(16, crc, true); c.setUint32(20, data.length, true); c.setUint32(24, data.length, true);
      c.setUint16(28, name.length, true); c.setUint32(42, offset, true);
      central.push(new Uint8Array(c.buffer), name);
      offset += 30 + name.length + data.length;
    });
    var size = central.reduce(function (s, p) { return s + p.length; }, 0);
    var e = new DataView(new ArrayBuffer(22));
    e.setUint32(0, 0x06054b50, true); e.setUint16(8, files.length, true); e.setUint16(10, files.length, true);
    e.setUint32(12, size, true); e.setUint32(16, offset, true);
    var all = parts.concat(central, [new Uint8Array(e.buffer)]);
    var out = new Uint8Array(all.reduce(function (s, p) { return s + p.length; }, 0)), pos = 0;
    all.forEach(function (p) { out.set(p, pos); pos += p.length; });
    return out;
  }

  var api = { parseLinks: parseLinks, parseSubtitleFile: parseSubtitleFile, cleanLines: cleanLines, countWords: countWords,
    slug: slug, fileName: fileName, header: header, combined: combined, csv: csv, zip: zip, crc32: crc32 };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.SubtitleEngine = api;
})(typeof self !== 'undefined' ? self : this);
