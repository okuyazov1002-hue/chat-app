p="public/upmo/upmo-win.js"
s=open(p,encoding="utf-8").read()
a1='display:flex;gap:12px;align-items:stretch;'
a2='flex:0 0 150px;'
c=[s.count(a1),s.count(a2)]
if c!=[1,1]:
    print("ANCHOR_COUNT",c);raise SystemExit
s=s.replace(a1,'display:flex;gap:12px;align-items:stretch;flex:1;min-width:0;').replace(a2,'flex:1 1 0;min-width:0;')
open(p,"w",encoding="utf-8").write(s);print("PATCHED")
