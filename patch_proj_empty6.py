p="public/upmo/upmo-win.js"
s=open(p,encoding="utf-8").read()
g="display:grid;grid-template-columns:repeat(3,170px);gap:12px;"
r="display:flex;gap:12px;align-items:stretch;"
i=s.find('fetch("/api/reports/"')
j=s.find("\n};",i)
if s.count(g)!=1 or i<0 or j<0 or s.count('fetch("/api/reports/"')!=1:
    print("ANCHOR",s.count(g),i,j);raise SystemExit
static='''(function(){var box=B.querySelector('#upmoPSt');if(!box){return;}
var ORD=['Базовое проектирование','Детальное проектирование','Изготовление','Логистика','Строительство','ПНР'];
box.innerHTML=ORD.map(function(n){return '<div style="box-sizing:border-box;flex:0 0 150px;background:#fff;border-radius:14px;padding:10px 12px;box-shadow:0 2px 14px rgba(0,0,0,0.2);"><div style="font-size:12px;font-weight:700;color:#1f2937;">'+n+'</div></div>';}).join('');})();'''
s=s[:i]+static+s[j:]
s=s.replace(g,r)
a="display:flex;gap:16px;align-items:flex-start;"
if s.count(a)==1:
    s=s.replace(a,"display:flex;gap:16px;align-items:stretch;")
open(p,"w",encoding="utf-8").write(s);print("PATCHED")
