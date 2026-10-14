import os
pc=[c for c in ["public/upmo/upmo-cal.js","public/upmo-cal.js"] if os.path.exists(c)]
if not pc:
    print("FILE_NOT_FOUND");raise SystemExit
p=pc[0]
s=open(p,encoding="utf-8").read()
a1="if(mode==='m'){"
b1="h+='<div id=\"upmoCalBody\" style=\"flex:1;min-height:0;display:flex;flex-direction:column;'+(window._upmoCalFade?'opacity:0;transform:translateY(6px);':'')+'transition:opacity .22s ease,transform .22s ease;\">';\nif(mode==='m'){"
a2="el.innerHTML=h;"
b2="h+='</div>';el.innerHTML=h;var bd=document.getElementById('upmoCalBody');if(bd&&window._upmoCalFade){window._upmoCalFade=false;requestAnimationFrame(function(){requestAnimationFrame(function(){bd.style.opacity='1';bd.style.transform='none';});});}"
a3="if((window.upmoCalMode||'m')!==md){window.upmoCalMode=md;if(window.upmoPeriod){window.upmoPeriod=null;fire();}}"
b3="if((window.upmoCalMode||'m')!==md){var bd0=document.getElementById('upmoCalBody');if(bd0){bd0.style.opacity='0';bd0.style.transform='translateY(6px)';}setTimeout(function(){window.upmoCalMode=md;if(window.upmoPeriod){window.upmoPeriod=null;fire();}window._upmoCalFade=true;draw();},200);return;}"
c=[s.count(a1),s.count(a2),s.count(a3)]
if c!=[1,1,1]:
    print("ANCHOR_COUNT",c)
else:
    s=s.replace(a1,b1).replace(a2,b2).replace(a3,b3)
    open(p,"w",encoding="utf-8").write(s);print("PATCHED",p)
