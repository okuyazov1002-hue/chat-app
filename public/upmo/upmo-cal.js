(function(){
window.upmoCal=function(el){
if(el===null){return;}
var now=new Date();
var MN=['Янв','Фев','Мар','Апр','Май','Июн','Июл','Авг','Сен','Окт','Ноя','Дек'];
var yr=(window.upmoPeriod&&window.upmoPeriod.y)||now.getFullYear();
var wm=(window.upmoPeriod&&window.upmoPeriod.m)||(now.getMonth()+1);
function fire(){try{window.dispatchEvent(new CustomEvent('upmo-period',{detail:window.upmoPeriod}));}catch(er){}}
function two(n){return (n<10?'0':'')+n;}
function tuesdays(y,m){var out=[];var d=new Date(y,m-1,1);while(d.getDay()!==2){d.setDate(d.getDate()+1);}while(d.getMonth()===m-1){out.push({day:d.getDate(),key:y+'-'+two(m)+'-'+two(d.getDate())});d.setDate(d.getDate()+7);}return out;}
function btn(k,t){var mode=window.upmoCalMode||'m';return '<span data-md="'+k+'" style="cursor:pointer;font-size:9px;font-weight:700;padding:2px 6px;border-radius:6px;user-select:none;'+(mode===k?'background:#fff;color:#4a90d9;':'color:#fff;')+'">'+t+'</span>';}
function draw(){
var mode=window.upmoCalMode||'m';
var p=window.upmoPeriod||null;
var h='<div style="display:flex;flex-direction:column;height:100%;padding:10px 12px;box-sizing:border-box;">';
h+='<div style="display:flex;align-items:center;gap:4px;margin-bottom:8px;">';
h+='<span style="display:flex;background:rgba(255,255,255,0.25);border-radius:8px;padding:2px;margin-right:6px;">'+btn('m','Мес')+btn('w','Нед')+'</span>';
h+='<span data-a="prev" style="cursor:pointer;color:rgba(255,255,255,0.85);font-size:15px;padding:0 3px;user-select:none;">&#8249;</span><span style="font-size:13px;font-weight:700;color:#fff;">'+yr+'</span><span data-a="next" style="cursor:pointer;color:rgba(255,255,255,0.85);font-size:15px;padding:0 3px;user-select:none;">&#8250;</span>';
h+='<span data-a="clr" style="margin-left:auto;cursor:pointer;font-size:17px;line-height:1;color:'+(p?'#fff':'rgba(255,255,255,0.45)')+';padding:0 2px;user-select:none;">&times;</span></div>';
h+='<div id="upmoCalBody" style="flex:1;min-height:0;display:flex;flex-direction:column;'+(window._upmoCalFade?'opacity:0;transform:translateY(6px);':'')+'transition:opacity .22s ease,transform .22s ease;">';
if(mode==='m'){
h+='<div style="flex:1;min-height:0;display:grid;grid-template-columns:repeat(4,1fr);grid-template-rows:repeat(3,1fr);gap:6px;">';
for(var m=1;m<=12;m++){
var on=(p!==null&&p.y===yr&&p.m===m&&!p.t);
var cur=(yr===now.getFullYear()&&m===now.getMonth()+1);
h+='<div data-m="'+m+'" style="display:flex;align-items:center;justify-content:center;border-radius:10px;cursor:pointer;font-size:12px;font-weight:700;user-select:none;'+(on?'background:#fff;color:#4a90d9;':'background:rgba(255,255,255,0.28);color:#fff;')+((cur&&!on)?'box-shadow:inset 0 0 0 1.5px #fff;':'')+'">'+MN[m-1]+'</div>';
}
h+='</div>';
}else{
h+='<div style="display:grid;grid-template-columns:repeat(6,1fr);grid-template-rows:repeat(2,26px);gap:4px;">';
for(var k=1;k<=12;k++){
var onm=(k===wm);
h+='<div data-wm="'+k+'" style="display:flex;align-items:center;justify-content:center;border-radius:8px;cursor:pointer;font-size:10px;font-weight:700;user-select:none;'+(onm?'background:#fff;color:#4a90d9;':'background:rgba(255,255,255,0.28);color:#fff;')+'">'+MN[k-1]+'</div>';
}
h+='</div>';
h+='<div style="flex:1;min-height:0;display:flex;gap:6px;margin-top:8px;">';
tuesdays(yr,wm).forEach(function(t){
var ont=(p!==null&&p.t===t.key);
h+='<div data-t="'+t.key+'" style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;border-radius:10px;cursor:pointer;user-select:none;'+(ont?'background:#fff;color:#4a90d9;':'background:rgba(255,255,255,0.28);color:#fff;')+'"><span style="font-size:15px;font-weight:700;">'+t.day+'</span><span style="font-size:8px;font-weight:600;opacity:0.85;">вт</span></div>';
});
h+='</div>';
}
h+='</div>';
h+='</div>';el.innerHTML=h;var bd=document.getElementById('upmoCalBody');if(bd&&window._upmoCalFade){window._upmoCalFade=false;requestAnimationFrame(function(){requestAnimationFrame(function(){bd.style.opacity='1';bd.style.transform='none';});});}
}
el.onclick=function(e){
var t=e.target.closest('[data-a],[data-m],[data-wm],[data-t],[data-md]');
if(t===null){return;}
var md=t.getAttribute('data-md');
var a=t.getAttribute('data-a');
var m=t.getAttribute('data-m');
var wmv=t.getAttribute('data-wm');
var tk=t.getAttribute('data-t');
if(md){
if((window.upmoCalMode||'m')!==md){var bd0=document.getElementById('upmoCalBody');if(bd0){bd0.style.opacity='0';bd0.style.transform='translateY(6px)';}setTimeout(function(){window.upmoCalMode=md;if(window.upmoPeriod){window.upmoPeriod=null;fire();}window._upmoCalFade=true;draw();},200);return;}
}
else if(a==='prev'){yr--;}
else if(a==='next'){yr++;}
else if(a==='clr'){window.upmoPeriod=null;fire();}
else if(m){
m=parseInt(m,10);
var p=window.upmoPeriod||null;
if(p!==null&&p.y===yr&&p.m===m&&!p.t){window.upmoPeriod=null;}else{window.upmoPeriod={y:yr,m:m};}
fire();
}
else if(wmv){wm=parseInt(wmv,10);}
else if(tk){
var q=window.upmoPeriod||null;
if(q!==null&&q.t===tk){window.upmoPeriod=null;}else{window.upmoPeriod={y:yr,m:wm,t:tk};}
fire();
}
draw();
};
draw();
};
})();
