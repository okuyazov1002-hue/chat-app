p="public/upmo/upmo-win.js"
s=open(p,encoding="utf-8").read()
a1="border-radius:'+(i===0?'0 14px 14px 0':'14px')+';padding:'+(i===0?'10px 12px 10px 42px':'10px 12px')+';"
b1="border-radius:0 14px 14px 0;padding:10px 12px 10px 42px;position:relative;z-index:'+(10-i)+';'+(i>0?'margin-left:-30px;':'')+'"
a2="display:flex;gap:12px;align-items:stretch;flex:1;min-width:0;margin-left:-30px;"
c=[s.count(a1),s.count(a2)]
if c!=[1,1]:
    print("ANCHOR_COUNT",c);raise SystemExit
s=s.replace(a1,b1).replace(a2,a2.replace("gap:12px","gap:0"))
open(p,"w",encoding="utf-8").write(s);print("PATCHED")
