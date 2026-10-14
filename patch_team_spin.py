p="public/upmo/upmo-win.js"
s=open(p,encoding="utf-8").read()
a="var t=e.target.closest('#teamBtn');"
if s.count(a)!=1:
    print("ANCHOR_COUNT",s.count(a));raise SystemExit
s=s.replace(a,a+"if(t){var _an=t.querySelectorAll('animateTransform');for(var _i=0;_i<_an.length;_i++){try{_an[_i].beginElement();}catch(_x){}}}")
open(p,"w",encoding="utf-8").write(s);print("PATCHED")
