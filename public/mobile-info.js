(function(){
var opened={};
function mrow(level,key,text,hasKids,isOpen){
var arrow=hasKids?(isOpen?'▾':'▸'):'';
var st='display:flex;align-items:center;padding:9px 10px 9px 12px;border-bottom:1px solid #eef0f3;cursor:pointer;text-align:left;font-size:11px;';
if(level==0){st+='font-weight:700;color:#1f2937;';}else{st+='color:#374151;';}
if(level>0&&key.indexOf('prep:')==0){st+='border-bottom:none;';}
return '<div class="ml-row" data-key="'+key+'" style="'+st+'"><span style="width:12px;min-width:12px;flex-shrink:0;color:#6b7280;">'+arrow+'</span><span>'+text+'</span></div>';
}
function kids(key,inner){return '<div class="ml-kids'+(opened[key]?' open':'')+'" data-kids="'+key+'"><div class="ml-kids-in">'+inner+'</div></div>';}
function pname(pc){var r='';['main','aux'].forEach(function(s){PROJECTS[s].items.forEach(function(it){if(it.code==pc){r=it.name;}});});return r;}
function build(){
var h='';var g={},order=[];
PROJECTS.prep.items.forEach(function(it){var pc=it.code.split('-')[0];if(g[pc]==null){g[pc]=[];order.push(pc);}g[pc].push(it);});
h+='<div class="ml-card0">'+mrow(0,'prep','Подготовительные работы',true,opened['prep']);
var inner='';
inner+=mrow(1,'act:all','Общая информация',false,false)+mrow(1,'act:int','Внутренний',false,false)+mrow(1,'act:ext','Внешний',false,false);
h+=kids('prep',inner)+'</div>';
['main','aux'].forEach(function(sec){var inn='';PROJECTS[sec].items.forEach(function(it){inn+=mrow(1,'proj:'+it.code,it.code+' '+it.name,false,false);});h+='<div class="ml-card0">'+mrow(0,sec,PROJECTS[sec].title,true,opened[sec])+kids(sec,inn)+'</div>';});
return h;
}
function closeSheet(ov){var pp=document.getElementById('prepPanel');if(pp){pp.style.transform='translateY(110%)';setTimeout(function(){pp.remove();},400);}var b=document.getElementById('infoBtn');ov.classList.remove('open');ov.querySelector('.stage-modal').classList.remove('open');if(b){b.classList.remove('nav-active');}setTimeout(function(){ov.remove();},400);}
window.dsCloseSheet=closeSheet;
document.addEventListener('click',function(e){
if(window.innerWidth>768){return;}
var b=e.target.closest('#infoBtn');
if(b==null){return;}
e.stopImmediatePropagation();e.preventDefault();
var ex=document.getElementById('infoSheetOverlay');
if(ex){closeSheet(ex);return;}
document.querySelectorAll('.stage-modal-overlay').forEach(function(o){o.remove();});
document.querySelectorAll('.buttons button').forEach(function(x){x.classList.remove('nav-active');});
b.classList.add('nav-active');
var ov=document.createElement('div');
ov.id='infoSheetOverlay';ov.className='stage-modal-overlay';
ov.style.display='block';ov.style.padding='0';ov.style.background='transparent';
ov.innerHTML='<div class="stage-modal" style="position:fixed;left:0;top:56px;bottom:64px;width:100%;"><div class="obj-modal-header">Информация</div><div id="infoSheetBody" style="flex:1;min-height:0;padding:6px 0 16px 0;">'+build()+'</div></div>';
document.body.appendChild(ov);
setTimeout(function(){ov.classList.add('open');ov.querySelector('.stage-modal').classList.add('open');},20);
ov.addEventListener('click',function(ev){
if(ev.target==ov){closeSheet(ov);return;}
var row=ev.target.closest('.ml-row');
if(row==null){return;}
var key=row.getAttribute('data-key');
if(key.indexOf('act:')==0){window.dsGoPrep(key);return;}
var k=ov.querySelector('[data-kids="'+key+'"]');
if(k==null){return;}
opened[key]=(opened[key]==true)?false:true;
if(opened[key]&&(key=='prep'||key=='main'||key=='aux')){['prep','main','aux'].forEach(function(o){if(o==key){return;}opened[o]=false;var kk=ov.querySelector('[data-kids="'+o+'"]');var rr=ov.querySelector('.ml-row[data-key="'+o+'"]');if(kk){kk.classList.remove('open');}if(rr){rr.firstChild.textContent='▸';}});}
k.classList.toggle('open');
row.firstChild.textContent=opened[key]?'▾':'▸';
});
},true);
})();
window.dsGoPrep=function(key){
var titles={'act:all':'Общая информация','act:int':'Внутренний','act:ext':'Внешний'};
var old=document.getElementById('prepPanel');
if(old){old.remove();}
var p=document.createElement('div');
p.id='prepPanel';
p.style.cssText='position:fixed;left:0;top:56px;bottom:64px;width:100%;background:#fff;z-index:1000;display:flex;flex-direction:column;transform:translateX(100%);transition:transform 0.38s cubic-bezier(0.4,0,0.2,1);';
p.innerHTML='<div class="obj-modal-header" style="display:flex;align-items:center;gap:10px;"><span id="prepPanelBack" style="cursor:pointer;display:flex;align-items:center;padding:4px 10px 4px 0;"><svg width="14" height="14" viewBox="0 0 24 24"><path d="M17 3L5 12L17 21Z" fill="currentColor"/></svg></span><span>'+titles[key]+'</span></div><div id="prepPanelBody" style="flex:1;min-height:0;overflow-y:auto;padding:0;"></div>';
document.body.appendChild(p);
if(key=='act:all'||key=='act:int'||key=='act:ext'){window.dsRenderPrepAll(document.getElementById('prepPanelBody'),key.slice(4));}
setTimeout(function(){p.style.transform='translateX(0)';},20);
document.getElementById('prepPanelBack').addEventListener('click',function(){p.style.transform='translateX(100%)';setTimeout(function(){p.remove();},400);});
};
document.addEventListener('click',function(e){
var b=e.target.closest('.buttons button');
if(b==null){return;}
if(window.dsSkipNav){return;}
if(b.id=='infoBtn'){return;}
var p=document.getElementById('prepPanel');
if(p){p.remove();}
var s=document.getElementById('infoSheetOverlay');if(s){window.dsCloseSheet(s);}
},true);
window.dsRenderPrepAll=function(body,mode){var ty=(mode=='int'||mode=='ext')?mode:'';
body.style.background='linear-gradient(90deg,#ffffff 0%,#e8f1fb 50%,#f3e9fb 100%)';
body.innerHTML='<div id="dsCardTotal" style="background:linear-gradient(90deg,#6a5ae0 0%,#4a90d9 50%,#1dd3b0 100%);border-radius:0;box-shadow:0 2px 10px rgba(0,0,0,0.15);padding:8px 14px 36px;display:flex;align-items:center;justify-content:space-between;gap:10px;"></div>';
body.insertAdjacentHTML('beforeend','<div id="dsBlock2" style="position:relative;margin-top:-18px;background:#fff;border-radius:18px 18px 0 0;padding:0 0 18px 0;box-sizing:border-box;"></div>');
window.dsFillProjects(document.getElementById('dsBlock2'),ty);
body.insertAdjacentHTML('beforeend','<div id="dsBlock3" style="position:relative;margin:-18px 0 14px 0;background:linear-gradient(90deg,#6a5ae0 0%,#4a90d9 50%,#1dd3b0 100%);border-radius:18px;padding:0 0 24px 0;box-sizing:border-box;"></div>');window.dsFillMonths(document.getElementById('dsBlock3'),ty);
fetch('/api/prep/summary'+(ty?'?type='+ty:'')).then(function(r){return r.json();}).then(function(d){
var el=document.getElementById('dsCardTotal');
if(el==null){return;}
var fact=d.totalCost?Math.round(d.done/d.totalCost*100):0;
var circ=2*Math.PI*36;
var lab='font-size:10px;color:#4b5563;font-weight:600;';var blk='background:rgba(255,255,255,0.5);border-radius:14px;padding:6px 10px;box-shadow:0 2px 8px rgba(0,0,0,0.12);';
var val='font-size:12px;color:#1f2937;font-weight:700;';var pct='font-size:13px;color:#1f2937;font-weight:700;margin-top:3px;';function pf(x){return (Math.round(x*100)/100).toFixed(2).replace('.',',');}
var left='<div style="width:100%;"><div style="display:flex;align-items:flex-start;justify-content:space-between;"><div style="font-size:11px;color:rgba(255,255,255,0.85);font-weight:700;">Общая стоимость</div><div id="dsMapBtn" style="background:rgba(255,255,255,0.5);border-radius:14px;padding:6px 10px;box-sizing:border-box;width:calc((100% - 12px)/3);height:38px;margin-bottom:-25px;display:flex;align-items:center;justify-content:center;gap:6px;font-size:12px;font-weight:700;color:#1f2937;box-shadow:0 2px 8px rgba(0,0,0,0.12);cursor:pointer;"><svg width="12" height="12" viewBox="0 0 24 24"><path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" fill="currentColor"/></svg>Карта</div></div><div style="font-size:18px;color:#fff;font-weight:700;margin-top:2px;">'+fmtMoney(d.totalCost)+'</div><div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;margin-top:10px;"><div style="'+blk+'"><div style="'+lab+'">План</div><div style="'+val+'">'+fmtMoney(Math.round(d.totalCost*(d.planPct||0)/100))+'</div></div><div style="'+blk+'"><div style="'+lab+'">Освоено</div><div style="'+val+'">'+fmtMoney(d.done)+'</div></div><div style="'+blk+'"><div style="'+lab+'">Остаток</div><div style="'+val+'">'+fmtMoney(d.remaining)+'</div></div></div></div>';
var ring=(function(){var c=2*Math.PI*28;var pp=Math.round(d.planPct);var dot='width:8px;height:8px;border-radius:50%;display:inline-block;border:1px solid #fff;box-sizing:border-box;';return '<div style="flex-shrink:0;display:flex;align-items:center;gap:6px;"><div style="width:72px;height:72px;"><svg width="72" height="72" viewBox="0 0 72 72" style="transform:rotate(-90deg);"><circle cx="36" cy="36" r="28" fill="none" stroke="#fff" stroke-width="9"/><circle cx="36" cy="36" r="28" fill="none" stroke="#4a9fd8" stroke-width="9" stroke-linecap="round" stroke-dasharray="'+(c*pp/100)+' '+c+'"/><circle cx="36" cy="36" r="28" fill="none" stroke="#38a169" stroke-width="9" stroke-linecap="round" stroke-dasharray="'+(c*fact/100)+' '+c+'"/></svg></div><div style="display:flex;flex-direction:column;gap:6px;font-size:10px;font-weight:700;color:#fff;white-space:nowrap;"><div style="display:flex;align-items:center;gap:4px;"><span style="'+dot+'background:#4a9fd8;"></span>План '+pp+'%</div><div style="display:flex;align-items:center;gap:4px;"><span style="'+dot+'background:#38a169;"></span>Факт '+pf(d.totalCost?d.done/d.totalCost*100:0)+'%</div></div></div>';})();
el.innerHTML=left;var mb=document.getElementById('dsMapBtn');if(mb){mb.addEventListener('click',function(){window.dsMapToggle();});}
});
};
window.dsFillProjects=function(box,ty){
box.innerHTML='<div id="dsProjList" style="font-size:11px;color:#9ca3af;">Загрузка...</div>';
fetch('/api/prep/objects'+(ty?'?type='+ty:'')).then(function(r){return r.json();}).then(function(list){if(ty&&list.length==0){var e0=document.getElementById('dsProjList');if(e0){e0.innerHTML='';}return;}
var names={},pre={},dm={};
PROJECTS.prep.items.forEach(function(it){names[it.code]=it.name;if(ty){return;}var pc=it.code.split('-')[0];if(pre[pc]==null){pre[pc]=[];}pre[pc].push(it.code);});
list.forEach(function(o){dm[o.code]=o;var pc=o.code.split('-')[0];if(pre[pc]==null){pre[pc]=[];}if(pre[pc].indexOf(o.code)<0){pre[pc].push(o.code);}});
var pn={OPS01:'Внепроектные объекты'};[].concat(PROJECTS.main.items,PROJECTS.aux.items).forEach(function(p){pn[p.code]=p.name;});
var parents=[],used={};[].concat(PROJECTS.main.items,PROJECTS.aux.items).forEach(function(p){if(pre[p.code]!=null){parents.push({code:p.code,name:p.name});used[p.code]=true;}});
Object.keys(pre).forEach(function(pc){if(used[pc]==true){return;}parents.push({code:pc,name:pn[pc]||pc});});
var cell='border-radius:9px;padding:2px 0;width:36px;box-sizing:border-box;text-align:center;font-variant-numeric:tabular-nums;font-size:9px;font-weight:700;color:#fff;';
function pills(has,cost,done,plan){var wrap='<span style="margin-left:auto;display:flex;gap:4px;align-items:center;flex-shrink:0;">';if(has==false){return wrap+'<span style="background:#4a9fd8;'+cell+'">—</span><span style="background:#38a169;'+cell+'">—</span><span style="color:#9ca3af;font-size:9px;font-weight:700;width:34px;text-align:right;">—</span></span>';}var f=cost?Math.round(done/cost*100):0;var pl=Math.round(plan);var d=f-pl;var dc=d<0?'#e53e3e':'#38a169';return wrap+'<span style="background:#4a9fd8;'+cell+'">'+pl+'%</span><span style="background:#38a169;'+cell+'">'+f+'%</span><span style="color:'+dc+';font-size:9px;font-weight:700;width:34px;text-align:right;font-variant-numeric:tabular-nums;">'+(d>0?'+':'')+d+'%</span></span>';}
var h='';
parents.forEach(function(p){var codes=pre[p.code]||[];var cost=0,done=0,pw=0,has=false;var objs='';codes.forEach(function(c){var o=dm[c];var oh=(o==null)?false:((o.cost||0)>0);if(oh){has=true;cost+=o.cost||0;done+=o.done||0;pw+=(o.planPct||0)*(o.cost||0);}objs+='<div class="dsObj" data-oc="'+c+'" data-nd="'+(oh?'':'1')+'" style="cursor:pointer;display:flex;align-items:center;gap:6px;padding:8px 10px;border-top:1px solid #eef0f3;font-size:9px;color:#374151;"><span>'+(names[c]||c)+'</span>'+pills(oh,oh?o.cost:0,oh?o.done:0,oh?(o.planPct||0):0)+'</div>';});h+='<div class="ml-card"><div class="dsPr" data-pk="'+p.code+'" style="display:flex;align-items:center;gap:6px;padding:9px 10px;cursor:pointer;font-size:9px;font-weight:700;color:#1f2937;"><span>'+p.name+'</span>'+pills(has,cost,done,cost?pw/cost:0)+'</div><div class="ml-kids" data-pk-kids="'+p.code+'"><div class="ml-kids-in">'+objs+'</div></div></div>';});
var tot={c:0,d:0,w:0};list.forEach(function(o){if((o.cost||0)>0){tot.c+=o.cost;tot.d+=o.done||0;tot.w+=(o.planPct||0)*o.cost;}});
document.getElementById('dsProjList').innerHTML='<div class="dsPr" data-pk="__all" style="display:flex;align-items:center;gap:6px;padding:9px 18px;cursor:pointer;font-size:12px;font-weight:700;color:#1f2937;"><span>Проекты</span>'+pills(tot.c>0,tot.c,tot.d,tot.c?tot.w/tot.c:0)+'</div><div class="ml-kids" data-pk-kids="__all"><div class="ml-kids-in">'+h+'</div></div>';
}).catch(function(){var e=document.getElementById('dsProjList');if(e){e.textContent='Не удалось загрузить';}});
box.addEventListener('click',function(e){var ob=e.target.closest('.dsObj');if(ob){if(window.dsMapOn&&window.dsMapFocus){var oc=ob.getAttribute('data-oc');if(window.dsFocused==oc){window.dsFocused=null;window.dsMapAll();}else{window.dsFocused=oc;window.dsMapFocus(oc);}return;}if(ob.getAttribute('data-nd')=='1'){window.dsNoInfo();return;}window.dsOpenObj(ob.getAttribute('data-oc'));return;}var r=e.target.closest('.dsPr');if(r==null){return;}var k=box.querySelector('[data-pk-kids="'+r.getAttribute('data-pk')+'"]');box.querySelectorAll('.ml-kids.open:not([data-pk-kids="__all"])').forEach(function(o){if(o==k){return;}o.classList.remove('open');});k.classList.toggle('open');});
};
(function(){
function addLogout(){
var s=document.getElementById('pfSave');
if(s==null){return;}
if(document.getElementById('pfLogout')){return;}
if(window.innerWidth>768){return;}
var row=s.parentNode;
var b=document.createElement('button');
b.id='pfLogout';b.type='button';b.textContent='Выйти из аккаунта';
b.style.cssText='display:block;width:100%;height:40px;margin:14px 0 0 0;border:1px solid #f3c4c4;border-radius:9px;background:#fff;color:#e53e3e;font-size:13px;font-weight:600;cursor:pointer;';
b.addEventListener('click',function(){fetch('/api/logout',{method:'POST'}).then(function(){window.location.href='/login.html';});});
row.parentNode.insertBefore(b,row.nextSibling);
}
new MutationObserver(addLogout).observe(document.body,{childList:true,subtree:true});
})();
window.dsFillMonths=function(box,ty){if(window.dsFillScurve){window.dsFillScurve(box,ty);}box.style.borderBottomLeftRadius="0";box.style.borderBottomRightRadius="0";box.style.paddingTop="0";
box.innerHTML='<div id="dsMonths" style="overflow-x:auto;scrollbar-width:none;padding:0 12px 4px;color:rgba(255,255,255,0.85);font-size:11px;">Загрузка...</div>';
fetch('/api/prep/scurve'+(ty?'?type='+ty:'')).then(function(r){return r.json();}).then(function(sc){
var el=document.getElementById('dsMonths');if(el==null){return;}
var n=sc.labels.length;if(n==0){el.textContent='Нет данных';return;}
var pc=[];var mx=100;var last=0;
sc.labels.forEach(function(k,i){var p=sc.planPer[i]||0;var f=sc.factPer[i];var v=(f==null)?null:((p>0)?f/p*100:null);pc.push(v);if(v==null){}else{}if(f==null){}else{last=i;}});
var h='';var h100=Math.round(100/mx*110);
sc.labels.forEach(function(k,i){var v=pc[i];var hf=(v==null)?0:Math.round(Math.min(v,100)/mx*110);var mm=String(k).slice(5);var yy=String(k).slice(0,4);h+='<div style="width:22px;flex:none;display:flex;flex-direction:column;align-items:center;"><div style="position:relative;width:22px;height:110px;"><div class="dsTr" style="position:absolute;left:3px;bottom:0;width:16px;height:'+h100+'px;background:rgba(255,255,255,0.3);border-radius:8px;"></div><div style="position:absolute;left:3px;bottom:0;width:16px;height:'+hf+'px;background:#138a62;border-radius:8px;"></div></div><div style="font-size:8px;color:rgba(255,255,255,0.9);margin-top:10px;">'+mm+'</div><div style="font-size:8px;color:rgba(255,255,255,0.7);height:10px;">'+((i==0||mm=='01')?yy:'')+'</div></div>';});
var bub='<div id="dsBub" style="display:none;position:absolute;top:0;left:0;background:#fff;border-radius:10px;padding:5px 9px;font-size:10px;font-weight:700;line-height:1.4;text-align:right;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,0.25);z-index:5;"><div id="dsBT"></div><div id="dsArr" style="position:absolute;bottom:-4px;left:0;width:9px;height:9px;background:#fff;transform:rotate(45deg);"></div></div>';
el.style.color='';el.innerHTML='<div id="dsMW" style="position:relative;display:flex;width:'+(n*22)+'px;padding-top:16px;">'+h+bub+'</div>';
el.scrollLeft=Math.max(0,(last-5)*22);if(window.dsLinkScroll){window.dsLinkScroll();}
var wr=document.getElementById('dsMW');var bb=document.getElementById('dsBub');var bt=document.getElementById('dsBT');var ar=document.getElementById('dsArr');
function mark(i){el.querySelectorAll('.dsTr').forEach(function(t,j){t.style.background=(j==i)?'rgba(255,255,255,0.6)':'rgba(255,255,255,0.3)';});}
function show(i,x,y){var pa=sc.planAmt?sc.planAmt[i]:null;var fa=sc.factAmt?sc.factAmt[i]:null;var t='<div style="color:#2563eb;">'+((pa==null)?'—':fmtMoney(pa))+'</div>';if(fa==null){}else{t+='<div style="color:#138a62;">'+fmtMoney(fa)+'</div>';var d=(pa||0)-fa;if(d>0){t+='<div style="color:#e53e3e;">−'+fmtMoney(d)+'</div>';}else{if(d<0){t+='<div style="color:#138a62;">+'+fmtMoney(-d)+'</div>';}}}bt.innerHTML=t;bb.style.display='block';var w=bb.offsetWidth;var hh=bb.offsetHeight;var L=Math.max(0,Math.min(x-w/2,n*22-w));var T=y-hh-10;var up=true;if(T<0){T=y+14;up=false;}bb.style.left=L+'px';bb.style.top=T+'px';ar.style.left=Math.max(4,Math.min(w-14,x-L-5))+'px';if(up){ar.style.bottom='-4px';ar.style.top='auto';}else{ar.style.top='-4px';ar.style.bottom='auto';}}
wr.addEventListener('click',function(e){if(bb.contains(e.target)){bb.style.display='none';mark(-1);return;}var r=wr.getBoundingClientRect();var x=e.clientX-r.left;var y=e.clientY-r.top;var i=Math.floor(x/22);if(i<0||i>=n){return;}show(i,x,y);mark(i);});
}).catch(function(){var e=document.getElementById('dsMonths');if(e){e.textContent='Не удалось загрузить';}});
};
window.dsLinkScroll=function(){
var h=document.getElementById('dsMonths');var c=document.getElementById('dsSc');if(h==null||c==null){return;}
if(c.dsLinked){c.scrollLeft=h.scrollLeft;return;}
c.dsLinked=true;
h.addEventListener('scroll',function(){if(c.scrollLeft!=h.scrollLeft){c.scrollLeft=h.scrollLeft;}});
c.addEventListener('scroll',function(){if(h.scrollLeft!=c.scrollLeft){h.scrollLeft=c.scrollLeft;}});
c.scrollLeft=h.scrollLeft;
};
window.dsFillScurve=function(box,ty){
var old=document.getElementById('dsBlock4');if(old){old.remove();}
var nb=document.createElement('div');nb.id='dsBlock4';nb.style.cssText=box.style.cssText;nb.style.height='auto';nb.style.padding='0';nb.style.background='#fff';nb.style.marginTop='-34px';nb.style.position='relative';nb.style.zIndex='2';
box.parentNode.insertBefore(nb,box.nextSibling);
nb.innerHTML='<div id="dsSc" style="overflow-x:auto;scrollbar-width:none;padding:14px 12px 0;color:#6b7280;font-size:11px;text-align:center;">Загрузка...</div>';
Promise.all([fetch('/api/prep/scurve'+(ty?'?type='+ty:'')).then(function(r){return r.json();}),fetch('/api/prep/summary'+(ty?'?type='+ty:'')).then(function(r){return r.json();})]).then(function(a){
var sc=a[0];var su=a[1];var el=document.getElementById('dsSc');if(el==null){return;}
var n=sc.labels.length;if(n<2){el.textContent='Нет данных';return;}
var pc=[];var fc=[];var sp=0;var sf=0;var last=-1;
for(var i=0;i<n;i++){sp+=(sc.planAmt&&sc.planAmt[i])||0;pc.push(sp);if(sc.factAmt&&sc.factAmt[i]!=null){sf+=sc.factAmt[i];fc.push(sf);last=i;}else{fc.push(null);}}
var total=su.totalCost||sp;var top=Math.max(total,sp,last>=0?fc[last]:0);if(top<=0){el.textContent='Нет данных';return;}
function cm(v){var b=Math.abs(v);if(b>=1e9){return (v/1e9).toFixed(1)+' млрд';}if(b>=1e6){return Math.round(v/1e6)+' млн';}if(b>=1e3){return Math.round(v/1e3)+' тыс';}return String(Math.round(v));}
var W=n*22;var H=170;var pt=24;var pb=26;
function X(i){return i*22+11;}
function Y(v){v=Math.min(top,Math.max(0,v));return pt+(1-v/top)*(H-pt-pb);}
function sm(q){var d='M'+q[0][0].toFixed(1)+' '+q[0][1].toFixed(1);for(var j=1;j<q.length;j++){var m2=(q[j-1][0]+q[j][0])/2;d+=' C'+m2.toFixed(1)+' '+q[j-1][1].toFixed(1)+' '+m2.toFixed(1)+' '+q[j][1].toFixed(1)+' '+q[j][0].toFixed(1)+' '+q[j][1].toFixed(1);}return d;}
var s='<svg width="'+W+'" height="'+H+'" viewBox="0 0 '+W+' '+H+'" style="display:block;">';
[0,0.25,0.5,0.75,1].forEach(function(g){var y=Y(top*g);s+='<line x1="0" x2="'+W+'" y1="'+y+'" y2="'+y+'" stroke="rgba(0,0,0,0.08)" stroke-width="1"/>';});
for(var i2=0;i2<n;i2++){var k=String(sc.labels[i2]);var mm2=k.slice(5);s+='<text x="'+X(i2)+'" y="'+(H-18)+'" text-anchor="middle" font-size="8" fill="#6b7280">'+mm2+'</text>';if(i2==0||mm2=='01'){s+='<text x="'+X(i2)+'" y="'+(H-7)+'" text-anchor="middle" font-size="8" fill="#9ca3af">'+k.slice(0,4)+'</text>';}}
var pp=[];for(var i3=0;i3<n;i3++){pp.push([X(i3),Y(pc[i3])]);}
s+='<path d="'+sm(pp)+'" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round"/>';
if(last>=1){var fp=[];for(var i4=0;i4<=last;i4++){fp.push([X(i4),Y(fc[i4])]);}
s+='<path d="'+sm(fp)+' L'+X(last).toFixed(1)+' '+Y(0)+' L'+X(0).toFixed(1)+' '+Y(0)+' Z" fill="rgba(19,138,98,0.15)" stroke="none"/>';
s+='<path d="'+sm(fp)+'" fill="none" stroke="#138a62" stroke-width="3" stroke-linecap="round"/>';}
if(last>=0){var pv=pc[last];var fv=fc[last];var cx=X(last);var tx=Math.max(40,Math.min(W-40,cx));var pa=(pv>=fv);s+='<line x1="'+cx+'" x2="'+cx+'" y1="'+Y(pv)+'" y2="'+Y(fv)+'" stroke="#f87171" stroke-width="2" stroke-dasharray="4 3" stroke-linecap="round"/>';s+='<text x="'+(cx-8)+'" y="'+((Y(pv)+Y(fv))/2+3)+'" text-anchor="end" font-size="9" font-weight="700" fill="#ef4444" stroke="#fff" stroke-width="3" paint-order="stroke">'+(pv>=fv?'−':'+')+cm(Math.abs(pv-fv))+' ('+Math.round(Math.abs(pv-fv)/total*100)+'%)</text>';
s+='<circle cx="'+cx+'" cy="'+Y(pv)+'" r="4" fill="#2563eb" stroke="#fff" stroke-width="1.5"/><circle cx="'+cx+'" cy="'+Y(fv)+'" r="4" fill="#138a62" stroke="#fff" stroke-width="1.5"/>';
s+='<text x="'+tx+'" y="'+(Y(pv)+(pa?-9:15))+'" text-anchor="middle" font-size="9" font-weight="700" fill="#2563eb">'+cm(pv)+' ('+Math.round(pv/total*100)+'%)</text>';
s+='<text x="'+tx+'" y="'+(Y(fv)+(pa?15:-9))+'" text-anchor="middle" font-size="9" font-weight="700" fill="#138a62">'+cm(fv)+' ('+Math.round(fv/total*100)+'%)</text>';}
s+='</svg>';el.innerHTML=s;
el.scrollLeft=Math.max(0,(last-5)*22);if(window.dsLinkScroll){window.dsLinkScroll();}
if(window.dsLinkScroll){window.dsLinkScroll();}
}).catch(function(){var e=document.getElementById('dsSc');if(e){e.textContent='Не удалось загрузить';}});
};
window.dsOpenObj=function(code){
if(document.getElementById('objPage')){return;}
var pp=document.getElementById('prepPanel');if(pp==null){return;}
var r=pp.getBoundingClientRect();var cs=getComputedStyle(pp);var z=parseInt(cs.zIndex,10);if(isNaN(z)){z=100;}
var nm=code;PROJECTS.prep.items.forEach(function(it){if(it.code==code){nm=it.name;}});
var bgc=cs.backgroundColor;var bgi=cs.backgroundImage;if(bgc=='rgba(0, 0, 0, 0)'&&bgi=='none'){bgc='#fff';}
var op=document.createElement('div');op.id='objPage';
op.style.cssText='position:fixed;left:'+r.left+'px;top:'+r.top+'px;width:'+r.width+'px;height:'+r.height+'px;z-index:'+(z+1)+';overflow-y:auto;box-sizing:border-box;transform:translateX(100%);transition:transform .32s ease;background-color:'+bgc+';background-image:'+bgi+';';
function blk(l,id){return '<div style="flex:1;min-width:0;border-radius:16px;padding:7px 10px;background:rgba(255,255,255,0.5);"><div style="font-size:10px;font-weight:700;color:#4b5563;">'+l+'</div><div id="'+id+'" style="font-size:11px;font-weight:800;color:#1f2937;white-space:nowrap;margin-top:1px;">—</div></div>';}
op.innerHTML='<div style="background:linear-gradient(90deg,#6a5ae0 0%,#4a90d9 50%,#1dd3b0 100%);padding:12px 12px 38px;"><div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;"><span style="background:rgba(255,255,255,0.5);border-radius:10px;padding:4px 9px;font-size:11px;font-weight:800;color:#1f2937;flex:none;">'+code+'</span><span style="font-size:12px;font-weight:700;color:#fff;">'+nm+'</span></div><div style="display:flex;align-items:flex-start;gap:8px;margin-bottom:10px;"><div style="flex:1;min-width:0;"><div style="font-size:12px;font-weight:700;color:#fff;">Общая стоимость</div><div id="dsOT" style="font-size:18px;font-weight:800;color:#fff;margin:2px 0 0;">—</div></div><div style="flex:none;min-width:96px;border-radius:14px;padding:6px 10px;background:rgba(255,255,255,0.5);"><div style="display:flex;gap:12px;"><div style="text-align:center;"><div style="font-size:9px;font-weight:700;color:#4b5563;">План</div><div id="dsGP" style="font-size:11px;font-weight:800;color:#1f2937;">—</div></div><div style="text-align:center;"><div style="font-size:9px;font-weight:700;color:#4b5563;">Факт</div><div id="dsGF" style="font-size:11px;font-weight:800;color:#1f2937;">—</div></div><div style="text-align:center;"><div style="font-size:9px;font-weight:700;color:#4b5563;">Разница</div><div id="dsGD" style="font-size:11px;font-weight:800;color:#1f2937;">—</div></div></div></div></div><div style="display:flex;gap:8px;">'+blk('План','dsOP')+blk('Освоено','dsOD')+blk('Остаток','dsOR')+'</div></div>';
fetch('/api/prep/objects').then(function(x){return x.json();}).then(function(list){var o=null;list.forEach(function(q){if(q.code==code){o=q;}});if(o==null||(o.cost||0)<=0){return;}var c=o.cost||0;var d=o.done||0;var pl=c*(o.planPct||0)/100;function st(id,v){var e=document.getElementById(id);if(e){e.textContent=fmtMoney(v);}}st('dsOT',c);st('dsOP',pl);st('dsOD',d);st('dsOR',c-d);var pp2=Math.round(o.planPct||0);var ff=c?Math.round(d/c*100):0;var df=ff-pp2;function sp(id,t,col){var e=document.getElementById(id);if(e){e.textContent=t;if(col){e.style.color=col;}}}sp('dsGP',pp2+'%');sp('dsGF',ff+'%');sp('dsGD',(df>0?'+':'')+df+'%',df<0?'#b91c1c':'#166534');}).catch(function(){});
function blk2(l,id){return '<div style="flex:1;min-width:0;border-radius:16px;padding:7px 10px;background:#f3f4f6;"><div style="font-size:10px;font-weight:700;color:#6b7280;">'+l+'</div><div id="'+id+'" style="font-size:11px;font-weight:800;color:#1f2937;white-space:nowrap;margin-top:1px;">—</div></div>';}
op.insertAdjacentHTML('beforeend','<div style="position:relative;z-index:2;margin-top:-24px;background:#fff;border-radius:22px 22px 0 0;padding:16px 12px 40px;"><div style="display:flex;gap:8px;">'+blk2('Начало','dsTS')+blk2('Окончание','dsTE')+blk2('Прогноз','dsTF')+blk2('Срок','dsTD')+'</div></div>');
if(window.dsObjCharts){window.dsObjCharts(op,code);}fetch('/api/prep/object/'+encodeURIComponent(code)+'/term').then(function(x){return x.json();}).then(function(t){function fd(v){if(v==null){return '—';}var q=new Date(v);return ('0'+q.getDate()).slice(-2)+'.'+('0'+(q.getMonth()+1)).slice(-2)+'.'+q.getFullYear();}function put(id,v,c){var e=document.getElementById(id);if(e){e.textContent=v;if(c){e.style.color=c;}}}var bad=t.delay>0;put('dsTS',fd(t.start));put('dsTE',fd(t.end));put('dsTF',fd(t.forecast),bad?'#b91c1c':'#166534');put('dsTD',t.delay+' дн.',bad?'#b91c1c':'#166534');}).catch(function(){});
document.body.appendChild(op);
void op.offsetWidth;op.style.transform='translateX(0)';
var mo=new MutationObserver(function(){if(document.getElementById('prepPanel')==null){op.remove();mo.disconnect();}});mo.observe(document.body,{childList:true});
op._mo=mo;
};
window.dsCloseObj=function(){var op=document.getElementById('objPage');if(op==null){return;}if(op._mo){op._mo.disconnect();}op.id='objPageClosing';op.style.transform='translateX(100%)';setTimeout(function(){op.remove();},340);};
window.dsNoInfo=function(){
if(document.getElementById('dsNoInfo')){return;}
var ov=document.createElement('div');ov.id='dsNoInfo';
ov.style.cssText='position:fixed;left:0;top:0;right:0;bottom:0;z-index:9999;background:rgba(17,24,39,0.4);display:flex;align-items:center;justify-content:center;padding:24px;box-sizing:border-box;opacity:0;transition:opacity .2s ease;';
ov.innerHTML='<div style="background:#fff;border-radius:20px;padding:22px 20px 16px;width:100%;max-width:320px;text-align:center;box-shadow:0 8px 30px rgba(0,0,0,0.25);transform:scale(0.96);transition:transform .2s ease;"><div style="font-size:13px;font-weight:700;color:#1f2937;line-height:1.4;margin:6px 0 20px;">На данный момент информация отсутствует</div><button type="button" id="dsNoInfoBtn" style="width:100%;height:40px;border:0;border-radius:14px;background:linear-gradient(90deg,#6a5ae0 0%,#4a90d9 50%,#1dd3b0 100%);color:#fff;font-size:12px;font-weight:700;">Закрыть</button></div>';
document.body.appendChild(ov);
void ov.offsetWidth;ov.style.opacity='1';ov.firstChild.style.transform='scale(1)';
function cl(){ov.style.opacity='0';setTimeout(function(){ov.remove();},220);}
document.getElementById('dsNoInfoBtn').addEventListener('click',cl);
ov.addEventListener('click',function(e){if(e.target==ov){cl();}});
};
window.dsObjCharts=function(op,code){
var g='background:linear-gradient(90deg,#6a5ae0 0%,#4a90d9 50%,#1dd3b0 100%);';
var hb=document.createElement('div');hb.style.cssText='position:relative;z-index:3;margin-top:-24px;border-radius:22px 22px 0 0;padding:0 0 46px;'+g;
var sb=document.createElement('div');sb.style.cssText='position:relative;z-index:4;margin-top:-34px;border-radius:22px 22px 0 0;background:#fff;';
var gap=document.createElement('div');gap.style.height='20px';
op.appendChild(hb);op.appendChild(sb);op.appendChild(gap);
hb.innerHTML='<div class="oMon" style="overflow-x:auto;scrollbar-width:none;padding:16px 12px 0;color:rgba(255,255,255,0.85);font-size:11px;">Загрузка...</div>';
sb.innerHTML='<div class="oSc" style="overflow-x:auto;scrollbar-width:none;padding:14px 12px 0;color:#6b7280;font-size:11px;text-align:center;">Загрузка...</div>';
fetch('/api/prep/scurve?code='+encodeURIComponent(code)).then(function(r){return r.json();}).then(function(sc){
var el=hb.querySelector('.oMon');var el2=sb.querySelector('.oSc');
var n=sc.labels.length;if(n<2){el.textContent='Нет данных';el2.textContent='Нет данных';return;}var cw=Math.max(22,Math.floor((hb.clientWidth-24)/n));
var pc=[];var last=0;
sc.labels.forEach(function(k,i){var p=sc.planPer[i]||0;var f=sc.factPer[i];pc.push((f==null)?null:((p>0)?f/p*100:null));if(f==null){}else{last=i;}});
var h='';
sc.labels.forEach(function(k,i){var v=pc[i];var hf=(v==null)?0:Math.round(Math.min(v,100)/100*110);var mm=String(k).slice(5);var yy=String(k).slice(0,4);h+='<div style="width:'+cw+'px;flex:none;display:flex;flex-direction:column;align-items:center;"><div style="position:relative;width:'+cw+'px;height:110px;"><div class="dsTr" style="position:absolute;left:'+Math.round((cw-16)/2)+'px;bottom:0;width:16px;height:110px;background:rgba(255,255,255,0.3);border-radius:8px;"></div><div style="position:absolute;left:'+Math.round((cw-16)/2)+'px;bottom:0;width:16px;height:'+hf+'px;background:#138a62;border-radius:8px;"></div></div><div style="font-size:8px;color:rgba(255,255,255,0.9);margin-top:10px;">'+mm+'</div><div style="font-size:8px;color:rgba(255,255,255,0.7);height:10px;">'+((i==0||mm=='01')?yy:'')+'</div></div>';});
el.style.padding='0 12px';
el.innerHTML='<div class="oMW" style="position:relative;display:flex;width:'+(n*cw)+'px;padding-top:16px;">'+h+'</div>';
var wr=el.querySelector('.oMW');
var bb=document.createElement('div');bb.style.cssText='display:none;position:absolute;top:0;left:0;background:#fff;border-radius:10px;padding:5px 9px;font-size:10px;font-weight:700;line-height:1.4;text-align:right;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,0.25);z-index:5;';
var bt=document.createElement('div');var ar=document.createElement('div');ar.style.cssText='position:absolute;bottom:-4px;left:0;width:9px;height:9px;background:#fff;transform:rotate(45deg);';
bb.appendChild(bt);bb.appendChild(ar);wr.appendChild(bb);
function mark(i){wr.querySelectorAll('.dsTr').forEach(function(t,j){t.style.background=(j==i)?'rgba(255,255,255,0.6)':'rgba(255,255,255,0.3)';});}
function show(i,x,y){var pa=sc.planAmt?sc.planAmt[i]:null;var fa=sc.factAmt?sc.factAmt[i]:null;var t='<div style="color:#2563eb;">'+((pa==null)?'—':fmtMoney(pa))+'</div>';if(fa==null){}else{t+='<div style="color:#138a62;">'+fmtMoney(fa)+'</div>';var d=(pa||0)-fa;if(d>0){t+='<div style="color:#e53e3e;">−'+fmtMoney(d)+'</div>';}else{if(d<0){t+='<div style="color:#138a62;">+'+fmtMoney(-d)+'</div>';}}}bt.innerHTML=t;bb.style.display='block';var w=bb.offsetWidth;var hh=bb.offsetHeight;var L=Math.max(0,Math.min(x-w/2,n*cw-w));var T=y-hh-10;var up=true;if(T<0){T=y+14;up=false;}bb.style.left=L+'px';bb.style.top=T+'px';ar.style.left=Math.max(4,Math.min(w-14,x-L-5))+'px';if(up){ar.style.bottom='-4px';ar.style.top='auto';}else{ar.style.top='-4px';ar.style.bottom='auto';}}
wr.addEventListener('click',function(e){if(bb.contains(e.target)){bb.style.display='none';mark(-1);return;}var r=wr.getBoundingClientRect();var x=e.clientX-r.left;var y=e.clientY-r.top;var i=Math.floor(x/cw);if(i<0||i>=n){return;}show(i,x,y);mark(i);});
var pcm=[];var fcm=[];var sp=0;var sf=0;var la=-1;
for(var i=0;i<n;i++){sp+=(sc.planAmt&&sc.planAmt[i])||0;pcm.push(sp);if(sc.factAmt&&sc.factAmt[i]!=null){sf+=sc.factAmt[i];fcm.push(sf);la=i;}else{fcm.push(null);}}
var total=sp;var top=Math.max(total,la>=0?fcm[la]:0);if(top<=0){el2.textContent='Нет данных';return;}
function cm(v){var b=Math.abs(v);if(b>=1e9){return (v/1e9).toFixed(1)+' млрд';}if(b>=1e6){return Math.round(v/1e6)+' млн';}if(b>=1e3){return Math.round(v/1e3)+' тыс';}return String(Math.round(v));}
var W=n*cw;var H=170;var pt=24;var pb=26;
function X(i){return i*cw+cw/2;}
function Y(v){v=Math.min(top,Math.max(0,v));return pt+(1-v/top)*(H-pt-pb);}
function sm(q){var d='M'+q[0][0].toFixed(1)+' '+q[0][1].toFixed(1);for(var j=1;j<q.length;j++){var m2=(q[j-1][0]+q[j][0])/2;d+=' C'+m2.toFixed(1)+' '+q[j-1][1].toFixed(1)+' '+m2.toFixed(1)+' '+q[j][1].toFixed(1)+' '+q[j][0].toFixed(1)+' '+q[j][1].toFixed(1);}return d;}
var s='<svg width="'+W+'" height="'+H+'" viewBox="0 0 '+W+' '+H+'" style="display:block;">';
[0,0.25,0.5,0.75,1].forEach(function(gg){var y=Y(top*gg);s+='<line x1="0" x2="'+W+'" y1="'+y+'" y2="'+y+'" stroke="rgba(0,0,0,0.08)" stroke-width="1"/>';});
for(var i2=0;i2<n;i2++){var k=String(sc.labels[i2]);var mm2=k.slice(5);s+='<text x="'+X(i2)+'" y="'+(H-18)+'" text-anchor="middle" font-size="8" fill="#6b7280">'+mm2+'</text>';if(i2==0||mm2=='01'){s+='<text x="'+X(i2)+'" y="'+(H-7)+'" text-anchor="middle" font-size="8" fill="#9ca3af">'+k.slice(0,4)+'</text>';}}
var pp=[];for(var i3=0;i3<n;i3++){pp.push([X(i3),Y(pcm[i3])]);}
s+='<path d="'+sm(pp)+'" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round"/>';
if(la>=1){var fp=[];for(var i4=0;i4<=la;i4++){fp.push([X(i4),Y(fcm[i4])]);}
s+='<path d="'+sm(fp)+' L'+X(la).toFixed(1)+' '+Y(0)+' L'+X(0).toFixed(1)+' '+Y(0)+' Z" fill="rgba(19,138,98,0.15)" stroke="none"/>';
s+='<path d="'+sm(fp)+'" fill="none" stroke="#138a62" stroke-width="3" stroke-linecap="round"/>';}
if(la>=0){var pv=pcm[la];var fv=fcm[la];var cx=X(la);var tx=Math.max(40,Math.min(W-40,cx));var pa2=(pv>=fv);
s+='<line x1="'+cx+'" x2="'+cx+'" y1="'+Y(pv)+'" y2="'+Y(fv)+'" stroke="#f87171" stroke-width="2" stroke-dasharray="4 3" stroke-linecap="round"/>';
s+='<text x="'+(cx-8)+'" y="'+((Y(pv)+Y(fv))/2+3)+'" text-anchor="end" font-size="9" font-weight="700" fill="#ef4444" stroke="#fff" stroke-width="3" paint-order="stroke">'+(pv>=fv?'−':'+')+cm(Math.abs(pv-fv))+' ('+Math.round(Math.abs(pv-fv)/total*100)+'%)</text>';
s+='<circle cx="'+cx+'" cy="'+Y(pv)+'" r="4" fill="#2563eb" stroke="#fff" stroke-width="1.5"/><circle cx="'+cx+'" cy="'+Y(fv)+'" r="4" fill="#138a62" stroke="#fff" stroke-width="1.5"/>';
s+='<text x="'+tx+'" y="'+(Y(pv)+(pa2?-9:15))+'" text-anchor="middle" font-size="9" font-weight="700" fill="#2563eb">'+cm(pv)+' ('+Math.round(pv/total*100)+'%)</text>';
s+='<text x="'+tx+'" y="'+(Y(fv)+(pa2?15:-9))+'" text-anchor="middle" font-size="9" font-weight="700" fill="#138a62">'+cm(fv)+' ('+Math.round(fv/total*100)+'%)</text>';}
s+='</svg>';el2.innerHTML=s;
var sl=Math.max(0,(last-5)*cw);el.scrollLeft=sl;el2.scrollLeft=sl;
el.addEventListener('scroll',function(){if(el2.scrollLeft!=el.scrollLeft){el2.scrollLeft=el.scrollLeft;}});
el2.addEventListener('scroll',function(){if(el.scrollLeft!=el2.scrollLeft){el.scrollLeft=el2.scrollLeft;}});
}).catch(function(){});
};
window.dsGoMap=function(){
var pp=document.getElementById('prepPanel');if(pp){pp.remove();}
var ob=document.getElementById('objPage');if(ob){ob.remove();}
var sh=document.getElementById('infoSheetOverlay');if(sh&&window.dsCloseSheet){window.dsCloseSheet(sh);}
var cands=Array.from(document.querySelectorAll('.sidebar-nav button,.sidebar-nav a,.sidebar-nav [onclick],.sidebar button,.sidebar a'));var t=null;
cands.forEach(function(b){if(t){return;}var s=((b.id||'')+' '+(b.getAttribute('onclick')||'')+' '+(b.getAttribute('data-page')||'')+' '+(b.getAttribute('data-tab')||'')+' '+(b.title||'')+' '+(b.textContent||'')).toLowerCase();if(s.indexOf('map')>=0||s.indexOf('карт')>=0){t=b;}});
if(t){t.click();}
};
window.dsMapH=300;
window.dsMapOn=false;
window.dsMapRestore=function(){
var mb=window.dsMapBox;if(mb==null){return;}
var pg=document.getElementById('page-map');
if(pg&&mb.parentNode!=pg){if(mb._old!=null){mb.setAttribute('style',mb._old);}pg.insertBefore(mb,document.getElementById('mapInfo'));if(window.leafMap){setTimeout(function(){window.leafMap.invalidateSize();},50);}}
window.dsMapOn=false;
};
window.dsMapToggle=function(){
var body=document.getElementById('prepPanelBody');var pnl=document.getElementById('prepPanel');if(body==null||pnl==null){return;}
var btn=document.getElementById('dsMapBtn');var card=document.getElementById('dsCardTotal');var b2=document.getElementById('dsBlock2');var b3=document.getElementById('dsBlock3');var b4=document.getElementById('dsBlock4');
if(btn==null||card==null||b2==null){return;}
var xs=[b3,b4];
if(window.dsMapOn){
window.dsMapOn=false;
if(window.dsMapOb){window.dsMapOb.disconnect();window.dsMapOb=null;}
var hold=document.getElementById('dsMapHold');
btn.style.background='rgba(255,255,255,0.5)';
xs.forEach(function(x){if(x){x.style.display='';}});
void body.offsetHeight;
requestAnimationFrame(function(){
card.style.height=card._h+'px';card.style.paddingTop=card._pt;card.style.paddingBottom=card._pb;card.style.opacity='1';
if(hold){hold.style.height='0px';}
xs.forEach(function(x){if(x){x.style.transform='translateY(0)';x.style.opacity='1';}});
});
var k=b2.querySelector('[data-pk-kids="__all"]');if(k&&window.dsMapK==false){k.classList.remove('open');}
var t=0;var iv=setInterval(function(){if(window.leafMap){window.leafMap.invalidateSize();}t+=30;if(t>500){clearInterval(iv);}},30);
setTimeout(function(){
window.dsFocused=null;if(window.dsMapAll){window.dsMapAll();}window.dsMapRestore();if(hold){hold.remove();}b2.style.zIndex='';b2.style.height='';b2.style.overflowY='';var pbx=document.getElementById('prepPanelBody');if(pbx){pbx.style.overflow='';pbx.scrollTop=0;}var hh=b2.querySelector('.dsPr[data-pk="__all"]');if(hh){hh.style.position='';hh.style.top='';hh.style.background='';hh.style.zIndex='';}
btn.setAttribute('style',btn._st);if(btn._next){btn._home.insertBefore(btn,btn._next);}else{btn._home.appendChild(btn);}
card.style.height='';card.style.overflow='';card.style.transition='';card.style.opacity='';
xs.forEach(function(x){if(x){x.style.transition='';x.style.transform='';x.style.opacity='';}});
},520);
return;
}
var mb=window.dsMapBox||document.getElementById('mapBox');if(mb==null){return;}
window.dsMapOn=true;
if(window.leafMap==null){
var pg=document.querySelector('.page.active');var pb=document.querySelector('.buttons button.nav-active');
window.dsSkipNav=true;
document.getElementById('mapBtn').dispatchEvent(new MouseEvent('click',{bubbles:false}));
window.dsSkipNav=false;
if(pg){showPage(pg.id,pb);}
}
window.dsMapBox=mb;if(mb._old==null){mb._old=mb.getAttribute('style')||'';}
var hold2=document.createElement('div');hold2.id='dsMapHold';hold2.style.cssText='position:sticky;top:0;z-index:0;height:0;overflow:hidden;transition:height .45s ease;background:#e5e7eb;';b2.style.zIndex='1';
card.parentNode.insertBefore(hold2,card.nextSibling);
mb.style.cssText='width:100%;height:100%;min-height:0;flex:none;';hold2.appendChild(mb);
var pr=pnl.getBoundingClientRect();var br=btn.getBoundingClientRect();
btn._home=btn.parentNode;btn._next=btn.nextSibling;btn._st=btn.getAttribute('style');
pnl.appendChild(btn);
btn.style.position='absolute';btn.style.left=(br.left-pr.left)+'px';btn.style.top=(br.top-pr.top)+'px';btn.style.width=br.width+'px';btn.style.height=br.height+'px';btn.style.marginBottom='0';btn.style.zIndex='5';btn.style.background='rgba(255,255,255,0.9)';
var cs=getComputedStyle(card);card._pt=cs.paddingTop;card._pb=cs.paddingBottom;card._h=card.offsetHeight;
card.style.overflow='hidden';card.style.height=card._h+'px';card.style.transition='height .45s ease,padding .45s ease,opacity .35s ease';
xs.forEach(function(x){if(x){x.style.transition='transform .45s ease,opacity .35s ease';}});
void card.offsetHeight;
requestAnimationFrame(function(){
card.style.height='0px';card.style.paddingTop='0px';card.style.paddingBottom='0px';card.style.opacity='0';
hold2.style.height=window.dsMapH+'px';var pb=document.getElementById('prepPanelBody');if(pb){pb.scrollTop=0;pb.style.overflow='hidden';b2.style.height=(pb.clientHeight-window.dsMapH+18)+'px';b2.style.overflowY='auto';var h2=b2.querySelector('.dsPr[data-pk="__all"]');if(h2){h2.style.position='sticky';h2.style.top='0';h2.style.background='#fff';h2.style.zIndex='2';}}
xs.forEach(function(x){if(x){x.style.transform='translateY(110%)';x.style.opacity='0';}});
});
var k2=b2.querySelector('[data-pk-kids="__all"]');window.dsMapK=!!(k2&&k2.classList.contains('open'));if(k2){k2.classList.add('open');}
body.scrollTop=0;
var t2=0;var iv2=setInterval(function(){if(window.leafMap){window.leafMap.invalidateSize();}t2+=30;if(t2>560){clearInterval(iv2);}},30);
setTimeout(function(){xs.forEach(function(x){if(x&&window.dsMapOn){x.style.display='none';}});},480);
window.dsMapOb=new MutationObserver(function(){if(document.getElementById('dsMapHold')==null){window.dsMapRestore();if(window.dsMapOb){window.dsMapOb.disconnect();window.dsMapOb=null;}}});
window.dsMapOb.observe(document.body,{childList:true});
};

