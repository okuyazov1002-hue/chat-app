p="public/main.html"
s=open(p,encoding="utf-8").read()
i=s.find('<div id="sideLogo"')
if s.count('<div id="sideLogo"')!=1 or i<0:
    print("ANCHOR_COUNT",s.count('<div id="sideLogo"'));raise SystemExit
j=s.find("</svg></div>",i)+len("</svg></div>")
blk=s[i:j]
s=s[:i]+s[j:]
a='<div class="username" id="username">'
k=s.find(a)
if s.count(a)!=1 or k<0:
    print("ANCHOR_USER",s.count(a));raise SystemExit
e=s.find("</div>",k)+6
s=s[:e]+blk.replace("margin-top:10px;","margin-top:8px;")+s[e:]
open(p,"w",encoding="utf-8").write(s);print("PATCHED")
