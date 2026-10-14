import os
cands=["public/upmo/upmo-cal.js","public/upmo-cal.js"]
pc=[c for c in cands if os.path.exists(c)]
cands2=["public/upmo/upmo-proj.js","public/upmo-proj.js"]
pp=[c for c in cands2 if os.path.exists(c)]
if not pc or not pp:
    print("FILES_NOT_FOUND",pc,pp)
    raise SystemExit
js=r"""(function(){
function isoWeek(d){var t=new Date(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate()));var dn=t.getUTCDay()||7;t.setUTCDate(t.getUTCDate()+4-dn);var y0=new Date(Date.UTC(t.getUTCFullYear(),0,1));return Math.ceil(((t-y0)/86400000+1)/7);}
window.upmoCal=function(el){
if(el===null){return;}
var now=new Date();
var MN=['Янв','Фев','Мар','Апр','Май','Июн','Июл','Авг','Сен','Окт','Ноя','Дек'];
var yr=(window.upmoPeriod&&window.upmoPeriod.y)||now.getFullYear();
var cw=isoWeek(now);
function fire(){try{window.dispatchEvent(new CustomEvent('upmo-period',{detail:window.upmoPeriod}));}catch(er){}}
function btn(k,t){var mode=window.upmoCalMode||'m';return '<span data-md="'+k+'" style="cursor:pointer;font-size:9px;font-weight:700;padding:2px 6px;border-radius:6px;user-select:none;'+(mode===k?'background:#fff;color:#4a90d9;':'color:#fff;')+'">'+t+'</span>';}
function draw(){
var mode=window.upmoCalMode||'m';
var p=window.upmoPeriod||null;
var h='<div style="display:flex;flex-direction:column;height:100%;padding:10px 12px;box-sizing:border-box;">';
h+='<div style="display:flex;align-items:center;gap:4px;margin-bottom:8px;">';
h+='<span style="display:flex;background:rgba(255,255,255,0.25);border-radius:8px;padding:2px;margin-right:6px;">'+btn('m','Мес')+btn('w','Нед')+'</span>';
h+='<span data-a="prev" style="cursor:pointer;color:rgba(255,255,255,0.85);font-size:15px;padding:0 3px;user-select:none;">&#8249;</span><span style="font-size:13px;font-weight:700;color:#fff;">'+yr+'</span><span data-a="next" style="cursor:pointer;color:rgba(255,255,255,0.85);font-size:15px;padding:0 3px;user-select:none;">&#8250;</span>';
h+='<span data-a="clr" style="margin-left:auto;cursor:pointer;font-size:17px;line-height:1;color:'+(p?'#fff':'rgba(255,255,255,0.45)')+';padding:0 2px;user-select:none;">&times;</span></div>';
if(mode==='m'){
h+='<div style="flex:1;min-height:0;display:grid;grid-template-columns:repeat(4,1fr);grid-template-rows:repeat(3,1fr);gap:6px;">';
for(var m=1;m<=12;m++){
var on=(p!==null&&p.y===yr&&p.m===m);
var cur=(yr===now.getFullYear()&&m===now.getMonth()+1);
h+='<div data-m="'+m+'" style="display:flex;align-items:center;justify-content:center;border-radius:10px;cursor:pointer;font-size:12px;font-weight:700;user-select:none;'+(on?'background:#fff;color:#4a90d9;':'background:rgba(255,255,255,0.28);color:#fff;')+((cur&&!on)?'box-shadow:inset 0 0 0 1.5px #fff;':'')+'">'+MN[m-1]+'</div>';
}
}else{
h+='<div style="flex:1;min-height:0;display:grid;grid-template-columns:repeat(9,1fr);grid-template-rows:repeat(6,1fr);gap:3px;">';
for(var w=1;w<=54;w++){
if(w>53){h+='<div></div>';continue;}
var onw=(p!==null&&p.y===yr&&p.w===w);
var curw=(yr===now.getFullYear()&&w===cw);
h+='<div data-w="'+w+'" style="display:flex;align-items:center;justify-content:center;border-radius:6px;cursor:pointer;font-size:9px;font-weight:700;user-select:none;'+(onw?'background:#fff;color:#4a90d9;':'background:rgba(255,255,255,0.28);color:#fff;')+((curw&&!onw)?'box-shadow:inset 0 0 0 1px #fff;':'')+'">'+w+'</div>';
}
}
h+='</div></div>';
el.innerHTML=h;
}
el.onclick=function(e){
var t=e.target.closest('[data-a],[data-m],[data-w],[data-md]');
if(t===null){return;}
var md=t.getAttribute('data-md');
var a=t.getAttribute('data-a');
var m=t.getAttribute('data-m');
var w=t.getAttribute('data-w');
if(md){
if((window.upmoCalMode||'m')!==md){window.upmoCalMode=md;if(window.upmoPeriod){window.upmoPeriod=null;fire();}}
}
else if(a==='prev'){yr--;}
else if(a==='next'){yr++;}
else if(a==='clr'){window.upmoPeriod=null;fire();}
else if(m){
m=parseInt(m,10);
var p=window.upmoPeriod||null;
if(p!==null&&p.y===yr&&p.m===m){window.upmoPeriod=null;}else{window.upmoPeriod={y:yr,m:m};}
fire();
}
else if(w){
w=parseInt(w,10);
var q=window.upmoPeriod||null;
if(q!==null&&q.y===yr&&q.w===w){window.upmoPeriod=null;}else{window.upmoPeriod={y:yr,w:w};}
fire();
}
draw();
};
draw();
};
})();
"""
open(pc[0],"w",encoding="utf-8").write(js)
print("WROTE",pc[0])
s=open(pp[0],encoding="utf-8").read()
a="if(!p){setCard(o,code,code===null);return;}"
n=s.count(a)
if n!=1:
    print("ANCHOR_COUNT",n)
else:
    b=a+"\nif(p.w){setCardMonth('Неделя '+p.w+' '+p.y+(code?' · '+code:''),'—','—','—','—');setProgPct(null,null);return;}"
    open(pp[0],"w",encoding="utf-8").write(s.replace(a,b));print("PATCHED",pp[0])
