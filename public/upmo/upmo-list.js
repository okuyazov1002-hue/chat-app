(function(){
var PREP='\u041f\u043e\u0434\u0433\u043e\u0442\u043e\u0432\u0438\u0442\u0435\u043b\u044c\u043d\u044b\u0435 \u0440\u0430\u0431\u043e\u0442\u044b';
var LBL='\u041f\u0440\u043e\u0435\u043a\u0442\u044b';
var M=null,SEL=0,CUR='';
function projs(){
var P=(typeof PROJECTS!=='undefined')?PROJECTS:window.PROJECTS;
var out=[];
if(!P){return out;}
['main','aux'].forEach(function(k){
var s=P[k],a=s&&(s.items||s);
if(!a||!a.forEach){return;}
a.forEach(function(it){
if(typeof it==='string'){out.push({c:'',n:it});}
else if(it){out.push({c:it.code||it.id||'',n:it.name||it.title||''});}
});
});
return out;
}
function apply(){var pw=document.getElementById('dbPanel');if(!pw){return;}if(!pw._pl){pw._pl=1;CUR='';SEL=0;}var bt=pw.querySelector('button.gb[data-v="Basic"]');if(bt&&CUR&&bt.textContent!==CUR){bt.textContent=CUR;}}
new MutationObserver(apply).observe(document.body,{childList:true,subtree:true,characterData:true});
﻿﻿﻿﻿﻿var CACHE={},INF={};
function prefetch(){
projs().forEach(function(q){
if(CACHE[q.c]||INF[q.c]){return;}
INF[q.c]=1;
fetch('/api/reports/rows?code='+encodeURIComponent(q.c),{credentials:'same-origin'}).then(function(r){return r.json();}).then(function(rows){INF[q.c]=0;if(rows&&rows.length!==undefined){CACHE[q.c]=rows;}}).catch(function(){INF[q.c]=0;});
});
}
setTimeout(prefetch,400);
setTimeout(prefetch,5000);

﻿function showTbl(pw,code){
var o=document.getElementById('prjTbl');if(o){o.parentNode.removeChild(o);}
var om=document.getElementById('prjMsg');if(om){om.parentNode.removeChild(om);}
var of=document.getElementById('prjFil');if(of){of.parentNode.removeChild(of);}
if(pw){pw.style.overflow=code?'hidden':'';if(code){pw.scrollTop=0;}}
if(!code||!pw){return;}
prefetch();
var gs=pw.querySelector('.gs');if(!gs){return;}
if(getComputedStyle(pw).position==='static'){pw.style.position='relative';}
if(!document.getElementById('plCss3')){var s3=document.createElement('style');s3.id='plCss3';s3.textContent='#prjTbl{scrollbar-width:none}#prjTbl::-webkit-scrollbar{display:none}';document.head.appendChild(s3);}
var a=gs.getBoundingClientRect(),p=pw.getBoundingClientRect();
var ref=gs.querySelector('td'),fs='12px',ff='system-ui,sans-serif';
if(ref){var cs=getComputedStyle(ref);fs=cs.fontSize;ff=cs.fontFamily;}
var PN='';projs().forEach(function(q){if(q.c===code){PN=q.n;}});
var d=document.createElement('div');d.id='prjTbl';
d.style.cssText='position:absolute;z-index:5;left:'+(a.left-p.left)+'px;top:'+(a.top-p.top)+'px;right:0;bottom:0;overflow:auto;background:#fff;font-size:'+fs+';font-family:'+ff+';color:#333';
pw.appendChild(d);
var EX={},DR=[],LOADED=false,MN=null;
var W=[70,150,120,190,200,300,95,95,95,95,60,100,100,90];
try{var sw=JSON.parse(localStorage.getItem('upmoPrjW')||'null');if(sw&&sw.length===14){W=sw;}}catch(err){}
if(!document.getElementById('plCss4')){var s4=document.createElement('style');s4.id='plCss4';s4.textContent='#prjTbl .rz{position:absolute;top:0;right:0;width:14px;height:100%;cursor:col-resize;z-index:4}#prjTbl .rz i{display:none;position:absolute;top:50%;margin-top:-6px;font-style:normal;font-size:8px;line-height:12px;color:#6a5be0}#prjTbl .rz .rzl{left:0}#prjTbl .rz .rzr{right:0}#prjTbl .rz:hover{background:linear-gradient(#6a5be0,#6a5be0) center/2px 100% no-repeat}#prjTbl .rz:hover i{display:block}';document.head.appendChild(s4);}
d.addEventListener('dblclick',function(e){var hd=e.target.closest&&e.target.closest('.rz');if(!hd){return;}e.preventDefault();e.stopPropagation();var j=+hd.getAttribute('data-j'),tb=d.querySelector('table'),cols=tb.querySelectorAll('col'),cv=document.createElement('canvas').getContext('2d'),mx=0;Array.prototype.forEach.call(tb.querySelectorAll('tr'),function(r){var c=r.children[j];if(!c){return;}cv.font=getComputedStyle(c).font;var w=cv.measureText((c.textContent||'').trim()).width;if(w>mx){mx=w;}});W[j]=Math.max(40,Math.min(700,Math.ceil(mx)+26));cols[j].style.width=W[j]+'px';tb.style.width=W.reduce(function(s,v){return s+v;},0)+'px';try{localStorage.setItem('upmoPrjW',JSON.stringify(W));}catch(er){}});
d.addEventListener('mousedown',function(e){
var hd=e.target.closest&&e.target.closest('.rz');if(!hd){return;}
e.preventDefault();e.stopPropagation();
var j=+hd.getAttribute('data-j'),x0=e.clientX,w0=W[j],w1=W[j+1],tb=d.querySelector('table'),cols=tb.querySelectorAll('col');
function mv(ev){var dx=ev.clientX-x0;if(j<W.length-1){dx=Math.max(40-w0,Math.min(w1-40,dx));W[j]=w0+dx;W[j+1]=w1-dx;cols[j].style.width=W[j]+'px';cols[j+1].style.width=W[j+1]+'px';}else{W[j]=Math.max(40,w0+dx);cols[j].style.width=W[j]+'px';}tb.style.width=W.reduce(function(s,v){return s+v;},0)+'px';}
function up(){document.removeEventListener('mousemove',mv,true);document.removeEventListener('mouseup',up,true);try{localStorage.setItem('upmoPrjW',JSON.stringify(W));}catch(err){}}
document.addEventListener('mousemove',mv,true);document.addEventListener('mouseup',up,true);
});
function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;');}
function nf(v){var n=Number(v);return isNaN(n)?'':n.toLocaleString('ru-RU',{minimumFractionDigits:2,maximumFractionDigits:2});}
function df(v){if(!v){return '';}var t=new Date(v);if(isNaN(t.getTime())){return '';}return ('0'+t.getUTCDate()).slice(-2)+'.'+('0'+(t.getUTCMonth()+1)).slice(-2)+'.'+t.getUTCFullYear();}
function V(r){return [r.code,PN,r.stage,r.obj,r.disc,r.item,df(r.planStart),df(r.planEnd),df(r.factStart),df(r.factEnd),r.currency,nf(r.cost),nf(r.done),r.status].map(function(x){return String(x==null?'':x);});}
function msg(t){
var m=document.getElementById('prjMsg');
if(!m){m=document.createElement('div');m.id='prjMsg';m.style.cssText='position:absolute;z-index:7;right:24px;top:'+(a.top-p.top+8)+'px;background:#5b49c8;color:#fff;padding:5px 12px;border-radius:12px;font:600 11px system-ui,sans-serif;max-width:60%';pw.appendChild(m);}
m.textContent=t;clearTimeout(m._t);m._t=setTimeout(function(){if(m.parentNode){m.parentNode.removeChild(m);}},5000);
}
var H=['Code','Project','Stage','Object','Discipline','Work Type','Planned Start','Planned Finish','Actual Start','Actual Finish','Currency','Cost','Completed','Status'];
var th='position:sticky;top:0;background:#f1f2fb;color:#3b3a6b;text-align:left;padding:6px 8px;border:1px solid #e5e7eb;white-space:nowrap;overflow:hidden';
var td='padding:6px 8px;border:1px solid #e5e7eb;overflow:hidden;text-overflow:ellipsis;white-space:nowrap';
function render(){
var h='<table style="border-collapse:collapse;table-layout:fixed;width:'+W.reduce(function(s,v){return s+v;},0)+'px"><colgroup>'+W.map(function(v){return '<col style="width:'+v+'px">';}).join('')+'</colgroup><thead><tr>';
H.forEach(function(t,j){var act=EX[j]&&Object.keys(EX[j]).length;h+='<th style="'+th+'">'+t+'<span class="pf" data-j="'+j+'" style="cursor:pointer;margin-left:6px;color:'+(act?'#5b49c8':'#a9a3dd')+'">'+(act?'\u25cf':'\u25be')+'</span><div class="rz" data-j="'+j+'"><i class="rzl">&#9666;</i><i class="rzr">&#9656;</i></div></th>';});
h+='</tr></thead><tbody>';
if(LOADED&&!DR.length){h+='<tr><td colspan="14" style="padding:40px;text-align:center;color:#9a98b8">\u041f\u0435\u0440\u0435\u0442\u0430\u0449\u0438\u0442\u0435 \u0444\u0430\u0439\u043b Excel \u0441\u044e\u0434\u0430</td></tr>';}
DR.forEach(function(r){
var v=V(r);
for(var j in EX){if(EX[j][v[j]]){return;}}
h+='<tr>';
v.forEach(function(x,j){
var st=td+((j>=6&&j<=9)?';white-space:nowrap':'')+((j===11||j===12)?';text-align:right;white-space:nowrap':'');
h+='<td title="'+esc(x).replace(/"/g,'&quot;')+'" style="'+st+'">'+esc(x)+'</td>';
});
h+='</tr>';
});
d.innerHTML=h+'</tbody></table>';
}
function draw(rows,loaded){DR=rows||[];LOADED=!!loaded;render();}
function closeMn(){if(MN){if(MN.parentNode){MN.parentNode.removeChild(MN);}MN=null;document.removeEventListener('mousedown',outMn,true);}}
function outMn(e){if(MN&&!MN.contains(e.target)&&!(e.target.closest&&e.target.closest('.pf'))){closeMn();}}
function openMn(t,j){
closeMn();
var seen={},vs=[];
DR.forEach(function(r){var v=V(r)[j];if(!seen[v]){seen[v]=1;vs.push(v);}});
vs.sort(function(x,y){return x.localeCompare(y,'ru',{numeric:true});});
var r0=t.getBoundingClientRect();
var m=document.createElement('div');m.id='prjFil';
m.style.cssText='position:fixed;z-index:100000;left:'+Math.max(4,Math.min(r0.left,innerWidth-260))+'px;top:'+(r0.bottom+4)+'px;width:250px;background:#fff;border:1px solid #d9d4f5;border-radius:10px;box-shadow:0 8px 22px rgba(106,91,214,.2);padding:8px;font:11px system-ui,sans-serif;color:#333';
var q=document.createElement('input');q.placeholder='\u041f\u043e\u0438\u0441\u043a';
q.style.cssText='width:100%;box-sizing:border-box;border:1px solid #d9d4f5;border-radius:8px;padding:5px 8px;font:11px system-ui,sans-serif;outline:none;margin-bottom:6px';
var top=document.createElement('label');top.style.cssText='display:flex;gap:6px;align-items:center;padding:3px 2px;font-weight:700;cursor:pointer';
var ta=document.createElement('input');ta.type='checkbox';top.appendChild(ta);top.appendChild(document.createTextNode('\u0412\u044b\u0431\u0440\u0430\u0442\u044c \u0432\u0441\u0435'));
var ls=document.createElement('div');ls.style.cssText='max-height:240px;overflow:auto;scrollbar-width:thin';
var items=[];
function sync(){var all=true;items.forEach(function(x){if(x.l.style.display!=='none'&&!x.c.checked){all=false;}});ta.checked=all;}
vs.forEach(function(v){
var l=document.createElement('label');l.style.cssText='display:flex;gap:6px;align-items:center;padding:3px 2px;cursor:pointer';
var c=document.createElement('input');c.type='checkbox';c.checked=!(EX[j]&&EX[j][v]);
c.onchange=function(){if(!EX[j]){EX[j]={};}if(c.checked){delete EX[j][v];}else{EX[j][v]=1;}sync();render();};
l.appendChild(c);
var sp=document.createElement('span');sp.textContent=(v===''?'(\u043f\u0443\u0441\u0442\u043e)':v);l.appendChild(sp);
ls.appendChild(l);items.push({l:l,c:c,v:v});
});
q.oninput=function(){var s=q.value.toLowerCase();items.forEach(function(x){x.l.style.display=(!s||(x.v||'(\u043f\u0443\u0441\u0442\u043e)').toLowerCase().indexOf(s)>=0)?'':'none';});sync();};
ta.onchange=function(){items.forEach(function(x){if(x.l.style.display==='none'){return;}x.c.checked=ta.checked;if(!EX[j]){EX[j]={};}if(ta.checked){delete EX[j][x.v];}else{EX[j][x.v]=1;}});render();};
m.appendChild(q);m.appendChild(top);m.appendChild(ls);
document.body.appendChild(m);MN=m;sync();
document.addEventListener('mousedown',outMn,true);
q.focus();
}
d.addEventListener('click',function(e){var t=e.target.closest&&e.target.closest('.pf');if(!t){return;}e.stopPropagation();if(MN){closeMn();return;}openMn(t,+t.getAttribute('data-j'));});
function load(){
var had=CACHE[code];
if(had){draw(had,true);}else{draw([],false);}
fetch('/api/reports/rows?code='+encodeURIComponent(code),{credentials:'same-origin'}).then(function(r){return r.json();}).then(function(rows){
if(!rows||rows.length===undefined){return;}
var same=had&&JSON.stringify(had)===JSON.stringify(rows);
CACHE[code]=rows;
if(document.getElementById('prjTbl')!==d||same){return;}
draw(rows,true);
}).catch(function(){});
}
load();
if(window._prjFlash){msg(window._prjFlash);window._prjFlash='';}
d.addEventListener('dragover',function(e){e.preventDefault();e.stopPropagation();d.style.outline='2px dashed #6a5be0';d.style.outlineOffset='-6px';});
d.addEventListener('dragleave',function(e){e.stopPropagation();d.style.outline='';});d.addEventListener('dragenter',function(e){e.preventDefault();e.stopPropagation();});
d.addEventListener('drop',function(e){
e.preventDefault();e.stopPropagation();d.style.outline='';
var f=e.dataTransfer&&e.dataTransfer.files&&e.dataTransfer.files[0];
if(!f){return;}
if(!/\.xlsx$/i.test(f.name)){msg('\u041d\u0443\u0436\u0435\u043d \u0444\u0430\u0439\u043b .xlsx');return;}
msg('\u0417\u0430\u0433\u0440\u0443\u0437\u043a\u0430...');
var fd=new FormData();fd.append('file',f);
fetch('/api/reports/import',{method:'POST',body:fd,credentials:'same-origin'}).then(function(r){return r.json();}).then(function(j){
CACHE={};INF={};prefetch();
var rs=j.results&&j.results[0];
if(rs&&rs.code&&rs.code!==code){var pr=projs(),ix=-1;pr.forEach(function(q,i){if(q.c===rs.code){ix=i;}});if(ix>=0){window._prjFlash=rs.code+': '+rs.status;SEL=ix+1;CUR=pr[ix].c+'  '+pr[ix].n;apply();showTbl(pw,rs.code);return;}}
msg(j.results?j.results.map(function(x){return x.code+': '+x.status;}).join(', '):(j.message||'\u041e\u0448\u0438\u0431\u043a\u0430'));
load();
}).catch(function(){msg('\u041e\u0448\u0438\u0431\u043a\u0430');});
});
}
function shut(){
if(!M){return;}
var m=M;M=null;
var bd=m._bd;bd.style.maxHeight='0px';m.style.width=m._w+'px';
bd.style.maxHeight='0px';
setTimeout(function(){if(m.parentNode){m.parentNode.removeChild(m);}},520);
}
function row(c,n,idx,bd){
var it=document.createElement('div');
it.style.cssText='display:flex;gap:10px;align-items:baseline;padding:6px 14px;font:11px/1.3 system-ui,sans-serif;color:#333;cursor:pointer;text-align:left;'+(idx===SEL?'background:#eeeaff':'');
it.innerHTML='<b style="color:#2a2a5a;min-width:64px;display:inline-block"></b><span></span>';
it.firstChild.textContent=c;
it.lastChild.textContent=n;
it.onmouseenter=function(){this.style.background='#f3f1ff';};
it.onmouseleave=function(){this.style.background=(idx===SEL?'#eeeaff':'');};
it.onclick=function(e){e.stopPropagation();SEL=idx;window._prjSel=idx;CUR=(idx===0?PREP:(c?c+'  ':'')+n);apply();var pw=document.getElementById('dbPanel');if(pw){if(!document.getElementById('plCss2')){var c2=document.createElement('style');c2.id='plCss2';c2.textContent='#dbPanel.prj-empty .gs{visibility:hidden!important}';document.head.appendChild(c2);}pw.classList.toggle('prj-empty',idx>0);showTbl(pw,idx>0?c:null);}shut();};
bd.appendChild(it);
}
function open(b){
var r=b.getBoundingClientRect();
var m=document.createElement('div');
m.style.cssText='position:fixed;z-index:99999;left:'+r.left+'px;top:'+r.top+'px;width:'+r.width+'px;transition:width .5s cubic-bezier(.22,1,.36,1);max-width:calc(100vw - '+(r.left+10)+'px);box-shadow:0 8px 22px rgba(106,91,214,.18);border-radius:'+(r.height/2)+'px '+(r.height/2)+'px 14px 14px;background:#fff';
var hd=document.createElement('div');
hd.textContent=CUR||LBL;
hd.style.cssText='height:'+r.height+'px;line-height:'+r.height+'px;text-align:center;color:#fff;font:700 9px/'+r.height+'px system-ui,sans-serif;background:linear-gradient(135deg,#7a68e0,#5b49c8);border-radius:'+(r.height/2)+'px;cursor:pointer';
var bd=document.createElement('div');
bd.style.cssText='max-height:0;overflow:hidden;scrollbar-width:none;transition:max-height .5s cubic-bezier(.22,1,.36,1);background:#fff;border-radius:0 0 14px 14px';
bd.className='pl-bd';if(!document.getElementById('plCss')){var cs=document.createElement('style');cs.id='plCss';cs.textContent='.pl-bd::-webkit-scrollbar{display:none}';document.head.appendChild(cs);}var inner=document.createElement('div');
inner.style.cssText='padding:4px 0 8px';
bd.appendChild(inner);
row('',PREP,0,inner);
inner.firstChild.firstChild.style.minWidth='0';
projs().forEach(function(p,i){row(p.c,p.n,i+1,inner);});
m.appendChild(hd);m.appendChild(bd);
m._bd=bd;
document.body.appendChild(m);
M=m;
m._w=r.width;m.getBoundingClientRect();m.style.width='480px';
bd.style.maxHeight=Math.min(inner.scrollHeight,innerHeight-r.bottom-30)+'px';
setTimeout(function(){if(M===m){bd.style.overflowY='auto';}},520);
hd.onclick=function(e){e.stopPropagation();shut();};
}
document.addEventListener('click',function(e){
var b=e.target.closest&&e.target.closest('#dbPanel button.gb[data-v="Basic"]');
if(b){e.stopPropagation();e.preventDefault();if(M){shut();}else{open(b);}return;}
if(M&&!M.contains(e.target)){shut();}
},true);
})();
