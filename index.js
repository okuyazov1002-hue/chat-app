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
  async read(key) {
    try {
      const doc = await db.collection('data').findOne({ _id: key });
      return doc ? doc.value : null;
    } catch (e) {
      console.error('DB read error:', e);
      return null;
    }
  },
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

app.get('/api/dashboard', async (req, res) => {
  const data = await DB.read('dashboard');
  res.json(data || null);
});

app.post('/api/dashboard', async (req, res) => {
  const ok = await DB.write('dashboard', req.body);
  if (ok) {
    io.emit('dashboard_updated', req.body);
    res.json({ ok: true });
  } else {
    res.json({ ok: false });
  }
});

io.on('connection', (socket) => {
});

const PORT = process.env.PORT || 3000;
connectDB().then(() => {
  server.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));
}).catch(err => {
  console.error('Ошибка подключения к MongoDB:', err);
  process.exit(1);
});