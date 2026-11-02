'use strict';
// Reading Room living touches: a butterfly that flies in, lands, rests and takes off again,
// plus an occasional olive leaf drifting across the painting. Decorative only (aria-hidden,
// pointer-events:none). Visitors who prefer reduced motion get a calm, slow butterfly and no leaves.
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
 // Butterfly.
 const life=document.createElement('div');life.className='rr-life';life.setAttribute('aria-hidden','true');
 const bf=document.createElement('div');bf.className='rr-butterfly'+(calm?' is-calm':'');
 const wing=(cls,flip)=>group(cls,[['path',{d:flip?'M17 14C21 3 31 0 33 6C34 11 27 14 17 14Z':'M17 14C13 3 3 0 1 6C0 11 7 14 17 14Z',fill:'#e0a526',stroke:'#4a3010','stroke-width':'1.1'}],['path',{d:flip?'M17 14C25 15 30 20 27 25C24 27 19 22 17 14Z':'M17 14C9 15 4 20 7 25C10 27 15 22 17 14Z',fill:'#c27a12',stroke:'#4a3010','stroke-width':'1.1'}],['circle',{cx:flip?'27.5':'6.5',cy:'7',r:'1.6',fill:'#fff6dc',stroke:'#4a3010','stroke-width':'.5'}]]);
 const s=svg(34,28,[]);s.appendChild(wing('rr-wing-l',false));s.appendChild(wing('rr-wing-r',true));
 s.appendChild(group('rr-body',[['ellipse',{cx:'17',cy:'15',rx:'1.3',ry:'6',fill:'#3d2c14'}],['path',{d:'M16.4 9.5C15.5 6.5 14 5 12.8 4.6M17.6 9.5C18.5 6.5 20 5 21.2 4.6',stroke:'#3d2c14','stroke-width':'.6',fill:'none'}]]));
 bf.appendChild(s);life.appendChild(bf);document.body.appendChild(life);
 // Landing spots, read live each frame so a resting butterfly stays put while the page scrolls.
 const spots=[
  ()=>{const r=document.querySelector('.greek-intro h1')?.getBoundingClientRect();return r&&{x:r.right-Math.min(40,r.width*.08),y:r.top+6};},
  ()=>{const r=hero.querySelector('.greek-painting')?.getBoundingClientRect();return r&&{x:r.left+r.width*.78,y:r.top+2};},
  ()=>{const rows=[...document.querySelectorAll('.reading-greek .article-row')].filter(n=>{const r=n.getBoundingClientRect();return r.top>60&&r.bottom<innerHeight-20;});const n=rows[Math.floor(Math.random()*rows.length)];if(!n)return null;const r=n.getBoundingClientRect();return {x:r.right-28,y:r.top+1};},
  ()=>{const r=document.querySelector('.reading-greek .articles-toolbar')?.getBoundingClientRect();return r&&{x:r.left+r.width*.2,y:r.top};}
 ];
 const onScreen=p=>p&&p.y>70&&p.y<innerHeight-30&&p.x>20&&p.x<innerWidth-20;
 let first=true,pos={x:-60,y:innerHeight*.3},angle=0,state='idle',flight=null,spot=null,restUntil=0;
 const place=(x,y,a)=>{bf.style.transform='translate('+x.toFixed(1)+'px,'+y.toFixed(1)+'px) rotate('+a.toFixed(1)+'deg)';};
 place(pos.x,pos.y,0);
 const bez=(p0,p1,p2,p3,t)=>{const u=1-t;return u*u*u*p0+3*u*u*t*p1+3*u*t*t*p2+t*t*t*p3;};
 function fly(to,getTarget,after){const from={...pos},dx=to.x-from.x,dy=to.y-from.y,dist=Math.hypot(dx,dy);
  const bend=(Math.random()<.5?-1:1)*Math.min(220,dist*.45);const nx=-dy/(dist||1),ny=dx/(dist||1);
  flight={from,c1:{x:from.x+dx*.3+nx*bend,y:from.y+dy*.3+ny*bend-40},c2:{x:from.x+dx*.75-nx*bend*.6,y:from.y+dy*.75-ny*bend*.6-30},getTarget,start:performance.now(),dur:(first?1400:Math.max(2600,Math.min(6000,dist*7)))*(calm?1.8:1),after};first=false;
  state='flying';bf.classList.remove('is-resting');}
 function chooseSpot(){const order=spots.map((f,i)=>i).sort(()=>Math.random()-.5);for(const i of order){const p=spots[i]();if(onScreen(p))return spots[i];}return null;}
 function launch(){const next=chooseSpot();if(next&&(first||Math.random()<.8)){const p=next();fly(p,next,()=>{state='resting';spot=next;restUntil=performance.now()+6000+Math.random()*7000;bf.classList.add('is-resting');});}
  else{const out={x:Math.random()<.5?-80:innerWidth+80,y:Math.random()*innerHeight*.5};fly(out,null,()=>{state='away';restUntil=performance.now()+14000+Math.random()*16000;});}}
 function tick(now){
  if(state==='flying'&&flight){let t=Math.min(1,(now-flight.start)/flight.dur);const e=t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
   const end=flight.getTarget?flight.getTarget():null;const to=end||{x:flight.c2.x,y:flight.c2.y};if(flight.getTarget&&!end){t=1;}
   const wob=Math.sin(now/(calm?420:180))*(calm?2:4)*(1-e);
   const x=bez(flight.from.x,flight.c1.x,flight.c2.x,to.x,e),y=bez(flight.from.y,flight.c1.y,flight.c2.y,to.y,e)+wob;
   const a=Math.max(-35,Math.min(35,Math.atan2(y-pos.y,x-pos.x)*57.3*.35+ (x>=pos.x?10:-10)));angle+=(a-angle)*.12;pos={x,y};place(x,y,angle);
   if(t>=1){const done=flight.after;flight=null;angle=0;done&&done();}}
  else if(state==='resting'){const p=spot&&spot();if(!onScreen(p)){launch();}else{pos=p;angle+=(0-angle)*.1;place(p.x,p.y-14,angle);if(now>restUntil)launch();}}
  else if((state==='away'||state==='idle')&&now>restUntil&&!document.hidden){pos={x:Math.random()<.5?-30:innerWidth+30,y:80+Math.random()*innerHeight*.35};launch();}
  requestAnimationFrame(tick);}
 restUntil=performance.now()+250;requestAnimationFrame(tick);
 if(mq&&mq.addEventListener)mq.addEventListener('change',e=>{calm=e.matches;bf.classList.toggle('is-calm',calm);});
})();
