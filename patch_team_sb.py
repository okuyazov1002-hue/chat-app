p="public/upmo/upmo-win.js"
s=open(p,encoding="utf-8").read()
a="var tw=null;"
if s.count(a)!=1:
    print("ANCHOR_COUNT",s.count(a));raise SystemExit
b="(function(){var st=document.createElement('style');st.textContent='#teamWin{scrollbar-width:none;-ms-overflow-style:none;}#teamWin::-webkit-scrollbar{display:none;width:0;height:0;}';document.head.appendChild(st);})();"+a
s=s.replace(a,b)
open(p,"w",encoding="utf-8").write(s);print("PATCHED")
