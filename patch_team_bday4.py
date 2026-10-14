p="public/upmo/upmo-win.js"
s=open(p,encoding="utf-8").read()
a="margin-left:36px;padding:4px 12px 4px 28px;"
if s.count(a)!=1:
    print("ANCHOR_COUNT",s.count(a));raise SystemExit
open(p,"w",encoding="utf-8").write(s.replace(a,"margin-left:36px;padding:0 12px 0 36px;height:36px;"));print("PATCHED")
