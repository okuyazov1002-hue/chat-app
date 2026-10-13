(function(){
function col(lab,val,c){return '<div style="flex:1;min-width:0;text-align:center;"><div style="font-size:9px;font-weight:600;color:#6b7280;">'+lab+'</div><div style="font-size:15px;font-weight:700;color:'+c+';font-variant-numeric:tabular-nums;margin-top:1px;">'+val+'</div></div>';}
function hbar(c,w){return '<div style="height:9px;border-radius:5px;background:#eef0f3;overflow:hidden;"><div style="height:100%;width:'+Math.max(0,Math.min(100,w))+'%;background:'+c+';border-radius:5px;transition:width .6s ease;"></div></div>';}
window.upmoProg=function(el,ty){
if(el===null){return;}
el.style.display='flex';el.style.flexDirection='column';el.style.justifyContent='center';el.style.padding='8px 12px';
el.innerHTML='<div style="margin:auto;font-size:11px;color:#6b7280;">Загрузка...</div>';
fetch('/api/prep/summary'+(ty?'?type='+ty:'')).then(function(r){return r.json();}).then(function(d){
var tc=d.totalCost||0;
var pl=Math.round(d.planPct||0);
var f=tc?Math.round((d.done||0)/tc*100):0;
var df=f-pl;
var dc=df<0?'#e53e3e':'#38a169';
el.innerHTML='<div style="display:flex;gap:4px;">'+col('План',pl+'%','#4a90d9')+col('Факт',f+'%','#38a169')+col('Разница',(df>0?'+':'')+df+'%',dc)+'</div><div style="display:flex;flex-direction:column;gap:6px;margin-top:10px;">'+hbar('#4a90d9',pl)+hbar('#38a169',f)+'</div>';
}).catch(function(){el.innerHTML='<div style="margin:auto;font-size:11px;color:#6b7280;">Не удалось загрузить</div>';});
};
})();
