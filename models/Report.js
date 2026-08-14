const mongoose = require("mongoose");

// Одна строка отчёта (из Excel)
const rowSchema = new mongoose.Schema({
  stage:      { type: String, required: true }, // один из 5 этапов
  item:       { type: String, default: "" },    // вид работы (было: дисциплина / подпункт / объект)
  obj:        { type: String, default: "" },    // объект (колонка D нового шаблона)
  equip:      { type: String, default: "" },    // дисциплина / оборудование (колонка E, пусто для проектирования)
  contractor: { type: String, default: "" },    // Внутренний / Внешний
  currency:   { type: String, default: "" },    // валюта строки (Euro, UZS и т.д.)
  planStart:  { type: Date, default: null },
  planEnd:    { type: Date, default: null },
  factStart:  { type: Date, default: null },
  factEnd:    { type: Date, default: null },
  forecastEnd:{ type: Date, default: null },    // прогноз окончания
  cost:       { type: Number, default: 0 },     // стоимость без НДС
  costVat:    { type: Number, default: 0 },     // стоимость с НДС (для информации)
  costFact:   { type: Number, default: 0 },     // фактическая стоимость
  done:       { type: Number, default: 0 },     // освоено (деньги)
  status:     { type: String, default: "" },
  mhPlan:     { type: Number, default: 0 },     // чел.-часы план
  mhFact:     { type: Number, default: 0 },     // чел.-часы факт
  eqPlan:     { type: Number, default: 0 },     // маш.-часы план
  eqFact:     { type: Number, default: 0 }      // маш.-часы факт
}, { _id: false });

// Отчёт по проекту: один документ на один код проекта
const reportSchema = new mongoose.Schema({
  code:    { type: String, required: true, unique: true }, // код проекта (PSP01 и т.д.)
  comment: { type: String, default: "" },                  // текст для двойной KPI-карточки
  rows:    { type: [rowSchema], default: [] },
  workforce: { type: [{ month: String, plan: Number, fact: Number, _id: false }], default: [] },
  equipment: { type: [{ month: String, plan: Number, fact: Number, _id: false }], default: [] },
  volumes: { type: [{
    discipline: String,
    item: String,
    unit: String,
    volumePlan: Number,
    volumeFact: Number,
    mhPlan: Number,
    mhFact: Number,
    costPlan: Number,
    costFact: Number,
    planStart: Date,
    planEnd: Date,
    _id: false
  }], default: [] },
  mobilization: { type: [{ date: Date, plan: Number, fact: Number, _id: false }], default: [] },
  volumesPrev: { type: [{
    discipline: String,
    item: String,
    unit: String,
    volumePlan: Number,
    volumeFact: Number,
    mhPlan: Number,
    mhFact: Number,
    costPlan: Number,
    costFact: Number,
    planStart: Date,
    planEnd: Date,
    _id: false
  }], default: [] },
  mobilizationPrev: { type: [{ date: Date, plan: Number, fact: Number, _id: false }], default: [] },
  prevUpdatedAt: { type: Date, default: null },
  notes: { type: String, default: "" },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Report", reportSchema);