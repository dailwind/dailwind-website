'use strict';
// Reading Room living touches: little ancient Greek books that fly in, land, rest and take off again,
// plus an occasional olive leaf drifting across the painting. Decorative only (aria-hidden,
// pointer-events:none). Visitors who prefer reduced motion get calm, slow books and no leaves.
(()=>{
 const mq=window.matchMedia?window.matchMedia('(prefers-reduced-motion: reduce)'):null;
 let calm=!!(mq&&mq.matches);
 const hero=document.querySelector('.reading-greek:not(.greek-reader) .greek-hero');if(!hero)return;
 const NS='http://www.w3.org/2000/svg';
 const svg=(w,h,parts)=>{const s=document.createElementNS(NS,'svg');s.setAttribute('viewBox','0 0 '+w+' '+h);s.setAttribute('aria-hidden','true');s.setAttribute('focusable','false');parts.forEach(([tag,attrs])=>{const el=document.createElementNS(NS,tag);Object.entries(attrs).forEach(([k,v])=>el.setAttribute(k,v));s.appendChild(el);});return s;};
 const group=(cls,parts)=>{const g=document.createElementNS(NS,'g');g.setAttribute('class',cls);parts.forEach(([tag,attrs])=>{const el=document.createElementNS(NS,tag);Object.entries(attrs).forEach(([k,v])=>el.setAttribute(k,v));g.appendChild(el);});return g;};
 // Olive leaves inside the painting frame.
 const frame=hero.querySelector('.greek-painting-inner');
 if(frame&&!calm){const layer=document.createElement('div');layer.className='rr-leaf-layer';layer.setAttribute('aria-hidden','true');frame.appendChild(layer);
  const leaf=()=>{if(document.hidden||layer.childElementCount>2)return;const el=document.createElement('span');el.className='rr-leaf';const h=frame.clientHeight||300;
   el.style.setProperty('--x',(8+Math.random()*80)+'%');el.style.setProperty('--dx',(Math.random()*160-40)+'px');el.style.setProperty('--dy',(h+60)+'px');el.style.setProperty('--r',(160+Math.random()*260)+'deg');el.style.setProperty('--d',(9+Math.random()*6)+'s');
   el.appendChild(svg(22,10,[['path',{d:'M1 5C6 -.5 15 -.5 21 5C15 10.5 6 10.5 1 5Z',fill:Math.random()<.5?'#7d8a55':'#93a06a'}],['path',{d:'M2 5H20',stroke:'#5d6b3c','stroke-width':'.7'}]]));
   el.addEventListener('animationend',e=>{if(e.target===el)el.remove();});layer.appendChild(el);};
  setTimeout(leaf,2600);setInterval(leaf,6500);}
 // Flying books: two or three small Greek codices whose covers flap like wings.
 const life=document.createElement('div');life.className='rr-life';life.setAttribute('aria-hidden','true');
 const GOLD='#e2b65a',INK='#3a2410';
 const THEMES=[
  {cover:'#b5532f',dark:'#7e3418',emblem:'owl',left:'ΒΙΒΛΟΣ'},
  {cover:'#24426e',dark:'#152a4a',emblem:'amphora',left:'Α Ω'},
  {cover:'#6f7a3a',dark:'#4a5224',emblem:'laurel',left:'ΛΟΓΟΣ'}
 ];
 const make=(tag,attrs,parent)=>{const el=document.createElementNS(NS,tag);Object.entries(attrs).forEach(([k,v])=>el.setAttribute(k,v));parent&&parent.appendChild(el);return el;};
 // Greek key (meander) border as a single path inside a cover rectangle.
 const meander=(x0,y0,x1,y1)=>{let d='';const st=4;for(let x=x0;x<x1-st;x+=st)d+=`M${x} ${y0}h${st*.75}v${st*.6}h${-st*.4}`;for(let x=x0;x<x1-st;x+=st)d+=`M${x} ${y1}h${st*.75}v${-st*.6}h${-st*.4}`;return d;};
 function emblem(kind,g,cx,cy){
  if(kind==='owl'){make('ellipse',{cx,cy:cy+1.5,rx:5,ry:6,fill:GOLD},g);make('circle',{cx:cx-2,cy:cy-.5,r:1.9,fill:'#fff6dc'},g);make('circle',{cx:cx+2,cy:cy-.5,r:1.9,fill:'#fff6dc'},g);
   make('circle',{cx:cx-2,cy:cy-.5,r:.9,fill:INK},g);make('circle',{cx:cx+2,cy:cy-.5,r:.9,fill:INK},g);make('path',{d:`M${cx-.8} ${cy+1.2}L${cx} ${cy+2.4}L${cx+.8} ${cy+1.2}Z`,fill:'#a86a1a'},g);
   make('path',{d:`M${cx-4.6} ${cy-3.5}L${cx-3} ${cy-6}L${cx-1.6} ${cy-4}M${cx+4.6} ${cy-3.5}L${cx+3} ${cy-6}L${cx+1.6} ${cy-4}`,fill:GOLD,stroke:GOLD,'stroke-width':'.6'},g);}
  else if(kind==='amphora'){make('path',{d:`M${cx-1.6} ${cy-6}h3.2v1.4c3.4 1.6 4.4 4.6 3 7.6c-.8 1.8-2.2 3-3.2 4.2h-2.8c-1-1.2-2.4-2.4-3.2-4.2c-1.4-3 -.4-6 3-7.6Z`,fill:GOLD},g);
   make('path',{d:`M${cx-1.6} ${cy-4}c-3 0-3.6 3-2.4 4.4M${cx+1.6} ${cy-4}c3 0 3.6 3 2.4 4.4`,fill:'none',stroke:GOLD,'stroke-width':'.9'},g);make('path',{d:`M${cx-3.6} ${cy+1}h7.2`,stroke:'#7e3418','stroke-width':'.7'},g);}
  else{make('circle',{cx,cy,r:1.6,fill:GOLD},g);}
  // Small laurel wreath around every emblem.
  for(const side of [-1,1]){make('path',{d:`M${cx+side*1.5} ${cy+8.5}C${cx+side*8} ${cy+6} ${cx+side*8.5} ${cy-3} ${cx+side*5.5} ${cy-7.5}`,fill:'none',stroke:GOLD,'stroke-width':'.6'},g);
   for(let i=0;i<4;i++){const t=i/3.4,lx=cx+side*(2+6*Math.sin(t*2.4)),ly=cy+7.5-t*14;make('ellipse',{cx:lx.toFixed(2),cy:ly.toFixed(2),rx:'1.5',ry:'.7',fill:GOLD,transform:`rotate(${side*(-40-i*18)} ${lx.toFixed(2)} ${ly.toFixed(2)})`},g);}}
 }
 function bookSvg(th){
  const s=make('svg',{viewBox:'0 0 64 46','aria-hidden':'true',focusable:'false'});
  make('ellipse',{cx:32,cy:24,rx:30,ry:20,fill:'url(#rr-glow)'},null);
  // Pages fan (parchment) behind the covers.
  const pages=make('g',{class:'rr-pages'},s);
  make('path',{d:'M32 6C25 4 15 4 8 6V40C15 38 25 38 32 40Z',fill:'#f6e7c4',stroke:'#c9a96a','stroke-width':'.6'},pages);
  make('path',{d:'M32 6C39 4 49 4 56 6V40C49 38 39 38 32 40Z',fill:'#fbf0d6',stroke:'#c9a96a','stroke-width':'.6'},pages);
  for(let i=0;i<4;i++){make('path',{d:`M12 ${12+i*6}H28M36 ${12+i*6}H52`,stroke:'#cdb27a','stroke-width':'.5'},pages);}
  const cover=(cls,x)=>{const g=make('g',{class:cls},s);make('rect',{x,y:3,width:27,height:40,rx:2.5,fill:th.cover,stroke:th.dark,'stroke-width':'1.2'},g);
   make('rect',{x:x+2.3,y:5.3,width:22.4,height:35.4,rx:1.2,fill:'none',stroke:GOLD,'stroke-width':'.7'},g);
   make('path',{d:meander(x+3.4,6.8,x+24.4,39.2),fill:'none',stroke:GOLD,'stroke-width':'.55'},g);return g;};
  const l=cover('rr-cover rr-cover-l',5),r=cover('rr-cover rr-cover-r',32);
  const txt=make('text',{x:18.5,y:25,'text-anchor':'middle','font-family':'Georgia,serif','font-size':th.left.length>3?'4.4':'7','font-weight':'700',fill:GOLD,'letter-spacing':'.3'},l);txt.textContent=th.left;
  make('path',{d:'M11 29H26',stroke:GOLD,'stroke-width':'.5'},l);
  emblem(th.emblem,r,45.5,22.5);
  make('rect',{x:30.4,y:2.4,width:3.2,height:41.2,rx:1.4,fill:th.dark,stroke:GOLD,'stroke-width':'.5'},s);
  return s;}
 const defs=make('svg',{width:0,height:0,'aria-hidden':'true',style:'position:absolute'},null);
 const grad=make('radialGradient',{id:'rr-glow'},make('defs',{},defs));make('stop',{offset:'0','stop-color':'#ffd98a','stop-opacity':'.55'},grad);make('stop',{offset:'1','stop-color':'#ffd98a','stop-opacity':'0'},grad);
 life.appendChild(defs);
 // Landing spots, read live each frame so a resting book stays put while the page scrolls.
 const spots=[
  ()=>{const r=document.querySelector('.greek-intro h1')?.getBoundingClientRect();return r&&{x:r.right-Math.min(40,r.width*.08),y:r.top+4};},
  ()=>{const r=hero.querySelector('.greek-painting')?.getBoundingClientRect();return r&&{x:r.left+r.width*.82,y:r.top+2};},
  ()=>{const r=hero.querySelector('.greek-painting')?.getBoundingClientRect();return r&&{x:r.left+r.width*.18,y:r.top+2};},
  ()=>{const r=document.querySelector('.greek-intro h1')?.getBoundingClientRect();return r&&{x:r.left+Math.min(40,r.width*.08),y:r.top+4};},
  ()=>{const rows=[...document.querySelectorAll('.reading-greek .article-row')].filter(n=>{const r=n.getBoundingClientRect();return r.top>60&&r.bottom<innerHeight-20;});const n=rows[0];if(!n)return null;const r=n.getBoundingClientRect();return {x:r.right-34,y:r.top+1};},
  ()=>{const r=document.querySelector('.reading-greek .articles-toolbar')?.getBoundingClientRect();return r&&{x:r.left+r.width*.2,y:r.top};}
 ];
 const onScreen=p=>p&&p.y>70&&p.y<innerHeight-30&&p.x>24&&p.x<innerWidth-24;
 const bez=(p0,p1,p2,p3,t)=>{const u=1-t;return u*u*u*p0+3*u*u*t*p1+3*u*t*t*p2+t*t*t*p3;};
 const taken=new Set();
 const count=innerWidth<520?2:3;
 const books=[];
 for(let i=0;i<count;i++){
  const el=document.createElement('div');el.className='rr-book'+(calm?' is-calm':'');el.style.setProperty('--phase',(i*.37).toFixed(2)+'s');
  const bob=document.createElement('div');bob.className='rr-book-bob';bob.appendChild(bookSvg(THEMES[i]));el.appendChild(bob);life.appendChild(el);
  const fromLeft=i%2===0;
  books.push({el,i,first:true,pos:{x:fromLeft?-40:innerWidth+40,y:innerHeight*(.22+i*.12)},angle:0,state:'idle',flight:null,spot:-1,restUntil:0,fromLeft});}
 document.body.appendChild(life);
 const place=(b,x,y,a)=>{b.el.style.transform='translate('+x.toFixed(1)+'px,'+y.toFixed(1)+'px) rotate('+a.toFixed(1)+'deg)';};
 books.forEach(b=>place(b,b.pos.x,b.pos.y,0));
 // Keep books apart: a spot is free only if no other book holds it and the point is not near another book.
 const near=(b,p)=>books.some(o=>o!==b&&Math.hypot(o.pos.x-p.x,o.pos.y-p.y)<96);
 function chooseSpot(b){const order=spots.map((f,i)=>i).sort(()=>Math.random()-.5);for(const i of order){if(taken.has(i))continue;const p=spots[i]();if(onScreen(p)&&!near(b,p))return i;}return -1;}
 function fly(b,to,si,after){const from={...b.pos},dx=to.x-from.x,dy=to.y-from.y,dist=Math.hypot(dx,dy);
  const bend=(b.i%2?-1:1)*Math.min(200,dist*.4);const nx=-dy/(dist||1),ny=dx/(dist||1);
  b.flight={from,c1:{x:from.x+dx*.3+nx*bend,y:from.y+dy*.3+ny*bend-40},c2:{x:from.x+dx*.75-nx*bend*.6,y:from.y+dy*.75-ny*bend*.6-30},si,start:performance.now(),dur:(b.first?1500+b.i*250:Math.max(2800,Math.min(6500,dist*7)))*(calm?1.8:1),after};b.first=false;
  b.state='flying';b.el.classList.remove('is-resting');}
 function launch(b){if(b.spot>=0)taken.delete(b.spot);b.spot=-1;const si=chooseSpot(b);
  if(si>=0&&(b.first||Math.random()<.8)){taken.add(si);b.spot=si;fly(b,spots[si](),si,()=>{b.state='resting';b.restUntil=performance.now()+6000+Math.random()*7000;b.el.classList.add('is-resting');});}
  else{const out={x:Math.random()<.5?-90:innerWidth+90,y:80+Math.random()*innerHeight*.4};fly(b,out,-1,()=>{b.state='away';b.restUntil=performance.now()+9000+Math.random()*12000;});}}
 function step(b,now){
  if(b.state==='flying'&&b.flight){const f=b.flight;let t=Math.min(1,(now-f.start)/f.dur);const e=t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
   const end=f.si>=0?spots[f.si]():null;if(f.si>=0&&!end)t=1;const to=end?{x:end.x,y:end.y-22}:{x:f.c2.x,y:f.c2.y};
   const wob=Math.sin(now/(calm?520:260)+b.i)*(calm?2:5)*(1-e);
   const x=bez(f.from.x,f.c1.x,f.c2.x,to.x,e),y=bez(f.from.y,f.c1.y,f.c2.y,to.y,e)+wob;
   const tilt=Math.sin(now/(calm?900:450)+b.i*2)*(calm?3:7);
   const a=Math.max(-22,Math.min(22,(x-b.pos.x)*(calm?.6:1.2)))+tilt*(1-e*.7);b.angle+=(a-b.angle)*.1;b.pos={x,y};place(b,x,y,b.angle);
   if(t>=1){const done=f.after;b.flight=null;done&&done();}}
  else if(b.state==='resting'){const p=spots[b.spot]&&spots[b.spot]();if(!onScreen(p)){launch(b);}else{b.pos={x:p.x,y:p.y-22};b.angle+=(0-b.angle)*.08;place(b,b.pos.x,b.pos.y,b.angle);if(now>b.restUntil)launch(b);}}
  else if((b.state==='away'||b.state==='idle')&&now>b.restUntil&&!document.hidden){if(b.state==='away')b.pos={x:Math.random()<.5?-50:innerWidth+50,y:80+Math.random()*innerHeight*.35};launch(b);}}
 const t0=performance.now();books.forEach((b,i)=>{b.restUntil=t0+200+i*450;});
 function tick(now){books.forEach(b=>step(b,now));requestAnimationFrame(tick);}
 requestAnimationFrame(tick);
 if(mq&&mq.addEventListener)mq.addEventListener('change',e=>{calm=e.matches;books.forEach(b=>b.el.classList.toggle('is-calm',calm));});
})();
