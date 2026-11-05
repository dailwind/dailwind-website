'use strict';
(function(root){
 const normalize=s=>String(s||'').normalize('NFKC').toLowerCase().replace(/[’']/g,'').replace(/[^\p{L}\p{N}_]+/gu,' ').trim();
 const stop=new Set('i me my mine want wants would like need to do this that and the a an it for of in on with can how please help from my your our their is are was were be been being or as at by we you they he she mujhe meri mera hai hain kar kr kro karna k liye ko ki ka se do'.split(' '));
 const termsOf=q=>[...new Set(normalize(q).split(' ').filter(t=>t.length>1&&!stop.has(t)))];
 function haystack(t){
  const intents=Array.isArray(t.intents)?t.intents.join(' '):(t.intents||'');
  const examples=Array.isArray(t.examples)?t.examples.join(' '):(t.examples||'');
  return normalize([t.name,t.task,t.description,t.category,t.slug,intents,examples].filter(Boolean).join(' '));
 }
 function rank(query,catalog){
  const list=Array.isArray(catalog)?catalog:[];
  const q=normalize(query),terms=termsOf(query);
  if(!terms.length)return [];
  const has=s=>{try{return new RegExp(s,'u').test(q);}catch{return false;}};
  return list.map(t=>{
   const title=normalize(t.name),task=normalize(t.task||''),desc=normalize(t.description||''),cat=normalize(t.category||''),slug=normalize((t.slug||'').replace(/-/g,' '));
   const intent=normalize((Array.isArray(t.intents)?t.intents.join(' '):(t.intents||'')));
   const example=normalize((Array.isArray(t.examples)?t.examples.join(' '):(t.examples||'')));
   const all=haystack(t);
   const titleWords=new Set(title.split(' ').filter(Boolean));
   const bag=new Set(all.split(' ').filter(Boolean));
   let score=0,matched=[],miss=0;
   // Whole-query phrase hit (strong)
   if(q.length>2&&(title.includes(q)||all.includes(q))){score+=18;matched.push(q);}
   for(const w of terms){
    let hit=0;
    if(titleWords.has(w)||title.includes(w)){hit=6;score+=6;}
    else if(slug.split(' ').includes(w)||slug.includes(w)){hit=5;score+=5;}
    else if(cat.split(' ').includes(w)){hit=4;score+=4;}
    else if(task.includes(w)||desc.includes(w)){hit=3;score+=3;}
    else if(bag.has(w)||intent.includes(w)||example.includes(w)){hit=3;score+=3;}
    else if(w.length>=3&&[...bag].some(v=>{
      // Only treat catalog tokens as extensions of the query term (human → humanize).
      // Never let a short catalog stem match a longer query (pass ↛ passport).
      if(v.length<w.length)return false;
      if(v===w||v.startsWith(w))return true;
      return w.length>=4&&v.includes(w);
    })){hit=2;score+=2;}
    if(hit)matched.push(w);else miss++;
   }
   // Cover ratio: 1–2 terms must all hit; longer queries need most distinctive terms.
   // Keeps natural phrases like "Clean damaged OCR text" useful without showing the whole library.
   const need=terms.length<=2?terms.length:Math.max(2,Math.ceil(terms.length*0.6));
   if(matched.length<need)return {...t,score:0,matched};
   // Task-specific boosts (kept from prior finder; help natural-language requests)
   if(t.slug==='mat-cleaner'&&has('\\bmat\\b|mattagger|count_only|division by zero'))score+=24;
   if(t.slug==='english-ocr'&&has('ocr|scann?ed|scan |tasveer|tasvir|تصویر|स्कैन'))score+=10;
   if(t.slug==='corpus-cleaner'&&has('clean|remove|references|bibliography'))score+=7;
   if(t.slug==='pdf-tools'&&has('split|divid|chunk|parts|tukr|hisse|taqseem|تقسیم'))score+=10;
   if(t.slug==='image-tools'&&has('images? to (?:one )?pdf|pdf (?:pages )?to images?|compress (?:my )?(?:images?|photos?)|resize|png|jpeg|webp'))score+=16;
   if(t.slug==='pdf-tools'&&has('compress|smaller|chh?ota|छोटा')&&has('pdf'))score+=10;
   if(t.slug==='file-converter'&&has('pdf (?:ko |to )?(?:text|txt|word)|word to (?:text|txt|pdf)|docx to'))score+=12;
   if(t.slug==='metadata-studio'&&has('metadata|excel|csv|catalog|all.*(?:word|count)|total word|count.*words?|words?.*count'))score+=12;
   if(t.slug==='stylistic-toolkit'&&has('poem|poetry|foreground|parallelism|deviation|stylistic'))score+=12;
   for(const [slug,pattern]of [['case-converter','case convert|uppercase|lowercase|title case|sentence case|camel ?case|snake ?case|kebab|extra spaces|line breaks'],['text-statistics','word count|character count|count words|reading time|speaking time|keyword density|n-?gram'],['synonym-explorer','synonym|thesaurus|another word|antonym|opposite of|similar word'],['citation-generator','citation|cite|referenc|bibliograph|works cited|apa|mla|harvard|chicago style|doi'],['text-to-speech','text to speech|tts|read aloud|pronunc|ipa|speak'],['passport-photo-maker','passport|visa photo|id photo|2x2|35x45'],['image-resizer','resiz|reduce image|kb|image size|instagram size|photo size'],['image-converter','convert image|image convert|jpg to|png to|webp|avif|to ico|favicon|bmp'],['text-humanizer','humani[sz]|rewrite|rewriter|paraphras|reword|ai remov|natural'],['ai-text-detector','ai detect|detect ai|chatgpt|gpt|ai generated|ai written|ai content'],['grammar-checker','grammar|spell|proofread|punctuation|writing assistant|grammarly|typo'],['lexical-metrics','lexical diversity|mattr|hapax|type token|vocabulary richness'],['morphology-explorer','morpholog|inflection|lemma|word forms'],['syntax-explorer','syntax|syntactic|dependency|conllu|sentence structure'],['sentiment-studio','sentiment|polarity|positive|negative|vader'],['register-profile','register profile|mda|multidimensional|multi dimensional|biber'],['forensic-compare','forensic|compare two texts|plagiarism'],['stylometry-lab','stylometry|burrows|delta|authorship|stylo'],['readability-studio','readab|flesch|grade level|gunning|smog|mtld|hd-d'],['parallel-aligner','parallel|align|translation|bilingual|tmx'],['qualitative-coder','qualitative|thematic|codebook|survey|interview|kappa|nvivo']])if(t.slug===slug&&has(pattern))score+=20;
   if(t.slug==='corpus-merger'&&has('merge|combine|concatenate|many.*one|milana|jorna'))score+=12;
   return {...t,score,matched};
  }).filter(t=>t.score>=2).sort((a,b)=>b.score-a.score||a.name.localeCompare(b.name));
 }
 root.DailwindFinder={rank,normalize,termsOf,haystack};if(typeof module!=='undefined'&&module.exports)module.exports=root.DailwindFinder;

 function bindFinder(){
  if(typeof document==='undefined')return;
  const input=document.getElementById('toolkit-search');
  if(!input||input.dataset.finderBound==='1')return;
  const catalog=globalThis.DailwindCatalog;
  if(!Array.isArray(catalog)||!catalog.length){
   // Catalog script not ready yet (load order / transient). Retry briefly; keep UI usable.
   if((bindFinder.tries=(bindFinder.tries||0)+1)<40)setTimeout(bindFinder,25);
   return;
  }
  input.dataset.finderBound='1';
  const cards=[...document.querySelectorAll('[data-toolkit]')];
  const sections=[...document.querySelectorAll('[data-toolkit-category]')];
  const status=document.getElementById('finder-status');
  const recommend=document.getElementById('finder-recommendations');
  const form=document.getElementById('toolkit-search-form');
  let category='All',timer=0;

  function applyFilter(q,matches,allowed){
   const searching=!!q;
   cards.forEach(card=>{
    const slug=card.dataset.toolkit;
    const inAllowed=allowed.some(t=>t.slug===slug);
    const result=searching?matches.find(t=>t.slug===slug):null;
    const show=searching?!!result:inAllowed;
    card.hidden=!show;
    if(show)card.removeAttribute('hidden');else card.setAttribute('hidden','');
    card.classList.toggle('finder-best',searching&&matches[0]?.slug===slug);
   });
   sections.forEach(s=>{
    const any=[...s.querySelectorAll('[data-toolkit]')].some(c=>!c.hidden);
    s.hidden=!any;
    if(any)s.removeAttribute('hidden');else s.setAttribute('hidden','');
   });
  }

  function render(){
   const q=input.value.trim();
   const allowed=category==='All'?catalog:catalog.filter(t=>t.category===category);
   let matches;
   try{matches=q?rank(q,catalog).filter(t=>allowed.some(a=>a.slug===t.slug)):[];}
   catch(err){console.error(err);matches=[];}
   if(recommend)recommend.replaceChildren();
   applyFilter(q,matches,allowed);
   if(!status)return;
   if(q&&matches.length){
    const best=matches[0],link=document.createElement('a'),label=document.createElement('span'),name=document.createElement('strong'),reason=document.createElement('span');
    link.href='../'+best.slug+'/';link.className='finder-best-link';
    label.textContent='BEST MATCH FOR YOUR REQUEST';name.textContent='Dailwind '+best.name+' ↗';reason.textContent=best.description;
    link.append(label,name,reason);recommend&&recommend.append(link);
    status.textContent=matches.length+(matches.length===1?' matching toolkit.':' matching toolkits.')+' Showing only related results · local matching on your device.';
   }else if(q){
    status.textContent='No matching toolkit. Try a tool name, task, or keyword — for example “passport”, “OCR”, or “grammar”.';
    const b=document.createElement('button');b.type='button';b.className='finder-reset-button';b.textContent='Show all toolkits';
    b.addEventListener('click',()=>{input.value='';category='All';document.querySelectorAll('[data-finder-category]').forEach(x=>x.setAttribute('aria-pressed',String(x.dataset.finderCategory==='All')));render();input.focus();});
    recommend&&recommend.append(b);
   }else{
    status.textContent=allowed.length+' toolkits · '+(category==='All'?'Choose a category or describe what you want to do.':category);
   }
  }

  function liveRender(){clearTimeout(timer);timer=setTimeout(render,40);}

  input.addEventListener('input',liveRender);
  input.addEventListener('keyup',liveRender);
  input.addEventListener('search',liveRender); // clear (x) on type=search
  input.addEventListener('paste',()=>setTimeout(liveRender,0));
  input.addEventListener('compositionend',liveRender);
  if(form)form.addEventListener('submit',e=>{e.preventDefault();clearTimeout(timer);render();recommend&&recommend.querySelector('a')?.focus();});
  document.querySelectorAll('[data-finder-example]').forEach(b=>b.addEventListener('click',()=>{input.value=b.dataset.finderExample||'';clearTimeout(timer);render();}));
  document.querySelectorAll('[data-finder-category]').forEach(b=>b.addEventListener('click',()=>{category=b.dataset.finderCategory;document.querySelectorAll('[data-finder-category]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));clearTimeout(timer);render();}));
  render();
 }

 if(typeof document!=='undefined'){
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bindFinder,{once:true});
  else bindFinder();
 }
})(typeof self!=='undefined'?self:globalThis);
