const form = document.getElementById('reviewForm');
const submitBtn = document.getElementById('submitBtn');
const status = document.getElementById('formStatus');
const textArea = document.getElementById('text');
const charCount = document.getElementById('charCount');
const ratingInput = document.getElementById('rating');
const starPicker = document.getElementById('starPicker');
const stars = Array.from(starPicker.querySelectorAll('.star'));
const reviewsList = document.getElementById('reviewsList');
const reviewsSummary = document.getElementById('reviewsSummary');

let selectedRating = 0;

// ── Star picker interaction ──
stars.forEach(star => {
  const value = Number(star.dataset.value);

  star.addEventListener('mouseenter', () => paintStars(value, true));
  star.addEventListener('mouseleave', () => paintStars(selectedRating, false));
  star.addEventListener('click', () => {
    selectedRating = value;
    ratingInput.value = String(value);
    paintStars(value, false);
  });
});

function paintStars(value, hovering) {
  stars.forEach(star => {
    const starValue = Number(star.dataset.value);
    star.classList.toggle('active', !hovering && starValue <= value);
    star.classList.toggle('hovering', hovering && starValue <= value);
  });
}

// ── Character counter ──
textArea.addEventListener('input', () => {
  charCount.textContent = String(textArea.value.length);
});

// ── Format a date as "12 Jul 2026, 14:05" ──
function formatDate(isoString) {
  const d = new Date(isoString);
  return d.toLocaleString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function starString(rating) {
  return '★'.repeat(rating) + '☆'.repeat(5 - rating);
}

// ── Render reviews list + summary ──
function renderReviews(reviews) {
  if (!reviews.length) {
    reviewsSummary.innerHTML = '';
    reviewsList.innerHTML = '<div class="empty-state">No reviews yet — be the first to share your experience!</div>';
    return;
  }

  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  const roundedAvg = Math.round(avg * 10) / 10;

  reviewsSummary.innerHTML = `
    <span class="avg">${roundedAvg}</span>
    <span class="stars">${starString(Math.round(avg))}</span>
    <span class="count">${reviews.length} review${reviews.length === 1 ? '' : 's'}</span>
  `;

  reviewsList.innerHTML = reviews.map(r => `
    <div class="review-card">
      <div class="review-top">
        <span class="stars">${starString(r.rating)}</span>
        <span class="review-date">${formatDate(r.date)}</span>
      </div>
      <div class="review-text"></div>
    </div>
  `).join('');

  // Set text via textContent (not innerHTML) to avoid any HTML injection from review text
  const textNodes = reviewsList.querySelectorAll('.review-text');
  reviews.forEach((r, i) => { textNodes[i].textContent = r.text; });
}

// ── Load reviews from the server ──
async function loadReviews() {
  try {
    const res = await fetch('/api/reviews');
    if (!res.ok) throw new Error('Failed to load reviews');
    const reviews = await res.json();
    renderReviews(reviews);
  } catch (err) {
    console.error(err);
    reviewsList.innerHTML = '<div class="empty-state">Couldn\'t load reviews right now. Please refresh the page.</div>';
  }
}

// ── Submit a new review ──
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!selectedRating) {
    status.textContent = '❌ Please select a star rating.';
    status.className = 'form-status error';
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = 'Submitting…';
  status.textContent = '';
  status.className = 'form-status';

  try {
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        rating: selectedRating,
        text: textArea.value
      })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Something went wrong.');
    }

    status.textContent = '✅ Thanks for your feedback!';
    status.className = 'form-status success';
    form.reset();
    charCount.textContent = '0';
    selectedRating = 0;
    ratingInput.value = '';
    paintStars(0, false);

    await loadReviews();
  } catch (err) {
    status.textContent = `❌ ${err.message}`;
    status.className = 'form-status error';
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Submit Review';
  }
});

loadReviews();
