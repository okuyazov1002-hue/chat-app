p="public/upmo/upmo-win.js"
s=open(p,encoding="utf-8").read()
r=[("if(ov!==null){closeAll();}","if(ov!==null){var _o=ov;closeAll();_o.style.display='none';}"),
("closeTeam();ov=document.createElement('div');ov.id='upmoWin';","var _t0=tw;closeTeam();if(_t0){_t0.style.display='none';}ov=document.createElement('div');ov.id='upmoWin';")]
c=[s.count(a) for a,b in r]
if c!=[1,1]:
    print("ANCHOR_COUNT",c);raise SystemExit
for a,b in r: s=s.replace(a,b)
open(p,"w",encoding="utf-8").write(s);print("PATCHED")
