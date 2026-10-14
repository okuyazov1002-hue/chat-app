p="public/upmo/upmo-win.js"
s=open(p,encoding="utf-8").read()
r=[("tw.style.cssText='left:104px;width:420px;padding:16px;z-index:2001;';","tw.style.cssText='left:104px;width:420px;padding:0;z-index:2001;';"),
("height:90px;border-radius:16px;background:linear-gradient(135deg","height:90px;border-radius:0 0 16px 0;background:linear-gradient(135deg")]
c=[s.count(a) for a,b in r]
if c!=[1,1]:
    print("ANCHOR_COUNT",c);raise SystemExit
for a,b in r: s=s.replace(a,b)
open(p,"w",encoding="utf-8").write(s);print("PATCHED")
