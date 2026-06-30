const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');

const MONGO_URI = process.env.MONGO_URI;
let db;

const DEFAULT_USERS = [
  { username: 'admin', password: '1234', name: 'Администратор' },
  { username: 'I.kenjibaev', password: '1234', name: 'Пользователь 1' },
  { username: 'user2', password: 'pass2', name: 'Пользователь 2' },
];

async function connectDB() {
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  db = client.db('dsomk');
  console.log('MongoDB подключена');

  const count = await db.collection('users').countDocuments();
  if (count === 0) {
    await db.collection('users').insertMany(DEFAULT_USERS);
    console.log('Пользователи по умолчанию добавлены');
  }
}

const DB = {
  async read(key) {
    try {
      const doc = await db.collection('data').findOne({ _id: key });
      return doc ? doc.value : [];
    } catch(e) {
      console.error('DB read error:', e);
      return [];
    }
  },
  async write(key, data) {
    try {
      await db.collection('data').updateOne(
        { _id: key },
        { $set: { value: data } },
        { upsert: true }
      );
      return true;
    } catch(e) {
      console.error('DB write error:', e);
      return false;
    }
  }
};

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await db.collection('users').findOne({ username, password });
  if (user) res.json({ ok: true, name: user.name, username: user.username });
  else res.json({ ok: false });
});

app.post('/change-password', async (req, res) => {
  const { username, oldPassword, newPassword } = req.body;
  const user = await db.collection('users').findOne({ username, password: oldPassword });
  if (!user) {
    return res.json({ ok: false, error: 'Текущий пароль неверный' });
  }
  if (!newPassword || newPassword.length < 4) {
    return res.json({ ok: false, error: 'Новый пароль должен быть не менее 4 символов' });
  }
  await db.collection('users').updateOne(
    { username },
    { $set: { password: newPassword } }
  );
  res.json({ ok: true });
});

function parseLetterCode(filename) {
  const name = filename.replace(/\.[^/.]+$/, '');
  const parts = name.split('-');
  if (parts.length < 6) return null;
  return {
    project:  parts[0],
    sender:   parts[1],
    receiver: parts[2],
    type:     parts[3],
    stage:    parts[4],
    number:   parts.slice(5).join('-'),
  };
}

app.post('/upload', upload.single('file'), async (req, res) => {
  const file = req.file;
  const parsed = parseLetterCode(file.originalname);

  if (parsed) {
    const letters = await DB.read('letters');
    const newLetter = {
      id: Date.now(),
      num: parsed.number,
      code: file.originalname.replace(/\.[^/.]+$/, ''),
      type: parsed.sender === 'AMK' ? 'in' : 'out',
      date: new Date().toISOString().split('T')[0],
      from: parsed.sender,
      to: parsed.receiver,
      subject: '',
      project: parsed.project,
      stage: parsed.stage,
      status: 'new',
      file: file.filename,
      originalname: file.originalname,
    };
    letters.push(newLetter);
    await DB.write('letters', letters);
    io.emit('letters_updated', letters);
  }

  res.json({
    filename: file.filename,
    originalname: file.originalname,
    size: file.size,
    parsed: parsed
  });
});

['wbs', 'letters', 'docs', 'equipment'].forEach(key => {
  app.get(`/api/${key}`, async (req, res) => {
    res.json(await DB.read(key));
  });
  app.post(`/api/${key}`, async (req, res) => {
    const ok = await DB.write(key, req.body);
    if (ok) {
      io.emit(`${key}_updated`, req.body);
      res.json({ ok: true });
    } else {
      res.json({ ok: false });
    }
  });
});

io.on('connection', (socket) => {
  socket.on('message', (data) => io.emit('message', data));
  socket.on('file', (data) => io.emit('file', data));
});

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  server.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));
}).catch(err => {
  console.error('Ошибка подключения к MongoDB:', err);
  process.exit(1);
});