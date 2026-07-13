const mongoose = require("mongoose");
// Одна запись хронологии (журнал проделанных работ)
const chronoSchema = new mongoose.Schema({
  code:    { type: String, default: "" },     // код проекта (PSP01...), пусто если проект вне списка
  project: { type: String, required: true },  // название проекта (текст)
  org:     { type: String, default: "" },     // организация (SOMK, Metso, HATCH...)
  text:    { type: String, required: true },  // что сделано
  date:    { type: Date, required: true },    // дата выполнения работы
  author:  { type: String, default: "" },     // кто добавил
  created: { type: Date, default: Date.now },
  history: [{ user: String, action: String, at: Date }]
});
chronoSchema.index({ project: 1, date: -1 });
module.exports = mongoose.model("Chrono", chronoSchema);
