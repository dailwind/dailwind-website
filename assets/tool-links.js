'use strict';
/* Remembers recently used tools in this browser only (localStorage, max 6) for the "Recently used" row on /toolkits/. */
(()=>{const slug=(document.querySelector('link[rel=canonical]')?.href||location.pathname).replace(/\/+$/,'').split('/').pop();const name=(document.querySelector('h1')?.textContent||'').trim();if(!slug||!name)return;
 try{const K='dailwind:recentTools',l=JSON.parse(localStorage.getItem(K)||'[]').filter(t=>t&&t.slug!==slug);l.unshift({slug,name,at:Date.now()});localStorage.setItem(K,JSON.stringify(l.slice(0,6)));}catch{}})();
