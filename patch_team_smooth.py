p="public/upmo/upmo-win.js"
s=open(p,encoding="utf-8").read()
r=[
(r'''display:flex;gap:8px;padding:3px 0;''',r'''display:flex;justify-content:space-between;gap:12px;padding:3px 0;'''),
(r'''font-weight:600;word-break:break-word;">''',r'''font-weight:600;word-break:break-word;text-align:right;">'''),
(r'''display:none;margin:-6px 0 0 36px;background:#fff;border-radius:0 0 10px 10px;padding:14px 14px 10px 14px;''',r'''max-height:0;overflow:hidden;opacity:0;margin:0 0 0 36px;background:#fff;border-radius:0 0 10px 10px;padding:0 14px;transition:max-height .35s ease,opacity .3s ease,margin .35s ease,padding .35s ease;'''),
(r'''var d=this.nextSibling;d.style.display=d.style.display===\'block\'?\'none\':\'block\';''',r'''var d=this.nextSibling,o=d.style.maxHeight&&d.style.maxHeight!==\'0px\';d.style.maxHeight=o?\'0px\':(d.scrollHeight+30)+\'px\';d.style.opacity=o?0:1;d.style.marginTop=o?\'0\':\'-6px\';d.style.padding=o?\'0 14px\':\'14px 14px 10px\';'''),
]
c=[s.count(a) for a,b in r]
if c!=[1,1,1,1]:
    print("ANCHOR_COUNT",c);raise SystemExit
for a,b in r: s=s.replace(a,b)
open(p,"w",encoding="utf-8").write(s);print("PATCHED")
