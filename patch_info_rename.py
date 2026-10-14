p="public/main.html"
s=open(p,encoding="utf-8").read()
a1='<button id="upmoBtn" title="UPMO"'
a2='</head>'
c=[s.count(a1),s.count(a2)]
if c!=[1,1]:
    print("ANCHOR_COUNT",c);raise SystemExit
s=s.replace(a1,'<button id="upmoBtn" title="Информация"')
s=s.replace(a2,'<style>@media (min-width:769px){#infoBtn{display:none !important;}}</style></head>')
open(p,"w",encoding="utf-8").write(s);print("PATCHED")
