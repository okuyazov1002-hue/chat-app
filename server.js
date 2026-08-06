require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo").default || require("connect-mongo");
const bcrypt = require("bcrypt");
const User = require("./models/User");
const Report = require("./models/Report");
const Chrono = require("./models/Chrono");
function adminOnly(req, res, next) {
  if (!req.session.userId) return res.status(401).json({ message: "Не авторизован" });
  if (req.session.role !== "admin" && req.session.role !== "developer") return res.status(403).json({ message: "Только для администратора" });
  next();
}
function developerOnly(req, res, next) {
  if (!req.session.userId) return res.status(401).json({ message: "Не авторизован" });
  if (req.session.role !== "developer") return res.status(403).json({ message: "Только для разработчика" });
  next();
}

const app = express();
const PORT = process.env.PORT || 3000;

// Подключение к MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ База данных подключена"))
  .catch((err) => console.error("❌ Ошибка подключения к базе:", err.message));

// Чтение данных из форм
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "10mb" }));

// Сессии (память о том, кто вошёл)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "temp-secret-change-me",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 }, // 7 дней
  })
);

// Раздача файлов из папки public
app.use(express.static("public"));

// Регистрация (создание пользователя)
app.post("/api/register", developerOnly, async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Заполните логин и пароль" });
    }
    const exists = await User.findOne({ username });
    if (exists) {
      return res.status(400).json({ message: "Такой логин уже занят" });
    }
    const hash = await bcrypt.hash(password, 10);
    await User.create({ username, password: hash });
    res.json({ message: "Пользователь создан" });
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера: " + err.message });
  }
});

// Вход
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Неверный логин или пароль" });
    }
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ message: "Неверный логин или пароль" });
    }
    req.session.userId = user._id;
    req.session.role = user.role || "user";
    res.json({ message: "Вход выполнен" });
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера: " + err.message });
  }
});

// Главная страница: пускаем только вошедших
app.get("/", (req, res) => {
  if (!req.session.userId) {
    return res.redirect("/login.html");
  }
  res.sendFile(__dirname + "/public/main.html");
});

// Кто я (для показа имени на странице)
app.get("/api/me", async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Не авторизован" });
  }
  const user = await User.findById(req.session.userId);
  res.json({ username: user.username, name: user.name || user.username, role: user.role || "user", avatar: user.avatar || "" });
});

// Выход
app.post("/api/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ message: "Вы вышли" });
  });
});

// Смена пароля
app.post("/api/change-password", async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Не авторизован" });
    }
    const { oldPassword, newPassword } = req.body;
    if (!newPassword || newPassword.length < 4) {
      return res.status(400).json({ message: "Новый пароль слишком короткий" });
    }
    const user = await User.findById(req.session.userId);
    const ok = await bcrypt.compare(oldPassword, user.password);
    if (!ok) {
      return res.status(401).json({ message: "Старый пароль неверный" });
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: "Пароль изменён" });
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера: " + err.message });
  }
});
// ===== ПОЛЬЗОВАТЕЛИ (только admin) =====

