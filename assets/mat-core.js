'use strict';
// Independent preparation/preflight utility. It does not run or replace MAT.
(function(root){
const EXCLUDE=/_\W|\[\w+\]|_POS/; // ASCII semantics used by the examined Perl counter.
const PENN=new Set('CC CD DT EX FW IN JJ JJR JJS LS MD NN NNS NNP NNPS PDT POS PRP PRP$ RB RBR RBS RP SYM TO UH VB VBD VBG VBN VBP VBZ WDT WP WP$ WRB -LRB- -RRB-'.split(' '));
function safeName(name,tagged=false){let stem=String(name).replace(/\.txt$/i,'').replace(/[\x00-\x1f<>:"/\\|?*]/g,'_').replace(/^\.+/,'').trim().slice(0,110)||'document';if(/^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])(?:\.|$)/i.test(stem))stem='file_'+stem;if(tagged)stem=stem.replace(/_MAT$/i,'')+'_MAT';return stem.replace(/[ .]+$/,'')+'.txt';}
function process(raw,o={}){
 let text=String(raw),audit=[];const mode=o.mode==='tagged'?'tagged':'raw';
 const length=s=>{let n=0;for(const c of s)n++;return n;};
 const apply=(rule,fn)=>{const previous=text;text=fn(text);if(text!==previous)audit.push({rule,before:length(previous),after:length(text)});};
 apply('Normalize line endings and remove BOM',s=>s.replace(/^\uFEFF/,'').replace(/\r\n?/g,'\n'));
 if(o.controls!==false)apply('Remove NUL, unsafe controls and zero-width artifacts',s=>s.replace(/[\u0000-\u0008\u000B\u000E-\u001F\u007F\u200B-\u200F\u202A-\u202E\u2060\u2066-\u2069\uFEFF]/g,'').replace(/\f/g,'\n\n'));
 if(o.softHyphens!==false)apply('Remove soft hyphens',s=>s.replace(/\u00AD/g,''));
 if(mode==='raw'){
  if(o.punctuation!==false)apply('Standardize selected punctuation / spaces',s=>s.replace(/[\u2018\u2019\u02BC]/g,"'").replace(/[\u201C\u201D]/g,'"').replace(/\u00A0|\u202F/g,' ').replace(/[\u2013\u2014]/g,' -- ').replace(/\u2026/g,'...'));
  if(o.ligatures)apply('Expand printing ligatures / long s',s=>s.replace(/[ﬀﬁﬂﬃﬄſ]/g,c=>({'ﬀ':'ff','ﬁ':'fi','ﬂ':'fl','ﬃ':'ffi','ﬄ':'ffl','ſ':'s'})[c]));
  if(o.dehyphenate)apply('Join line-end hyphens (review required)',s=>s.replace(/([A-Za-z])-\s*\n\s*([a-z])/g,'$1$2'));
  if(o.boxes)apply('Remove selected OCR placeholders (letters are not recovered)',s=>s.replace(/[\uFFFD\u25A0\u25A1\u25AF]/g,''));
  if(o.spacing!==false)apply('Normalize horizontal spacing / excess blank lines',s=>s.replace(/[\t \u0085\u00A0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000]+/g,' ').replace(/ *\n */g,'\n').replace(/\n{3,}/g,'\n\n').trim());
 }else if(o.spacing!==false)apply('Normalize token spacing only; preserve tag spellings',s=>s.replace(/[\t \u0085\u00A0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000]+/g,' ').replace(/ *\n */g,'\n').replace(/\n{3,}/g,'\n\n').trim());
 const tokens=text.trim()?text.trim().split(/\s+/):[];let baseline=0;for(const m of text.matchAll(/[^\t\n\v\f\r ]+/g))if(!EXCLUDE.test(m[0]))baseline++;
 let tagged=0,untagged=0,bracketMarkers=0,penn=0;const bad=[],warnings=[];
 for(const token of tokens){if(/^\[[A-Za-z0-9_]+\]$/.test(token)){bracketMarkers++;continue;}const m=/^(.+)_([^\s]+)$/.exec(token);if(m){tagged++;if(PENN.has(m[2]))penn++;if(!/^[A-Z][A-Z0-9$-]*$|^[.,:;!?`'"#$()-]+$/.test(m[2])){if(bad.length<12)bad.push(token.slice(0,100));}}else{untagged++;if(bad.length<12)bad.push(token.slice(0,100));}}
 let letters=0,nonASCII=0,characters=0;for(const c of text){characters++;if(/[A-Za-z]/.test(c))letters++;if(c.codePointAt(0)>127)nonASCII++;}
 if(/\uFFFD|[\u25A0\u25A1\u25AF]/.test(text))warnings.push('Replacement characters / OCR boxes remain; inspect the source. Missing text cannot be reconstructed.');
 if(nonASCII)warnings.push(nonASCII+' non-ASCII characters remain. Review encoding; MAT is an English analysis tool.');
 let status,bucket,reason;
 if(!text.trim()||!letters){status='Blocked';bucket='review';reason='Empty or no Latin-letter content. Do not send this file to MAT counting.';}
 else if(mode==='raw'){
  if(tagged||bracketMarkers){status='Review';bucket='review';reason='Tag-like content detected in plain-text mode. Switch to tagged preflight; do not strip existing annotations.';}
  else {status='Tag first';bucket='ready-for-tagging';reason='Prepared plain text. Use MAT Tag or Tag and Analyze; do not use Count/Analyze directly.';}
 }else if(!baseline){status='Blocked';bucket='review';reason='Zero counter-baseline tokens: this can trigger the division-by-zero condition at count_only.pl line 100.';}
 else if(!tagged||untagged||bad.length){status='Review';bucket='review';reason='Missing or malformed word_TAG tokens. Re-tag from the original text; renaming a file does not create valid MAT annotations.';}
 else if(!/_MAT\.txt$/i.test(o.name||'')){status='Review';bucket='review';reason='Tagged syntax found, but filename is not *_MAT.txt. Confirm that this is the final MAT output, not Stanford-only POS output.';}
 else {status='Preflight passed';bucket='count-input';reason='Nonzero baseline and word_TAG syntax checked. This is not a guarantee of tagging quality or every MAT calculation.';}
 if(mode==='tagged'&&tagged&&penn===tagged&&!bracketMarkers)warnings.push('Only Penn-style tag suffixes detected. Verify this is final MAT output, not an ST_ intermediate file.');
 const ttr=Number(o.ttr)||400;if(mode==='tagged'&&baseline&&baseline<ttr)warnings.push('Only '+baseline+' baseline tokens; choose a TTR window no larger than the shortest eligible file ('+ttr+' requested).');
 if(mode==='tagged'&&status==='Preflight passed'&&/[\u0085\u00A0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000]/.test(text)){status='Review';bucket='review';reason='Non-ASCII whitespace remains. Enable spacing normalization or inspect token separators before counting.';}
 if(mode==='tagged'&&/^ST_/i.test(o.name||'')){status='Review';bucket='review';reason='ST_ filename suggests Stanford intermediate output. Run the MAT tagging stage before counting.';}
 return {text,status,bucket,reason,warnings,audit,metrics:{characters,whitespace_tokens:tokens.length,counter_baseline:baseline,tagged_tokens:tagged,untagged_tokens:untagged,bracket_markers:bracketMarkers,latin_letters:letters,non_ascii:nonASCII},examples:mode==='tagged'?bad:[],outputName:safeName(o.name||'document.txt',bucket==='count-input')};
}
const api={process,safeName};root.ArcMAT=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof self!=='undefined'?self:globalThis);
