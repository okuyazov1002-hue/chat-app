p="server.js"
s=open(p,encoding="utf-8").read()
a='app.get("/api/prep/summary"'
api='''app.get("/api/proj/summary", async (req, res) => {
  try {
    const code = String(req.query.code || "");
    const rep = await mongoose.connection.db.collection("reports").findOne({ code });
    if (!rep) return res.json({ totalCost: 0, done: 0, plan: 0, remaining: 0 });
    const now = Date.now();
    let tc = 0, dn = 0, pl = 0;
    (rep.rows || []).forEach(function (x) {
      const c = x.cost || 0; tc += c; dn += x.done || 0;
      const a = x.planStart ? new Date(x.planStart).getTime() : null;
      const b = x.planEnd ? new Date(x.planEnd).getTime() : null;
      if (b !== null && b <= now) pl += c;
      else if (a !== null && b !== null && a < now && b > a) pl += c * (now - a) / (b - a);
    });
    res.json({ totalCost: tc, done: dn, plan: Math.round(pl), remaining: Math.max(0, tc - dn) });
  } catch (e) { res.status(500).json({ error: String(e) }); }
});

'''
if s.count(a)!=1:
    print("ANCHOR_COUNT",s.count(a));raise SystemExit
s=s.replace(a,api+a,1)
open(p,"w",encoding="utf-8").write(s)
p2="public/upmo/upmo-win.js"
t=open(p2,encoding="utf-8").read()
b="'</div></div></div>';\n};"
if t.count(b)!=1:
    print("ANCHOR2",t.count(b));raise SystemExit
fetchjs="""'</div></div></div>';
fetch('/api/proj/summary?code='+encodeURIComponent(k.slice(5))).then(function(r){return r.json();}).then(function(d){
var fm=(typeof fmtMoney==='function')?fmtMoney:function(x){return String(x);};
var q=B.querySelector('#upmoPCard');if(!q){return;}
function sv(f,v){var e=q.querySelector('[data-f="'+f+'"]');if(e){e.textContent=fm(Math.round(v||0))+' €';}}
sv('tc',d.totalCost);sv('pl',d.plan);sv('dn',d.done);sv('rm',d.remaining);
}).catch(function(){});
};"""
t=t.replace(b,fetchjs,1)
open(p2,"w",encoding="utf-8").write(t);print("PATCHED")
