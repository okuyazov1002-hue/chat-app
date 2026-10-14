p="public/upmo/upmo-win.js"
s=open(p,encoding="utf-8").read()
a="width:'+fp+'%;background:linear-gradient(90deg,#6a5ae0 0%,#4a90d9 50%,#1dd3b0 100%);"
if s.count(a)!=1:
    print("ANCHOR_COUNT",s.count(a));raise SystemExit
open(p,"w",encoding="utf-8").write(s.replace(a,"width:'+fp+'%;background:#1dd3b0;"));print("PATCHED")
