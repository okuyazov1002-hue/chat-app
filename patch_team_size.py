p="public/main.html"
s=open(p,encoding="utf-8").read()
a='<svg width="38" height="38" viewBox="0 0 120 120" role="img" aria-label="Команда">'
if s.count(a)!=1:
    print("ANCHOR_COUNT",s.count(a));raise SystemExit
open(p,"w",encoding="utf-8").write(s.replace(a,a.replace('"38"','"34"')));print("PATCHED")
