const Anthropic = require('@anthropic-ai/sdk');
const mongoose = require('mongoose');
const MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-5-5';
const SYSTEM = 'Ты ассистент сайта UPMO (платформа отчётности дирекции строительства ДСОМК). Отвечай только по-русски, кратко, и только по сайту и проектам, данные которых доступны через инструменты. На любые другие темы вежливо отвечай, что помогаешь только по сайту UPMO и его проектам. Все цифры бери только из инструментов, ничего не выдумывай. Если данных нет, так и скажи.';
module.exports = function (app, h) {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const db = () => mongoose.connection.db;
  const sum = (rows, f) => rows.reduce((s, r) => s + (r[f] || 0), 0);
  const TOOLS = [
    { name: 'list_projects', description: 'Список всех проектов и объектов с суммой, выполнением и процентами плана/факта', input_schema: { type: 'object', properties: {} } },
    { name: 'project_summary', description: 'Подробная сводка по одному проекту или объекту по коду (например CSM01 или CSM01-SA) с разбивкой по этапам', input_schema: { type: 'object', properties: { code: { type: 'string' } }, required: ['code'] } }
  ];
  async function run(name, input) {
    if (name === 'list_projects') {
      const rs = await db().collection('reports').find({}).toArray();
      return rs.map(r => { const rows = r.rows || []; const cost = sum(rows, 'cost'); const done = sum(rows, 'done'); return { code: r.code, cost, done, planPct: h.calcPlanPct(rows, cost), factPct: cost ? Math.min(100, Math.round(done / cost * 100)) : 0 }; });
    }
    if (name === 'project_summary') {
      const r = await db().collection('reports').findOne({ code: String(input.code || '') });
      if (!r || !r.rows) return { error: 'Нет данных по этому коду' };
      const rows = r.rows; const cost = sum(rows, 'cost');
      const stages = h.getStagesForCode(r.code).map(n => { const x = rows.filter(q => q.stage === n); const c = sum(x, 'cost'); return { name: n, cost: c, done: sum(x, 'done'), paid: sum(x, 'costFact'), planPct: h.calcPlanPct(x, c) }; });
      return { code: r.code, cost, done: sum(rows, 'done'), paid: sum(rows, 'costFact'), planPct: h.calcPlanPct(rows, cost), stages };
    }
    return { error: 'Неизвестный инструмент' };
  }
  app.post('/api/assistant', async (req, res) => {
    try {
      let msgs = (req.body.messages || []).slice(-10).map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: String(m.content || '').slice(0, 4000) }));
      if (!msgs.length) return res.status(400).json({ error: 'empty' });
      for (let i = 0; i < 6; i++) {
        const r = await client.messages.create({ model: MODEL, max_tokens: 1500, system: SYSTEM, tools: TOOLS, messages: msgs });
        if (r.stop_reason !== 'tool_use') return res.json({ reply: r.content.filter(b => b.type === 'text').map(b => b.text).join('\n') });
        msgs.push({ role: 'assistant', content: r.content });
        const out = [];
        for (const b of r.content) if (b.type === 'tool_use') { let v; try { v = await run(b.name, b.input); } catch (e) { v = { error: e.message }; } out.push({ type: 'tool_result', tool_use_id: b.id, content: JSON.stringify(v) }); }
        msgs.push({ role: 'user', content: out });
      }
      res.json({ reply: 'Не удалось завершить ответ, попробуйте переформулировать.' });
    } catch (e) { res.status(500).json({ error: 'Ошибка ассистента: ' + e.message }); }
  });
};
