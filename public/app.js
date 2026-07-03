/* Логика дашборда ДСОМК: логин, Excel, 3 раздела, графики, socket.io */

const cssVar = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
const FACT = cssVar('--fact'), PLAN = cssVar('--plan'), LINE = cssVar('--line-soft'), GREY = cssVar('--grey');
const $ = id => document.getElementById(id);

let SESSION = null;
let DATA = null;
let charts = {};

const CAT_TITLES = {prep:'Подготовительные работы', main:'Основные проекты', aux:'Вспомогательные проекты'};
let CAT = 'main';
function normalizeData(d){
  if(!d) return {prep:null, main:null, aux:null};
  if(d.rows) return {prep:null, main:d, aux:null};
  return {prep:d.prep||null, main:d.main||null, aux:d.aux||null};
}

/* ---------- СЕССИЯ / ЛОГИН ---------- */
function loadSession(){
  try{ SESSION = JSON.parse(localStorage.getItem('dsomk_session')); }catch(e){ SESSION = null; }
}
function showApp(){
  $('loginScreen').style.display = 'none';
  $('app').style.display = 'block';
  $('userLabel').textContent = SESSION.name || SESSION.username;
  $('footerUser').textContent = SESSION.name || SESSION.username;
}
async function doLogin(){
  const username = $('loginUser').value.trim();
  const password = $('loginPass').value;
  $('loginErr').style.display = 'none';
  if(!username || !password){ $('loginErr').style.display='block'; return; }
  try{
    const r = await fetch('/login', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({username,password})});
    const j = await r.json();
    if(j.ok){
      SESSION = {username:j.username, name:j.name};
      localStorage.setItem('dsomk_session', JSON.stringify(SESSION));
      showApp(); loadData();
    } else { $('loginErr').style.display='block'; }
  }catch(e){
    $('loginErr').textContent = 'Сервер недоступен';
    $('loginErr').style.display = 'block';
  }
}
function doLogout(){
  localStorage.removeItem('dsomk_session');
  location.reload();
}
$('loginPass').addEventListener('keydown', e => { if(e.key==='Enter') doLogin(); });

/* ---------- СМЕНА ПАРОЛЯ ---------- */
function openSettings(){ $('pwErr').style.display='none'; $('oldPass').value=''; $('newPass').value=''; $('settingsModal').classList.add('show'); }
function closeSettings(){ $('settingsModal').classList.remove('show'); }
async function submitPasswordChange(){
  const oldPassword = $('oldPass').value, newPassword = $('newPass').value;
  const err = $('pwErr'); err.style.display='none';
  try{
    const r = await fetch('/change-password', {method:'POST', headers:{'Content-Type':'application/json'},
      body:JSON.stringify({username:SESSION.username, oldPassword, newPassword})});
    const j = await r.json();
    if(j.ok){ closeSettings(); toast('Пароль изменён'); }
    else { err.textContent = j.error || 'Ошибка'; err.style.display='block'; }
  }catch(e){ err.textContent='Сервер недоступен'; err.style.display='block'; }
}

function toast(msg){
  const t = $('savedToast'); t.textContent = msg || 'Сохранено';
  t.classList.add('show'); setTimeout(()=>t.classList.remove('show'), 2200);
}

/* ---------- ДАННЫЕ ---------- */
async function loadData(){
  try{
    const r = await fetch('/api/dashboard');
    DATA = normalizeData(await r.json());
  }catch(e){ DATA = normalizeData(null); }
  render();
}
async function saveData(){
  try{
    const r = await fetch('/api/dashboard', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(DATA)});
    const j = await r.json();
    if(j.ok) toast('Сохранено'); else toast('Ошибка сохранения');
  }catch(e){ toast('Сервер недоступен'); }
}

try{
  const socket = io();
  socket.on('dashboard_updated', d => { DATA = normalizeData(d); render(); toast('Данные обновлены'); });
}catch(e){ console.warn('socket.io недоступен'); }

/* ---------- EXCEL ---------- */
const fileInput = $('fileInput');
fileInput.addEventListener('change', () => { if(fileInput.files[0]) handleFile(fileInput.files[0]); fileInput.value=''; });

