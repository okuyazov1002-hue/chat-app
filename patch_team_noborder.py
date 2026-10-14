p="public/upmo/upmo-win.js"
s=open(p,encoding="utf-8").read()
a="tw.style.cssText='left:104px;width:420px;padding:0;z-index:2001;';"
if s.count(a)!=1:
    print("ANCHOR_COUNT",s.count(a));raise SystemExit
b="tw.style.cssText='left:104px;width:420px;padding:0;z-index:2001;border:0;background:transparent;overflow:hidden;';"
open(p,"w",encoding="utf-8").write(s.replace(a,b));print("PATCHED")
