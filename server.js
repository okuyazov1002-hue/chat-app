require("dotenv").config();
const express = require("express");
const ExcelJS = require("exceljs");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const mongoose = require("mongoose");
const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB подключена"))
  .catch(err => console.error("❌ Ошибка MongoDB:", err.message));

app.use(express.json());
const session=require('express-session');
const cm=require('connect-mongo');const MongoStore=cm.MongoStore||cm.default||cm;
const bcrypt=require('bcryptjs');
app.set('trust proxy',1);
app.use(function(req,res,next){var h=String(req.headers.host||'').toLowerCase().split(':')[0];if(h==='dsomk.online'||h==='www.dsomk.online'){return res.redirect(301,'https://upmo.uz'+req.originalUrl);}next();});
app.use(session({secret:process.env.SESSION_SECRET,resave:false,saveUninitialized:false,store:MongoStore.create({mongoUrl:process.env.MONGODB_URI}),cookie:{httpOnly:true,sameSite:'lax',secure:'auto',maxAge:1000*60*60*12}}));
app.use('/api',(req,res,next)=>{
  if(req.path=='/login'||req.path=='/logout') return next();
  if(req.session.user==null) return res.status(401).json({error:'unauthorized'});
  next();
});
app.use(express.static("public"));

app.post('/api/login', async (req, res) => {
  try {
    const u = String((req.body && req.body.username) || '').trim();
    const pw = String((req.body && req.body.password) || '');
    const user = await mongoose.connection.db.collection('users').findOne({ username: u });
    const ok = user ? await bcrypt.compare(pw, user.password) : false;
    if (ok == false) return res.status(401).json({ error: 'bad credentials' });
    req.session.user = user.username;
    res.json({ message: 'OK' });
  } catch (err) { res.status(500).json({ error: 'server' }); }
});

app.get('/api/me', async (req, res) => {
  try {
    if (req.session.user == null) return res.status(401).json({ error: 'unauthorized' });
    const user = await mongoose.connection.db.collection('users').findOne({ username: req.session.user });
    if (user == null) return res.status(401).json({ error: 'unauthorized' });
    res.json({ name: user.name, login: user.username, avatar: user.avatar || '', role: user.role || 'user' });
  } catch (err) { res.status(500).json({ error: 'server' }); }
});

