/* Bridge between the Dailwind Subtitle Corpus Builder page and the extension.
   The page posts {source:'dailwind-page', id, payload}; the answer comes back as
   {source:'dailwind-ext', id, result} on the same window. Only runs on the
   Subtitle Corpus Builder page (and localhost for testing). */
(function () {
  'use strict';
  var VERSION = chrome.runtime.getManifest().version;
  var origin = location.origin;

  function reply(id, result, error) {
    window.postMessage({ source: 'dailwind-ext', id: id, result: result, error: error || null }, origin);
  }

  window.addEventListener('message', function (e) {
    if (e.source !== window || !e.data || e.data.source !== 'dailwind-page') return;
    var id = e.data.id;
    var payload = e.data.payload || {};
    if (payload.type === 'ping') { reply(id, { ok: true, version: VERSION }); return; }
    try {
      chrome.runtime.sendMessage(payload, function (res) {
        var err = chrome.runtime.lastError;
        if (err) reply(id, null, err.message || 'The extension did not answer.');
        else if (!res) reply(id, null, 'The extension did not answer.');
        else if (res.error) reply(id, null, res.error);
        else reply(id, res.result);
      });
    } catch (ex) {
      reply(id, null, 'The extension was updated or reloaded. Refresh this page and try again.');
    }
  });

  // Let the page know the extension is installed.
  function hello() { window.postMessage({ source: 'dailwind-ext', type: 'hello', version: VERSION }, origin); }
  hello();
  document.addEventListener('DOMContentLoaded', hello);
})();
