import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import compression from 'compression';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const isVercel = Boolean(process.env.VERCEL);

// Optional persistent Redis REST support on Vercel (KV / Upstash)
const kvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const KV_KEY = 'humas_itjen_db';

// Path to data files
const dbCandidates = [
  path.join(__dirname, 'data', 'db.json'),
  path.join(process.cwd(), 'server', 'data', 'db.json'),
  path.join(process.cwd(), 'public', 'assets', 'db.json')
];
const dbPath = dbCandidates.find(p => fs.existsSync(p)) || dbCandidates[0];
const tmpDbPath = '/tmp/db.json';

const uploadsDir = isVercel ? '/tmp/uploads' : path.join(__dirname, 'uploads');
const publicUploadsDir = path.join(__dirname, '..', 'public', 'uploads');

try {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
} catch (err) {
  console.error('Upload dir notice:', err.message);
}

let sharpModule = null;
async function getSharp() {
  if (sharpModule !== null) return sharpModule;
  try {
    const mod = await import('sharp');
    sharpModule = mod.default || mod;
  } catch {
    sharpModule = false;
  }
  return sharpModule;
}

// Helper to read DB
async function readDb() {
  try {
    if (isVercel && kvUrl && kvToken) {
      try {
        const res = await fetch(kvUrl, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${kvToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(['GET', KV_KEY])
        });
        if (res.ok) {
          const payload = await res.json();
          if (payload && typeof payload.result === 'string' && payload.result.trim()) {
            return JSON.parse(payload.result);
          }
        }
      } catch (kvErr) {
        console.error('KV read notice:', kvErr.message);
      }
    }

    if (isVercel && fs.existsSync(tmpDbPath)) {
      return JSON.parse(fs.readFileSync(tmpDbPath, 'utf8'));
    }

    const raw = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading DB:', err);
    return {};
  }
}

// Helper to write DB
async function writeDb(data) {
  const jsonStr = JSON.stringify(data, null, 2);
  try {
    if (isVercel) {
      try {
        fs.writeFileSync(tmpDbPath, jsonStr, 'utf8');
      } catch (tmpErr) {
        console.error('Tmp DB write notice:', tmpErr.message);
      }
      if (kvUrl && kvToken) {
        try {
          await fetch(kvUrl, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${kvToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(['SET', KV_KEY, jsonStr])
          });
        } catch (kvErr) {
          console.error('KV write notice:', kvErr.message);
        }
      }
      return true;
    }

    fs.writeFileSync(dbPath, jsonStr, 'utf8');
    const publicDbPath = path.join(__dirname, '..', 'public', 'assets', 'db.json');
    if (fs.existsSync(publicDbPath)) {
      fs.writeFileSync(publicDbPath, jsonStr, 'utf8');
    }
    return true;
  } catch (err) {
    console.error('Error writing DB:', err);
    return false;
  }
}

// Multer storage for uploads
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, 'file-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: isVercel ? multer.memoryStorage() : diskStorage,
  limits: { fileSize: 15 * 1024 * 1024 }
});

// Middlewares
app.use(compression());
app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

if (!isVercel) {
  // Static files with Cache-Control for ultra-fast mobile loading
  app.use('/uploads', express.static(uploadsDir, { maxAge: '7d' }));
  if (fs.existsSync(publicUploadsDir)) {
    app.use('/uploads', express.static(publicUploadsDir, { maxAge: '7d' }));
  }
  app.use('/documents', express.static(path.join(__dirname, '..', 'public', 'documents'), { maxAge: '7d' }));
  app.use('/assets', express.static(path.join(__dirname, '..', 'public', 'assets'), { maxAge: '7d' }));

  const distDir = path.join(__dirname, '..', 'dist');
  if (fs.existsSync(distDir)) {
    app.use(express.static(distDir, { maxAge: '1d' }));
  }
}

// Authentication
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const isValid = 
    (username === 'humas@gmail.com' && password === 'itjenhumas123') ||
    (username === 'humasitjen' && password === 'humas2026') ||
    (username === 'humas@gmail.com' && password === 'humas2026') ||
    (username === 'humasitjen' && password === 'itjenhumas123');

  if (isValid) {
    return res.json({
      success: true,
      token: 'itjen-token-' + Date.now(),
      user: {
        username: username,
        email: username.includes('@') ? username : 'humas@gmail.com',
        name: 'Administrator Humas Itjen',
        role: 'admin'
      }
    });
  }
  return res.status(401).json({
    success: false,
    message: 'Kombinasi nama pengguna atau kata sandi tidak sesuai.'
  });
});

