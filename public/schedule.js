// Общий график — сводный Гант по всем проектам
async function renderSchedule() {
  const tab = document.getElementById("tab-schedule");
  if (!tab || tab.dataset.rendered) return;
  tab.dataset.rendered = "1";
  tab.innerHTML = `<h2 class="tab-title">Общий график</h2><div class="prep-loading">Загрузка данных...</div>`;

  const allCodes = [
    ...PROJECTS.prep.items,
    ...PROJECTS.main.items,
    ...PROJECTS.aux.items
  ].map(p => p.code);
  const byCode = {};
  await Promise.all(allCodes.map(async code => {
    try {
      const res = await fetch("/api/reports/" + code);
      const data = await res.json();
      byCode[code] = data.rows || [];
    } catch (e) { byCode[code] = []; }
  }));

  const today = new Date().toISOString().slice(0, 10);
  const D = v => v ? String(v).slice(0, 10) : null;
  const STAGES = [
    { name: "Базовое проектирование", f: ["базовое"] },
    { name: "Детальное проектирование", f: ["детальн"] },
    { name: "Поставка", f: ["поставка"] },
    { name: "СМР", f: ["смр", "строительн"] },
    { name: "ПНР", f: ["пнр"] }
  ];

  function calc(rows) {
    const ps = rows.map(r => D(r.planStart)).filter(Boolean).sort();
    const pe = rows.map(r => D(r.forecastEnd || r.planEnd)).filter(Boolean).sort();
    const fs = rows.map(r => D(r.factStart)).filter(Boolean).sort();
    const fe = rows.map(r => D(r.factEnd)).filter(Boolean).sort();
    const cost = rows.reduce((s, r) => s + (r.cost || 0), 0);
    const done = rows.reduce((s, r) => s + (r.done || 0), 0);
    let pct = cost ? Math.min(100, Math.round(done / cost * 100)) : 0;
    if (rows.length && rows.every(r => /заверш/i.test(r.status || ""))) pct = 100;
    let planNow = 0;
    rows.forEach(r => {
      const rs = D(r.planStart);
      if (!rs) return;
      const end = D(r.forecastEnd || r.planEnd) || today;
      if (today >= end) planNow += r.cost || 0;
      else if (today > rs) {
        const t = (new Date(today) - new Date(rs)) / (new Date(end) - new Date(rs));
        planNow += (r.cost || 0) * t;
      }
    });
    const planPct = cost ? Math.min(100, Math.round(planNow / cost * 100)) : 0;
    return { s: ps[0] || null, e: pe.length ? pe[pe.length - 1] : null,
             fs: fs[0] || null, fe: fe.length ? fe[fe.length - 1] : null,
             pct, planPct, started: rows.some(r => r.factStart) };
  }

  // Собираем строки: level 0 = проект/раздел, level 1 = объект/этап
  const lines = [];
  const prepAllRows = [];
  PROJECTS.prep.items.forEach(p => prepAllRows.push(...byCode[p.code]));
  lines.push({ name: PROJECTS.prep.title, level: 0, d: calc(prepAllRows) });
  PROJECTS.prep.items.forEach(p => {
    lines.push({ name: p.name, level: 1, d: calc(byCode[p.code]) });
  });
  ["main", "aux"].forEach(key => {
    PROJECTS[key].items.forEach(p => {
      const rows = byCode[p.code];
      lines.push({ name: p.code + " — " + p.name, level: 0, d: calc(rows) });
      STAGES.forEach(st => {
        const sr = rows.filter(r => st.f.some(x => (r.stage || "").toLowerCase().includes(x)));
        lines.push({ name: st.name, level: 1, d: calc(sr) });
      });
    });
  });

  // Общая шкала
  const has = lines.filter(l => l.d.s);
  if (!has.length) {
    tab.innerHTML = `<h2 class="tab-title">Общий график</h2><p class="tab-empty">Нет данных ни по одному проекту.</p>`;
    return;
  }
  const min = has.map(l => l.d.s).sort()[0];
  let max = has.map(l => l.d.e || l.d.s).sort().slice(-1)[0];
  if (!max || max <= min) max = today > min ? today : min;
  const t0 = new Date(min).getTime(), t1 = new Date(max).getTime();
  const pos = d => Math.max(0, Math.min(100, (new Date(d).getTime() - t0) / (t1 - t0 || 1) * 100));

  const months = [];
  const cur = new Date(min); cur.setDate(1);
  while (cur.getTime() <= t1) {
    months.push({ y: cur.getFullYear(), m: cur.getMonth() + 1 });
    cur.setMonth(cur.getMonth() + 1);
  }
  const mW = 100 / months.length;
  const years = {};
  months.forEach(mo => years[mo.y] = (years[mo.y] || 0) + 1);
  let yearRow = `<span></span>`;
  Object.keys(years).sort().forEach(y => { yearRow += `<span style="width:${years[y] * mW}%">${y}</span>`; });
  let monthRow = `<span></span>`;
  months.forEach(mo => { monthRow += `<span style="width:${mW}%">${String(mo.m).padStart(2, "0")}</span>`; });
  const nowPos = pos(today);
  const fmtD = d => d ? d.slice(8,10) + "." + d.slice(5,7) + "." + d.slice(2,4) : "—";

  let rowsHtml = "";
  lines.forEach(l => {
    const d = l.d;
    const cls = l.level === 0 ? "parent" : "child";
    if (!d.s) {
      rowsHtml += `<div class="pg-row ${cls}"><span class="pg-name">${l.name}</span>
        <span class="pg-cell">—</span><span class="pg-cell">—</span>
        <span class="pg-cell">—</span><span class="pg-cell">—</span>
        <span class="pg-pct">—</span><span class="pg-pct">—</span><span class="pg-pct">—</span>
        <div class="pg-track"></div></div>`;
      return;
    }
    const e = d.e || today;
    const late = d.pct < 100 && e < today;
    const diff = d.pct - d.planPct;
    const left = pos(d.s), width = Math.max(1, pos(e) - pos(d.s));
    let bar;
    if (!d.started && d.pct === 0) bar = `<div class="pg-bar plan-only" style="left:${left}%;width:${width}%"></div>`;
    else bar = `<div class="pg-bar" style="left:${left}%;width:${width}%"><div class="pg-fill${late ? " late" : ""}" style="width:${d.pct}%"></div></div>`;
    rowsHtml += `<div class="pg-row ${cls}">
      <span class="pg-name${late ? " late" : ""}">${l.name}</span>
      <span class="pg-cell">${fmtD(d.s)}</span><span class="pg-cell">${fmtD(d.e)}</span>
      <span class="pg-cell">${fmtD(d.fs)}</span><span class="pg-cell">${fmtD(d.fe)}</span>
      <span class="pg-pct">${d.planPct}%</span><span class="pg-pct">${d.pct}%</span>
      <span class="pg-pct${diff < 0 ? " neg" : ""}">${diff > 0 ? "+" : ""}${diff}%</span>
      <div class="pg-track">${bar}</div></div>`;
  });

  tab.innerHTML = `<h2 class="tab-title">Общий график</h2>
    <div class="prep-gantt sch-gantt">
      <div class="pg-head"><span style="width:280px"></span><span style="width:124px;text-align:center">план нач. / оконч.</span><span style="width:124px;text-align:center">факт нач. / оконч.</span><span style="width:144px;text-align:center">прогресс: план / факт / δ</span></div>
      <div class="pg-scale-year">${yearRow}</div>
      <div class="pg-scale-month">${monthRow}</div>
      <div class="pg-body">
        <div class="pg-now" style="left:calc(672px + (100% - 672px) * ${(nowPos / 100).toFixed(3)})"></div>
        ${rowsHtml}
      </div>
      <div class="pg-legend">
        <span><span class="pg-sw" style="background:#0a1e3d"></span> выполнено</span>
        <span><span class="pg-sw" style="background:#7da7d9"></span> план</span>
        <span><span class="pg-sw" style="background:#b91c1c"></span> отставание</span>
        <span><span class="pg-sw" style="background:#e5e7eb;border:1px dashed #9ca3af"></span> не начато</span>
        <span style="color:#b91c1c">│ сегодня</span>
      </div>
    </div>`;
}
document.addEventListener("DOMContentLoaded", renderSchedule);