// ===== DASH FROM PREP GRID (single source: prep_grid) =====
function pgNum(v){if(v===null||v===undefined||v===''){return null;}var s=String(v).replace(/[\s\u00a0]/g,'').replace(',','.');if(s===''||isNaN(Number(s))){return null;}return Number(s);}
function pgIso(v){var s=String(v||'');return /^\d{4}-\d{2}-\d{2}/.test(s)?s.slice(0,10):null;}
function pgDay(s){return s?Date.parse(s+'T00:00:00Z'):NaN;}
function pgMk(ms){var d=new Date(ms);return d.getUTCFullYear()+'-'+String(d.getUTCMonth()+1).padStart(2,'0');}
function pgBuild(D){
  var out={objs:[],mob:{labels:[],plan:[],fact:[]},updatedAt:null,updatedBy:null,basic:{},rows:{}};
  if(!D||!D.t){return out;}
  var B=D.t.Basic,T=D.t.Cost,Mo=D.t.Mobilization;
  var DT=[' (\u0414\u0430\u0442\u0430)'];
  var EXT='\u0412\u043d\u0435\u0448\u043d\u0438\u0439';
  if(B&&B.c){
    var ic=B.c.indexOf('Code'),is=B.c.indexOf('Start'),ie=B.c.indexOf('Finish'),icn=B.c.indexOf('Contractor'),idc=B.c.indexOf('Discipline'),iq=B.c.indexOf('Quantity'),iaq=B.c.indexOf('Actual Q'),icost=B.c.indexOf('Cost'),iac=B.c.indexOf('Actual Cost'),idsc=B.c.indexOf('Work Type'),iun=B.c.indexOf('UOM');
    (B.r||[]).forEach(function(r){var c=r[ic];if(!c){return;}var o=out.basic[c];if(!o){o={s:null,e:null,n:0,ext:0,disc:{},gm:{}};out.rows[c]=[];out.basic[c]=o;}o.n++;if(String(r[icn]||'').indexOf(EXT)===0){o.ext++;}var s=pgIso(r[is]),e=pgIso(r[ie]);if(s&&(!o.s||s<o.s)){o.s=s;}if(e&&(!o.e||e>o.e)){o.e=e;}var gk=(r[idc]||'')+'|'+(s||'')+'|'+(e||'');var gg=o.gm[gk];if(!gg){gg={disc:r[idc]||'',cost:0,done:0,s:s,e:e};o.gm[gk]=gg;out.rows[c].push(gg);}gg.cost+=pgNum(r[icost])||0;gg.done+=pgNum(r[iac])||0;if(r[idc]){o.disc[r[idc]]=1;}});
  }
  if(T&&T.c){
    var tot=T.tot||{},tot0=T.tot0||{},st=T.st||{};
    T.c.forEach(function(c,j){
      if(j<1||/ \(/.test(c)||/^\d+$/.test(c)){return;}
      var dj=T.c.indexOf(c+DT[0]),f=0,fm={};
      (T.r||[]).forEach(function(r){var v=pgNum(r[j]);if(v===null){return;}f+=v;var d=dj>0?pgIso(r[dj]):null;var m=d?d.slice(0,7):(pgIso(r[0])||'').slice(0,7);if(m){fm[m]=(fm[m]||0)+v;}});
      var t=pgNum(tot[c]);if(t===null){t=0;}
      if(st[c]==='Completed'&&tot0[c]!==undefined&&f>0){t=f;}
      var b=out.basic[c]||{s:null,e:null,n:0,ext:0,disc:{}};
      var o={code:c,group:c.split('-')[0],cost:t,done:f,fm:fm,s:b.s,e:b.e,n:b.n,disc:Object.keys(b.disc),ext:b.n>0&&b.ext===b.n,status:st[c]||''};
      out.objs.push(o);
    });
  }
  if(Mo&&Mo.r){Mo.r.forEach(function(r){var m=pgIso(r[0]);if(!m){return;}out.mob.labels.push(m.slice(0,7));var p=pgNum(r[1]),a=pgNum(r[2]);out.mob.plan.push(p===null?0:p);out.mob.fact.push(a===null?null:a);});}
  for(var bc in out.basic){delete out.basic[bc].gm;}
  return out;
}
var PGC={v:null,t:0,p:null},PGB={v:null,t:0,p:null};
async function pgSave(s,rev,by){var D=JSON.parse(s);var out=pgBuild(D);out.updatedAt=new Date().toISOString();out.updatedBy=by||null;var rows=out.rows;delete out.rows;PGC.v=out;PGC.t=Date.now();PGC.p=null;PGB.v=rows;PGB.t=Date.now();PGB.p=null;var db=mongoose.connection.db;await db.collection('prep_calc').updateOne({_id:'main'},{$set:{rev:rev,out:out}},{upsert:true});await db.collection('prep_calc_b').updateOne({_id:'main'},{$set:{rev:rev,rows:rows}},{upsert:true});}
async function pgLoadB(){
  if(PGB.v&&Date.now()-PGB.t<10000){return PGB.v;}
  if(PGB.p){return PGB.p;}
  PGB.p=(async function(){var db=mongoose.connection.db;var c=await db.collection('prep_calc_b').findOne({_id:'main'});var rows=c&&c.rows?c.rows:null;if(!rows){var doc=await db.collection('prep_grid').findOne({_id:'main'});var D=null;try{D=doc&&doc.data?JSON.parse(doc.data):null;}catch(e){D=null;}rows=pgBuild(D&&D.t?D:{t:{}}).rows;}PGB.v=rows;PGB.t=Date.now();return rows;})().then(function(v){PGB.p=null;return v;},function(e){PGB.p=null;throw e;});
  return PGB.p;
}
async function pgLoad(){
  if(PGC.v&&Date.now()-PGC.t<10000){return PGC.v;}
  if(PGC.p){return PGC.p;}
  PGC.p=(async function(){
    var db=mongoose.connection.db;
    var c=await db.collection('prep_calc').findOne({_id:'main'});
    var out=c&&c.out?c.out:null;
    if(!out){var doc=await db.collection('prep_grid').findOne({_id:'main'});var D=null;try{D=doc&&doc.data?JSON.parse(doc.data):null;}catch(e){D=null;}out=pgBuild(D&&D.t?D:{t:{}});out.updatedAt=doc&&doc.updatedAt?new Date(doc.updatedAt).toISOString():null;out.updatedBy=doc?doc.by:null;var rws=out.rows;delete out.rows;PGB.v=rws;PGB.t=Date.now();try{await db.collection('prep_calc').updateOne({_id:'main'},{$set:{rev:doc?(doc.rev||0):0,out:out}},{upsert:true});await db.collection('prep_calc_b').updateOne({_id:'main'},{$set:{rev:doc?(doc.rev||0):0,rows:rws}},{upsert:true});}catch(e){}}
    PGC.v=out;PGC.t=Date.now();return out;
  })().then(function(v){PGC.p=null;return v;},function(e){PGC.p=null;throw e;});
  return PGC.p;
}
function pgPlanNow(o,nowMs){if(!(o.cost>0)){return 0;}var s=pgDay(o.s),e=pgDay(o.e);if(isNaN(s)||isNaN(e)||e<=s){return 0;}var f=nowMs<=s?0:(nowMs>=e?1:(nowMs-s)/(e-s));return o.cost*f;}
function pgPlanMonths(o){var r={};if(!(o.cost>0)){return r;}var s=pgDay(o.s),e=pgDay(o.e);if(isNaN(s)||isNaN(e)||e<=s){return r;}var tot=e-s,d=new Date(s);d.setUTCDate(1);while(d.getTime()<e){var a=Math.max(d.getTime(),s);var nx=new Date(d.getTime());nx.setUTCMonth(nx.getUTCMonth()+1);var b=Math.min(nx.getTime(),e);if(b>a){r[pgMk(d.getTime())]=(r[pgMk(d.getTime())]||0)+o.cost*(b-a)/tot;}d=nx;}return r;}
function pgFilter(list,type){list=list.filter(function(o){return o.cost>0;});if(type==='int'){return list.filter(function(o){return !o.ext;});}if(type==='ext'){return list.filter(function(o){return o.ext;});}return list;}
function pgObj(o,nowMs,u){var plan=pgPlanNow(o,nowMs);var planPct=o.cost>0?Math.min(100,Math.round(plan/o.cost*100)):0;var factPct=o.cost>0?Math.min(100,Math.round(o.done/o.cost*100)):0;var delta=null,fe=null;if(o.s&&o.e){var dur=(pgDay(o.e)-pgDay(o.s))/86400000;delta=Math.round((planPct-factPct)/100*dur);fe=new Date(pgDay(o.e)+delta*86400000).toISOString();}return {code:o.code,nrows:o.n,cost:o.cost,done:o.done,paid:o.done,workType:o.disc.join(', '),remDone:o.cost-o.done,remPaid:o.cost-o.done,start:o.s?new Date(pgDay(o.s)).toISOString():null,end:fe||(o.e?new Date(pgDay(o.e)).toISOString():null),planEnd:o.e?new Date(pgDay(o.e)).toISOString():null,forecastEnd:fe,deltaDays:delta,planPct:planPct,factPct:factPct,delta:factPct-planPct,internalCost:o.ext?0:o.cost,externalCost:o.ext?o.cost:0,updatedAt:u.updatedAt,updatedBy:u.updatedBy,_plan:plan};}
app.get('/api/prep/objects',async function(req,res){try{var g=await pgLoad(),now=Date.now(),list=req.query.type==='int'?g.objs.filter(function(o){return !o.ext;}):(req.query.type==='ext'?g.objs.filter(function(o){return o.ext;}):g.objs);var out=list.map(function(o){var x=pgObj(o,now,g);delete x._plan;return x;}).filter(function(x){return x.cost>0||x.done>0||x.nrows>0;});out.sort(function(a,b){return a.code.localeCompare(b.code);});res.json(out);}catch(e){res.status(500).json({message:String(e.message||e)});}});
app.get('/api/prep/summary',async function(req,res){try{var g=await pgLoad(),now=Date.now(),all=pgFilter(g.objs,req.query.type);var S=function(l,f){return l.reduce(function(s,o){return s+f(o);},0);};var tc=S(all,function(o){return o.cost;}),dn=S(all,function(o){return o.done;}),pl=S(all,function(o){return pgPlanNow(o,now);});var ints=all.filter(function(o){return !o.ext;}),exts=all.filter(function(o){return o.ext;});var ic=S(ints,function(o){return o.cost;}),ec=S(exts,function(o){return o.cost;}),idn=S(ints,function(o){return o.done;}),edn=S(exts,function(o){return o.done;});var pp=function(l,c){return c>0?Math.min(100,Math.round(S(l,function(o){return pgPlanNow(o,now);})/c*100)):0;};res.json({totalCost:tc,internal:ic,external:ec,done:dn,remaining:tc-dn,internalDone:idn,internalRemaining:ic-idn,externalDone:edn,externalRemaining:ec-edn,planPct:tc>0?Math.min(100,Math.round(pl/tc*100)):0,internalPlanPct:pp(ints,ic),externalPlanPct:pp(exts,ec)});}catch(e){res.status(500).json({message:String(e.message||e)});}});
app.get('/api/prep/scurve',async function(req,res){try{var g=await pgLoad(),now=Date.now(),list=pgFilter(g.objs,req.query.type);if(req.query.code){list=list.filter(function(o){return o.code===req.query.code;});}var pm={},fm={},keys={},total=0;list.forEach(function(o){var p=pgPlanMonths(o);for(var k in p){pm[k]=(pm[k]||0)+p[k];keys[k]=1;total+=p[k];}for(var q in o.fm){fm[q]=(fm[q]||0)+o.fm[q];keys[q]=1;}});var ks=Object.keys(keys).sort();if(ks.length){var a=ks[0],b=ks[ks.length-1],y=+a.slice(0,4),m=+a.slice(5,7),all=[];while(true){var k=y+'-'+String(m).padStart(2,'0');all.push(k);if(k>=b){break;}m++;if(m>12){m=1;y++;}}ks=all;}var nk=pgMk(now);total=total||1;var cp=0,cf=0,labels=[],planPer=[],factPer=[],planCum=[],factCum=[],planAmt=[],factAmt=[];ks.forEach(function(k){var p=pm[k]||0,f=fm[k]||0;cp+=p;cf+=f;labels.push(k);planPer.push(Math.round(p/total*1000)/10);planAmt.push(Math.round(p));factAmt.push(k<=nk?Math.round(f):null);factPer.push(k<=nk?Math.round(f/total*1000)/10:null);planCum.push(Math.round(cp/total*100));factCum.push(k<=nk?Math.round(cf/total*100):null);});res.json({labels:labels,planPer:planPer,factPer:factPer,planCum:planCum,factCum:factCum,planAmt:planAmt,factAmt:factAmt});}catch(e){res.status(500).json({message:String(e.message||e)});}});
app.get('/api/prep/mobilization',async function(req,res){try{var g=await pgLoad(),m=g.mob;res.json({labels:m.labels.map(function(k){return k.slice(5,7);}),years:m.labels.map(function(k){return k.slice(0,4);}),plan:m.plan,fact:m.fact});}catch(e){res.status(500).json({message:String(e.message||e)});}});
app.get('/api/map-status',async function(req,res){try{var g=await pgLoad(),out={},grp={};g.objs.filter(function(o){return o.cost>0;}).forEach(function(o){var a=grp[o.group]=grp[o.group]||{cost:0,done:0};a.cost+=o.cost;a.done+=o.done;});var one=function(c,d){var st='none';if(c>0&&d>=c*0.999){st='done';}else if(d>0){st='active';}return {status:st,pct:c>0?Math.round(d/c*1000)/10:0};};g.objs.forEach(function(o){out[o.code]=one(o.cost,o.done);});for(var k in grp){out[k]=one(grp[k].cost,grp[k].done);}res.json(out);}catch(e){res.status(500).json({error:'server'});}});
app.get('/api/prep/object/:code/term',async function(req,res){try{var g=await pgLoad(),o=g.objs.filter(function(x){return x.code===req.params.code;})[0],now=Date.now();if(!o||!o.s||!o.e){return res.json({start:null,end:null,forecast:null,delay:0});}var s=pgDay(o.s),e=pgDay(o.e),delay=0;if(o.cost>0&&o.done<o.cost*0.999){var df=s+(o.done/o.cost)*(e-s);delay=Math.max(0,Math.round((now-df)/86400000));}res.json({start:new Date(s).toISOString(),end:new Date(e).toISOString(),forecast:new Date(e+delay*86400000).toISOString(),delay:delay});}catch(e){res.status(500).json({message:String(e.message||e)});}});
app.get('/api/map-object/:code',async function(req,res){try{var g=await pgLoad(),RB=await pgLoadB(),now=Date.now(),code=req.params.code,list=g.objs.filter(function(o){return o.cost>0&&(o.code===code||o.group===code);});if(!list.length){return res.json({has:false,totalCost:0,done:0,paid:0,planPct:0,factPct:0,stages:[]});}var tc=0,dn=0,pl=0,st=null,en=null;list.forEach(function(o){tc+=o.cost;dn+=o.done;pl+=pgPlanNow(o,now);if(o.s&&(!st||o.s<st)){st=o.s;}if(o.e&&(!en||o.e>en)){en=o.e;}});var planPct=tc>0?Math.min(100,Math.round(pl/tc*100)):0,factPct=tc>0?Math.round(dn/tc*1000)/10:0;var fe=null,dl=null;if(st&&en){var dur=(pgDay(en)-pgDay(st))/86400000;dl=Math.round((planPct-Math.min(100,Math.round(dn/(tc||1)*100)))/100*dur);fe=new Date(pgDay(en)+dl*86400000).toISOString();}var groups={};list.forEach(function(o){var br=RB[o.code];if(!br){return;}br.forEach(function(r){var n=r.disc||'-';var x=groups[n]=groups[n]||{name:n,cost:0,done:0,paid:0,s:null,e:null,plan:0};x.cost+=r.cost;x.done+=r.done;x.paid+=r.done;if(r.s&&(!x.s||r.s<x.s)){x.s=r.s;}if(r.e&&(!x.e||r.e>x.e)){x.e=r.e;}x.plan+=pgPlanNow({cost:r.cost,s:r.s,e:r.e},now);});});var stages=Object.keys(groups).map(function(k){var x=groups[k];var pp=x.cost>0?Math.min(100,Math.round(x.plan/x.cost*100)):0;return {name:x.name,cost:x.cost,done:x.done,paid:x.paid,planPct:pp,factPct:x.cost>0?Math.round(x.done/x.cost*1000)/10:0,start:x.s?new Date(pgDay(x.s)).toISOString():null,end:x.e?new Date(pgDay(x.e)).toISOString():null,forecastEnd:null,deltaDays:null};});res.json({has:true,totalCost:tc,done:dn,paid:dn,planPct:planPct,factPct:factPct,updatedAt:g.updatedAt,start:st?new Date(pgDay(st)).toISOString():null,end:en?new Date(pgDay(en)).toISOString():null,forecastEnd:fe,deltaDays:dl,stages:stages});}catch(e){res.status(500).json({error:'server'});}});
setTimeout(function(){pgLoad().catch(function(){});},4000);
app.get('/api/prep/rev',async function(req,res){try{var g=await pgLoad();res.json({rev:g.updatedAt||null});}catch(e){res.status(500).json({error:String(e.message||e)});}});
// ===== /DASH FROM PREP GRID =====

app.post('/api/logout', (req, res) => {
  req.session.destroy(() => { res.clearCookie('connect.sid'); res.json({ message: 'OK' }); });
});

// Сводка по проекту: общая стоимость, выполнено, оплачено
const STAGES_6 = ["Базовое проектирование","Детальное проектирование","Изготовление","Логистика","Строительство","ПНР"];
const STAGES_5 = ["Базовое проектирование","Детальное проектирование","Поставка","Строительство","ПНР"];
const STAGES_6_CODES = ["PSP01","CSM01"];
function getStagesForCode(code) {
  return STAGES_6_CODES.includes(code) ? STAGES_6 : STAGES_5;
}
const STAGES = STAGES_6;

function calcStageDates(rows, stCost, stDone, stPlanPct) {
  const starts = rows.map(r => r.planStart).filter(Boolean).sort((a, b) => new Date(a) - new Date(b));
  const ends = rows.map(r => r.forecastEnd || r.planEnd).filter(Boolean).sort((a, b) => new Date(a) - new Date(b));
  const start = starts.length ? starts[0] : null;
  const end = ends.length ? ends[ends.length - 1] : null;
  let forecastEnd = null, deltaDays = null;
  if (start && end) {
    const totalDur = (new Date(end) - new Date(start)) / 86400000;
    const factPct = stCost ? Math.min(100, Math.round(stDone / stCost * 100)) : 0;
    deltaDays = Math.round((stPlanPct - factPct) / 100 * totalDur);
    forecastEnd = new Date(new Date(end).getTime() + deltaDays * 86400000);
  }
  return { start, end, forecastEnd, deltaDays };
}
function calcPlanPct(rows, totalCost) {
  if (!totalCost) return 0;
  const today = new Date();
  let planNow = 0;
  rows.forEach(r => {
    if (!r.planStart) return;
    const rs = new Date(r.planStart);
    const end = r.forecastEnd || r.planEnd;
    const re = end ? new Date(end) : today;
    if (today >= re) planNow += r.cost || 0;
    else if (today > rs) {
      const t = (today - rs) / (re - rs);
      planNow += (r.cost || 0) * t;
    }
  });
  return Math.min(100, Math.round(planNow / totalCost * 100));
}
function nowMonthKey() {
  const now = new Date();
  return now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0");
}
function costCurveTodayPct(value) {
  if (!value || !value.labels || !value.labels.length) return null;
  const planPer = value.planPer || [];
  const factPer = value.factPer || [];
  const total = planPer.reduce((s, x) => s + (x || 0), 0);
  if (!total) return null;
  const nowKey = nowMonthKey();
  let cp = 0, cf = 0;
  value.labels.forEach((k, i) => {
    if (k <= nowKey) { cp += planPer[i] || 0; cf += factPer[i] || 0; }
  });
  return { planPct: Math.min(100, Math.round(cp / total * 100)), factPct: Math.min(100, Math.round(cf / total * 100)) };
}
function aggCostCurvePct(docs) {
  const byMonth = {};
  let total = 0;
  docs.forEach(doc => {
    const v = doc.value || {};
    const labels = v.labels || [];
    const planPer = v.planPer || [];
    const factPer = v.factPer || [];
    labels.forEach((k, i) => {
      byMonth[k] = byMonth[k] || { plan: 0, fact: 0 };
      byMonth[k].plan += planPer[i] || 0;
      byMonth[k].fact += factPer[i] || 0;
    });
    total += (planPer.reduce((s, x) => s + (x || 0), 0));
  });
  if (!total) return { planPct: 0, factPct: 0 };
  const nowKey = nowMonthKey();
  const keys = Object.keys(byMonth).sort();
  let cp = 0, cf = 0;
  keys.forEach(k => {
    if (k <= nowKey) { cp += byMonth[k].plan; cf += byMonth[k].fact; }
  });
  return { planPct: Math.min(100, Math.round(cp / total * 100)), factPct: Math.min(100, Math.round(cf / total * 100)) };
}

app.get("/api/reports/list", async (req, res) => {
  try {
    const codes = (req.query.codes || "").split(",").map(c => c.trim()).filter(Boolean);
    const reports = await mongoose.connection.db.collection("reports").find({ code: { $in: codes } }).toArray();
    const byCode = {};
    reports.forEach(r => { byCode[r.code] = r; });
    const result = codes.map(code => {
      const r = byCode[code];
      if (!r || !r.rows) {
        return { code, cost: 0, done: 0, planPct: 0, factPct: 0, updatedAt: null, updatedBy: null };
      }
      const cost = r.rows.reduce((s, x) => s + (x.cost || 0), 0);
      const done = r.rows.reduce((s, x) => s + (x.done || 0), 0);
      const planPct = calcPlanPct(r.rows, cost);
      const factPct = cost ? Math.min(100, Math.round(done / cost * 100)) : 0;
      return { code, cost, done, planPct, factPct, updatedAt: r.updatedAt || null, updatedBy: r.updatedBy || null };
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера: " + err.message });
  }
});
app.get("/api/reports/:code/summary", async (req, res) => {
  try {
    const stagesList = getStagesForCode(req.params.code);
    const report = await mongoose.connection.db.collection("reports").findOne({ code: req.params.code });
    if (!report || !report.rows) {
      return res.json({ totalCost: 0, done: 0, paid: 0, planPct: 0, stages: stagesList.map(name => ({ name, cost: 0, done: 0, paid: 0, planPct: 0 })) });
    }
    const totalCost = report.rows.reduce((s, r) => s + (r.cost || 0), 0);
    const done = report.rows.reduce((s, r) => s + (r.done || 0), 0);
    const paid = report.rows.reduce((s, r) => s + (r.costFact || 0), 0);
    const planPct = calcPlanPct(report.rows, totalCost);

    const stages = stagesList.map(name => {
      const rows = report.rows.filter(r => r.stage === name);
      const stCost = rows.reduce((s, r) => s + (r.cost || 0), 0);
      const stDone = rows.reduce((s, r) => s + (r.done || 0), 0);
      const stPlanPct = calcPlanPct(rows, stCost);
      const dates = calcStageDates(rows, stCost, stDone, stPlanPct);
      return {
        name,
        cost: stCost,
        done: stDone,
        paid: rows.reduce((s, r) => s + (r.costFact || 0), 0),
        planPct: stPlanPct,
        start: dates.start,
        end: dates.end,
        forecastEnd: dates.forecastEnd,
        deltaDays: dates.deltaDays
      };
    });

    const starts = report.rows.map(r => r.planStart).filter(Boolean).sort((a, b) => new Date(a) - new Date(b));
    const ends = report.rows.map(r => r.forecastEnd || r.planEnd).filter(Boolean).sort((a, b) => new Date(a) - new Date(b));
    const start = starts.length ? starts[0] : null;
    const end = ends.length ? ends[ends.length - 1] : null;

    let forecastEnd = null;
    let deltaDays = null;
    if (start && end) {
      const totalDur = (new Date(end) - new Date(start)) / 86400000;
      const factPct = totalCost ? Math.min(100, Math.round(done / totalCost * 100)) : 0;
      deltaDays = Math.round((planPct - factPct) / 100 * totalDur);
      forecastEnd = new Date(new Date(end).getTime() + deltaDays * 86400000);
    }

    res.json({ totalCost, done, paid, planPct, stages, start, end, forecastEnd, deltaDays });
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера: " + err.message });
  }
});

function filterByType(rows, type) {
  if (type == "int") return rows.filter(x => x.contractor && x.contractor.includes("Внутренний"));
  if (type == "ext") return rows.filter(x => x.contractor === "Внешний");
  return rows;
}
app.get("/api/prep/object/:code/worklist", async (req, res) => {
  try {
    const report = await mongoose.connection.db.collection("reports").findOne({ code: req.params.code });
    if (!report || !report.rows) return res.json([]);
    const groups = {};
    report.rows.forEach(r => {
      const key = (r.item || "—") + "||" + (r.uom || "");
      if (!groups[key]) {
        groups[key] = { item: r.item || "—", uom: r.uom || "", quantity: 0, actualQuantity: 0, cost: 0, done: 0 };
      }
      groups[key].quantity += r.quantity || 0;
      groups[key].actualQuantity += r.actualQuantity || 0;
      groups[key].cost += r.cost || 0;
      groups[key].done += r.done || 0;
    });
    const result = Object.values(groups).map(g => ({
      ...g,
      factPct: g.cost ? Math.min(100, Math.round(g.done / g.cost * 100)) : 0
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера: " + err.message });
  }
});
app.get("/api/prep/object/:code/rows", async (req, res) => {
  try {
    const report = await mongoose.connection.db.collection("reports").findOne({ code: req.params.code });
    if (!report || !report.rows) return res.json([]);
    const result = report.rows.map(r => {
      const remDone = (r.cost || 0) - (r.done || 0);
      const remPaid = (r.cost || 0) - (r.costFact || 0);
      const factPct = r.cost ? Math.min(100, Math.round((r.done || 0) / r.cost * 100)) : 0;
      let planPct = 0;
      if (r.planStart) {
        const rs = new Date(r.planStart);
        const end = r.forecastEnd || r.planEnd;
        const re = end ? new Date(end) : new Date();
        const today = new Date();
        if (today >= re) planPct = 100;
        else if (today > rs) planPct = Math.round((today - rs) / (re - rs) * 100);
      }
      let deltaDays = null;
      if (r.planStart && (r.forecastEnd || r.planEnd)) {
        const start = new Date(r.planStart);
        const end = new Date(r.forecastEnd || r.planEnd);
        const totalDur = (end - start) / 86400000;
        deltaDays = Math.round((planPct - factPct) / 100 * totalDur);
      }
      return {
        item: r.item, contractor: r.contractor, cost: r.cost || 0, done: r.done || 0, remDone,
        paid: r.costFact || 0, remPaid, start: r.planStart, end: r.planEnd,
        forecastEnd: r.forecastEnd, deltaDays, planPct, factPct
      };
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера: " + err.message });
  }
});
function cellNum(cell){
  const v = cell.value;
  if (v == null) return 0;
  if (typeof v === "object" && v.result != null) return Number(v.result) || 0;
  return Number(v) || 0;
}
app.post("/api/prep/import", upload.single("file"), async (req, res) => {
  try {
    if (req.file == null) return res.status(400).json({ message: "Файл не найден" });
    const wb = new ExcelJS.Workbook();
    await wb.xlsx.load(req.file.buffer);
    const basicSheet = wb.getWorksheet("Basic");
    if (basicSheet == null) return res.status(400).json({ message: "Лист Basic не найден" });
    const totalSheet = wb.getWorksheet("Total");
    const datesByCode = {};
    if (totalSheet != null) {
      totalSheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return;
        const code = row.getCell(1).value;
        if (code == null || code === "") return;
        datesByCode[code] = {
          start: row.getCell(4).value || null,
          end: row.getCell(5).value || null,
          contractor: row.getCell(2).value || "",
          totalCost: Number(row.getCell(8).value) || 0,
          totalDone: Number(row.getCell(9).value) || 0
        };
      });
    }
    const byCode = {};
    basicSheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;
      const code = row.getCell(1).value;
      if (code == null || code === "") return;
      byCode[code] = byCode[code] || [];
      const actualCost = cellNum(row.getCell(12));
      const dates = datesByCode[code] || {};
      byCode[code].push({
        project: String(row.getCell(3).value || ""),
        stage: row.getCell(4).value || "",
        item: row.getCell(5).value || "",
        uom: row.getCell(6).value || "",
        quantity: cellNum(row.getCell(7)),
        actualQuantity: cellNum(row.getCell(8)),
        obj: "",
        equip: "",
        contractor: row.getCell(2).value || "",
        currency: "",
        planStart: row.getCell(13).value || dates.start || null,
        planEnd: row.getCell(14).value || dates.end || null,
        factStart: null,
        factEnd: null,
        forecastEnd: null,
        cost: Number(row.getCell(11).value) || 0,
        costVat: 0,
        costFact: actualCost,
        done: actualCost,
        status: actualCost > 0 ? "Выполняется" : "Не начато",
        mhPlan: Number(row.getCell(9).value) || 0,
        mhFact: cellNum(row.getCell(10)),
        eqPlan: 0,
        eqFact: 0
      });
    });
    Object.keys(datesByCode).forEach(code => {
      if (byCode[code] == null || byCode[code].length === 0) {
        const info = datesByCode[code];
        byCode[code] = [{
          stage: "", item: "Итого", obj: "", equip: "",
          contractor: info.contractor || "", currency: "",
          planStart: info.start || null, planEnd: info.end || null,
          factStart: null, factEnd: null, forecastEnd: null,
          cost: info.totalCost || 0, costVat: 0,
          costFact: info.totalDone || 0, done: info.totalDone || 0,
          status: (info.totalDone || 0) > 0 ? "Выполняется" : "Не начато",
          mhPlan: 0, mhFact: 0, eqPlan: 0, eqFact: 0
        }];
      }
    });
    const results = [];
    const stageParam = req.query.stage || null;
    for (const code of Object.keys(byCode)) {
      const totalInfo = datesByCode[code] || {};
      let finalRows = byCode[code];
      if (stageParam) {
        finalRows = finalRows.map(r => Object.assign({}, r, { stage: stageParam }));
        const existingDoc = await mongoose.connection.db.collection("reports").findOne({ code });
        const otherStageRows = (existingDoc && existingDoc.rows) ? existingDoc.rows.filter(r => r.stage !== stageParam) : [];
        finalRows = otherStageRows.concat(finalRows);
      }
      await mongoose.connection.db.collection("reports").updateOne(
        { code },
        { $set: {
            code, rows: finalRows, updatedAt: new Date(),
            updatedBy: await (async function(){try{var _u=await mongoose.connection.db.collection("users").findOne({username:req.session.user});return (_u&&(_u.name||_u.fullName||_u.username))||req.session.user||"";}catch(e){return req.session.user||"";}})(),
            totalCost: totalInfo.totalCost || 0,
            totalDone: totalInfo.totalDone || 0,
            contractorType: totalInfo.contractor || ""
          }
        },
        { upsert: true }
      );
      results.push({ code, status: "обновлено (" + byCode[code].length + " строк)" });
    }
    const mobSheet = wb.getWorksheet("Mobilization");
    if (mobSheet != null) {
      const mobPrimaryCode = Object.keys(byCode)[0];
      const labels = [], plan = [], fact = [];
      mobSheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return;
        const dateVal = row.getCell(1).value;
        if (dateVal == null) return;
        const d = new Date(dateVal);
        labels.push(d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0"));
        plan.push(cellNum(row.getCell(2)));
        fact.push(cellNum(row.getCell(3)));
      });
      await mongoose.connection.db.collection("data").updateOne(
        { _id: "prep_mobilization_" + (mobPrimaryCode || "unknown") },
        { $set: { code: mobPrimaryCode || null, value: { labels, plan, fact }, updatedAt: new Date() } },
        { upsert: true }
      );
      results.push({ code: "Mobilization", status: "сохранено (" + labels.length + " месяцев)" });
    }

    const costSheet2 = wb.getWorksheet("Cost");
    if (costSheet2 != null) {
      const primaryCode = Object.keys(byCode)[0];
      const labels = [], planCum = [], factCum = [], planPer = [], factPer = [];
      costSheet2.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return;
        const dateVal = row.getCell(1).value;
        if (dateVal == null) return;
        const d = new Date(dateVal);
        labels.push(d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0"));
        planCum.push(cellNum(row.getCell(2)));
        factCum.push(cellNum(row.getCell(3)));
        planPer.push(cellNum(row.getCell(4)));
        factPer.push(cellNum(row.getCell(5)));
      });
      let contractorTag = "—";
      if (primaryCode) {
        const codeRows = byCode[primaryCode] || [];
        const hasInternal = codeRows.some(r => r.contractor && r.contractor.includes("Внутренний"));
        const hasExternal = codeRows.some(r => r.contractor === "Внешний");
        contractorTag = hasInternal && hasExternal ? "Смешанный" : (hasInternal ? "Внутренний" : (hasExternal ? "Внешний" : "—"));
      }
      await mongoose.connection.db.collection("data").updateOne(
        { _id: "prep_cost_curve_" + (primaryCode || "unknown") },
        { $set: { code: primaryCode || null, contractor: contractorTag, value: { labels, planCum, factCum, planPer, factPer }, updatedAt: new Date() } },
        { upsert: true }
      );
      results.push({ code: "Cost", status: "сохранено (" + labels.length + " месяцев)" });
    }

    res.json({ results });
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера: " + err.message });
  }
});
app.get("/api/prep/export", async (req, res) => {
  try {
    const filter = req.query.code ? { code: req.query.code } : { code: { $regex: "-" } };
    const reports = await mongoose.connection.db.collection("reports").find(filter).toArray();
    const stageFilter = req.query.stage || null;
    const wb = new ExcelJS.Workbook();

    const basic = wb.addWorksheet("Basic");
    basic.addRow(["Code", "Contractor", "Project", "Discipline", "Work Type", "UOM", "Quantity", "Actual Q", "Man-Hours", "Actual MH", "Cost", "Actual Cost", "Начало", "Окончание"]);
    reports.forEach(r => {
      (r.rows || []).filter(row => !stageFilter || row.stage === stageFilter).forEach(row => {
        basic.addRow([r.code, row.contractor || "", row.project || "", row.stage || "", row.item || "", "", 0, 0, row.mhPlan || 0, row.mhFact || 0, row.cost || 0, row.costFact || 0, row.planStart ? new Date(row.planStart) : "", row.planEnd ? new Date(row.planEnd) : ""]);
      });
    });

    const total = wb.addWorksheet("Total");
    total.addRow(["Code", "Contractor", "Project", "Man-Hours", "Actual MH", "Cost", "Actual Cost", "Progress"]);
    reports.forEach(r => {
      const rows = r.rows || [];
      const cost = rows.reduce((s, x) => s + (x.cost || 0), 0);
      const done = rows.reduce((s, x) => s + (x.done || 0), 0);
      const mh = rows.reduce((s, x) => s + (x.mhPlan || 0), 0);
      const mhFact = rows.reduce((s, x) => s + (x.mhFact || 0), 0);
      const contractor = rows.find(x => x.contractor)?.contractor || "";
      const progress = cost ? Math.round(done / cost * 100) / 100 : 0;
      total.addRow([r.code, contractor, (rows.find(x => x.project) || {}).project || "", mh, mhFact, cost, done, progress]);
    });

    const byMonth = {};
    const curveCodes = {};
    const curveDocs = await mongoose.connection.db.collection("data").find({ _id: { $regex: "^prep_cost_curve_" } }).toArray();
    curveDocs.forEach(cd => {
      const v = cd.value || {};
      if (reports.some(r => r.code == cd.code) == false) return;
      curveCodes[cd.code] = 1;
      (v.labels || []).forEach((k, i) => {
        byMonth[k] = byMonth[k] || { plan: 0, fact: 0 };
        byMonth[k].plan += (v.planPer || [])[i] || 0;
        byMonth[k].fact += (v.factPer || [])[i] || 0;
      });
    });
    reports.forEach(r => {
      if (curveCodes[r.code]) return;
      (r.rows || []).forEach(row => {
        if (row.planStart == null || row.planEnd == null) return;
        const ps = new Date(row.planStart), pe = new Date(row.planEnd);
        const months = (pe.getFullYear() - ps.getFullYear()) * 12 + (pe.getMonth() - ps.getMonth()) + 1;
        if (months <= 0) return;
        const perMonth = (row.cost || 0) / months;
        const d = new Date(ps.getFullYear(), ps.getMonth(), 1);
        for (let i = 0; i < months; i++) {
          const key = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0");
          byMonth[key] = byMonth[key] || { plan: 0, fact: 0 };
          byMonth[key].plan += perMonth;
          d.setMonth(d.getMonth() + 1);
        }
      });
      (r.rows || []).forEach(row => {
        if (row.factStart == null) return;
        const fs = new Date(row.factStart);
        const fe = row.factEnd ? new Date(row.factEnd) : new Date();
        const months = (fe.getFullYear() - fs.getFullYear()) * 12 + (fe.getMonth() - fs.getMonth()) + 1;
        if (months <= 0) return;
        const perMonth = (row.done || 0) / months;
        const d = new Date(fs.getFullYear(), fs.getMonth(), 1);
        for (let i = 0; i < months; i++) {
          const key = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0");
          byMonth[key] = byMonth[key] || { plan: 0, fact: 0 };
          byMonth[key].fact += perMonth;
          d.setMonth(d.getMonth() + 1);
        }
      });
    });
    const costSheet = wb.addWorksheet("Cost");
    costSheet.addRow(["Month", "Cumulative Plan", "Cumulative Actual", "Monthly Plan", "Monthly Actual"]);
    let cp = 0, cf = 0;
    Object.keys(byMonth).sort().forEach(key => {
      cp += byMonth[key].plan; cf += byMonth[key].fact;
      const [y, m] = key.split("-");
      costSheet.addRow([new Date(Number(y), Number(m) - 1, 1), Math.round(cp), Math.round(cf), Math.round(byMonth[key].plan), Math.round(byMonth[key].fact)]);
    });

    const mobByMonth = {};
    reports.forEach(r => {
      (r.mobilization || []).forEach(m => {
        if (m.date == null) return;
        const d = new Date(m.date);
        const key = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0");
        mobByMonth[key] = mobByMonth[key] || { plan: 0, fact: 0 };
        mobByMonth[key].plan = Math.max(mobByMonth[key].plan, m.plan || 0);
        mobByMonth[key].fact = Math.max(mobByMonth[key].fact, m.fact || 0);
      });
    });
    const mobDocs = await mongoose.connection.db.collection("data").find({ _id: { $regex: "^prep_mobilization_" } }).toArray();
    mobDocs.forEach(md => {
      if (reports.some(r => r.code == md.code) == false) return;
      const v = md.value || {};
      (v.labels || []).forEach((k, i) => {
        mobByMonth[k] = mobByMonth[k] || { plan: 0, fact: 0 };
        mobByMonth[k].plan += (v.plan || [])[i] || 0;
        mobByMonth[k].fact += (v.fact || [])[i] || 0;
      });
    });
    const mobSheet = wb.addWorksheet("Mobilization");
    mobSheet.addRow(["Month", "Plan", "Actual"]);
    Object.keys(mobByMonth).sort().forEach(key => {
      const [y, m] = key.split("-");
      mobSheet.addRow([new Date(Number(y), Number(m) - 1, 1), mobByMonth[key].plan, mobByMonth[key].fact]);
    });

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    const exportFileName = req.query.code
      ? (req.query.code + (stageFilter ? ("_" + stageFilter.replace(/\s+/g, "_")) : "") + ".xlsx")
      : "Подготовительные_работы.xlsx";
    res.setHeader("Content-Disposition", "attachment; filename=prep_export.xlsx; filename*=UTF-8''" + encodeURIComponent(exportFileName));
    await wb.xlsx.write(res);
    res.end();
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера: " + err.message });
  }
});
app.get("/api/proj/summary", async (req, res) => {
  try {
    const code = String(req.query.code || "");
    const rep = await mongoose.connection.db.collection("reports").findOne({ code });
    if (!rep) return res.json({ totalCost: 0, done: 0, plan: 0, remaining: 0 });
    const now = Date.now();
    let tc = 0, dn = 0, pl = 0, pd = 0;
    (rep.rows || []).forEach(function (x) {
      const c = x.cost || 0; tc += c; dn += x.done || 0; pd += x.costFact || 0;
      const a = x.planStart ? new Date(x.planStart).getTime() : null;
      const b = x.planEnd ? new Date(x.planEnd).getTime() : null;
      if (b !== null && b <= now) pl += c;
      else if (a !== null && b !== null && a < now && b > a) pl += c * (now - a) / (b - a);
    });
    res.json({ totalCost: tc, done: dn, plan: Math.round(pl), paid: pd, remaining: Math.max(0, tc - pd) });
  } catch (e) { res.status(500).json({ error: String(e) }); }
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/main.html");
});

app.get("/api/reports/:code/scurve", async (req, res) => {
  try {
    const report = await mongoose.connection.db.collection("reports").findOne({ code: req.params.code });
    if (!report || !report.rows) {
      return res.json({ labels: [], planPer: [], factPer: [], planCum: [], factCum: [] });
    }
    const rows = report.rows;
    const byMonth = {};
    rows.forEach(r => {
      if (!r.planStart || !r.planEnd) return;
      const ps = new Date(r.planStart), pe = new Date(r.planEnd);
      const months = (pe.getFullYear() - ps.getFullYear()) * 12 + (pe.getMonth() - ps.getMonth()) + 1;
      if (months <= 0) return;
      const perMonth = (r.cost || 0) / months;
      const d = new Date(ps.getFullYear(), ps.getMonth(), 1);
      for (let i = 0; i < months; i++) {
        const key = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0");
        byMonth[key] = byMonth[key] || { plan: 0, fact: 0 };
        byMonth[key].plan += perMonth;
        d.setMonth(d.getMonth() + 1);
      }
    });
    rows.forEach(r => {
      if (!r.factStart) return;
      const fs = new Date(r.factStart);
      const fe = r.factEnd ? new Date(r.factEnd) : new Date();
      const months = (fe.getFullYear() - fs.getFullYear()) * 12 + (fe.getMonth() - fs.getMonth()) + 1;
      if (months <= 0) return;
      const perMonth = (r.done || 0) / months;
      const d = new Date(fs.getFullYear(), fs.getMonth(), 1);
      for (let i = 0; i < months; i++) {
        const key = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0");
        byMonth[key] = byMonth[key] || { plan: 0, fact: 0 };
        byMonth[key].fact += perMonth;
        d.setMonth(d.getMonth() + 1);
      }
    });
    const keys = Object.keys(byMonth).sort();
    const total = rows.reduce((s, r) => s + (r.cost || 0), 0) || 1;
    const now = new Date();
    const nowKey = now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0");
    let cp = 0, cf = 0;
    const labels = [], planPer = [], factPer = [], planCum = [], factCum = [];
    keys.forEach(k => {
      cp += byMonth[k].plan; cf += byMonth[k].fact;
      labels.push(k);
      planPer.push(Math.round(byMonth[k].plan / total * 100 * 10) / 10);
      factPer.push(k <= nowKey ? Math.round(byMonth[k].fact / total * 100 * 10) / 10 : null);
      planCum.push(Math.round(cp / total * 100));
      factCum.push(k <= nowKey ? Math.round(cf / total * 100) : null);
    });
    res.json({ labels, planPer, factPer, planCum, factCum });
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера: " + err.message });
  }
});

app.get("/api/reports/:code/stage-objects", async (req, res) => {
  try {
    const stage = req.query.stage;
    const useEquip = stage === "Изготовление" || stage === "Логистика";
    const groupField = useEquip ? "equip" : "obj";
    const report = await mongoose.connection.db.collection("reports").findOne({ code: req.params.code });
    if (!report || !report.rows) return res.json([]);
    const rows = report.rows.filter(r => r.stage === stage && (r[groupField] || "").trim());
    const byObj = {};
    rows.forEach(r => {
      const key = r[groupField].trim();
      if (!byObj[key]) byObj[key] = [];
      byObj[key].push(r);
    });
    const result = Object.keys(byObj).map(obj => {
      const objRows = byObj[obj];
      const cost = objRows.reduce((s, r) => s + (r.cost || 0), 0);
      const done = objRows.reduce((s, r) => s + (r.done || 0), 0);
      const paid = objRows.reduce((s, r) => s + (r.costFact || 0), 0);
      const planPct = calcPlanPct(objRows, cost);
      const dates = calcStageDates(objRows, cost, done, planPct);
      return { obj, cost, done, paid, planPct, start: dates.start, end: dates.end, forecastEnd: dates.forecastEnd, deltaDays: dates.deltaDays };
    });
    result.sort((a, b) => {
      const numA = parseInt((a.obj.match(/\d+/) || ["999999"])[0], 10);
      const numB = parseInt((b.obj.match(/\d+/) || ["999999"])[0], 10);
      if (numA !== numB) return numA - numB;
      return a.obj.localeCompare(b.obj);
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера: " + err.message });
  }
});

app.get("/api/reports/:code/worktype-summary", async (req, res) => {
  try {
    const stage = req.query.stage;
    const report = await mongoose.connection.db.collection("reports").findOne({ code: req.params.code });
    if (!report || !report.rows) return res.json({ total: 0, items: [] });
    const stageRows = report.rows.filter(r => r.stage === stage);
    const equipSet = new Set();
    stageRows.forEach(r => {
      const v = (r.obj || "").trim();
      if (v) equipSet.add(v);
    });
    const total = equipSet.size;
    const now = new Date();
    const byWt = {};
    const byWtPlan = {};
    stageRows.forEach(r => {
      const wt = (r.workType || "").trim();
      if (!wt) return;
      if (!byWt[wt]) byWt[wt] = new Set();
      if (!byWtPlan[wt]) byWtPlan[wt] = new Set();
      const v = (r.obj || "").trim();
      if ((r.status || "").trim() === "Завершено" && v) byWt[wt].add(v);
      if (v && r.planEnd && new Date(r.planEnd) <= now) byWtPlan[wt].add(v);
    });
    const items = Object.keys(byWt).map(wt => ({ workType: wt, done: byWt[wt].size, plan: (byWtPlan[wt] ? byWtPlan[wt].size : 0) }));
    res.json({ total, items });
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера: " + err.message });
  }
});

app.get("/api/reports/:code/worktype-equipment", async (req, res) => {
  try {
    const stage = req.query.stage;
    const workType = req.query.workType;
    const report = await mongoose.connection.db.collection("reports").findOne({ code: req.params.code });
    if (!report || !report.rows) return res.json([]);
    const now = new Date();
    const rows = report.rows.filter(r => r.stage === stage && (r.workType || "").trim() === workType);
    const done = new Set();
    rows.forEach(r => {
      const v = (r.obj || "").trim();
      if (v && (r.status || "").trim() === "Завершено") done.add(v);
    });
    const result = Array.from(done).sort();
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера: " + err.message });
  }
});

app.get("/api/reports/:code/stage-work-links", async (req, res) => {
  try {
    const stage = req.query.stage;
    const report = await mongoose.connection.db.collection("reports").findOne({ code: req.params.code });
    if (!report || !report.rows) return res.json([]);
    const rows = report.rows.filter(r => r.stage === stage);
    const seen = new Set();
    const result = [];
    rows.forEach(r => {
      const obj = (r.obj || "").trim();
      const wt = (r.workType || "").trim();
      if (!obj || !wt) return;
      const key = obj + "|||" + wt;
      if (seen.has(key)) return;
      seen.add(key);
      result.push({ obj: obj, workType: wt });
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера: " + err.message });
  }
});

app.get("/api/reports/:code/stage-worktype-table", async (req, res) => {
  try {
    const stage = req.query.stage;
    const report = await mongoose.connection.db.collection("reports").findOne({ code: req.params.code });
    if (!report || !report.rows) return res.json([]);
    const rows = report.rows.filter(r => r.stage === stage && (r.workType || "").trim());
    const byWt = {};
    rows.forEach(r => {
      const key = r.workType.trim();
      if (!byWt[key]) byWt[key] = [];
      byWt[key].push(r);
    });
    const result = Object.keys(byWt).map(workType => {
      const wtRows = byWt[workType];
      const cost = wtRows.reduce((s, r) => s + (r.cost || 0), 0);
      const done = wtRows.reduce((s, r) => s + (r.done || 0), 0);
      const planPct = calcPlanPct(wtRows, cost);
      const factPct = cost ? Math.min(100, Math.round((done / cost) * 100)) : 0;
      return { workType, planPct, factPct };
    });
    result.sort((a, b) => a.workType.localeCompare(b.workType));
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера: " + err.message });
  }
});

app.get("/api/reports/:code/stage-object-worktype-table", async (req, res) => {
  try {
    const stage = req.query.stage;
    const obj = (req.query.obj || "").trim();
    const report = await mongoose.connection.db.collection("reports").findOne({ code: req.params.code });
    if (!report || !report.rows) return res.json([]);
    const rows = report.rows.filter(r => r.stage === stage && (r.obj || "").trim() === obj && (r.workType || "").trim());
    const byWt = {};
    rows.forEach(r => {
      const key = r.workType.trim();
      if (!byWt[key]) byWt[key] = [];
      byWt[key].push(r);
    });
    const result = Object.keys(byWt).map(workType => {
      const wtRows = byWt[workType];
      const cost = wtRows.reduce((s, r) => s + (r.cost || 0), 0);
      const done = wtRows.reduce((s, r) => s + (r.done || 0), 0);
      const planPct = calcPlanPct(wtRows, cost);
      const factPct = cost ? Math.min(100, Math.round((done / cost) * 100)) : 0;
      return { workType, planPct, factPct };
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера: " + err.message });
  }
});

app.get("/api/reports/:code/stage-detail-matrix", async (req, res) => {
  try {
    const stage = req.query.stage;
    const useEquip = stage === "Изготовление" || stage === "Логистика";
    const groupField = useEquip ? "equip" : "obj";
    const report = await mongoose.connection.db.collection("reports").findOne({ code: req.params.code });
    if (!report || !report.rows) return res.json({ byObj: {}, byWork: {} });
    const rows = report.rows.filter(r => r.stage === stage && (r[groupField] || "").trim() && (r.workType || "").trim());
    const pairMap = {};
    rows.forEach(r => {
      const obj = r[groupField].trim();
      const wt = r.workType.trim();
      const key = obj + "|||" + wt;
      if (!pairMap[key]) pairMap[key] = [];
      pairMap[key].push(r);
    });
    const byObj = {};
    const byWork = {};
    Object.keys(pairMap).forEach(key => {
      const idx = key.indexOf("|||");
      const obj = key.slice(0, idx);
      const wt = key.slice(idx + 3);
      const groupRows = pairMap[key];
      const cost = groupRows.reduce((s, r) => s + (r.cost || 0), 0);
      const done = groupRows.reduce((s, r) => s + (r.done || 0), 0);
      const paid = groupRows.reduce((s, r) => s + (r.costFact || 0), 0);
      const planPct = calcPlanPct(groupRows, cost);
      const dates = calcStageDates(groupRows, cost, done, planPct);
      const factPct = cost ? Math.min(100, Math.round((done / cost) * 100)) : 0;
      const entry = { obj, workType: wt, cost, done, paid, planPct, factPct, start: dates.start, end: dates.end, forecastEnd: dates.forecastEnd, deltaDays: dates.deltaDays };
      if (!byObj[obj]) byObj[obj] = [];
      byObj[obj].push(entry);
      if (!byWork[wt]) byWork[wt] = [];
      byWork[wt].push(entry);
    });
    res.json({ byObj, byWork });
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера: " + err.message });
  }
});

app.get("/api/reports/:code/stage-objects-by-worktype", async (req, res) => {
  try {
    const stage = req.query.stage;
    const workType = (req.query.workType || "").trim();
    const useEquip = stage === "Изготовление" || stage === "Логистика";
    const groupField = useEquip ? "equip" : "obj";
    const report = await mongoose.connection.db.collection("reports").findOne({ code: req.params.code });
    if (!report || !report.rows) return res.json([]);
    const rows = report.rows.filter(r => r.stage === stage && (r.workType || "").trim() === workType && (r[groupField] || "").trim());
    const byObj = {};
    rows.forEach(r => {
      const key = r[groupField].trim();
      if (!byObj[key]) byObj[key] = [];
      byObj[key].push(r);
    });
    const result = Object.keys(byObj).map(obj => {
      const objRows = byObj[obj];
      const cost = objRows.reduce((s, r) => s + (r.cost || 0), 0);
      const done = objRows.reduce((s, r) => s + (r.done || 0), 0);
      const paid = objRows.reduce((s, r) => s + (r.costFact || 0), 0);
      const planPct = calcPlanPct(objRows, cost);
      const dates = calcStageDates(objRows, cost, done, planPct);
      return { obj, cost, done, paid, planPct, start: dates.start, end: dates.end, forecastEnd: dates.forecastEnd, deltaDays: dates.deltaDays };
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера: " + err.message });
  }
});

app.post("/api/reports/import", upload.single("file"), async (req, res) => { global._rrc={};
  try {
    if (req.file == null) return res.status(400).json({ message: "Файл не найден" });
    const wb = new ExcelJS.Workbook();
    await wb.xlsx.load(req.file.buffer);
    const basicSheet = wb.getWorksheet("Basic");
    if (basicSheet == null) return res.status(400).json({ message: "Лист Basic не найден" });
    const byCode = {};
    basicSheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;
      const code = row.getCell(1).value;
      if (code == null || code === "") return;
      byCode[code] = byCode[code] || [];
      const stageValRaw = row.getCell(3).value;
      const stageVal = (typeof stageValRaw === "object" && stageValRaw != null && stageValRaw.richText)
        ? stageValRaw.richText.map(function(t){ return t.text; }).join("")
        : (stageValRaw || "");
      const stageValTrim = String(stageVal).trim();
      const obj = row.getCell(4).value || "";
      const discipline = row.getCell(5).value || "";
      const workType = row.getCell(6).value || "";
      const isEquipStage = stageValTrim === "Изготовление" || stageValTrim === "Логистика";
      const objVal = isEquipStage ? (discipline || obj) : obj;
      byCode[code].push({
        stage: stageValTrim,
        item: [discipline, workType].filter(Boolean).join(" - ") || obj || "",
        obj: objVal,
        equip: objVal,
        objOrig: obj,
        disc: discipline,
        workType: workType,
        contractor: "",
        currency: row.getCell(11).value || "",
        planStart: row.getCell(7).value || null,
        planEnd: row.getCell(8).value || null,
        factStart: row.getCell(9).value || null,
        factEnd: row.getCell(10).value || null,
        forecastEnd: null,
        cost: cellNum(row.getCell(12)),
        costVat: 0,
        costFact: 0,
        done: cellNum(row.getCell(13)),
        status: row.getCell(14).value || "",
        mhPlan: 0,
        mhFact: 0,
        eqPlan: 0,
        eqFact: 0
      });
    });
    const cashSheet = wb.getWorksheet("Cash");
    if (cashSheet != null) {
      const cashByCodeStage = {};
      cashSheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return;
        const code = row.getCell(2).value;
        if (code == null || code === "") return;
        const stage = row.getCell(4).value || "";
        const key = code + "||" + stage;
        cashByCodeStage[key] = (cashByCodeStage[key] || 0) + cellNum(row.getCell(9));
      });
      Object.keys(cashByCodeStage).forEach(key => {
        const parts = key.split("||");
        const code = parts[0], stage = parts[1];
        byCode[code] = byCode[code] || [];
        byCode[code].push({
          stage: stage,
          item: "Оплата",
          obj: "",
          equip: "",
          contractor: "",
          currency: "Euro",
          planStart: null,
          planEnd: null,
          factStart: null,
          factEnd: null,
          forecastEnd: null,
          cost: 0,
          costVat: 0,
          costFact: cashByCodeStage[key],
          done: 0,
          status: "",
          mhPlan: 0,
          mhFact: 0,
          eqPlan: 0,
          eqFact: 0
        });
      });
    }
    const results = [];
    for (const code of Object.keys(byCode)) {
      await mongoose.connection.db.collection("reports").updateOne(
        { code },
        { $set: { code, rows: byCode[code], updatedAt: new Date(), updatedBy: await (async function(){try{var _u=await mongoose.connection.db.collection("users").findOne({username:req.session.user});return (_u&&(_u.name||_u.fullName||_u.username))||req.session.user||"";}catch(e){return req.session.user||"";}})() } },
        { upsert: true }
      );
      results.push({ code, status: "обновлено (" + byCode[code].length + " строк)" });
    }
    res.json({ results });
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера: " + err.message });
  }
});

app.get("/api/reports/export", async (req, res) => {
  try {
    const filter = req.query.code ? { code: req.query.code } : {};
    const reports = await mongoose.connection.db.collection("reports").find(filter).toArray();
    const wb = new ExcelJS.Workbook();
    const basic = wb.addWorksheet("Basic");
    basic.addRow(["Code", "Project", "Stage", "Object", "Discipline", "Work Type", "Planned Start", "Planned Finish", "Actual Start", "Actual Finish", "Currency", "Cost", "Completed", "Status"]);
    reports.forEach(r => {
      (r.rows || []).filter(row => row.item !== "Оплата").forEach(row => {
        basic.addRow([r.code, "", row.stage || "", row.obj || "", "", row.item || "", row.planStart ? new Date(row.planStart) : "", row.planEnd ? new Date(row.planEnd) : "", row.factStart ? new Date(row.factStart) : "", row.factEnd ? new Date(row.factEnd) : "", row.currency || "", row.cost || 0, row.done || 0, row.status || ""]);
      });
    });
    const cash = wb.addWorksheet("Cash");
    cash.addRow(["Package", "Code", "Project", "Stage", "Contractor", "Purpose of Payment", "Invoice No.", "Date", "Euro", "Dollar"]);
    reports.forEach(r => {
      (r.rows || []).filter(row => row.item === "Оплата").forEach(row => {
        cash.addRow(["", r.code, "", row.stage || "", "", "", "", "", row.costFact || 0, 0]);
      });
    });
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    const exportFileName = req.query.code ? (req.query.code + ".xlsx") : "Основные_проекты.xlsx";
    res.setHeader("Content-Disposition", "attachment; filename=reports_export.xlsx; filename*=UTF-8''" + encodeURIComponent(exportFileName));
    await wb.xlsx.write(res);
    res.end();
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера: " + err.message });
  }
});

app.get("/api/users/birthdays", async (req, res) => {
  try {
    const users = await mongoose.connection.db.collection("users").find({}).toArray();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const withDays = users.filter(u => u.birthday).map(u => {
      const parts = u.birthday.split(".");
      if (parts.length !== 3) return null;
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      let next = new Date(today.getFullYear(), month, day);
      if (next < today) next = new Date(today.getFullYear() + 1, month, day);
      const daysUntil = Math.round((next - today) / 86400000);
      return { name: u.name, birthday: u.birthday, daysUntil, avatar: u.avatar || "" };
    }).filter(Boolean);
    withDays.sort((a, b) => a.daysUntil - b.daysUntil);
    res.json(withDays.slice(0, 3));
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера: " + err.message });
  }
});

app.get("/api/users/list", async (req, res) => {
  try {
    const users = await mongoose.connection.db.collection("users").find({}, { projection: { password: 0 } }).toArray();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера: " + err.message });
  }
});

async function meUser(req){return mongoose.connection.db.collection('users').findOne({ username: req.session.user });}
function canManageUsers(me){return me!=null&&(me.role=='admin'||me.role=='developer');}

app.post('/api/users', async (req, res) => {
  try {
    const me = await meUser(req);
    if (canManageUsers(me)==false) return res.status(403).json({ error: 'forbidden' });
    const b = req.body || {};
    const username = String(b.username || '').trim();
    const name = String(b.name || '').trim();
    const pw = String(b.password || '');
    if (username == '' || name == '' || pw == '') return res.status(400).json({ error: 'bad data' });
    const col = mongoose.connection.db.collection('users');
    const dup = await col.findOne({ username: username });
    if (dup) return res.status(409).json({ error: 'exists' });
    const doc = { username: username, name: name, password: await bcrypt.hash(pw, 10), role: 'user', department: '', position: '', email: '', internalPhone: '', mobilePhone: '', birthday: '', avatar: '', createdAt: new Date() };
    await col.insertOne(doc);
    delete doc.password;
    res.json(doc);
  } catch (err) { res.status(500).json({ error: 'server' }); }
});

app.delete('/api/users/:username', async (req, res) => {
  try {
    const me = await meUser(req);
    if (canManageUsers(me)==false) return res.status(403).json({ error: 'forbidden' });
    const col = mongoose.connection.db.collection('users');
    const target = await col.findOne({ username: req.params.username });
    if (target == null) return res.status(404).json({ error: 'not found' });
    if (target.username == me.username) return res.status(400).json({ error: 'self' });
    if (target.role == 'developer' && (me.role == 'developer')==false) return res.status(403).json({ error: 'forbidden' });
    await col.deleteOne({ username: target.username });
    res.json({ message: 'OK' });
  } catch (err) { res.status(500).json({ error: 'server' }); }
});

app.put('/api/users/:username/role', async (req, res) => {
  try {
    const me = await meUser(req);
    if (canManageUsers(me)==false) return res.status(403).json({ error: 'forbidden' });
    const role = String((req.body || {}).role || '');
    if (['user', 'admin', 'developer'].indexOf(role) < 0) return res.status(400).json({ error: 'bad role' });
    if (role == 'developer' && (me.role == 'developer')==false) return res.status(403).json({ error: 'forbidden' });
    const col = mongoose.connection.db.collection('users');
    const target = await col.findOne({ username: req.params.username });
    if (target == null) return res.status(404).json({ error: 'not found' });
    if (target.role == 'developer' && (me.role == 'developer')==false) return res.status(403).json({ error: 'forbidden' });
    await col.updateOne({ username: target.username }, { $set: { role: role } });
    res.json({ message: 'OK' });
  } catch (err) { res.status(500).json({ error: 'server' }); }
});

app.put('/api/users/:username/password', async (req, res) => {
  try {
    const me = await meUser(req);
    if (canManageUsers(me)==false) return res.status(403).json({ error: 'forbidden' });
    const pw = String((req.body || {}).password || '');
    if (pw.length < 6) return res.status(400).json({ error: 'Пароль слишком короткий' });
    const col = mongoose.connection.db.collection('users');
    const target = await col.findOne({ username: req.params.username });
    if (target == null) return res.status(404).json({ error: 'not found' });
    if (target.role == 'developer' && (me.role == 'developer')==false) return res.status(403).json({ error: 'forbidden' });
    await col.updateOne({ username: target.username }, { $set: { password: await bcrypt.hash(pw, 10) } });
    res.json({ message: 'OK' });
  } catch (err) { res.status(500).json({ error: 'server' }); }
});

app.put('/api/me/profile', async (req, res) => {
  try {
    const b = req.body || {};
    const clean = function (v) { return String(v == null ? '' : v).trim().slice(0, 200); };
    const set = { name: clean(b.name), department: clean(b.department), position: clean(b.position), birthday: clean(b.birthday), internalPhone: clean(b.internalPhone), mobilePhone: clean(b.mobilePhone), email: clean(b.email) };
    if (set.name == '') return res.status(400).json({ error: 'name required' });
    if (typeof b.avatar == 'string') {
      if (b.avatar == '') set.avatar = '';
      else if (b.avatar.indexOf('data:image/jpeg;base64,') == 0 && b.avatar.length < 90000) set.avatar = b.avatar;
      else return res.status(400).json({ error: 'bad avatar' });
    }
    const col = mongoose.connection.db.collection('users');
    await col.updateOne({ username: req.session.user }, { $set: set });
    const u = await col.findOne({ username: req.session.user }, { projection: { password: 0 } });
    res.json(u);
  } catch (err) { res.status(500).json({ error: 'server' }); }
});

app.put('/api/me/password', async (req, res) => {
  try {
    const b = req.body || {};
    const oldPw = String(b.oldPassword || '');
    const newPw = String(b.newPassword || '');
    if (newPw.length < 6) return res.status(400).json({ error: 'short' });
    const col = mongoose.connection.db.collection('users');
    const u = await col.findOne({ username: req.session.user });
    if (u == null) return res.status(401).json({ error: 'unauthorized' });
    const ok = await bcrypt.compare(oldPw, u.password);
    if (ok == false) return res.status(403).json({ error: 'wrong password' });
    await col.updateOne({ username: u.username }, { $set: { password: await bcrypt.hash(newPw, 10) } });
    res.json({ message: 'OK' });
  } catch (err) { res.status(500).json({ error: 'server' }); }
});


app.put('/api/users/:username/profile', async (req, res) => {
  try {
    const me = await meUser(req);
    if (me == null || (me.role == 'developer') == false) return res.status(403).json({ error: 'forbidden' });
    const b = req.body || {};
    const clean = function (v) { return String(v == null ? '' : v).trim().slice(0, 200); };
    const set = { name: clean(b.name), department: clean(b.department), position: clean(b.position), birthday: clean(b.birthday), internalPhone: clean(b.internalPhone), mobilePhone: clean(b.mobilePhone), email: clean(b.email) };
    if (set.name == '') return res.status(400).json({ error: 'name required' });
    if (typeof b.avatar == 'string') {
      if (b.avatar == '') set.avatar = '';
      else if (b.avatar.indexOf('data:image/jpeg;base64,') == 0 && b.avatar.length < 90000) set.avatar = b.avatar;
      else return res.status(400).json({ error: 'bad avatar' });
    }
    const col = mongoose.connection.db.collection('users');
    const target = await col.findOne({ username: req.params.username });
    if (target == null) return res.status(404).json({ error: 'not found' });
    await col.updateOne({ username: target.username }, { $set: set });
    const u = await col.findOne({ username: target.username }, { projection: { password: 0 } });
    res.json(u);
  } catch (err) { res.status(500).json({ error: 'server' }); }
});

app.post('/api/ideas',async function(req,res){try{var b=req.body||{};var t=String(b.text||'').trim().slice(0,2000);var ty=b.type==='error'?'error':'suggestion';if(!t){return res.status(400).json({error:'empty'});}var u=await mongoose.connection.db.collection('users').findOne({username:req.session.user});await mongoose.connection.db.collection('ideas').insertOne({type:ty,text:t,username:req.session.user,name:(u&&(u.name||u.fullName))||req.session.user,role:(u&&u.role)||'',createdAt:new Date(),code:String(Math.floor(1e7+Math.random()*9e7)),status:'sent',reply:null,repliedAt:null,repliedBy:null});res.json({ok:true});}catch(e){res.status(500).json({error:e.message});}});
app.get('/api/ideas/my',async function(req,res){try{var l=await mongoose.connection.db.collection('ideas').find({username:req.session.user}).sort({createdAt:-1}).limit(50).toArray();res.json(l.map(function(x){return {id:String(x._id),code:x.code||String(parseInt(String(x._id).slice(-7),16)%90000000+10000000),type:x.type||'suggestion',text:x.text,status:x.status||'sent',createdAt:x.createdAt,reply:x.reply||null,repliedAt:x.repliedAt||null,repliedBy:x.repliedBy||null};}));}catch(e){res.status(500).json({error:e.message});}});
app.put('/api/ideas/:id',async function(req,res){try{var b=req.body||{};var t=String(b.text||'').trim().slice(0,2000);if(!t){return res.status(400).json({error:'empty'});}var ty=b.type==='error'?'error':'suggestion';var r=await mongoose.connection.db.collection('ideas').updateOne({_id:new mongoose.Types.ObjectId(req.params.id),username:req.session.user,status:'sent'},{$set:{text:t,type:ty,editedAt:new Date()}});if(!r.matchedCount){return res.status(403).json({error:'Нельзя изменить: заявка уже рассмотрена или не ваша'});}res.json({ok:true});}catch(e){res.status(500).json({error:e.message});}});
app.delete('/api/ideas/:id',async function(req,res){try{var r=await mongoose.connection.db.collection('ideas').deleteOne({_id:new mongoose.Types.ObjectId(req.params.id),username:req.session.user,status:'sent'});if(!r.deletedCount){return res.status(403).json({error:'Нельзя удалить: заявка уже рассмотрена или не ваша'});}res.json({ok:true});}catch(e){res.status(500).json({error:e.message});}});
async function isDev(req){var u=await mongoose.connection.db.collection('users').findOne({username:req.session.user});return u&&u.role==='developer'?u:null;}
app.get('/api/ideas/all',async function(req,res){try{if(!(await isDev(req))){return res.status(403).json({error:'forbidden'});}var l=await mongoose.connection.db.collection('ideas').find({}).sort({createdAt:-1}).limit(200).toArray();res.json(l.map(function(x){return {id:String(x._id),code:x.code||String(parseInt(String(x._id).slice(-7),16)%90000000+10000000),type:x.type||'suggestion',text:x.text,name:x.name||x.username,role:x.role||'',status:x.status||'sent',createdAt:x.createdAt,reply:x.reply||null,repliedBy:x.repliedBy||null};}));}catch(e){res.status(500).json({error:e.message});}});
app.put('/api/ideas/:id/review',async function(req,res){try{var u=await isDev(req);if(!u){return res.status(403).json({error:'forbidden'});}var b=req.body||{};var set={};if(['sent','reviewed','done'].indexOf(b.status)>=0){set.status=b.status;}if(typeof b.reply==='string'){var r0=b.reply.trim().slice(0,2000);set.reply=r0||null;set.repliedAt=r0?new Date():null;set.repliedBy=r0?(u.name||u.fullName||u.username):null;}if(!Object.keys(set).length){return res.status(400).json({error:'empty'});}await mongoose.connection.db.collection('ideas').updateOne({_id:new mongoose.Types.ObjectId(req.params.id)},{$set:set});res.json({ok:true});}catch(e){res.status(500).json({error:e.message});}});
require('./assistant')(app,{calcPlanPct:calcPlanPct,getStagesForCode:getStagesForCode});
/* ===== SMR step1: import/export (9 columns) ===== */
(function(){
var COLS=['\u041a\u043e\u0434 \u043e\u0431\u044a\u0435\u043a\u0442\u0430','\u041d\u0430\u0437\u0432\u0430\u043d\u0438\u0435 \u043e\u0431\u044a\u0435\u043a\u0442\u0430','\u0414\u0438\u0441\u0446\u0438\u043f\u043b\u0438\u043d\u0430','\u0422\u0438\u043f \u0440\u0430\u0431\u043e\u0442\u044b','\u0412\u0438\u0434 \u0440\u0430\u0431\u043e\u0442\u044b','\u0415\u0434.\u0438\u0437\u043c','\u041e\u0431\u044a\u0451\u043c','\u0427\u0435\u043b-\u0447','\u041c\u0430\u0448-\u0447'];
function col(n){return mongoose.connection.db.collection(n);}
function cv(cell){var v=cell?cell.value:null;if(v==null){return '';}if(v instanceof Date){return v.toISOString().slice(0,10);}if(typeof v==='object'){if(v.richText){return v.richText.map(function(t){return t.text;}).join('').trim();}if(v.result!==undefined&&v.result!==null){return String(v.result).trim();}if(v.text!==undefined){return String(v.text).trim();}return '';}return String(v).trim();}
function cn(cell){var v=cell?cell.value:null;if(v&&typeof v==='object'&&v.result!==undefined){v=v.result;}if(v==null||v===''){return 0;}if(typeof v==='number'){return v;}var n=Number(String(v).replace(/\s/g,'').replace(',','.'));return isNaN(n)?0:n;}
app.post('/api/smr/import',upload.single('file'),async function(req,res){try{
if(!req.file){return res.status(400).json({message:'\u0424\u0430\u0439\u043b \u043d\u0435 \u043d\u0430\u0439\u0434\u0435\u043d'});}
var wb=new ExcelJS.Workbook();await wb.xlsx.load(req.file.buffer);var ws=wb.worksheets[0];
if(!ws){return res.status(400).json({message:'\u041f\u0443\u0441\u0442\u043e\u0439 \u0444\u0430\u0439\u043b'});}
var by={},names={},seq={};
ws.eachRow(function(row,rn){
if(rn===1){var h=cv(row.getCell(7));if(/\u043a\u043e\u0434|code/i.test(cv(row.getCell(1)))||(h!==''&&isNaN(Number(h.replace(/\s/g,'').replace(',','.'))))){return;}}
var code=cv(row.getCell(1));if(!code){return;}
if(!by[code]){by[code]=[];seq[code]=0;}
var nm=cv(row.getCell(2));if(nm&&!names[code]){names[code]=nm;}
by[code].push({objCode:code,objName:nm,discipline:cv(row.getCell(3)),workType:cv(row.getCell(4)),workName:cv(row.getCell(5)),uom:cv(row.getCell(6)),qty:cn(row.getCell(7)),mh:cn(row.getCell(8)),mach:cn(row.getCell(9)),order:seq[code]++});
});
var codes=Object.keys(by);
if(!codes.length){return res.status(400).json({message:'\u041d\u0435 \u043d\u0430\u0439\u0434\u0435\u043d\u043e \u0441\u0442\u0440\u043e\u043a \u0441 \u043a\u043e\u0434\u043e\u043c \u043e\u0431\u044a\u0435\u043a\u0442\u0430'});}
var now=new Date(),uid=new mongoose.Types.ObjectId(),results=[];
for(var i=0;i<codes.length;i++){var c=codes[i];
await col('smr_rows').updateMany({objCode:c,deleted:{$ne:true}},{$set:{deleted:true,deletedAt:now,deletedByUpload:uid}});
var docs=by[c].map(function(r){r.deleted=false;r.uploadId=uid;r.at=now;return r;});
await col('smr_rows').insertMany(docs);
results.push({code:c,name:names[c]||'',rows:docs.length});}
await col('smr_uploads').insertOne({_id:uid,at:now,by:req.session.user||'',file:req.file.originalname||'',objects:results});
res.json({results:results,uploadId:String(uid)});
}catch(err){res.status(500).json({message:'\u041e\u0448\u0438\u0431\u043a\u0430 \u0441\u0435\u0440\u0432\u0435\u0440\u0430: '+err.message});}});
app.get('/api/smr/summary',async function(req,res){try{
var rows=await col('smr_rows').find({deleted:{$ne:true}},{projection:{objCode:1,objName:1}}).toArray(),m={},out=[];
rows.forEach(function(r){if(!m[r.objCode]){m[r.objCode]={code:r.objCode,name:r.objName||'',rows:0};out.push(m[r.objCode]);}m[r.objCode].rows++;if(!m[r.objCode].name&&r.objName){m[r.objCode].name=r.objName;}});
out.sort(function(a,b){return a.code<b.code?-1:(a.code>b.code?1:0);});res.json(out);
}catch(err){res.status(500).json({message:'\u041e\u0448\u0438\u0431\u043a\u0430 \u0441\u0435\u0440\u0432\u0435\u0440\u0430: '+err.message});}});
global._rrc=global._rrc||{};
async function repRows(code){
if(global._rrc[code]){return global._rrc[code];}
var a=await mongoose.connection.db.collection('reports').aggregate([{$match:{code:code}},{$project:{_id:0,rows:{$map:{input:{$filter:{input:'$rows',as:'y',cond:{$ne:['$$y.item','\u041e\u043f\u043b\u0430\u0442\u0430']}}},as:'x',in:{stage:'$$x.stage',obj:'$$x.obj',objOrig:'$$x.objOrig',disc:'$$x.disc',item:'$$x.item',workType:'$$x.workType',planStart:'$$x.planStart',planEnd:'$$x.planEnd',factStart:'$$x.factStart',factEnd:'$$x.factEnd',currency:'$$x.currency',cost:'$$x.cost',done:'$$x.done',status:'$$x.status'}}}}}]).toArray();
var rows=((a[0]&&a[0].rows)||[]).map(function(x){return {code:code,stage:x.stage||'',obj:(x.objOrig!==undefined?x.objOrig:(x.obj||'')),disc:x.disc||'',item:(x.workType||x.item||''),planStart:x.planStart||null,planEnd:x.planEnd||null,factStart:x.factStart||null,factEnd:x.factEnd||null,currency:x.currency||'',cost:x.cost||0,done:x.done||0,status:x.status||''};});
global._rrc[code]=rows;
return rows;
}
app.get('/api/reports/rows',async function(req,res){try{res.json(await repRows(String(req.query.code||'')));}catch(err){res.status(500).json({message:err.message});}});
setTimeout(function(){if(!mongoose.connection.db){return;}mongoose.connection.db.collection('reports').distinct('code').then(function(cs){return cs.reduce(function(p,c){return p.then(function(){return repRows(String(c)).catch(function(){});});},Promise.resolve());}).catch(function(){});},8000);
app.get('/api/contracts',async function(req,res){try{var a=await mongoose.connection.db.collection('contracts').find({},{projection:{_id:0}}).sort({ord:1}).toArray();res.json(a);}catch(err){res.status(500).json({message:err.message});}});
app.post('/api/contracts/save',async function(req,res){try{var r=req.body&&req.body.rows;if(!Array.isArray(r)){return res.status(400).json({message:'bad'});}var c=mongoose.connection.db.collection('contracts');var S=function(v){return String(v==null?'':v);};var docs=r.map(function(x,i){return {id:S(x.id),num:S(x.num),contractor:S(x.contractor),projects:Array.isArray(x.projects)?x.projects.map(S):[],services:Array.isArray(x.services)?x.services.map(S):[],sum:S(x.sum),cur:S(x.cur),signed:S(x.signed),until:S(x.until),status:S(x.status),type:S(x.type),term:S(x.term),paid:S(x.paid),ord:i};});await c.deleteMany({});if(docs.length){await c.insertMany(docs);}res.json({ok:true,n:docs.length});}catch(err){res.status(500).json({message:err.message});}});
app.get('/api/con2',async function(req,res){try{var a=await mongoose.connection.db.collection('contracts2').find({},{projection:{_id:0}}).sort({ord:1}).toArray();res.json(a);}catch(err){res.status(500).json({message:err.message});}});
app.post('/api/con2/save',async function(req,res){try{var r=req.body&&req.body.rows;if(!Array.isArray(r)){return res.status(400).json({message:'bad'});}var S=function(v){return String(v==null?'':v);};var A=function(v){return Array.isArray(v)?v:[];};var docs=r.map(function(x,i){return {id:S(x.id),num:S(x.num),contractor:S(x.contractor),status:S(x.status),cur:S(x.cur),signed:S(x.signed),open:x.open!==false,children:A(x.children).map(function(k){return {id:S(k.id),kind:S(k.kind),code:S(k.code),name:S(k.name),num:S(k.num),signed:S(k.signed),status:S(k.status),open:k.open!==false,services:A(k.services).map(function(s){return {id:S(s.id),name:S(s.name),sum:S(s.sum),paid:S(s.paid),scope:S(s.scope)==='all'?'all':A(s.scope).map(S)};})};}),ord:i};});var c=mongoose.connection.db.collection('contracts2');await c.deleteMany({});if(docs.length){await c.insertMany(docs);}res.json({ok:true,n:docs.length});}catch(err){res.status(500).json({message:err.message});}});
app.use(['/api/con3','/api/reg'],async function(req,res,next){try{if(req.session.user==null){return res.status(401).json({error:'unauthorized'});}var me=await mongoose.connection.db.collection('users').findOne({username:req.session.user});var ed=!!(me&&(me.role==='developer'||String(me.username||'').toLowerCase()==='sh.arslanov'));var vw=ed||!!(me&&me.role==='admin');if(req.method==='GET'||req.method==='HEAD'){if(!vw){return res.status(403).json({error:'forbidden'});}}else if(!ed){return res.status(403).json({error:'forbidden'});}next();}catch(e){res.status(500).json({error:'acl'});}});
app.get('/api/con3',async function(req,res){try{var a=await mongoose.connection.db.collection('contracts3').find({},{projection:{_id:0}}).sort({ord:1}).toArray();res.json(a);}catch(err){res.status(500).json({message:err.message});}});
app.post('/api/con3/save',async function(req,res){try{
var r=req.body&&req.body.rows;if(!Array.isArray(r)){return res.status(400).json({message:'bad'});}
var clean=function(o,d){if(d>8){return null;}if(Array.isArray(o)){return o.map(function(x){return clean(x,d+1);});}if(o&&typeof o==='object'){var q={};Object.keys(o).forEach(function(k){if(k.charAt(0)==='$'||k.indexOf('.')>=0){return;}q[k]=clean(o[k],d+1);});return q;}if(typeof o==='string'){return o.slice(0,5000);}return o;};
var seen={};var docs=r.map(function(x,i){var q=clean(x,0)||{};var id=String(q.id==null||q.id===''?('k'+Date.now().toString(36)+i):q.id);if(seen[id]){id=id+'_'+i;}seen[id]=1;q.id=id;q.ord=i;return q;});
var db=mongoose.connection.db,c=db.collection('contracts3');
var prev=await c.find({},{projection:{_id:0}}).sort({ord:1}).toArray();
if(!docs.length&&prev.length>1){return res.status(409).json({message:'refuse to wipe'});}
var h=db.collection('contracts3_hist');var last=await h.find({}).sort({ts:-1}).limit(1).toArray();var now=Date.now();
if(prev.length&&(!last.length||now-last[0].ts>120000)){await h.insertOne({ts:now,rows:prev});var old=await h.find({},{projection:{ts:1}}).sort({ts:-1}).skip(60).toArray();if(old.length){await h.deleteMany({ts:{$in:old.map(function(z){return z.ts;})}});}}
if(docs.length){await c.bulkWrite(docs.map(function(d){return {replaceOne:{filter:{id:d.id},replacement:d,upsert:true}};}));}
await c.deleteMany({id:{$nin:docs.map(function(d){return d.id;})}});
res.json({ok:true,n:docs.length});}catch(err){res.status(500).json({message:err.message});}});
app.get('/api/con3/hist',async function(req,res){try{var a=await mongoose.connection.db.collection('contracts3_hist').find({},{projection:{ts:1,rows:1}}).sort({ts:-1}).toArray();res.json(a.map(function(z){return {ts:z.ts,at:new Date(z.ts).toISOString(),contracts:(z.rows||[]).length};}));}catch(err){res.status(500).json({message:err.message});}});
app.get('/api/con3/hist/:ts',async function(req,res){try{var z=await mongoose.connection.db.collection('contracts3_hist').findOne({ts:Number(req.params.ts)},{projection:{_id:0}});res.json(z||{});}catch(err){res.status(500).json({message:err.message});}});
app.get('/api/reg',async function(req,res){try{var a=await mongoose.connection.db.collection('payreg').find({},{projection:{_id:0}}).sort({ord:1}).toArray();res.json(a);}catch(err){res.status(500).json({message:err.message});}});
app.post('/api/reg/save',async function(req,res){try{var r=req.body&&req.body.rows;if(!Array.isArray(r)){return res.status(400).json({message:'bad'});}
var clean=function(o,d){if(d>6){return null;}if(Array.isArray(o)){return o.map(function(x){return clean(x,d+1);});}if(o&&typeof o==='object'){var q={};Object.keys(o).forEach(function(k){if(k.charAt(0)==='$'||k.indexOf('.')>=0){return;}q[k]=clean(o[k],d+1);});return q;}if(typeof o==='string'){return o.slice(0,5000);}return o;};
var seen={};var docs=r.map(function(x,i){var q=clean(x,0)||{};var id=String(q.id==null||q.id===''?('k'+Date.now().toString(36)+i):q.id);if(seen[id]){id=id+'_'+i;}seen[id]=1;q.id=id;q.ord=i;return q;});
var db=mongoose.connection.db,c=db.collection('payreg');
var prev=await c.find({},{projection:{_id:0}}).sort({ord:1}).toArray();
if(!docs.length&&prev.length>1){return res.status(409).json({message:'refuse to wipe'});}
var h=db.collection('payreg_hist');var last=await h.find({}).sort({ts:-1}).limit(1).toArray();var now=Date.now();
if(prev.length&&(!last.length||now-last[0].ts>120000)){await h.insertOne({ts:now,rows:prev});var old=await h.find({},{projection:{ts:1}}).sort({ts:-1}).skip(60).toArray();if(old.length){await h.deleteMany({ts:{$in:old.map(function(z){return z.ts;})}});}}
if(docs.length){await c.bulkWrite(docs.map(function(d){return {replaceOne:{filter:{id:d.id},replacement:d,upsert:true}};}));}
await c.deleteMany({id:{$nin:docs.map(function(d){return d.id;})}});
res.json({ok:true,n:docs.length});}catch(err){res.status(500).json({message:err.message});}});
app.get('/api/smr/export',async function(req,res){try{
var f={deleted:{$ne:true}};if(req.query.code){f.objCode=String(req.query.code);}
var rows=await col('smr_rows').find(f).sort({objCode:1,order:1}).toArray();
var wb=new ExcelJS.Workbook(),ws=wb.addWorksheet('SMR');ws.addRow(COLS);ws.getRow(1).font={bold:true};
[14,34,26,26,40,9,12,12,12].forEach(function(w,i){ws.getColumn(i+1).width=w;});
rows.forEach(function(r){ws.addRow([r.objCode||'',r.objName||'',r.discipline||'',r.workType||'',r.workName||'',r.uom||'',r.qty||0,r.mh||0,r.mach||0]);});
res.setHeader('Content-Type','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
var nm=(req.query.code?String(req.query.code):'SMR')+'.xlsx';
res.setHeader('Content-Disposition',"attachment; filename=smr_export.xlsx; filename*=UTF-8''"+encodeURIComponent(nm));
await wb.xlsx.write(res);res.end();
}catch(err){res.status(500).json({message:'\u041e\u0448\u0438\u0431\u043a\u0430 \u0441\u0435\u0440\u0432\u0435\u0440\u0430: '+err.message});}});
})();
// ===== PREP GRID (shared state) =====
global._pgLoad=async function(){var d=await mongoose.connection.db.collection('prep_grid').findOne({_id:'main'});var s=JSON.stringify({data:d?d.data:null,rev:d?(d.rev||0):0,updatedAt:d?d.updatedAt:null,by:d?d.by:null});global._pgc={t:Date.now(),s:s};return s;};setTimeout(function(){global._pgLoad().catch(function(){});},6000);
app.get('/api/prepgrid',async function(req,res){try{var c=global._pgc;var sj=(c&&Date.now()-c.t<300000)?c.s:await global._pgLoad();res.type('json').send(sj);}catch(e){res.status(500).json({error:String(e.message||e)});}});
app.put('/api/prepgrid',express.text({type:'*/*',limit:'30mb'}),async function(req,res){try{res.on('finish',function(){global._pgc=null;});var col=mongoose.connection.db.collection('prep_grid');var s=typeof req.body==='string'?req.body:'';var p=JSON.parse(s);if(!p||!p.t){return res.status(400).json({error:'bad data'});}var u=req.session&&req.session.user;var by=(u&&(u.email||u.username||u.name||u.login))||null;var cur=await col.findOne({_id:'main'});var cr=cur?(cur.rev||0):0;if(req.query.base===undefined||String(cr)!==String(req.query.base)){return res.status(409).json({data:cur?cur.data:null,rev:cr});}if(cur&&cur.data){try{var h=mongoose.connection.db.collection('prep_grid_hist');var last=await h.find({}).sort({at:-1}).limit(1).toArray();if(!last.length||Date.now()-last[0].at.getTime()>600000){await h.insertOne({at:new Date(),rev:cr,data:cur.data,by:cur.by||null});var old=await h.find({}).sort({at:-1}).skip(200).toArray();if(old.length){await h.deleteMany({_id:{$in:old.map(function(x){return x._id;})}});}}}catch(e){}}var flt={_id:'main'};if(cur){flt.rev=cr===0?{$in:[null,0]}:cr;}var r;try{r=await col.updateOne(flt,{$set:{data:s,updatedAt:new Date(),by:by},$inc:{rev:1}},{upsert:!cur});}catch(e){if(e&&e.code===11000){r=null;}else{throw e;}}if(!r||(!r.matchedCount&&!r.upsertedCount)){var c2=await col.findOne({_id:'main'});return res.status(409).json({data:c2?c2.data:null,rev:c2?(c2.rev||0):0});}try{await pgSave(s,cr+1,by);}catch(e){}res.json({ok:true,rev:cr+1});}catch(e){res.status(500).json({error:String(e.message||e)});}});
app.get('/api/prepgrid/history',async function(req,res){try{var a=await mongoose.connection.db.collection('prep_grid_hist').find({}).sort({at:-1}).limit(50).toArray();res.json(a.map(function(x){return {id:String(x._id),at:x.at,rev:x.rev,by:x.by,size:(x.data||'').length};}));}catch(e){res.status(500).json({error:String(e.message||e)});}});
app.get('/api/prepgrid/history/:id',async function(req,res){try{var x=await mongoose.connection.db.collection('prep_grid_hist').findOne({_id:new mongoose.Types.ObjectId(req.params.id)});res.type('text/plain').send(x?x.data:'');}catch(e){res.status(500).json({error:String(e.message||e)});}});
// ===== /PREP GRID =====
app.listen(PORT, () => console.log(`🚀 Port ${PORT}`));
