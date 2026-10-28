'use strict';
(()=>{
 const $=id=>document.getElementById(id),make=(tag,text)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=String(text);return n;};
 const kind=document.body.dataset.preparation,{readFile,LIMITS}=PreparationFiles;
 let docs=[],outputs=[],report=[],busy=false,worker=null,serial=0,url=null;
 const keys=['normalize','hyphens','pages','headers','references','citations','frontmatter','news','html','duplicates','emails','lowercase','urls','digits','punct','softHyphens','ligatures','boxes','controls','zeroWidth','privateUse','mojibake','contents','chapterHeadings','lineNumbers','byline','noiseLines','reflow','repeatedWords'];
 const notice=text=>{$('prep-status').textContent=text;};
 function lock(on){busy=on;document.querySelectorAll('[data-mutates]').forEach(n=>n.disabled=on);$('prep-run').textContent=on?'Working on this device…':$('prep-run').dataset.label;}
 function invalidate(){outputs=[];report=[];$('output-panel').hidden=true;if($('duplicates-panel'))$('duplicates-panel').hidden=true;$('empty-output').hidden=false;}
 function unique(name){let n=name,i=2;while(docs.some(d=>d.name===n))n=name.replace(/(\.[^.]*)?$/,m=>' ('+(i++)+')'+m);return n;}
 function add(name,text){
  if(docs.length>=LIMITS.files)throw Error('Maximum file count reached for this device.');
  if(!text.trim())throw Error('This document has no readable text. Scanned PDFs need OCR first.');
  if(text.length>LIMITS.fileChars||docs.reduce((n,d)=>n+d.text.length,0)+text.length>LIMITS.workspaceChars)throw Error('Character budget reached for this device. Download current results and use another batch.');
  docs.push({id:++serial,name:unique(name.slice(0,150)),text,selected:true});invalidate();renderFiles();
 }
 function renderFiles(){
  $('prep-files').replaceChildren();
  docs.forEach((d,i)=>{
   const row=make('div');row.className='prep-file';
   const check=make('input');check.type='checkbox';check.checked=d.selected;check.disabled=busy;check.dataset.mutates='';check.setAttribute('aria-label','Include '+d.name);
   check.addEventListener('change',()=>{d.selected=check.checked;invalidate();renderFiles();});
   const label=make('div',d.name);label.className='file-name';label.append(make('small',d.text.length.toLocaleString()+' characters'));
   const buttons=make('div');buttons.className='file-buttons';
   for(const [text,action,title]of [['↑',-1,'Move up'],['↓',1,'Move down'],['×',0,'Remove']]){
    const b=make('button',text);b.type='button';b.dataset.mutates='';b.setAttribute('aria-label',title+' '+d.name);
    b.disabled=busy||(action<0&&i===0)||(action>0&&i===docs.length-1);
    b.addEventListener('click',()=>{if(busy)return;if(!action)docs.splice(i,1);else [docs[i],docs[i+action]]=[docs[i+action],docs[i]];invalidate();renderFiles();});buttons.append(b);
   }
   row.append(check,label,buttons);$('prep-files').append(row);
  });
  $('prep-clear').hidden=!docs.length;
  $('prep-count').textContent=docs.filter(d=>d.selected).length+' selected · '+docs.length+' files';
 }
 function settings(){return {...Object.fromEntries(keys.map(k=>[k,!!$('rule-'+k)?.checked])),find:$('prep-find')?.value||'',replace:$('prep-replace')?.value||'',keywords:$('prep-keywords')?.value||'',caseSensitive:$('keyword-case')?.getAttribute('aria-pressed')!=='false',wholeWords:$('keyword-whole')?.checked!==false,keywordLines:$('keyword-lines')?.checked===true,separator:$('merge-separator')?.value||'blank',duplicates:kind==='merger'?$('merge-duplicates').checked:!!$('rule-duplicates')?.checked};}
 function task(action,selected,options){
  return new Promise((resolve,reject)=>{
   worker??=new Worker('../assets/preparation-worker.js?v=81');const id=++serial;
   const timer=setTimeout(()=>{worker.terminate();worker=null;reject(Error('Processing timed out. Try fewer or smaller files. Your imported text remains available.'));},180000);
   worker.onmessage=({data})=>{if(data.id!==id)return;clearTimeout(timer);data.error?reject(Error(data.error)):resolve(data.result);};
   worker.onerror=()=>{clearTimeout(timer);worker.terminate();worker=null;reject(Error('The local worker could not run. Reload the hosted page; do not open HTML directly from a ZIP.'));};
   worker.postMessage({id,kind:action,docs:selected.map(({name,text})=>({name,text})),options});
  });
 }
 async function run(action=kind){
  if(busy)return;const selected=docs.filter(d=>d.selected);if(!selected.length)return notice('Add or paste some text, then select at least one file.');
  lock(true);notice('Processing '+selected.length+' file(s) locally…');
  try{
   const result=await task(action,selected,settings());outputs=result.outputs;report=result.duplicates;
   $('empty-output').hidden=true;$('output-panel').hidden=!outputs.length;if($('duplicates-panel'))$('duplicates-panel').hidden=action!=='duplicates';
   if(action==='duplicates')renderDuplicates();
   if(outputs.length){$('prep-output').replaceChildren();outputs.forEach((d,i)=>{const o=make('option',d.name);o.value=i;$('prep-output').append(o);});$('prep-output').value='0';$('output-summary').textContent=result.inputFiles+' source file(s) → '+outputs.length+' output document(s) · '+outputs.reduce((n,d)=>n+d.text.length,0).toLocaleString()+' output characters';preview();}
   $(action==='duplicates'?'duplicates-panel':'output-panel').scrollIntoView({block:'start',behavior:'auto'});
   notice(action==='duplicates'?'Duplicate check complete. '+report.length+' repeated paragraph group(s); no text removed.':'Ready. Review the preview, then download your new copies. Originals are unchanged.');
  }catch(e){notice(e.message);}finally{lock(false);renderFiles();}
 }
 function preview(){const d=outputs[+$('prep-output').value||0];if(!d)return;$('prep-before').textContent=d.original.slice(0,12000);$('prep-after').textContent=d.text.slice(0,12000);$('prep-audit').replaceChildren();for(const a of d.audit||[]){const row=make('div',a.rule+' · '+a.beforeChars.toLocaleString()+' → '+a.afterChars.toLocaleString()+' characters');row.className='audit-row';$('prep-audit').append(row);}if(kind==='cleaner'&&!d.audit?.length)$('prep-audit').append(make('p','No rules changed this text.'));}
 function download(data,name,type){if(url)URL.revokeObjectURL(url);url=URL.createObjectURL(new Blob([data],{type}));$('download-link').href=url;$('download-link').download=name;$('download-label').textContent=name;$('prep-download').showModal();}
 function save(all=false){if(!outputs.length)return;const ext=$('prep-format').value,names=CorpusExports.names(outputs,ext),data=d=>ext==='docx'?CorpusExports.docx(d.text):d.text;if(all)download(CorpusExports.zip(outputs.map((d,i)=>({name:names[i],data:data(d)}))),kind+'-output.zip','application/zip');else{const i=+$('prep-output').value||0;download(data(outputs[i]),names[i],ext==='docx'?'application/vnd.openxmlformats-officedocument.wordprocessingml.document':'text/plain;charset=utf-8');}}
 function renderDuplicates(){
  $('duplicate-summary').textContent=report.length+' repeated paragraph group(s). Exact case-sensitive matches after whitespace normalization; minimum 30 characters.';
  $('duplicate-list').replaceChildren();for(const item of report.slice(0,100)){const row=make('article');row.className='duplicate-item';row.append(make('strong',item.count+' occurrences'),make('p',item.text.slice(0,1500)),make('small',item.files.join(' · ')));$('duplicate-list').append(row);}if(report.length>100)$('duplicate-list').append(make('p','First 100 groups shown. Download CSV for the complete report.'));
 }
 $('prep-add').addEventListener('click',()=>$('prep-file-input').click());
 $('prep-file-input').addEventListener('change',async e=>{
  if(busy)return;lock(true);const errors=[];try{if(e.target.files.length>LIMITS.files)throw Error('Selection exceeds this device’s file-count limit.');for(const f of e.target.files){notice('Extracting '+f.name+' locally…');try{add(f.name,await readFile(f));}catch(err){errors.push(f.name+': '+err.message);}}notice(errors.length?errors.join(' | '):'Files ready. Review your settings and run the tool.');}catch(err){notice(err.message);}finally{e.target.value='';lock(false);renderFiles();}
 });
 $('prep-paste').addEventListener('click',()=>$('paste-dialog').showModal());
 $('prep-paste-form').addEventListener('submit',e=>{e.preventDefault();try{add($('prep-paste-name').value,$('prep-paste-text').value);$('paste-dialog').close();$('prep-paste-text').value='';notice('Pasted text added locally.');}catch(err){$('paste-error').textContent=err.message;}});
 $('prep-sample').addEventListener('click',()=>{try{add('research-sample.txt','Language research brings patterns into focus.\n\nA repeated paragraph offers an example of recurring language in a corpus.\n\nA repeated paragraph offers an example of recurring language in a corpus.\n\nReferences\nSmith, A. (2024). Language research. https://example.org');add('classroom-sample.txt','Students investigate language through authentic examples.\n\nThe classroom becomes a space for careful reading and discovery.');notice('Two illustrative sample texts added. Choose your settings and run.');}catch(e){notice(e.message);}});
 $('prep-clear').addEventListener('click',()=>{if(busy||!confirm('Remove all files from this preparation desk? Download your results first.'))return;docs=[];invalidate();renderFiles();notice('Files cleared from this desk. Original files on your device are unchanged.');});
 $('prep-run').addEventListener('click',()=>run());$('prep-check-duplicates')?.addEventListener('click',()=>run('duplicates'));
 $('prep-output').addEventListener('change',preview);$('prep-save').addEventListener('click',()=>save());$('prep-batch').addEventListener('click',()=>save(true));
 $('prep-save-audit')?.addEventListener('click',()=>download(JSON.stringify({method:'Local deterministic rules; review required',documents:outputs.map(({name,audit})=>({name,audit}))},null,2),'cleaning-audit.json','application/json'));
 $('duplicates-csv')?.addEventListener('click',()=>{const cell=x=>{const s=String(x),v=typeof x==='string'&&/^\s*[=+@-]/.test(s)?"'"+s:s;return '"'+v.replace(/"/g,'""')+'"';};const rows=[['Paragraph','Occurrences','Files'],...report.map(x=>[x.text,x.count,x.files.join('; ')])];download('\uFEFF'+rows.map(r=>r.map(cell).join(',')).join('\r\n'),'duplicate-paragraphs.csv','text/csv;charset=utf-8');});
 $('prep-preset')?.addEventListener('change',()=>{const preset=$('prep-preset').value;if(preset==='custom')return;const on=AdvancedCleaner.PRESETS[preset]||[];for(const k of keys)$('rule-'+k).checked=on.includes(k);$('prep-find').value='';$('prep-replace').value='';if($('ocr-rules'))$('ocr-rules').open=preset==='ocr';if($('book-rules'))$('book-rules').open=preset==='book';invalidate();});
 $('keyword-case')?.addEventListener('click',()=>{const on=$('keyword-case').getAttribute('aria-pressed')!=='true';$('keyword-case').setAttribute('aria-pressed',String(on));$('keyword-case').textContent='Case sensitive: '+(on?'On':'Off');invalidate();});
 $('prep-settings').addEventListener('change',invalidate);$('prep-settings').addEventListener('input',invalidate);
 document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>b.closest('dialog').close()));renderFiles();
})();
