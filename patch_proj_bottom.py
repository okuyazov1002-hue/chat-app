p="public/upmo/upmo-win.js"
s=open(p,encoding="utf-8").read()
r=[("if(k.indexOf('proj:')===0){window.upmoProjPage(B,k,ttl);","if(k.indexOf('proj:')===0){B.style.bottom='16px';window.upmoProjPage(B,k,ttl);"),
("}else if(window.upmoFillPanel){window.upmoFillPanel(B,k);}","}else if(window.upmoFillPanel){B.style.bottom='';window.upmoFillPanel(B,k);}")]
c=[s.count(a) for a,b in r]
if c!=[1,1]:
    print("ANCHOR_COUNT",c);raise SystemExit
for a,b in r: s=s.replace(a,b)
open(p,"w",encoding="utf-8").write(s);print("PATCHED")