// Список пользователей
app.get("/api/users", developerOnly, async (req, res) => {
  try {
    const users = await User.find({}, "username role createdAt").sort({ createdAt: 1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера: " + err.message });
  }
});

// Создать пользователя
app.post("/api/users", developerOnly, async (req, res) => {
  try {
    const { username, password, role, name } = req.body;
    if (!username || !password) return res.status(400).json({ message: "Укажите логин и пароль" });
    const exists = await User.findOne({ username });
    if (exists) return res.status(409).json({ message: "Такой логин уже есть" });
    const hash = await bcrypt.hash(password, 10);
    const safeRole = ["developer", "admin"].includes(role) ? role : "user";
    await User.create({ username, password: hash, name: name || "", role: safeRole });
    res.json({ message: "Пользователь создан" });
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера: " + err.message });
  }
});

// Сменить роль
app.patch("/api/users/:id/role", developerOnly, async (req, res) => {
  try {
    if (String(req.params.id) === String(req.session.userId))
      return res.status(400).json({ message: "Нельзя менять роль самому себе" });
    const role = ["developer", "admin"].includes(req.body.role) ? req.body.role : "user";
    await User.updateOne({ _id: req.params.id }, { role });
    res.json({ message: "Роль обновлена" });
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера: " + err.message });
  }
});

// Сбросить пароль до стандартного
app.post("/api/users/:id/reset-password", developerOnly, async (req, res) => {
  try {
    const hash = await bcrypt.hash("1234", 10);
    await User.updateOne({ _id: req.params.id }, { password: hash });
    res.json({ message: "Пароль сброшен на 1234" });
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера: " + err.message });
  }
});
// Удалить пользователя
app.delete("/api/users/:id", developerOnly, async (req, res) => {
  try {
    if (String(req.params.id) === String(req.session.userId))
      return res.status(400).json({ message: "Нельзя удалить самого себя" });
    await User.deleteOne({ _id: req.params.id });
    res.json({ message: "Пользователь удалён" });
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера: " + err.message });
  }
});

// ===== ПЕРСОНАЛ =====
// Создать сотрудника (только админ)
app.post("/api/personnel", adminOnly, async (req, res) => {
  try {
    const { username, password, role, name, department, position,
      birthday, internalPhone, mobilePhone, email } = req.body;
    if (!username || !password || password.length < 4)
      return res.status(400).json({ message: "Логин и пароль (мин. 4 символа) обязательны" });
    const exists = await User.findOne({ username });
    if (exists) return res.status(400).json({ message: "Такой логин уже есть" });
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hash,
      role: role === "admin" ? "admin" : "user", name: name || "",
      department: department || "", position: position || "", birthday: birthday || "",
      internalPhone: internalPhone || "", mobilePhone: mobilePhone || "", email: email || "" });
    res.json({ _id: user._id });
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера: " + err.message });
  }
});
// Список сотрудников (все залогиненные, без паролей)
app.get("/api/personnel", async (req, res) => {
  if (!req.session.userId) return res.status(401).json({ message: "Не авторизован" });
  try {
    const users = await User.find({}, "-password").sort({ name: 1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера: " + err.message });
  }
});
// Обновить карточку: админ — любую, user — только свою
app.patch("/api/personnel/:id", async (req, res) => {
  if (!req.session.userId) return res.status(401).json({ message: "Не авторизован" });
  const isSelf = String(req.params.id) === String(req.session.userId);
  if (req.session.role !== "admin" && !isSelf)
    return res.status(403).json({ message: "Можно редактировать только свою карточку" });
  try {
    const allowed = ["department", "position", "internalPhone", "mobilePhone", "email", "avatar", "birthday"];
    const update = {};
    allowed.forEach(f => { if (req.body[f] !== undefined) update[f] = req.body[f]; });
    if (req.session.role === "admin" && req.body.name !== undefined) update.name = req.body.name;
    const user = await User.findByIdAndUpdate(req.params.id, update, { new: true, select: "-password" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера: " + err.message });
  }
});

// ===== ОТЧЁТЫ =====

// Получить отчёт по коду проекта
// Хронология: все записи (свежие сверху)
app.get("/api/chrono", async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Не авторизован" });
  }
  try {
    const entries = await Chrono.find().sort({ date: -1, created: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера: " + err.message });
  }
});
// Хронология: массовый импорт записей
app.post("/api/chrono/import", async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Не авторизован" });
  }
  try {
    const { entries } = req.body;
    if (!Array.isArray(entries) || !entries.length) {
      return res.status(400).json({ message: "Нет записей для импорта" });
    }
    const user = await User.findById(req.session.userId);
    const author = (user && (user.name || user.username)) || "";
    const docs = entries
      .filter(e => e && e.project && e.text && e.date)
      .map(e => ({
        code: "",
        project: String(e.project).trim(),
        org: e.org ? String(e.org).trim() : "",
        text: String(e.text).trim(),
        date: new Date(e.date),
        author
      }))
      .filter(e => e.date instanceof Date && !isNaN(e.date) && e.date.getFullYear() > 2000);
    if (!docs.length) return res.status(400).json({ message: "Не найдено корректных записей" });
    await Chrono.insertMany(docs);
    res.json({ ok: true, count: docs.length });
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера: " + err.message });
  }
});
// Хронология: изменить запись (автор или админ)
app.put("/api/chrono/:id", async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Не авторизован" });
  }
  try {
    const entry = await Chrono.findById(req.params.id);
    if (!entry) return res.status(404).json({ message: "Запись не найдена" });
    const user = await User.findById(req.session.userId);
    const userName = (user && (user.name || user.username)) || "";
    if (req.session.role !== "admin" && entry.author !== userName) {
      return res.status(403).json({ message: "Можно менять только свои записи" });
    }
    const { project, org, text, date } = req.body;
    if (project !== undefined) entry.project = String(project).trim();
    if (!entry.project) entry.project = entry.code || "Без проекта";
    if (org !== undefined) entry.org = String(org).trim();
    if (text !== undefined) entry.text = String(text).trim();
    if (date !== undefined) entry.date = new Date(date);
    entry.history = entry.history || [];
    entry.history.push({ user: userName, action: "изменил", at: new Date() });
    await entry.save();
    res.json(entry);
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера: " + err.message });
  }
});
// Хронология: удалить запись (автор или админ)
app.delete("/api/chrono/:id", async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Не авторизован" });
  }
  try {
    const entry = await Chrono.findById(req.params.id);
    if (!entry) return res.status(404).json({ message: "Запись не найдена" });
    const user = await User.findById(req.session.userId);
    const userName = (user && (user.name || user.username)) || "";
    if (req.session.role !== "admin" && entry.author !== userName) {
      return res.status(403).json({ message: "Можно удалять только свои записи" });
    }
    await entry.deleteOne();
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера: " + err.message });
  }
});
// Хронология: добавить запись (любой залогиненный)
app.post("/api/chrono", async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Не авторизован" });
  }
  try {
    const { code, project, org, text, date } = req.body;
    if (!project || !text || !date) {
      return res.status(400).json({ message: "Нужны проект, текст и дата" });
    }
    const user = await User.findById(req.session.userId);
    const author = (user && (user.name || user.username)) || "";
    const entry = await Chrono.create({
      code: code || "",
      project: String(project).trim(),
      org: (org ? String(org).trim() : ""),
      text: String(text).trim(),
      date: new Date(date),
      author
    });
    res.json(entry);
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера: " + err.message });
  }
});
app.get("/api/reports/:code", async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Не авторизован" });
  }
  try {
    const report = await Report.findOne({ code: req.params.code });
    res.json(report || { code: req.params.code, comment: "", rows: [] });
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера: " + err.message });
  }
});

