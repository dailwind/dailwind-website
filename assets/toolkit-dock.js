'use strict';
// Shared presentation only: no corpus data, analysis or storage is changed.
(()=>{
 const dock=document.querySelector('.desk-dock, nav.dock');
 const bar=document.querySelector('.system-bar');
 if(!dock||!bar)return;
 const root=document.documentElement,key='dailwind-toolkit-dock-auto-v1';
 const desktop=matchMedia('(min-width:761px)');
 let preferred=true,timer,keyboard=false;
 try{const saved=localStorage.getItem(key);if(saved!==null)preferred=saved==='true';}catch{}
 dock.id=dock.id||'workspace-dock';
 const toggle=document.createElement('button');
 toggle.type='button';toggle.className='dock-mode-toggle';
 toggle.setAttribute('aria-controls',dock.id);
 toggle.title='Automatically hide the dock to give your workspace more room';
 bar.insertBefore(toggle,bar.querySelector('time'));
 const handle=document.createElement('button');
 handle.type='button';handle.className='dock-reveal';
 handle.setAttribute('aria-controls',dock.id);
 const edge=document.createElement('div');edge.className='dock-edge';edge.setAttribute('aria-hidden','true');
 document.body.append(edge,handle);
 const enabled=()=>preferred&&desktop.matches;
 const hidden=()=>root.classList.contains('toolkit-dock-hidden');
 function show(value){
  clearTimeout(timer);const hide=enabled()&&!value;
  root.classList.toggle('toolkit-dock-hidden',hide);
  dock.inert=hide;
  if(hide)dock.setAttribute('aria-hidden','true');else dock.removeAttribute('aria-hidden');
  handle.textContent=hide?'Show dock ↑':'Hide dock ↓';
  handle.setAttribute('aria-expanded',String(!hide));
 }
 function later(delay=1200){
  clearTimeout(timer);if(!enabled())return;
  timer=setTimeout(()=>{
   if(dock.matches(':hover')||(keyboard&&dock.contains(document.activeElement)))return;
   show(false);
  },delay);
 }
 function apply(){
  root.classList.toggle('toolkit-dock-auto',enabled());
  toggle.textContent=preferred?'Dock: Auto-hide':'Dock: Always show';
  toggle.setAttribute('aria-pressed',String(preferred));
  handle.hidden=!enabled();show(!enabled());
 }
 toggle.addEventListener('click',()=>{preferred=!preferred;try{localStorage.setItem(key,String(preferred));}catch{}apply();});
 handle.addEventListener('click',()=>{show(hidden());if(!hidden())later(2500);});
 edge.addEventListener('pointerenter',()=>{if(enabled()){show(true);later(2500);}});
 dock.addEventListener('pointerenter',()=>{clearTimeout(timer);show(true);});
 dock.addEventListener('pointerleave',()=>later());
 dock.addEventListener('focusin',()=>{clearTimeout(timer);show(true);});
 dock.addEventListener('focusout',()=>later());
 dock.addEventListener('click',()=>later());
 document.addEventListener('pointerdown',e=>{
  keyboard=false;
  if(enabled()&&!dock.contains(e.target)&&e.target!==handle&&e.target!==toggle)show(false);
 });
 document.addEventListener('keydown',e=>{
  keyboard=true;
  if(e.key==='Escape'&&enabled()&&!hidden()&&!document.querySelector('dialog[open]')){
   if(dock.contains(document.activeElement))handle.focus();
   show(false);
  }
 });
 desktop.addEventListener('change',apply);
 apply();
})();
