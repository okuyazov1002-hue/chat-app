p="public/upmo/upmo-win.js"
s=open(p,encoding="utf-8").read()
a="<span style=\"color:#1dd3b0;\">'+fp"
if s.count(a)!=1:
    print("ANCHOR_COUNT",s.count(a));raise SystemExit
open(p,"w",encoding="utf-8").write(s.replace(a,"<span style=\"color:#2f855a;\">'+fp"));print("PATCHED")
