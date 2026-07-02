require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { MongoClient } = require('mongodb');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

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
  async write(key, data) {
    try {
      await db.collection('data').updateOne(
        { _id: key },
        { $set: { value: data, updatedAt: new Date().toISOString() } },
        { upsert: true }
      );
      return true;
    } catch (e) {
      console.error('DB write error:', e);
      return false;
    }
  }
};

app.use(express.json({ limit: '15mb' }));
app.use(express.static('public'));

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    if (db) {
      const user = await db.collection('users').findOne({ username, password });
      if (user) return res.json({ ok: true, name: user.name, username: user.username });
      return res.json({ ok: false });
    }
  } catch (e) {
    console.error('Login DB error, используем DEFAULT_USERS:', e.message);
  }
  const fallback = DEFAULT_USERS.find(u => u.username === username && u.password === password);
  if (fallback) res.json({ ok: true, name: fallback.name, username: fallback.username });
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

app.get('/api/dashboard', async (req, res) => {
  try {
    const doc = await db.collection('data').findOne({ _id: 'dashboard' });
    if (!doc) return res.json(null);
    res.json({ ...doc.value, _serverUpdatedAt: doc.updatedAt });
  } catch (e) {
    console.error('Dashboard read error:', e);
    res.json(null);
  }
});

app.post('/api/dashboard', async (req, res) => {
  const ok = await DB.write('dashboard', req.body);
  if (ok) {
    const doc = await db.collection('data').findOne({ _id: 'dashboard' });
    const payload = { ...req.body, _serverUpdatedAt: doc ? doc.updatedAt : req.body.updatedAt };
    io.emit('dashboard_updated', payload);
    res.json({ ok: true });
  } else {
    res.json({ ok: false });
  }
});

io.on('connection', (socket) => {
});

const PORT = process.env.PORT || 3000;
connectDB().catch(err => {
  console.error('Mongo не подключена, сервер работает в режиме без базы (данные не сохраняются):', err.message);
});
server.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));
