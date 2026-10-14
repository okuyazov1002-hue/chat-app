p="public/upmo/upmo-win.js"
s=open(p,encoding="utf-8").read()
r=[('<div class="bday-card" style="width:auto;margin-left:44px;">','<div class="bday-card" style="width:auto;margin-left:36px;padding:4px 12px 4px 28px;">'),
('<div class="bday-card-avatar">\'+av+\'','<div class="bday-card-avatar" style="width:40px;height:40px;font-size:16px;">\'+av+\''),
('<div class="bday-card-date">\'+u.bd+\'</div><div class="bday-card-days">\'+fmtDaysUntil(u.days)+\'</div></div></div>','<div style="display:flex;gap:8px;align-items:baseline;"><div class="bday-card-date">\'+u.bd+\'</div><div class="bday-card-days" style="margin-top:0;">\'+fmtDaysUntil(u.days)+\'</div></div></div></div>')]
c=[s.count(a) for a,b in r]
if c!=[1,1,1]:
    print("ANCHOR_COUNT",c);raise SystemExit
for a,b in r: s=s.replace(a,b)
open(p,"w",encoding="utf-8").write(s);print("PATCHED")
