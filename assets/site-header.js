/* Toolkit top bar: phone menu, and ✕ goes back to where the visitor came from on
   Dailwind (or to the Toolkits page when the tool was opened directly). */
(function () {
  'use strict';
  var bar = document.querySelector('.dw-site-header');
  if (!bar) return;
  document.body.classList.add('has-site-header');
  var menu = bar.querySelector('.dsh-menu'), nav = bar.querySelector('.dsh-nav');
  function set(open) {
    if (!menu || !nav) return;
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Close menu' : 'Menu');
    nav.classList.toggle('open', open);
    document.documentElement.style.overflow = open ? 'hidden' : '';
  }
  if (menu) menu.addEventListener('click', function () { set(menu.getAttribute('aria-expanded') !== 'true'); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && menu && menu.getAttribute('aria-expanded') === 'true') { set(false); menu.focus(); } });
  matchMedia('(min-width: 901px)').addEventListener('change', function (e) { if (e.matches) set(false); });
  var close = bar.querySelector('.dsh-close');
  if (close) close.addEventListener('click', function (e) {
    var from = '';
    try { from = document.referrer ? new URL(document.referrer).origin : ''; } catch (x) {}
    if (from === location.origin && history.length > 1) { e.preventDefault(); history.back(); }
  });
})();
