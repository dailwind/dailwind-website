/* Toolkit top bar: one ✕ button that goes back to where the visitor came from on
   Dailwind (or to the Toolkits page when the tool was opened directly). */
(function () {
  'use strict';
  var bar = document.querySelector('.dw-site-header');
  if (!bar) return;
  document.body.classList.add('has-site-header');
  var close = bar.querySelector('.dsh-close');
  if (close) close.addEventListener('click', function (e) {
    var from = '';
    try { from = document.referrer ? new URL(document.referrer).origin : ''; } catch (x) {}
    if (from === location.origin && history.length > 1) { e.preventDefault(); history.back(); }
  });
})();
