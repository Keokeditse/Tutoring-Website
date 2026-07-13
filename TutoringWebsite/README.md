# Private Tutoring Site

One Node.js/Express project serving both:

- **Poster / booking page** — `public/Index.html` (your original booking form, unchanged)
- **Reviews page** — `public/reviews.html` (review form on top, reviews list below, no names — just rating, text, and timestamp)

No external database: reviews are stored in `data/db.json`, a plain JSON file read/written with Node's built-in `fs` module.

## Project structure

```
ruconsulting-tutoring-site/
├── package.json
├── server.js              # Express app: serves public/, has the reviews API
├── data/
│   └── db.json             # reviews storage (starts empty)
└── public/
    ├── Index.html           # poster + booking form (original, untouched)
    ├── StyleSheet.css       # poster styling (original, untouched)
    ├── Emailing.js          # EmailJS booking logic (original, untouched)
    ├── reviews.html         # reviews page: form + list
    ├── reviews.css          # reviews page styling (matches poster theme)
    └── reviews.js           # star rating, submit, render list
```

## Run it

```bash
npm install
npm start
```

- Poster / booking form: **http://localhost:3000/**
- Reviews page: **http://localhost:3000/reviews**

## API

- `GET /api/reviews` — returns all reviews, newest first
- `POST /api/reviews` — body `{ rating: 1-5, text: string }`, saves a review

## Notes

- The poster page and reviews page aren't cross-linked yet (no nav menu was
  added, per "don't change anything" on the original files) — let me know
  if you'd like a small link added between them.
- Review text is inserted into the page with `textContent`, not `innerHTML`,
  so submitted text can't inject HTML/scripts.
- Nothing identifying is stored per review — just `id`, `rating`, `text`, `date`.
