p="public/upmo/upmo-win.js"
s=open(p,encoding="utf-8").read()
a="mn('Оплачено',pd,'rgba(29,211,176,0.22)')+'</div>';"
if s.count(a)!=1:
    print("ANCHOR_COUNT",s.count(a));raise SystemExit
b=a+'''
var pp=Math.round(f?(f.planPct||0):0),fp=c?Math.min(100,Math.round(dn/c*100)):0,dl=fp-pp;
e.innerHTML+='<div style="display:flex;justify-content:space-between;font-size:10px;font-weight:700;margin-top:10px;"><span style="color:#4a90d9;">'+pp+'%</span><span style="color:'+(dl<0?'#e04b4b':'#2fae6a')+';">'+(dl>0?'+':'')+dl+'%</span><span style="color:#2fae6a;">'+fp+'%</span></div><div style="height:8px;border-radius:4px;background:#e5e7eb;display:flex;overflow:hidden;margin-top:3px;"><div style="width:'+fp+'%;background:#4a90d9;"></div><div style="width:'+Math.max(0,pp-fp)+'%;background:#e04b4b;"></div></div>';'''
open(p,"w",encoding="utf-8").write(s.replace(a,b));print("PATCHED")
