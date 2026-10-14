p="public/upmo/upmo-win.js"
s=open(p,encoding="utf-8").read()
a="tw.style.cssText='left:104px;width:420px;padding:16px;z-index:2001;';"
if s.count(a)!=1:
    print("ANCHOR_COUNT",s.count(a));raise SystemExit
b=a+"tw.innerHTML='<div style=\"height:90px;border-radius:16px;background:linear-gradient(135deg,#6A5BD6 0%,#5B94D0 60%,#5FD2B0 100%);box-shadow:0 2px 14px rgba(0,0,0,0.2);\"></div>';"
open(p,"w",encoding="utf-8").write(s.replace(a,b));print("PATCHED")
