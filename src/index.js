const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const multer = require('multer');
const fs = require('fs');
const { checkUser } = require('./users');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = checkUser(username, password);
  if (user) {
    res.json({ ok: true, name: user.name });
  } else {
    res.json({ ok: false });
  }
});

app.post('/upload', upload.single('file'), (req, res) => {
  res.json({
    filename: req.file.filename,
    originalname: req.file.originalname,
    size: req.file.size
  });
});

io.on('connection', (socket) => {
  socket.on('message', (data) => {
    io.emit('message', data);
  });
  socket.on('file', (data) => {
    io.emit('file', data);
  });
});

server.listen(3000, () => {
  console.log('Сервер запущен на порту 3000');
});