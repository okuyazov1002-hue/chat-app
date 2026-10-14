import re
p="public/main.html"
s=open(p,encoding="utf-8").read()
a1='document.getElementById("teamBtn").addEventListener("click",function(){showPage("page-team",this);teamLoaded=false;loadTeamPage();});'
a2='teamLoaded=false; if(document.getElementById("page-team").classList.contains("active")) loadTeamPage();'
a3='document.getElementById("teamEmpList").addEventListener('
st='<div class="page" id="page-team"'
c=[s.count(a1),s.count(a2),s.count(a3),s.count(st)]
if c!=[1,1,1,1]:
    print("ANCHOR_COUNT",c);raise SystemExit
i=s.index(st);d=0;j=i
for m in re.finditer(r'<div\b|</div>',s[i:]):
    d+=1 if m.group()!='</div>' else -1
    if d==0:
        j=i+m.end();break
print("REMOVED_CHARS",j-i)
s=s[:i]+s[j:]
s=s.replace(a1,'').replace(a2,'teamLoaded=false;').replace(a3,'(document.getElementById("teamEmpList")||document.createElement("div")).addEventListener(')
open(p,"w",encoding="utf-8").write(s);print("PATCHED")
