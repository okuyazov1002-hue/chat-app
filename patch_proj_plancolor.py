p="public/upmo/upmo-win.js"
s=open(p,encoding="utf-8").read()
r=[("background:rgba(217,119,111,0.45);","background:#5a82e6;"),
("<span style=\"color:#6b7280;\">'+pp","<span style=\"color:#5a82e6;\">'+pp")]
c=[s.count(a) for a,b in r]
if c!=[1,1]:
    print("ANCHOR_COUNT",c);raise SystemExit
for a,b in r: s=s.replace(a,b)
open(p,"w",encoding="utf-8").write(s);print("PATCHED")
