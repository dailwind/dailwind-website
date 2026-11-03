'use strict';
// Themed listbox for native <select> on touch and narrow screens.
// The native <select> stays visible and remains the source of truth: we only
// replace the OS picker (Android's fullscreen grey sheet) with an anchored popover,
// then set select.value and fire input/change so page scripts keep working.
// Desktop (wide screen with a fine pointer) is left completely untouched.
(()=>{
 const mq=window.matchMedia('(max-width: 768px), (pointer: coarse)');
 const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
 let pop=null,current=null,active=-1,items=[],uid=0;
 const eligible=s=>mq.matches&&s instanceof HTMLSelectElement&&!s.multiple&&!(s.size>1)&&!s.disabled&&!s.closest('[data-native-select]');
 function close(focusBack){
  if(!pop)return;const s=current;pop.remove();pop=null;current=null;items=[];active=-1;
  document.removeEventListener('pointerdown',outside,true);window.removeEventListener('resize',onResize);window.removeEventListener('scroll',onScroll,true);
  if(s){s.removeAttribute('aria-expanded');if(focusBack)s.focus({preventScroll:true});}
 }
 function outside(e){if(pop&&!pop.contains(e.target)&&e.target!==current)close(false);}
 function onResize(){close(false);}
 function onScroll(e){if(pop&&!pop.contains(e.target))place();}
 function setActive(i,scroll){
  if(!items.length)return;i=Math.max(0,Math.min(items.length-1,i));
  items.forEach((el,n)=>el.classList.toggle('is-active',n===i));active=i;
  pop.setAttribute('aria-activedescendant',items[i].id);if(scroll)items[i].scrollIntoView({block:'nearest'});
 }
 function choose(i){
  const s=current,el=items[i];if(!s||!el)return;const opt=s.options[Number(el.dataset.index)];
  close(true);
  if(opt&&!opt.disabled&&s.selectedIndex!==opt.index){
   s.selectedIndex=opt.index;
   s.dispatchEvent(new Event('input',{bubbles:true}));s.dispatchEvent(new Event('change',{bubbles:true}));
  }
 }
 function place(){
  if(!pop||!current)return;const r=current.getBoundingClientRect(),vh=window.innerHeight,vw=document.documentElement.clientWidth,gap=6,margin=10;
  const width=Math.min(Math.max(r.width,200),vw-margin*2);
  let left=Math.min(Math.max(margin,r.left),vw-width-margin);
  const below=vh-r.bottom-gap-margin,above=r.top-gap-margin;
  const want=Math.min(pop.scrollHeight,320);
  const up=below<Math.min(want,180)&&above>below;
  const max=Math.max(120,Math.min(320,up?above:below));
  pop.style.setProperty('width',width+'px');pop.style.setProperty('left',left+'px');pop.style.setProperty('max-height',max+'px');
  if(up){pop.style.setProperty('top','auto');pop.style.setProperty('bottom',(vh-r.top+gap)+'px');}
  else{pop.style.setProperty('bottom','auto');pop.style.setProperty('top',(r.bottom+gap)+'px');}
 }
 function open(s){
  close(false);current=s;const cs=getComputedStyle(s);
  pop=document.createElement('div');pop.className='dw-select-pop'+(reduce.matches?' is-static':'');pop.id='dw-select-pop-'+(++uid);
  pop.setAttribute('role','listbox');pop.tabIndex=-1;
  const lab=s.labels&&s.labels[0];if(lab){if(!lab.id)lab.id='dw-select-label-'+uid;pop.setAttribute('aria-labelledby',lab.id);}else if(s.getAttribute('aria-label'))pop.setAttribute('aria-label',s.getAttribute('aria-label'));
  pop.style.setProperty('font-family',cs.fontFamily);
  pop.style.setProperty('--dw-pop-ink',cs.color);
  [...s.children].forEach(node=>{
   const add=(opt,inGroup)=>{if(opt.hidden)return;const el=document.createElement('div');el.className='dw-select-option'+(inGroup?' in-group':'');el.id=pop.id+'-o'+opt.index;el.setAttribute('role','option');el.dataset.index=opt.index;
    el.setAttribute('aria-selected',String(opt.selected));if(opt.disabled)el.setAttribute('aria-disabled','true');
    const t=document.createElement('span');t.className='dw-select-text';t.textContent=opt.label||opt.textContent;el.append(t);
    const c=document.createElement('span');c.className='dw-select-check';c.setAttribute('aria-hidden','true');c.textContent=opt.selected?'✓':'';el.append(c);
    if(!opt.disabled)el.addEventListener('click',()=>choose(items.indexOf(el)));
    pop.append(el);items.push(el);};
   if(node.tagName==='OPTGROUP'){const g=document.createElement('div');g.className='dw-select-group';g.setAttribute('role','presentation');g.textContent=node.label;pop.append(g);[...node.children].forEach(o=>add(o,true));}
   else if(node.tagName==='OPTION')add(node,false);
  });
  document.body.append(pop);s.setAttribute('aria-expanded','true');place();
  const sel=items.findIndex(el=>el.getAttribute('aria-selected')==='true');setActive(sel<0?0:sel,true);
  pop.addEventListener('keydown',key);pop.focus({preventScroll:true});
  document.addEventListener('pointerdown',outside,true);window.addEventListener('resize',onResize);window.addEventListener('scroll',onScroll,true);
 }
 function step(d){let i=active;do{i+=d;}while(items[i]&&items[i].getAttribute('aria-disabled')==='true');if(items[i])setActive(i,true);}
 function key(e){
  if(e.key==='Escape'){e.preventDefault();close(true);}
  else if(e.key==='Tab'){close(true);}
  else if(e.key==='ArrowDown'){e.preventDefault();step(1);}
  else if(e.key==='ArrowUp'){e.preventDefault();step(-1);}
  else if(e.key==='Home'){e.preventDefault();setActive(0,true);}
  else if(e.key==='End'){e.preventDefault();setActive(items.length-1,true);}
  else if(e.key==='Enter'||e.key===' '){e.preventDefault();if(items[active]&&items[active].getAttribute('aria-disabled')!=='true')choose(active);}
  else if(e.key.length===1){const k=e.key.toLowerCase(),start=active+1;for(let n=0;n<items.length;n++){const i=(start+n)%items.length;if(items[i].textContent.trim().toLowerCase().startsWith(k)){setActive(i,true);break;}}}
 }
 // Intercept the gestures that would open the OS picker.
 let touchOpened=0;
 document.addEventListener('touchend',e=>{const s=e.target.closest&&e.target.closest('select');if(!s||!eligible(s))return;e.preventDefault();touchOpened=Date.now();s.focus({preventScroll:true});if(current===s)close(false);else open(s);},{passive:false,capture:true});
 document.addEventListener('mousedown',e=>{const s=e.target.closest&&e.target.closest('select');if(!s||!eligible(s))return;e.preventDefault();if(Date.now()-touchOpened<700)return;s.focus({preventScroll:true});if(current===s)close(false);else open(s);},true);
 document.addEventListener('keydown',e=>{const s=e.target;if(pop||!eligible(s))return;if(e.key===' '||e.key==='Enter'||(e.altKey&&(e.key==='ArrowDown'||e.key==='ArrowUp'))||e.key==='F4'){e.preventDefault();open(s);}},true);
 mq.addEventListener&&mq.addEventListener('change',()=>close(false));
})();
