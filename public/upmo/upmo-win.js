(function(){
window.upmoProjPage=function(B,k,ttl){
var lab='font-size:11px;color:#4b5563;font-weight:600;';
var val='font-size:12px;white-space:nowrap;color:#1f2937;font-weight:700;';
var bx='border-radius:14px;padding:8px 6px;box-shadow:0 2px 8px rgba(0,0,0,0.12);';
function cell(t,f){return '<div style="margin-bottom:4px;"><div style="'+lab+'">'+t+'</div><div data-f="'+f+'" style="'+val+'">—</div></div>';}
B.innerHTML='<div style="padding:16px;"><div style="font-size:15px;font-weight:700;color:#1f2937;margin-bottom:16px;">'+ttl+'</div><div style="display:flex;gap:16px;align-items:stretch;"><div id="upmoPCard" style="position:relative;z-index:20;width:315px;box-sizing:border-box;box-shadow:-5px -5px 16px rgba(106,90,224,0.45),5px 5px 16px rgba(29,211,176,0.45),0 0 18px rgba(74,144,217,0.4);border-radius:16px;padding:14px 12px;background:linear-gradient(90deg,#6a5ae0 0%,#4a90d9 50%,#1dd3b0 100%);color:#fff;font-size:11px;"><div style="font-size:11px;color:rgba(255,255,255,0.85);font-weight:700;">Общая стоимость</div><div data-f="tc" style="font-size:18px;color:#fff;font-weight:700;margin-top:2px;">—</div><div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-top:10px;"><div style="'+bx+'background:rgba(255,255,255,0.5);">'+cell('План','pl')+cell('Остаток','rp')+'</div><div style="'+bx+'background:rgba(255,255,255,0.5);">'+cell('Выполнено','dn')+cell('Остаток','rd')+'</div><div style="'+bx+'background:rgba(255,255,255,0.5);">'+cell('Оплачено','pd')+cell('Остаток','rm')+'</div></div></div><div id="upmoPSt" style="display:flex;gap:0;align-items:stretch;flex:1;min-width:0;margin-left:-30px;"></div></div></div>';
fetch('/api/proj/summary?code='+encodeURIComponent(k.slice(5))).then(function(r){return r.json();}).then(function(d){
var fm=(typeof fmtMoney==='function')?fmtMoney:function(x){return String(x);};
var q=B.querySelector('#upmoPCard');if(!q){return;}
function sv(f,v){var e=q.querySelector('[data-f="'+f+'"]');if(e){e.textContent=fm(Math.round(v||0));}}
sv('tc',d.totalCost);sv('pl',d.plan);sv('rp',Math.max(0,(d.totalCost||0)-(d.plan||0)));sv('dn',d.done);sv('rd',Math.max(0,(d.totalCost||0)-(d.done||0)));sv('pd',d.paid);sv('rm',d.remaining);
}).catch(function(){});
(function(){var box=B.querySelector('#upmoPSt');if(!box){return;}
var ORD=['Базовое проектирование','Детальное проектирование','Изготовление','Логистика','Строительство','ПНР'];
box.innerHTML=ORD.map(function(n,i){return '<div style="box-sizing:border-box;flex:1 1 0;min-width:0;background:#fff;border-radius:0 14px 14px 0;padding:10px 12px 10px 42px;position:relative;z-index:'+(10-i)+';'+(i>0?'margin-left:-30px;':'')+'box-shadow:0 2px 14px rgba(0,0,0,0.2);"><div style="font-size:10px;font-weight:700;color:#1f2937;">'+n+'</div><div data-st="'+n+'" style="font-size:12px;font-weight:700;color:#1f2937;margin-top:6px;white-space:nowrap;">—</div></div>';}).join('');
fetch("/api/reports/"+encodeURIComponent(k.slice(5))+"/summary").then(function(r){return r.json();}).then(function(d){
var fm=(typeof fmtMoney==='function')?fmtMoney:function(x){return String(x);};
ORD.forEach(function(n){var f=null;(d.stages||[]).forEach(function(x){if(x.name===n||(n==='Строительство'&&/строительств|смр/i.test(x.name))||(n==='ПНР'&&/пнр|пуско/i.test(x.name))){f=x;}});
var e=box.querySelector('[data-st="'+n+'"]');if(e){var c=Math.round(f?(f.cost||0):0),dn=Math.round(f?(f.done||0):0),pd=Math.round(f?(f.paid||0):0),pl=Math.round(c*(f?(f.planPct||0):0)/100);
function mn(l,v,bg){var L='font-size:9px;color:#6b7280;font-weight:600;',V='font-size:10px;color:#1f2937;font-weight:700;';return '<div style="background:'+bg+';border-radius:10px;padding:5px 6px;min-width:0;"><div style="'+L+'">'+l+'</div><div style="'+V+'">'+fm(v)+'</div><div style="'+L+'margin-top:3px;">Остаток</div><div style="'+V+'">'+fm(Math.max(0,c-v))+'</div></div>';}
e.innerHTML=fm(c)+'<div style="display:grid;grid-template-columns:1fr 1fr;gap:5px;margin-top:5px;">'+mn('Выполнено',dn,'rgba(74,144,217,0.2)')+mn('Оплачено',pd,'rgba(29,211,176,0.22)')+'</div>';
var pp=Math.round(f?(f.planPct||0):0),fp=c?Math.min(100,Math.round(dn/c*100)):0,dl=fp-pp;
e.innerHTML+='<div style="display:flex;justify-content:space-between;font-size:10px;font-weight:700;margin-top:10px;"><span style="color:#4a90d9;">'+pp+'%</span><span style="color:'+(dl<0?'#d9776f':'#3aa88a')+';">'+(dl>0?'+':'')+dl+'%</span><span style="color:#2f855a;">'+fp+'%</span></div><div style="height:6px;border-radius:3px;background:#eef0f4;display:flex;overflow:hidden;margin-top:3px;"><div style="width:'+fp+'%;background:#1dd3b0;"></div><div style="width:'+Math.max(0,pp-fp)+'%;background:#4a90d9;"></div></div>';}});
}).catch(function(){});})();
};
var ov=null,A=null,B=null,busy=false;
var st=document.createElement('style');
st.textContent='.upm-win{position:fixed;z-index:2000;top:16px;bottom:16px;background:#fff;border-radius:0 20px 20px 0;box-sizing:border-box;border:1px solid rgba(0,0,0,0.06);transform:translateX(-100%);clip-path:inset(0 0 0 100%);transition:transform .45s cubic-bezier(.22,1,.36,1),clip-path .45s cubic-bezier(.22,1,.36,1);will-change:transform;overflow:auto;}.upm-win.on{transform:translateX(0);clip-path:inset(0 0 0 0);}#upmoA{left:104px;width:420px;padding:16px;z-index:2001;}#upmoB{left:104px;right:16px;bottom:auto;max-height:calc(100vh - 32px);}#upmoWin,#upmoWin *{-webkit-user-select:none;user-select:none;-webkit-tap-highlight-color:transparent;outline:none;}';
document.head.appendChild(st);
function row(l,k,t,hk){return '<div class="ml-row" data-k="'+k+'" style="display:flex;align-items:center;padding:9px 10px 9px 12px;cursor:pointer;text-align:left;font-size:11px;'+(l?'color:#374151;':'font-weight:700;color:#1f2937;')+'"><span class="ar" style="width:12px;min-width:12px;flex-shrink:0;color:#6b7280;">'+(hk?'&#9662;':'')+'</span><span>'+t+'</span></div>';}
function sec(k,t,items){var inn='';items.forEach(function(it){inn+=row(1,it[0],it[1],false);});return '<div class="ml-card0" style="margin:0 0 6px 0;">'+row(0,k,t,true)+'<div data-kids="'+k+'" data-o="1" style="max-height:600px;overflow:hidden;transition:max-height .35s ease;">'+inn+'</div></div>';}
function listHtml(){
var pi=[['act:all','Общая информация'],['act:int','Внутренний'],['act:ext','Внешний']];
var mi=[],ai=[];
try{mi=PROJECTS.main.items.map(function(it){return ['proj:'+it.code,it.code+' '+it.name];});ai=PROJECTS.aux.items.map(function(it){return ['proj:'+it.code,it.code+' '+it.name];});}catch(err){}
return sec('prep','Подготовительные работы',pi)+sec('main','Основные проекты',mi)+sec('aux','Вспомогательные проекты',ai);
}
function openAll(){
if(ov){return;}
if(Date.now()-(window._upmoLastClose||0)<560){return;}
ov=document.createElement('div');ov.id='upmoWin';
A=document.createElement('div');A.id='upmoA';A.className='upm-win';A.innerHTML=listHtml();
B=document.createElement('div');B.id='upmoB';B.className='upm-win';
ov.appendChild(A);ov.appendChild(B);document.body.appendChild(ov);
var b=document.getElementById('upmoBtn');if(b){b.classList.add('nav-active');}
A.addEventListener('click',function(e){
var r=e.target.closest('.ml-row');if(r===null){return;}
var k=r.getAttribute('data-k');
var kids=A.querySelector('[data-kids="'+k+'"]');
if(kids){var op=kids.getAttribute('data-o')==='1';kids.style.maxHeight=op?'0px':kids.scrollHeight+'px';kids.setAttribute('data-o',op?'0':'1');r.querySelector('.ar').innerHTML=op?'&#9656;':'&#9662;';return;}
if(k.indexOf('act:')===0||k.indexOf('proj:')===0){pick(k);}
});
void A.offsetWidth;
setTimeout(function(){if(A){A.classList.add('on');}},20);
}
function closeAll(){
if(ov===null){return;}
window._upmoLastClose=Date.now();
var o=ov,a=A,b=B;ov=null;A=null;B=null;busy=false;
a.classList.remove('on');b.classList.remove('on');
var bt=document.getElementById('upmoBtn');if(bt){bt.classList.remove('nav-active');}
setTimeout(function(){o.remove();if(ov===null&&window.upmoMapRestore){window.upmoMapRestore();}},520);
}
function pick(k){
if(busy){return;}busy=true;
var ttl='';try{ttl=A.querySelector('[data-k="'+k+'"] span:last-child').textContent;}catch(e){}
A.classList.remove('on');B.classList.remove('on');
setTimeout(function(){
if(B===null){busy=false;return;}
if(k.indexOf('proj:')===0){B.style.bottom='16px';window.upmoProjPage(B,k,ttl);}else if(window.upmoFillPanel){B.style.bottom='';window.upmoFillPanel(B,k);}
B.classList.add('on');busy=false;
},480);
}
document.addEventListener('click',function(e){
if(window.innerWidth<=768){return;}
var b=e.target.closest('#upmoBtn');
if(b){if(ov===null){openAll();}else if(A.classList.contains('on')){if(B.classList.contains('on')){A.classList.remove('on');}else{closeAll();}}else{A.classList.add('on');}return;}
if(ov&&!window._upmoMapInit&&e.target.closest('.buttons button')){closeAll();}
},true);
})();
