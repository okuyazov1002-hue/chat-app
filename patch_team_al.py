p="public/upmo/upmo-win.js"
s=open(p,encoding="utf-8").read()
r=[(r'''justify-content:space-between;gap:12px;padding:3px 0;''',r'''justify-content:flex-start;gap:12px;padding:3px 0;'''),
(r'''color:#8a94a6;min-width:84px;''',r'''color:#8a94a6;width:96px;flex:0 0 96px;text-align:right;'''),
(r'''word-break:break-word;text-align:right;">''',r'''word-break:break-word;text-align:left;">''')]
c=[s.count(a) for a,b in r]
if c!=[1,1,1]:
    print("ANCHOR_COUNT",c);raise SystemExit
for a,b in r: s=s.replace(a,b)
open(p,"w",encoding="utf-8").write(s);print("PATCHED")