// File upload endpoint with auto-compression for fast mobile loading
app.post('/api/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Tidak ada file yang diunggah.' });
  }

  const ext = path.extname(req.file.originalname || req.file.filename || '').toLowerCase();
  const isImage = ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
  const docMimeByExt = {
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.xls': 'application/vnd.ms-excel',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.ppt': 'application/vnd.ms-powerpoint',
    '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    '.txt': 'text/plain;charset=utf-8'
  };

  if (isVercel) {
    let mime = docMimeByExt[ext] || req.file.mimetype || 'application/octet-stream';
    try {
      let buf = req.file.buffer;
      if (isImage) {
        mime = 'image/jpeg';
        const sharp = await getSharp();
        if (sharp) {
          const meta = await sharp(buf).metadata();
          let pipeline = sharp(buf);
          if ((meta.width || 0) > 1000 || (meta.height || 0) > 1000) {
            pipeline = pipeline.resize(1000, 1000, { fit: 'inside', withoutEnlargement: true });
          }
          if (ext === '.png') {
            buf = await pipeline.png({ quality: 80, compressionLevel: 8 }).toBuffer();
            mime = 'image/png';
          } else {
            buf = await pipeline.jpeg({ quality: 78, mozjpeg: true }).toBuffer();
            mime = 'image/jpeg';
          }
        }
      }
      const dataUrl = `data:${mime};base64,${buf.toString('base64')}`;
      return res.json({
        success: true,
        url: dataUrl,
        filename: req.file.originalname,
        originalName: req.file.originalname,
        size: buf.length
      });
    } catch (err) {
      console.error('Vercel upload notice:', err.message);
      const fallbackUrl = `data:${mime};base64,${req.file.buffer.toString('base64')}`;
      return res.json({
        success: true,
        url: fallbackUrl,
        filename: req.file.originalname,
        originalName: req.file.originalname,
        size: req.file.size
      });
    }
  }

  try {
    if (isImage) {
      const sharp = await getSharp();
      if (sharp) {
        const filePath = req.file.path;
        const meta = await sharp(filePath).metadata();
        let pipeline = sharp(filePath);
        if ((meta.width || 0) > 1200 || (meta.height || 0) > 1200) {
          pipeline = pipeline.resize(1200, 1200, { fit: 'inside', withoutEnlargement: true });
        }
        if (ext === '.png') {
          pipeline = pipeline.png({ quality: 80, compressionLevel: 8 });
        } else {
          pipeline = pipeline.jpeg({ quality: 80, mozjpeg: true });
        }
        const buf = await pipeline.toBuffer();
        fs.writeFileSync(filePath, buf);
      }
    }
  } catch (err) {
    console.error('Image optimization notice:', err.message);
  }

  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({
    success: true,
    url: fileUrl,
    filename: req.file.filename,
    originalName: req.file.originalname,
    size: req.file.size
  });
});

// GET all data
app.get('/api/all', async (req, res) => {
  const db = await readDb();
  res.json(db);
});

// PROFILE
app.get('/api/profile', async (req, res) => {
  const db = await readDb();
  res.json(db.profile || {});
});

app.put('/api/profile', async (req, res) => {
  const db = await readDb();
  db.profile = { ...db.profile, ...req.body };
  await writeDb(db);
  res.json({ success: true, data: db.profile });
});

// NEWS (BERITA)
app.get('/api/news', async (req, res) => {
  const db = await readDb();
  res.json(db.news || []);
});

app.post('/api/news', async (req, res) => {
  const db = await readDb();
  if (!db.news) db.news = [];
  const newItem = {
    id: 'berita-' + Date.now(),
    views: 0,
    tanggal: new Date().toISOString().split('T')[0],
    ...req.body
  };
  db.news.unshift(newItem);
  await writeDb(db);
  res.status(201).json({ success: true, data: newItem });
});

app.put('/api/news/:id', async (req, res) => {
  const db = await readDb();
  const index = (db.news || []).findIndex(n => n.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Berita tidak ditemukan' });
  }
  db.news[index] = { ...db.news[index], ...req.body };
  await writeDb(db);
  res.json({ success: true, data: db.news[index] });
});

app.delete('/api/news/:id', async (req, res) => {
  const db = await readDb();
  const initialLength = (db.news || []).length;
  db.news = (db.news || []).filter(n => n.id !== req.params.id);
  if (db.news.length === initialLength) {
    return res.status(404).json({ success: false, message: 'Berita tidak ditemukan' });
  }
  await writeDb(db);
  res.json({ success: true, message: 'Berita berhasil dihapus' });
});

// OFFICERS (PROFIL PEJABAT)
app.get('/api/officers', async (req, res) => {
  const db = await readDb();
  res.json(db.officers || []);
});

app.post('/api/officers', async (req, res) => {
  const db = await readDb();
  if (!db.officers) db.officers = [];
  const newOfficer = {
    id: 'pejabat-' + Date.now(),
    urutan: db.officers.length + 1,
    ...req.body
  };
  db.officers.push(newOfficer);
  await writeDb(db);
  res.status(201).json({ success: true, data: newOfficer });
});

