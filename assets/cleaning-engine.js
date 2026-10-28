'use strict';
// Explicit edits only. No language model, inferred words or silent character recovery.
(function(root){
const PRESETS={gentle:[],paper:['normalize','hyphens','pages','headers','references'],article:['normalize','hyphens','pages','headers'],news:['normalize','news','html'],thesis:['normalize','hyphens','pages','headers','references'],book:['normalize','hyphens','pages','headers','softHyphens','ligatures'],ocr:['normalize','hyphens','pages','headers','softHyphens','ligatures','boxes','controls','zeroWidth'],poetry:[],custom:[]};
function clean(source,o={}){
 const original=String(source);let text=original,audit=[];
 const apply=(rule,fn)=>{const before=text;text=fn(text);if(text!==before)audit.push({rule,beforeChars:before.length,afterChars:text.length,removedChars:Math.max(0,before.length-text.length)});};
 if(o.mojibake)apply('Repair known broken UTF-8 punctuation',s=>{const map={'â€™':'’','â€˜':'‘','â€œ':'“','â€\u009d':'”','â€“':'–','â€”':'—','â€¦':'…','Â ':' ','ï»¿':''};return s.replace(/â€™|â€˜|â€œ|â€\u009d|â€“|â€”|â€¦|Â |ï»¿/g,x=>map[x]);});
 if(o.controls)apply('Remove non-printing control characters',s=>s.replace(/[\u0000-\u0008\u000b\u000e-\u001f\u007f-\u009f]/g,''));
 if(o.zeroWidth)apply('Remove invisible zero-width/BOM noise',s=>s.replace(/[\u200b\u2060\ufeff]/g,''));
 if(o.boxes)apply('Remove replacement and box placeholders',s=>s.replace(/[\ufffd\u25a0\u25a1\u25af\u2610\u2612]/g,' '));
 if(o.privateUse)apply('Remove private-use font codes (unrecoverable glyphs)',s=>s.replace(/[\ue000-\uf8ff\u{f0000}-\u{ffffd}\u{100000}-\u{10fffd}]/gu,' '));
 if(o.softHyphens)apply('Remove soft hyphens',s=>s.replace(/\u00ad/g,''));
 if(o.ligatures)apply('Expand Latin ligatures / long s',s=>s.replace(/[ﬀﬁﬂﬃﬄﬅﬆſ]/g,c=>({'ﬀ':'ff','ﬁ':'fi','ﬂ':'fl','ﬃ':'ffi','ﬄ':'ffl','ﬅ':'st','ﬆ':'st','ſ':'s'}[c])));
 if(o.contents)apply('Contents headings and dotted-leader entries',s=>s.split('\n').filter(l=>!/^\s*(?:table of )?contents\s*$/i.test(l)&&!/^.{1,180}\.{3,}\s*(?:[ivxlcdm]+|\d{1,5})\s*$/i.test(l)).join('\n'));
 if(o.chapterHeadings)apply('Numbered chapter / part headings',s=>s.split('\n').filter(l=>!/^\s*(?:chapter|part|book)\s+(?:[ivxlcdm]+|\d+)(?:\s*[:.\-–—]\s*[^\n]{0,100})?\s*$/i.test(l)).join('\n'));
 if(o.lineNumbers)apply('Leading line / list numbers (opt-in)',s=>s.replace(/^[ \t]*\d{1,5}[.)]?[ \t]+(?=\p{L})/gmu,''));
 if(o.byline)apply('Standalone byline / date labels',s=>s.split('\n').filter(l=>!/^\s*(?:by\s+[A-Z][\p{L}.'’ -]{2,70}|(?:published|updated|last updated)\s*:\s*.{1,100})\s*$/iu.test(l)).join('\n'));
 if(o.noiseLines)apply('Symbol-only scan-noise lines',s=>s.split('\n').filter(l=>!(!/[\p{L}\p{N}]/u.test(l)&&/[|~^_*=#]/.test(l)&&l.trim().length>=3)).join('\n'));
 // Existing reference/page rules need line boundaries, so reflow follows them.
 const base=root.ArcEngine.smartClean(text,{...o,find:'',replace:'',normalize:o.normalize!==false});
 text=base.text;audit.push(...base.audit);
 const keywords=String(o.keywords||'').split(/\r?\n/).map(s=>s.trim()).filter(Boolean);
 if(keywords.length>200||keywords.some(k=>k.length>200))throw Error('Use at most 200 keywords/phrases, up to 200 characters per line.');
 const escape=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),flags=o.caseSensitive===false?'giu':'gu';
 const expression=term=>new RegExp((o.wholeWords===false?'':'(?<![\\p{L}\\p{N}_])')+escape(term)+(o.wholeWords===false?'':'(?![\\p{L}\\p{N}_])'),flags);
 if(keywords.length)apply('Custom keyword removal · '+(o.caseSensitive===false?'ignore case':'case sensitive')+' · '+(o.keywordLines?'matching lines':'matches'),s=>{
  // Literal terms, never user-provided regular expressions. Longest phrases first.
  const terms=[...new Set(keywords)].sort((a,b)=>b.length-a.length).map(expression);
  if(o.keywordLines)return s.split('\n').filter(line=>!terms.some(re=>{re.lastIndex=0;return re.test(line);})).join('\n');
  for(const re of terms)s=s.replace(re,' ');return s;
 });
 if(o.find){if(String(o.find).length>200)throw Error('Find text is limited to 200 characters.');apply('Literal find/replace · '+(o.caseSensitive===false?'ignore case':'case sensitive'),s=>s.replace(new RegExp(escape(String(o.find)),o.caseSensitive===false?'giu':'gu'),()=>String(o.replace||'').slice(0,200)));}
 if(o.reflow)apply('Reflow wrapped prose lines (paragraphs retained)',s=>s.split(/\n\s*\n/).map(p=>p.split('\n').reduce((out,l)=>{if(!out.length)return [l];const previous=out[out.length-1];const heading=x=>x.trim().length<75&&(/^[A-Z\d\W]+$/.test(x)||/^(?:chapter|part|section)\b/i.test(x));if(heading(previous)||heading(l)||/^\s*(?:[-•*]|\d+[.)])\s/.test(l))out.push(l);else out[out.length-1]+=' '+l.trim();return out;},[]).join('\n')).join('\n\n'));
 if(o.repeatedWords)apply('Collapse adjacent repeated English words',s=>s.replace(/\b([a-z]+)([ \t]+)\1\b/gi,(m,w,space)=>/^(had|that)$/i.test(w)?m:w));
 apply('Final whitespace cleanup',s=>s.split('\n').map(l=>l.replace(/[^\S\n]+/g,' ').trim()).join('\n').replace(/\n{3,}/g,'\n\n').trim());
 return {text,audit,originalChars:original.length,cleanedChars:text.length};
}
const api={clean,PRESETS};root.AdvancedCleaner=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof self!=='undefined'?self:globalThis);
