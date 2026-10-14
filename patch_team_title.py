p="public/upmo/upmo-win.js"
s=open(p,encoding="utf-8").read()
a='font-size:12px;font-weight:700;color:#fff;">Ближайшие дни рождения</div>'
if s.count(a)!=1:
    print("ANCHOR_COUNT",s.count(a));raise SystemExit
open(p,"w",encoding="utf-8").write(s.replace(a,'font-size:10px;font-weight:700;color:#fff;">День рождения</div>'));print("PATCHED")
