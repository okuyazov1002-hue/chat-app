p="public/main.html"
s=open(p,encoding="utf-8").read()
a="<button id='mapBtn' title='Карта'>"
i=s.find(a)
if s.count(a)!=1 or i<0:
    print("ANCHOR_COUNT",s.count(a));raise SystemExit
j=s.find("</svg>",i);k=s.find("</button>",i)
if j<0 or j>k:
    print("NO_SVG");raise SystemExit
css=(".m-pin{transform-origin:60px 88px;animation:mPin 3s infinite}.m-sh{transform-origin:60px 93px;animation:mSh 3s infinite}.m-rp{transform-origin:60px 91px;opacity:0;animation:mRp 3s infinite}.m-sp{opacity:0;animation:mSp 3s infinite}"
"@keyframes mPin{0%{opacity:0;transform:translate(-34px,-56px) rotate(-30deg) scale(1,1);animation-timing-function:ease-in}8%{opacity:1}34%{opacity:1;transform:translate(0,0) rotate(0deg) scale(1,1);animation-timing-function:ease-out}38%{opacity:1;transform:translate(0,0) rotate(0deg) scale(1.1,0.86)}46%{opacity:1;transform:translate(0,0) rotate(0deg) scale(0.97,1.04)}52%,88%{opacity:1;transform:translate(0,0) rotate(0deg) scale(1,1)}96%,100%{opacity:0;transform:translate(0,0) rotate(0deg) scale(1,1)}}"
"@keyframes mSh{0%,32%{opacity:0;transform:scale(0.3)}38%{opacity:1;transform:scale(1.15)}52%,88%{opacity:1;transform:scale(1)}96%,100%{opacity:0;transform:scale(1)}}"
"@keyframes mRp{0%,34%{opacity:0;transform:scale(0.3)}36%{opacity:0.8;transform:scale(0.4)}58%,100%{opacity:0;transform:scale(3.4)}}"
"@keyframes mSp{0%,35%{opacity:0;transform:translateY(0)}37%{opacity:1;transform:translateY(0)}60%,100%{opacity:0;transform:translateY(-18px)}}"
"@media (prefers-reduced-motion:reduce){.m-pin,.m-sh,.m-rp,.m-sp{animation:none}.m-pin,.m-sh{opacity:1}}")
K='<animateTransform attributeName="transform" type="rotate" values="0 60 60;%s 60 60" keyTimes="0;1" dur="1.2s" begin="indefinite" calcMode="spline" keySplines=".4 0 .2 1"/>'
sp=""
for ang,col in [(-90,"#5FD2B0"),(-60,"#5B94D0"),(-30,"#6A5BD6"),(0,"#5B94D0"),(30,"#6A5BD6"),(60,"#5B94D0"),(90,"#5FD2B0")]:
    sp+='<g style="transform:rotate(%ddeg)"><line class="m-sp" x1="0" y1="-7" x2="0" y2="-14" stroke="%s" stroke-width="3" stroke-linecap="round"/></g>'%(ang,col)
svg=('<svg width="34" height="34" viewBox="0 0 120 120" role="img" aria-label="Карта"><style>'+css+'</style><defs>'
'<linearGradient id="mapArc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5B94D0"/><stop offset="1" stop-color="#5FD2B0"/></linearGradient>'
'<linearGradient id="mapPin" gradientUnits="userSpaceOnUse" x1="0" y1="30" x2="0" y2="90"><stop offset="0" stop-color="#6A5BD6"/><stop offset="0.55" stop-color="#5B94D0"/><stop offset="1" stop-color="#5FD2B0"/></linearGradient>'
'<clipPath id="mapClip"><circle cx="60" cy="60" r="46"/></clipPath></defs>'
'<g>'+K%'360'+'<circle cx="60" cy="60" r="52" fill="none" stroke="#6A5BD6" stroke-width="9" stroke-linecap="round" stroke-dasharray="78 249" transform="rotate(180 60 60)"/></g>'
'<g>'+K%'-360'+'<circle cx="60" cy="60" r="52" fill="none" stroke="url(#mapArc)" stroke-width="9" stroke-linecap="round" stroke-dasharray="205 122" transform="rotate(285 60 60)"/></g>'
'<g clip-path="url(#mapClip)"><ellipse class="m-sh" cx="60" cy="93" rx="13" ry="3.5" fill="url(#mapPin)" fill-opacity="0.3"/>'
'<ellipse class="m-rp" cx="60" cy="91" rx="8" ry="2.5" fill="none" stroke="#5FD2B0" stroke-width="1.5"/>'
'<g class="m-pin"><path d="M60 88 C60 88 40 68 40 52 A20 20 0 0 1 80 52 C80 68 60 88 60 88 Z" fill="url(#mapPin)" stroke="url(#mapPin)" stroke-width="3" stroke-linejoin="round"/><circle cx="60" cy="52" r="8" fill="#fff"/></g>'
'<g transform="translate(60 90)">'+sp+'</g></g></svg>')
new="<button id='mapBtn' title='Карта' onclick=\"this.querySelectorAll('animateTransform').forEach(function(a){a.beginElement();})\">"
s=s[:i]+new+svg+s[j+6:]
open(p,"w",encoding="utf-8").write(s);print("PATCHED")
