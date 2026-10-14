p="public/upmo/upmo-win.js"
s=open(p,encoding="utf-8").read()
a1='<div style="font-size:12px;font-weight:700;color:#1f2937;">\'+n+\''
a2='font-size:18px;font-weight:700;color:#1f2937;margin-bottom:16px;'
c=[s.count(a1),s.count(a2)]
if c!=[1,1]:
    print("ANCHOR_COUNT",c);raise SystemExit
s=s.replace(a1,a1.replace("12px","10px")).replace(a2,a2.replace("18px","15px"))
open(p,"w",encoding="utf-8").write(s);print("PATCHED")
