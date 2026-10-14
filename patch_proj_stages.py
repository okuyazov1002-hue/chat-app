import re
sv=open("server.js",encoding="utf-8").read()
k=sv.find("getStagesForCode(req.params.code)")
m=re.findall(r'app\.get\("([^"]+)"',sv[:k])
route=m[-1] if m else None
print("ROUTE",route)
if not route or ":code" not in route:
    raise SystemExit
base=route.replace(":code","")
p="public/upmo/upmo-win.js"
s=open(p,encoding="utf-8").read()
a1="margin-bottom:16px;\">'+ttl+'</div><div id=\"upmoPCard\""
a2="cell('Остаток','rm')+'</div></div></div></div>';"
a3="}).catch(function(){});\n};"
c=[s.count(a1),s.count(a2),s.count(a3)]
if c!=[1,1,1]:
    print("ANCHOR_COUNT",c);raise SystemExit
b1="margin-bottom:16px;\">'+ttl+'</div><div style=\"display:flex;gap:16px;align-items:flex-start;\"><div id=\"upmoPCard\""
b2="cell('Остаток','rm')+'</div></div></div><div id=\"upmoPSt\" style=\"display:grid;grid-template-columns:repeat(3,170px);gap:12px;\"></div></div></div>';"
b3='''}).catch(function(){});
fetch("%s"+encodeURIComponent(k.slice(5))).then(function(r){return r.json();}).then(function(d){
var fm=(typeof fmtMoney==='function')?fmtMoney:function(x){return String(x);};
var box=B.querySelector('#upmoPSt');if(!box||!d.stages){return;}
var ORD=['Базовое проектирование','Детальное проектирование','Изготовление','Логистика','Строительство','ПНР'];
var arr=ORD.map(function(n){var f=null;d.stages.forEach(function(x){if(x.name===n||(n==='Строительство'&&/строительств/i.test(x.name))||(n==='ПНР'&&/пнр|пуско/i.test(x.name))){f=x;}});return f||{name:n,cost:0,done:0,paid:0,planPct:0};});
var lb='font-size:11px;color:#4b5563;font-weight:600;',vl='font-size:12px;color:#1f2937;font-weight:700;white-space:nowrap;';
box.innerHTML=arr.map(function(x){var pc=x.cost?Math.round(x.done/x.cost*100):0;return '<div style="box-sizing:border-box;background:#fff;border-radius:14px;padding:10px 12px;box-shadow:0 2px 14px rgba(0,0,0,0.2);"><div style="font-size:12px;font-weight:700;color:#1f2937;margin-bottom:6px;">'+x.name+'</div><div style="'+lb+'">Стоимость</div><div style="'+vl+'">'+fm(Math.round(x.cost||0))+'</div><div style="'+lb+';margin-top:4px;">Выполнено · '+pc+'%%</div><div style="'+vl+'">'+fm(Math.round(x.done||0))+'</div><div style="'+lb+';margin-top:4px;">Оплачено</div><div style="'+vl+'">'+fm(Math.round(x.paid||0))+'</div></div>';}).join('');
}).catch(function(){});
};''' % base
s=s.replace(a1,b1).replace(a2,b2).replace(a3,b3.replace('%%','%'))
open(p,"w",encoding="utf-8").write(s);print("PATCHED")
