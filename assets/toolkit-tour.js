'use strict';
(()=>{
 const box=document.querySelector('[data-toolkit-tour]');if(!box)return;
 const scenes=[
 ['✧','PREPARE TEXT','Clean data. Keep the meaning.','Books, theses and articles. A clear audit of every change.','Corpus Cleaner','corpus-cleaner','Original → Cleaned → Reviewed','#007a7d','#e0f5f3'],
 ['▥','PDF & IMAGES','A thousand pages. Your choice of parts.','Divide a book by part count or page ranges. Optimize your copies.','PDF Tools','pdf-tools','Open PDF → Choose parts → Download','#0066cc','#e5efff'],
 ['≡','ANALYZE LANGUAGE','Every word has a context.','Concordance, collocations, frequencies and research charts.','Corpus Toolkit','corpus-toolkit','Import → Explore → Compare','#0066cc','#e5efff'],
 ['▦','CATALOGUE & REPORT','Know what is in your corpus.','Source details, word counts and editable Excel catalogues.','Metadata Studio','metadata-studio','Files → Metadata → Excel','#a45412','#fff0dd'],
 ['▤','PDF & IMAGES','Give a printed page a new voice.','Recognize printed English. Review every page before export.','English OCR','english-ocr','Scan → Recognize → Review','#007a7d','#e0f5f3'],
 ['¶','ANALYZE LANGUAGE','Read between the patterns.','Foregrounding, parallelism and deviation candidates for close reading.','Stylistic Toolkit','stylistic-toolkit','Read → Examine → Annotate','#7349c6','#efe8ff'],
 ['⇄','PREPARE TEXT','New format. Same words.','Extract selectable PDF and Word text into TXT or text-only DOCX.','File Converter','file-converter','Document → Extract → Save','#7349c6','#efe8ff'],
 ['⊕','PREPARE TEXT','Many sources. One corpus.','Arrange texts and choose how they come together.','Corpus Merger','corpus-merger','Select → Arrange → Combine','#a45412','#fff0dd'],
 ['▧','PDF & IMAGES','From pages to pixels. And back.','PDF image ZIPs, image collections and smaller photographs.','Image Studio','image-tools','Pages ↔ Images → Smaller copies','#b72e69','#ffebf3'],
 ['✓','PREPARE TEXT','A careful check before MAT.','Prepare and organize raw text for your next analysis in MAT.','MAT Tagger Cleaner','mat-cleaner','Select → Prepare → Download','#0066cc','#e5efff']
 ];
 const find=s=>box.querySelector(s);let index=0,timer=null,visible=true,paused=false,globalPaused=false;
 const progress=document.createElement('div');progress.className='tour-progress';progress.setAttribute('aria-hidden','true');progress.append(document.createElement('span'));find('.tour-controls').before(progress);
 scenes.forEach((s,i)=>{const b=document.createElement('button');b.type='button';b.setAttribute('aria-label','Show '+s[4]);b.addEventListener('click',()=>{index=i;render();sync();});find('[data-tour-dots]').append(b);});
 function render(){const s=scenes[index];for(const [key,value]of [['symbol',s[0]],['category',s[1]],['title',s[2]],['description',s[3]],['caption',s[6]],['count',String(index+1).padStart(2,'0')+' / '+scenes.length]])find('[data-tour-'+key+']').textContent=value;
  const link=find('[data-tour-link]');link.href=s[5]+'/';link.textContent='Explore '+s[4]+' ↗';[...find('[data-tour-dots]').children].forEach((b,i)=>b.setAttribute('aria-current',String(i===index)));
  box.style.setProperty('--tour-accent',s[7]);box.style.setProperty('--tour-soft',s[8]);box.classList.remove('is-changing');requestAnimationFrame(()=>box.classList.add('is-changing'));
 }
 function sync(){clearTimeout(timer);timer=null;box.classList.remove('is-running');if(paused||globalPaused||document.hidden||!visible)return;
  // Advance even when the OS reduces motion; CSS removes moving transitions.
  // Navigation buttons retain keyboard focus without accidentally stopping playback.
  requestAnimationFrame(()=>{if(timer!==null)box.classList.add('is-running');});
  timer=setTimeout(()=>{index=(index+1)%scenes.length;render();sync();},5000);
 }
 for(const [key,step]of [['prev',-1],['next',1]])find('[data-tour-'+key+']').addEventListener('click',()=>{index=(index+step+scenes.length)%scenes.length;render();sync();});
 find('[data-tour-pause]').addEventListener('click',e=>{paused=!paused;e.currentTarget.textContent=paused?'Play tour':'Pause tour';e.currentTarget.setAttribute('aria-pressed',String(paused));sync();});
 document.querySelectorAll('[data-motion-toggle]').forEach(b=>b.addEventListener('click',()=>{globalPaused=b.getAttribute('aria-pressed')==='true';sync();}));
 document.addEventListener('visibilitychange',sync);window.addEventListener('pageshow',sync);
 if('IntersectionObserver'in window)new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();},{threshold:0,rootMargin:'160px'}).observe(box);
 render();sync();
})();
