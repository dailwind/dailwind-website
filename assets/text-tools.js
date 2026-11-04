'use strict';
/* UI for the Case Converter, Text Statistics, Citation Generator and Synonym Explorer. Everything runs locally;
   the Citation Generator contacts api.crossref.org only when you press "Look up DOI". */
(()=>{const T=window.DailwindText,$=id=>document.getElementById(id),mode=document.body.dataset.text;if(!T||!mode)return;
const status=m=>{const s=$('wt-status');if(s)s.textContent=m;};
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const empty=(title,body)=>'<p class="tool-empty"><strong>'+esc(title)+'</strong>'+esc(body)+'</p>';
async function copy(text,html){try{if(html&&window.ClipboardItem){await navigator.clipboard.write([new ClipboardItem({'text/plain':new Blob([text],{type:'text/plain'}),'text/html':new Blob([html],{type:'text/html'})})]);}else await navigator.clipboard.writeText(text);status('Copied to clipboard.');}catch{status('Copy was blocked by the browser. Select the text and copy it manually.');}}
function download(name,data,type){const a=document.createElement('a'),u=URL.createObjectURL(new Blob([data],{type}));a.href=u;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),4000);}
const store={get(k,d){try{return JSON.parse(localStorage.getItem(k))??d;}catch{return d;}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v));return true;}catch{return false;}}};
/* ---------- Case converter ---------- */
if(mode==='case'){const inp=$('tt-input'),out=$('tt-output');let cur='';
 const run=()=>{if(!cur){out.value=inp.value;return;}out.value=T.convertCase(inp.value,cur);};
 document.querySelectorAll('[data-case]').forEach(b=>b.addEventListener('click',()=>{cur=b.dataset.case;document.querySelectorAll('[data-case]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));run();status(inp.value?'Converted to '+b.textContent.trim()+'.':'Add some text first.');}));
 $('tt-spaces').addEventListener('click',()=>{inp.value=T.cleanSpaces(inp.value);run();status('Removed extra spaces and blank lines.');});
 $('tt-breaks').addEventListener('click',()=>{inp.value=T.cleanSpaces(inp.value,{lineBreaks:true});run();status('Removed line breaks.');});
 $('tt-copy').addEventListener('click',()=>out.value?copy(out.value):status('Nothing to copy yet.'));
 $('tt-use').addEventListener('click',()=>{inp.value=out.value;status('Result moved to the input.');});
 $('tt-clear').addEventListener('click',()=>{inp.value='';out.value='';inp.focus();status('Cleared.');});
 $('tt-sample').addEventListener('click',()=>{inp.value='the quick   brown fox jumps over the lazy dog: a NASA case study\nwhy  the   web  needs  better tools';run();status('Sample added. Pick a case.');});
 inp.addEventListener('input',()=>{run();$('tt-count').textContent=inp.value.length+' characters';});status('Ready. Paste text and pick a case.');}
/* ---------- Text statistics ---------- */
if(mode==='stats'){const inp=$('tt-input');let n=1,timer=0;
 const show=()=>{const t=inp.value,s=T.stats(t),stop=$('tt-stop').checked;const box=$('tt-stats');
  const items=[['Words',s.words],['Characters',s.characters],['Characters (no spaces)',s.charactersNoSpaces],['Sentences',s.sentences],['Paragraphs',s.paragraphs],['Unique words',s.uniqueWords],['Reading time',T.duration(s.readingSeconds)],['Speaking time',T.duration(s.speakingSeconds)],['Avg. sentence (words)',s.avgSentenceLength.toFixed(1)],['Avg. word (letters)',s.avgWordLength.toFixed(1)],['Longest word',s.longestWord||'–'],['Flesch reading ease',s.fleschReadingEase===null?'–':s.fleschReadingEase]];
  box.innerHTML=items.map(([k,v])=>'<div><dt>'+esc(k)+'</dt><dd>'+esc(v)+'</dd></div>').join('');
  const rows=T.ngrams(t,n,{stopwords:stop,limit:50});const max=rows[0]?rows[0].count:1;
  $('tt-kw').innerHTML=rows.length?'<div class="tt-table-wrap"><table class="tt-table"><thead><tr><th>Keyword</th><th class="num">Count</th><th class="num">Density</th><th aria-hidden="true"></th></tr></thead><tbody>'+rows.map(r=>'<tr><td>'+esc(r.phrase)+'</td><td class="num">'+r.count+'</td><td class="num">'+r.density.toFixed(2)+'%</td><td><span class="tt-bar" data-w="'+Math.round(r.count/max*100)+'"></span></td></tr>').join('')+'</tbody></table></div>':empty('No keywords yet','Paste or type text on the left. Keywords and phrases appear here as you type.');
  $('tt-kw').querySelectorAll('.tt-bar').forEach(b=>{b.style.width=b.dataset.w+'%';});
  status(s.words?s.words+' words · '+T.duration(s.readingSeconds)+' to read.':'Ready. Paste text to analyse.');};
 const later=()=>{clearTimeout(timer);timer=setTimeout(show,120);};inp.addEventListener('input',later);$('tt-stop').addEventListener('change',show);
 document.querySelectorAll('[data-n]').forEach(b=>b.addEventListener('click',()=>{n=+b.dataset.n;document.querySelectorAll('[data-n]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));show();}));
 $('tt-csv').addEventListener('click',()=>{const t=inp.value;if(!t.trim()){status('Add some text before exporting.');return;}const s=T.stats(t),rows=[['Metric','Value']].concat(Object.entries(s).map(([k,v])=>[k,typeof v==='number'?Math.round(v*100)/100:v]));const kw=[[],['n','Keyword','Count','Density %']];[1,2,3].forEach(k=>T.ngrams(t,k,{stopwords:$('tt-stop').checked,limit:200}).forEach(r=>kw.push([k,r.phrase,r.count,r.density.toFixed(3)])));download('text-statistics.csv',T.csv(rows.concat(kw)),'text/csv;charset=utf-8');status('CSV downloaded.');});
 $('tt-sample').addEventListener('click',()=>{inp.value='Search engines reward useful writing. Useful writing answers the reader\'s question quickly, and it uses the words the reader would use.\n\nKeyword density is a rough guide, not a target. Write for people first; check keyword density afterwards to spot accidental repetition.';show();});
 $('tt-clear').addEventListener('click',()=>{inp.value='';show();inp.focus();});
 $('tt-file').addEventListener('change',async e=>{const f=e.target.files[0];if(f){inp.value=await f.text();show();}e.target.value='';});show();}
/* ---------- Citation generator ---------- */
if(mode==='citation'){const KEY='dailwind:citations',F=['type','authors','title','container','date','volume','issue','pages','publisher','edition','place','url','doi','accessed'];
 let style=store.get('dailwind:citationStyle','apa');const form=id=>$('cg-'+id);const opt=()=>({fixCase:$('cg-case').checked});
 const read=()=>{const o={};F.forEach(k=>{o[k]=(form(k)?.value||'').trim();});return o;};
 const fill=o=>{F.forEach(k=>{if(form(k)&&o[k]!=null)form(k).value=Array.isArray(o[k])?o[k].map(a=>a.org?'{'+a.family+'}':a.given?a.family+', '+a.given:a.family).join('\n'):o[k];});layout();preview();};
 const layout=()=>{const t=form('type').value;document.querySelectorAll('[data-for]').forEach(el=>{el.hidden=!el.dataset.for.split(' ').includes(t);});
  $('cg-container-label').firstChild.textContent={journal:'Journal name',article:'Magazine / newspaper',website:'Website name',book:'Series (optional)'}[t];};
 const preview=()=>{const s=read();if(!s.title&&!s.authors){$('cg-out').innerHTML=empty('Your citation appears here','Fill in a title and author, or look up a DOI.');$('cg-intext').textContent='';return;}const c=T.cite(s,style,opt());$('cg-out').innerHTML=c.html;$('cg-intext').textContent='In-text: '+c.intext;};
 const bib=()=>store.get(KEY,[]);const renderBib=()=>{const list=bib().slice().sort((a,b)=>T.sortKey(a).localeCompare(T.sortKey(b)));$('cg-count').textContent=list.length?'('+list.length+')':'';
  $('cg-bib').innerHTML=list.length?list.map(s=>'<li><span>'+T.cite(s,style,opt()).html+'</span><button type="button" data-del="'+esc(s.id)+'" aria-label="Remove this source">Remove</button></li>').join(''):'<li>'+empty('Your bibliography is empty','Add citations and they are saved in this browser only, sorted alphabetically.')+'</li>';};
 document.querySelectorAll('[data-style]').forEach(b=>{b.setAttribute('aria-pressed',String(b.dataset.style===style));b.addEventListener('click',()=>{style=b.dataset.style;store.set('dailwind:citationStyle',style);document.querySelectorAll('[data-style]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));preview();renderBib();});});
 F.forEach(k=>form(k)?.addEventListener('input',()=>{if(k==='type')layout();preview();}));form('type').addEventListener('change',()=>{layout();preview();});$('cg-case').addEventListener('change',()=>{preview();renderBib();});
 $('cg-copy').addEventListener('click',()=>{const s=read();if(!s.title){status('Add a title first.');return;}const c=T.cite(s,style,opt());copy(c.text,c.html);});
 $('cg-add').addEventListener('click',()=>{const s=read();if(!s.title){status('Add at least a title before saving.');form('title').focus();return;}s.id=Date.now().toString(36)+Math.random().toString(36).slice(2,6);const l=bib();l.push(s);status(store.set(KEY,l)?'Added to your bibliography.':'Could not save: browser storage is full or blocked.');renderBib();});
 $('cg-bib').addEventListener('click',e=>{const id=e.target.closest('[data-del]')?.dataset.del;if(!id)return;store.set(KEY,bib().filter(s=>s.id!==id));renderBib();status('Removed.');});
 $('cg-copyall').addEventListener('click',()=>{const l=bib().sort((a,b)=>T.sortKey(a).localeCompare(T.sortKey(b))).map(s=>T.cite(s,style,opt()));if(!l.length){status('Your bibliography is empty.');return;}copy(l.map(c=>c.text).join('\n\n'),l.map(c=>'<p>'+c.html+'</p>').join(''));});
 $('cg-export').addEventListener('click',()=>{const l=bib().sort((a,b)=>T.sortKey(a).localeCompare(T.sortKey(b))).map(s=>T.cite(s,style,opt()).text);if(!l.length){status('Your bibliography is empty.');return;}download('bibliography-'+style+'.txt',l.join('\n\n')+'\n','text/plain;charset=utf-8');});
 $('cg-clearall').addEventListener('click',()=>{if(!bib().length)return;if(confirm('Remove all '+bib().length+' saved citations from this browser?')){store.set(KEY,[]);renderBib();status('Bibliography cleared.');}});
 $('cg-reset').addEventListener('click',()=>{F.forEach(k=>{if(form(k)&&k!=='type'&&k!=='accessed')form(k).value='';});preview();status('Form cleared.');});
 $('cg-today').addEventListener('click',()=>{form('accessed').value=new Date().toISOString().slice(0,10);preview();});
 $('cg-lookup').addEventListener('click',async()=>{const doi=T.normalizeDOI($('cg-doi-q').value);if(!doi){status('That does not look like a DOI. A DOI starts with 10. , for example 10.1038/nphys1170.');return;}
  const btn=$('cg-lookup');btn.disabled=true;status('Looking up '+doi+' on Crossref…');
  try{const ctl=new AbortController(),tm=setTimeout(()=>ctl.abort(),12000);const r=await fetch('https://api.crossref.org/works/'+encodeURIComponent(doi),{signal:ctl.signal,credentials:'omit',referrerPolicy:'no-referrer'});clearTimeout(tm);
   if(r.status===404)throw Error('Crossref has no record for that DOI (it may be registered with another agency, such as DataCite). Enter the details manually.');if(!r.ok)throw Error('Crossref returned an error ('+r.status+'). Try again later or enter the details manually.');
   const j=await r.json();const o=T.fromCrossref(j.message);o.url=o.type==='website'?o.url:'';fill(o);status('Filled from Crossref. Check the details before you use them.');}
  catch(e){status(e.name==='AbortError'?'Crossref did not respond in time. Enter the details manually.':e.message||'Lookup failed. Enter the details manually.');}finally{btn.disabled=false;}});
 $('cg-doi-q').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();$('cg-lookup').click();}});
 layout();preview();renderBib();status('Ready. Look up a DOI or fill in the form.');}
/* ---------- Synonym explorer ---------- */
if(mode==='synonyms'){let db=null,loading=null;const q=$('se-q'),out=$('se-out'),hist=[];
 async function load(){if(db)return db;if(loading)return loading;status('Loading the WordNet thesaurus (about 4.4 MB, once)…');
  loading=(async()=>{const r=await fetch('../assets/writing/wordnet-3.1.tsv.gz');if(!r.ok)throw Error('Could not load the thesaurus ('+r.status+').');let text;
   if('DecompressionStream' in window)text=await new Response(r.body.pipeThrough(new DecompressionStream('gzip'))).text();else throw Error('This browser cannot decompress the thesaurus. Please update your browser.');
   db=T.parseWordNet(text);status('Ready. '+db.lemmas.toLocaleString()+' words and phrases loaded.');return db;})();loading.catch(e=>{loading=null;status(e.message);});return loading;}
 const chip=(w,cls='')=>'<button type="button" class="tt-chip '+cls+'" data-word="'+esc(w)+'">'+esc(w)+'</button>';
 const row=(label,list,cls)=>list.length?'<div class="tt-chips"><b>'+label+'</b>'+list.map(w=>chip(w,cls)).join('')+'</div>':'';
 async function explore(word,push=true){word=String(word||'').trim();if(!word){out.innerHTML=empty('Explore a word','Type a word to see its meanings, synonyms, broader terms and opposites.');return;}
  try{await load();}catch(e){out.innerHTML=empty('The thesaurus could not load',e.message);return;}
  const r=T.lookup(db,word,$('se-pos').value);q.value=word;if(push&&hist[hist.length-1]!==word)hist.push(word);$('se-back').disabled=hist.length<2;
  if(!r.senses.length){const sug=T.suggest(db,word.slice(0,Math.max(2,word.length-2)),8);out.innerHTML=empty('No entry for “'+word+'”','Check the spelling or try a base form (run, not running).')+(sug.length?'<div class="tt-chips"><b>Did you mean</b>'+sug.map(w=>chip(w)).join('')+'</div>':'');status('No match for “'+word+'”.');return;}
  out.innerHTML=(r.lemma!==word.toLowerCase()?'<p class="mt-note">Showing results for the base form <b>'+esc(r.lemma)+'</b>.</p>':'')+'<div class="tt-btns"><button type="button" id="se-copy">Copy all synonyms ('+r.synonyms.length+')</button></div>'+r.senses.map((s,i)=>'<article class="tt-sense"><h3><small>'+esc(s.pos)+'</small>'+(i+1)+'. '+esc(s.gloss)+'</h3>'+row('Synonyms',s.synonyms)+row('Similar',s.similar)+row('Broader',s.broader)+row('Opposite',s.antonyms,'ant')+(!s.synonyms.length&&!s.similar.length?'<p class="wt-empty">No exact synonyms for this sense; try a broader term.</p>':'')+'</article>').join('');
  $('se-copy').addEventListener('click',()=>copy(r.synonyms.join(', ')));status(r.senses.length+' meaning'+(r.senses.length>1?'s':'')+' for “'+r.lemma+'”.');
  try{history.replaceState(null,'','#'+encodeURIComponent(r.lemma));}catch{}}
 out.addEventListener('click',e=>{const w=e.target.closest('[data-word]')?.dataset.word;if(w){explore(w);q.focus({preventScroll:true});window.scrollTo({top:q.getBoundingClientRect().top+scrollY-90,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});}});
 $('se-form').addEventListener('submit',e=>{e.preventDefault();explore(q.value);});$('se-pos').addEventListener('change',()=>q.value&&explore(q.value,false));
 $('se-back').addEventListener('click',()=>{if(hist.length>1){hist.pop();explore(hist[hist.length-1],false);}});
 let dl;q.addEventListener('input',()=>{clearTimeout(dl);dl=setTimeout(()=>{if(!db)return;$('se-list').innerHTML=T.suggest(db,q.value,8).map(w=>'<option value="'+esc(w)+'">').join('');},150);});
 q.addEventListener('focus',()=>{load().catch(()=>{});},{once:true});
 const h=decodeURIComponent(location.hash.slice(1));if(h)explore(h);else{out.innerHTML=empty('Explore a word','Type a word to see its meanings, synonyms, broader terms and opposites. The thesaurus loads when you start.');status('Ready. The thesaurus loads when you search.');}}
})();