(function(){
var prevBtn=null;
function closeTeam(ov){var m=ov.querySelector('.stage-modal');ov.classList.remove('open');if(m){m.classList.remove('open');}var tb=document.getElementById('teamBtn');if(tb){tb.classList.remove('nav-active');}if(prevBtn&&prevBtn!==tb){prevBtn.classList.add('nav-active');}prevBtn=null;setTimeout(function(){ov.remove();},400);}
document.addEventListener('click',function(e){
if(window.innerWidth>768){return;}
var ex=document.getElementById('teamSheetOverlay');
var b=e.target.closest('#teamBtn');
if(b==null){if(ex&&e.target.closest('.buttons button')){var pb=null;ex.remove();var tb0=document.getElementById('teamBtn');if(tb0){tb0.classList.remove('nav-active');}prevBtn=null;}return;}
e.stopImmediatePropagation();e.preventDefault();
if(ex){closeTeam(ex);return;}
document.querySelectorAll('.stage-modal-overlay').forEach(function(o){o.remove();});
var pp=document.getElementById('prepPanel');if(pp){pp.remove();}
var act=document.querySelector('.buttons button.nav-active');prevBtn=(act&&act!==b)?act:null;
document.querySelectorAll('.buttons button').forEach(function(x){x.classList.remove('nav-active');});
b.classList.add('nav-active');
var ov=document.createElement('div');
ov.id='teamSheetOverlay';ov.className='stage-modal-overlay';
ov.style.display='block';ov.style.padding='0';ov.style.background='transparent';
ov.innerHTML='<div class="stage-modal" style="position:fixed;left:0;top:56px;bottom:64px;width:100%;border-radius:0;"><div class="obj-modal-header" style="min-height:0;padding:0;border:0;"></div><div id="teamSheetBody" style="flex:1;min-height:0;padding:0;display:flex;flex-direction:column;"><div id="teamTop" style="flex:0 0 auto;height:190px;position:relative;z-index:1;border-radius:0 0 18px 18px;background:linear-gradient(90deg,#6a5ae0 0%,#4a90d9 50%,#1dd3b0 100%);transition:height .4s ease;"><div id="teamTab" style="position:absolute;left:50%;bottom:-15px;transform:translateX(-50%);width:52px;height:28px;border-radius:14px;background:#fff;box-shadow:0 2px 8px rgba(0,0,0,0.22);display:flex;align-items:center;justify-content:center;font-size:14px;color:#4a90d9;cursor:pointer;z-index:3;">&#9650;</div></div><div id="teamWhite" style="flex:1;position:relative;margin-top:-18px;padding-top:18px;box-sizing:border-box;background:#fff;border-radius:0;"></div></div></div>';
document.body.appendChild(ov);
setTimeout(function(){ov.classList.add('open');ov.querySelector('.stage-modal').classList.add('open');},20);
},true);
})();

