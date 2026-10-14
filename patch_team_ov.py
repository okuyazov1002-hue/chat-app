p="public/upmo/upmo-win.js"
s=open(p,encoding="utf-8").read()
r=[(r'''d.style.marginTop=o?\'0\':\'-6px\';''',r'''d.style.marginTop=o?\'0\':\'4px\';'''),
(r'''cursor:pointer;position:relative;display:flex;''',r'''cursor:pointer;position:relative;z-index:2;display:flex;'''),
(r'''max-height:0;overflow:hidden;opacity:0;margin:0 0 0 36px;''',r'''position:relative;z-index:1;max-height:0;overflow:hidden;opacity:0;margin:0 0 0 36px;''')]
c=[s.count(a) for a,b in r]
if c!=[1,1,1]:
    print("ANCHOR_COUNT",c);raise SystemExit
for a,b in r: s=s.replace(a,b)
open(p,"w",encoding="utf-8").write(s);print("PATCHED")
