(function(){
function fd(s){if(!s){return '—';}var d=new Date(s);if(isNaN(d.getTime())){return String(s);}var m=d.getMonth()+1,dd=d.getDate();return (dd<10?'0':'')+dd+'.'+(m<10?'0':'')+m+'.'+d.getFullYear();}
function item(lab,val,col){return '<div style="flex:1;min-height:0;display:flex;flex-direction:column;justify-content:center;padding:0 14px;"><div style="font-size:10px;font-weight:600;color:#6b7280;">'+lab+'</div><div style="font-size:15px;font-weight:700;color:'+col+';font-variant-numeric:tabular-nums;margin-top:2px;">'+val+'</div></div>';}
window.upmoDates=function(el,ty){
if(el===null){return;}
el.style.display='flex';el.style.flexDirection='column';
el.innerHTML='<div style="margin:auto;font-size:11px;color:#6b7280;">Загрузка...</div>';
fetch('/api/prep/objects'+(ty?'?type='+ty:'')).then(function(r){return r.json();}).then(function(list){
var st=null,en=null;
list.forEach(function(o){
if((o.cost||0)<=0){return;}
if(o.start&&(st===null||new Date(o.start)<new Date(st))){st=o.start;}
var e=o.end||o.planEnd;
if(e&&(en===null||new Date(e)>new Date(en))){en=e;}
});
el.innerHTML=item('Начало',fd(st),'#4a90d9')+'<div style="height:1px;background:#eef0f3;margin:0 14px;"></div>'+item('Окончание',fd(en),'#38a169');
}).catch(function(){el.innerHTML='<div style="margin:auto;font-size:11px;color:#6b7280;">Не удалось загрузить</div>';});
};
})();
