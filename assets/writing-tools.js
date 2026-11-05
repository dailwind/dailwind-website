'use strict';
(()=>{const W=globalThis.DailwindWriting;const mode=document.body.dataset.writing;const $=id=>document.getElementById(id);
const esc=s=>s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]);
const status=m=>{const s=$('wt-status');if(s)s.textContent=m;};
const idle=f=>('requestIdleCallback' in window)?requestIdleCallback(f,{timeout:1500}):setTimeout(f,300);
function copy(t,btn){(navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(()=>{if(btn){const o=btn.textContent;btn.textContent='Copied ✓';setTimeout(()=>btn.textContent=o,1400);}}).catch(()=>status('Copy failed. Select the text and copy it manually.'));}
function readFile(input,ta,after){input.addEventListener('change',()=>{const f=input.files[0];if(!f)return;if(f.size>5e6){status('Please use a text file under 5 MB.');return;}f.text().then(t=>{ta.value=t;after();});});}
const SAMPLES={
 grammar:"i think their is a error in the the report. Your welcome to fix it , its not hard.He dont know nothing about the budget. The report was written by the team in order to utilize alot of new data. At the end of the day, the results are more better then last year and we have the ability to grow.",
 ai:"In today's fast-paced world, it is important to note that technology plays a crucial role in our daily lives. Furthermore, artificial intelligence has the potential to transform industries seamlessly and efficiently. Moreover, businesses must leverage robust solutions to navigate the complexities of the modern landscape. Additionally, fostering innovation is paramount for sustainable growth and long-term success. In conclusion, embracing these comprehensive tools will empower organizations to unlock their full potential and thrive.",
 human:"In today's fast-paced world, it is important to note that remote work plays a crucial role in modern careers. Furthermore, employees are able to utilize numerous digital tools that facilitate collaboration seamlessly, and managers must leverage robust processes to navigate the complexities of distributed teams (Jones, 2021). Moreover, a growing body of research has shown that fostering innovation is paramount for sustainable growth. It is not easy. It takes practice. In conclusion, organizations that commence this journey with a holistic plan will obtain sufficient results and unlock their full potential."};
let dictReady=null;function loadDict(){if(!dictReady)dictReady=fetch('../assets/writing/en-words.txt').then(r=>{if(!r.ok)throw new Error(r.status);return r.text();}).then(t=>{W.loadDictionary(t);return true;}).catch(()=>{status('Spelling dictionary could not load; grammar and style checks still work.');return false;});return dictReady;}

/* ===== Writing assistant / grammar checker ===== */
function grammar(){const ta=$('wt-text'),bd=$('wt-backdrop'),cards=$('wt-cards');let result={issues:[]},filter='all',dismissed=new Set(),active=-1,timer=0;
 const goals=()=>({formality:$('wt-formality').value,audience:$('wt-audience').value});
 const key=i=>i.type+'|'+i.original.toLowerCase()+'|'+i.message;
 function run(){const t=ta.value;result=W.check(t,{goals:goals()});result.issues=result.issues.filter(i=>!dismissed.has(key(i)));paint();}
 function schedule(){clearTimeout(timer);timer=setTimeout(()=>requestAnimationFrame(run),ta.value.length>40000?700:220);}
 function paint(){const t=ta.value;let h='',pos=0;result.issues.forEach((i,n)=>{if(i.start<pos)return;h+=esc(t.slice(pos,i.start))+'<mark data-i="'+n+'" class="c-'+i.category+(n===active?' active':'')+'">'+esc(t.slice(i.start,i.end))+'</mark>';pos=i.end;});h+=esc(t.slice(pos))+'\n';bd.innerHTML=h;bd.scrollTop=ta.scrollTop;
  const r=result.readability,sc=t.trim()?result.score:0;$('wt-score').textContent=t.trim()?sc:'–';const bar=$('wt-meter');bar.style.width=sc+'%';bar.style.backgroundColor=sc>=85?'#12a150':sc>=65?'#f5a524':'#e5484d';
  $('wt-score-note').textContent=!t.trim()?'Start writing to get a score.':result.issues.length?result.issues.length+' suggestion'+(result.issues.length>1?'s':'')+' to review':'Looks clean. Nice work.';
  const c=result.counts||{};document.querySelectorAll('.wt-tabs button').forEach(b=>{const k=b.dataset.f;const n=k==='all'?result.issues.length:(c[k]||0);b.querySelector('em').textContent=n;});
  const vis=result.issues.map((i,n)=>[i,n]).filter(([i])=>filter==='all'||i.category===filter);
  cards.innerHTML=vis.length?vis.slice(0,200).map(([i,n])=>'<article class="wt-sug c-'+i.category+(n===active?' active':'')+'" data-i="'+n+'"><span class="cat">'+i.category+'</span><p>'+esc(i.message)+'</p><div class="row">'+(i.replacements.length?i.replacements.slice(0,4).map((r,k)=>'<button class="fix" type="button" data-fix="'+k+'"><span class="orig">'+esc(i.original.trim()||'·')+'</span> → '+(r===''?'remove':esc(r))+'</button>').join(''):'')+'<button type="button" data-dismiss>Dismiss</button>'+(i.type==='spelling'?'<button type="button" data-learn>Add to my words</button>':'')+'</div></article>').join(''):'<p class="wt-empty">'+(t.trim()?'No suggestions in this category.':'Suggestions appear here as you type.')+'</p>';
  $('wt-words').textContent=r.words;$('wt-chars').textContent=r.characters;$('wt-sentences').textContent=r.sentences;$('wt-time').textContent=r.readingMinutes+' min';$('wt-flesch').textContent=r.words?r.flesch:'–';$('wt-flesch-l').textContent=r.words?W.fleschLabel(r.flesch):'Flesch reading ease';$('wt-grade').textContent=r.words?r.grade:'–';$('wt-avg').textContent=r.avgSentence;
  $('wt-tone').innerHTML=t.trim()?result.tone.map(x=>'<span>'+x.tone+'</span>').join(''):'<span>Waiting for text</span>';}
 let learned=new Set();try{learned=new Set(JSON.parse(localStorage.getItem('dailwind:words')||'[]'));}catch(e){}
 cards.addEventListener('click',e=>{const card=e.target.closest('.wt-sug');if(!card)return;const n=+card.dataset.i,i=result.issues[n];if(!i)return;const fb=e.target.closest('[data-fix]');
  if(fb){const rep=i.replacements[+fb.dataset.fix];ta.focus();ta.setSelectionRange(i.start,i.end);if(!document.execCommand||!document.execCommand('insertText',false,rep))ta.setRangeText(rep,i.start,i.end,'end');active=-1;run();return;}
  if(e.target.closest('[data-dismiss]')){dismissed.add(key(i));run();return;}
  if(e.target.closest('[data-learn]')){learned.add(i.original.toLowerCase());localStorage.setItem('dailwind:words',JSON.stringify([...learned]));W.addWords([...learned]);run();return;}
  active=n;ta.focus();ta.setSelectionRange(i.start,i.end);paint();});
 ta.addEventListener('click',()=>{const p=ta.selectionStart;const n=result.issues.findIndex(i=>p>=i.start&&p<=i.end);if(n<0)return;active=n;if(filter!=='all'&&result.issues[n].category!==filter){filter='all';syncTabs();}paint();const el=cards.querySelector('[data-i="'+n+'"]');if(el)el.scrollIntoView({block:'nearest',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});});
 ta.addEventListener('input',()=>{active=-1;schedule();});ta.addEventListener('scroll',()=>{bd.scrollTop=ta.scrollTop;},{passive:true});
 if('ResizeObserver' in window)new ResizeObserver(()=>{bd.style.height=ta.offsetHeight+'px';}).observe(ta);
 function syncTabs(){document.querySelectorAll('.wt-tabs button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.f===filter)));}
 document.querySelector('.wt-tabs').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;filter=b.dataset.f;syncTabs();paint();});
 ['wt-formality','wt-audience'].forEach(id=>$(id).addEventListener('change',run));
 $('wt-sample').addEventListener('click',()=>{ta.value=SAMPLES.grammar;dismissed.clear();run();});
 $('wt-clear').addEventListener('click',()=>{ta.value='';dismissed.clear();run();ta.focus();});
 $('wt-copy').addEventListener('click',e=>copy(ta.value,e.currentTarget));
 $('wt-acceptall').addEventListener('click',()=>{let t=ta.value;const fx=result.issues.filter(i=>i.category==='correctness'&&i.replacements.length&&i.replacements[0]!==undefined).sort((a,b)=>b.start-a.start);let last=Infinity;for(const i of fx){if(i.end>last)continue;t=W.applyFix(t,i,i.replacements[0]);last=i.start;}ta.value=t;run();status(fx.length+' correctness fixes applied. Review the rest one by one.');});
 readFile($('wt-file'),ta,run);
 const saved=sessionStorage.getItem('dailwind:wt-draft');if(saved&&!ta.value)ta.value=saved;ta.addEventListener('input',()=>{try{sessionStorage.setItem('dailwind:wt-draft',ta.value.slice(0,200000));}catch(e){}});
 run();status('Checking grammar and style as you type. Loading the spelling dictionary…');idle(()=>loadDict().then(ok=>{if(ok){if(learned.size)W.addWords([...learned]);status('Ready. Spelling, grammar, clarity and tone are checked on this device as you type.');run();}}));}

/* ===== AI text detector ===== */
function detector(){const ta=$('wt-text');function run(){const r=W.detectAI(ta.value);$('wt-results').hidden=false;
 if(!r.enough){$('wt-big').innerHTML='<p class="wt-empty">Add at least 40 words and 3 sentences for a meaningful estimate (now '+r.words+' words).</p>';$('wt-signals').innerHTML='';$('wt-sents').innerHTML='';return;}
 $('wt-big').innerHTML='<b>'+r.score+'%</b><div><strong>'+r.label+'</strong><p class="language-help">Estimated AI-likeness from '+r.words+' words. An estimate, not proof.</p></div>';
 $('wt-signals').innerHTML=r.signals.map(s=>'<article><header><span>'+esc(s.label)+'</span><span>'+esc(String(s.value))+'</span></header><div class="wt-meter"><i data-w="'+Math.round(s.ai*100)+'"></i></div><p>'+esc(s.note)+'</p></article>').join('');
 requestAnimationFrame(()=>document.querySelectorAll('#wt-signals i').forEach(i=>{i.style.width=i.dataset.w+'%';i.style.backgroundColor=+i.dataset.w>=65?'#e5484d':+i.dataset.w>=40?'#f5a524':'#12a150';}));
 const t=ta.value;let h='',pos=0;r.sentences.forEach(s=>{h+=esc(t.slice(pos,s.start))+'<span class="'+(s.score>=65?'h3':s.score>=40?'h2':'h1')+'" title="'+s.score+'% machine-like signals">'+esc(t.slice(s.start,s.end))+'</span>';pos=s.end;});$('wt-sents').innerHTML=h+esc(t.slice(pos));
 status('Analysis finished locally. Treat the result as one signal among many.');}
 $('wt-run').addEventListener('click',run);$('wt-sample').addEventListener('click',()=>{ta.value=SAMPLES.ai;run();});$('wt-clear').addEventListener('click',()=>{ta.value='';$('wt-results').hidden=true;});
 $('wt-humanize').addEventListener('click',()=>{try{sessionStorage.setItem('dailwind:humanize-in',ta.value.slice(0,200000));}catch(e){}location.href='../text-humanizer/';});readFile($('wt-file'),ta,run);}

/* ===== Humanizer ===== */
function humanizer(){const ta=$('wt-text'),out=$('wt-out'),wc=$('wt-wordcount'),bar=$('wt-progress'),barI=bar&&bar.querySelector('i');let seed=1,busy=false,lastSource='';
 const soft=W.HUMANIZER_SOFT_WORDS||20000,hard=W.HUMANIZER_HARD_WORDS||35000;
 function countWords(){const n=W.words(ta.value).length;if(wc){let note=n.toLocaleString()+' word'+(n===1?'':'s');if(n>soft)note+=' · long paper mode (chunked)';if(n>hard)note+=' · will process the first '+hard.toLocaleString()+' words';wc.textContent=note;wc.hidden=!ta.value.trim();}return n;}
 function setBusy(on){busy=on;['wt-run','wt-again'].forEach(id=>{const b=$(id);if(b)b.disabled=on;});if(bar)bar.hidden=!on;if(barI)barI.style.width=on?'8%':'0%';}
 function paint(r,source){out.value=r.text;$('wt-results').hidden=false;lastSource=source;
  const d=W.diff(source,r.text);$('wt-diff').innerHTML=d.map(p=>p.op==='eq'?esc(p.text):p.op==='del'?'<del>'+esc(p.text)+'</del>':'<ins>'+esc(p.text)+'</ins>').join('');
  const a0=W.detectAI(source),a1=W.detectAI(r.text);const c=r.changes;
  $('wt-metrics').innerHTML=[[c.phrases,'AI-style phrases stripped'],[c.words+(c.synonyms||0),'Plain / varied wording'],[c.contractions,'Contractions adjusted'],[c.splits+c.merges,'Sentences reshaped'],[c.protected||0,'Citations & spans kept'],[r.before.flesch+' → '+r.after.flesch,'Flesch reading ease'],[a0.enough?a0.score+'% → '+(a1.enough?a1.score+'%':'–'):'–','Machine-like signals (estimate)']].map(([v,l])=>'<article><strong>'+v+'</strong><span>'+l+'</span></article>').join('');
  let msg='Rewritten on this device with multi-pass linguistic rewriting (not a cloud AI). Read it through and keep what sounds like you.';
  if(r.truncated)msg='Processed the first '+hard.toLocaleString()+' words of a longer paper. '+msg;
  else if(r.wordCount>soft)msg='Long paper rewritten in chunks so the page stays responsive. '+msg;
  status(msg);}
 async function run(){if(busy)return;if(!ta.value.trim()){status('Add some text first.');return;}const source=ta.value;const n=countWords();setBusy(true);status(n>800?'Rewriting in chunks…':'Rewriting…');
  try{const opts={tone:$('wt-tone-pick').value,seed,passes:2};const r=await (W.humanizeAsync?W.humanizeAsync(source,opts,p=>{if(barI)barI.style.width=Math.max(8,Math.round(p*100))+'%';}):Promise.resolve(W.humanize(source,opts)));paint(r,source);}
  catch(e){status('Rewrite failed. Try a shorter selection.');console.error(e);}finally{setBusy(false);if(barI)barI.style.width='0%';}}
 $('wt-run').addEventListener('click',()=>{seed=1;run();});$('wt-again').addEventListener('click',()=>{seed++;run();});
 $('wt-sample').addEventListener('click',()=>{ta.value=SAMPLES.human;countWords();run();});$('wt-clear').addEventListener('click',()=>{ta.value='';out.value='';lastSource='';$('wt-results').hidden=true;countWords();status('Cleared.');});
 $('wt-copy').addEventListener('click',e=>copy(out.value,e.currentTarget));$('wt-tone-pick').addEventListener('change',()=>{if(out.value)run();});
 ta.addEventListener('input',()=>{clearTimeout(ta._wcTimer);ta._wcTimer=setTimeout(countWords,120);});
 const v=document.querySelectorAll('[data-view]');v.forEach(b=>b.addEventListener('click',()=>{v.forEach(x=>x.setAttribute('aria-pressed',String(x===b)));$('wt-diff').hidden=b.dataset.view!=='diff';out.hidden=b.dataset.view!=='out';}));
 readFile($('wt-file'),ta,()=>{countWords();run();});const pre=sessionStorage.getItem('dailwind:humanize-in');if(pre){ta.value=pre;sessionStorage.removeItem('dailwind:humanize-in');countWords();run();}
 status('Ready. Paste academic or AI-sounding prose, pick a tone, then rewrite. Everything stays on this device.');countWords();}
if(mode==='grammar')grammar();else if(mode==='detector')detector();else if(mode==='humanizer')humanizer();})();