function handleFile(file){
  const reader = new FileReader();
  reader.onload = e => {
    try{
      const wb = XLSX.read(e.target.result, {type:'array', cellDates:true});
      const ws = wb.Sheets[wb.SheetNames[0]];
      const raw = XLSX.utils.sheet_to_json(ws, {header:1, defval:null});
      const rows = parseRows(raw);
      if(!rows.length){ alert('Не найдено строк данных. Проверьте колонки:\nПроект · Этап · Название · План начало · План окончание · Факт начало · Факт окончание · %'); return; }
      if(!DATA) DATA = normalizeData(null);
      DATA[CAT] = {
        rows,
        meta:{
          fileName: file.name,
          updatedBy: SESSION ? (SESSION.name || SESSION.username) : '—',
          updatedAt: new Date().toISOString()
        }
      };
      render(); saveData();
    }catch(err){
      console.error(err); alert('Не удалось прочитать файл: ' + err.message);
    }
  };
  reader.readAsArrayBuffer(file);
}

function norm(s){ return String(s||'').toLowerCase().replace(/\s+/g,' ').trim(); }

function parseRows(raw){
  let hIdx = -1, map = {};
  for(let i=0;i<Math.min(raw.length,10);i++){
    const cells = (raw[i]||[]).map(norm);
    const pi = cells.findIndex(c => c.includes('проект'));
    const ni = cells.findIndex(c => c.includes('назван'));
    if(pi>-1 && ni>-1){
      hIdx = i;
      map.project = pi;
      map.stage   = cells.findIndex(c => c.includes('этап'));
      map.name    = ni;
      map.planStart = cells.findIndex(c => c.includes('план') && c.includes('нач'));
      map.planEnd   = cells.findIndex(c => c.includes('план') && (c.includes('окон')||c.includes('конец')));
      map.factStart = cells.findIndex(c => c.includes('факт') && c.includes('нач'));
      map.factEnd   = cells.findIndex(c => c.includes('факт') && (c.includes('окон')||c.includes('конец')));
      map.pct       = cells.findIndex(c => c.includes('%')||c.includes('процент')||c.includes('готовност'));
      break;
    }
  }
  if(hIdx===-1) return [];
  const rows = [];
  for(let i=hIdx+1;i<raw.length;i++){
    const r = raw[i]||[];
    const project = r[map.project], name = r[map.name];
    if(project==null && name==null) continue;
    rows.push({
      project: String(project||'Без названия').trim(),
      stage:   map.stage>-1 ? String(r[map.stage]||'Прочее').trim() : 'Прочее',
      name:    String(name||'—').trim(),
      planStart: toISO(r[map.planStart]),
      planEnd:   toISO(r[map.planEnd]),
      factStart: toISO(r[map.factStart]),
      factEnd:   toISO(r[map.factEnd]),
      pct: toPct(r[map.pct])
    });
  }
  return rows;
}

function toISO(v){
  const d = toDate(v);
  return d ? d.toISOString().slice(0,10) : null;
}
function toDate(v){
  if(v==null || v==='') return null;
  if(v instanceof Date) return isNaN(v) ? null : v;
  if(typeof v==='number') return new Date(Math.round((v-25569)*86400*1000));
  const s = String(v).trim();
  let m = s.match(/^(\d{1,2})[.\/-](\d{1,2})[.\/-](\d{2,4})/);
  if(m){ let y=+m[3]; if(y<100)y+=2000; return new Date(y, +m[2]-1, +m[1]); }
  m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if(m) return new Date(+m[1], +m[2]-1, +m[3]);
  return null;
}
function toPct(v){
  if(v==null || v==='') return 0;
  if(typeof v==='number') return clamp(v<=1 && v>0 ? v*100 : v);
  const s = String(v).replace('%','').replace(',','.').trim();
  const n = parseFloat(s);
  if(isNaN(n)) return 0;
  return clamp(n<=1 && n>0 && /[.,]/.test(s) ? n*100 : n);
}
function clamp(n){ return Math.max(0, Math.min(100, Math.round(n*10)/10)); }

