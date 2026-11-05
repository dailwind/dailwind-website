/* Dailwind writing engine: grammar/style checks, readability, heuristic AI-likeness, rule-based rewriting.
   Runs entirely on-device. Wordlist: SCOWL via wordlist-english (MIT), (c) Kevin Atkinson. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.DailwindWriting=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const WORD=/[A-Za-z][A-Za-z'’-]*[A-Za-z]|[A-Za-z]/g;
function sentences(text){const out=[];const re=/[^.!?\n]+(?:[.!?]+["')\]]*|\n|$)/g;let m;while((m=re.exec(text))){if(!m[0].trim()){if(re.lastIndex===m.index)re.lastIndex++;continue;}const lead=m[0].length-m[0].trimStart().length;const t=m[0].trim();out.push({text:t,start:m.index+lead,end:m.index+lead+t.length});if(re.lastIndex===m.index)re.lastIndex++;}return out;}
function words(text){const out=[];let m;WORD.lastIndex=0;while((m=WORD.exec(text)))out.push({w:m[0],start:m.index,end:m.index+m[0].length});return out;}
function syllables(w){w=w.toLowerCase().replace(/[^a-z]/g,'');if(!w)return 0;if(w.length<=3)return 1;w=w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/,'').replace(/^y/,'');const g=w.match(/[aeiouy]{1,2}/g);return Math.max(1,g?g.length:1);}
function readability(text){const s=sentences(text).filter(x=>/[A-Za-z]/.test(x.text));const w=words(text);const syl=w.reduce((a,x)=>a+syllables(x.w),0);const ns=Math.max(1,s.length),nw=Math.max(1,w.length);const flesch=206.835-1.015*(nw/ns)-84.6*(syl/nw);const grade=0.39*(nw/ns)+11.8*(syl/nw)-15.59;return{words:w.length,sentences:s.length,syllables:syl,characters:text.length,flesch:Math.round(flesch*10)/10,grade:Math.round(Math.max(0,grade)*10)/10,readingMinutes:Math.max(w.length?1:0,Math.round(w.length/238)),avgSentence:Math.round(nw/ns*10)/10};}
function fleschLabel(f){return f>=80?'Very easy':f>=60?'Plain English':f>=50?'Fairly difficult':f>=30?'Difficult':'Very difficult';}

/* ---------- spelling ---------- */
let DICT=null,RANK=null;
const EXTRA="i a i'm i've i'll i'd you're you've you'll you'd he's she's it's we're we've we'll they're they've they'll they'd isn't aren't wasn't weren't don't doesn't didn't can't couldn't won't wouldn't shouldn't haven't hasn't hadn't mustn't let's that's there's here's what's who's where's how's ok okay email online website app apps internet google dailwind covid wifi blog smartphone login signup".split(' ');
function loadDictionary(list){DICT=new Set();RANK=new Map();const arr=Array.isArray(list)?list:String(list).split(/\r?\n/);arr.forEach((w,i)=>{w=w.trim().toLowerCase();if(w&&!DICT.has(w)){DICT.add(w);RANK.set(w,i);}});EXTRA.forEach(w=>DICT.add(w));return DICT.size;}
function addWords(list){if(!DICT)DICT=new Set();list.forEach(w=>DICT.add(String(w).toLowerCase()));}
function hasDictionary(){return !!DICT;}
function known(w){w=w.toLowerCase().replace(/’/g,"'");if(DICT.has(w))return true;if(w.includes('-'))return w.split('-').every(p=>!p||DICT.has(p));const base=w.replace(/'s$/,'');if(base!==w&&DICT.has(base))return true;
 for(const[suf,rep]of[['s',''],['es',''],['ies','y'],['ed',''],['ed','e'],['ing',''],['ing','e'],['ly',''],['er',''],['est',''],['ness',''],['ment',''],['ers',''],['ings','']]){if(w.endsWith(suf)&&w.length>suf.length+2){const b=w.slice(0,-suf.length)+rep;if(DICT.has(b))return true;if(/(.)\1$/.test(b)&&DICT.has(b.slice(0,-1)))return true;}}return false;}
const AB='abcdefghijklmnopqrstuvwxyz';
function edits1(w){const o=new Set();for(let i=0;i<=w.length;i++){const a=w.slice(0,i),b=w.slice(i);if(b)o.add(a+b.slice(1));if(b.length>1)o.add(a+b[1]+b[0]+b.slice(2));for(const c of AB){if(b)o.add(a+c+b.slice(1));o.add(a+c+b);}}return o;}
function suggest(word,max=4){if(!DICT)return[];const w=word.toLowerCase();const score=x=>RANK.has(x)?RANK.get(x):1e6;let c=[...edits1(w)].filter(x=>DICT.has(x));if(!c.length&&w.length<=12){const s=new Set();for(const e of edits1(w))for(const e2 of edits1(e))if(DICT.has(e2))s.add(e2);c=[...s];}
 const COMMON=' the be to of and a in that have it for not on with he as you do at this but his by from they we say her she or an will my one all would there their what so up out if about who get which go me when make can like time no just him know take people into year your good some could them see other than then now look only come its over think also back after use two how our work first well way even new want because any these give day most us is are was were has had did said '; const sorted=(x)=>{const t=(x.length===w.length&&[...x].sort().join('')===[...w].sort().join(''))?-5e5:0;return score(x)+t-(COMMON.includes(' '+x+' ')?9e5:0);};c.sort((a,b)=>sorted(a)-sorted(b));const cap=word[0]===word[0].toUpperCase()&&word[0]!==word[0].toLowerCase();return c.slice(0,max).map(x=>cap?x[0].toUpperCase()+x.slice(1):x);}

/* ---------- rule data ---------- */
const CONFUSION=[
 [/\b(their)\s+(is|are|was|were|will|has|have)\b/gi,'there','“Their” is possessive. For existence, use “there”.'],
 [/\b(there)\s+(own|car|house|home|dog|friends?|family|book|team|work|job|parents|children|kids|names?)\b/gi,'their','“There” is a place; use possessive “their”.'],
 [/\b(they're)\s+(own|car|house|home|friends?|family|team)\b/gi,'their','“They’re” means “they are”; use possessive “their”.'],
 [/\b(your)\s+(welcome|right|wrong|going|not|being|doing|the best|so|very|a|an)\b/gi,"you're",'“Your” is possessive. Here you mean “you are”.'],
 [/\b(you're)\s+(own|car|house|name|friend|account|phone|email|work|job)\b/gi,'your','“You’re” means “you are”; use possessive “your”.'],
 [/\b(its)\s+(a|an|the|not|been|going|very|so|time|been|raining|true|important|easy|hard)\b/gi,"it's",'“Its” is possessive. Here you mean “it is” or “it has”.'],
 [/\b(it's)\s+(own|color|colour|name|size|value|purpose|way|tail|owner)\b/gi,'its','“It’s” means “it is”; use possessive “its”.'],
 [/\b(more|less|better|worse|bigger|smaller|faster|slower|higher|lower|rather|other|greater|older|younger)\s+(then)\b/gi,'than','Use “than” for comparisons.',2],
 [/\b(could|would|should|must|might)\s+(of)\b/gi,'have','“Could of” is a mishearing of “could have”.',2],
 [/\b(an?|the)\s+(affect)\b/gi,'effect','As a noun, use “effect” (the result).',2],
 [/\b(will|to|can|may|might|could|would|does|did|not)\s+(effect)\b/gi,'affect','As a verb meaning “influence”, use “affect”.',2],
 [/\b(loose)\s+(the|my|your|his|her|our|their|weight|money|it)\b/gi,'lose','“Loose” means not tight; to misplace or fail to keep is “lose”.'],
 [/\b(alot)\b/gi,'a lot','“A lot” is two words.'],
 [/\b(irregardless)\b/gi,'regardless','Use “regardless”.'],
 [/\b(should|would|could)\s+(of)\b/gi,'have','Use “have” after modal verbs.',2],
 [/\b(who's)\s+(car|house|book|turn|phone|idea)\b/gi,'whose','“Who’s” means “who is”; possessive is “whose”.'],
 [/\b(to)\s+(much|many|late|early|big|small|far|fast|soon)\b/gi,'too','Use “too” to mean excessively.'],
 [/\b(accept)\s+(for)\b/gi,'except','To exclude, use “except”.'],
];
const WORDY=[['in order to','to'],['due to the fact that','because'],['at this point in time','now'],['at the present time','now'],['in the event that','if'],['for the purpose of','to'],['in spite of the fact that','although'],['has the ability to','can'],['have the ability to','can'],['are able to','can'],['more better','better'],['more worse','worse'],['most best','best'],['is able to','can'],['a large number of','many'],['a majority of','most'],['in close proximity to','near'],['with regard to','about'],['with respect to','about'],['in regard to','about'],['prior to','before'],['subsequent to','after'],['make a decision','decide'],['come to a conclusion','conclude'],['take into consideration','consider'],['each and every','every'],['first and foremost','first'],['basically',''],['actually',''],['very unique','unique'],['completely finished','finished'],['end result','result'],['past history','history'],['free gift','gift'],['advance planning','planning'],['close proximity','proximity'],['the reason why is because','because'],['in my opinion, i think','I think'],['it is important to note that',''],['needless to say',''],['all of the','all the']];
const CLICHES=['at the end of the day','think outside the box','low-hanging fruit','touch base','game changer','game-changer','a perfect storm','avoid it like the plague','only time will tell','in the nick of time','last but not least','better late than never','it goes without saying','the bottom line','move the needle','circle back','paradigm shift','tip of the iceberg','when all is said and done','read between the lines','hit the ground running','a dime a dozen','the elephant in the room'];
const FORMAL={utilize:'use',utilise:'use',utilization:'use',commence:'start',facilitate:'help',endeavor:'try',endeavour:'try',ascertain:'find out',demonstrate:'show',approximately:'about',purchase:'buy',sufficient:'enough',numerous:'many',assist:'help',additional:'more',obtain:'get',require:'need',terminate:'end',subsequently:'later',therefore:'so',however:'but',nevertheless:'still',individuals:'people',regarding:'about',inquire:'ask',initiate:'start',implement:'carry out',optimal:'best',leverage:'use',endeavors:'efforts'};
const AI_PHRASES=["delve","delves","delving","tapestry","testament to","in today's fast-paced","in today’s fast-paced","in the ever-evolving","ever-evolving","landscape of","it is important to note","it's important to note","it is worth noting","plays a crucial role","plays a pivotal role","pivotal","crucial role","seamless","seamlessly","robust","leverage","harness the power","unlock the potential","navigate the complexities","furthermore","moreover","additionally","in conclusion","in summary","overall,","holistic","multifaceted","nuanced","foster","fostering","embark","realm","paramount","underscores","underscore","showcasing","showcase","a myriad of","myriad","vibrant","bustling","intricate","meticulous","meticulously","comprehensive","cutting-edge","game-changer","elevate","streamline","empower","resonate","not only","but also","whether you're","as an ai","i hope this helps","dive into","dive deep","journey","beacon","symphony","navigating","ensuring","enhancing","crucial","essential","vital"];
const IRREG_PART='been|done|gone|seen|taken|given|made|written|known|shown|built|sent|found|held|kept|told|thought|brought|bought|caught|taught|left|lost|paid|said|sold|spent|won|chosen|driven|eaten|fallen|forgotten|hidden|ridden|spoken|stolen|thrown|worn|broken|frozen|beaten|begun|drawn|grown|put|set|cut|hit|read|run|led|felt|heard|meant|understood|considered';
const PASSIVE=new RegExp("\\b(am|is|are|was|were|be|been|being)\\s+(?:\\w+ly\\s+)?(\\w+ed|"+IRREG_PART+")\\b(?:\\s+by\\b)?",'gi');

function issue(list,start,end,category,type,message,replacements,text){if(list.some(x=>x.start<end&&start<x.end&&x.type===type))return;list.push({start,end,category,type,message,replacements:replacements||[],original:text.slice(start,end)});}
function matchCase(src,rep){if(!rep)return rep;if(src[0]&&src[0]===src[0].toUpperCase()&&src[0]!==src[0].toLowerCase())return rep[0].toUpperCase()+rep.slice(1);return rep;}

function check(text,opts={}){const list=[];const goals=Object.assign({formality:'neutral',audience:'general'},opts.goals||{});
 /* correctness: spelling */
 if(DICT&&opts.spelling!==false){const sents=sentences(text);const starts=new Set(sents.map(s=>s.start));for(const t of words(text)){const w=t.w.replace(/’/g,"'");if(w.length<2||/[A-Z]{2}/.test(w))continue;const isCap=/^[A-Z]/.test(w);if(isCap&&!starts.has(t.start)&&!known(w))continue;/* proper noun */ if(known(w))continue;const fixC={dont:"don't",doesnt:"doesn't",didnt:"didn't",cant:"can't",wont:"won't",isnt:"isn't",im:"I'm",ive:"I've",youre:"you're",theyre:"they're",wasnt:"wasn't",couldnt:"couldn't",shouldnt:"shouldn't",wouldnt:"wouldn't",thats:"that's",whats:"what's",lets:"let's"}[w.toLowerCase()];if(fixC){issue(list,t.start,t.end,'correctness','spelling','Missing apostrophe in “'+t.w+'”.',[matchCase(t.w,fixC)],text);continue;}const ctx=text.slice(Math.max(0,t.start-1),t.end+1);if(/[@\/\d_]/.test(ctx))continue;issue(list,t.start,t.end,'correctness','spelling','Possible spelling mistake: “'+t.w+'”.',suggest(t.w),text);}}
 /* repeated words */
 let m;const rep=/\b(\w+)\s+\1\b/gi;while((m=rep.exec(text))){if(/^(had|that|very|bye|ha|no)$/i.test(m[1]))continue;issue(list,m.index,m.index+m[0].length,'correctness','repeat','Repeated word “'+m[1]+'”.',[m[1]],text);}
 /* a/an */
 const an=/\b(a|an)\s+([A-Za-z][\w-]*)/gi;while((m=an.exec(text))){const art=m[1],next=m[2].toLowerCase();const vowelSound=/^[aeiou]/.test(next)&&!/^(uni|use|usu|uti|eu|one|once|ubiq|ufo|uk\b|ur[ai])/.test(next)||/^(hour|honest|honou?r|heir|herb\b|mba|mri|fbi|faq|nba|x-?ray|sms|rsvp)/.test(next);const want=vowelSound?'an':'a';if(art.toLowerCase()!==want)issue(list,m.index,m.index+art.length,'correctness','article','Use “'+want+'” before “'+m[2]+'”.',[matchCase(art,want)],text);}
 /* capitalization */
 for(const s of sentences(text)){const c=s.text.match(/[A-Za-z]/);if(c&&c.index===0&&/[a-z]/.test(c[0])&&!/^(e\.g|i\.e|etc|iphone|ipad|ebay)/i.test(s.text)){issue(list,s.start,s.start+1,'correctness','capital','Start the sentence with a capital letter.',[c[0].toUpperCase()],text);}
  const sw=words(s.text);if(sw.length>32)issue(list,s.start,s.end,'clarity','long','Long sentence ('+sw.length+' words). Consider splitting it.',[],text);}
 const iLow=/(^|[^\w'’])(i)(?=[\s'’,.!?;:]|$)/g;while((m=iLow.exec(text))){const at=m.index+m[1].length;issue(list,at,at+1,'correctness','capital','Capitalize the pronoun “I”.',['I'],text);}
 /* punctuation spacing */
 const sp1=/\s+([,.;:!?])(?!\d)/g;while((m=sp1.exec(text))){if(m[0].includes('\n'))continue;issue(list,m.index,m.index+m[0].length,'correctness','punct','Remove the space before “'+m[1]+'”.',[m[1]],text);}
 const sp2=/([,;:])(?=[A-Za-z])/g;while((m=sp2.exec(text))){if(/https?$/i.test(text.slice(Math.max(0,m.index-5),m.index)))continue;issue(list,m.index,m.index+1,'correctness','punct','Add a space after “'+m[1]+'”.',[m[1]+' '],text);}
 const sp3=/([a-z])\.([A-Z][a-z])/g;while((m=sp3.exec(text)))issue(list,m.index+1,m.index+2,'correctness','punct','Add a space after the full stop.',['. '],text);
 const dbl=/ {2,}(?=\S)/g;while((m=dbl.exec(text))){if(m.index>0&&text[m.index-1]!=='\n')issue(list,m.index,m.index+m[0].length,'correctness','punct','Multiple spaces.',[' '],text);}
 const dp=/([!?,])\1+|(?<!\.)\.\.(?!\.)/g;while((m=dp.exec(text)))issue(list,m.index,m.index+m[0].length,'correctness','punct','Repeated punctuation.',[m[0][0]],text);
 /* confusions */
 for(const[re,fix,msg,grp]of CONFUSION){re.lastIndex=0;while((m=re.exec(text))){const g=grp||1;const before=m.slice(1,g).join(' ');const off=m.index+(g===1?m[0].toLowerCase().indexOf(m[1].toLowerCase()):m[0].length-m[g].length);issue(list,off,off+m[g].length,'correctness','confusion',msg,[matchCase(m[g],fix)],text);void before;}}
 /* subject-verb agreement */
 const sv=[[/\b(he|she|it)\s+(don't|have|are|were|do)\b/gi,{"don't":"doesn't",have:'has',are:'is',were:'was',do:'does'}],[/\b(I)\s+(is|has|does|was not)\b/g,{is:'am',has:'have',does:'do'}],[/\b(they|we|you)\s+(is|was|has|doesn't|does)\b/gi,{is:'are',was:'were',has:'have',"doesn't":"don't",does:'do'}],[/\b(there|here)\s+(is|was)\s+(many|several|two|three|four|five|some people|lots)\b/gi,{is:'are',was:'were'}],[/\b(everyone|everybody|nobody|someone|each)\s+(are|have|were)\b/gi,{are:'is',have:'has',were:'was'}]];
 for(const[re,map]of sv){re.lastIndex=0;while((m=re.exec(text))){const v=m[2];const fix=map[v.toLowerCase()];if(!fix)continue;const off=m.index+m[0].indexOf(v,m[1].length);issue(list,off,off+v.length,'correctness','agreement','The verb may not agree with “'+m[1]+'”.',[matchCase(v,fix)],text);}}
 /* double negatives */
 const dn=/\b(don't|dont|doesn't|doesnt|didn't|didnt|can't|cant|won't|isn't|aren't|wasn't|never|not)\s+(?:\w+\s+){0,2}?(nothing|nobody|nowhere|none|no one|never)\b/gi;while((m=dn.exec(text))){const neg=m[2].toLowerCase();const fix={nothing:'anything',nobody:'anybody',nowhere:'anywhere',none:'any',never:'ever','no one':'anyone'}[neg];const off=m.index+m[0].length-m[2].length;issue(list,off,off+m[2].length,'clarity','negative','Possible double negative.',[fix],text);}
 /* passive */
 PASSIVE.lastIndex=0;while((m=PASSIVE.exec(text))){if(/^(is|are|was|were)\s+(interested|tired|excited|married|used|based|located|supposed|bored|pleased|surprised|worried|concerned|done|read|set|put|left|led|felt)$/i.test(m[0].replace(/\s+by$/i,'')))continue;issue(list,m.index,m.index+m[0].length,'clarity','passive','Passive voice. An active verb is often clearer.',[],text);}
 /* wordiness */
 const low=text.toLowerCase();for(const[p,r]of WORDY){let i=-1;const re=new RegExp('\\b'+p.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'\\b','gi');while((m=re.exec(text))){i=m.index;let end=i+m[0].length;let rr=r;if(!r&&text[end]===',')end++;if(!r&&text[end]===' ')end++;issue(list,i,end,'conciseness','wordy',r?'Wordy: “'+p+'” → “'+r+'”.':'“'+p+'” adds little. Consider removing it.',[r?matchCase(m[0],rr):''],text);}}void low;
 /* clichés */
 for(const c of CLICHES){const re=new RegExp('\\b'+c.replace(/[-]/g,'\\-')+'\\b','gi');while((m=re.exec(text)))issue(list,m.index,m.index+m[0].length,'clarity','cliche','Cliché: “'+m[0]+'”. Say it plainly.',[],text);}
 /* tone: informal words for formal goal, stiff words for casual */
 if(goals.formality==='formal'){const inf={gonna:'going to',wanna:'want to',gotta:'have to',kinda:'somewhat',sorta:'somewhat',stuff:'material',awesome:'excellent',cool:'good',guys:'everyone',yeah:'yes',ok:'acceptable',okay:'acceptable','a lot of':'many',really:'very',get:'obtain',huge:'substantial'};for(const k in inf){const re=new RegExp('\\b'+k+'\\b','gi');while((m=re.exec(text)))issue(list,m.index,m.index+m[0].length,'tone','informal','Informal for your formal goal.',[matchCase(m[0],inf[k])],text);}
  const ctr=/\b(\w+)(n't|'re|'ll|'ve|'m)\b/gi;while((m=ctr.exec(text))){const full=expandContraction(m[0]);if(full!==m[0])issue(list,m.index,m.index+m[0].length,'tone','contraction','Formal writing usually avoids contractions.',[full],text);}}
 else{for(const k in FORMAL){if(goals.formality==='neutral'&&['however','therefore','regarding'].includes(k))continue;const re=new RegExp('\\b'+k+'\\b','gi');while((m=re.exec(text)))issue(list,m.index,m.index+m[0].length,goals.formality==='casual'?'tone':'conciseness','formal','“'+m[0]+'” can sound stiff. Try “'+FORMAL[k]+'”.',[matchCase(m[0],FORMAL[k])],text);}}
 const hedges=/\b(just|really|very|quite|somewhat|perhaps|maybe|sort of|kind of|i think|i feel|i believe)\b/gi;if(goals.audience==='expert'||goals.formality==='formal'){while((m=hedges.exec(text)))issue(list,m.index,m.index+m[0].length,'tone','hedge','Hedging word weakens confident writing.',[''],text);}
 for(let i=list.length-1;i>=0;i--){const x=list[i];if(x.type==='spelling'&&list.some(y=>y!==x&&y.category==='correctness'&&y.type!=='spelling'&&y.start<x.end&&x.start<y.end))list.splice(i,1);}
 list.sort((a,b)=>a.start-b.start||b.end-a.end);
 const r=readability(text);const weights={correctness:4,clarity:1.5,conciseness:1,tone:1};let pen=0;for(const x of list)pen+=weights[x.category]||1;const score=r.words?Math.max(0,Math.min(100,Math.round(100-pen*100/Math.max(30,r.words)*0.7))):0;
 const counts={correctness:0,clarity:0,conciseness:0,tone:0};list.forEach(x=>counts[x.category]++);
 return{issues:list,score,counts,readability:r,tone:detectTone(text)};}

function expandContraction(w){const lw=w.toLowerCase().replace(/’/g,"'");const map={"can't":'cannot',"won't":'will not',"shan't":'shall not',"i'm":'I am'};if(map[lw])return matchCase(w,map[lw]);return w.replace(/n't$/i,' not').replace(/'re$/i,' are').replace(/'ll$/i,' will').replace(/'ve$/i,' have').replace(/'m$/i,' am');}
function applyFix(text,iss,replacement){return text.slice(0,iss.start)+replacement+text.slice(iss.end);}
function detectTone(text){const t=text.toLowerCase();const w=Math.max(1,words(text).length);const c=(re)=>(t.match(re)||[]).length;
 const tones={Confident:c(/\b(will|clearly|definitely|certainly|must|proven|ensure|guarantee)\b/g),Friendly:c(/\b(thanks|thank you|glad|happy|hope|love|great|please|welcome|cheers)\b|!|:\)/g),Formal:c(/\b(therefore|furthermore|moreover|hereby|regarding|pursuant|accordingly|thus|whom)\b/g)+c(/\b\w{12,}\b/g)*0.3,Casual:c(/\b(gonna|wanna|yeah|cool|awesome|stuff|kinda|lol|hey|guys)\b|n't\b|'re\b/g),Tentative:c(/\b(maybe|perhaps|might|possibly|i think|i guess|sort of|kind of|seems?)\b/g),Urgent:c(/\b(asap|urgent|immediately|now|deadline|critical|right away)\b/g),Negative:c(/\b(unfortunately|bad|problem|fail|failed|wrong|never|hate|angry|disappoint\w*|poor)\b/g)};
 const arr=Object.entries(tones).map(([k,v])=>({tone:k,score:Math.round(v/w*1000)/10})).filter(x=>x.score>0).sort((a,b)=>b.score-a.score);return arr.length?arr.slice(0,3):[{tone:'Neutral',score:0}];}

/* ---------- AI-likeness heuristic ---------- */
function mean(a){return a.reduce((x,y)=>x+y,0)/Math.max(1,a.length);}function sd(a){const m=mean(a);return Math.sqrt(mean(a.map(x=>(x-m)**2)));}
function mtld(tokens,th=0.72){function pass(arr){let f=0,types=new Set(),n=0;for(const t of arr){n++;types.add(t);if(types.size/n<=th){f++;types=new Set();n=0;}}if(n>0){const ttr=types.size/n;f+=ttr>=1?0:(1-ttr)/(1-th);}return f?arr.length/f:arr.length;}if(tokens.length<10)return 0;return(pass(tokens)+pass([...tokens].reverse()))/2;}
const DETECTOR_SOFT_WORDS=20000;
const DETECTOR_HARD_WORDS=50000;
const DETECTOR_MIN_WORDS=40;
const AI_PHRASE_EXTRA=["in today's digital age","in this day and age","at the end of the day","it goes without saying","needless to say","a double-edged sword","opens up new avenues","shed light on","sheds light on","bring to the fore","stands as a testament","growing body of research","growing body of literature","scholars have long","in recent years","with the advent of","in an increasingly","at the forefront of","at the heart of","in and of itself","in its own right","as previously mentioned","as mentioned above","last but not least","first and foremost","in the context of","in terms of","as a means of","serve as a","plays an important part","warrant further","future research should","further research is needed","the present study","the current study","this paper aims","this paper seeks","this article aims","in this paper we will","the remainder of this","to conclude","to summarise","to summarize","in closing","taken together","it can be argued that","it could be suggested that","one cannot overstate","cannot be overstated","of paramount importance","highly significant","significantly enhance","significantly enhance","significantly improve","deep dive","dive deeper","game changing","paradigm shift","best practices","moving forward","going forward","circle back","touch base","low-hanging fruit","think outside the box","unlock new","pave the way","paves the way","lay the foundation","lays the foundation","bring about","brings about","in light of","given the fact that","due to the fact that","has the ability to","have the ability to","a large number of","a wide range of","a wide variety of","in order to","with regard to","with respect to","prior to","subsequent to","make a decision","come to a conclusion","take into consideration","each and every","end result","past history","free gift","advance planning","close proximity","the reason why is because","in my opinion i think","as an ai language model","as a language model","i'm happy to help","i hope this helps","let me know if","certainly!","of course!","great question","delve deeper","tapestry of","beacon of","symphony of","intricate web","rich tapestry","ever-changing","rapidly evolving","digital landscape","modern landscape","competitive landscape","holistic approach","multifaceted nature","nuanced understanding","seamless integration","robust framework","comprehensive overview","cutting edge","state of the art","groundbreaking","revolutionary","transformative impact","unprecedented opportunities","empower individuals","empower organizations","foster collaboration","foster innovation","drive innovation","drive growth","enhance outcomes","optimize performance","streamline processes","leverage technology","leverage data","harness data","navigate challenges","address the challenges","tackle the challenges","crucial role","pivotal role","vital role","essential role","significant role","plays a key role","in conclusion it is clear","in summary it is evident","overall it is clear"];
const AI_PHRASES_ALL=(typeof AI_PHRASES!=='undefined'?AI_PHRASES:[]).concat(AI_PHRASE_EXTRA);
const AI_TRANSITION_WORDS=['furthermore','moreover','additionally','in addition','in conclusion','in summary','to summarize','to summarise','to conclude','overall','consequently','nonetheless','nevertheless','hence','thus','therefore','accordingly','similarly','likewise','conversely','notably','specifically','subsequently','ultimately','firstly','secondly','thirdly','lastly'];
const EMPTY_INTENSIFIERS=['crucial','pivotal','vital','paramount','essential','comprehensive','robust','seamless','cutting-edge','groundbreaking','transformative','unprecedented','holistic','multifaceted','nuanced','meticulous','intricate','vibrant','bustling','leveraging','fostering','empowering','streamlining','elevating','underscoring','showcasing'];

function detectRegister(text,toks,sents){
 const low=text.toLowerCase();
 const cite=(text.match(/\([A-Z][A-Za-z'’-]+(?:,?\s+(?:&|and)\s+[A-Z][A-Za-z'’-]+)*(?: et al\.?)?,?\s*\d{4}[a-z]?\)|\[[0-9,\s–-]+\]|doi:\s*\S+|10\.\d{4,9}\//gi)||[]).length;
 const acadMark=(low.match(/\b(however|therefore|thus|whereas|hypothesis|participants|methodology|literature|findings|analysis|study|research|significant|respectively|et al)\b/g)||[]).length;
 const casual=(low.match(/\b(lol|kinda|gonna|wanna|yeah|ok|okay|hey|guys|awesome|cool|honestly|gotta)\b/g)||[]).length+(text.match(/\b\w+(n't|'re|'ll|'ve|'m)\b/gi)||[]).length;
 const longWord=toks.filter(w=>w.length>=10).length/Math.max(1,toks.length);
 let score=0;score+=Math.min(3,cite)*1.2;score+=Math.min(8,acadMark)*0.35;score+=longWord*8;score-=Math.min(4,casual)*0.8;
 if(cite>=1&&acadMark>=2)return 'academic';if(score>=1.8)return 'academic';if(score<=-0.5||casual>=4)return 'casual';return 'mixed';
}
function phraseHitsIn(text){
 const low=' '+String(text).toLowerCase()+' ';const found=[];let hits=0;const seen=new Set();
 for(const p of AI_PHRASES_ALL){const re=new RegExp('(^|[^a-z0-9])'+p.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'(?=[^a-z0-9]|$)','g');const k=(low.match(re)||[]).length;if(k){hits+=k;if(!seen.has(p)){seen.add(p);found.push(p);}}}
 return{hits,found};
}
function detectAI(text,opts={}){
 const clamp=x=>Math.max(0,Math.min(1,x));
 const allSents=sentences(text);const sents=allSents.filter(s=>words(s.text).length>=3);
 const toks=words(text).map(x=>x.w.toLowerCase());let n=toks.length;let truncated=false;let src=text;
 if(n>DETECTOR_HARD_WORDS){const cut=words(text)[DETECTOR_HARD_WORDS-1].end;const r=detectAI(text.slice(0,cut),Object.assign({},opts,{_skipHard:true}));r.truncated=true;r.fullWords=n;return r;}
 if(n<DETECTOR_MIN_WORDS||sents.length<3)return{enough:false,score:null,signals:[],sentences:[],words:n,minWords:DETECTOR_MIN_WORDS,softLimit:DETECTOR_SOFT_WORDS,hardLimit:DETECTOR_HARD_WORDS,truncated:false,register:null,confidence:null,topPhrases:[],label:null};
 const lens=sents.map(s=>words(s.text).length);const cv=sd(lens)/Math.max(1,mean(lens));
 const ttr=new Set(toks).size/n;const mt=mtld(toks);
 const ph=phraseHitsIn(src);const phraseRate=ph.hits/n*100;
 const tri=new Map();for(let i=0;i+2<n;i++){const k=toks[i]+' '+toks[i+1]+' '+toks[i+2];tri.set(k,(tri.get(k)||0)+1);}let rep=0;tri.forEach(v=>{if(v>1)rep+=v;});const repRate=rep/Math.max(1,n-2);
 const contractions=(src.match(/\b\w+(n't|'re|'ll|'ve|'m|'d)\b/gi)||[]).length/Math.max(1,sents.length);
 const personal=(src.match(/\b(i|me|my|lol|honestly|guess|kinda|yeah|we|our|us)\b/gi)||[]).length/n*100;
 const starters=new Map();sents.forEach(s=>{const f=words(s.text)[0];if(f){const k=f.w.toLowerCase();starters.set(k,(starters.get(k)||0)+1);}});
 const starterRep=Math.max(0,...starters.values())/sents.length;
 const commas=(src.match(/,/g)||[]).length/sents.length;
 const register=opts.mode==='academic'?'academic':opts.mode==='casual'?'casual':detectRegister(src,toks,sents);
 /* transition stacking: density of AI-favourite connectors */
 const low=' '+src.toLowerCase()+' ';let transHits=0;const transFound=[];
 for(const w of AI_TRANSITION_WORDS){const re=new RegExp('(^|[^a-z])'+w.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'(?=[^a-z]|$)','g');const k=(low.match(re)||[]).length;if(k){transHits+=k;transFound.push(w+'(×'+k+')');}}
 const transPerSent=transHits/Math.max(1,sents.length);
 /* empty intensifier / AI adjective rate */
 let inten=0;const intenFound=[];for(const w of EMPTY_INTENSIFIERS){const re=new RegExp('\\b'+w.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'\\b','gi');const k=(src.match(re)||[]).length;if(k){inten+=k;intenFound.push(w);}}
 const intenRate=inten/n*100;
 /* sentence-length "AI sweet spot" share (15–28 words, low variance) */
 const sweet=lens.filter(l=>l>=15&&l<=28).length/sents.length;
 /* paragraph burstiness */
 const paras=src.split(/\n{2,}/).map(p=>p.trim()).filter(Boolean);const pLens=paras.map(p=>words(p).length).filter(x=>x>=20);
 const pCv=pLens.length>=3?sd(pLens)/Math.max(1,mean(pLens)):null;
 /* function-word rhythm: AI tends to steadier the/a/of/to rates across sentences */
 const FW=new Set(['the','a','an','of','to','in','for','on','with','as','by','at','from','that','this','is','are','was','were','be','and','or']);
 const fwRates=sents.map(s=>{const ws=words(s.text).map(x=>x.w.toLowerCase());if(!ws.length)return 0;return ws.filter(w=>FW.has(w)).length/ws.length;});
 const fwCv=sd(fwRates)/Math.max(0.01,mean(fwRates));
 /* punctuation uniformity: similar comma counts */
 const commaCounts=sents.map(s=>(s.text.match(/,/g)||[]).length);const commaCv=sd(commaCounts)/Math.max(0.5,mean(commaCounts)+0.01);

 let voiceWeight=0.14,burstW=0.18,phraseW=0.22,mtldW=0.08,repW=0.06,uniW=0.08,transW=0.12,intenW=0.08,sweetW=0.04;
 let voiceAi=clamp(1-(contractions*1.5+personal/2.5));
 if(register==='academic'){
  /* Academic prose rarely uses contractions; do not treat that as AI by itself. */
  voiceWeight=0.05;voiceAi=clamp(1-(contractions*0.4+personal/3))*0.45;
  phraseW=0.24;transW=0.16;intenW=0.10;burstW=0.16;mtldW=0.06;
 }else if(register==='casual'){voiceWeight=0.20;phraseW=0.20;transW=0.08;}

 const sig=[
  {key:'burstiness',label:'Sentence-length variation (burstiness)',value:Math.round(cv*100)/100,weight:burstW,ai:clamp((0.55-cv)/0.35),note:'Human writing usually mixes short and long sentences (coefficient of variation ≳ 0.5). Formal essays can look steadier without being generated.'},
  {key:'phrases',label:'Stock “AI-style” phrases per 100 words',value:Math.round(phraseRate*100)/100,weight:phraseW,ai:clamp(phraseRate/2.0),note:ph.found.length?'Found: '+ph.found.slice(0,12).join(', '):'None of the watched stock phrases found.'},
  {key:'transitions',label:'Formulaic transitions per sentence',value:Math.round(transPerSent*100)/100,weight:transW,ai:clamp((transPerSent-0.15)/0.55),note:transFound.length?'Seen: '+transFound.slice(0,8).join(', '):'Few stacked furthermore/moreover/additionally-style openers.'},
  {key:'intensifiers',label:'Empty AI intensifiers per 100 words',value:Math.round(intenRate*100)/100,weight:intenW,ai:clamp(intenRate/1.8),note:intenFound.length?'e.g. '+intenFound.slice(0,8).join(', '):'Few of the watched buzzwords (crucial, robust, seamless…).'},
  {key:'mtld',label:'Lexical diversity (MTLD)',value:Math.round(mt*10)/10,weight:mtldW,ai:clamp((mt-70)/55),note:'Very even, polished vocabulary can score higher; specialised academic jargon also raises MTLD, so this is only one signal.'},
  {key:'repetition',label:'Repeated 3-word sequences',value:Math.round(repRate*1000)/10+'%',weight:repW,ai:clamp(repRate/0.08),note:'Template-like repetition raises this.'},
  {key:'voice',label:'Contractions & personal voice',value:Math.round(contractions*100)/100+' / sentence',weight:voiceWeight,ai:voiceAi,note:register==='academic'?'Academic register detected: missing contractions are normal and barely count against the text.':'Generated prose often avoids contractions and first-person asides.'},
  {key:'uniform',label:'Uniform structure (starters & commas)',value:Math.round(starterRep*100)+'% same opener',weight:uniW,ai:clamp((commas-0.6)/1.6*0.45+starterRep*0.85+(1-Math.min(1,commaCv))*0.2),note:'Evenly comma-balanced, similarly opened sentences look template-like.'},
  {key:'sweetspot',label:'Mid-length sentence share (15–28 words)',value:Math.round(sweet*100)+'%',weight:sweetW,ai:clamp((sweet-0.45)/0.4)*clamp(1-cv/0.45),note:'Generated drafts often cluster in a narrow mid-length band when burstiness is also low.'}
 ];
 if(pCv!==null){sig.push({key:'paragraphs',label:'Paragraph-length variation',value:Math.round(pCv*100)/100,weight:0.04,ai:clamp((0.45-pCv)/0.35),note:'Human sections often vary in paragraph size; even blocks can look machine-planned.'});}
 sig.push({key:'function',label:'Function-word rhythm variation',value:Math.round(fwCv*100)/100,weight:0.04,ai:clamp((0.25-fwCv)/0.25),note:'Very steady the/a/of/to rates across sentences can look generated; noisy rhythm looks more human.'});

 const wsum=sig.reduce((a,s)=>a+s.weight,0);
 let score=sig.reduce((a,s)=>a+s.ai*s.weight,0)/wsum;score=Math.round(score*100);
 const avg=mean(lens);
 const per=sents.map(s=>{const phs=phraseHitsIn(s.text);const wl=words(s.text).length;const c=/\b\w+(n't|'re|'ll|'ve|'m)\b/i.test(s.text)?1:0;
  const tr=AI_TRANSITION_WORDS.some(w=>new RegExp('^\\s*'+w+'\\b','i').test(s.text))?1:0;
  const intenLocal=EMPTY_INTENSIFIERS.reduce((a,w)=>a+((s.text.match(new RegExp('\\b'+w+'\\b','i'))||[]).length),0);
  let v=0.18+phs.hits*0.18+tr*0.16+Math.min(0.2,intenLocal*0.08)+(Math.abs(wl-avg)<avg*0.22?0.12:-0.08)-c*(register==='academic'?0.05:0.22)+(/[,;]/.test(s.text)&&wl>18?0.06:0);
  return{text:s.text,start:s.start,end:s.end,score:Math.round(clamp(v)*100),phrases:phs.found.slice(0,4)};});
 const label=score>=70?'Many machine-like patterns':score>=45?'Mixed signals':'Mostly human-like patterns';
 /* confidence grows with length and sentence count; academic caveats */
 let confidence=clamp((n-40)/400*0.45+(sents.length-3)/20*0.25+(n>=120?0.2:0)+(ph.found.length?0.1:0));
 if(register==='academic')confidence=clamp(confidence*0.9);
 if(n<80)confidence=clamp(confidence*0.7);
 const confLabel=confidence>=0.65?'Moderate':confidence>=0.4?'Limited':'Low';
 return{enough:true,score,label,signals:sig,sentences:per,words:n,ttr:Math.round(ttr*1000)/1000,register,confidence:Math.round(confidence*100),confidenceLabel:confLabel,topPhrases:ph.found.slice(0,15),transitionHits:transHits,intensifierHits:inten,softLimit:DETECTOR_SOFT_WORDS,hardLimit:DETECTOR_HARD_WORDS,minWords:DETECTOR_MIN_WORDS,truncated:!!opts._truncated||truncated,fullWords:opts._fullWords||n};
}
function detectAIAsync(text,opts={},onProgress){
 return new Promise(resolve=>{
  if(onProgress)onProgress(0.15);
  setTimeout(()=>{try{const r=detectAI(text,opts);if(onProgress)onProgress(1);resolve(r);}catch(e){resolve({enough:false,score:null,signals:[],sentences:[],words:0,error:String(e)});}},0);
 });
}

/* ---------- humanizer ---------- */
/* Multi-pass academic rewriter: AI-cliché stripping, phrase/word paraphrase, transition
   variation, hedge/voice/formality controls, sentence-structure burstiness, and careful
   preservation of citations, quotes, maths, URLs and numbers. Fully on-device. */
const HUMANIZER_SOFT_WORDS=20000;
const HUMANIZER_HARD_WORDS=35000;
const STOCK=[
 [/\bin today'?s fast[- ]paced world,?\s*/gi,''],[/\bin the ever[- ]evolving (?:world|landscape) of\b/gi,'in'],
 [/\bit is important to note that\s*/gi,''],[/\bit'?s important to note that\s*/gi,''],
 [/\bit is worth noting that\s*/gi,''],[/\bit should be noted that\s*/gi,''],
 [/\bit is essential to (?:understand|recognize|acknowledge) that\s*/gi,''],
 [/\bone cannot overstate the (?:importance|significance) of\b/gi,''],
 [/\bfurthermore,s*/gi,'In addition, '],[/\bmoreover,\s*/gi,'What is more, '],[/\badditionally,\s*/gi,'In addition, '],
 [/\bin conclusion,\s*/gi,'Altogether, '],[/\bin summary,\s*/gi,'In short, '],[/\bto summarize,\s*/gi,'In short, '],
 [/\bto conclude,\s*/gi,'Altogether, '],[/\boverall,\s*/gi,'On the whole, '],
 [/\bdelve(?:s|d)? into\b/gi,'look into'],[/\bdiving deep(?:er)? into\b/gi,'looking more closely at'],
 [/\bplays? a (crucial|pivotal|vital|significant|key) role in\b/gi,'matters for'],
 [/\ba myriad of\b/gi,'many'],[/\ba plethora of\b/gi,'many'],[/\ba wealth of\b/gi,'a lot of'],
 [/\bnavigating the complexities of\b/gi,'working through'],[/\bnavigates the complexities of\b/gi,'works through'],[/\bnavigated the complexities of\b/gi,'worked through'],[/\bnavigate the complexities of\b/gi,'work through'],
 [/\bharnessing the power of\b/gi,'using'],[/\bharnesses the power of\b/gi,'uses'],[/\bharnessed the power of\b/gi,'used'],[/\bharness the power of\b/gi,'use'],[/\bunlocking the (?:full )?potential of\b/gi,'getting more from'],[/\bunlocks the (?:full )?potential of\b/gi,'gets more from'],[/\bunlocked the (?:full )?potential of\b/gi,'got more from'],[/\bunlock the (?:full )?potential of\b/gi,'get more from'],
 [/\ba testament to\b/gi,'evidence of'],[/\bstands as a testament to\b/gi,'shows'],
 [/\bseamlessly\b/gi,'smoothly'],[/\bseamless\b/gi,'smooth'],[/\brobust\b/gi,'solid'],
 [/\bcutting[- ]edge\b/gi,'up-to-date'],[/\bstate[- ]of[- ]the[- ]art\b/gi,'current'],
 [/\bembarking on\b/gi,'starting'],[/\bembarks on\b/gi,'starts'],[/\bembarked on\b/gi,'started'],[/\bembark on\b/gi,'start'],[/\bin the realm of\b/gi,'in'],[/\bin the landscape of\b/gi,'in'],
 [/\bparamount\b/gi,'central'],[/\bholistic\b/gi,'joined-up'],[/\bmultifaceted\b/gi,'many-sided'],
 [/\bmeticulously\b/gi,'carefully'],[/\bmeticulous\b/gi,'careful'],
 [/\bunderscoring\b/gi,'highlighting'],[/\bunderscores\b/gi,'highlights'],[/\bunderscored\b/gi,'highlighted'],[/\bunderscore\b/gi,'highlight'],[/\bshowcasing\b/gi,'showing'],[/\bshowcases\b/gi,'shows'],[/\bshowcased\b/gi,'showed'],[/\bshowcase\b/gi,'show'],[/\bfostering\b/gi,'encouraging'],[/\bfosters\b/gi,'encourages'],[/\bfostered\b/gi,'encouraged'],[/\bfoster\b/gi,'encourage'],
 [/\btapestry of\b/gi,'mix of'],[/\bsymphony of\b/gi,'range of'],[/\bbeacon of\b/gi,'sign of'],
 [/\bever[- ]evolving\b/gi,'changing'],[/\belevating\b/gi,'improving'],[/\belevates\b/gi,'improves'],[/\belevated\b/gi,'improved'],[/\belevate\b/gi,'improve'],[/\bstreamlining\b/gi,'simplifying'],[/\bstreamlines\b/gi,'simplifies'],[/\bstreamlined\b/gi,'simplified'],[/\bstreamline\b/gi,'simplify'],
 [/\bempowering\b/gi,'helping'],[/\bempowers\b/gi,'helps'],[/\bempowered\b/gi,'helped'],[/\bempower\b/gi,'help'],[/\bresonating with\b/gi,'mattering to'],[/\bresonates with\b/gi,'matters to'],[/\bresonated with\b/gi,'mattered to'],[/\bresonate with\b/gi,'matter to'],
 [/\bleveraging\b/gi,'using'],[/\bleverages\b/gi,'uses'],[/\bleveraged\b/gi,'used'],[/\bleverage\b/gi,'use'],[/\butilizing\b/gi,'using'],[/\butilizes\b/gi,'uses'],[/\butilized\b/gi,'used'],[/\butilize\b/gi,'use'],[/\butilisation\b/gi,'use'],[/\butilization\b/gi,'use'],
 [/\bfacilitating\b/gi,'helping'],[/\bfacilitates\b/gi,'helps'],[/\bfacilitated\b/gi,'helped'],[/\bfacilitate\b/gi,'help'],[/\bcommencing\b/gi,'beginning'],[/\bcommences\b/gi,'begins'],[/\bcommenced\b/gi,'began'],[/\bcommence\b/gi,'begin'],
 [/\bascertaining\b/gi,'finding out'],[/\bascertains\b/gi,'finds out'],[/\bascertained\b/gi,'found out'],[/\bascertain\b/gi,'find out'],[/\bendeavoring\b/gi,'trying'],[/\bendeavors\b/gi,'tries'],[/\bendeavored\b/gi,'tried'],[/\bendeavor\b/gi,'try'],[/\bendeavouring\b/gi,'trying'],[/\bendeavours\b/gi,'tries'],[/\bendeavoured\b/gi,'tried'],[/\bendeavour\b/gi,'try'],
 [/\bin light of the fact that\b/gi,'because'],[/\bgiven the fact that\b/gi,'because'],
 [/\bnot only\b/gi,'both'],[/\bbut also\b/gi,'and'],
 [/\bwhether you'?re\b/gi,'whether you are'],[/\bas an ai\b/gi,''],[/\bi hope this helps\.?\s*/gi,''],
 [/\bdive(?:s|d)? into\b/gi,'examine'],[/\bdive deep(?:er)?\b/gi,'look more closely'],
 [/\bjourney (?:into|through|of|toward)\b/gi,'path through'],[/\bin this paper,? we (?:will |shall )?/gi,'This paper '],
 [/\bthe present study (?:aims?|seeks?|attempts?) to\b/gi,'This study tries to '],[/\bthe current study\b/gi,'this study'],
 [/\bit can be argued that\s*/gi,''],[/\bit could be suggested that\s*/gi,''],
 [/\ba growing body of (?:research|literature|evidence) (?:has |have )?(?:shown|demonstrated|suggested) that\s*/gi,'Research suggests that '],
 [/\bscholars have long (?:argued|debated|noted) that\s*/gi,''],
 [/\bin recent years,?\s*/gi,''],[/\bover the past (?:few |several )?(?:years|decades),?\s*/gi,''],
 [/\bwith the advent of\b/gi,'with'],[/\bin an increasingly\b/gi,'in a more'],
 [/\bpivotal\b/gi,'important'],[/\bcrucial\b/gi,'important'],[/\bvital\b/gi,'important'],
 [/\bessential\b/gi,'important'],[/\bcomprehensive\b/gi,'thorough'],[/\bintricate\b/gi,'detailed'],
 [/\bnuanced\b/gi,'careful'],[/\bvibrant\b/gi,'lively'],[/\bbustling\b/gi,'busy'],
 [/\brealm\b/gi,'area'],[/\blandscape\b/gi,'field'],[/\bparadigm\b/gi,'model'],
 [/\bgame[- ]changer\b/gi,'major shift'],[/\btransformative\b/gi,'far-reaching'],
 [/\bunprecedented\b/gi,'unusual'],[/\brevolutionary\b/gi,'major'],
 [/\bat the forefront of\b/gi,'central to'],[/\bat the heart of\b/gi,'central to'],
 [/\bin and of itself\b/gi,'itself'],[/\bin its own right\b/gi,''],
 [/\bneedless to say,?\s*/gi,''],[/\bas previously mentioned,?\s*/gi,''],[/\bas mentioned (?:above|earlier),?\s*/gi,''],
 [/\blast but not least,?\s*/gi,''],[/\bfirst and foremost,?\s*/gi,'First, '],
 [/\bin order for\b/gi,'so that'],[/\bfor the purpose of\b/gi,'to'],
 [/\bwith a view to\b/gi,'to'],[/\bwith the aim of\b/gi,'to'],
 [/\bin the context of\b/gi,'in'],[/\bin terms of\b/gi,'for'],
 [/\bas a means of\b/gi,'for'],[/\bas a means to\b/gi,'to'],
 [/\bserve(?:s|d)? as a\b/gi,'act as a'],[/\bplays? an important part in\b/gi,'helps'],
 [/\bbring(?:s|ing)? to the fore\b/gi,'highlight'],[/\bshedding light on\b/gi,'clarifying'],[/\bsheds light on\b/gi,'clarifies'],[/\bshed light on\b/gi,'clarify'],
 [/\bopen(?:s|ed|ing)? up new avenues\b/gi,'create new options'],
 [/\ba double[- ]edged sword\b/gi,'mixed'],[/\ba mixed bag\b/gi,'uneven'],
 [/\bwarrant(?:s|ed|ing)? further (?:investigation|research|attention)\b/gi,'deserve more study'],
 [/\bfuture research should\b/gi,'later work should'],[/\bfurther research is needed\b/gi,'more work is needed'],[/\bunlock(?:s|ed|ing)? their (?:full )?potential\b/gi,'make the most of what they can do'],[/\bunlock(?:s|ed|ing)? its (?:full )?potential\b/gi,'make the most of it'],[/\bthe elucidation of\b/gi,'clarify'],[/\belucidation\b/gi,'clarification'],[/\bhas the potential to\b/gi,'can'],[/\bhave the potential to\b/gi,'can'],[/\bin our daily lives\b/gi,'day to day'],[/\blong-term success\b/gi,'lasting success'],[/\bsustainable growth\b/gi,'steady growth'],[/\btransform industries seamlessly\b/gi,'reshape industries'],[/\btransform industries\b/gi,'reshape industries'],
 [/\bthis paper (?:seeks|aims|attempts) to\b/gi,'This paper tries to '],[/\bthis article (?:seeks|aims|attempts) to\b/gi,'This article tries to '],
 [/\bin this section,? we (?:will |shall )?/gi,'This section '],[/\bthe remainder of this (?:paper|article|chapter)\b/gi,'the rest of this paper']
];
const ACADEMIC_WORD={
 utilize:'use',utilise:'use',utilization:'use',utilisation:'use',commence:'begin',facilitate:'help',
 endeavor:'try',endeavour:'try',ascertain:'establish',demonstrate:'show',approximately:'about',
 purchase:'buy',sufficient:'enough',numerous:'many',assist:'help',additional:'further',obtain:'obtain',
 require:'need',terminate:'end',subsequently:'later',therefore:'so',however:'however',nevertheless:'still',
 individuals:'people',regarding:'about',inquire:'ask',initiate:'begin',implement:'carry out',optimal:'best',
 leverage:'use',endeavors:'efforts',endeavours:'efforts',aforementioned:'earlier',herein:'here',
 heretofore:'until now',thereafter:'after that',whereby:'by which',wherein:'in which',thereof:'of it',
 henceforth:'from now on',amidst:'amid',amongst:'among',whilst:'while',
 methodology:'method',methodologies:'methods',utilize:'use',prioritize:'give priority to',prioritise:'give priority to',
 conceptualization:'idea',conceptualisation:'idea',operationalize:'put into practice',operationalise:'put into practice',
 problematize:'question',problematise:'question',interrogates:'examines',interrogating:'examining',
 elucidate:'clarify',elucidates:'clarifies',elucidating:'clarifying',explicate:'explain',explicates:'explains',
 posit:'argue',posits:'argues',postulate:'propose',postulates:'proposes',contend:'argue',contends:'argues',
 maintain:'argue',maintains:'argues',assert:'claim',asserts:'claims',substantiate:'support',substantiates:'supports',
 corroborate:'support',corroborates:'supports',delineate:'outline',delineates:'outlines',
 encapsulate:'capture',encapsulates:'captures',epitomize:'represent',epitomises:'represents',epitomizes:'represents',
 underscore:'stress',underscores:'stresses',accentuate:'stress',accentuates:'stresses',
 ameliorate:'improve',ameliorates:'improves',augment:'increase',augments:'increases',
 diminish:'reduce',diminishes:'reduces',exacerbate:'worsen',exacerbates:'worsens',
 mitigate:'ease',mitigates:'eases',alleviate:'ease',alleviates:'eases',
 preclude:'rule out',precludes:'rules out',necessitate:'require',necessitates:'requires',
 pertain:'relate',pertains:'relates',pertaining:'relating',vis:'via',visavis:'compared with',
 extant:'existing',nascent:'emerging',burgeoning:'growing',salient:'notable',salience:'importance',
 concomitant:'accompanying',juxtaposition:'contrast',juxtapose:'contrast',juxtaposes:'contrasts',
 aforementioned:'above',afore:'before',hence:'so',thus:'so',ergo:'so',
 commence:'start',commences:'starts',ceases:'stops',cease:'stop',
 employment:'use',employ:'use',employs:'uses',employed:'used',employing:'using',
 deployment:'use',deploy:'use',deploys:'uses',deployed:'used',
 manifestation:'form',manifestations:'forms',manifest:'show',manifests:'shows',
 implication:'effect',implications:'effects',ramification:'effect',ramifications:'effects',
 contribution:'input',contributions:'inputs',significance:'importance',significant:'important',
 substantially:'largely',considerably:'greatly',markedly:'clearly',notably:'notably',
 particularly:'especially',specifically:'in particular',respectively:'respectively',
 ultimately:'in the end',initially:'at first',previously:'earlier',currently:'now',
 subsequently:'later',consequently:'as a result',accordingly:'so',hence:'so'
};
const ACADEMIC_SYNONYMS={
 important:['important','central','notable','key','consequential'],
 significant:['important','notable','sizeable','meaningful','consequential'],
 show:['show','indicate','suggest','point to','reveal'],
 shows:['shows','indicates','suggests','points to','reveals'],
 showed:['showed','indicated','suggested','pointed to','revealed'],
 shown:['shown','indicated','suggested','revealed'],
 suggest:['suggest','indicate','point to','imply'],
 suggests:['suggests','indicates','points to','implies'],
 examine:['examine','consider','look at','analyse','review'],
 examines:['examines','considers','looks at','analyses','reviews'],
 examined:['examined','considered','looked at','analysed','reviewed'],
 analysis:['analysis','examination','review','study','account'],
 study:['study','paper','work','investigation','research'],
 research:['research','work','inquiry','scholarship','investigation'],
 findings:['findings','results','evidence','outcomes'],
 results:['results','findings','outcomes','data'],
 argue:['argue','claim','contend','maintain','propose'],
 argues:['argues','claims','contends','maintains','proposes'],
 argued:['argued','claimed','contended','maintained','proposed'],
 provide:['provide','offer','give','supply','present'],
 provides:['provides','offers','gives','supplies','presents'],
 provided:['provided','offered','gave','supplied','presented'],
 approach:['approach','method','way','framework','perspective'],
 approaches:['approaches','methods','ways','frameworks','perspectives'],
 framework:['framework','model','approach','lens','scheme'],
 impact:['impact','effect','influence','consequence'],
 impacts:['impacts','effects','influences','consequences'],
 issue:['issue','problem','question','concern','matter'],
 issues:['issues','problems','questions','concerns','matters'],
 process:['process','procedure','course','sequence'],
 processes:['processes','procedures','courses'],
 understanding:['understanding','account','reading','grasp','picture'],
 knowledge:['knowledge','understanding','evidence','learning'],
 literature:['literature','scholarship','prior work','published work'],
 evidence:['evidence','support','data','indications'],
 data:['data','evidence','material','observations'],
 participants:['participants','respondents','subjects','people in the study'],
 method:['method','approach','procedure','technique'],
 methods:['methods','approaches','procedures','techniques'],
 theory:['theory','account','framework','model'],
 theories:['theories','accounts','frameworks','models'],
 concept:['concept','idea','notion','construct'],
 concepts:['concepts','ideas','notions','constructs'],
 context:['context','setting','background','situation'],
 contexts:['contexts','settings','backgrounds','situations'],
 perspective:['perspective','view','angle','stance'],
 perspectives:['perspectives','views','angles','stances'],
 challenge:['challenge','difficulty','problem','obstacle'],
 challenges:['challenges','difficulties','problems','obstacles'],
 opportunity:['opportunity','chance','opening','scope'],
 opportunities:['opportunities','chances','openings'],
 develop:['develop','build','form','shape'],
 develops:['develops','builds','forms','shapes'],
 developed:['developed','built','formed','shaped'],
 increase:['increase','rise','growth','gain'],
 increase_v:['increase','raise','grow','expand'],
 decrease:['decrease','fall','drop','decline'],
 relationship:['relationship','link','association','connection'],
 relationships:['relationships','links','associations','connections'],
 difference:['difference','contrast','gap','variation'],
 differences:['differences','contrasts','gaps','variations'],
 similar:['similar','comparable','related','alike'],
 different:['different','distinct','separate','unlike'],
 clear:['clear','plain','evident','obvious'],
 clearly:['clearly','plainly','evidently'],
 however:['however','yet','still','even so','all the same'],
 therefore:['therefore','so','as a result','for that reason'],
 because:['because','since','as','given that'],
 although:['although','though','even though','while'],
 while:['while','whereas','as'],
 also:['also','as well','too','likewise'],
 many:['many','numerous','a large number of','plenty of'],
 most:['most','the majority of','nearly all'],
 some:['some','several','a number of','certain'],
 often:['often','frequently','in many cases','commonly'],
 usually:['usually','typically','in most cases','generally'],
 generally:['generally','broadly','on the whole','in general'],
 particularly:['particularly','especially','in particular','notably'],
 specifically:['specifically','in particular','namely'],
 finally:['finally','lastly','in the end','to finish'],
 first:['first','to begin with','at the outset','initially'],
 second:['second','next','then'],
 third:['third','then','next']
};
const TRANSITIONS={
 furthermore:['Also','In addition','Beyond that','What is more','Along the same lines'],
 moreover:['What is more','In addition','Also','Beyond this'],
 additionally:['In addition','Also','On top of that','Besides'],
 however:['However','Yet','Even so','Still','That said'],
 therefore:['Therefore','So','As a result','For that reason','Hence'],
 consequently:['As a result','So','For that reason','Consequently'],
 nevertheless:['Still','Even so','Nevertheless','All the same'],
 meanwhile:['Meanwhile','At the same time','In the meantime'],
 similarly:['Similarly','Likewise','In the same way','By the same token'],
 conversely:['Conversely','By contrast','On the other hand'],
 indeed:['Indeed','In fact','Certainly'],
 thus:['So','Thus','In this way','As a result'],
 hence:['So','Hence','For that reason'],
 ultimately:['In the end','Ultimately','Taken together'],
 notably:['Notably','In particular','Of note'],
 specifically:['Specifically','In particular','Namely'],
 subsequently:['Later','Afterwards','Then','Following this'],
 previously:['Earlier','Before this','Previously'],
 initially:['At first','Initially','To begin with'],
 finally:['Finally','Lastly','To finish'],
 overall:['On the whole','Overall','Taken together'],
 likewise:['Likewise','Similarly','In the same way']
};
const NOMINAL=[[/\bthe (?:utilization|utilisation|use) of\b/gi,'using'],[/\bthe analysis of\b/gi,'analysing'],[/\bthe examination of\b/gi,'examining'],[/\bthe investigation of\b/gi,'investigating'],[/\bthe consideration of\b/gi,'considering'],[/\bthe implementation of\b/gi,'implementing'],[/\bthe development of\b/gi,'developing'],[/\bthe application of\b/gi,'applying'],[/\bthe identification of\b/gi,'identifying'],[/\bthe evaluation of\b/gi,'evaluating'],[/\bthe assessment of\b/gi,'assessing'],[/\bthe exploration of\b/gi,'exploring'],[/\bthe introduction of\b/gi,'introducing'],[/\bthe creation of\b/gi,'creating'],[/\bthe production of\b/gi,'producing'],[/\bthe provision of\b/gi,'providing'],[/\bthe inclusion of\b/gi,'including'],[/\bthe exclusion of\b/gi,'excluding'],[/\bthe comparison of\b/gi,'comparing'],[/\bthe measurement of\b/gi,'measuring'],[/\bthe observation of\b/gi,'observing'],[/\bthe recognition of\b/gi,'recognising'],[/\bthe understanding of\b/gi,'understanding'],[/\bthe discussion of\b/gi,'discussing'],[/\bthe presentation of\b/gi,'presenting'],[/\bmake(?:s|ing)? (?:a |an )?(?:decision|decisions)\b/gi,'decide'],[/\bmake(?:s|ing)? (?:an? )?argument\b/gi,'argue'],[/\bconduct(?:s|ed|ing)? (?:an? )?analysis\b/gi,'analyse'],[/\bcarry(?:ies|ying)? out (?:an? )?(?:analysis|study|investigation)\b/gi,'analyse'],[/\bgive(?:s|ing)? consideration to\b/gi,'consider'],[/\btake(?:s|ing)? into account\b/gi,'consider'],[/\btake(?:s|ing)? into consideration\b/gi,'consider'],[/\bcome(?:s|ing)? to (?:the )?conclusion\b/gi,'conclude'],[/\breach(?:es|ed|ing)? (?:a |the )?conclusion\b/gi,'conclude'],[/\bplace(?:s|d|ing)? emphasis on\b/gi,'emphasise'],[/\bput(?:s|ting)? emphasis on\b/gi,'emphasise'],[/\bhave(?:s|ing)? an effect on\b/gi,'affect'],[/\bhave(?:s|ing)? an impact on\b/gi,'affect'],[/\bis indicative of\b/gi,'indicates'],[/\bare indicative of\b/gi,'indicate'],[/\bis suggestive of\b/gi,'suggests'],[/\bare suggestive of\b/gi,'suggest']];
const CONTRACT=[[/\bdo not\b/gi,"don't"],[/\bdoes not\b/gi,"doesn't"],[/\bdid not\b/gi,"didn't"],[/\bis not\b/gi,"isn't"],[/\bare not\b/gi,"aren't"],[/\bwas not\b/gi,"wasn't"],[/\bwere not\b/gi,"weren't"],[/\bcannot\b/gi,"can't"],[/\bwill not\b/gi,"won't"],[/\bit is\b/gi,"it's"],[/\bthat is\b/gi,"that's"],[/\bthere is\b/gi,"there's"],[/\bthere are\b/gi,"there're"],[/\byou are\b/gi,"you're"],[/\bwe are\b/gi,"we're"],[/\bthey are\b/gi,"they're"],[/\bI am\b/g,"I'm"],[/\bwould not\b/gi,"wouldn't"],[/\bshould not\b/gi,"shouldn't"],[/\bcould not\b/gi,"couldn't"],[/\bhave not\b/gi,"haven't"],[/\bhas not\b/gi,"hasn't"],[/\bhad not\b/gi,"hadn't"],[/\byou will\b/gi,"you'll"],[/\bwe will\b/gi,"we'll"],[/\bthey will\b/gi,"they'll"],[/\blet us\b/gi,"let's"],[/\bwho is\b/gi,"who's"],[/\bwhat is\b/gi,"what's"],[/\bwhere is\b/gi,"where's"]];
const HEDGE_ADD=[['It is clear that ','It seems that '],['This shows that ','This suggests that '],['This proves that ','This indicates that '],['We can conclude that ','One reading is that '],['This demonstrates that ','This points to '],['Clearly, ','Arguably, '],['Obviously, ','It appears that '],['Without doubt, ','On this evidence, '],['Certainly, ','Quite possibly, ']];
const HEDGE_STRIP=[/\bit seems (?:that|as though|as if)\s*/gi,/\bit appears (?:that|as though)\s*/gi,/\bit would (?:appear|seem) that\s*/gi,/\bone might (?:argue|say|suggest) that\s*/gi,/\barguably,?\s*/gi,/\bperhaps\s+/gi,/\bmaybe\s+/gi,/\bpossibly\s+/gi,/\bin some (?:sense|ways?),?\s*/gi,/\bto some extent,?\s*/gi,/\bit could be argued that\s*/gi];
const ELABORATE=[[/^(.{40,120}\.)$/,(s,rnd)=>rnd()<0.35?s.slice(0,-1)+', which helps to clarify the point.':s],[/^(.{30,90})\.$/,(s,rnd)=>rnd()<0.25?s.slice(0,-1)+' in this context.':s]];
const PROTECT_RE=/(\$\$.*?\$\$|\$(?:\\\$|[^$])+\$|\\\((?:\\\)|[^)])+\\\)|\\\[(?:\\\]|[^\]])+\\\]|https?:\/\/\S+|www\.\S+|doi:\s*\S+|10\.\d{4,9}\/[-._;()\/:A-Z0-9]+|\[[0-9,\s–-]+\]|\((?:[A-Z][A-Za-z'’-]+(?:,?\s+(?:&|and)\s+[A-Z][A-Za-z'’-]+)*(?: et al\.?)?,?\s*\d{4}[a-z]?(?:,\s*p+\.?\s*\d+(?:[-–]\d+)?)?)\)|"[^"\n]{1,400}"|'[^'\n]{1,200}'|`[^`\n]{1,200}`)/gs;
function keepCase(rep){return(m,...a)=>{const r=typeof rep==='function'?rep(m,...a):String(rep).replace(/\$(\d)/g,(_,i)=>a[i-1]||'');if(!r)return r;if(/^[A-Z]/.test(m)&&/^[a-z]/.test(r))return r[0].toUpperCase()+r.slice(1);if(m===m.toUpperCase()&&m.length>1)return r.toUpperCase();return r;};}
function seeded(seed){let s=(seed>>>0)||1;return()=>{s^=s<<13;s^=s>>>17;s^=s<<5;return((s>>>0)%10000)/10000;};}
function protectSpans(text){const slots=[];const out=text.replace(PROTECT_RE,(m)=>{const i=slots.length;slots.push(m);return '\uE000'+i+'\uE001';});return{text:out,slots};}
function restoreSpans(text,slots){return text.replace(/\uE000(\d+)\uE001/g,(_,i)=>slots[+i]||'');}
function pick(arr,rnd){return arr[Math.floor(rnd()*arr.length)%arr.length];}
function applySynonymMap(text,rnd,rate,tone){const skip=new Set(['also','too','so','yet','still','however','therefore','thus','hence','then','next','first','second','third','finally','overall','indeed','meanwhile','similarly','conversely','specifically','notably','subsequently','previously','initially','because','although','while','many','most','some','often','usually','generally','particularly','clear','clearly','different','similar']);
 return text.replace(/(^|[.!?\n]\s*)(\b[A-Za-z][A-Za-z'’-]{2,}\b)|\b([A-Za-z][A-Za-z'’-]{2,})\b/g,(full,lead,startWord,mid)=>{
  const m=startWord||mid;if(!m)return full;const low=m.toLowerCase().replace(/’/g,"'");
  if(skip.has(low))return full;const opts=ACADEMIC_SYNONYMS[low];if(!opts||opts.length<2)return full;if(rnd()>rate)return full;
  if(startWord)return full; /* keep sentence openers stable */
  let choice=pick(opts.filter(x=>x.toLowerCase()!==low&&x.indexOf(' ')===-1),rnd)||opts[0];
  if(tone==='formal'||tone==='academic'){if(/n't|'re|'ll|'ve|'m/.test(choice)||choice.indexOf(' ')>=0)return full;}
  return (lead||'')+matchCase(m,choice);});}
function rewriteTransitions(text,rnd){return text.replace(/(^|[.!?]\s+)(Furthermore|Moreover|Additionally|However|Therefore|Consequently|Nevertheless|Meanwhile|Similarly|Conversely|Indeed|Thus|Hence|Ultimately|Notably|Specifically|Subsequently|Previously|Initially|Finally|Overall|Likewise)\b/g,(full,lead,word)=>{const key=word.toLowerCase();const opts=TRANSITIONS[key];if(!opts||rnd()<0.2)return full;return lead+pick(opts,rnd);});}
function varyOpeners(paragraph,rnd){const ss=sentences(paragraph).map(s=>s.text);if(ss.length<3)return paragraph;const starts=ss.map(s=>(words(s)[0]||{w:''}).w.toLowerCase());const res=[];for(let i=0;i<ss.length;i++){let s=ss[i];if(i>0&&starts[i]&&starts[i]===starts[i-1]&&rnd()<0.7){if(/^(this|these|that|it|the|a|an|in|on|for|with|by)\b/i.test(s)){const alts={this:'That',these:'Those',that:'This',it:'This',the:'A',a:'The',an:'The',in:'Within',on:'Upon',for:'Regarding',with:'Using',by:'Through'};const w=words(s)[0].w;const rep=alts[w.toLowerCase()];if(rep)s=matchCase(w,rep)+s.slice(w.length);}}res.push(s);}return res.join(' ');}
function splitMerge(paragraph,tone,rnd,changes){let ss=sentences(paragraph).map(s=>s.text);const res=[];for(let i=0;i<ss.length;i++){let s=ss[i];const wc=words(s).length;
 if(wc>28){const m=s.match(/^(.{45,}?)[,;]\s+(and|but|which|while|whereas|so|yet|although|though)\s+(.{20,})$/i);if(m&&rnd()<0.75){const head=m[1].replace(/[,;]$/,'')+'.';let lead={and:'And',but:'But',which:'That',while:'Meanwhile,',whereas:'By contrast,',so:'So',yet:'Yet',although:'Still,',though:'Still,'}[m[2].toLowerCase()]||'Also,';let tail=m[3];if(!/^[A-Z]/.test(tail))tail=lead+' '+(lead.endsWith(',')?tail:tail[0].toUpperCase()+tail.slice(1));else if(!lead.endsWith(','))tail=lead+' '+tail[0].toLowerCase()+tail.slice(1);else tail=lead+' '+tail;res.push(head,tail);changes.splits++;continue;}}
 const nx=ss[i+1];if(nx&&wc<=8&&words(nx).length<=9&&rnd()<(tone==='elaborate'?0.15:0.45)&&/\.$/.test(s)&&tone!=='formal'&&tone!=='academic'){const join=rnd()<0.5?', and ':(rnd()<0.5?'; ':'. ');if(join==='. '){res.push(s);continue;}const joined=s.replace(/\.$/,'')+join+(/^[A-Z]/.test(nx)&&!/^I\b/.test(nx)?nx[0].toLowerCase()+nx.slice(1):nx);res.push(joined);i++;changes.merges++;continue;}
 res.push(s);}return res.join(' ');}
function tonePass(text,tone,rnd,changes){let out=text;
 if(tone==='concise'){for(const[p,r]of WORDY){if(r)continue;out=out.replace(new RegExp('\\b'+p.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'\\b,?\\s*','gi'),()=>{changes.words++;return '';});}out=out.replace(/\b(very|really|quite|just|basically|actually|literally|simply|clearly|obviously|essentially)\s+/gi,()=>{changes.words++;return '';});}
 if(tone==='friendly'||tone==='conversational'){out=out.replace(/\bHello\b/g,'Hi');for(const[a,b]of HEDGE_ADD){if(rnd()<0.2)out=out.replace(a,()=>{changes.hedges=(changes.hedges||0)+1;return b;});}}
 if(tone==='formal'||tone==='academic'){for(const re of HEDGE_STRIP)out=out.replace(re,()=>{changes.hedges=(changes.hedges||0)+1;return '';});out=out.replace(/\b\w+(n't|'re|'ll|'ve|'m)\b/gi,m=>{const e=expandContraction(m);if(e!==m)changes.contractions++;return e;});}
 if(tone==='elaborate'){out=out.split(/(?<=[.!?])\s+/).map(s=>{if(words(s).length<8||words(s).length>28)return s;if(rnd()<0.22&&/\.$/.test(s)&&!/\bwhich\b/i.test(s)){changes.words++;return s.slice(0,-1)+', which clarifies the claim.';}return s;}).join(' ');}
 if(tone==='natural'||tone==='conversational'||tone==='friendly'){for(const[re,r]of CONTRACT){out=out.replace(re,m=>{const p=tone==='natural'?0.55:0.8;if(rnd()>p)return m;changes.contractions++;return matchCase(m,r);});}}
 return out;}
function wordify(text,rnd,tone,changes){let out=text;
 for(const[p,r]of WORDY){if(!r)continue;out=out.replace(new RegExp('\\b'+p.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'\\b','gi'),m=>{changes.words++;return matchCase(m,r);});}
 for(const[re,r]of NOMINAL){out=out.replace(re,m=>{changes.words++;return matchCase(m,r);});}
 const formalSkip=tone==='formal'||tone==='academic'?new Set(['however','therefore','regarding','obtain','demonstrate','significant','analysis','methodology']):new Set(['however','therefore']);
 for(const k in ACADEMIC_WORD){if(formalSkip.has(k))continue;const re=new RegExp('\\b'+k+'\\b','gi');out=out.replace(re,m=>{if(rnd()<0.25&&(tone==='natural'))return m;changes.words++;return matchCase(m,ACADEMIC_WORD[k]);});}
 const rate=tone==='concise'?0.12:tone==='elaborate'?0.28:tone==='academic'?0.18:tone==='formal'?0.15:0.22;
 const before=out;out=applySynonymMap(out,rnd,rate,tone);if(out!==before)changes.synonyms=(changes.synonyms||0)+1;
 return out;}
function humanizeChunk(text,opts,rnd,changes){let out=text;
 for(const[re,r]of STOCK){out=out.replace(re,(...a)=>{changes.phrases++;return keepCase(r)(...a);});}
 out=wordify(out,rnd,opts.tone,changes);
 out=rewriteTransitions(out,rnd);
 out=tonePass(out,opts.tone,rnd,changes);
 const paras=out.split(/(\n+)/);out=paras.map(par=>{if(/^\n+$/.test(par)||!par.trim())return par;let p=varyOpeners(par,rnd);p=splitMerge(p,opts.tone,rnd,changes);return p;}).join('');
 out=out.replace(/ {2,}/g,' ').replace(/\s+([,.!?;:])/g,'$1').replace(/([.!?])([A-Za-z])/g,'$1 $2').replace(/(^|[.!?]\s+)([a-z])/g,(m,a,b)=>a+b.toUpperCase());
 out=out.replace(/\b(And|But|So|Yet) and\b/g,'$1').replace(/\s+,/g,',');
 out=out.replace(/\b((?:In addition|What is more|What's more|Beyond that|On top of that|Along the same lines|By contrast|On the whole|In short|Altogether|For that reason|As a result|Even so|All the same|By the same token|Besides|Also),)\s+(This|That|These|Those)\b/g,(m,a,w)=>a+' '+w.toLowerCase());
 return out;}
function normalizeTone(t){t=(t||'natural').toLowerCase();
 if(t==='formal & clear'||t==='formal academic'||t==='formal-academic'||t==='formal_academic')return 'academic';
 if(t==='conversational academic'||t==='conversational-academic'||t==='conversational_academic')return 'conversational';
 if(t==='formal')return 'formal';
 if(t==='friendly')return 'friendly';
 if(t==='concise')return 'concise';
 if(t==='elaborate')return 'elaborate';
 if(t==='academic')return 'academic';
 if(t==='conversational')return 'conversational';
 return 'natural';}
function humanize(text,opts={}){const tone=normalizeTone(opts.tone);const rnd=seeded(opts.seed||(text.length*31+7));
 const changes={phrases:0,words:0,contractions:0,splits:0,merges:0,synonyms:0,hedges:0,protected:0};
 const wc=words(text).length;let truncated=false;let src=text;
 if(wc>HUMANIZER_HARD_WORDS){const toks=words(text);const cut=toks[HUMANIZER_HARD_WORDS-1].end;src=text.slice(0,cut);truncated=true;}
 const {text:masked,slots}=protectSpans(src);changes.protected=slots.length;
 /* paragraph-aware multi-pass */
 const parts=masked.split(/(\n{2,})/);
 let out=parts.map((part,idx)=>{if(/^\n+$/.test(part)||!part.trim())return part;let chunk=part;for(let pass=0;pass<(opts.passes||2);pass++){chunk=humanizeChunk(chunk,{tone},rnd,changes);}return chunk;}).join('');
 out=restoreSpans(out,slots);
 out=out.replace(/ {2,}/g,' ').replace(/[ \t]+\n/g,'\n').replace(/\n{3,}/g,'\n\n').trim()+(src.endsWith('\n')?'\n':'');
 return{text:out,changes,before:readability(text),after:readability(out),wordCount:wc,truncated,softLimit:HUMANIZER_SOFT_WORDS,hardLimit:HUMANIZER_HARD_WORDS,tone};}
function humanizeAsync(text,opts={},onProgress){const tone=normalizeTone(opts.tone);const rnd=seeded(opts.seed||(text.length*31+7));
 const changes={phrases:0,words:0,contractions:0,splits:0,merges:0,synonyms:0,hedges:0,protected:0};
 const wc=words(text).length;let truncated=false;let src=text;
 if(wc>HUMANIZER_HARD_WORDS){const toks=words(text);src=text.slice(0,toks[HUMANIZER_HARD_WORDS-1].end);truncated=true;}
 const {text:masked,slots}=protectSpans(src);changes.protected=slots.length;
 const parts=masked.split(/(\n{2,})/);const outParts=new Array(parts.length);let i=0;
 return new Promise(resolve=>{
  function step(){const start=performance.now?performance.now():Date.now();
   while(i<parts.length&&((performance.now?performance.now():Date.now())-start)<12){const part=parts[i];if(/^\n+$/.test(part)||!part.trim())outParts[i]=part;else{let chunk=part;for(let pass=0;pass<(opts.passes||2);pass++)chunk=humanizeChunk(chunk,{tone},rnd,changes);outParts[i]=chunk;}i++;}
   if(onProgress)onProgress(Math.min(1,i/Math.max(1,parts.length)));
   if(i<parts.length){setTimeout(step,0);return;}
   let out=restoreSpans(outParts.join(''),slots);out=out.replace(/ {2,}/g,' ').replace(/[ \t]+\n/g,'\n').replace(/\n{3,}/g,'\n\n').trim()+(src.endsWith('\n')?'\n':'');
   resolve({text:out,changes,before:readability(text),after:readability(out),wordCount:wc,truncated,softLimit:HUMANIZER_SOFT_WORDS,hardLimit:HUMANIZER_HARD_WORDS,tone});}
  step();});}
/* ---------- diff (word-level LCS) ---------- */
function diff(a,b){const A=a.split(/(\s+)/),B=b.split(/(\s+)/);const n=A.length,m=B.length;if(n*m>4e6)return[{op:'del',text:a},{op:'add',text:b}];const dp=Array.from({length:n+1},()=>new Uint32Array(m+1));for(let i=n-1;i>=0;i--)for(let j=m-1;j>=0;j--)dp[i][j]=A[i]===B[j]?dp[i+1][j+1]+1:Math.max(dp[i+1][j],dp[i][j+1]);const out=[];let i=0,j=0;const push=(op,t)=>{const l=out[out.length-1];if(l&&l.op===op)l.text+=t;else out.push({op,text:t});};while(i<n&&j<m){if(A[i]===B[j]){push('eq',A[i]);i++;j++;}else if(dp[i+1][j]>=dp[i][j+1]){push('del',A[i]);i++;}else{push('add',B[j]);j++;}}while(i<n)push('del',A[i++]);while(j<m)push('add',B[j++]);return out;}

return{sentences,words,syllables,readability,fleschLabel,loadDictionary,addWords,hasDictionary,known,suggest,check,applyFix,detectTone,detectAI,detectAIAsync,detectRegister,DETECTOR_SOFT_WORDS,DETECTOR_HARD_WORDS,DETECTOR_MIN_WORDS,humanize,humanizeAsync,HUMANIZER_SOFT_WORDS,HUMANIZER_HARD_WORDS,normalizeTone,diff,expandContraction,mtld,protectSpans,restoreSpans};
});