document.addEventListener('click',function(e){var tb=e.target.closest('#teamTab');if(tb==null){return;}e.stopPropagation();var t=document.getElementById('teamTop');var closed=t.getAttribute('data-c')=='1';t.style.height=closed?'190px':'14px';t.setAttribute('data-c',closed?'0':'1');tb.innerHTML=closed?'&#9650;':'&#9660;';},true);

(function(){
function fill(){
var t=document.getElementById('teamTop');if(!t||document.getElementById('teamBday')){return;}
if(typeof PERSONNEL==='undefined'||typeof fmtDaysUntil==='undefined'){return;}
var today=new Date();today.setHours(0,0,0,0);
var arr=[];
PERSONNEL.forEach(function(u){if(!u.birthday){return;}var p=String(u.birthday).split('.');if(p.length!==3){return;}var d=parseInt(p[0],10),m=parseInt(p[1],10)-1;var nx=new Date(today.getFullYear(),m,d);if(nx<today){nx=new Date(today.getFullYear()+1,m,d);}arr.push({u:u,days:Math.round((nx-today)/86400000)});});
arr.sort(function(a,b){return a.days-b.days;});
var h='';
arr.slice(0,3).forEach(function(x){var u=x.u;var nm=String(u.name||'').split(' ').slice(0,2).join(' ');var av=u.avatar?'<img src="'+u.avatar+'" style="width:100%;height:100%;object-fit:cover;">':'<span>'+nm.charAt(0)+'</span>';
h+='<div style="flex:0 0 auto;width:100%;height:44px;box-sizing:border-box;background:rgba(255,255,255,0.95);border-radius:22px;display:flex;align-items:center;gap:10px;padding:0 12px 0 0;box-shadow:0 3px 10px rgba(0,0,0,0.15);"><div style="width:44px;height:44px;border-radius:50%;overflow:hidden;background:#4a9fd8;color:#fff;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:700;flex-shrink:0;">'+av+'</div><div style="min-width:0;flex:1;display:flex;align-items:center;gap:8px;"><div style="flex:1;min-width:0;font-size:12px;font-weight:700;color:#1f2937;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">'+nm+'</div><div style="font-size:12px;color:#6b7280;flex-shrink:0;width:72px;">'+u.birthday+'</div><div style="font-size:10px;font-weight:700;color:#4a9fd8;flex-shrink:0;width:78px;text-align:left;">'+fmtDaysUntil(x.days)+'</div></div></div>';});
var w=document.createElement('div');w.id='teamBday';w.style.cssText='position:absolute;left:0;right:0;top:0;bottom:0;overflow:hidden;border-radius:0 0 18px 18px;';
w.innerHTML='<div style="display:flex;flex-direction:column;gap:8px;padding:14px 16px 0 16px;">'+h+'</div>';
t.insertBefore(w,t.firstChild);
}
new MutationObserver(fill).observe(document.body,{childList:true,subtree:true});
})();