/* ---------- ШАБЛОН / ВЫГРУЗКА ---------- */
const HEADER = ['Проект','Этап','Название','План начало','План окончание','Факт начало','Факт окончание','%'];
function downloadTemplate(){
  const SAMPLES = {
    main: ['Металлургический цех','Сернокислотный цех','Цех электролизации меди','Шлакообогатительный цех','Склад концентрата'],
    prep: ['Планировка территории','Временные дороги'],
    aux:  ['Административно-бытовой корпус','Ремонтно-механический цех']
  };
  const wsData = [HEADER];
  (SAMPLES[CAT]||SAMPLES.main).forEach(pr => {
    wsData.push([pr,'Проектирование','Технологическая часть','01.02.2026','30.04.2026','05.02.2026','28.04.2026',100]);
    wsData.push([pr,'Поставка','Основное оборудование','01.03.2026','30.09.2026','10.03.2026','',45]);
    wsData.push([pr,'СМР','Монтаж металлоконструкций','01.05.2026','31.10.2026','03.05.2026','',30]);
  });
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(wsData), 'Данные');
  XLSX.writeFile(wb, 'dsomk-shablon.xlsx');
}
function downloadCurrent(){
  const cur = DATA ? DATA[CAT] : null;
  if(!cur || !cur.rows || !cur.rows.length){ alert('Данных пока нет'); return; }
  const fmt = iso => iso ? iso.split('-').reverse().join('.') : '';
  const wsData = [HEADER, ...cur.rows.map(r =>
    [r.project, r.stage, r.name, fmt(r.planStart), fmt(r.planEnd), fmt(r.factStart), fmt(r.factEnd), r.pct])];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(wsData), 'Данные');
  XLSX.writeFile(wb, 'dsomk-dannye.xlsx');
}

