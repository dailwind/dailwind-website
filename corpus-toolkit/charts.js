'use strict';
(function(root){
const escape=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
function svg(data,type='bar',title='Corpus chart'){
 const rows=data.slice(0,20).filter(d=>Number.isFinite(d.value)),max=Math.max(1,...rows.map(d=>Math.abs(d.value))),colors=['#3478f6','#805ad5','#16a89d','#dc5f88','#e58b27','#577099'];
 let body='',height=type==='bar'?Math.max(200,rows.length*31+76):360;
 if(type==='bar'){body=rows.map((d,i)=>{const w=Math.abs(d.value)/max*370,y=54+i*31;return '<text x="12" y="'+(y+14)+'">'+escape(d.label.slice(0,24))+'</text><rect x="220" y="'+y+'" width="'+w+'" height="19" rx="4" fill="'+colors[i%colors.length]+'"/><text x="'+(228+w)+'" y="'+(y+14)+'">'+escape(d.value)+'</text>';}).join('');}
 else if(type==='line'){const lo=Math.min(0,...rows.map(d=>d.value)),hi=Math.max(1,...rows.map(d=>d.value)),points=rows.map((d,i)=>[50+i*600/Math.max(1,rows.length-1),290-(d.value-lo)/(hi-lo)*200]);body='<path d="M50 70V290H660" fill="none" stroke="#ccd4df"/><polyline points="'+points.map(p=>p.join(',')).join(' ')+'" fill="none" stroke="#3478f6" stroke-width="3"/>'+points.map(([x,y],i)=>'<circle cx="'+x+'" cy="'+y+'" r="5" fill="#3478f6"><title>'+escape(rows[i].label+': '+rows[i].value)+'</title></circle>').join('')+rows.filter((_,i)=>i%Math.max(1,Math.ceil(rows.length/6))===0).map(d=>{const i=rows.indexOf(d);return '<text transform="translate('+points[i][0]+',312) rotate(15)">'+escape(d.label.slice(0,14))+'</text>';}).join('');}
 else {const positive=rows.filter(d=>d.value>0),sum=positive.reduce((s,d)=>s+d.value,0);let offset=0;body=positive.map((d,i)=>{const pct=d.value/Math.max(1,sum),length=pct*628.319,shape='<circle cx="180" cy="185" r="100" fill="none" stroke="'+colors[i%colors.length]+'" stroke-width="48" stroke-dasharray="'+length+' '+(628.319-length)+'" stroke-dashoffset="'+(-offset)+'" transform="rotate(-90 180 185)"/><text x="340" y="'+(62+i*14)+'">'+escape(d.label.slice(0,28))+' · '+(pct*100).toFixed(1)+'%</text>';offset+=length;return shape;}).join('');}
 return '<svg xmlns="http://www.w3.org/2000/svg" width="720" height="'+height+'" viewBox="0 0 720 '+height+'" role="img"><title>'+escape(title)+'</title><rect width="720" height="'+height+'" fill="#ffffff"/><g font-family="Arial,sans-serif" font-size="12" fill="#233049"><text x="12" y="26" font-size="17" font-weight="bold">'+escape(title)+'</text>'+body+'</g></svg>';
}
const api={svg};if(typeof module!=='undefined'&&module.exports)module.exports=api;root.CorpusCharts=api;
})(typeof self!=='undefined'?self:globalThis);
