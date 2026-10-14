p="public/upmo/upmo-win.js"
s=open(p,encoding="utf-8").read()
a="_tb.appendChild(_in);}"
if s.count(a)!=1:
    print("ANCHOR_COUNT",s.count(a));raise SystemExit
s=s.replace(a,"_tb.appendChild(_in);var _bb=tw.querySelector('#teamBdBody');if(_bb){_bb.style.marginTop='14px';}}")
open(p,"w",encoding="utf-8").write(s);print("PATCHED")
