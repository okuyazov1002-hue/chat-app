p="public/main.html"
s=open(p,encoding="utf-8").read()
svg=open("team_icon.svg",encoding="utf-8").read().strip()
a='<button id="teamBtn" title="Команда">'
i=s.find(a)
if s.count(a)!=1 or i<0:
    print("ANCHOR_COUNT",s.count(a));raise SystemExit
j=s.find("</svg>",i)
k=s.find("</button>",i)
if j<0 or j>k:
    print("NO_SVG");raise SystemExit
s=s[:i+len(a)]+svg+s[j+6:]
open(p,"w",encoding="utf-8").write(s);print("PATCHED")
