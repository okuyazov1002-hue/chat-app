p="public/upmo/upmo-win.js"
s=open(p,encoding="utf-8").read()
st="return '<div style=\"padding:14px 16px 16px 0;"
en="+cards+'</div></div>';"
i=s.find(st);j=s.find(en,i)
if s.count(st)!=1 or i<0 or j<0:
    print("ANCHOR",s.count(st),i,j);raise SystemExit
j+=len(en)
G="linear-gradient(135deg,#6A5BD6 0%,#5B94D0 60%,#5FD2B0 100%)"
new=("return '<div id=\"teamBd\" style=\"position:relative;padding:14px 16px 16px 0;background:"+G+";box-sizing:border-box;\">"
"<div style=\"margin:0 0 0 16px;font-size:10px;font-weight:700;color:#fff;\">День рождения</div>"
"<div id=\"teamBdBody\" style=\"overflow:hidden;transition:max-height .4s cubic-bezier(.22,1,.36,1);\"><div style=\"display:flex;flex-direction:column;gap:10px;padding-top:10px;\">'+cards+'</div></div>"
"<div id=\"teamBdHandle\" title=\"Свернуть / развернуть\" onclick=\"var b=document.getElementById(\\'teamBdBody\\');var o=b.getAttribute(\\'data-o\\')!==\\'0\\';b.style.maxHeight=b.scrollHeight+\\'px\\';void b.offsetHeight;b.style.maxHeight=o?\\'0px\\':b.scrollHeight+\\'px\\';b.setAttribute(\\'data-o\\',o?\\'0\\':\\'1\\');this.firstChild.style.transform=o?\\'rotate(180deg)\\':\\'none\\';\" "
"style=\"position:absolute;left:50%;bottom:-16px;transform:translateX(-50%);width:48px;height:16px;border-radius:0 0 12px 12px;background:"+G+";cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 8px rgba(0,0,0,0.15);\">"
"<svg width=\"12\" height=\"12\" viewBox=\"0 0 12 12\" style=\"transition:transform .3s;transform:rotate(0deg);\"><path d=\"M2 7 L6 3 L10 7\" fill=\"none\" stroke=\"#fff\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg></div></div>';")
s=s[:i]+new+s[j:]
open(p,"w",encoding="utf-8").write(s);print("PATCHED")
