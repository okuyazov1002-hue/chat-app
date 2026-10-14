p="public/upmo/upmo-win.js"
s=open(p,encoding="utf-8").read()
r=[("border-radius:0 0 12px 12px;background:linear-gradient(135deg,#6A5BD6 0%,#5B94D0 60%,#5FD2B0 100%);cursor:pointer","border-radius:0 0 12px 12px;background:#fff;cursor:pointer"),
('<path d="M2 7 L6 3 L10 7" fill="none" stroke="#fff"','<path d="M2 7 L6 3 L10 7" fill="none" stroke="#5B94D0"')]
c=[s.count(a) for a,b in r]
if c!=[1,1]:
    print("ANCHOR_COUNT",c);raise SystemExit
for a,b in r: s=s.replace(a,b)
open(p,"w",encoding="utf-8").write(s);print("PATCHED")
