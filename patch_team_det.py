p="public/upmo/upmo-win.js"
s=open(p,encoding="utf-8").read()
a1="var us=PERSONNEL.map("
a2="return '<div style=\"position:relative;display:flex;align-items:center;background:#fff;border-radius:10px;height:44px;"
a3="+u.name+'</div></div>';}).join('');"
c=[s.count(a1),s.count(a2),s.count(a3)]
if c!=[1,1,1]:
    print("ANCHOR_COUNT",c);raise SystemExit
det=r'''function det(u){function L(t,v){return v?'<div style="display:flex;gap:8px;padding:3px 0;"><span style="color:#8a94a6;min-width:84px;">'+t+'</span><span style="color:#1f2937;font-weight:600;word-break:break-word;">'+v+'</span></div>':'';}
return '<div style="display:none;margin:-6px 0 0 36px;background:#fff;border-radius:0 0 10px 10px;padding:14px 14px 10px 14px;font-size:11px;box-shadow:0 4px 10px rgba(0,0,0,0.1);">'+L('Отдел',u.department)+L('Должность',u.position)+L('День рождения',u.birthday)+L('Внутр. телефон',u.internalPhone)+L('Моб. телефон',u.mobilePhone)+L('Email',u.email)+'</div>';}
'''
s=s.replace(a1,det+a1)
s=s.replace(a2,"return '<div style=\"flex:0 0 auto;\"><div onclick=\"var d=this.nextSibling;d.style.display=d.style.display===\\'block\\'?\\'none\\':\\'block\\';\" style=\"cursor:pointer;position:relative;display:flex;align-items:center;background:#fff;border-radius:10px;height:44px;")
s=s.replace(a3,"+u.name+'</div></div>'+det(u)+'</div>';}).join('');")
open(p,"w",encoding="utf-8").write(s);print("PATCHED")
