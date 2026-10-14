p="public/upmo/upmo-win.js"
s=open(p,encoding="utf-8").read()
i=s.find("function mn(l,v,r){")
j=s.find("e.innerHTML=fm(c)+",i)
k=s.find("}\n",j)
if i<0 or j<0 or k<0 or s.count("function mn(l,v,r){")!=1:
    print("ANCHOR",i,j,k);raise SystemExit
tail=s[j:k]
print(tail[:120])
new='''function mn(l,v){var L='font-size:9px;color:#6b7280;font-weight:600;',V='font-size:10px;color:#1f2937;font-weight:700;';return '<div style="background:rgba(0,0,0,0.04);border-radius:10px;padding:5px 6px;min-width:0;"><div style="'+L+'">'+l+'</div><div style="'+V+'">'+fm(v)+'</div><div style="'+L+'margin-top:3px;">Остаток</div><div style="'+V+'">'+fm(Math.max(0,c-v))+'</div></div>';}
e.innerHTML=fm(c)+'<div style="display:grid;grid-template-columns:1fr 1fr;gap:5px;margin-top:5px;">'+mn('Выполнено',dn)+mn('Оплачено',pd)+'</div>';'''
s=s[:i]+new+s[k:]
open(p,"w",encoding="utf-8").write(s);print("PATCHED")
