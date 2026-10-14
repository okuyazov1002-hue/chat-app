p="public/upmo/upmo-win.js"
s=open(p,encoding="utf-8").read()
a="tw.innerHTML=teamBdHtml()+teamListHtml();"
if s.count(a)!=1:
    print("ANCHOR_COUNT",s.count(a));raise SystemExit
b=a+"var _tb=tw.querySelector('#teamBd');if(_tb){_tb.style.position='sticky';_tb.style.top='0';_tb.style.zIndex='5';}"
s=s.replace(a,b)
open(p,"w",encoding="utf-8").write(s);print("PATCHED")