/* ---------- РАСЧЁТЫ ---------- */
function planPctAt(row, t){
  const s = row.planStart ? +new Date(row.planStart) : null;
  const e = row.planEnd   ? +new Date(row.planEnd)   : null;
  if(s==null || e==null || e<=s) return row.pct>=100 ? 100 : 0;
  if(t<=s) return 0; if(t>=e) return 100;
  return (t-s)/(e-s)*100;
}
function factPctAt(row, t, now){
  const s = row.factStart ? +new Date(row.factStart) : (row.planStart ? +new Date(row.planStart) : null);
  if(s==null || row.pct<=0) return 0;
  const end = row.factEnd ? +new Date(row.factEnd) : now;
  if(t<=s) return 0; if(t>=end) return row.pct;
  return (t-s)/(end-s)*row.pct;
}
function avg(a){ return a.length ? a.reduce((x,y)=>x+y,0)/a.length : 0; }
function monthLabel(d){ return String(d.getMonth()+1).padStart(2,'0')+'.'+String(d.getFullYear()).slice(2); }
function fmtDate(iso){ return iso ? iso.split('-').reverse().join('.') : '—'; }
function fmtDateTime(iso){
  if(!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('ru-RU') + ', ' + d.toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit'});
}
function esc(s){ return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

/* ---------- РЕНДЕР ---------- */
function render(){
  Object.values(charts).forEach(c => c.destroy()); charts = {};
  const list = $('accList'); list.innerHTML = '';

  $('catTitle').textContent = CAT_TITLES[CAT];
  const cur = DATA ? DATA[CAT] : null;
  const meta = cur && cur.meta ? cur.meta : {};
  $('fileLabel').textContent = meta.fileName || 'не загружен';
  $('updatedByLabel').textContent = meta.updatedBy || '—';
  $('updatedAtLabel').textContent = fmtDateTime(meta.updatedAt);
  $('footerUpdated').textContent = fmtDateTime(meta.updatedAt);

  const rows = cur && cur.rows ? cur.rows : [];
  if(!rows.length){
    $('projectCountLabel').textContent = 'нет данных';
    list.innerHTML = '<div class="stub">Загрузите Excel-файл, чтобы увидеть проекты</div>';
    return;
  }

  const projects = [];
  const byName = {};
  rows.forEach(r => {
    if(!byName[r.project]){ byName[r.project] = {name:r.project, rows:[]}; projects.push(byName[r.project]); }
    byName[r.project].rows.push(r);
  });
  $('projectCountLabel').textContent = projects.length + ' объектов · металлургический комплекс';

  const now = Date.now();
  projects.forEach((p, idx) => {
    const factPct = Math.round(avg(p.rows.map(r => r.pct)));
    const planPct = Math.round(avg(p.rows.map(r => planPctAt(r, now))));
    const delta = factPct - planPct;

    const stages = []; const byStage = {};
    p.rows.forEach(r => {
      if(!byStage[r.stage]){ byStage[r.stage] = {name:r.stage, rows:[]}; stages.push(byStage[r.stage]); }
      byStage[r.stage].rows.push(r);
    });

    const dates = p.rows.flatMap(r => [r.planStart, r.planEnd]).filter(Boolean).map(d => +new Date(d));
    const pStart = dates.length ? Math.min(...dates) : null;
    const pEnd   = dates.length ? Math.max(...dates) : null;

    const item = document.createElement('div');
    item.className = 'acc-item';
    item.innerHTML = `
      <div class="acc-head">
        <span class="acc-num">${String(idx+1).padStart(2,'0')}</span>
        <span class="acc-name">${esc(p.name)}</span>
        <span class="acc-mini">
          <span class="track"><span class="fill" style="width:${factPct}%"></span><span class="marker" style="left:${planPct}%"></span></span>
        </span>
        <span class="acc-pct">${factPct}%</span>
        <span class="chev"></span>
      </div>
      <div class="acc-body"><div class="inner"><div class="acc-content">

        <div class="cubes">
          <div class="cube">
            <div class="c-label">Общий прогресс</div>
            <div class="c-stats">
              <div class="c-stat"><b>${planPct}%</b><span>План на сегодня</span></div>
              <div class="c-stat fact"><b>${factPct}%</b><span>Факт</span></div>
              <div class="c-stat ${delta<0?'warn':''}"><b>${delta>0?'+':''}${delta}%</b><span>Отклонение</span></div>
            </div>
          </div>
          <div class="cube">
            <div class="c-label">Сроки и состав</div>
            <div class="c-stats">
              <div class="c-stat"><b>${pStart?fmtDate(new Date(pStart).toISOString().slice(0,10)):'—'}</b><span>Начало</span></div>
              <div class="c-stat"><b>${pEnd?fmtDate(new Date(pEnd).toISOString().slice(0,10)):'—'}</b><span>Окончание</span></div>
              <div class="c-stat fact"><b>${p.rows.length}</b><span>Работ</span></div>
            </div>
          </div>
        </div>

        <div class="stage-panels">
          ${stages.map(st => {
            const stPct = avg(st.rows.map(r => r.pct));
            return `
            <div class="stage-panel">
              <h3>${esc(st.name)}</h3>
              <div class="stage-headbar"><div class="fill" style="width:${stPct}%"></div></div>
              ${st.rows.map(r => `
                <div class="stage-item">
                  <span class="s-label">${esc(r.name)}</span>
                  <span class="s-bar"><span class="fill" style="width:${r.pct}%"></span></span>
                  <span class="s-value">${String(r.pct.toFixed(1)).replace('.',',')}%</span>
                </div>`).join('')}
            </div>`;
          }).join('')}
        </div>

        <div class="sec-title"><h2>S-кривая и график по периодам</h2><div class="rule"></div><div class="tag">план / факт, по месяцам</div></div>
        <div class="chart-box"><canvas id="scurve-${idx}"></canvas></div>

        <div class="sec-title"><h2>Диаграмма Ганта</h2><div class="rule"></div><div class="tag">по этапам, план и фактическое выполнение</div></div>
        <div class="gantt" id="gantt-${idx}"></div>

      </div></div></div>`;
    list.appendChild(item);

    renderGantt(idx, stages, pStart, pEnd, now);

    const head = item.querySelector('.acc-head');
    let inited = false;
    head.addEventListener('click', () => {
      const wasOpen = item.classList.contains('open');
      item.classList.toggle('open');
      if(!wasOpen && !inited){ inited = true; setTimeout(() => initSCurve(idx, p, pStart, pEnd, now), 80); }
    });
  });
}

/* ---------- ГАНТ ---------- */
function renderGantt(idx, stages, pStart, pEnd, now){
  const box = $('gantt-'+idx);
  if(pStart==null || pEnd==null || pEnd<=pStart){ box.innerHTML = '<div class="stub" style="padding:20px 0">Нет плановых дат</div>'; return; }
  const span = pEnd - pStart;
  const months = [];
  const d = new Date(pStart); d.setDate(1);
  while(+d <= pEnd){ months.push(new Date(d)); d.setMonth(d.getMonth()+1); }
  const step = months.length > 16 ? Math.ceil(months.length/16) : 1;
  const monthCells = months.map((m,i) => `<span>${i%step===0 ? monthLabel(m) : ''}</span>`).join('');

  const todayPct = now>=pStart && now<=pEnd ? (now-pStart)/span*100 : null;

  box.innerHTML = `
    <div class="g-months" style="grid-template-columns:150px repeat(${months.length},1fr)"><span></span>${monthCells}</div>
    ${stages.map(st => {
      const ds = st.rows.flatMap(r => [r.planStart, r.planEnd]).filter(Boolean).map(x => +new Date(x));
      if(!ds.length) return '';
      const s = Math.min(...ds), e = Math.max(...ds);
      const left = (s-pStart)/span*100, width = Math.max((e-s)/span*100, 1.5);
      const stPct = avg(st.rows.map(r => r.pct));
      return `
      <div class="g-row">
        <div class="g-label">${esc(st.name)}</div>
        <div class="g-track">
          <div class="g-bar" style="left:${left}%;width:${width}%">
            <div class="g-fact" style="width:${stPct}%"></div>
          </div>
          ${todayPct!=null ? `<div class="g-today" style="left:${todayPct}%"></div>` : ''}
        </div>
      </div>`;
    }).join('')}`;
}

/* ---------- S-КРИВАЯ ---------- */
function initSCurve(idx, p, pStart, pEnd, now){
  const canvas = $('scurve-'+idx);
  if(!canvas || charts[idx]) return;
  if(pStart==null || pEnd==null){ canvas.parentElement.innerHTML = '<div class="stub" style="padding:20px 0">Нет плановых дат</div>'; return; }

  const points = [];
  const d = new Date(pStart); d.setDate(1);
  const endD = new Date(Math.max(pEnd, now));
  while(+d <= +endD){
    const monthEnd = new Date(d.getFullYear(), d.getMonth()+1, 0);
    points.push({label: monthLabel(d), t: +monthEnd});
    d.setMonth(d.getMonth()+1);
  }
  const curMonth = points.findIndex(pt => pt.t >= now);
  const lastFact = curMonth === -1 ? points.length-1 : curMonth;

  const plan = points.map(pt => Math.round(avg(p.rows.map(r => planPctAt(r, pt.t)))));
  const fact = points.map((pt,i) => i<=lastFact ? Math.round(avg(p.rows.map(r => factPctAt(r, pt.t, now)))) : null);
  const planPeriod = plan.map((v,i) => i===0 ? v : v-plan[i-1]);
  const factPeriod = fact.map((v,i) => v==null ? null : (i===0 ? v : v-(fact[i-1]||0)));

  charts[idx] = new Chart(canvas, {
    data:{
      labels: points.map(pt => pt.label),
      datasets:[
        {type:'bar', label:'Факт (период)', data:factPeriod, backgroundColor:FACT, order:2, barPercentage:.5},
        {type:'bar', label:'План (период)', data:planPeriod, backgroundColor:PLAN, order:2, barPercentage:.5},
        {type:'line', label:'Факт накопительно', data:fact, borderColor:FACT, backgroundColor:FACT, tension:.35, pointRadius:2, borderWidth:2.5, order:1, spanGaps:false},
        {type:'line', label:'План накопительно', data:plan, borderColor:PLAN, backgroundColor:PLAN, borderDash:[5,4], tension:.35, pointRadius:0, borderWidth:2, order:1}
      ]
    },
    options:{
      responsive:true, maintainAspectRatio:false,
      plugins:{ legend:{ position:'top', labels:{ font:{family:"'IBM Plex Mono',monospace", size:10.5}, color:GREY, boxWidth:12 } } },
      scales:{
        x:{ ticks:{color:GREY, font:{family:"'IBM Plex Mono',monospace", size:10}}, grid:{color:LINE} },
        y:{ beginAtZero:true, max:100, ticks:{color:GREY, font:{family:"'IBM Plex Mono',monospace", size:10}}, grid:{color:LINE} }
      }
    }
  });
}

/* ---------- РАЗДЕЛЫ ---------- */
document.querySelectorAll('#catNav a').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    document.querySelectorAll('#catNav a').forEach(x => x.classList.remove('active'));
    a.classList.add('active');
    CAT = a.dataset.cat;
    render();
  });
});

/* ---------- СТАРТ ---------- */
loadSession();
if(SESSION){ showApp(); loadData(); }
