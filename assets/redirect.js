'use strict';
// Moved pages: follow the page's meta refresh target immediately and keep any #fragment.
(()=>{const meta=document.querySelector('meta[http-equiv="refresh"]');const match=meta&&/url=(.+)$/i.exec(meta.getAttribute('content')||'');if(!match)return;const target=new URL(match[1].trim(),location.href);if(target.origin!==location.origin)return;if(!target.hash&&location.hash)target.hash=location.hash;location.replace(target.href);})();