app.put('/api/officers/:id', async (req, res) => {
  const db = await readDb();
  const index = (db.officers || []).findIndex(o => o.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Pejabat tidak ditemukan' });
  }
  db.officers[index] = { ...db.officers[index], ...req.body };
  await writeDb(db);
  res.json({ success: true, data: db.officers[index] });
});

app.delete('/api/officers/:id', async (req, res) => {
  const db = await readDb();
  db.officers = (db.officers || []).filter(o => o.id !== req.params.id);
  await writeDb(db);
  res.json({ success: true, message: 'Pejabat berhasil dihapus' });
});

// MEDIA (PHOTOS, VIDEOS, INFOGRAPHICS)
app.get('/api/media', async (req, res) => {
  const db = await readDb();
  res.json(db.media || { photos: [], videos: [], infographics: [] });
});

app.post('/api/media/:type', async (req, res) => {
  const type = req.params.type; // photos, videos, infographics
  const db = await readDb();
  if (!db.media) db.media = { photos: [], videos: [], infographics: [] };
  if (!db.media[type]) db.media[type] = [];

  const newItem = {
    id: `${type.slice(0, 4)}-${Date.now()}`,
    tanggal: new Date().toISOString().split('T')[0],
    ...req.body
  };
  db.media[type].unshift(newItem);
  await writeDb(db);
  res.status(201).json({ success: true, data: newItem });
});

app.put('/api/media/:type/:id', async (req, res) => {
  const { type, id } = req.params;
  const db = await readDb();
  if (!db.media || !db.media[type]) {
    return res.status(404).json({ success: false, message: 'Koleksi media tidak ditemukan' });
  }
  const index = db.media[type].findIndex(m => m.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Item media tidak ditemukan' });
  }
  db.media[type][index] = { ...db.media[type][index], ...req.body };
  await writeDb(db);
  res.json({ success: true, data: db.media[type][index] });
});

app.delete('/api/media/:type/:id', async (req, res) => {
  const { type, id } = req.params;
  const db = await readDb();
  if (!db.media || !db.media[type]) {
    return res.status(404).json({ success: false, message: 'Koleksi media tidak ditemukan' });
  }
  db.media[type] = db.media[type].filter(m => m.id !== id);
  await writeDb(db);
  res.json({ success: true, message: 'Item media berhasil dihapus' });
});

// INSPECTORATES (38 PROVINSI)
app.get('/api/inspectorates', async (req, res) => {
  const db = await readDb();
  res.json(db.inspectorates || []);
});

app.post('/api/inspectorates', async (req, res) => {
  const db = await readDb();
  if (!db.inspectorates) db.inspectorates = [];
  const newItem = {
    id: 'prov-' + (db.inspectorates.length + 1),
    ...req.body
  };
  db.inspectorates.push(newItem);
  await writeDb(db);
  res.status(201).json({ success: true, data: newItem });
});

app.put('/api/inspectorates/:id', async (req, res) => {
  const db = await readDb();
  const index = (db.inspectorates || []).findIndex(i => i.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Inspektorat Daerah tidak ditemukan' });
  }
  db.inspectorates[index] = { ...db.inspectorates[index], ...req.body };
  await writeDb(db);
  res.json({ success: true, data: db.inspectorates[index] });
});

app.delete('/api/inspectorates/:id', async (req, res) => {
  const db = await readDb();
  db.inspectorates = (db.inspectorates || []).filter(i => i.id !== req.params.id);
  await writeDb(db);
  res.json({ success: true, message: 'Inspektorat Daerah berhasil dihapus' });
});

// REGULATIONS (PERMENDAGRI, KEPMENDAGRI, SE)
app.get('/api/regulations', async (req, res) => {
  const db = await readDb();
  res.json(db.regulations || []);
});

app.post('/api/regulations', async (req, res) => {
  const db = await readDb();
  if (!db.regulations) db.regulations = [];
  const newReg = {
    id: 'reg-' + Date.now(),
    ...req.body
  };
  db.regulations.unshift(newReg);
  await writeDb(db);
  res.status(201).json({ success: true, data: newReg });
});

app.put('/api/regulations/:id', async (req, res) => {
  const db = await readDb();
  const index = (db.regulations || []).findIndex(r => r.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Regulasi tidak ditemukan' });
  }
  db.regulations[index] = { ...db.regulations[index], ...req.body };
  await writeDb(db);
  res.json({ success: true, data: db.regulations[index] });
});

app.delete('/api/regulations/:id', async (req, res) => {
  const db = await readDb();
  db.regulations = (db.regulations || []).filter(r => r.id !== req.params.id);
  await writeDb(db);
  res.json({ success: true, message: 'Regulasi berhasil dihapus' });
});

