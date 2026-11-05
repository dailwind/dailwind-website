'use strict';
// Clickjacking guard. GitHub Pages cannot send X-Frame-Options or a CSP
// frame-ancestors header, and browsers ignore frame-ancestors in a meta CSP.
// Same-origin framing stays allowed; any cross-origin framer gets a blank page.
(()=>{
 let framed=false;
 try{framed=window.top!==window.self&&window.top.location.origin!==window.location.origin;}catch(error){framed=true;}
 if(!framed)return;
 document.documentElement.style.setProperty('display','none','important');
 try{window.top.location.replace(window.location.href);}catch(error){}
})();
