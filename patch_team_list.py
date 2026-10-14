p="public/upmo/upmo-win.js"
s=open(p,encoding="utf-8").read()
r=[("tw.innerHTML=teamBdHtml();","tw.innerHTML=teamBdHtml()+teamListHtml();"),
("border:0;overflow:hidden;","border:0;overflow:auto;")]
a0="var tw=null;"
c=[s.count(a) for a,b in r]+[s.count(a0)]
if c!=[1,1,1]:
    print("ANCHOR_COUNT",c);raise SystemExit
fn='''function teamListHtml(){
var out='';
try{
function rk(u){var pos=String(u.position||'').toLowerCase().trim();var dep=String(u.department||'').toLowerCase();
if(pos.indexOf('заместитель директора')>=0&&pos.indexOf('управлению проектами')>=0){return 2;}
if(pos.indexOf('директор')===0&&pos.indexOf('заместитель')<0){return 1;}
if(pos==='главный инженер'||pos.indexOf('главный инженер дсомк')>=0){return 3;}
if(dep.indexOf('технологический')>=0&&pos.indexOf('начальник отдела')>=0){return 4;}
return 99;}
var us=PERSONNEL.map(function(u,i){return {u:u,i:i,r:rk(u)};}).sort(function(a,b){return a.r-b.r||a.i-b.i;}).map(function(x){return x.u;});
out=us.map(function(u){var av=u.avatar?'<img src="'+u.avatar+'" style="width:100%;height:100%;object-fit:cover;">':'<span>'+(u.name?u.name.charAt(0):'?')+'</span>';
return '<div style="position:relative;display:flex;align-items:center;background:#fff;border-radius:10px;height:44px;margin-left:36px;padding:0 12px 0 36px;box-shadow:0 2px 8px rgba(0,0,0,0.12);box-sizing:border-box;flex:0 0 auto;"><div style="position:absolute;left:-20px;top:50%;transform:translateY(-50%);width:44px;height:44px;border-radius:50%;overflow:hidden;background:#4a9fd8;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;box-sizing:border-box;border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.15);">'+av+'</div><div style="font-size:12px;font-weight:700;color:#1f2937;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">'+u.name+'</div></div>';}).join('');
}catch(e){}
return '<div style="padding:22px 16px 16px 0;display:flex;flex-direction:column;gap:10px;">'+out+'</div>';
}
'''
for a,b in r: s=s.replace(a,b)
s=s.replace(a0,fn+a0,1)
open(p,"w",encoding="utf-8").write(s);print("PATCHED")
