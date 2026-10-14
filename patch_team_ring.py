p="public/main.html"
s=open(p,encoding="utf-8").read()
i=s.find('<g class="tm-ring">')
tail='</g><g transform="translate(60 60) scale(0.88)'
j=s.find(tail,i)
if s.count('<g class="tm-ring">')!=1 or i<0 or j<0:
    print("ANCHOR",i,j);raise SystemExit
K='<animateTransform attributeName="transform" type="rotate" values="0 60 60;%s 60 60" keyTimes="0;1" dur="1.2s" begin="indefinite" calcMode="spline" keySplines=".4 0 .2 1"/>'
ring=('<g>'+K%'360'+'<circle cx="60" cy="60" r="52" fill="none" stroke="#6A5BD6" stroke-width="9" stroke-linecap="round" stroke-dasharray="78 249" transform="rotate(180 60 60)"/></g>'
 '<g>'+K%'-360'+'<circle cx="60" cy="60" r="52" fill="none" stroke="url(#tmArc)" stroke-width="9" stroke-linecap="round" stroke-dasharray="205 122" transform="rotate(285 60 60)"/></g>')
s=s[:i]+ring+s[j+4:]
a1='aria-label="Команда"><defs><style>'
a2='<button id="teamBtn" title="Команда">'
if s.count(a1)!=1 or s.count(a2)!=1:
    print("ANCHOR2",s.count(a1),s.count(a2));raise SystemExit
s=s.replace(a1,'aria-label="Команда"><defs><linearGradient id="tmArc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5B94D0"/><stop offset="1" stop-color="#5FD2B0"/></linearGradient><style>')
s=s.replace(a2,'<button id="teamBtn" title="Команда" onclick="this.querySelectorAll(\'animateTransform\').forEach(function(a){a.beginElement();})">')
open(p,"w",encoding="utf-8").write(s);print("PATCHED")
