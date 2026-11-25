/* "Cite this tool": adds a Cite button to the tool header and a dialog with
   ready-to-copy APA 7, MLA 9, Chicago 17, Harvard and BibTeX references.
   Tool details come from <div id="dw-cite" data-tool data-url data-year>, added at build time. */
(function () {
  'use strict';
  var data = document.getElementById('dw-cite');
  if (!data) return;
  var tool = data.getAttribute('data-tool');
  var url = data.getAttribute('data-url');
  var year = data.getAttribute('data-year') || '2026';
  if (!tool || !url) return;

  // Both authors; the collection is archived on Zenodo.
  var APA_AUTHORS = 'Tahir, A., & Tahir, A.';
  var HARVARD_AUTHORS = 'Tahir, A. and Tahir, A.';
  var FULL_AUTHORS = 'Tahir, Arslan, and Adnan Tahir';
  var COLLECTION = 'Dailwind Research Tools';
  var PUBLISHER = 'Dailwind App Studio';
  var DOI = '10.5281/zenodo.24363599';
  var DOI_URL = 'https://doi.org/' + DOI;

  var now = new Date();
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var MLA_MONTHS = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'June', 'July', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'];
  var d = now.getDate(), m = now.getMonth(), y = now.getFullYear();
  var iso = y + '-' + String(m + 1).padStart(2, '0') + '-' + String(d).padStart(2, '0');
  var key = 'tahir' + year + tool.toLowerCase().replace(/[^a-z0-9]+/g, '');

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // Each style: [label, plain text, html with italics]
  var styles = [
    ['APA 7',
      APA_AUTHORS + ' (' + year + '). ' + tool + ' [Computer software]. In ' + COLLECTION + '. ' + PUBLISHER + '. ' + DOI_URL,
      esc(APA_AUTHORS) + ' (' + year + '). <i>' + esc(tool) + '</i> [Computer software]. In <i>' + COLLECTION + '</i>. ' + esc(PUBLISHER) + '. ' + DOI_URL],
    ['MLA 9',
      FULL_AUTHORS + '. ' + tool + '. ' + COLLECTION + ', ' + PUBLISHER + ', ' + year + ', ' + DOI_URL + '. Accessed ' + d + ' ' + MLA_MONTHS[m] + ' ' + y + '.',
      esc(FULL_AUTHORS) + '. <i>' + esc(tool) + '</i>. <i>' + COLLECTION + '</i>, ' + esc(PUBLISHER) + ', ' + year + ', ' + DOI_URL + '. Accessed ' + d + ' ' + MLA_MONTHS[m] + ' ' + y + '.'],
    ['Chicago 17',
      FULL_AUTHORS + '. ' + tool + '. In ' + COLLECTION + '. ' + PUBLISHER + ', ' + year + '. Computer software. ' + DOI_URL + '.',
      esc(FULL_AUTHORS) + '. <i>' + esc(tool) + '</i>. In <i>' + COLLECTION + '</i>. ' + esc(PUBLISHER) + ', ' + year + '. Computer software. ' + DOI_URL + '.'],
    ['Harvard',
      HARVARD_AUTHORS + ' (' + year + ') ' + tool + ' [Computer software]. In: ' + COLLECTION + '. ' + PUBLISHER + '. Available at: ' + DOI_URL + ' (Accessed: ' + d + ' ' + MONTHS[m] + ' ' + y + ').',
      esc(HARVARD_AUTHORS) + ' (' + year + ') <i>' + esc(tool) + '</i> [Computer software]. In: <i>' + COLLECTION + '</i>. ' + esc(PUBLISHER) + '. Available at: ' + DOI_URL + ' (Accessed: ' + d + ' ' + MONTHS[m] + ' ' + y + ').'],
    ['BibTeX',
      '@software{' + key + ',\n  author    = {Tahir, Arslan and Tahir, Adnan},\n  title     = {' + tool.replace(/&/g, '\\&') + '},\n  booktitle = {' + COLLECTION + '},\n  year      = {' + year + '},\n  publisher = {' + PUBLISHER + '},\n  doi       = {' + DOI + '},\n  url       = {' + url + '},\n  urldate   = {' + iso + '}\n}',
      null]
  ];

  // Dialog
  var dlg = document.createElement('dialog');
  dlg.className = 'dw-cite-dialog';
  dlg.setAttribute('aria-labelledby', 'dw-cite-title');
  var html = '<div class="dw-cite-panel">' +
    '<button type="button" class="dw-cite-close" aria-label="Close">&times;</button>' +
    '<p class="dw-cite-eyebrow">CITE THIS TOOL</p>' +
    '<h2 id="dw-cite-title">' + esc(tool) + '</h2>' +
    '<p class="dw-cite-lede">Used this tool in your research, thesis or article? Please cite it so others can find and check your method.</p>' +
    '<div class="dw-cite-list">';
  styles.forEach(function (s, i) {
    html += '<section class="dw-cite-item"><div class="dw-cite-row"><h3>' + s[0] + '</h3>' +
      '<button type="button" class="dw-cite-copy" data-i="' + i + '">Copy</button></div>' +
      (s[2] ? '<p class="dw-cite-text">' + s[2] + '</p>' : '<pre class="dw-cite-text dw-cite-code">' + esc(s[1]) + '</pre>') +
      '</section>';
  });
  html += '</div><p class="dw-cite-note">Archived on Zenodo: <a href="' + DOI_URL + '" target="_blank" rel="noopener">doi:' + DOI + '</a>. MLA, Harvard and BibTeX include today\'s date as the access date. Check the reference against your department\'s style guide.</p>' +
    '<p class="dw-cite-status" role="status" aria-live="polite"></p></div>';
  dlg.innerHTML = html;
  document.body.appendChild(dlg);
  var status = dlg.querySelector('.dw-cite-status');

  function open() {
    if (typeof dlg.showModal === 'function') dlg.showModal();
    else dlg.setAttribute('open', '');
  }
  function close() {
    if (typeof dlg.close === 'function') dlg.close();
    else dlg.removeAttribute('open');
  }

  function copy(i, btn) {
    var s = styles[i];
    var done = function (ok) {
      status.textContent = ok ? s[0] + ' reference copied.' : 'Copy failed. Select the text and copy it manually.';
      if (ok) {
        btn.textContent = 'Copied';
        setTimeout(function () { btn.textContent = 'Copy'; }, 1600);
      }
    };
    try {
      if (s[2] && window.ClipboardItem && navigator.clipboard && navigator.clipboard.write) {
        var item = new ClipboardItem({
          'text/plain': new Blob([s[1]], { type: 'text/plain' }),
          'text/html': new Blob([s[2]], { type: 'text/html' })
        });
        navigator.clipboard.write([item]).then(function () { done(true); }, function () { fallback(); });
        return;
      }
    } catch (e) { /* use fallback */ }
    fallback();
    function fallback() {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(s[1]).then(function () { done(true); }, function () { legacy(); });
      } else legacy();
    }
    function legacy() {
      var ta = document.createElement('textarea');
      ta.value = s[1];
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      dlg.appendChild(ta);
      ta.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      dlg.removeChild(ta);
      done(ok);
    }
  }

  dlg.addEventListener('click', function (e) {
    var t = e.target;
    if (t === dlg || t.closest('.dw-cite-close')) { close(); return; }
    var b = t.closest('.dw-cite-copy');
    if (b) copy(+b.getAttribute('data-i'), b);
  });

  // Button in the tool's header; a floating button if the page has no header.
  var btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'dw-cite-open';
  btn.setAttribute('aria-haspopup', 'dialog');
  btn.innerHTML = '<span aria-hidden="true">&#10077;</span> Cite';
  btn.title = 'Cite this tool';
  btn.addEventListener('click', open);
  var end = document.querySelector('.dw-site-header .dsh-end');
  var header = document.querySelector('body > header, header');
  if (end) {
    end.insertBefore(btn, end.firstChild);
  } else if (header) {
    header.appendChild(btn);
  } else {
    btn.classList.add('is-floating');
    document.body.appendChild(btn);
  }
})();