// SERVICES (INFORMASI PUBLIK, LAYANAN PUBLIK, WBS)
app.get('/api/services', async (req, res) => {
  const db = await readDb();
  res.json(db.services || {});
});

app.post('/api/services/:section', async (req, res) => {
  const { section } = req.params; // informasiPublik, layananPublik
  const db = await readDb();
  if (!db.services) db.services = { informasiPublik: [], layananPublik: [], wbs: {} };
  if (!db.services[section]) db.services[section] = [];

  const newItem = {
    id: `${section.slice(0, 3)}-${Date.now()}`,
    ...req.body
  };
  db.services[section].push(newItem);
  await writeDb(db);
  res.status(201).json({ success: true, data: newItem });
});

app.put('/api/services/:section/:id', async (req, res) => {
  const { section, id } = req.params;
  const db = await readDb();
  if (!db.services || !db.services[section]) {
    return res.status(404).json({ success: false, message: 'Bagian layanan tidak ditemukan' });
  }
  const index = db.services[section].findIndex(s => s.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Item layanan tidak ditemukan' });
  }
  db.services[section][index] = { ...db.services[section][index], ...req.body };
  await writeDb(db);
  res.json({ success: true, data: db.services[section][index] });
});

app.delete('/api/services/:section/:id', async (req, res) => {
  const { section, id } = req.params;
  const db = await readDb();
  if (!db.services || !db.services[section]) {
    return res.status(404).json({ success: false, message: 'Bagian layanan tidak ditemukan' });
  }
  db.services[section] = db.services[section].filter(s => s.id !== id);
  await writeDb(db);
  res.json({ success: true, message: 'Item layanan berhasil dihapus' });
});

app.put('/api/services/wbs/config', async (req, res) => {
  const db = await readDb();
  if (!db.services) db.services = {};
  db.services.wbs = { ...db.services.wbs, ...req.body };
  await writeDb(db);
  res.json({ success: true, data: db.services.wbs });
});

// RATINGS (PENILAIAN WEBSITE)
app.get('/api/ratings', async (req, res) => {
  const db = await readDb();
  res.json(db.ratings || []);
});

app.post('/api/ratings', async (req, res) => {
  const db = await readDb();
  if (!db.ratings) db.ratings = [];
  const newRating = {
    id: 'rate-' + Date.now(),
    tanggal: new Date().toISOString().split('T')[0],
    rating: Number(req.body.rating) || 5,
    ...req.body
  };
  db.ratings.unshift(newRating);
  await writeDb(db);
  res.status(201).json({ success: true, data: newRating });
});

app.delete('/api/ratings/:id', async (req, res) => {
  const db = await readDb();
  db.ratings = (db.ratings || []).filter(r => r.id !== req.params.id);
  await writeDb(db);
  res.json({ success: true, message: 'Penilaian berhasil dihapus' });
});

// SKM (SURVEI KEPUASAN MASYARAKAT)
app.get('/api/skm', async (req, res) => {
  const db = await readDb();
  res.json(db.skmResponses || []);
});

app.post('/api/skm', async (req, res) => {
  const db = await readDb();
  if (!db.skmResponses) db.skmResponses = [];
  const newSkm = {
    id: 'skm-' + Date.now(),
    tanggal: new Date().toISOString().split('T')[0],
    ...req.body
  };
  db.skmResponses.unshift(newSkm);
  await writeDb(db);
  res.status(201).json({ success: true, data: newSkm });
});

app.delete('/api/skm/:id', async (req, res) => {
  const db = await readDb();
  db.skmResponses = (db.skmResponses || []).filter(s => s.id !== req.params.id);
  await writeDb(db);
  res.json({ success: true, message: 'Data SKM berhasil dihapus' });
});

// JSON error handler (handles multer limits cleanly)
app.use((err, req, res, next) => {
  if (!err) return next();
  const status = err.status || (err.code === 'LIMIT_FILE_SIZE' ? 413 : 500);
  const message =
    err.code === 'LIMIT_FILE_SIZE'
      ? 'Ukuran file melebihi batas maksimal unggahan (15 MB).'
      : err.message || 'Terjadi kesalahan pada server.';
  res.status(status).json({ success: false, message });
});

// Fallback for local production SPA
if (!isVercel) {
  const distDir = path.join(__dirname, '..', 'dist');
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ error: 'Endpoint API tidak ditemukan' });
    }
    const indexPath = path.join(distDir, 'index.html');
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.send('API Server Humas Itjen Kemendagri sedang berjalan pada port ' + PORT);
    }
  });

  app.listen(PORT, () => {
    console.log(`Server API & Web Humas Itjen Kemendagri berjalan pada:`);
    console.log(`- Lokal:   http://localhost:${PORT}`);
    console.log(`- IP:      http://127.0.0.1:${PORT}`);
  });
}

export default app;
