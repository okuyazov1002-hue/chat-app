p="public/upmo/upmo-win.js"
s=open(p,encoding="utf-8").read()
r=[('data-o="0" style="max-height:0;overflow:hidden;','data-o="1" style="max-height:600px;overflow:hidden;'),
("(hk?'&#9656;':'')","(hk?'&#9662;':'')")]
c=[s.count(a) for a,b in r]
if c!=[1,1]:
    print("ANCHOR_COUNT",c);raise SystemExit
for a,b in r: s=s.replace(a,b)
open(p,"w",encoding="utf-8").write(s);print("PATCHED")
