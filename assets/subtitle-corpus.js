/* Subtitle Corpus Builder page. Talks to the Dailwind Subtitle Grabber extension
   through window.postMessage; everything else happens in this tab. */
(function () {
  'use strict';
  var E = window.SubtitleEngine;
  var $ = function (id) { return document.getElementById(id); };
  var LANGS = [['en', 'English'], ['ur', 'Urdu'], ['hi', 'Hindi'], ['pa', 'Punjabi'], ['ar', 'Arabic'], ['fa', 'Persian'],
    ['zh-Hans', 'Chinese (Simplified)'], ['zh-Hant', 'Chinese (Traditional)'], ['es', 'Spanish'], ['fr', 'French'], ['de', 'German'],
    ['tr', 'Turkish'], ['ru', 'Russian'], ['pt', 'Portuguese'], ['it', 'Italian'], ['ja', 'Japanese'], ['ko', 'Korean'],
    ['bn', 'Bengali'], ['id', 'Indonesian'], ['ms', 'Malay'], ['nl', 'Dutch'], ['sv', 'Swedish'], ['pl', 'Polish'], ['uk', 'Ukrainian']];
  var NAMES = {}; LANGS.forEach(function (l) { NAMES[l[0]] = l[1]; });
  var STEP_MS = 650;

  var items = [], ext = null, run = 0, built = false;

  function status(msg) { $('sc-status').textContent = msg; }
  function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function base(code) { return String(code || '').toLowerCase().split(/[-_]/)[0]; }
  function langName(code) { return NAMES[code] || NAMES[base(code)] || code; }

  /* ---- extension bridge ---- */
  var seq = 0, waiting = new Map();
  window.addEventListener('message', function (e) {
    if (e.source !== window || !e.data || e.data.source !== 'dailwind-ext') return;
    if (e.data.type === 'hello') { setExt(e.data.version); return; }
    var w = waiting.get(e.data.id);
    if (!w) return;
    waiting.delete(e.data.id); clearTimeout(w.t);
    if (e.data.error) w.reject(new Error(e.data.error)); else w.resolve(e.data.result);
  });
  function ask(payload, ms) {
    return new Promise(function (resolve, reject) {
      var id = 'sc' + (++seq);
      var t = setTimeout(function () { waiting.delete(id); reject(new Error('The extension did not answer.')); }, ms || 90000);
      waiting.set(id, { resolve: resolve, reject: reject, t: t });
      window.postMessage({ source: 'dailwind-page', id: id, payload: payload }, location.origin);
    });
  }
  function setExt(version) {
    ext = version || ext || '1';
    $('sc-ext').dataset.state = 'ready';
    $('sc-ext-state').textContent = 'Connected · version ' + ext;
  }
  function checkExt() {
    $('sc-ext').dataset.state = 'checking'; $('sc-ext-state').textContent = 'Checking…';
    return ask({ type: 'ping' }, 1500).then(function (r) { setExt(r && r.version); return true; }, function () {
      if (ext) return true;
      $('sc-ext').dataset.state = 'missing'; $('sc-ext-state').textContent = 'Not installed';
      return false;
    });
  }

  /* ---- choosing subtitles ---- */
  function key(track, tlang) { return track.lang + '|' + track.kind + '|' + (tlang || ''); }
  function parseKey(k) { var p = String(k).split('|'); return { lang: p[0], kind: p[1], tlang: p[2] || '' }; }
  function trackFor(item, k) { var c = parseKey(k); return item.tracks.filter(function (t) { return t.lang === c.lang && t.kind === c.kind; })[0]; }
  function translationCode(item, target) {
    var list = item.translations || [];
    if (!list.length) return target;
    var exact = list.filter(function (l) { return l.lang === target; })[0];
    var near = list.filter(function (l) { return base(l.lang) === base(target); })[0];
    return (exact || near || {}).lang || '';
  }
  function bestSource(item) {
    var tr = item.tracks.filter(function (t) { return t.translatable; });
    return tr.filter(function (t) { return t.kind === 'uploaded'; })[0] || tr[0];
  }
  function choose(item, target, fallback) {
    var t = item.tracks, same = function (x) { return base(x.lang) === base(target); };
    var pick = function (list) { return list.filter(function (x) { return x.lang === target; })[0] || list[0]; };
    var up = t.filter(function (x) { return x.kind === 'uploaded' && same(x); });
    if (up.length) return key(pick(up));
    var au = t.filter(function (x) { return x.kind === 'auto' && same(x); });
    if (au.length) return key(pick(au));
    if (!t.length || fallback === 'skip') return 'skip';
    if (fallback === 'mt') { var src = bestSource(item), tl = translationCode(item, target); if (src && tl) return key(src, tl); }
    return key(t.filter(function (x) { return x.kind === 'uploaded'; })[0] || t[0]);
  }
  function describe(item, k) {
    if (item.source === 'file') return { label: 'From your file', type: 'file', from: '' };
    var c = parseKey(k), tr = trackFor(item, k) || { name: c.lang };
    if (c.tlang) return { label: langName(c.tlang) + ' (machine translation from ' + tr.name.replace(/\s*\(auto-generated\)/, '') + ')', type: 'machine-translated', from: c.lang, lang: c.tlang };
    return { label: tr.name.replace(/\s*\(auto-generated\)/, '') + (c.kind === 'auto' ? ' (auto-generated)' : ' (uploaded)'), type: c.kind === 'auto' ? 'auto-generated' : 'uploaded', from: '', lang: c.lang };
  }
  function options(item) {
    var target = $('sc-lang').value, out = [];
    item.tracks.slice().sort(function (a, b) { return (a.kind === 'auto') - (b.kind === 'auto'); }).forEach(function (t) {
      out.push([key(t), t.name.replace(/\s*\(auto-generated\)/, '') + (t.kind === 'auto' ? ' · auto-generated' : ' · uploaded')]);
    });
    var src = bestSource(item);
    if (src) {
      [target, 'en'].filter(function (v, i, a) { return a.indexOf(v) === i; }).forEach(function (code) {
        var tl = translationCode(item, code);
        if (tl && base(tl) !== base(src.lang)) out.push([key(src, tl), langName(tl) + ' · machine translation']);
      });
    }
    out.push(['skip', 'Leave this video out']);
    return out;
  }

  /* ---- table ---- */
  function setState(item, kind, text, err) {
    item.state = kind; item.stateText = text; item.error = err || '';
    var row = item.row;
    if (!row) return;
    var st = row.querySelector('.sc-st'); st.dataset.k = kind; st.textContent = text;
    var e = row.querySelector('.sc-err'); e.textContent = err || ''; e.hidden = !err;
  }
  function fillSelect(item) {
    var sel = item.row.querySelector('select');
    sel.textContent = '';
    if (item.source === 'file') { sel.add(new Option('From your file', 'file')); sel.disabled = true; return; }
    if (!item.tracks) { sel.add(new Option('Waiting…', '')); sel.disabled = true; return; }
    options(item).forEach(function (o) { sel.add(new Option(o[1], o[0])); });
    sel.disabled = false;
    sel.value = item.choice;
    if (sel.value !== item.choice) { item.choice = 'skip'; sel.value = 'skip'; }
  }
  function addRow(item) {
    var tr = document.createElement('tr'), cells = [];
    for (var i = 0; i < 5; i++) { cells.push(document.createElement('td')); tr.appendChild(cells[i]); }
    var cb = document.createElement('input'); cb.type = 'checkbox'; cb.checked = item.include; cb.setAttribute('aria-label', 'Include this video');
    cb.addEventListener('change', function () { item.include = cb.checked; tr.classList.toggle('sc-off', !cb.checked); summary(); });
    cells[0].appendChild(cb);
    var title = document.createElement('b'), meta = document.createElement('small');
    cells[2].append(title, meta);
    var sel = document.createElement('select'); sel.setAttribute('aria-label', 'Subtitles to use');
    sel.addEventListener('change', function () { item.choice = sel.value; summary(); });
    cells[3].appendChild(sel);
    var st = document.createElement('span'); st.className = 'sc-st';
    var er = document.createElement('span'); er.className = 'sc-err'; er.hidden = true;
    cells[4].append(st, er);
    item.row = tr;
    $('sc-rows').appendChild(tr);
    refreshRow(item);
  }
  function refreshRow(item) {
    var c = item.row.children;
    c[1].textContent = String(items.indexOf(item) + 1);
    c[2].querySelector('b').textContent = item.title || item.id;
    var bits = [item.channel, item.lengthSeconds ? Math.round(item.lengthSeconds / 60) + ' min' : '', item.source === 'file' ? 'File' : item.id].filter(Boolean);
    c[2].querySelector('small').textContent = bits.join(' · ');
    fillSelect(item);
    setState(item, item.state, item.stateText, item.error);
  }
  function summary() {
    var yt = items.filter(function (i) { return i.source === 'youtube'; }), on = items.filter(function (i) { return i.include && i.choice !== 'skip' && i.state !== 'err-info'; });
    var none = yt.filter(function (i) { return i.tracks && !i.tracks.length; }).length;
    var mt = on.filter(function (i) { return i.source === 'youtube' && parseKey(i.choice).tlang; }).length;
    var parts = [items.length + (items.length === 1 ? ' item' : ' items'), on.length + ' selected'];
    if (mt) parts.push(mt + ' by machine translation');
    if (none) parts.push(none + ' without any subtitles (the paid service can help)');
    $('sc-summary').textContent = parts.join(' · ') + '.';
    $('sc-all').checked = items.length > 0 && items.every(function (i) { return i.include; });
  }
  function show() { var any = items.length > 0; $('sc-review').hidden = !any; $('sc-out').hidden = !any; summary(); }

  function addItem(it) {
    it.include = true; it.state = it.state || 'idle'; it.stateText = it.stateText || ''; it.tracks = it.tracks || null; it.choice = it.choice || '';
    items.push(it); addRow(it);
  }

  /* ---- step 1: check links ---- */
  async function check() {
    var parsed = E.parseLinks($('sc-links').value, { wholePlaylist: $('sc-whole').checked });
    if (!parsed.videos.length && !parsed.playlists.length) { status(parsed.bad.length ? 'No YouTube links found. Check the links and try again.' : 'Paste at least one YouTube link first.'); return; }
    if (!(await checkExt())) { status('Install the Subtitle Grabber extension first (see the steps above), then press Check subtitles again.'); $('sc-ext').scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
    var my = ++run; busy(true);
    var known = {}; items.forEach(function (i) { if (i.id) known[i.id] = 1; });
    var fresh = [];
    var queue = parsed.videos.map(function (id) { return { id: id }; });
    for (var p = 0; p < parsed.playlists.length && my === run; p++) {
      status('Reading playlist ' + (p + 1) + ' of ' + parsed.playlists.length + '…');
      try {
        var pl = await ask({ type: 'playlist', list: parsed.playlists[p] }, 180000);
        pl.videos.forEach(function (v) { queue.push({ id: v.id, title: v.title, playlist: pl.title }); });
      } catch (e) { status('Playlist could not be read: ' + e.message); await sleep(1500); }
    }
    queue.forEach(function (q) {
      if (known[q.id]) return; known[q.id] = 1;
      var it = { source: 'youtube', id: q.id, title: q.title || '', playlist: q.playlist || '', url: 'https://www.youtube.com/watch?v=' + q.id, state: 'busy', stateText: 'Waiting' };
      addItem(it); fresh.push(it);
    });
    show();
    if (parsed.bad.length) status(parsed.bad.length + ' line(s) were not YouTube links and were ignored.');
    var target = $('sc-lang').value, fb = $('sc-order').value;
    for (var i = 0; i < fresh.length && my === run; i++) {
      var it = fresh[i];
      setState(it, 'busy', 'Checking…');
      status('Checking subtitles ' + (i + 1) + ' of ' + fresh.length + '…');
      try {
        var info = await ask({ type: 'videoInfo', id: it.id });
        Object.assign(it, { title: info.title || it.title, channel: info.channel, lengthSeconds: info.lengthSeconds, publishDate: info.publishDate, tracks: info.tracks || [], translations: info.translations || [] });
        it.choice = choose(it, target, fb);
        if (!it.tracks.length) setState(it, 'warn', 'No subtitles', 'YouTube has no subtitles for this video.');
        else if (it.choice === 'skip') setState(it, 'warn', 'Skipped', 'No subtitles in ' + langName(target) + '.');
        else setState(it, 'ok', describe(it, it.choice).type === 'machine-translated' ? 'Machine translation' : 'Ready');
      } catch (e) {
        it.tracks = []; it.choice = 'skip'; setState(it, 'err', 'Not available', e.message);
        if (/limiting/i.test(e.message)) { refreshRow(it); status(e.message); break; }
      }
      refreshRow(it); summary();
      if (i < fresh.length - 1) await sleep(STEP_MS);
    }
    if (my === run) { busy(false); status('Checked ' + fresh.length + ' video(s). Review the choices, then build your corpus.'); }
  }

  function rechoose() {
    var target = $('sc-lang').value, fb = $('sc-order').value;
    items.forEach(function (it) {
      if (it.source !== 'youtube' || !it.tracks || !it.tracks.length) return;
      it.choice = choose(it, target, fb);
      if (it.state !== 'err') setState(it, it.choice === 'skip' ? 'warn' : 'ok', it.choice === 'skip' ? 'Skipped' : (parseKey(it.choice).tlang ? 'Machine translation' : 'Ready'), it.choice === 'skip' ? 'No subtitles in ' + langName(target) + '.' : '');
      refreshRow(it);
    });
    summary();
  }

  /* ---- files ---- */
  async function addFiles(list) {
    var n = 0;
    for (var i = 0; i < list.length; i++) {
      var f = list[i];
      if (f.size > 20 * 1024 * 1024) { status(f.name + ' is larger than 20 MB and was skipped.'); continue; }
      var lines = E.parseSubtitleFile(f.name, await f.text());
      addItem({ source: 'file', id: '', title: f.name.replace(/\.[^.]+$/, ''), fileName: f.name, choice: 'file', got: { choice: 'file', lines: lines, method: 'file' }, state: lines.length ? 'ok' : 'warn', stateText: lines.length ? lines.length + ' lines' : 'Empty' });
      n++;
    }
    show();
    if (n) status(n + ' file(s) added.');
  }
  var SAMPLES = [['sample-episode-1.srt', '1\n00:00:01,000 --> 00:00:03,000\n[Music]\n\n2\n00:00:03,500 --> 00:00:06,000\n>> Where were you last night?\n\n3\n00:00:06,500 --> 00:00:09,000\nI was at home. I told you already.\n\n4\n00:00:09,500 --> 00:00:12,000\n- You never tell me the truth.\n'],
    ['sample-episode-2.vtt', 'WEBVTT\n\n00:00:00.000 --> 00:00:02.500\n♪ ♪\n\n00:00:02.500 --> 00:00:05.000\nThe wedding is next week.\n\n00:00:05.000 --> 00:00:08.000\nThen we have no time to lose. (laughs)\n']];

  /* ---- step 3: build ---- */
  function opts() { return { layout: $('sc-layout').value, removeSound: $('sc-sound').checked, removeSpeakers: $('sc-speak').checked }; }
  function mode() { return document.querySelector('input[name=sc-files]:checked').value; }
  function selected() { return items.filter(function (i) { return i.include && i.choice && i.choice !== 'skip'; }); }

  async function build() {
    var list = selected();
    if (!list.length) { status('Nothing to build. Tick at least one video or add a subtitle file.'); return; }
    var need = list.filter(function (i) { return !(i.got && i.got.choice === i.choice); });
    if (need.some(function (i) { return i.source === 'youtube'; }) && !(await checkExt())) { status('Install the Subtitle Grabber extension first, then build again.'); return; }
    var my = ++run; busy(true);
    var done = 0, total = need.length;
    $('sc-progress').hidden = !total;
    function prog() { $('sc-bar').style.width = (total ? Math.round(done / total * 100) : 100) + '%'; $('sc-prog-text').textContent = done + ' of ' + total + ' downloaded'; }
    prog();
    for (var i = 0; i < need.length && my === run; i++) {
      var it = need[i], c = parseKey(it.choice);
      setState(it, 'busy', 'Downloading…');
      try {
        var r = await ask({ type: 'captions', id: it.id, lang: c.lang, kind: c.kind, tlang: c.tlang || undefined });
        it.got = { choice: it.choice, lines: r.lines, method: r.method };
        setState(it, 'ok', r.lines.length + ' lines');
      } catch (e) {
        setState(it, 'err', 'Failed', e.message);
        if (/limiting/i.test(e.message)) { status(e.message + ' Finished videos are kept.'); break; }
      }
      done++; prog();
      if (i < need.length - 1) await sleep(STEP_MS);
    }
    busy(false);
    compose();
  }

  var output = null;
  function compose() {
    var o = opts(), ready = selected().filter(function (i) { return i.got && i.got.choice === i.choice && i.got.lines.length; });
    if (!ready.length) { $('sc-result').hidden = true; status('No subtitles could be downloaded. See the status column for details.'); return; }
    var target = $('sc-lang').value, style = $('sc-head').value;
    var docs = ready.map(function (it, n) {
      var d = describe(it, it.choice), text = E.cleanLines(it.got.lines, o);
      return { id: it.id, title: it.title, channel: it.channel || '', publishDate: it.publishDate || '', lengthSeconds: it.lengthSeconds || '',
        url: it.url || '', languageLabel: d.label, type: d.type, lang: d.lang || '', from: d.from, method: it.got.method, playlist: it.playlist || '',
        fileName: E.fileName(n, it), source: it.source, original: it.fileName || '', text: text, words: E.countWords(text) };
    }).filter(function (d) { return d.text; });
    var combined = E.combined(docs, style);
    var rows = [['no', 'file', 'source', 'video_id', 'title', 'channel', 'playlist', 'publish_date', 'length_seconds', 'subtitle_language', 'subtitle_type', 'translated_from', 'words', 'url']];
    docs.forEach(function (d, n) { rows.push([n + 1, 'texts/' + d.fileName, d.source === 'file' ? 'file: ' + d.original : 'YouTube', d.id, d.title, d.channel, d.playlist, d.publishDate, d.lengthSeconds, d.lang, d.type, d.from, d.words, d.url]); });
    var words = docs.reduce(function (s, d) { return s + d.words; }, 0);
    output = { docs: docs, combined: combined, csv: '﻿' + E.csv(rows), words: words, target: target };
    var stats = [['Texts', docs.length], ['Words', words.toLocaleString()], ['Machine-translated', docs.filter(function (d) { return d.type === 'machine-translated'; }).length], ['Auto-generated', docs.filter(function (d) { return d.type === 'auto-generated'; }).length]];
    var dl = $('sc-stats'); dl.textContent = '';
    stats.forEach(function (s) { var div = document.createElement('div'), dt = document.createElement('dt'), dd = document.createElement('dd'); dt.textContent = s[0]; dd.textContent = String(s[1]); div.append(dt, dd); dl.appendChild(div); });
    $('sc-preview').value = combined.slice(0, 4000);
    $('sc-download').textContent = mode() === 'one' ? 'Download corpus (TXT)' : 'Download corpus (ZIP)';
    $('sc-result').hidden = false; built = true;
    var failed = selected().length - docs.length;
    status('Corpus ready: ' + docs.length + ' text(s), ' + words.toLocaleString() + ' words.' + (failed ? ' ' + failed + ' selected item(s) had no text; see the status column.' : ''));
  }

  function readme(o) {
    return ['Dailwind Subtitle Corpus', '========================', '',
      'Built with the Dailwind Subtitle Corpus Builder (https://dailwind.com/subtitle-corpus/) on ' + new Date().toISOString().slice(0, 10) + '.',
      'Texts: ' + o.docs.length + '   Words: ' + o.words, 'Requested language: ' + langName(o.target), '',
      'Files', '-----', 'texts/            one UTF-8 text file per video, numbered in playlist/link order',
      'subtitle-corpus_combined.txt   all texts in one file (if chosen)', 'metadata.csv      one row per text: title, channel, date, language, subtitle type, word count, link', '',
      'subtitle_type: uploaded = written by the channel; auto-generated = YouTube speech recognition; machine-translated = YouTube translation.',
      'Auto-generated and machine-translated texts contain errors. Report the type in your method section.', '',
      'Subtitles belong to their owners. Use this corpus for study and research, cite the sources and do not republish full texts.', ''].join('\r\n');
  }
  function save(name, data, type) {
    var url = URL.createObjectURL(new Blob([data], { type: type }));
    var a = document.createElement('a'); a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
  }
  function download() {
    if (!output) return;
    var m = mode(), stamp = new Date().toISOString().slice(0, 10);
    if (m === 'one') { save('subtitle-corpus-' + stamp + '.txt', '﻿' + output.combined, 'text/plain;charset=utf-8'); return; }
    var files = output.docs.map(function (d) { return { name: 'subtitle-corpus/texts/' + d.fileName, data: E.header(d, $('sc-head').value) + d.text + ($('sc-head').value === 'tags' ? '\n</text>\n' : '\n') }; });
    if (m === 'both') files.push({ name: 'subtitle-corpus/subtitle-corpus_combined.txt', data: output.combined + '\n' });
    files.push({ name: 'subtitle-corpus/metadata.csv', data: output.csv }, { name: 'subtitle-corpus/README.txt', data: readme(output) });
    save('subtitle-corpus-' + stamp + '.zip', E.zip(files), 'application/zip');
  }

  function busy(on) {
    ['sc-check', 'sc-build', 'sc-clear', 'sc-sample'].forEach(function (id) { $(id).disabled = on; });
    $('sc-stop').hidden = !on;
  }

  function init() {
    if (!E) { status('The page did not load completely. Refresh to try again.'); return; }
    var sel = $('sc-lang');
    LANGS.forEach(function (l) { sel.add(new Option(l[1], l[0])); });
    sel.value = 'en';
    $('sc-check').addEventListener('click', check);
    $('sc-recheck').addEventListener('click', function () { checkExt().then(function (ok) { status(ok ? 'Extension connected. Paste your links.' : 'Still not found. Make sure it is turned on in chrome://extensions, then refresh this page.'); }); });
    $('sc-lang').addEventListener('change', rechoose);
    $('sc-order').addEventListener('change', rechoose);
    $('sc-files').addEventListener('change', function (e) { addFiles(e.target.files).then(function () { e.target.value = ''; }); });
    $('sc-sample').addEventListener('click', function () { addFiles(SAMPLES.map(function (s) { return new File([s[1]], s[0], { type: 'text/plain' }); })); });
    $('sc-clear').addEventListener('click', function () { run++; items = []; output = null; built = false; $('sc-rows').textContent = ''; $('sc-result').hidden = true; $('sc-progress').hidden = true; show(); status('Cleared.'); });
    $('sc-all').addEventListener('change', function (e) { items.forEach(function (i) { i.include = e.target.checked; if (i.row) { i.row.querySelector('input').checked = i.include; i.row.classList.toggle('sc-off', !i.include); } }); summary(); });
    $('sc-build').addEventListener('click', build);
    $('sc-stop').addEventListener('click', function () { run++; busy(false); status('Stopped. Finished videos are kept; press the button again to continue.'); });
    $('sc-download').addEventListener('click', download);
    $('sc-meta').addEventListener('click', function () { if (output) save('subtitle-corpus-metadata.csv', output.csv, 'text/csv;charset=utf-8'); });
    ['sc-layout', 'sc-head', 'sc-sound', 'sc-speak'].forEach(function (id) { $(id).addEventListener('change', function () { if (built) compose(); }); });
    document.querySelectorAll('input[name=sc-files]').forEach(function (r) { r.addEventListener('change', function () { if (built) $('sc-download').textContent = mode() === 'one' ? 'Download corpus (TXT)' : 'Download corpus (ZIP)'; }); });
    show();
    checkExt().then(function (ok) { status(ok ? 'Extension connected. Paste your links to begin.' : 'Install the free extension to collect YouTube subtitles, or add subtitle files you already have.'); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
