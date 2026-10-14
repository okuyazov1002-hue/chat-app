p="public/upmo/upmo-win.js"
s=open(p,encoding="utf-8").read()
a1='display:flex;gap:12px;align-items:stretch;flex:1;min-width:0;'
a2='id="upmoPCard" style="width:350px;'
c=[s.count(a1),s.count(a2)]
if c!=[1,1]:
    print("ANCHOR_COUNT",c);raise SystemExit
s=s.replace(a1,a1+'margin-left:-10px;').replace(a2,'id="upmoPCard" style="position:relative;z-index:1;width:350px;')
open(p,"w",encoding="utf-8").write(s);print("PATCHED")
