'use strict';
(function(root){
 const normalize=s=>String(s).normalize('NFKC').toLowerCase().replace(/[’']/g,'').replace(/[^\p{L}\p{N}_]+/gu,' ').trim();
 const stop=new Set('i me my mine want wants would like need to do this that and the a an it for of in on with can how please help mujhe meri mera hai hain kar kr kro karna k liye ko ki ka se do'.split(' '));
 function rank(query,catalog){
  const q=normalize(query),terms=[...new Set(q.split(' ').filter(t=>t.length>1&&!stop.has(t)))];
  if(!terms.length)return [];
  return catalog.map(t=>{const title=normalize(t.name),intent=normalize(t.intents.join(' ')),words=new Set(intent.split(' '));let score=0,matched=[];
   for(const w of terms){if(words.has(w)||title.split(' ').includes(w)){score+=title.split(' ').includes(w)?4:2;matched.push(w);}else if(w.length>4&&[...words].some(v=>v.length>4&&(v.startsWith(w)||w.startsWith(v)))){score++;matched.push(w);}}
   const has=s=>new RegExp(s,'u').test(q);
   if(t.slug==='mat-cleaner'&&has('\\bmat\\b|mattagger|count_only|division by zero'))score+=24;
   if(t.slug==='english-ocr'&&has('ocr|scann?ed|scan |tasveer|tasvir|تصویر|स्कैन'))score+=10;
   if(t.slug==='corpus-cleaner'&&has('clean|remove|references|bibliography|hata|saaf|صفائی|صاف|साफ|हटा'))score+=7;
   if(t.slug==='pdf-tools'&&has('split|divid|chunk|parts|tukr|hisse|taqseem|تقسیم'))score+=10;
   if(t.slug==='image-tools'&&has('images? to (?:one )?pdf|pdf (?:pages )?to images?|compress (?:my )?(?:images?|photos?)|resize|png|jpeg|webp'))score+=16;
   if(t.slug==='pdf-tools'&&has('compress|smaller|chh?ota|छोटा')&&has('pdf'))score+=10;
   if(t.slug==='file-converter'&&has('pdf (?:ko |to )?(?:text|txt|word)|word to (?:text|txt)|docx to'))score+=12;
   if(t.slug==='metadata-studio'&&has('metadata|excel|csv|catalog|all.*(?:word|count)|total word|count.*words?|words?.*count'))score+=12;
   if(t.slug==='stylistic-toolkit'&&has('poem|poetry|foreground|parallelism|deviation|stylistic'))score+=12;
   if(t.slug==='corpus-merger'&&has('merge|combine|concatenate|many.*one|milana|jorna'))score+=12;
   return {...t,score,matched};}).filter(t=>t.score>=2).sort((a,b)=>b.score-a.score);
 }
 root.DailwindFinder={rank,normalize};if(typeof module!=='undefined'&&module.exports)module.exports=root.DailwindFinder;
 if(typeof document==='undefined'||!document.getElementById('toolkit-search'))return;
 const catalog=globalThis.DailwindCatalog,input=document.getElementById('toolkit-search'),cards=[...document.querySelectorAll('[data-toolkit]')],sections=[...document.querySelectorAll('[data-toolkit-category]')],status=document.getElementById('finder-status'),recommend=document.getElementById('finder-recommendations');let category='All';
 function render(){const q=input.value.trim(),ranked=rank(q,catalog),allowed=category==='All'?catalog:catalog.filter(t=>t.category===category),matches=ranked.filter(t=>allowed.some(a=>a.slug===t.slug));recommend.replaceChildren();
  cards.forEach(card=>{const result=matches.find(t=>t.slug===card.dataset.toolkit);card.hidden=q?!result:!allowed.some(t=>t.slug===card.dataset.toolkit);card.classList.toggle('finder-best',!!q&&matches[0]?.slug===card.dataset.toolkit);});
  sections.forEach(s=>s.hidden=![...s.querySelectorAll('[data-toolkit]')].some(c=>!c.hidden));
  if(q&&matches.length){const best=matches[0],link=document.createElement('a'),label=document.createElement('span'),name=document.createElement('strong'),reason=document.createElement('span');link.href='../'+best.slug+'/';link.className='finder-best-link';label.textContent='BEST MATCH FOR YOUR REQUEST';name.textContent='Dailwind '+best.name+' ↗';reason.textContent=best.description;link.append(label,name,reason);recommend.append(link);status.textContent=matches.length+' matching toolkits. Recommendations use local task matching; review the description before starting.';}
  else if(q){status.textContent='No clear match yet. Try a specific task, such as “remove references”, “split a PDF” or “scan to text”.';const b=document.createElement('button');b.type='button';b.textContent='Browse all toolkits';b.addEventListener('click',()=>{input.value='';category='All';document.querySelectorAll('[data-finder-category]').forEach(x=>x.setAttribute('aria-pressed',String(x.dataset.finderCategory==='All')));render();});recommend.append(b);}
  else status.textContent=allowed.length+' toolkits · '+(category==='All'?'Choose a category or describe what you want to do.':category);
 }
 input.addEventListener('input',render);document.getElementById('toolkit-search-form').addEventListener('submit',e=>{e.preventDefault();render();recommend.querySelector('a')?.focus();});
 document.querySelectorAll('[data-finder-example]').forEach(b=>b.addEventListener('click',()=>{input.value=b.dataset.finderExample;render();}));
 document.querySelectorAll('[data-finder-category]').forEach(b=>b.addEventListener('click',()=>{category=b.dataset.finderCategory;document.querySelectorAll('[data-finder-category]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));render();}));render();
})(typeof self!=='undefined'?self:globalThis);
