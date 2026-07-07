require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo").default || require("connect-mongo");
const bcrypt = require("bcrypt");
const User = require("./models/User");
const Report = require("./models/Report");

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
app.post("/api/register", async (req, res) => {
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
  res.json({ username: user.username });
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
// ===== ОТЧЁТЫ =====

// Получить отчёт по коду проекта
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
app.post("/api/reports/:code", async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Не авторизован" });
  }
  try {
    const { rows, comment } = req.body;
    const update = { updatedAt: new Date() };
    if (rows !== undefined) update.rows = rows;
    if (comment !== undefined) update.comment = comment;
    const report = await Report.findOneAndUpdate(
      { code: req.params.code },
      update,
      { new: true, upsert: true }
    );
    res.json({ message: "Сохранено", count: report.rows.length });
  } catch (err) {
    res.status(500).json({ message: "Ошибка сервера: " + err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});