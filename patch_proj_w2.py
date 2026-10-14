p="public/upmo/upmo-win.js"
s=open(p,encoding="utf-8").read()
a1="width:335px;"
a2="padding:8px 8px;box-shadow"
c=[s.count(a1),s.count(a2)]
if c!=[1,1]:
    print("ANCHOR_COUNT",c);raise SystemExit
s=s.replace(a1,"width:315px;").replace(a2,"padding:8px 6px;box-shadow")
open(p,"w",encoding="utf-8").write(s);print("PATCHED")
