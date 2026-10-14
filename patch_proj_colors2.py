p="public/upmo/upmo-win.js"
s=open(p,encoding="utf-8").read()
r=[("background:#5a82e6;","background:#4a90d9;"),
("<span style=\"color:#5a82e6;\">'+pp","<span style=\"color:#4a90d9;\">'+pp"),
("<span style=\"color:#1f2937;\">'+fp","<span style=\"color:#1dd3b0;\">'+fp")]
c=[s.count(a) for a,b in r]
if c!=[1,1,1]:
    print("ANCHOR_COUNT",c);raise SystemExit
for a,b in r: s=s.replace(a,b)
open(p,"w",encoding="utf-8").write(s);print("PATCHED")
