require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 3000;

// Подключение к MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ База данных подключена"))
  .catch((err) => console.error("❌ Ошибка подключения к базе:", err.message));

app.get("/", (req, res) => {
  res.send("Сайт отчётности работает!");
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});