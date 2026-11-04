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
function detectAI(text){const sents=sentences(text).filter(s=>words(s.text).length>=3);const toks=words(text).map(x=>x.w.toLowerCase());const n=toks.length;
 if(n<40||sents.length<3)return{enough:false,score:null,signals:[],sentences:[],words:n};
 const lens=sents.map(s=>words(s.text).length);const cv=sd(lens)/Math.max(1,mean(lens));/* burstiness: human text varies more */
 const ttr=new Set(toks).size/n;const mt=mtld(toks);
 const low=' '+text.toLowerCase()+' ';let phraseHits=0;const found=[];for(const p of AI_PHRASES){const re=new RegExp('(^|[^a-z])'+p.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'(?=[^a-z]|$)','g');const k=(low.match(re)||[]).length;if(k){phraseHits+=k;found.push(p);}}
 const phraseRate=phraseHits/n*100;
 /* repetition: share of repeated word trigrams */const tri=new Map();for(let i=0;i+2<n;i++){const k=toks[i]+' '+toks[i+1]+' '+toks[i+2];tri.set(k,(tri.get(k)||0)+1);}let rep=0;tri.forEach(v=>{if(v>1)rep+=v;});const repRate=rep/Math.max(1,n-2);
 /* perplexity proxy: average unigram rank in commonness list (AI text favours common-but-polished words) and contraction/first-person rate */
 const contractions=(text.match(/\b\w+(n't|'re|'ll|'ve|'m|'d)\b/gi)||[]).length/Math.max(1,sents.length);const personal=(text.match(/\b(i|me|my|lol|honestly|guess|kinda|yeah)\b/gi)||[]).length/n*100;
 const starters=new Map();sents.forEach(s=>{const f=words(s.text)[0];if(f){const k=f.w.toLowerCase();starters.set(k,(starters.get(k)||0)+1);}});const starterRep=Math.max(...starters.values())/sents.length;
 const commas=(text.match(/,/g)||[]).length/sents.length;
 const clamp=x=>Math.max(0,Math.min(1,x));
 const sig=[
  {key:'burstiness',label:'Sentence-length variation (burstiness)',value:Math.round(cv*100)/100,weight:0.24,ai:clamp((0.55-cv)/0.35),note:'Human writing usually mixes short and long sentences (coefficient of variation ≳ 0.5).'},
  {key:'phrases',label:'Stock “AI-style” phrases per 100 words',value:Math.round(phraseRate*100)/100,weight:0.26,ai:clamp(phraseRate/2.2),note:found.length?'Found: '+found.slice(0,10).join(', '):'None found.'},
  {key:'mtld',label:'Lexical diversity (MTLD)',value:Math.round(mt*10)/10,weight:0.12,ai:clamp((mt-60)/50),note:'Very even, polished vocabulary scores high; casual human text is often lower.'},
  {key:'repetition',label:'Repeated 3-word sequences',value:Math.round(repRate*1000)/10+'%',weight:0.08,ai:clamp(repRate/0.08),note:'Template-like repetition raises this.'},
  {key:'voice',label:'Contractions & personal voice',value:Math.round(contractions*100)/100+' / sentence',weight:0.18,ai:clamp(1-(contractions*1.5+personal/2)),note:'Generated prose tends to avoid contractions and first-person asides.'},
  {key:'uniform',label:'Uniform structure (starters & commas)',value:Math.round(starterRep*100)+'% same opener',weight:0.12,ai:clamp((commas-0.6)/1.6*0.6+starterRep*0.8),note:'Evenly comma-balanced, similarly opened sentences.'}];
 let score=sig.reduce((a,s)=>a+s.ai*s.weight,0)/sig.reduce((a,s)=>a+s.weight,0);score=Math.round(score*100);
 const avg=mean(lens);
 const per=sents.map(s=>{const sl=' '+s.text.toLowerCase()+' ';let h=0;for(const p of AI_PHRASES)if(sl.includes(p))h++;const wl=words(s.text).length;const c=/\b\w+(n't|'re|'ll|'ve|'m)\b/i.test(s.text)?1:0;const v=clamp(0.25+h*0.22+(Math.abs(wl-avg)<avg*0.25?0.15:-0.1)-c*0.25+(/[,;]/.test(s.text)&&wl>18?0.1:0));return{text:s.text,start:s.start,end:s.end,score:Math.round(v*100)};});
 const label=score>=70?'Many machine-like patterns':score>=45?'Mixed signals':'Mostly human-like patterns';
 return{enough:true,score,label,signals:sig,sentences:per,words:n,ttr:Math.round(ttr*1000)/1000};}

/* ---------- humanizer ---------- */
const STOCK=[[/\bin today's fast-paced world,?\s*/gi,''],[/\bin today’s fast-paced world,?\s*/gi,''],[/\bit is important to note that\s*/gi,''],[/\bit is worth noting that\s*/gi,''],[/\bfurthermore,\s*/gi,'Also, '],[/\bmoreover,\s*/gi,'What’s more, '],[/\badditionally,\s*/gi,'Plus, '],[/\bin conclusion,\s*/gi,'So, '],[/\bin summary,\s*/gi,'In short, '],[/\bdelve into\b/gi,'dig into'],[/\bdelves into\b/gi,'digs into'],[/\bplays a (crucial|pivotal|vital) role in\b/gi,'matters a lot for'],[/\ba myriad of\b/gi,'lots of'],[/\bnavigate the complexities of\b/gi,'work through'],[/\bharness the power of\b/gi,'use'],[/\bunlock the (full )?potential of\b/gi,'get the most from'],[/\ba testament to\b/gi,'proof of'],[/\bseamlessly\b/gi,'smoothly'],[/\bseamless\b/gi,'smooth'],[/\brobust\b/gi,'solid'],[/\bcutting-edge\b/gi,'modern'],[/\bembark on\b/gi,'start'],[/\bin the realm of\b/gi,'in'],[/\bparamount\b/gi,'key'],[/\bholistic\b/gi,'whole'],[/\bmultifaceted\b/gi,'complex'],[/\bmeticulously\b/gi,'carefully'],[/\bmeticulous\b/gi,'careful'],[/\bunderscores\b/gi,'shows'],[/\bshowcases\b/gi,'shows'],[/\bfoster\b/gi,'build'],[/\btapestry of\b/gi,'mix of'],[/\bever-evolving\b/gi,'changing'],[/\belevate\b/gi,'improve'],[/\bstreamline\b/gi,'simplify']];
const CONTRACT=[[/\bdo not\b/gi,"don't"],[/\bdoes not\b/gi,"doesn't"],[/\bdid not\b/gi,"didn't"],[/\bis not\b/gi,"isn't"],[/\bare not\b/gi,"aren't"],[/\bwas not\b/gi,"wasn't"],[/\bcannot\b/gi,"can't"],[/\bwill not\b/gi,"won't"],[/\bit is\b/gi,"it's"],[/\bthat is\b/gi,"that's"],[/\bthere is\b/gi,"there's"],[/\byou are\b/gi,"you're"],[/\bwe are\b/gi,"we're"],[/\bthey are\b/gi,"they're"],[/\bI am\b/g,"I'm"],[/\bwould not\b/gi,"wouldn't"],[/\bshould not\b/gi,"shouldn't"],[/\bhave not\b/gi,"haven't"],[/\byou will\b/gi,"you'll"],[/\bwe will\b/gi,"we'll"],[/\blet us\b/gi,"let's"]];
function keepCase(rep){return(m,...a)=>{const r=typeof rep==='function'?rep(m,...a):rep.replace(/\$(\d)/g,(_,i)=>a[i-1]||'');return r&&/^[A-Z]/.test(m)?r[0].toUpperCase()+r.slice(1):r;};}
function seeded(seed){let s=seed>>>0||1;return()=>{s^=s<<13;s^=s>>>17;s^=s<<5;return((s>>>0)%10000)/10000;};}
function humanize(text,opts={}){const tone=opts.tone||'natural';const rnd=seeded(opts.seed||text.length*31+7);let out=text;const changes={phrases:0,words:0,contractions:0,splits:0,merges:0};
 for(const[re,r]of STOCK){out=out.replace(re,(...a)=>{changes.phrases++;return keepCase(r)(...a);});}
 for(const[p,r]of WORDY){if(!r)continue;out=out.replace(new RegExp('\\b'+p+'\\b','gi'),m=>{changes.words++;return matchCase(m,r);});}
 if(tone!=='formal'){for(const k in FORMAL){const re=new RegExp('\\b'+k+'\\b','gi');out=out.replace(re,m=>{if(['however','therefore'].includes(k)&&tone==='natural')return m;changes.words++;return matchCase(m,FORMAL[k]);});}
  for(const[re,r]of CONTRACT){out=out.replace(re,m=>{if(tone==='natural'&&rnd()<0.25)return m;changes.contractions++;return matchCase(m,r);});}}
 else{out=out.replace(/\b\w+(n't|'re|'ll|'ve|'m)\b/gi,m=>{const e=expandContraction(m);if(e!==m)changes.contractions++;return e;});}
 /* vary sentence length: split long sentences at a conjunction, merge consecutive short ones */
 const paras=out.split(/(\n+)/);out=paras.map(par=>{if(/^\n+$/.test(par)||!par.trim())return par;let ss=sentences(par).map(s=>s.text);const res=[];for(let i=0;i<ss.length;i++){let s=ss[i];const wc=words(s).length;
   if(wc>26){const m=s.match(/^(.{40,}?),\s+(and|but|which|while|so)\s+(.{25,})$/);if(m){const head=m[1].replace(/[,;]$/,'')+'.';let tail=m[3];const lead={and:'And',but:'But',which:'That',while:'Meanwhile,',so:'So'}[m[2].toLowerCase()];tail=lead+' '+tail;res.push(head,tail);changes.splits++;continue;}}
   const nx=ss[i+1];if(nx&&wc<=7&&words(nx).length<=7&&rnd()<0.5&&/\.$/.test(s)&&tone!=='formal'){const joined=s.replace(/\.$/,'')+(rnd()<0.5?', and ':' — ')+nx[0].toLowerCase()+nx.slice(1);if(!/^I\b/.test(nx)){res.push(joined);i++;changes.merges++;continue;}}
   res.push(s);}return res.join(' ');}).join('');
 if(tone==='concise'){for(const[p,r]of WORDY){if(r)continue;out=out.replace(new RegExp('\\b'+p+'\\b,?\\s*','gi'),()=>{changes.words++;return '';});}out=out.replace(/\b(very|really|quite|just|basically|actually|literally)\s+/gi,()=>{changes.words++;return '';});}
 if(tone==='friendly')out=out.replace(/\bHello\b/g,'Hi');
 out=out.replace(/ {2,}/g,' ').replace(/\s+([,.!?;:])/g,'$1').replace(/(^|[.!?]\s+)([a-z])/g,(m,a,b)=>a+b.toUpperCase());
 return{text:out,changes,before:readability(text),after:readability(out)};}

/* ---------- diff (word-level LCS) ---------- */
function diff(a,b){const A=a.split(/(\s+)/),B=b.split(/(\s+)/);const n=A.length,m=B.length;if(n*m>4e6)return[{op:'del',text:a},{op:'add',text:b}];const dp=Array.from({length:n+1},()=>new Uint32Array(m+1));for(let i=n-1;i>=0;i--)for(let j=m-1;j>=0;j--)dp[i][j]=A[i]===B[j]?dp[i+1][j+1]+1:Math.max(dp[i+1][j],dp[i][j+1]);const out=[];let i=0,j=0;const push=(op,t)=>{const l=out[out.length-1];if(l&&l.op===op)l.text+=t;else out.push({op,text:t});};while(i<n&&j<m){if(A[i]===B[j]){push('eq',A[i]);i++;j++;}else if(dp[i+1][j]>=dp[i][j+1]){push('del',A[i]);i++;}else{push('add',B[j]);j++;}}while(i<n)push('del',A[i++]);while(j<m)push('add',B[j++]);return out;}

return{sentences,words,syllables,readability,fleschLabel,loadDictionary,addWords,hasDictionary,known,suggest,check,applyFix,detectTone,detectAI,humanize,diff,expandContraction,mtld};
});
