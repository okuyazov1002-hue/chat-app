import subprocess
p="public/upmo/upmo-win.js"
s=open(p,encoding="utf-8").read()
src=None
for name in ["_old/bak/upmo-win.js.bak7","_old/bak/upmo-win.js.bak6"]:
    try:
        t=open(name,encoding="utf-8").read()
    except Exception:
        continue
    if "_upmoLastClose" in t and "upmoMapRestore" in t and "function sec(" in t:
        src=t;print("SRC",name);break
if src is None:
    print("NO_SRC");raise SystemExit
a=src.find("var ov=null")
b=src.find("\nfunction sec(")
chunk=src[a:b]
if not chunk.endswith("}"):
    print("CHUNK_END",chunk[-20:]);raise SystemExit
chunk=chunk[:-1]
m="'</div>';"
tag="mn('Выполнено',dn)+mn('Оплачено',pd)+'</div>';"
i=s.find(tag)
if i<0 or s.count(tag)!=1:
    print("TAG",s.count(tag));raise SystemExit
i+=len(tag)
if not s[i:].startswith("}\nfunction sec("):
    print("TAIL",repr(s[i:i+40]));raise SystemExit
s=s[:i]+"}});\n}).catch(function(){});})();\n};\n"+chunk+s[i:]
open(p,"w",encoding="utf-8").write(s);print("FIXED")
