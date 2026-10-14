p="public/upmo/upmo-win.js"
s=open(p,encoding="utf-8").read()
i=s.find("if(k.indexOf('proj:')===0){B.innerHTML=")
j=s.find("}else if(window.upmoFillPanel)")
if i<0 or j<0 or s.count("if(k.indexOf('proj:')===0){B.innerHTML=")!=1 or s.count("}else if(window.upmoFillPanel)")!=1 or s.count("(function(){\nvar ov=null")!=1:
    print("ANCHOR_COUNT");raise SystemExit
s=s[:i]+"if(k.indexOf('proj:')===0){window.upmoProjPage(B,k,ttl);"+s[j:]
add='''
window.upmoProjPage=function(B,k,ttl){
var lab='font-size:10px;color:#4b5563;font-weight:600;';
var blk='background:rgba(255,255,255,0.5);border-radius:14px;padding:6px 10px;box-shadow:0 2px 8px rgba(0,0,0,0.12);';
var val='font-size:12px;color:#1f2937;font-weight:700;';
B.innerHTML='<div style="padding:16px;"><div style="font-size:18px;font-weight:700;color:#1f2937;margin-bottom:16px;">'+ttl+'</div><div id="upmoPCard" style="width:450px;box-sizing:border-box;box-shadow:-5px -5px 16px rgba(106,90,224,0.45),5px 5px 16px rgba(29,211,176,0.45),0 0 18px rgba(74,144,217,0.4);border-radius:16px;padding:14px 16px;background:linear-gradient(90deg,#6a5ae0 0%,#4a90d9 50%,#1dd3b0 100%);color:#fff;font-size:11px;"><div style="font-size:11px;color:rgba(255,255,255,0.85);font-weight:700;">Общая стоимость</div><div data-f="tc" style="font-size:18px;color:#fff;font-weight:700;margin-top:2px;">—</div><div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px;margin-top:10px;"><div style="'+blk+'"><div style="'+lab+'">План</div><div data-f="pl" style="'+val+'">—</div></div><div style="'+blk+'"><div style="'+lab+'">Освоено</div><div data-f="dn" style="'+val+'">—</div></div><div style="'+blk+'"><div style="'+lab+'">Остаток</div><div data-f="rm" style="'+val+'">—</div></div></div></div></div>';
fetch('/api/proj/summary?code='+encodeURIComponent(k.slice(5))).then(function(r){return r.json();}).then(function(d){
var fm=(typeof fmtMoney==='function')?fmtMoney:function(x){return String(x);};
var q=B.querySelector('#upmoPCard');if(!q){return;}
function sv(f,v){var e=q.querySelector('[data-f="'+f+'"]');if(e){e.textContent=fm(Math.round(v||0))+' €';}}
sv('tc',d.totalCost);sv('pl',d.plan);sv('dn',d.done);sv('rm',d.remaining);
}).catch(function(){});
};
'''
s=s.replace("(function(){\nvar ov=null","(function(){"+add+"var ov=null",1)
open(p,"w",encoding="utf-8").write(s);print("PATCHED")
