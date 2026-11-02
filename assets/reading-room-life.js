'use strict';
// Reading Room living touches: a fairy-dust light that wanders the hero leaving twinkling sparkles,
// plus an occasional olive leaf drifting across the painting. Decorative only (aria-hidden,
// pointer-events:none). Visitors who prefer reduced motion get a calm, slower fairy with fewer sparkles and no leaves.
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
 // Fairy dust: one glowing point of light on smooth curved paths, shedding a capped pool of sparkles (canvas).
 const cv=document.createElement('canvas');cv.className='rr-fairy';cv.setAttribute('aria-hidden','true');document.body.appendChild(cv);
 const ctx=cv.getContext('2d');if(!ctx)return;
 let W=0,H=0,dpr=1;
 const resize=()=>{dpr=Math.min(2,window.devicePixelRatio||1);W=innerWidth;H=innerHeight;cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);};
 resize();addEventListener('resize',resize);
 const MAX=()=>calm?40:140;
 const pool=[];for(let i=0;i<140;i++)pool.push({on:false});
 const COLORS=['244,188,72','255,214,120','255,244,214','226,160,48','255,250,235'];
 function emit(x,y,n,spread){for(let k=0;k<n;k++){let live=0;for(const q of pool)if(q.on)live++;if(live>=MAX())return;const q=pool.find(q=>!q.on);if(!q)return;
  const a=Math.random()*Math.PI*2,v=(calm?.12:.3)*Math.random()*spread;
  Object.assign(q,{on:true,x:x+(Math.random()-.5)*4,y:y+(Math.random()-.5)*4,vx:Math.cos(a)*v,vy:Math.sin(a)*v*.6,g:calm?.006:.012,born:performance.now(),life:(calm?1300:850)+Math.random()*400,size:2+Math.random()*(calm?2.2:3.2),rot:Math.random()*Math.PI,c:COLORS[(Math.random()*COLORS.length)|0],star:Math.random()<.6,tw:Math.random()*6});}}
 function drawSpark(q,k,now){const r=q.size*(1-k*.8),al=(1-k)*(0.65+0.35*Math.sin(now/70+q.tw));if(r<=.2||al<=0)return;
  ctx.save();ctx.translate(q.x,q.y);ctx.rotate(q.rot);ctx.globalAlpha=al;ctx.fillStyle='rgb('+q.c+')';ctx.shadowColor='rgba(214,150,40,.95)';ctx.shadowBlur=8;
  ctx.beginPath();if(q.star){const R=r*2.4,i=r*.45;for(let j=0;j<8;j++){const rr=j%2?i:R,an=j*Math.PI/4;ctx.lineTo(Math.cos(an)*rr,Math.sin(an)*rr);}}else{ctx.moveTo(0,-r*1.6);ctx.lineTo(r,0);ctx.lineTo(0,r*1.6);ctx.lineTo(-r,0);}
  ctx.closePath();ctx.fill();ctx.restore();}
 // Waypoints around the title and hero, read live so they follow scrolling.
 const rect=sel=>{const n=typeof sel==='string'?document.querySelector(sel):sel;return n&&n.getBoundingClientRect();};
 const spots=[
  ()=>{const r=rect('.greek-intro h1');return r&&{x:r.right-Math.min(30,r.width*.06),y:r.top+4};},
  ()=>{const r=rect('.greek-intro h1');return r&&{x:r.left+r.width*.15,y:r.top-6};},
  ()=>{const r=rect(hero.querySelector('.greek-painting'));return r&&{x:r.left+r.width*.8,y:r.top+r.height*.25};},
  ()=>{const r=rect(hero.querySelector('.greek-painting'));return r&&{x:r.left+r.width*.25,y:r.top+r.height*.4};},
  ()=>{const r=rect(hero.querySelector('.greek-painting'));return r&&{x:r.left+r.width*.55,y:r.top+4};},
  ()=>{const r=rect('.greek-intro .lede');return r&&{x:r.left+r.width*.85,y:r.top};}
 ];
 const onScreen=p=>p&&p.y>70&&p.y<H-30&&p.x>20&&p.x<W-20;
 const bez=(a,b,c,d,t)=>{const u=1-t;return u*u*u*a+3*u*u*t*b+3*u*t*t*c+t*t*t*d;};
 let pos={x:-20,y:H*.25},state='idle',flight=null,spotFn=null,restUntil=performance.now()+150,lastSpot=-1,first=true,trailAcc=0,last=performance.now();
 function launch(now){const order=spots.map((f,i)=>i).filter(i=>i!==lastSpot).sort(()=>Math.random()-.5);let si=-1;for(const i of order){if(onScreen(spots[i]())){si=i;break;}}
  let to,fn=null;if(si>=0){fn=spots[si];to=fn();lastSpot=si;}else{to={x:W*(.2+Math.random()*.6),y:Math.max(90,H*(.15+Math.random()*.3))};}
  const from={...pos},dx=to.x-from.x,dy=to.y-from.y,dist=Math.hypot(dx,dy)||1,bend=(Math.random()<.5?-1:1)*Math.min(180,dist*.5),nx=-dy/dist,ny=dx/dist;
  flight={from,c1:{x:from.x+dx*.3+nx*bend,y:from.y+dy*.3+ny*bend-30},c2:{x:from.x+dx*.7-nx*bend*.7,y:from.y+dy*.7-ny*bend*.7-20},fn,to,start:now,dur:(first?900:Math.max(1600,Math.min(4200,dist*4.5)))*(calm?1.9:1)};first=false;state='flying';}
 function draw(now){const dt=Math.min(50,now-last);last=now;ctx.clearRect(0,0,W,H);
  if(!document.hidden){
   if(state==='flying'&&flight){const f=flight,t=Math.min(1,(now-f.start)/f.dur),e=t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2,end=f.fn?f.fn():null,to=end||f.to;
    const x=bez(f.from.x,f.c1.x,f.c2.x,to.x,e)+Math.sin(now/(calm?600:240))*(calm?3:6)*(1-e),y=bez(f.from.y,f.c1.y,f.c2.y,to.y,e)+Math.cos(now/(calm?520:200))*(calm?2:5);
    const sp=Math.hypot(x-pos.x,y-pos.y);pos={x,y};trailAcc+=sp*(calm?.12:.45)+dt*.01;
    if(t>=1){flight=null;state='resting';spotFn=f.fn;restUntil=now+(calm?2600:1600)+Math.random()*(calm?2500:2200);}}
   else if(state==='resting'){const p=spotFn&&spotFn();if(spotFn&&!onScreen(p)){launch(now);}else{if(p)pos={x:p.x+Math.sin(now/700)*4,y:p.y-10+Math.sin(now/520)*3};trailAcc+=dt*(calm?.004:.014);if(now>restUntil)launch(now);}}
   else if(now>restUntil){pos={x:Math.random()<.5?-20:W+20,y:Math.max(90,H*(.15+Math.random()*.25))};launch(now);}
   while(trailAcc>=1){emit(pos.x,pos.y,1,state==='resting'?3:1);trailAcc-=1;}
  }
  for(const q of pool){if(!q.on)continue;const k=(now-q.born)/q.life;if(k>=1){q.on=false;continue;}q.vy+=q.g*dt/16;q.x+=q.vx*dt/16;q.y+=(q.vy+(calm?.08:.18))*dt/16;q.rot+=.02;drawSpark(q,k,now);}
  // The fairy herself: a warm core with a soft halo that pulses.
  if(state!=='idle'&&state!=='away'){const pulse=1+.18*Math.sin(now/(calm?500:180));const g=ctx.createRadialGradient(pos.x,pos.y,0,pos.x,pos.y,24*pulse);
   g.addColorStop(0,'rgba(255,255,245,1)');g.addColorStop(.18,'rgba(255,236,170,.95)');g.addColorStop(.45,'rgba(240,176,60,.45)');g.addColorStop(1,'rgba(255,190,80,0)');
   ctx.fillStyle=g;ctx.beginPath();ctx.arc(pos.x,pos.y,24*pulse,0,Math.PI*2);ctx.fill();}
  requestAnimationFrame(draw);}
 requestAnimationFrame(draw);
 if(mq&&mq.addEventListener)mq.addEventListener('change',e=>{calm=e.matches;});
})();
