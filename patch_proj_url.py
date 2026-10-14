p="public/upmo/upmo-win.js"
s=open(p,encoding="utf-8").read()
a='fetch("/api/reports//summary"+encodeURIComponent(k.slice(5)))'
b='fetch("/api/reports/"+encodeURIComponent(k.slice(5))+"/summary")'
if s.count(a)!=1:
    print("ANCHOR_COUNT",s.count(a));raise SystemExit
open(p,"w",encoding="utf-8").write(s.replace(a,b));print("PATCHED")
