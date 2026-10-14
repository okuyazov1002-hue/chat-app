p="public/upmo/upmo-win.js"
s=open(p,encoding="utf-8").read()
a1="ORD.map(function(n){return '<div style=\"box-sizing:border-box;flex:1 1 0;min-width:0;background:#fff;border-radius:14px;padding:10px 12px;"
b1="ORD.map(function(n,i){return '<div style=\"box-sizing:border-box;flex:1 1 0;min-width:0;background:#fff;border-radius:'+(i===0?'0 14px 14px 0':'14px')+';padding:'+(i===0?'10px 12px 10px 42px':'10px 12px')+';"
if s.count(a1)!=1:
    print("ANCHOR_COUNT",s.count(a1));raise SystemExit
open(p,"w",encoding="utf-8").write(s.replace(a1,b1));print("PATCHED")
