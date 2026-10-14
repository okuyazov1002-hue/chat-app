p="public/upmo/upmo-win.js"
s=open(p,encoding="utf-8").read()
a1="background:#e8f0fb;"
a2="background:#e6f6ee;"
if s.count(a1)!=1 or s.count(a2)!=1:
    print("ANCHOR_COUNT",s.count(a1),s.count(a2));raise SystemExit
s=s.replace(a1,"background:rgba(255,255,255,0.5);").replace(a2,"background:rgba(255,255,255,0.5);")
open(p,"w",encoding="utf-8").write(s);print("PATCHED")
