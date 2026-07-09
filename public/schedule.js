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

  const allRows = [];
  allCodes.forEach(c => allRows.push(...byCode[c]));
  const allD = calc(allRows);
  if (!allD.s) {
    tab.innerHTML = `<h2 class="tab-title">Общий график</h2><p class="tab-empty">Нет данных ни по одному проекту.</p>`;
    return;
  }
  const min = allD.s;
  let max = allD.e || allD.s;
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
  // Окно 4 года (48 месяцев): K — ширина растянутого слоя в % от видимой области
  const K = Math.max(100, months.length / 48 * 100);
  const years = {};
  months.forEach(mo => years[mo.y] = (years[mo.y] || 0) + 1);
  let yearSpans = "";
  Object.keys(years).sort().forEach(y => { yearSpans += `<span style="width:${years[y] * mW}%">${y}</span>`; });
  let monthSpans = "";
  months.forEach(mo => { monthSpans += `<span style="width:${mW}%">${String(mo.m).padStart(2, "0")}</span>`; });
  const nowPos = pos(today);
  const fmtD = d => d ? d.slice(8,10) + "." + d.slice(5,7) + "." + d.slice(2,4) : "—";

  function rowHtml(name, d, cls, arrow) {
    const arr = arrow ? `<span class="sch-arr">▸</span>` : "";
    if (!d.s) {
      return `<div class="pg-row ${cls}"><span class="pg-name">${arr}${name}</span>
        <span class="pg-cell">—</span><span class="pg-cell">—</span>
        <span class="pg-cell">—</span><span class="pg-cell">—</span>
        <span class="pg-pct">—</span><span class="pg-pct">—</span><span class="pg-pct">—</span>
        <div class="pg-track"><div class="pg-zoom"></div></div></div>`;
    }
    const e = d.e || today;
    const late = d.pct < 100 && e < today;
    const diff = d.pct - d.planPct;
    const left = pos(d.s), width = Math.max(0.5, pos(e) - pos(d.s));
    let bar;
    if (!d.started && d.pct === 0) bar = `<div class="pg-bar plan-only" style="left:${left}%;width:${width}%"></div>`;
    else bar = `<div class="pg-bar" style="left:${left}%;width:${width}%"><div class="pg-fill${late ? " late" : ""}" style="width:${d.pct}%"></div></div>`;
    return `<div class="pg-row ${cls}">
      <span class="pg-name${late ? " late" : ""}">${arr}${name}</span>
      <span class="pg-cell">${fmtD(d.s)}</span><span class="pg-cell">${fmtD(d.e)}</span>
      <span class="pg-cell">${fmtD(d.fs)}</span><span class="pg-cell">${fmtD(d.fe)}</span>
      <span class="pg-pct">${d.planPct}%</span><span class="pg-pct">${d.pct}%</span>
      <span class="pg-pct${diff < 0 ? " neg" : ""}">${diff > 0 ? "+" : ""}${diff}%</span>
      <div class="pg-track"><div class="pg-zoom">${bar}</div></div></div>`;
  }

  function sectionHtml(title, bodyHtml, rows) {
    return `<div class="sch-sec">
      ${rowHtml(title, calc(rows), "sch-sec-head", true)}
      <div class="sch-body open">${bodyHtml}</div>
    </div>`;
  }

  // Подготовительные: объекты, сгруппированные по родительским проектам
  let prepBody = "";
  const prepAllRows = [];
  const parents = {};
  [...PROJECTS.main.items, ...PROJECTS.aux.items].forEach(p => { parents[p.code] = p.name; });
  const prepGroups = {};
  PROJECTS.prep.items.forEach(p => {
    prepAllRows.push(...byCode[p.code]);
    const par = p.code.split("-")[0];
    (prepGroups[par] = prepGroups[par] || []).push(p);
  });
  Object.keys(prepGroups).forEach(par => {
    const items = prepGroups[par];
    const grpRows = [];
    let objsHtml = "";
    items.forEach(p => {
      grpRows.push(...byCode[p.code]);
      objsHtml += rowHtml(p.name, calc(byCode[p.code]), "child stage");
    });
    prepBody += `<div class="sch-proj">
      ${rowHtml(parents[par] || "Общеплощадочные объекты", calc(grpRows), "sch-proj-head", true)}
      <div class="sch-body">${objsHtml}</div>
    </div>`;
  });

  // Основные/вспомогательные: проекты + этапы
  function projSection(key) {
    let body = "";
    const secRows = [];
    PROJECTS[key].items.forEach(p => {
      const rows = byCode[p.code];
      secRows.push(...rows);
      let stagesHtml = "";
      STAGES.forEach(st => {
        const sr = rows.filter(r => st.f.some(x => (r.stage || "").toLowerCase().includes(x)));
        stagesHtml += rowHtml(st.name, calc(sr), "child stage");
      });
      body += `<div class="sch-proj">
        ${rowHtml(p.name, calc(rows), "sch-proj-head", true)}
        <div class="sch-body">${stagesHtml}</div>
      </div>`;
    });
    return { body, secRows };
  }
  const mainS = projSection("main");
  const auxS = projSection("aux");

  const rowsHtml =
    sectionHtml("Подготовительные работы", prepBody, prepAllRows) +
    sectionHtml("Основные проекты", mainS.body, mainS.secRows) +
    sectionHtml("Вспомогательные проекты", auxS.body, auxS.secRows);

  const sliderHtml = K > 100
    ? `<div class="sch-slider"><input type="range" id="schSlider" min="0" max="${(K - 100).toFixed(1)}" step="0.1" value="${(K - 100).toFixed(1)}"></div>`
    : "";

  tab.innerHTML = `<h2 class="tab-title">Общий график</h2>
    <div class="prep-gantt sch-gantt" id="schGantt" style="--gw:${K}%;--gx:0%">
      <div class="pg-head"><span style="width:280px"></span><span style="width:124px;text-align:center">план нач. / оконч.</span><span style="width:124px;text-align:center">факт нач. / оконч.</span><span style="width:144px;text-align:center">прогресс: план / факт / δ</span></div>
      ${sliderHtml}
      <div class="pg-scale-year"><span></span><div class="pg-zoomer"><div class="pg-zoom">${yearSpans}</div></div></div>
      <div class="pg-scale-month"><span></span><div class="pg-zoomer"><div class="pg-zoom">${monthSpans}</div></div></div>
      <div class="pg-body">
        <div class="pg-now" id="schNow"></div>
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

  // Раскрытие/сворачивание
  tab.querySelectorAll(".sch-sec-head, .sch-proj-head").forEach(head => {
    head.style.cursor = "pointer";
    head.addEventListener("click", () => {
      const body = head.nextElementSibling;
      if (body) body.classList.toggle("open");
      head.classList.toggle("open");
    });
  });

  // Ползунок окна 4 года
  const gEl = document.getElementById("schGantt");
  function updateNow(gx) {
    const el = document.getElementById("schNow");
    const p = nowPos / 100 * K - gx;
    if (p < 0 || p > 100) { el.style.display = "none"; return; }
    el.style.display = "";
    el.style.left = `calc(672px + (100% - 672px) * ${(p / 100).toFixed(4)})`;
  }
  const slider = document.getElementById("schSlider");
  if (slider) {
    const setGx = v => { gEl.style.setProperty("--gx", v + "%"); updateNow(v); };
    slider.addEventListener("input", e => setGx(parseFloat(e.target.value)));
    setGx(parseFloat(slider.value));
  } else {
    updateNow(0);
  }
}
document.addEventListener("DOMContentLoaded", renderSchedule);