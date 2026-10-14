p="public/upmo/upmo-win.js"
s=open(p,encoding="utf-8").read()
r=[('<div class="bday-card-info"><div class="bday-card-name">\'+u.name+\'</div><div style="display:flex;gap:8px;align-items:baseline;"><div class="bday-card-date">','<div class="bday-card-info" style="display:flex;align-items:center;gap:10px;"><div class="bday-card-name" style="margin-bottom:0;flex:1;">\'+u.name+\'</div><div class="bday-card-date" style="white-space:nowrap;">'),
('style="margin-top:0;">\'+fmtDaysUntil(u.days)+\'</div></div></div></div>','style="margin-top:0;white-space:nowrap;">\'+fmtDaysUntil(u.days)+\'</div></div></div>')]
c=[s.count(a) for a,b in r]
if c!=[1,1]:
    print("ANCHOR_COUNT",c);raise SystemExit
for a,b in r: s=s.replace(a,b)
open(p,"w",encoding="utf-8").write(s);print("PATCHED")
