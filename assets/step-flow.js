/* Step-by-step progress for every Dailwind toolkit.
   A clear 1 → 2 → 3 bar at the top of each workspace. It follows what the user does
   (adds files or text, runs the tool, downloads or copies) and always shows the next
   step. Tapping a step jumps to the place where that step happens. Nothing leaves the tab. */
(function () {
  'use strict';
  var slug = location.pathname.split('/').filter(function (x) { return x && x !== 'index.html'; }).pop();
  // t: short titles · h: hints · run: what counts as step 2 ("live" = updates by itself)
  // end: what finishes step 3 ("dl" = a download, or a selector to click, "run" = done after step 2)
  var C = {
    'corpus-toolkit': { t: ['Add your files', 'Choose an analysis & run', 'Export results'], h: ['Add target files, paste text or try the sample.', 'Pick a tool, enter a word if needed, press Run.', 'Download TXT, CSV or JSON.'], run: '#run', end: 'dl' },
    'stylistic-toolkit': { t: ['Add your text', 'Choose genre & analyze', 'Save your work'], h: ['Paste a passage or import a file.', 'Set the genre, then find candidates.', 'Save JSON, CSV or a Word report.'], run: '#analyze', end: 'dl' },
    'corpus-cleaner': { t: ['Add your files', 'Choose rules & clean', 'Download'], h: ['Add files, paste text or try the sample.', 'Pick cleaning rules, then clean.', 'Download a document or the whole ZIP.'], run: '#prep-run', end: 'dl' },
    'file-converter': { t: ['Add your files', 'Convert', 'Download'], h: ['PDF with selectable text, Word, ODT or TXT.', 'Convert the selected files.', 'Choose TXT, Word or PDF and download.'], run: '#prep-run', end: 'dl' },
    'corpus-merger': { t: ['Add your files', 'Merge', 'Download'], h: ['Add files and put them in order.', 'Choose a separator, then merge.', 'Download the combined file.'], run: '#prep-run', end: 'dl' },
    'english-ocr': { t: ['Open scans', 'Run English OCR', 'Download text'], h: ['Open PDFs or page images.', 'Check the settings, then run OCR.', 'Download TXT, Word or a ZIP.'], run: '#ocr-run', end: 'dl' },
    'pdf-tools': { t: ['Open PDF', 'Split or compress', 'Download'], h: ['Open one PDF or several.', 'Choose parts or compression, then run.', 'Download each PDF or one ZIP.'], run: '#pdf-run', end: 'dl' },
    'image-tools': { t: ['Choose task & files', 'Run', 'Download'], h: ['Pick a task, then open a PDF or images.', 'Check the settings and run.', 'Download the images or PDF.'], run: '#media-run', end: 'dl' },
    'metadata-studio': { t: ['Add your files', 'Check the details', 'Download Excel'], h: ['Add the files of your collection.', 'Review genres, sources and counts.', 'Download Excel, CSV or JSON.'], run: 'live', end: 'dl' },
    'subtitle-corpus': { t: ['Add videos', 'Check subtitles', 'Download corpus'], h: ['Paste YouTube links or add subtitle files.', 'Check which subtitles each video has.', 'Build and download your corpus.'], run: '#sc-check,#sc-build', end: 'dl' },
    'lexical-metrics': 'lab', 'morphology-explorer': 'lab', 'syntax-explorer': 'lab', 'sentiment-studio': 'lab', 'register-profile': 'lab', 'forensic-compare': 'lab',
    'readability-studio': { t: ['Add your texts', 'Analyze', 'Download'], h: ['Paste texts under ### headings or add files.', 'Compare the formulas side by side.', 'Download the CSV table.'], run: '#lab-run', end: 'dl' },
    'stylometry-lab': { t: ['Add 3+ texts', 'Compare style', 'Download'], h: ['Each text under its own ### title, or add files.', 'Choose words and a Delta measure.', 'Download distances or z-scores.'], run: '#lab-run', end: 'dl' },
    'parallel-aligner': { t: ['Add both texts', 'Align sentences', 'Download'], h: ['The original and its translation.', 'Align, then fix rows marked “check”.', 'Download TSV, CSV or TMX.'], run: '#lab-run', end: 'dl' },
    'qualitative-coder': { t: ['Codebook & responses', 'Start coding', 'Export'], h: ['Write codes; one response per line.', 'Code, then accept or reject suggestions.', 'Export the coded CSV or project.'], run: '#lab-run', end: 'dl' },
    'grammar-checker': { t: ['Add your text', 'Fix suggestions', 'Copy your text'], h: ['Write, paste or add a file.', 'Click an underline or a card to fix it.', 'Copy the polished text.'], run: 'live', end: '#wt-copy' },
    'ai-text-detector': { t: ['Add your text', 'Estimate', 'Read the result'], h: ['Paste at least 40 words.', 'Press Estimate AI-likeness.', 'One signal, never proof.'], run: '#wt-run', end: 'run' },
    'text-humanizer': { t: ['Add your text', 'Choose a tone & rewrite', 'Copy the result'], h: ['Paste academic or AI-sounding prose.', 'Pick a tone and rewrite.', 'Compare, edit and copy.'], run: '#wt-run', end: '#wt-copy' },
    'text-statistics': { t: ['Add your text', 'Read the counts', 'Export CSV'], h: ['Paste, type or add files.', 'Counts and times update as you type.', 'Check keywords and export.'], run: 'live', end: 'dl' },
    'case-converter': { t: ['Add your text', 'Pick a case', 'Copy the result'], h: ['Paste your text.', 'Choose a case or a clean-up.', 'Copy the converted text.'], run: 'live', end: '#tt-copy' },
    'citation-generator': { t: ['Pick style & source', 'Check the fields', 'Copy or download'], h: ['Choose a style; look up a DOI.', 'Complete anything missing.', 'Copy it or download your list.'], run: '#cg-add,#cg-lookup', end: '#cg-copy,#cg-copyall,#cg-export' },
    'image-converter': { t: ['Add images', 'Choose format & convert', 'Download'], h: ['One image or many.', 'Pick a format and quality.', 'Download files or one ZIP.'], run: '#mt-run', end: 'dl' },
    'image-resizer': { t: ['Add images', 'Choose size & resize', 'Download'], h: ['One image or many.', 'Pixels, percent, KB or a preset.', 'Download files or one ZIP.'], run: '#mt-run', end: 'dl' },
    'passport-photo-maker': { t: ['Document & photo', 'Line up the face', 'Download'], h: ['Pick the country and add a photo.', 'Fit head and eyes to the guides.', 'Download the photo or print sheet.'], run: 'live', end: 'dl' },
    'text-to-speech': { t: ['Add text & voice', 'Play', 'Look up words'], h: ['Paste text and pick a voice.', 'Listen and follow the highlight.', 'Find any word in IPA.'], run: '#ts-play', end: 'run' }
  };
  var LAB = { t: ['Add your text', 'Analyze', 'Download'], h: ['Paste text, add files or try a sample.', 'Review the evidence and method notes.', 'Download CSV tables or the JSON report.'], run: '#lab-run', end: 'dl' };
  var cfg = C[slug] === 'lab' ? LAB : C[slug];
  if (!cfg) return;

  var state = [false, false, false], picked = false, bar, items, now, fill;
  var $ = function (s) { return document.querySelector(s); };
  function visible(el) { return el && el.offsetParent !== null && getComputedStyle(el).visibility !== 'hidden'; }
  function main() { return $('main') || document.body; }

  function hasInput() {
    if (picked) return true;
    var boxes = main().querySelectorAll('textarea');
    for (var i = 0; i < boxes.length; i++) if (visible(boxes[i]) && boxes[i].value.trim() && !boxes[i].readOnly) return true;
    if (slug === 'citation-generator') {
      var f = main().querySelectorAll('input[type=text],input[type=search],input:not([type])');
      for (var j = 0; j < f.length; j++) if (visible(f[j]) && f[j].value.trim()) return true;
    }
    return false;
  }
  function downloadReady() {
    if (cfg.end === 'dl') {
      var d = document.querySelectorAll('.dl-btn');
      for (var i = 0; i < d.length; i++) if (!d[i].disabled && d[i].getAttribute('aria-disabled') !== 'true' && visible(d[i]) && !/extension/i.test(d[i].textContent)) return true;
      return false;
    }
    return state[1];
  }

  function build() {
    bar = document.createElement('nav');
    bar.className = 'dw-steps';
    bar.setAttribute('aria-label', 'Steps');
    var ol = document.createElement('ol');
    var track = document.createElement('span'); track.className = 'dw-steps-track'; track.setAttribute('aria-hidden', 'true');
    fill = document.createElement('span'); fill.className = 'dw-steps-fill'; track.appendChild(fill);
    ol.appendChild(track);
    items = cfg.t.map(function (title, i) {
      var li = document.createElement('li');
      var b = document.createElement('button');
      b.type = 'button';
      b.innerHTML = '<span class="dw-step-dot" aria-hidden="true"><i>' + (i + 1) + '</i></span><span class="dw-step-text"><b></b><small></small></span>';
      b.querySelector('b').textContent = title;
      b.querySelector('small').textContent = cfg.h[i];
      b.addEventListener('click', function () { go(i); });
      li.appendChild(b);
      ol.appendChild(li);
      return li;
    });
    bar.appendChild(ol);
    now = document.createElement('p');
    now.className = 'dw-step-now';
    now.setAttribute('role', 'status');
    now.setAttribute('aria-live', 'polite');
    bar.appendChild(now);

    var old = $('.language-steps');
    var anchor = old || $('.prep-main > .prep-title') || $('#workspace > .workspace-heading') || $('#main > section.intro') || $('.language-top');
    if (old) { old.hidden = true; old.parentNode.insertBefore(bar, old); }
    else if (anchor) anchor.insertAdjacentElement('afterend', bar);
    else main().insertBefore(bar, main().firstChild);
    document.body.classList.add('has-dw-steps');
  }

  function target(i) {
    if (i === 0) {
      return $('#add-target,#prep-add,#ocr-add,#pdf-open,#media-open,#meta-open,#mt-drop') ||
        Array.prototype.filter.call(main().querySelectorAll('textarea'), visible)[0] || $('label.language-upload') || main().querySelector('input[type=file]');
    }
    if (i === 1) {
      if (cfg.run !== 'live') { var r = Array.prototype.filter.call(document.querySelectorAll(cfg.run), visible)[0]; if (r) return r; }
      return $('.language-settings,.prep-settings,#prep-settings,#query-form,.mt-row,#input') || main().querySelector('select,input[type=range]');
    }
    var d = Array.prototype.filter.call(document.querySelectorAll(cfg.end === 'dl' ? '.dl-btn' : (cfg.end === 'run' ? '#lab-results,[id$=results],[id$=result]' : cfg.end)), visible);
    return d.filter(function (x) { return !x.disabled; })[0] || d[0];
  }
  function go(i) {
    var el = target(i);
    if (!el) return;
    el.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
    el.classList.add('dw-step-flash');
    setTimeout(function () { el.classList.remove('dw-step-flash'); }, 1600);
    if (/^(BUTTON|TEXTAREA|INPUT|SELECT|A)$/.test(el.tagName) && !el.disabled) try { el.focus({ preventScroll: true }); } catch (e) {}
  }

  var last = '', guideClosed = false;
  function render() {
    // The quick-start guide's long step cards repeat this bar: start them folded (still one tap away).
    if (!guideClosed) { var g = $('.guide-details'); if (g) { g.open = false; guideClosed = true; } }
    state[0] = state[0] || hasInput();
    if (cfg.run === 'live' && state[0]) state[1] = true;
    var ready = state[0] && state[1] && downloadReady();
    if (cfg.end === 'run' && state[1]) state[2] = true;
    var cur = state[0] ? (state[1] ? (state[2] ? 3 : 2) : 1) : 0;
    var key = state.join() + cur + ready;
    if (key === last) return;
    last = key;
    items.forEach(function (li, i) {
      li.className = state[i] ? 'is-done' : (i === cur ? 'is-current' + (i === 2 && ready ? ' is-ready' : '') : 'is-next');
      var b = li.firstChild;
      if (i === cur) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
    });
    fill.style.width = (cur >= 2 ? 100 : cur === 1 ? 50 : 0) + '%';
    now.textContent = cur >= 3 ? 'All done. You can change anything and run again.'
      : 'Step ' + (cur + 1) + ' of 3 · ' + (cur === 2 && ready && cfg.end === 'dl' ? 'Your download is ready.' : cfg.h[cur]);
    bar.dataset.step = String(cur + 1);
  }

  function hook() {
    document.addEventListener('change', function (e) {
      if (e.target && e.target.type === 'file' && e.target.files && e.target.files.length) { picked = true; render(); }
    });
    document.addEventListener('drop', function (e) { if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length) { picked = true; setTimeout(render, 300); } });
    document.addEventListener('input', function () { setTimeout(render, 0); });
    document.addEventListener('click', function (e) {
      var b = e.target.closest && e.target.closest('button,a,[role=button],.mt-drop');
      if (!b || bar.contains(b)) return;
      if (/sample|demo/i.test(b.id || '') || /try (a |the |two )?sample|try with sample/i.test(b.textContent || '')) { picked = true; setTimeout(render, 600); }
      if (cfg.run !== 'live' && b.matches(cfg.run) && !b.disabled) { state[0] = true; state[1] = true; }
      if (state[1] && (cfg.end === 'dl' ? b.classList.contains('dl-btn') : (cfg.end !== 'run' && b.matches(cfg.end)))) state[2] = true;
      setTimeout(render, 0);
      setTimeout(render, 900);
    }, true);
    setInterval(function () { if (!document.hidden) render(); }, 1200);
  }

  function start() { build(); hook(); render(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
