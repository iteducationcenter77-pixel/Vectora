const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname)));

// Ensure uploads directory
const UPLOAD_DIR = path.join(__dirname, 'assets', 'uploads');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const safe = Date.now() + '-' + file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    cb(null, safe);
  }
});
const upload = multer({ storage });

app.get('/api/content', (req, res) => {
  const file = path.join(__dirname, 'content.json');
  if (fs.existsSync(file)) {
    const data = fs.readFileSync(file, 'utf8');
    res.setHeader('Content-Type', 'application/json');
    res.send(data);
  } else {
    res.status(404).json({ error: 'content.json not found' });
  }
});

app.post('/api/save', (req, res) => {
  const file = path.join(__dirname, 'content.json');
  try {
    fs.writeFileSync(file, JSON.stringify(req.body, null, 2), 'utf8');
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file' });
  const rel = path.join('assets', 'uploads', req.file.filename).split(path.sep).join('/');
  res.json({ url: '/' + rel });
});

app.get('/api/ping', (req, res) => res.json({ ok: true }));

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
