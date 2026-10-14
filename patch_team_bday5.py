p="public/upmo/upmo-win.js"
s=open(p,encoding="utf-8").read()
r=[('class="bday-card-date" style="white-space:nowrap;"','class="bday-card-date" style="white-space:nowrap;width:68px;text-align:left;flex:0 0 68px;"'),
('style="margin-top:0;white-space:nowrap;"','style="margin-top:0;white-space:nowrap;width:78px;text-align:left;flex:0 0 78px;"')]
c=[s.count(a) for a,b in r]
if c!=[1,1]:
    print("ANCHOR_COUNT",c);raise SystemExit
for a,b in r: s=s.replace(a,b)
open(p,"w",encoding="utf-8").write(s);print("PATCHED")
