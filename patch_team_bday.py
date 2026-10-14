p="public/upmo/upmo-win.js"
s=open(p,encoding="utf-8").read()
i=s.find("tw.innerHTML='<div style=\"height:90px")
j=s.find("</div>';",i)
a0="var tw=null;"
if i<0 or j<0 or s.count(a0)!=1 or s.count("tw.innerHTML='<div style=\"height:90px")!=1:
    print("ANCHOR",i,j,s.count(a0));raise SystemExit
j+=len("</div>';")
s=s[:i]+"tw.innerHTML=teamBdHtml();"+s[j:]
fn='''function teamBdHtml(){
var cards='';
try{
var today=new Date();today.setHours(0,0,0,0);
var arr=PERSONNEL.filter(function(u){return u.birthday;}).map(function(u){var p=u.birthday.split('.');if(p.length!==3){return null;}var d=parseInt(p[0],10),m=parseInt(p[1],10)-1;var n=new Date(today.getFullYear(),m,d);if(n<today){n=new Date(today.getFullYear()+1,m,d);}return {name:u.name,bd:u.birthday,days:Math.round((n-today)/86400000),avatar:u.avatar||''};}).filter(Boolean);
arr.sort(function(a,b){return a.days-b.days;});
cards=arr.slice(0,3).map(function(u){var av=u.avatar?'<img src="'+u.avatar+'">':'<span>'+u.name.charAt(0)+'</span>';return '<div class="bday-card" style="width:auto;margin-left:44px;"><div class="bday-card-avatar">'+av+'</div><div class="bday-card-info"><div class="bday-card-name">'+u.name+'</div><div class="bday-card-date">'+u.bd+'</div><div class="bday-card-days">'+fmtDaysUntil(u.days)+'</div></div></div>';}).join('');
}catch(e){}
return '<div style="padding:14px 16px 16px 0;background:linear-gradient(135deg,#6A5BD6 0%,#5B94D0 60%,#5FD2B0 100%);box-sizing:border-box;"><div style="margin:0 0 10px 16px;font-size:12px;font-weight:700;color:#fff;">Ближайшие дни рождения</div><div style="display:flex;flex-direction:column;gap:10px;">'+cards+'</div></div>';
}
'''
s=s.replace(a0,fn+a0,1)
open(p,"w",encoding="utf-8").write(s);print("PATCHED")
