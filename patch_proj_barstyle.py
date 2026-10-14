p="public/upmo/upmo-win.js"
s=open(p,encoding="utf-8").read()
r=[("<span style=\"color:#4a90d9;\">'+pp","<span style=\"color:#6b7280;\">'+pp"),
("(dl<0?'#e04b4b':'#2fae6a')","(dl<0?'#d9776f':'#3aa88a')"),
("<span style=\"color:#2fae6a;\">'+fp","<span style=\"color:#1f2937;\">'+fp"),
("height:8px;border-radius:4px;background:#e5e7eb;","height:6px;border-radius:3px;background:#eef0f4;"),
("width:'+fp+'%;background:#4a90d9;","width:'+fp+'%;background:linear-gradient(90deg,#6a5ae0 0%,#4a90d9 50%,#1dd3b0 100%);"),
("background:#e04b4b;\"></div></div>","background:rgba(217,119,111,0.45);\"></div></div>")]
c=[s.count(a) for a,b in r]
if c!=[1]*6:
    print("ANCHOR_COUNT",c);raise SystemExit
for a,b in r: s=s.replace(a,b)
open(p,"w",encoding="utf-8").write(s);print("PATCHED")
