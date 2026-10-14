p="public/main.html"
s=open(p,encoding="utf-8").read()
css="#teamBtn .tm-ring{transform-box:view-box;transform-origin:60px 60px;}#teamBtn.nav-active .tm-ring{animation:tmSpin 1s cubic-bezier(.5,0,.2,1) 1;}@keyframes tmSpin{to{transform:rotate(360deg);}}#teamBtn .tm-l,#teamBtn .tm-r{opacity:0;transition:transform .45s cubic-bezier(.22,1,.36,1),opacity .3s ease;}#teamBtn .tm-l{transform:translateX(28px);}#teamBtn .tm-r{transform:translateX(-28px);}#teamBtn.nav-active .tm-r{transform:none;opacity:1;transition-delay:.45s;}#teamBtn.nav-active .tm-l{transform:none;opacity:1;transition-delay:.95s;}"
r=[('aria-label="Команда"><defs>','aria-label="Команда"><defs><style>'+css+'</style>'),
('<path d="M5.84 50.45','<g class="tm-ring"><path d="M5.84 50.45'),
('<g transform="translate(60 60) scale(0.88) translate(-60 -60.5)"><circle cx="34" cy="52"','</g><g transform="translate(60 60) scale(0.88) translate(-60 -60.5)"><g class="tm-l"><circle cx="34" cy="52"'),
('<circle cx="86" cy="52"','</g><g class="tm-r"><circle cx="86" cy="52"'),
('<circle cx="60" cy="44"','</g><circle cx="60" cy="44"')]
c=[s.count(a) for a,b in r]
if c!=[1,1,1,1,1]:
    print("ANCHOR_COUNT",c);raise SystemExit
for a,b in r: s=s.replace(a,b)
open(p,"w",encoding="utf-8").write(s);print("PATCHED")
