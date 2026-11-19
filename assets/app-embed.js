/* App mode for the Dailwind Toolkits Android app.
   A tool page opened with ?app=1 (inside the app) hides website-only parts
   (back links, footers, site menu) and hands navigation, links and file
   downloads to the app through postMessage. On the website nothing changes. */
(function () {
  'use strict';
  var on = new URLSearchParams(location.search).get('app') === '1';
  try {
    if (on) sessionStorage.setItem('dwApp', '1');
    else on = sessionStorage.getItem('dwApp') === '1';
  } catch (e) { /* storage blocked: rely on the query only */ }
  if (!on) return;
  document.documentElement.classList.add('dw-app');

  var framed = window.parent && window.parent !== window;
  function tell(msg) { if (framed) { msg.source = 'dailwind-tool'; window.parent.postMessage(msg, '*'); return true; } return false; }
  var here = (location.pathname.match(/^\/([a-z0-9-]+)\//) || [])[1] || '';

  function route(url) {
    if (/^(mailto|tel):/i.test(url.protocol)) return { type: 'open-external', url: url.href };
    if (url.origin !== location.origin) return { type: 'open-external', url: url.href };
    var p = url.pathname;
    if (p === '/' || p === '/index.html' || /^\/(toolkits|toolkit)\/?$/.test(p)) return { type: 'go-home' };
    var m = p.match(/^\/([a-z0-9-]+)\/(?:index\.html)?$/);
    if (m && m[1] !== here && !/^(assets|articles|apps|arslan-tahir|manage)$/.test(m[1])) return { type: 'open-tool', slug: m[1] };
    if (m && m[1] === here) return null; // same tool: stay
    if (/\.html$/.test(p) || /^\/(articles|apps|arslan-tahir)\//.test(p)) return { type: 'open-external', url: url.href };
    return null;
  }

  // Links: tools open in the app, everything else in the phone's browser.
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest && e.target.closest('a[href]');
    if (!a || a.hasAttribute('download') || e.defaultPrevented) return;
    var href = a.getAttribute('href') || '';
    if (href.charAt(0) === '#' || /^(blob|data|javascript):/i.test(href)) return;
    var url;
    try { url = new URL(a.href); } catch (err) { return; }
    var msg = route(url);
    if (msg && tell(msg)) e.preventDefault();
  }, true);

  // Downloads: Android's web view cannot save blob/data links, so pass the file to the app.
  // Remember each blob behind a blob: link (the page's security policy blocks fetching blob: URLs).
  var blobs = new Map();
  var makeUrl = URL.createObjectURL.bind(URL);
  URL.createObjectURL = function (obj) { var u = makeUrl(obj); if (obj instanceof Blob) blobs.set(u, obj); return u; };
  function dataUrlToBlob(href) {
    var comma = href.indexOf(','), meta = href.slice(5, comma), body = href.slice(comma + 1);
    var mime = meta.split(';')[0] || 'application/octet-stream';
    if (/;base64/i.test(meta)) { var bin = atob(body), arr = new Uint8Array(bin.length); for (var i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i); return new Blob([arr], { type: mime }); }
    return new Blob([decodeURIComponent(body)], { type: mime });
  }
  function sendFile(a) {
    var href = a.href, name = a.getAttribute('download') || 'download';
    if (!framed) return false;
    var blob = /^blob:/i.test(href) ? blobs.get(href) : /^data:/i.test(href) ? dataUrlToBlob(href) : null;
    if (!blob) return false;
    var fr = new FileReader();
    fr.onload = function () {
      var s = String(fr.result);
      tell({ type: 'download', name: name, mime: blob.type || 'application/octet-stream', base64: s.slice(s.indexOf(',') + 1) });
    };
    fr.onerror = function () { tell({ type: 'download-failed', name: name }); };
    fr.readAsDataURL(blob);
    return true;
  }
  var nativeClick = HTMLAnchorElement.prototype.click;
  HTMLAnchorElement.prototype.click = function () {
    if (this.hasAttribute('download') && sendFile(this)) return;
    return nativeClick.apply(this, arguments);
  };
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest && e.target.closest('a[download]');
    if (a && /^(blob|data):/i.test(a.href) && sendFile(a)) e.preventDefault();
  }, true);
  // Free remembered blobs a minute after the page releases them.
  var revoke = URL.revokeObjectURL.bind(URL);
  URL.revokeObjectURL = function (u) { setTimeout(function () { blobs.delete(u); revoke(u); }, 60000); };

  // Hide website-only parts once the page is ready.
  function tidy() {
    document.querySelectorAll('header a[href], .language-top a[href], .prep-top a[href], .arc-header a[href], .system-bar a[href]').forEach(function (a) {
      try { var m = route(new URL(a.href)); if (m && m.type === 'go-home') a.classList.add('dw-app-hide'); } catch (e) { /* ignore */ }
    });
    tell({ type: 'ready', slug: here, title: document.title.replace(/\s*\|\s*Dailwind.*$/, '') });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', tidy); else tidy();
})();
