p="public/main.html"
s=open(p,encoding="utf-8").read()
a='<button id="settingsBtn" title="Добавить пользователя">'
i=s.find(a)
if s.count(a)!=1 or i<0:
    print("ANCHOR_COUNT",s.count(a));raise SystemExit
j=s.find("</svg>",i);k=s.find("</button>",i)
if j<0 or j>k:
    print("NO_SVG");raise SystemExit
css=("#settingsBtn .a4-p{opacity:0;transform-origin:60px 70px}#settingsBtn .a4-c{transform-origin:60px 80px}#settingsBtn .a4-f{opacity:0;transform-origin:60px 60px}#settingsBtn .a4-b{opacity:0;transform-origin:80.5px 78px}#settingsBtn .a4-s1,#settingsBtn .a4-s2{opacity:0}"
"#settingsBtn.a4go .a4-p{animation:a4p 4s 1}#settingsBtn.a4go .a4-c{animation:a4c 4s 1}#settingsBtn.a4go .a4-f{animation:a4f 4s 1}#settingsBtn.a4go .a4-b{animation:a4b 4s 1}#settingsBtn.a4go .a4-s1{animation:a4s1 4s 1}#settingsBtn.a4go .a4-s2{animation:a4s2 4s 1}"
"@keyframes a4p{0%{opacity:0;transform:translateY(-44px);animation-timing-function:ease-in}8%{opacity:1}26%{opacity:1;transform:translateY(0);animation-timing-function:ease-in}36%{opacity:1;transform:translateY(52px)}37%,100%{opacity:0;transform:translateY(-44px)}}"
"@keyframes a4c{0%,36%{opacity:1;transform:scale(1,1)}40%{opacity:1;transform:scale(1.07,0.92)}46%{opacity:1;transform:scale(0.98,1.03)}50%{opacity:1;transform:scale(1,1)}58%{opacity:0;transform:scale(0.3,0.3)}92%{opacity:0;transform:scale(0.3,0.3)}100%{opacity:1;transform:scale(1,1)}}"
"@keyframes a4f{0%,50%{opacity:0;transform:scale(0.3)}60%{opacity:1;transform:scale(1.12)}66%{opacity:1;transform:scale(0.96)}72%,88%{opacity:1;transform:scale(1)}96%,100%{opacity:0;transform:scale(1)}}"
"@keyframes a4b{0%,58%{opacity:0;transform:scale(0)}70%{opacity:1;transform:scale(1.25)}76%{opacity:1;transform:scale(0.95)}80%,100%{opacity:1;transform:scale(1)}}"
"@keyframes a4s1{0%,35%{opacity:0;transform:translateY(0)}37%{opacity:1;transform:translateY(0)}54%,100%{opacity:0;transform:translateY(-14px)}}"
"@keyframes a4s2{0%,52%{opacity:0;transform:translateY(0)}56%{opacity:1;transform:translateY(0)}76%,100%{opacity:0;transform:translateY(-9px)}}")
K='<animateTransform attributeName="transform" type="rotate" values="0 60 60;%s 60 60" keyTimes="0;1" dur="1.2s" begin="indefinite" calcMode="spline" keySplines=".4 0 .2 1"/>'
def ln(cls,y1,y2,rot,col):
    return '<g style="transform:rotate(%ddeg)"><line class="%s" x1="0" y1="%d" x2="0" y2="%d" stroke="%s" stroke-width="3" stroke-linecap="round"/></g>'%(rot,cls,y1,y2,col) if False else '<g style="transform:rotate(%ddeg)"><line class="%s" x1="0" y1="%d" x2="0" y2="%d" stroke="%s" stroke-width="3" stroke-linecap="round"/></g>'%(rot,cls,y1,y2,col)
