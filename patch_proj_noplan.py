p="public/upmo/upmo-win.js"
s=open(p,encoding="utf-8").read()
a="+mn('План',pl)"
if s.count(a)!=1:
    print("ANCHOR_COUNT",s.count(a));raise SystemExit
open(p,"w",encoding="utf-8").write(s.replace(a,""));print("PATCHED")
