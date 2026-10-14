p="public/upmo/upmo-win.js"
s=open(p,encoding="utf-8").read()
a1="var b=document.getElementById('upmoBtn');if(b){b.classList.add('nav-active');}"
a2="var bt=document.getElementById('upmoBtn');if(bt){bt.classList.remove('nav-active');}"
c=[s.count(a1),s.count(a2)]
if c!=[1,1]:
    print("ANCHOR_COUNT",c);raise SystemExit
b1="var pv=document.querySelector('.buttons button.nav-active');window._upmoPrev=(pv&&pv.id!=='upmoBtn')?pv:null;document.querySelectorAll('.buttons button').forEach(function(x){x.classList.remove('nav-active');});var b=document.getElementById('upmoBtn');if(b){b.classList.add('nav-active');}"
b2="var bt=document.getElementById('upmoBtn');if(bt){bt.classList.remove('nav-active');}if(window._upmoPrev){window._upmoPrev.classList.add('nav-active');window._upmoPrev=null;}"
s=s.replace(a1,b1).replace(a2,b2)
open(p,"w",encoding="utf-8").write(s);print("PATCHED")
