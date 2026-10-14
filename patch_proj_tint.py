p="public/upmo/upmo-win.js"
s=open(p,encoding="utf-8").read()
r=[("function mn(l,v){","function mn(l,v,bg){"),
("background:rgba(0,0,0,0.04);border-radius:10px;padding:5px 6px;min-width:0;","background:'+bg+';border-radius:10px;padding:5px 6px;min-width:0;"),
("mn('Выполнено',dn)","mn('Выполнено',dn,'rgba(74,144,217,0.2)')"),
("mn('Оплачено',pd)","mn('Оплачено',pd,'rgba(29,211,176,0.22)')")]
c=[s.count(a) for a,b in r]
if c!=[1,1,1,1]:
    print("ANCHOR_COUNT",c);raise SystemExit
for a,b in r: s=s.replace(a,b)
open(p,"w",encoding="utf-8").write(s);print("PATCHED")
