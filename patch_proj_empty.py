p="public/upmo/upmo-win.js"
s=open(p,encoding="utf-8").read()
a1="if(k.indexOf('act:')===0){pick(k);}"
b1="if(k.indexOf('act:')===0||k.indexOf('proj:')===0){pick(k);}"
a2="if(window.upmoFillPanel){window.upmoFillPanel(B,k);}"
b2="if(k.indexOf('proj:')===0){B.innerHTML='<div style=\"padding:24px;\"><div style=\"font-size:18px;font-weight:700;color:#1f2937;margin-bottom:16px;\">'+ttl+'</div><div style=\"color:#9ca3af;font-size:13px;\">Дашборды будут добавлены</div></div>';}else if(window.upmoFillPanel){window.upmoFillPanel(B,k);}"
a3="if(busy){return;}busy=true;\nA.classList.remove('on');"
b3="if(busy){return;}busy=true;\nvar ttl='';try{ttl=A.querySelector('[data-k=\"'+k+'\"] span:last-child').textContent;}catch(e){}\nA.classList.remove('on');"
c=[s.count(a1),s.count(a2),s.count(a3)]
if c!=[1,1,1]:
    print("ANCHOR_COUNT",c)
else:
    s=s.replace(a1,b1).replace(a2,b2).replace(a3,b3)
    open(p,"w",encoding="utf-8").write(s);print("PATCHED")