(function(){
function topRank(u){var pos=String(u.position||'').toLowerCase().trim();var dep=String(u.department||'').toLowerCase();
if(pos.indexOf('заместитель директора')>=0&&pos.indexOf('управлению проектами')>=0){return 2;}
if(pos.indexOf('директор')===0&&pos.indexOf('заместитель')<0){return 1;}
if(pos==='главный инженер'||pos.indexOf('главный инженер дсомк')>=0){return 3;}
if(dep.indexOf('технологический')>=0&&pos.indexOf('начальник отдела')>=0){return 4;}
return 99;}
function fill(){
var w=document.getElementById('teamWhite');if(!w||document.getElementById('teamList')){return;}
if(typeof PERSONNEL==='undefined'){return;}
var us=PERSONNEL.map(function(u,i){return {u:u,i:i,r:topRank(u)};}).sort(function(a,b){return a.r-b.r||a.i-b.i;}).map(function(x){return x.u;});
var h='';
us.forEach(function(u){var nm=String(u.name||'').split(' ').slice(0,2).join(' ');var av=u.avatar?'<img src="'+u.avatar+'" style="width:100%;height:100%;object-fit:cover;">':'<span>'+nm.charAt(0)+'</span>';
h+='<div style="flex:0 0 auto;width:100%;height:44px;box-sizing:border-box;background:#fff;border-radius:22px;display:flex;align-items:center;gap:10px;padding:0 12px 0 0;box-shadow:0 0 7px rgba(107,114,128,0.22);"><div style="width:44px;height:44px;border-radius:50%;overflow:hidden;background:#4a9fd8;color:#fff;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:700;flex-shrink:0;">'+av+'</div><div style="min-width:0;flex:1;font-size:12px;font-weight:700;color:#1f2937;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">'+nm+'</div></div>';});
w.style.minHeight='0';w.style.overflowY='auto';w.style.scrollbarWidth='none';
w.innerHTML='<div id="teamList" style="display:flex;flex-direction:column;gap:10px;padding:14px 16px 16px 16px;">'+h+'</div>';
}
new MutationObserver(fill).observe(document.body,{childList:true,subtree:true});
})();

