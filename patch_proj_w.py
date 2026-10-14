p="public/upmo/upmo-win.js"
s=open(p,encoding="utf-8").read()
a1="width:350px;"
a2="border-radius:16px;padding:14px 16px;"
c=[s.count(a1),s.count(a2)]
if c!=[1,1]:
    print("ANCHOR_COUNT",c);raise SystemExit
s=s.replace(a1,"width:335px;").replace(a2,"border-radius:16px;padding:14px 12px;")
open(p,"w",encoding="utf-8").write(s);print("PATCHED")
