'use strict';
/* DailwindText: pure functions for the Case Converter, Text Statistics, Citation Generator and Synonym Explorer. */
(function(root,f){const m=f();if(typeof module==='object'&&module.exports)module.exports=m;else root.DailwindText=m;})(typeof self!=='undefined'?self:this,function(){
/* ---------- Case conversion ---------- */
const ART=['a','an','the'],CONJ=['and','but','or','nor','for','so','yet','as','if','than'];
const PREP_SHORT=['at','by','for','in','of','off','on','per','to','up','via','vs','via'];
const PREP_ALL=PREP_SHORT.concat(['about','above','across','after','against','along','among','around','before','behind','below','beneath','beside','between','beyond','down','during','except','from','inside','into','like','near','onto','out','outside','over','past','since','through','throughout','toward','towards','under','underneath','until','upon','with','within','without']);
/* APA 7: lowercase articles, coordinating conjunctions and prepositions of three letters or fewer; capitalise words of four letters or more.
   Chicago 17 (8.159): lowercase articles, prepositions regardless of length, and/but/for/or/nor, "to" and "as". */
const MINOR={apa:new Set(ART.concat(['and','but','or','nor','for','so','yet','as','if']).concat(PREP_SHORT).filter(w=>w.length<=3)),chicago:new Set(ART.concat(['and','but','for','or','nor','to','as']).concat(PREP_ALL))};
const isAcronym=w=>/[A-Z].*[A-Z]/.test(w)||/\d/.test(w)||/[a-z][A-Z]/.test(w);
/* Text that is mostly capitals (shouting, legacy data) has no reliable acronyms to keep. */
const mostlyUpper=t=>{const L=t.match(/\p{L}/gu)||[],U=t.match(/\p{Lu}/gu)||[];return L.length>3&&U.length/L.length>0.6;};
const cap=w=>w.replace(/^(\W*)(\p{L})/u,(m,a,b)=>a+b.toUpperCase());
function titleCase(text,style='apa'){const minor=MINOR[style]||MINOR.apa;if(mostlyUpper(text))text=text.toLowerCase();
 return text.split('\n').map(line=>{const parts=line.split(/(\s+)/);const idx=parts.map((p,i)=>/\S/.test(p)?i:-1).filter(i=>i>=0);
  return parts.map((p,i)=>{if(!/\S/.test(p))return p;if(isAcronym(p))return p;const k=idx.indexOf(i),prev=k>0?parts[idx[k-1]]:'';const first=k===0||/[:.!?—]$/.test(prev)||/^["“(]/.test(p),last=k===idx.length-1;
   return p.split('-').map((seg,j)=>{const core=seg.toLowerCase().replace(/[^\p{L}']/gu,'');if(isAcronym(seg))return seg;const low=seg.toLowerCase();if(!first&&!last&&j===0&&minor.has(core))return low;if(j>0&&style==='chicago'&&minor.has(core))return low;return cap(low);}).join('-');}).join('');}).join('\n');}
function sentenceCase(text,colon=false){let start=true;if(mostlyUpper(text))text=text.toLowerCase();const re=colon?/[\p{L}\p{N}][\p{L}\p{N}'’]*|[.!?:]+|\n/gu:/[\p{L}\p{N}][\p{L}\p{N}'’]*|[.!?]+|\n/gu;return text.replace(re,w=>{if(/^[.!?:]+$/.test(w)||w==='\n'){start=true;return w;}let out=isAcronym(w)?w:(w.toLowerCase()==='i'?'I':w.toLowerCase());if(start&&/\p{L}/u.test(out[0]))out=cap(out);if(/\p{L}|\p{N}/u.test(w))start=false;return out;});}
function words(text){return (text.replace(/([a-z\d])([A-Z])/g,'$1 $2').replace(/([A-Z]+)([A-Z][a-z])/g,'$1 $2').match(/[\p{L}\p{N}]+/gu)||[]).map(w=>w.toLowerCase());}
const lines=(t,f)=>t.split('\n').map(f).join('\n');
const CASES={upper:t=>t.toUpperCase(),lower:t=>t.toLowerCase(),title:t=>titleCase(t,'apa'),'title-chicago':t=>titleCase(t,'chicago'),sentence:sentenceCase,
 camel:t=>lines(t,l=>words(l).map((w,i)=>i?cap(w):w).join('')),pascal:t=>lines(t,l=>words(l).map(cap).join('')),snake:t=>lines(t,l=>words(l).join('_')),kebab:t=>lines(t,l=>words(l).join('-')),constant:t=>lines(t,l=>words(l).join('_').toUpperCase()),
 alternating:t=>{let i=0;return t.replace(/\p{L}/gu,c=>(i++%2?c.toUpperCase():c.toLowerCase()));}};
function convertCase(text,mode){return(CASES[mode]||(t=>t))(text);}
function cleanSpaces(text,{lineBreaks=false,trimLines=true}={}){let t=text.replace(/\r\n?/g,'\n').replace(/[ \t\u00a0]+/g,' ');if(trimLines)t=t.split('\n').map(l=>l.trim()).join('\n');t=lineBreaks?t.replace(/\s*\n+\s*/g,' '):t.replace(/\n{3,}/g,'\n\n');return t.trim();}
/* ---------- Text statistics ---------- */
const STOP=new Set('a about above after again against all am an and any are as at be because been before being below between both but by can could did do does doing down during each few for from further had has have having he her here hers herself him himself his how i if in into is it its itself just let me more most my myself no nor not now of off on once only or other our ours ourselves out over own same she should so some such than that the their theirs them themselves then there these they this those through to too under until up very was we were what when where which while who whom why will with would you your yours yourself yourselves also may might must shall s t don didn doesn isn wasn weren won wouldn couldn shouldn ll re ve d m'.split(' '));
const tokens=t=>(t.toLowerCase().match(/[\p{L}\p{N}]+(?:['’][\p{L}]+)*/gu)||[]).map(w=>w.replace(/’/g,"'"));
function stats(text,{wpm=238,speak=150}={}){const w=tokens(text),chars=[...text].length,noSp=[...text.replace(/\s/g,'')].length;const sentences=(text.match(/[^.!?\n]*[\p{L}\p{N}][^.!?\n]*(?:[.!?]+|\n|$)/gu)||[]).length;
 const paragraphs=text.split(/\n\s*\n/).filter(p=>/\S/.test(p)).length,lineCount=text?text.split('\n').filter(l=>/\S/.test(l)).length:0;const uniq=new Set(w).size;const letters=w.reduce((a,x)=>a+x.length,0);
 const longest=w.reduce((a,x)=>x.length>a.length?x:a,'');const syll=w.reduce((a,x)=>a+syllables(x),0);
 const fk=w.length&&sentences?206.835-1.015*(w.length/sentences)-84.6*(syll/w.length):null;
 return{characters:chars,charactersNoSpaces:noSp,words:w.length,uniqueWords:uniq,sentences,paragraphs,lines:lineCount,avgWordLength:w.length?letters/w.length:0,avgSentenceLength:sentences?w.length/sentences:0,longestWord:longest,syllables:syll,readingSeconds:Math.round(w.length/wpm*60),speakingSeconds:Math.round(w.length/speak*60),lexicalDensity:w.length?uniq/w.length:0,fleschReadingEase:fk===null?null:Math.round(fk*10)/10};}
function syllables(w){w=w.toLowerCase().replace(/[^a-z]/g,'');if(!w)return 0;if(w.length<=3)return 1;w=w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/,'').replace(/^y/,'');const m=w.match(/[aeiouy]{1,2}/g);return Math.max(1,m?m.length:1);}
function ngrams(text,n=1,{stopwords=true,min=1,limit=100}={}){const w=tokens(text),map=new Map();let total=0;
 for(let i=0;i+n<=w.length;i++){const g=w.slice(i,i+n);total++;if(stopwords&&(STOP.has(g[0])||STOP.has(g[n-1])||(n===1&&/^\d+$/.test(g[0]))))continue;const k=g.join(' ');map.set(k,(map.get(k)||0)+1);}
 /* Density = occurrences × n ÷ total words, the share of the text the phrase covers. */
 return[...map].filter(([,c])=>c>=min).sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0])).slice(0,limit).map(([k,c])=>({phrase:k,count:c,density:w.length?c*n/w.length*100:0}));}
function csv(rows){return rows.map(r=>r.map(v=>{v=v==null?'':String(v);if(/^[=+\-@\t\r]/.test(v))v="'"+v;return /[",\n\r]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v;}).join(',')).join('\r\n')+'\r\n';}
function duration(s){if(s<60)return s+' sec';const m=Math.floor(s/60),r=s%60;return m+' min'+(r?' '+r+' sec':'');}
/* ---------- Citations ---------- */
const MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December'];
const MLA_M=['Jan.','Feb.','Mar.','Apr.','May','June','July','Aug.','Sept.','Oct.','Nov.','Dec.'];
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function parseAuthors(input){const list=Array.isArray(input)?input:String(input||'').split(/\n|;/);return list.map(a=>typeof a==='object'?a:String(a).trim()).filter(Boolean).map(a=>{if(typeof a==='object')return{family:(a.family||'').trim(),given:(a.given||'').trim(),org:!!a.org};
 if(/^\{.*\}$/.test(a))return{family:a.slice(1,-1).trim(),given:'',org:true};if(a.includes(','))return{family:a.split(',')[0].trim(),given:a.split(',').slice(1).join(',').trim()};const p=a.split(/\s+/);if(p.length===1)return{family:p[0],given:''};return{family:p.pop(),given:p.join(' ')};});}
const initials=g=>g.split(/\s+/).filter(Boolean).map(p=>p.split('-').map(x=>x[0].toUpperCase()+'.').join('-')).join(' ');
const initialsNoSp=g=>initials(g).replace(/\s+/g,'');
function nameAPA(a){return a.org||!a.given?a.family:a.family+', '+initials(a.given);}
function listJoin(items,amp,serial=true){if(items.length<=1)return items.join('');if(items.length===2)return items[0]+(serial&&amp===' & '?', & ':amp)+items[1];return items.slice(0,-1).join(', ')+','+amp+items[items.length-1];}
function authorsAPA(A){const n=A.map(nameAPA);if(!n.length)return'';if(n.length>20)return n.slice(0,19).join(', ')+', . . . '+n[n.length-1];if(n.length===1)return n[0];return n.slice(0,-1).join(', ')+', & '+n[n.length-1];}
const nameInv=a=>a.org||!a.given?a.family:a.family+', '+a.given,nameDir=a=>a.org||!a.given?a.family:a.given+' '+a.family;
function authorsMLA(A){if(!A.length)return'';if(A.length===1)return nameInv(A[0]);if(A.length===2)return nameInv(A[0])+', and '+nameDir(A[1]);return nameInv(A[0])+', et al';}
function authorsChicago(A){if(!A.length)return'';if(A.length===1)return nameInv(A[0]);if(A.length>10)return nameInv(A[0])+', '+A.slice(1,7).map(nameDir).join(', ')+', et al';return nameInv(A[0])+', '+(A.length===2?'and ':'')+(A.length>2?A.slice(1,-1).map(nameDir).join(', ')+', and ':'')+nameDir(A[A.length-1]);}
const nameH=a=>a.org||!a.given?a.family:a.family+', '+initialsNoSp(a.given);
function authorsHarvard(A){if(!A.length)return'';if(A.length>=4)return nameH(A[0])+' et al.';if(A.length===1)return nameH(A[0]);return A.slice(0,-1).map(nameH).join(', ')+' and '+nameH(A[A.length-1]);}
const end=(s,p='.')=>!s?'':/[.?!]$/.test(s)?s:s+p;
const doiURL=d=>d?'https://doi.org/'+String(d).replace(/^https?:\/\/(dx\.)?doi\.org\//i,'').replace(/^doi:\s*/i,''):'';
const pagesDash=p=>String(p||'').replace(/\s*[-–—]+\s*/g,'–');
function dateParts(s){if(!s)return null;const m=String(s).match(/^(\d{4})(?:-(\d{1,2})(?:-(\d{1,2}))?)?/);return m?{y:+m[1],m:m[2]?+m[2]:0,d:m[3]?+m[3]:0}:null;}
function ordinalEdition(e){e=String(e||'').trim();if(!e||e==='1')return'';if(!/^\d+$/.test(e))return e;const n=+e,s=n%100>=11&&n%100<=13?'th':['th','st','nd','rd'][n%10]||'th';return n+s;}
function cite(src,style,opt={}){if(opt.fixCase){src=Object.assign({},src);const T=x=>x?(style==='apa'||style==='harvard'?sentenceCase(x,true):titleCase(x,style==='chicago'?'chicago':'apa')):x;src.title=T(src.title);if(style==='mla'||style==='chicago'||(src.type!=='website'))src.container=src.container&&src.type!=='website'?titleCase(src.container,style==='chicago'?'chicago':'apa'):src.container;}const A=parseAuthors(src.authors),t=src.type||'book',d=dateParts(src.date)||(src.year?{y:+src.year,m:0,d:0}:null),Y=d?String(d.y):'n.d.',I=s=>s?'<i>'+esc(s)+'</i>':'';
 const title=(src.title||'').trim(),cont=(src.container||'').trim(),vol=src.volume,iss=src.issue,pg=pagesDash(src.pages),pub=(src.publisher||'').trim(),url=(src.url||'').trim(),doi=doiURL(src.doi),link=doi||url,acc=dateParts(src.accessed),ed=ordinalEdition(src.edition),place=(src.place||'').trim();
 let h='';
 if(style==='apa'){const au=authorsAPA(A);const datePart=(t==='website'||t==='article')&&d&&d.m?'('+Y+', '+MONTHS[d.m-1]+(d.d?' '+d.d:'')+').':'('+Y+').';const lead=au?esc(end(au))+' '+datePart:'';
  if(t==='book')h=(au?lead+' ':'')+I(title)+(ed?' ('+esc(ed)+' ed.)':'')+'.'+(au?'':' '+datePart)+(pub?' '+esc(end(pub)):'')+(link?' '+esc(link):'');
  else if(t==='website')h=(au?lead+' ':'')+I(title)+'.'+(au?'':' '+datePart)+(cont&&cont!==au?' '+esc(end(cont)):'')+(!d&&acc?' Retrieved '+MONTHS[acc.m-1]+' '+acc.d+', '+acc.y+', from':'')+(url?' '+esc(url):'');
  else h=(au?lead+' ':'')+esc(end(title))+(au?'':' '+datePart)+(cont?' '+I(cont)+(vol?', '+I(String(vol)):'')+(iss?'('+esc(iss)+')':'')+(pg?', '+esc(pg):'')+'.':'')+(link?' '+esc(link):'');}
 else if(style==='mla'){const au=authorsMLA(A),lead=au?esc(end(au))+' ':'';const dm=d?(d.d?d.d+' ':'')+(d.m?MLA_M[d.m-1]+' ':'')+d.y:'';const L=doi?doi.replace(/^https:\/\//,''):url.replace(/^https?:\/\//,'');
  if(t==='book')h=lead+I(end(title))+(ed?' '+esc(ed)+' ed.,':'')+(pub?' '+esc(pub)+',':'')+(d?' '+d.y+'.':'')+(L?' '+esc(end(L)):'');
  else if(t==='website')h=lead+'“'+esc(end(title))+'” '+(cont?I(cont)+', ':'')+(dm?dm+', ':'')+esc(end(L||''))+(acc?' Accessed '+acc.d+' '+MLA_M[acc.m-1]+' '+acc.y+'.':'');
  else{const parts=[cont?I(cont):'',vol?'vol. '+esc(vol):'',iss?'no. '+esc(iss):'',dm,pg?(/[–,]/.test(pg)?'pp. ':'p. ')+esc(pg):'',L?esc(L):''].filter(Boolean);h=lead+'“'+esc(end(title))+'” '+parts.join(', ')+'.';}}
 else if(style==='chicago'){const au=authorsChicago(A),lead=au?esc(end(au))+' ':'';const md=d&&d.m?MONTHS[d.m-1]+(d.d?' '+d.d:'')+', '+d.y:Y;
  if(t==='book')h=lead+I(end(title))+(ed?' '+esc(ed)+' ed.':'')+' '+(place?esc(place)+': ':'')+(pub?esc(pub)+', ':'')+Y+'.'+(link?' '+esc(link)+'.':'');
  else if(t==='website')h=lead+'“'+esc(end(title))+'” '+(cont?esc(end(cont))+' ':'')+(d?(d.m?md:Y)+'. ':(acc?'Accessed '+MONTHS[acc.m-1]+' '+acc.d+', '+acc.y+'. ':''))+esc(url?end(url):'');
  else if(t==='journal')h=lead+'“'+esc(end(title))+'” '+I(cont)+(vol?' '+esc(vol):'')+(iss?', no. '+esc(iss):'')+' ('+(d&&d.m?MONTHS[d.m-1]+' ':'')+Y+')'+(pg?': '+esc(pg):'')+'.'+(link?' '+esc(link)+'.':'');
  else h=lead+'“'+esc(end(title))+'” '+I(cont)+(cont?', ':'')+md+(pg?', '+esc(pg):'')+'.'+(link?' '+esc(link)+'.':'');}
 else{const au=authorsHarvard(A),lead=(au?esc(au)+' ':'')+'('+Y+') ';const accd=acc?' (Accessed: '+acc.d+' '+MONTHS[acc.m-1]+' '+acc.y+')':'';
  if(t==='book')h=lead+I(title)+'.'+(ed?' '+esc(ed)+' edn.':'')+' '+(place?esc(place)+': ':'')+(pub?esc(end(pub)):'')+(doi?' Available at: '+esc(doi)+accd+'.':'');
  else if(t==='website')h=lead+I(title)+'.'+(cont?' '+esc(end(cont)):'')+(url?' Available at: '+esc(url)+accd+'.':'');
  else h=lead+'‘'+esc(title)+'’, '+I(cont)+(vol?', '+esc(vol):'')+(iss?'('+esc(iss)+')':'')+(pg?', '+(/[–]/.test(pg)?'pp. ':'p. ')+esc(pg):'')+'.'+(link?' Available at: '+esc(link)+accd+'.':'');}
 h=h.replace(/\s{2,}/g,' ').replace(/\.\./g,'.').replace(/<\/i>\.\./g,'</i>.').trim();
 return{html:h,text:h.replace(/<[^>]+>/g,'').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"'),intext:inText(A,Y,style,src)};}
function inText(A,Y,style,src){const fam=A.map(a=>a.family);let who=!fam.length?('“'+(src.title||'Untitled').split(/\s+/).slice(0,4).join(' ')+'”'):fam.length===1?fam[0]:fam.length===2?fam[0]+(style==='apa'?' & ':' and ')+fam[1]:style==='chicago'&&fam.length===3?fam[0]+', '+fam[1]+', and '+fam[2]:fam[0]+(style==='harvard'?' et al.':' et al.');
 if(style==='mla')return'('+who+(src.pages?' '+String(src.pages).split(/[-–]/)[0]:'')+')';if(style==='chicago')return'('+who+' '+Y+')';return'('+who+', '+Y+')';}
function sortKey(src){const A=parseAuthors(src.authors);return((A[0]?A[0].family:'')+' '+(src.title||'')).toLowerCase().replace(/^(the|a|an)\s+/,'');}
function fromCrossref(msg){const typ={'journal-article':'journal','book':'book','monograph':'book','edited-book':'book','reference-book':'book','book-chapter':'book','posted-content':'article','proceedings-article':'article','report':'book','dataset':'website'}[msg.type]||'article';
 const dp=((msg.issued||msg.published||msg['published-print']||msg['published-online']||{})['date-parts']||[[]])[0]||[];const date=dp[0]?[dp[0],dp[1]&&String(dp[1]).padStart(2,'0'),dp[2]&&String(dp[2]).padStart(2,'0')].filter(Boolean).join('-'):'';
 const authors=(msg.author||msg.editor||[]).map(a=>a.family?{family:a.family,given:a.given||''}:{family:a.name||'',given:'',org:true}).filter(a=>a.family);
 const strip=s=>String(s||'').replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim();
 return{type:typ,authors,title:strip((msg.title||[])[0]),container:strip((msg['container-title']||[])[0]),volume:msg.volume||'',issue:msg.issue||'',pages:msg.page||'',publisher:msg.publisher||'',date,doi:msg.DOI||'',url:msg.URL||'',edition:msg['edition-number']||''};}
function normalizeDOI(s){const m=String(s||'').trim().match(/(10\.\d{4,9}\/[^\s"<>]+)/);return m?m[1].replace(/[.,;]$/,''):'';}
/* ---------- WordNet ---------- */
function parseWordNet(text){const iI=text.indexOf('\n#I\n');const syn=text.slice(text.indexOf('\n')+1,iI).split('\n');const idx=new Map();for(const l of text.slice(iI+4).split('\n')){const t=l.indexOf('\t');if(t>0)idx.set(l.slice(0,t),l.slice(t+1));}
 const get=i=>{const p=syn[i].split('\t');return{id:i,pos:p[0],words:p[1].split(','),gloss:p[2],broader:p[3]?p[3].split(',').map(Number):[],similar:p[4]?p[4].split(',').map(Number):[],antonyms:p[5]?p[5].split(','):[]};};return{syn,idx,get,size:syn.length,lemmas:idx.size};}
const EXC={children:'child',men:'man',women:'woman',people:'person',mice:'mouse',feet:'foot',teeth:'tooth',geese:'goose',went:'go',gone:'go',was:'be',were:'be',been:'be',is:'be',are:'be',am:'be',did:'do',done:'do',had:'have',has:'have',said:'say',made:'make',took:'take',taken:'take',saw:'see',seen:'see',got:'get',gotten:'get',gave:'give',given:'give',knew:'know',known:'know',thought:'think',came:'come',better:'good',best:'good',worse:'bad',worst:'bad',ran:'run',began:'begin',begun:'begin',wrote:'write',written:'write',found:'find',felt:'feel',left:'leave',kept:'keep',told:'tell',bought:'buy',brought:'bring'};
const RULES=[['ies','y'],['ves','f'],['ses','s'],['xes','x'],['zes','z'],['ches','ch'],['shes','sh'],['men','man'],['s',''],['ied','y'],['ed','e'],['ed',''],['ing','e'],['ing',''],['er',''],['est',''],['er','e'],['est','e'],['ier','y'],['iest','y']];
function lemmaCandidates(word){const w=String(word||'').toLowerCase().trim().replace(/\s+/g,' ').replace(/’/g,"'");const out=[w];if(EXC[w])out.push(EXC[w]);for(const[a,b]of RULES)if(w.length>a.length+1&&w.endsWith(a))out.push(w.slice(0,-a.length)+b);const m=w.match(/^(.*?)([b-df-hj-np-tv-z])\2(ed|ing|er|est)$/);if(m)out.push(m[1]+m[2]);return[...new Set(out)];}
function lookup(db,word,pos){const POS={n:'noun',v:'verb',a:'adjective',s:'adjective',r:'adverb'};const cands=lemmaCandidates(word);let lemma='',ids=[];for(const c of cands){const v=db.idx.get(c)||db.idx.get(c.replace(/-/g,' '));if(v){lemma=c;ids=v.split(',').map(Number);break;}}
 const senses=ids.map(db.get).filter(s=>!pos||pos==='all'||s.pos===pos).map(s=>({pos:POS[s.pos]||s.pos,posCode:s.pos,gloss:s.gloss,synonyms:s.words.filter(x=>x!==lemma),broader:[...new Set(s.broader.flatMap(i=>db.get(i).words.slice(0,3)))],similar:[...new Set(s.similar.flatMap(i=>db.get(i).words.slice(0,3)))].filter(x=>x!==lemma),antonyms:s.antonyms}));
 const all=[...new Set(senses.flatMap(s=>s.synonyms.concat(s.similar)))];return{query:word,lemma,senses,synonyms:all,antonyms:[...new Set(senses.flatMap(s=>s.antonyms))]};}
function suggest(db,prefix,limit=8){prefix=String(prefix||'').toLowerCase().trim();if(prefix.length<2)return[];const out=[];for(const k of db.idx.keys()){if(k.startsWith(prefix)){out.push(k);if(out.length>=limit)break;}}return out;}
return{titleCase,sentenceCase,convertCase,cleanSpaces,words,CASES:Object.keys(CASES),stats,ngrams,syllables,STOP,csv,duration,parseAuthors,cite,inText,sortKey,fromCrossref,normalizeDOI,doiURL,parseWordNet,lemmaCandidates,lookup,suggest};});
