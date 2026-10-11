'use strict';
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const escapeText = v => String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const menu=$('.menu-toggle');
const navigation=$('#navigation');
function setMenu(open,returnFocus=false){
 if(!menu||!navigation)return;
 menu.setAttribute('aria-expanded',String(open));
 navigation.classList.toggle('open',open);
 const label=$('[data-menu-label]'),symbol=$('[data-menu-symbol]');
 if(label)label.textContent=open?'Close':'Menu';
 if(symbol)symbol.textContent=open?'×':'＋';
 if(returnFocus)menu.focus();
}
menu?.addEventListener('click',()=>setMenu(menu.getAttribute('aria-expanded')!=='true'));
document.addEventListener('keydown',e=>{
 if(e.key==='Escape'&&menu?.getAttribute('aria-expanded')==='true')setMenu(false,true);
});
$$('#navigation a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
document.addEventListener('click',e=>{
 if(menu?.getAttribute('aria-expanded')==='true'&&!e.target.closest('.header'))setMenu(false);
});
const desktopNavigation=window.matchMedia('(min-width: 901px)');
desktopNavigation.addEventListener('change',e=>{if(e.matches)setMenu(false)});
$('#copy-citation')?.addEventListener('click',async()=>{try{await navigator.clipboard.writeText($('#citation-text').textContent);$('#copy-status').textContent='Citation copied.'}catch{const range=document.createRange();range.selectNodeContents($('#citation-text'));const s=window.getSelection();s.removeAllRanges();s.addRange(range);$('#copy-status').textContent='Citation selected. Use your browser’s copy command.'}});
$('#contact-form')?.addEventListener('submit',e=>{e.preventDefault();const form=e.currentTarget;const name=$('#contact-name').value.trim(),message=$('#contact-message').value.trim();if(!name){$('#contact-name').setCustomValidity('Please enter your name.');$('#contact-name').reportValidity();return}if(message.length<10){$('#contact-message').setCustomValidity('Please write at least 10 characters.');$('#contact-message').reportValidity();return}if(!form.reportValidity())return;const subject='Dailwind Studio: '+$('#contact-topic').value;const body='Name: '+name+'\n\n'+message;window.location.href='mailto:arslan@dailwind.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);$('#contact-status').textContent='Your email application has been requested. Review and send the draft there; this website has not sent a message.'});
['#contact-name','#contact-message'].forEach(s=>$(s)?.addEventListener('input',()=>$(s).setCustomValidity('')));
const consentKey='dailwind-privacy-v1';let consent;try{consent=JSON.parse(localStorage.getItem(consentKey)||'null')}catch{}
let gaLoaded=false;
function analyticsId(){const id=window.DAILWIND_ANALYTICS_ID||'';return /^G-[A-Z0-9]+$/.test(id)?id:''}
function enableAnalytics(){const id=analyticsId();if(!id||!consent?.analytics||gaLoaded)return;gaLoaded=true;window.dataLayer=window.dataLayer||[];window.gtag=function(){window.dataLayer.push(arguments)};window.gtag('js',new Date());window.gtag('config',id,{allow_google_signals:false,allow_ad_personalization_signals:false});const s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(id);document.head.append(s)}
const privacyDialog=$('#privacy-dialog');
function showPreferences(){const id=analyticsId();$('#analytics-choice').disabled=!id;$('#analytics-choice').checked=!!consent?.analytics&&!!id;$('#analytics-status').textContent=id?'Optional Google Analytics loads only after you opt in. It helps us understand visits and page usage.':'Analytics are not connected on this site. No optional tracking is active.';privacyDialog.showModal()}
function saveConsent(analytics){const previous=!!consent?.analytics;consent={analytics:!!analytics&&!!analyticsId(),savedAt:new Date().toISOString()};try{localStorage.setItem(consentKey,JSON.stringify(consent))}catch{}$('.cookie-note').hidden=true;if(privacyDialog.open)privacyDialog.close();if(previous&&!consent.analytics){window['ga-disable-'+analyticsId()]=true;document.cookie.split(';').forEach(c=>{const name=c.split('=')[0].trim();if(name==='_ga'||name.startsWith('_ga_')){const base=name+'=; Max-Age=0; path=/; SameSite=Lax; Secure';document.cookie=base;const bits=location.hostname.split('.');for(let i=0;i<bits.length-1;i++)document.cookie=base+'; domain=.'+bits.slice(i).join('.')}});location.reload()}else enableAnalytics()}
$$('[data-preferences]').forEach(b=>b.addEventListener('click',showPreferences));$('[data-essential]')?.addEventListener('click',()=>saveConsent(false));$('#save-preferences')?.addEventListener('click',()=>saveConsent($('#analytics-choice').checked));$('#close-preferences')?.addEventListener('click',()=>privacyDialog.close());privacyDialog?.addEventListener('click',e=>{if(e.target===privacyDialog){const r=privacyDialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)privacyDialog.close()}});if(!consent)$('.cookie-note').hidden=false;enableAnalytics();
