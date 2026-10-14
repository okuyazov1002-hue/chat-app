p="public/upmo/upmo-win.js"
s=open(p,encoding="utf-8").read()
A="<div style=\"'+bx+'background:rgba(255,255,255,0.5);\">'+cell('Выполнено','dn')"
B="<div style=\"'+bx+'background:rgba(255,255,255,0.5);\">'+cell('План','pl')+cell('Остаток','rp')+'</div>"+A
g1="grid-template-columns:1fr 1fr;gap:8px;margin-top:10px;"
g2="sv('tc',d.totalCost);"
c=[s.count(A),s.count(g1),s.count(g2)]
if c!=[1,1,1]:
    print("ANCHOR_COUNT",c);raise SystemExit
s=s.replace(A,B).replace(g1,"grid-template-columns:1fr 1fr 1fr;gap:8px;margin-top:10px;").replace(g2,"sv('tc',d.totalCost);sv('pl',d.plan);sv('rp',Math.max(0,(d.totalCost||0)-(d.plan||0)));")
open(p,"w",encoding="utf-8").write(s);print("PATCHED")
