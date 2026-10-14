p="public/main.html"
s=open(p,encoding="utf-8").read()
a='<button id="structureBtn" title="База данных">'
i=s.find(a)
if s.count(a)!=1 or i<0:
    print("ANCHOR_COUNT",s.count(a));raise SystemExit
j=s.find("</svg>",i);k=s.find("</button>",i)
if j<0 or j>k:
    print("NO_SVG");raise SystemExit
css=".upmo-srv{animation:upmoSrv 6s ease-in-out infinite}.upmo-cld{animation:upmoCld 6s ease-in-out infinite;opacity:0}@keyframes upmoSrv{0%,28%{transform:translateX(0);opacity:1}40%{transform:translateX(40px);opacity:0}41%,91%{transform:translateX(-40px);opacity:0}100%{transform:translateX(0);opacity:1}}@keyframes upmoCld{0%,40%{transform:translateX(-40px);opacity:0}52%,76%{transform:translateX(0);opacity:1}88%,100%{transform:translateX(40px);opacity:0}}@media (prefers-reduced-motion:reduce){.upmo-srv,.upmo-cld{animation:none}.upmo-cld{opacity:0}}"
K='<animateTransform attributeName="transform" type="rotate" values="0 60 60;%s 60 60" keyTimes="0;1" dur="1.2s" begin="indefinite" calcMode="spline" keySplines=".4 0 .2 1"/>'
svg=('<svg width="34" height="34" viewBox="0 0 120 120" role="img" aria-label="Обновление базы данных"><style>'+css+'</style><defs>'
'<linearGradient id="dbArc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5B94D0"/><stop offset="1" stop-color="#5FD2B0"/></linearGradient>'
'<linearGradient id="syncDb" gradientUnits="userSpaceOnUse" x1="0" y1="35" x2="0" y2="85"><stop offset="0" stop-color="#6A5BD6"/><stop offset="0.55" stop-color="#5B94D0"/><stop offset="1" stop-color="#5FD2B0"/></linearGradient>'
'<clipPath id="syncClip"><circle cx="60" cy="60" r="46"/></clipPath></defs>'
'<g>'+K%'360'+'<circle cx="60" cy="60" r="52" fill="none" stroke="#6A5BD6" stroke-width="9" stroke-linecap="round" stroke-dasharray="78 249" transform="rotate(180 60 60)"/></g>'
'<g>'+K%'-360'+'<circle cx="60" cy="60" r="52" fill="none" stroke="url(#dbArc)" stroke-width="9" stroke-linecap="round" stroke-dasharray="205 122" transform="rotate(285 60 60)"/></g>'
'<g clip-path="url(#syncClip)"><g class="upmo-srv"><path d="M40 42 L40 78 A20 7 0 0 0 80 78 L80 42 Z" fill="url(#syncDb)"/><ellipse cx="60" cy="42" rx="20" ry="7" fill="url(#syncDb)"/><ellipse cx="60" cy="42" rx="20" ry="7" fill="#fff" fill-opacity="0.3"/><path d="M40 56 A20 7 0 0 0 80 56 M40 68 A20 7 0 0 0 80 68" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/></g>'
'<g class="upmo-cld"><rect x="36" y="64" width="48" height="14" rx="7" fill="url(#syncDb)"/><circle cx="46" cy="65" r="10" fill="url(#syncDb)"/><circle cx="62" cy="55" r="15" fill="url(#syncDb)"/><circle cx="76" cy="66" r="9" fill="url(#syncDb)"/><path d="M60 72 V58 M53.5 64.5 L60 58 L66.5 64.5" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></g></g></svg>')
new='<button id="structureBtn" title="База данных" onclick="this.querySelectorAll(\'animateTransform\').forEach(function(a){a.beginElement();})">'
s=s[:i]+new+svg+s[j+6:]
open(p,"w",encoding="utf-8").write(s);print("PATCHED")
