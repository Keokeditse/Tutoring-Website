// ═══════════════════════════════════════════════════════════════
//  Tutoring site server
//  - Serves the poster page (public/Index.html) and the reviews
//    page (public/reviews.html) from one Express app.
//  - Reviews have no external database: they're stored in
//    data/db.json and read/written with the built-in fs module.
// ═══════════════════════════════════════════════════════════════

const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'data', 'db.json');
const PUBLIC_DIR = path.join(__dirname, 'public');

app.use(express.json());
app.use(express.static(PUBLIC_DIR));

// ── Helpers: read/write the JSON "database" ──────────────────────
function readDB() {
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    // If the file is missing or corrupt, start fresh rather than crash.
    return { reviews: [] };
  }
}

function writeDB(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
}

function makeId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// ── API: list all reviews, newest first ───────────────────────────
app.get('/api/reviews', (req, res) => {
  const db = readDB();
  const sorted = [...db.reviews].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );
  res.json(sorted);
});

// ── API: submit a new review ──────────────────────────────────────
app.post('/api/reviews', (req, res) => {
  const { rating, text } = req.body || {};

  const trimmedText = typeof text === 'string' ? text.trim() : '';
  const numericRating = Number(rating);

  if (!trimmedText) {
    return res.status(400).json({ error: 'Review text is required.' });
  }
  if (trimmedText.length > 1000) {
    return res.status(400).json({ error: 'Review text is too long (max 1000 characters).' });
  }
  if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
    return res.status(400).json({ error: 'Rating must be a whole number between 1 and 5.' });
  }

  const db = readDB();
  const review = {
    id: makeId(),
    rating: numericRating,
    text: trimmedText,
    date: new Date().toISOString()
  };

  db.reviews.push(review);
  writeDB(db);

  res.status(201).json(review);
});

// ── Pages ──────────────────────────────────────────────────────────
// Poster / booking page at the root
app.get('/', (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'Index.html'));
});

// Reviews page (also reachable directly as /reviews.html via static serving)
app.get('/reviews', (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'reviews.html'));
});

app.listen(PORT, () => {
  console.log(`Tutoring site running at http://localhost:${PORT}`);
  console.log(`  Poster / booking form: http://localhost:${PORT}/`);
  console.log(`  Reviews page:          http://localhost:${PORT}/reviews`);
});
