'use strict';
// Toolkits page helpers: category counts, "New" badges for the language labs, an on-device
// indicator, a "continue where you left off" shortcut (localStorage), and keyboard shortcuts.
(()=>{
 const grid=document.querySelector('.finder-library');if(!grid)return;
 const cards=[...document.querySelectorAll('.toolkit-card[data-toolkit]')];if(!cards.length)return;
 const KEY='dailwind:lastToolkit',NEW=new Set(['lexical-metrics','morphology-explorer','syntax-explorer','sentiment-studio','register-profile','forensic-compare']);
 const store={get(){try{return JSON.parse(localStorage.getItem(KEY)||'null');}catch{return null;}},set(v){try{localStorage.setItem(KEY,JSON.stringify(v));}catch{}}};
 const nameOf=c=>(c.querySelector('h3')?.textContent||'').trim();
 // 1. Counts on the category chips.
 document.querySelectorAll('[data-finder-category]').forEach(b=>{const cat=b.dataset.finderCategory,n=cat==='All'?cards.length:document.querySelectorAll('[data-toolkit-category="'+CSS.escape(cat)+'"] .toolkit-card').length;if(!n)return;const s=document.createElement('span');s.className='finder-chip-count';s.textContent=String(n);s.setAttribute('aria-hidden','true');b.append(s);b.setAttribute('aria-label',b.textContent.replace(/\d+$/,'').trim()+', '+n+' toolkits');});
 cards.forEach(card=>{
  const top=card.querySelector('.toolkit-card-top');
  // 2. "New" badge for the language labs.
  if(NEW.has(card.dataset.toolkit)&&top&&!top.querySelector('.toolkit-new-badge')){const n=document.createElement('span');n.className='toolkit-new-badge';n.textContent='New';top.append(n);}
  // 3. On-device indicator.
  const local=card.querySelector('.toolkit-local');if(local&&/local processing/i.test(local.textContent))local.classList.add('is-on-device');
  // 4. Remember the last toolkit opened.
  card.querySelector('a.button')?.addEventListener('click',()=>store.set({slug:card.dataset.toolkit,name:nameOf(card),at:Date.now()}));
 });
 const last=store.get(),lastCard=last&&cards.find(c=>c.dataset.toolkit===last.slug);
 if(lastCard){lastCard.classList.add('toolkit-last-used');const top=lastCard.querySelector('.toolkit-card-top');if(top){const t=document.createElement('span');t.className='toolkit-last-badge';t.textContent='Last opened';top.append(t);}
  const href=lastCard.querySelector('a.button')?.getAttribute('href');const anchor=document.querySelector('.finder-privacy');
  if(href&&anchor){const p=document.createElement('p');p.className='finder-resume';const a=document.createElement('a');a.href=href;a.textContent='Continue with '+nameOf(lastCard)+' →';const x=document.createElement('button');x.type='button';x.className='finder-resume-clear';x.textContent='Forget';x.setAttribute('aria-label','Forget the last opened toolkit');
   x.addEventListener('click',()=>{try{localStorage.removeItem(KEY);}catch{}p.remove();lastCard.classList.remove('toolkit-last-used');lastCard.querySelector('.toolkit-last-badge')?.remove();});p.append('Last time: ',a,' ',x);anchor.after(p);}}
 // 5. Keyboard: "/" focuses the task search, Escape clears it, arrow keys move between visible cards.
 const search=document.getElementById('toolkit-search');
 document.addEventListener('keydown',e=>{if(e.defaultPrevented||e.altKey||e.ctrlKey||e.metaKey)return;const t=e.target,typing=t instanceof HTMLElement&&(t.isContentEditable||/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));
  if(e.key==='/'&&!typing&&search){e.preventDefault();search.focus();search.select();return;}
  if(e.key==='Escape'&&t===search&&search.value){search.value='';search.dispatchEvent(new Event('input',{bubbles:true}));return;}
  if(!['ArrowRight','ArrowLeft','ArrowDown','ArrowUp'].includes(e.key)||typing)return;
  const links=cards.filter(c=>!c.hidden&&c.offsetParent!==null).map(c=>c.querySelector('a.button')).filter(Boolean),i=links.indexOf(document.activeElement);if(i<0)return;
  e.preventDefault();const here=links[i].getBoundingClientRect();let next=null;
  if(e.key==='ArrowRight')next=links[i+1];else if(e.key==='ArrowLeft')next=links[i-1];
  else{const dir=e.key==='ArrowDown'?1:-1,cand=links.filter(l=>{const r=l.getBoundingClientRect();return dir>0?r.top>here.top+10:r.top<here.top-10;});next=cand.sort((a,b)=>{const ra=a.getBoundingClientRect(),rb=b.getBoundingClientRect();return dir*(ra.top-rb.top)||Math.abs(ra.left-here.left)-Math.abs(rb.left-here.left);})[0];}
  if(next){next.focus();next.scrollIntoView({block:'nearest',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});}});
 if(search&&!search.getAttribute('aria-keyshortcuts'))search.setAttribute('aria-keyshortcuts','/');
})();
