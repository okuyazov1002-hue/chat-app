const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { checkUser } = require('./users');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Создаём нужные папки
['uploads','data'].forEach(d => { if (!fs.existsSync(d)) fs.mkdirSync(d); });

// Хранилище данных
const DB = {
  files: {
    wbs:       'data/wbs.json',
    letters:   'data/letters.json',
    docs:      'data/docs.json',
    equipment: 'data/equipment.json',
  },
  read(key) {
    try {
      if (fs.existsSync(this.files[key])) {
        return JSON.parse(fs.readFileSync(this.files[key], 'utf8'));
      }
    } catch(e) {}
    return [];
  },
  write(key, data) {
    try {
      fs.writeFileSync(this.files[key], JSON.stringify(data, null, 2));
      return true;
    } catch(e) { return false; }
  }
};

// Загрузка файлов
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Логин
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = checkUser(username, password);
  if (user) res.json({ ok: true, name: user.name });
  else res.json({ ok: false });
});

// Загрузка файла
app.post('/upload', upload.single('file'), (req, res) => {
  res.json({
    filename: req.file.filename,
    originalname: req.file.originalname,
    size: req.file.size
  });
});

// API для данных — GET (получить) и POST (сохранить)
['wbs', 'letters', 'docs', 'equipment'].forEach(key => {
  app.get(`/api/${key}`, (req, res) => {
    res.json(DB.read(key));
  });
  app.post(`/api/${key}`, (req, res) => {
    const ok = DB.write(key, req.body);
    if (ok) {
      // Уведомляем всех пользователей об обновлении
      io.emit(`${key}_updated`, req.body);
      res.json({ ok: true });
    } else {
      res.json({ ok: false });
    }
  });
});

// Socket.io — чат
io.on('connection', (socket) => {
  socket.on('message', (data) => io.emit('message', data));
  socket.on('file', (data) => io.emit('file', data));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));