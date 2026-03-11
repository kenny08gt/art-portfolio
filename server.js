'use strict';

const express      = require('express');
const jwt          = require('jsonwebtoken');
const bcrypt       = require('bcryptjs');
const multer       = require('multer');
const rateLimit    = require('express-rate-limit');
const cors         = require('cors');
const path         = require('path');
const fs           = require('fs');
require('dotenv').config();

const app         = express();
const PORT        = process.env.PORT || 4000;
const CONTENT_FILE = path.join(__dirname, 'content.json');
const UPLOADS_DIR  = path.join(__dirname, 'uploads');

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: '1mb' }));

// ── Rate limiter (login only) ─────────────────────────────────────────────────
const loginLimiter = rateLimit({
  windowMs : 15 * 60 * 1000,
  max      : 10,
  message  : { error: 'Too many login attempts. Try again in 15 minutes.' },
});

// ── JWT auth middleware ───────────────────────────────────────────────────────
function requireAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    req.user = jwt.verify(auth.slice(7), process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// ── Multer (image uploads) ────────────────────────────────────────────────────
const upload = multer({
  dest  : UPLOADS_DIR,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter(_req, file, cb) {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    cb(null, allowed.includes(file.mimetype));
  },
});

// ── Auth route ────────────────────────────────────────────────────────────────
app.post('/api/auth/login', loginLimiter, async (req, res) => {
  const { password } = req.body || {};
  if (!password) return res.status(400).json({ error: 'Password required' });

  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (!hash) return res.status(500).json({ error: 'Server not configured' });

  const match = await bcrypt.compare(password, hash);
  if (!match) return res.status(401).json({ error: 'Invalid password' });

  const token = jwt.sign({ admin: true }, process.env.JWT_SECRET, { expiresIn: '24h' });
  res.json({ token });
});

// ── Content routes ────────────────────────────────────────────────────────────
app.get('/api/content', (_req, res) => {
  try {
    const content = JSON.parse(fs.readFileSync(CONTENT_FILE, 'utf8'));
    res.json(content);
  } catch {
    res.status(500).json({ error: 'Could not read content' });
  }
});

app.put('/api/content', requireAuth, (req, res) => {
  try {
    fs.writeFileSync(CONTENT_FILE, JSON.stringify(req.body, null, 2), 'utf8');
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: 'Could not write content' });
  }
});

// ── Upload routes ─────────────────────────────────────────────────────────────
app.get('/api/uploads', requireAuth, (_req, res) => {
  const files = fs.readdirSync(UPLOADS_DIR)
    .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f))
    .map(f => '/uploads/' + f);
  res.json(files);
});

app.post('/api/upload', requireAuth, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No valid image uploaded' });

  const extMap = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp' };
  const ext     = extMap[req.file.mimetype] || '.jpg';
  const newName = req.file.filename + ext;
  const newPath = path.join(UPLOADS_DIR, newName);

  fs.renameSync(req.file.path, newPath);
  res.json({ url: '/uploads/' + newName });
});

app.delete('/api/upload/:file', requireAuth, (req, res) => {
  // path.basename prevents directory traversal
  const file     = path.basename(req.params.file);
  const filePath = path.join(UPLOADS_DIR, file);

  if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'File not found' });
  fs.unlinkSync(filePath);
  res.json({ ok: true });
});

// ── Admin panel (static) ──────────────────────────────────────────────────────
app.get('/admin', (_req, res) =>
  res.sendFile(path.join(__dirname, 'admin', 'index.html'))
);
app.use('/admin', express.static(path.join(__dirname, 'admin')));

// ── Uploads (static) ──────────────────────────────────────────────────────────
app.use('/uploads', express.static(UPLOADS_DIR));

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, '127.0.0.1', () =>
  console.log(`CMS server listening on http://127.0.0.1:${PORT}`)
);
