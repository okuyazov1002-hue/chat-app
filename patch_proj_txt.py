p="public/upmo/upmo-win.js"
s=open(p,encoding="utf-8").read()
a='<div style=\\"color:#9ca3af;font-size:13px;\\">Дашборды будут добавлены</div>'
c=s.count(a)
if c!=1:
    print("ANCHOR_COUNT",c)
else:
    s=s.replace(a,'')
    open(p,"w",encoding="utf-8").write(s);print("PATCHED")
