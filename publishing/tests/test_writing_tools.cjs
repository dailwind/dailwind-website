'use strict';
const assert=require('assert');const fs=require('fs');const path=require('path');
const W=require('../../assets/writing-engine.js');
W.loadDictionary(fs.readFileSync(path.join(__dirname,'../../assets/writing/en-words.txt'),'utf8'));
const types=t=>W.check(t).issues.map(i=>i.type+':'+i.original.trim().toLowerCase());
const has=(t,k)=>assert.ok(types(t).includes(k),t+' should flag '+k+' got '+types(t));
has('I saw teh cat.','spelling:teh');assert.deepStrictEqual(W.suggest('teh')[0],'the');assert.strictEqual(W.suggest('recieve')[0],'receive');
has('It was the the best.','repeat:the the');has('She ate a apple.','article:a');has('He is an teacher.','article:an');
assert.ok(!types('She ate an apple and a university meal at an hour.').some(x=>x.startsWith('article')));
has('i went home.','capital:i');has('it rained. we left.','capital:w');
has('Wait , now.','punct:,');has('Their is a cat.','confusion:their');has('Your welcome.','confusion:your');has('Its a trap.','confusion:its');
has('It is bigger then that.','confusion:then');has('I could of won.','confusion:of');has('The affect was huge.','confusion:affect');
has('He don\'t care.','agreement:don\'t');has('They is late.','agreement:is');has('I don\'t know nothing.','negative:nothing');
has('The cake was eaten by the dog.','passive:was eaten by');has('We met in order to plan.','wordy:in order to');has('At the end of the day it works.','cliche:at the end of the day');
assert.ok(types(Array(40).fill('word').join(' and ')+'.').some(x=>x.startsWith('long')));
assert.deepStrictEqual(W.check('The quick brown fox jumps over the lazy dog. Researchers in Lahore analysed the results carefully.').issues,[]);
const fx=W.check('Its a trap.').issues[0];assert.strictEqual(W.applyFix('Its a trap.',fx,fx.replacements[0]),"It's a trap.");
assert.ok(W.check('We gonna win.',{goals:{formality:'formal'}}).issues.some(i=>i.category==='tone'));
const r=W.readability('The cat sat on the mat. It was happy.');assert.strictEqual(r.words,9);assert.strictEqual(r.sentences,2);assert.ok(r.flesch>80);
assert.ok(W.check('Hello world.').score>=90);
const ai="In today's fast-paced world, it is important to note that technology plays a crucial role in our daily lives. Furthermore, artificial intelligence has the potential to transform industries seamlessly and efficiently. Moreover, businesses must leverage robust solutions to navigate the complexities of the modern landscape. Additionally, fostering innovation is paramount for sustainable growth and long-term success. In conclusion, embracing these comprehensive tools will empower organizations to unlock their full potential and thrive.";
const human="ok so i went to the shop yesterday. honestly it was kinda a mess, they didn't have bread. I waited like twenty minutes for nothing! Then my friend called and we ended up getting pizza instead, which was way better than anything I had planned for the whole evening anyway. Lol. Not complaining though, it's fine.";
const a=W.detectAI(ai),h=W.detectAI(human);assert.ok(a.enough&&h.enough);assert.ok(a.score>=65,'ai '+a.score);assert.ok(h.score<=35,'human '+h.score);
assert.strictEqual(a.sentences.length,5);assert.ok(!W.detectAI('Too short.').enough);
const hu=W.humanize(ai);assert.ok(!/furthermore|moreover|it is important to note/i.test(hu.text));assert.ok(W.detectAI(hu.text).score<a.score);
assert.strictEqual(W.humanize('We are able to win.',{tone:'concise'}).text,"We can win.");
assert.ok(/do not/.test(W.humanize("We don't know.",{tone:'formal'}).text));
const d=W.diff('a b c','a x c');assert.deepStrictEqual(d.map(p=>p.op),['eq','del','add','eq']);

const acad='Furthermore, it is important to note that the utilization of robust strategies plays a crucial role in academic writing. Moreover, a growing body of research has shown that students can navigate the complexities of citation practice seamlessly (Smith, 2020). In conclusion, future research should delve into these paradigms.';
for(const tone of ['natural','academic','conversational','concise','elaborate','formal','friendly']){
  const r=W.humanize(acad,{tone,seed:9});
  assert.ok(r.text && !/it is important to note/i.test(r.text), tone+' stripped stock');
  assert.ok(r.text.includes('(Smith, 2020)'), tone+' kept citation');
  assert.ok(r.wordCount>20);
}
assert.strictEqual(W.normalizeTone('Formal academic'),'academic');
assert.strictEqual(W.normalizeTone('academic'),'academic');
assert.strictEqual(W.normalizeTone('conversational-academic'),'conversational');
const long='Research shows results. '.repeat(500);
const asyncOk=W.humanizeAsync(long,{tone:'concise',seed:2}).then(r=>{assert.ok(r.text.length>100);assert.ok(r.changes);console.log('humanizeAsync ok',r.wordCount);});


const acadH='This study examines how undergraduate writers revise literature-review paragraphs. Drawing on notes from 18 students in Lahore (Khan & Ali, 2020), we track where citation blocks interrupt argument flow. Several participants began with a broad claim, then inserted three summaries that barely connected. Others opened with a narrow gap statement and kept quotations short. The uneven pacing best predicted later grades in the cohort.';
const acadA="Furthermore, it is important to note that academic writing plays a crucial role in higher education. Moreover, students must leverage robust strategies to navigate the complexities of scholarly discourse. Additionally, fostering critical thinking is paramount for sustainable academic growth. In conclusion, a comprehensive approach will empower learners to unlock their full potential.";
const ah=W.detectAI(acadH), aa=W.detectAI(acadA);
assert.ok(ah.enough&&aa.enough);assert.ok(ah.score<=40,'academic human '+ah.score);assert.ok(aa.score>=70,'academic AI '+aa.score);
assert.ok(ah.register==='academic'||ah.register==='mixed');
assert.ok(Array.isArray(aa.topPhrases)&&aa.topPhrases.length>=3);
assert.ok(aa.signals.some(s=>s.key==='transitions'));
assert.ok(W.DETECTOR_SOFT_WORDS>=10000);

Promise.resolve(asyncOk).then(()=>console.log('writing tools engine tests passed'));
