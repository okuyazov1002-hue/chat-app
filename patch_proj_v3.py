p="public/upmo/upmo-win.js"
t=open(p,encoding="utf-8").read()
i=t.find("window.upmoProjPage=function")
j=t.find("var ov=null",i)
if i<0 or j<0 or t.count("window.upmoProjPage=function")!=1:
    print("ANCHOR_CLI");raise SystemExit
new='''window.upmoProjPage=function(B,k,ttl){
var lab='font-size:10px;color:#4b5563;font-weight:600;';
var val='font-size:12px;color:#1f2937;font-weight:700;';
var bx='border-radius:14px;padding:8px 12px;box-shadow:0 2px 8px rgba(0,0,0,0.12);';
function cell(t,f){return '<div style="margin-bottom:4px;"><div style="'+lab+'">'+t+'</div><div data-f="'+f+'" style="'+val+'">—</div></div>';}
B.innerHTML='<div style="padding:16px;"><div style="font-size:18px;font-weight:700;color:#1f2937;margin-bottom:16px;">'+ttl+'</div><div id="upmoPCard" style="width:450px;box-sizing:border-box;box-shadow:-5px -5px 16px rgba(106,90,224,0.45),5px 5px 16px rgba(29,211,176,0.45),0 0 18px rgba(74,144,217,0.4);border-radius:16px;padding:14px 16px;background:linear-gradient(90deg,#6a5ae0 0%,#4a90d9 50%,#1dd3b0 100%);color:#fff;font-size:11px;"><div style="font-size:11px;color:rgba(255,255,255,0.85);font-weight:700;">Общая стоимость</div><div data-f="tc" style="font-size:18px;color:#fff;font-weight:700;margin-top:2px;">—</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px;"><div style="'+bx+'background:#e8f0fb;">'+cell('Выполнено','dn')+cell('Остаток','rd')+'</div><div style="'+bx+'background:#e6f6ee;">'+cell('Оплачено','pd')+cell('Остаток','rm')+'</div></div></div></div>';
fetch('/api/proj/summary?code='+encodeURIComponent(k.slice(5))).then(function(r){return r.json();}).then(function(d){
var fm=(typeof fmtMoney==='function')?fmtMoney:function(x){return String(x);};
var q=B.querySelector('#upmoPCard');if(!q){return;}
function sv(f,v){var e=q.querySelector('[data-f="'+f+'"]');if(e){e.textContent=fm(Math.round(v||0));}}
sv('tc',d.totalCost);sv('dn',d.done);sv('rd',Math.max(0,(d.totalCost||0)-(d.done||0)));sv('pd',d.paid);sv('rm',d.remaining);
}).catch(function(){});
};
'''
t=t[:i]+new+t[j:]
open(p,"w",encoding="utf-8").write(t);print("PATCHED")