(function(){
function topRank(u){var pos=String(u.position||'').toLowerCase().trim();var dep=String(u.department||'').toLowerCase();
if(pos.indexOf('заместитель директора')>=0&&pos.indexOf('управлению проектами')>=0){return 2;}
if(pos.indexOf('директор')===0&&pos.indexOf('заместитель')<0){return 1;}
if(pos==='главный инженер'||pos.indexOf('главный инженер дсомк')>=0){return 3;}
if(dep.indexOf('технологический')>=0&&pos.indexOf('начальник отдела')>=0){return 4;}
return 99;}
function esc(x){return String(x==null?'':x).replace(/&/g,'&amp;').replace(/</g,'&lt;');}
function rebuild(){
var l=document.getElementById('teamList');if(!l||l.getAttribute('data-acc')=='1'||typeof PERSONNEL==='undefined'){return;}
l.setAttribute('data-acc','1');
var us=PERSONNEL.map(function(u,i){return {u:u,i:i,r:topRank(u)};}).sort(function(a,b){return a.r-b.r||a.i-b.i;}).map(function(x){return x.u;});
var h='';
us.forEach(function(u){
var nm=String(u.name||'').split(' ').slice(0,2).join(' ');
var av=u.avatar?'<img src="'+u.avatar+'" style="width:100%;height:100%;object-fit:cover;">':'<span>'+esc(nm.charAt(0))+'</span>';
var rows=[['Отдел',u.department],['Должность',u.position],['Дата рождения',u.birthday],['Внутренний',u.internalPhone],['Мобильный',u.mobilePhone],['Почта',u.email]];
var d='';rows.forEach(function(r){if(r[1]){d+='<div style="display:flex;gap:10px;margin-top:6px;align-items:baseline;"><div style="width:84px;flex-shrink:0;text-align:right;font-size:10px;color:#9ca3af;">'+r[0]+'</div><div style="flex:1;min-width:0;font-size:12px;color:#1f2937;font-weight:600;word-break:break-word;">'+esc(r[1])+'</div></div>';}});
if(d==''){d='<div style="margin-top:6px;font-size:11px;color:#9ca3af;">Нет данных</div>';}
h+='<div class="tmCard" style="flex:0 0 auto;width:100%;height:44px;box-sizing:border-box;background:#fff;border-radius:22px;overflow:hidden;box-shadow:0 0 7px rgba(107,114,128,0.22);transition:height .3s ease;cursor:pointer;"><div style="display:flex;align-items:center;gap:10px;height:44px;padding:0 12px 0 0;"><div style="width:44px;height:44px;border-radius:50%;overflow:hidden;background:#4a9fd8;color:#fff;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:700;flex-shrink:0;">'+av+'</div><div style="min-width:0;flex:1;font-size:12px;font-weight:700;color:#1f2937;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">'+esc(nm)+'</div></div><div class="tmDet" style="padding:0 16px 14px 10px;">'+d+'</div></div>';
});
l.innerHTML=h;
}
new MutationObserver(rebuild).observe(document.body,{childList:true,subtree:true});
document.addEventListener('click',function(e){
var c=e.target.closest('.tmCard');if(!c){return;}
var open=c.getAttribute('data-o')=='1';
document.querySelectorAll('.tmCard[data-o="1"]').forEach(function(x){x.style.height='44px';x.setAttribute('data-o','0');});
if(!open){var det=c.querySelector('.tmDet');c.style.height=(44+det.offsetHeight)+'px';c.setAttribute('data-o','1');}
},true);
})();
