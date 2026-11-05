'use strict';
(()=>{
 const $=id=>document.getElementById(id),win=$('app-window'),launcher=$('launcher-dialog'),query=$('launcher-query'),results=$('launcher-results');
 const nav=[...$('tool-nav').querySelectorAll('button')],dock=[...document.querySelectorAll('[data-dock-tool]')];
 function restore(){win.hidden=false;$('desktop-launch').hidden=true;}
 function hide(){win.hidden=true;$('desktop-launch').hidden=false;}
 function sync(){const current=nav.find(b=>b.hasAttribute('aria-current'));$('window-tool').textContent=$('tool-title').textContent;dock.forEach(b=>{if(b.dataset.dockTool===current?.dataset.tool)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});}
 function select(id){restore();nav.find(b=>b.dataset.tool===id)?.click();sync();launcher.close();$('tools').classList.remove('open');$('toggle-nav').setAttribute('aria-expanded','false');const target=id==='overview'?document.querySelector('.corpus-panel'):document.querySelector('.analysis-panel');target?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});}
 function search(){const term=query.value.trim().toLowerCase();results.replaceChildren();let count=0;nav.forEach((original)=>{if(!original.textContent.toLowerCase().includes(term))return;count++;const button=document.createElement('button');button.type='button';button.textContent=original.textContent;button.addEventListener('click',()=>select(original.dataset.tool));results.append(button);});$('launcher-empty').hidden=count>0;}
 function open(){restore();query.value='';search();launcher.showModal();query.focus();}
 document.querySelectorAll('[data-launcher]').forEach(b=>b.addEventListener('click',open));$('toggle-nav').addEventListener('click',open);$('launcher-close').addEventListener('click',()=>launcher.close());query.addEventListener('input',search);query.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();results.querySelector('button')?.click();}});
 dock.forEach(b=>b.addEventListener('click',()=>select(b.dataset.dockTool)));$('desktop-launch').addEventListener('click',restore);$('window-hide').addEventListener('click',hide);$('window-minimize').addEventListener('click',hide);$('window-maximize').addEventListener('click',()=>{const max=win.classList.toggle('maximized');$('window-maximize').setAttribute('aria-label',max?'Restore workspace size':'Maximize workspace');});
 document.addEventListener('keydown',e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();if(launcher.open)launcher.close();else open();}});
 new MutationObserver(sync).observe($('tool-title'),{childList:true,characterData:true,subtree:true});
 function clock(){const now=new Date();$('desk-clock').textContent=now.toLocaleDateString(undefined,{weekday:'short'})+' '+now.toLocaleTimeString(undefined,{hour:'2-digit',minute:'2-digit'});$('desk-clock').dateTime=now.toISOString();}clock();setInterval(clock,60000);sync();
})();
