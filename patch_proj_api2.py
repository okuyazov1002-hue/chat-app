p2="public/upmo/upmo-win.js"
t=open(p2,encoding="utf-8").read()
b="</div></div></div></div>';\n};"
if t.count(b)!=1 or t.count("/api/proj/summary")!=0:
    print("ANCHOR2",t.count(b));raise SystemExit
fetchjs="""</div></div></div></div>';
fetch('/api/proj/summary?code='+encodeURIComponent(k.slice(5))).then(function(r){return r.json();}).then(function(d){
var fm=(typeof fmtMoney==='function')?fmtMoney:function(x){return String(x);};
var q=B.querySelector('#upmoPCard');if(!q){return;}
function sv(f,v){var e=q.querySelector('[data-f="'+f+'"]');if(e){e.textContent=fm(Math.round(v||0))+' €';}}
sv('tc',d.totalCost);sv('pl',d.plan);sv('dn',d.done);sv('rm',d.remaining);
}).catch(function(){});
};"""
t=t.replace(b,fetchjs,1)
open(p2,"w",encoding="utf-8").write(t);print("PATCHED")
