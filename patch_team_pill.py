p="public/upmo/upmo-win.js"
s=open(p,encoding="utf-8").read()
a="bottom:-16px;transform:translateX(-50%);width:48px;height:16px;border-radius:0 0 12px 12px;"
if s.count(a)!=1:
    print("ANCHOR_COUNT",s.count(a));raise SystemExit
open(p,"w",encoding="utf-8").write(s.replace(a,"bottom:-8px;transform:translateX(-50%);width:48px;height:16px;border-radius:12px;z-index:2;"));print("PATCHED")
