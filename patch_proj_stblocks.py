p="public/upmo/upmo-win.js"
s=open(p,encoding="utf-8").read()
a="if(e){e.textContent=fm(Math.round(f?(f.cost||0):0));}"
if s.count(a)!=1:
    print("ANCHOR_COUNT",s.count(a));raise SystemExit
b='''if(e){var c=Math.round(f?(f.cost||0):0),dn=Math.round(f?(f.done||0):0),pd=Math.round(f?(f.paid||0):0),pl=Math.round(c*(f?(f.planPct||0):0)/100);
function mn(l,v,r){return '<div style="background:rgba(0,0,0,0.04);border-radius:10px;padding:5px 6px;margin-top:5px;display:grid;grid-template-columns:1fr 1fr;gap:4px;"><div><div style="font-size:9px;color:#6b7280;font-weight:600;">'+l+'</div><div style="font-size:10px;color:#1f2937;font-weight:700;">'+fm(v)+'</div></div><div><div style="font-size:9px;color:#6b7280;font-weight:600;">Остаток</div><div style="font-size:10px;color:#1f2937;font-weight:700;">'+fm(Math.max(0,c-v))+'</div></div></div>';}
e.innerHTML=fm(c)+mn('План',pl)+mn('Выполнено',dn)+mn('Оплачено',pd);}'''
open(p,"w",encoding="utf-8").write(s.replace(a,b));print("PATCHED")
