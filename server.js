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

app.get('/api/map-status', async (req, res) => {
  try {
    const list = await mongoose.connection.db.collection('reports').find({}, { projection: { code: 1, rows: 1 } }).toArray();
    const out = {};
    list.forEach(function (r) {
      let cost = 0, done = 0, run = 0;
      (r.rows || []).forEach(function (w) { cost += w.cost || 0; done += w.done || 0; if (w.status == 'Выполняется') run++; });
      let st = 'none';
      if (cost > 0 && done >= cost * 0.999) st = 'done';
      else if (done > 0 || run > 0) st = 'active';
      out[r.code] = { status: st, pct: cost > 0 ? Math.round(done / cost * 1000) / 10 : 0 };
    });
    res.json(out);
  } catch (err) { res.status(500).json({ error: 'server' }); }
});

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

app.get("/api/prep/objects", async (req, res) => {
  try {
    const reports = await mongoose.connection.db.collection("reports").find({ code: { $regex: "-" } }).toArray();
    const result = reports.map(r => {
      const rows = r.rows || [];
      const cost = rows.reduce((s, x) => s + (x.cost || 0), 0);
      const done = rows.reduce((s, x) => s + (x.done || 0), 0);
      const planPct = calcPlanPct(rows, cost);
      const factPct = cost ? Math.min(100, Math.round(done / cost * 100)) : 0;
      const dates = calcStageDates(rows, cost, done, planPct);
      const internalCost = rows.filter(x => (x.contractor && x.contractor.includes("Внутренний"))).reduce((s, x) => s + (x.cost || 0), 0);
      const externalCost = rows.filter(x => x.contractor === "Внешний").reduce((s, x) => s + (x.cost || 0), 0);
      const paid = rows.reduce((s, x) => s + (x.costFact || 0), 0);
      const stages = [...new Set(rows.map(x => x.stage).filter(Boolean))];
      const workType = stages.join(", ");
      return {
        code: r.code,
        cost, done, paid,
        workType,
        remDone: cost - done, remPaid: cost - paid,
        start: dates.start,
        end: dates.forecastEnd || dates.end,
        planEnd: dates.end,
        forecastEnd: dates.forecastEnd,
        deltaDays: dates.deltaDays,
        planPct,
        factPct,
        delta: factPct - planPct,
        internalCost,
        externalCost,
        updatedAt: r.updatedAt || null,
        updatedBy: r.updatedBy || null
      };
    });
    result.sort((a, b) => a.code.localeCompare(b.code));
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера: " + err.message });
  }
});
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
app.get("/api/prep/mobilization", async (req, res) => {
  try {
    const mobCode = req.query.code;
    let labels = [], plan = [], fact = [];
    if (mobCode) {
      const doc = await mongoose.connection.db.collection("data").findOne({ _id: "prep_mobilization_" + mobCode });
      if (doc && doc.value) { labels = doc.value.labels || []; plan = doc.value.plan || []; fact = doc.value.fact || []; }
    } else {
      const docs = await mongoose.connection.db.collection("data").find({ _id: { $regex: "^prep_mobilization_" } }).toArray();
      const byMonth = {};
      docs.forEach(doc => {
        const v = doc.value || {};
        (v.labels || []).forEach((k, idx) => {
          byMonth[k] = byMonth[k] || { plan: 0, fact: 0 };
          byMonth[k].plan += (v.plan || [])[idx] || 0;
          byMonth[k].fact += (v.fact || [])[idx] || 0;
        });
      });
      const keys = Object.keys(byMonth).sort();
      labels = keys;
      plan = keys.map(k => byMonth[k].plan);
      fact = keys.map(k => byMonth[k].fact);
    }
    const months = labels.map(k => k.slice(5, 7));
    const years = labels.map(k => k.slice(0, 4));
    res.json({ labels: months, years, plan, fact });
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
            updatedBy: "О. Курязов",
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
        basic.addRow([r.code, row.contractor || "", "", row.stage || "", row.item || "", "", 0, 0, row.mhPlan || 0, row.mhFact || 0, row.cost || 0, row.costFact || 0, row.planStart ? new Date(row.planStart) : "", row.planEnd ? new Date(row.planEnd) : ""]);
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
      total.addRow([r.code, contractor, "", mh, mhFact, cost, done, progress]);
    });

    const byMonth = {};
    reports.forEach(r => {
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
app.get("/api/prep/summary", async (req, res) => {
  try {
    const reports = await mongoose.connection.db.collection("reports").find({ code: { $regex: "-" } }).toArray();
    let allRows = [];
    reports.forEach(r => { allRows = allRows.concat(r.rows || []); });
    const internalRows = allRows.filter(r => r.contractor && r.contractor.includes("Внутренний"));
    const externalRows = allRows.filter(r => r.contractor === "Внешний");
    const sumCost = rows => rows.reduce((s, r) => s + (r.cost || 0), 0);
    const sumDone = rows => rows.reduce((s, r) => s + (r.done || 0), 0);
    const totalCost = sumCost(allRows);
    const done = sumDone(allRows);
    const internal = sumCost(internalRows);
    const internalDone = sumDone(internalRows);
    const external = sumCost(externalRows);
    const externalDone = sumDone(externalRows);
    const planPct = calcPlanPct(allRows, totalCost);
    const internalPlanPct = calcPlanPct(internalRows, internal);
    const externalPlanPct = calcPlanPct(externalRows, external);
    res.json({
      totalCost, internal, external, done, remaining: totalCost - done,
      internalDone, internalRemaining: internal - internalDone,
      externalDone, externalRemaining: external - externalDone,
      planPct, internalPlanPct, externalPlanPct
    });
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера: " + err.message });
  }
});
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/main.html");
});

app.get("/api/prep/scurve", async (req, res) => {
  try {
    const contractor = req.query.contractor;
    const codeFilter = req.query.code;
    let docs = await mongoose.connection.db.collection("data").find({ _id: { $regex: "^prep_cost_curve_" } }).toArray();
    if (contractor) docs = docs.filter(d => d.contractor && d.contractor.includes(contractor));
    if (codeFilter) docs = docs.filter(d => d.code === codeFilter);
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
    total = total || 1;
    const keys = Object.keys(byMonth).sort();
    const now = new Date();
    const nowKey = now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0");
    let cp = 0, cf = 0;
    const labels = [], planPerOut = [], factPerOut = [], planCum = [], factCum = [];
    keys.forEach(k => {
      cp += byMonth[k].plan; cf += byMonth[k].fact;
      labels.push(k);
      planPerOut.push(Math.round(byMonth[k].plan / total * 100 * 10) / 10);
      factPerOut.push(k <= nowKey ? Math.round(byMonth[k].fact / total * 100 * 10) / 10 : null);
      planCum.push(Math.round(cp / total * 100));
      factCum.push(k <= nowKey ? Math.round(cf / total * 100) : null);
    });
    res.json({ labels, planPer: planPerOut, factPer: factPerOut, planCum, factCum });
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера: " + err.message });
  }
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

app.post("/api/reports/import", upload.single("file"), async (req, res) => {
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
        { $set: { code, rows: byCode[code], updatedAt: new Date(), updatedBy: "О. Курязов" } },
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

app.put('/api/me/profile', async (req, res) => {
  try {
    const b = req.body || {};
    const clean = function (v) { return String(v == null ? '' : v).trim().slice(0, 200); };
    const set = { name: clean(b.name), department: clean(b.department), position: clean(b.position), birthday: clean(b.birthday), internalPhone: clean(b.internalPhone), mobilePhone: clean(b.mobilePhone), email: clean(b.email) };
    if (set.name == '') return res.status(400).json({ error: 'name required' });
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

app.get('/api/map-object/:code', async (req, res) => {
  try {
    const report = await mongoose.connection.db.collection('reports').findOne({ code: req.params.code });
    if (report == null || report.rows == null || report.rows.length == 0) {
      return res.json({ has: false, totalCost: 0, done: 0, paid: 0, planPct: 0, factPct: 0, stages: [] });
    }
    const rows = report.rows;
    const sum = function (arr, f) { return arr.reduce(function (t, x) { return t + (x[f] || 0); }, 0); };
    const totalCost = sum(rows, 'cost');
    const done = sum(rows, 'done');
    const paid = sum(rows, 'costFact');
    const planPct = calcPlanPct(rows, totalCost);
    const factPct = totalCost > 0 ? Math.round(done / totalCost * 1000) / 10 : 0;
    const names = [];
    rows.forEach(function (r) { const n = r.stage || 'Без этапа'; if (names.indexOf(n) < 0) names.push(n); });
    const stages = names.map(function (name) {
      const rs = rows.filter(function (r) { return (r.stage || 'Без этапа') == name; });
      const c = sum(rs, 'cost');
      const d = sum(rs, 'done');
      const pp = calcPlanPct(rs, c);
      const dt = calcStageDates(rs, c, d, pp);
      return { name: name, cost: c, done: d, paid: sum(rs, 'costFact'), planPct: pp, factPct: c > 0 ? Math.round(d / c * 1000) / 10 : 0, start: dt.start, end: dt.end, forecastEnd: dt.forecastEnd, deltaDays: dt.deltaDays };
    });
    stages.sort(function (x, y) { return new Date(x.start || '2100-01-01') - new Date(y.start || '2100-01-01'); });
    const starts = rows.map(function (r) { return r.planStart; }).filter(Boolean).sort(function (x, y) { return new Date(x) - new Date(y); });
    const ends = rows.map(function (r) { return r.forecastEnd || r.planEnd; }).filter(Boolean).sort(function (x, y) { return new Date(x) - new Date(y); });
    const pStart = starts.length ? starts[0] : null;
    const pEnd = ends.length ? ends[ends.length - 1] : null;
    let pForecast = null, pDelta = null;
    if (pStart && pEnd) {
      const dur = (new Date(pEnd) - new Date(pStart)) / 86400000;
      const fp = totalCost > 0 ? Math.min(100, Math.round(done / totalCost * 100)) : 0;
      pDelta = Math.round((planPct - fp) / 100 * dur);
      pForecast = new Date(new Date(pEnd).getTime() + pDelta * 86400000);
    }
    res.json({ has: true, totalCost: totalCost, done: done, paid: paid, planPct: planPct, factPct: factPct, updatedAt: report.updatedAt || null, start: pStart, end: pEnd, forecastEnd: pForecast, deltaDays: pDelta, stages: stages });
  } catch (err) { res.status(500).json({ error: 'server' }); }
});

app.listen(PORT, () => console.log(`🚀 Port ${PORT}`));