s1=''.join(ln('a4-s1',-12,-19,r,c) for r,c in [(-75,'#5FD2B0'),(-45,'#5B94D0'),(-15,'#6A5BD6'),(15,'#6A5BD6'),(45,'#5B94D0'),(75,'#5FD2B0')])
s2=''.join(ln('a4-s2',-31,-37,r,c) for r,c in [(0,'#5FD2B0'),(45,'#5B94D0'),(90,'#6A5BD6'),(135,'#5FD2B0'),(180,'#5B94D0'),(225,'#6A5BD6'),(270,'#5FD2B0'),(315,'#5B94D0')])
svg=('<svg width="34" height="34" viewBox="0 0 120 120" role="img" aria-label="Добавить пользователя"><style>'+css+'</style><defs>'
'<linearGradient id="a4Arc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5B94D0"/><stop offset="1" stop-color="#5FD2B0"/></linearGradient>'
'<linearGradient id="a4Usr" gradientUnits="userSpaceOnUse" x1="0" y1="30" x2="0" y2="70"><stop offset="0" stop-color="#6A5BD6"/><stop offset="1" stop-color="#5B94D0"/></linearGradient>'
'<linearGradient id="a4UsrF" gradientUnits="userSpaceOnUse" x1="0" y1="31" x2="0" y2="84"><stop offset="0" stop-color="#6A5BD6"/><stop offset="1" stop-color="#5B94D0"/></linearGradient>'
'<linearGradient id="a4Db" gradientUnits="userSpaceOnUse" x1="0" y1="68" x2="0" y2="96"><stop offset="0" stop-color="#5B94D0"/><stop offset="1" stop-color="#5FD2B0"/></linearGradient>'
'<linearGradient id="a4Badge" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5B94D0"/><stop offset="1" stop-color="#5FD2B0"/></linearGradient>'
'<clipPath id="a4Clip"><circle cx="60" cy="60" r="46"/></clipPath><clipPath id="a4Above"><rect x="0" y="0" width="120" height="77"/></clipPath></defs>'
'<g>'+K%'360'+'<circle cx="60" cy="60" r="52" fill="none" stroke="#6A5BD6" stroke-width="9" stroke-linecap="round" stroke-dasharray="78 249" transform="rotate(180 60 60)"/></g>'
'<g>'+K%'-360'+'<circle cx="60" cy="60" r="52" fill="none" stroke="url(#a4Arc)" stroke-width="9" stroke-linecap="round" stroke-dasharray="205 122" transform="rotate(285 60 60)"/></g>'
'<g clip-path="url(#a4Clip)"><g clip-path="url(#a4Above)"><g class="a4-p"><circle cx="60" cy="38" r="8" fill="url(#a4Usr)"/><path d="M43 70 C43 58 50 52 60 52 C70 52 77 58 77 70 Z" fill="url(#a4Usr)" stroke="url(#a4Usr)" stroke-width="3" stroke-linejoin="round"/></g></g>'
'<g class="a4-c"><path d="M38 74 V90 A22 6 0 0 0 82 90 V74 Z" fill="url(#a4Db)"/><ellipse cx="60" cy="74" rx="22" ry="6" fill="url(#a4Db)"/><ellipse cx="60" cy="74" rx="22" ry="6" fill="#fff" fill-opacity="0.3"/><path d="M38 82 A22 6 0 0 0 82 82" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/></g>'
'<g class="a4-f"><circle cx="50.5" cy="43" r="12" fill="url(#a4UsrF)"/><path d="M26.5 84 C26.5 67 36.5 59 50.5 59 C64.5 59 74.5 67 74.5 84 Z" fill="url(#a4UsrF)" stroke="url(#a4UsrF)" stroke-width="3" stroke-linejoin="round"/>'
'<g class="a4-b"><circle cx="80.5" cy="78" r="14" fill="url(#a4Badge)" stroke="#F5F6FA" stroke-width="6" paint-order="stroke"/><path d="M80.5 71 V85 M73.5 78 H87.5" stroke="#fff" stroke-width="4" stroke-linecap="round" fill="none"/></g></g>'
'<g transform="translate(60 74)">'+s1+'</g><g transform="translate(60 60)">'+s2+'</g></g></svg>')
new='<button id="settingsBtn" title="Добавить пользователя" onclick="var b=this;b.classList.remove(\'a4go\');void b.offsetWidth;b.classList.add(\'a4go\');this.querySelectorAll(\'animateTransform\').forEach(function(a){a.beginElement();})">'
s=s[:i]+new+svg+s[j+6:]
open(p,"w",encoding="utf-8").write(s);print("PATCHED")
