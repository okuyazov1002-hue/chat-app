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

['uploads','data'].forEach(d => { if (!fs.existsSync(d)) fs.mkdirSync(d); });

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

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

app.use(express.json());
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = checkUser(username, password);
  if (user) res.json({ ok: true, name: user.name });
  else res.json({ ok: false });
});

// Разбор имени файла: HER01-AMK-EDG-L-GEN-00007
function parseLetterCode(filename) {
  const name = filename.replace(/\.[^/.]+$/, ''); // убираем расширение
  const parts = name.split('-');
  if (parts.length < 6) return null;
  return {
    project:  parts[0],           // HER01
    sender:   parts[1],           // AMK
    receiver: parts[2],           // EDG
    type:     parts[3],           // L
    stage:    parts[4],           // GEN
    number:   parts.slice(5).join('-'), // 00007
  };
}

app.post('/upload', upload.single('file'), (req, res) => {
  const file = req.file;
  const parsed = parseLetterCode(file.originalname);

  // Если имя файла соответствует формату письма — добавляем в реестр
  if (parsed) {
    const letters = DB.read('letters');
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
    DB.write('letters', letters);
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
  app.get(`/api/${key}`, (req, res) => {
    res.json(DB.read(key));
  });
  app.post(`/api/${key}`, (req, res) => {
    const ok = DB.write(key, req.body);
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
server.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));