// Сохранить отчёт (полная замена строк)
app.post("/api/reports/:code", adminOnly, async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Не авторизован" });
  }
  try {
    const { rows, comment, workforce, equipment, volumes, mobilization, notes } = req.body;
    const u = await User.findById(req.session.userId);
    const uName = (u && (u.name || u.username)) || "";
    const update = { updatedAt: new Date(), updatedBy: uName };
    if (rows !== undefined) update.rows = rows;
    if (comment !== undefined) update.comment = comment;
    if (workforce !== undefined) update.workforce = workforce;
    if (equipment !== undefined) update.equipment = equipment;
    if (notes !== undefined) update.notes = notes;
    // При новом импорте объёмов/мобилизации сдвигаем текущие данные в "предыдущий снимок"
    if (volumes !== undefined || mobilization !== undefined) {
      const existing = await Report.findOne({ code: req.params.code });
      if (existing) {
        if (volumes !== undefined) update.volumesPrev = existing.volumes || [];
        if (mobilization !== undefined) update.mobilizationPrev = existing.mobilization || [];
        update.prevUpdatedAt = existing.updatedAt || null;
      }
    }
    if (volumes !== undefined) update.volumes = volumes;
    if (mobilization !== undefined) update.mobilization = mobilization;
    const report = await Report.findOneAndUpdate(
      { code: req.params.code },
      update,
      { new: true, upsert: true }
    );
    res.json({
      message: "Сохранено",
      count: report.rows.length,
      volumes: report.volumes,
      volumesPrev: report.volumesPrev,
      mobilization: report.mobilization,
      mobilizationPrev: report.mobilizationPrev,
      prevUpdatedAt: report.prevUpdatedAt,
      updatedAt: report.updatedAt
    });
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера: " + err.message });
  }
});

// Заменить строки rows для конкретного этапа + объектов, встретившихся в присланном массиве
// (остальные объекты этого же этапа не трогаются)
app.post("/api/reports/:code/stage-rows", adminOnly, async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Не авторизован" });
  }
  try {
    const { stage, rows } = req.body;
    if (!stage || !Array.isArray(rows)) {
      return res.status(400).json({ message: "Нужны stage и rows" });
    }
    const report = await Report.findOne({ code: req.params.code });
    if (!report) {
      return res.status(404).json({ message: "Отчёт не найден" });
    }
    const affectedObjs = new Set(rows.map(r => (r.obj || "").trim()));
    const existingRows = report.rows || [];
    const keptRows = existingRows.filter(r => !(r.stage === stage && affectedObjs.has((r.obj || "").trim())));
    const incomingRows = rows.map(r => ({ ...r, stage }));
    report.rows = keptRows.concat(incomingRows);
    const u = await User.findById(req.session.userId);
    report.updatedBy = (u && (u.name || u.username)) || "";
    report.updatedAt = new Date();
    await report.save();
    res.json({ message: "Сохранено", count: report.rows.length });
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера: " + err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});