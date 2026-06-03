let currentPage = 1;
let currentSortBy = 'release_date';
let currentOrder = 'desc';

// Load filter dropdowns on page load
document.addEventListener('DOMContentLoaded', () => {
  loadFilterOptions();
  loadMovies();
});

function loadFilterOptions() {
  fetch('/api/movies/filters')
    .then(r => r.json())
    .then(data => {
      const yearSel = document.getElementById('filter-year');
      data.years.forEach(y => {
        const opt = document.createElement('option');
        opt.value = y; opt.textContent = y;
        yearSel.appendChild(opt);
      });

      const langSel = document.getElementById('filter-language');
      data.languages.forEach(l => {
        const opt = document.createElement('option');
        opt.value = l; opt.textContent = l;
        langSel.appendChild(opt);
      });
    })
    .catch(() => {});
}

function loadMovies(page = 1) {
  currentPage = page;
  const year = document.getElementById('filter-year').value;
  const language = document.getElementById('filter-language').value;
  const sortBy = document.getElementById('sort-by').value;
  const order = document.getElementById('sort-order').value;
  currentSortBy = sortBy;
  currentOrder = order;

  updateSortIcons();

  const params = new URLSearchParams({
    page, limit: 10, sort_by: sortBy, order,
    ...(year !== 'all' && { year }),
    ...(language !== 'all' && { language }),
  });

  const tbody = document.getElementById('movies-tbody');
  tbody.innerHTML = '<tr><td colspan="6" class="loading-cell">Loading...</td></tr>';

  fetch(`/api/movies?${params}`)
    .then(r => r.json())
    .then(data => {
      renderTable(data, page);
      renderPagination(data);
    })
    .catch(() => {
      tbody.innerHTML = '<tr><td colspan="6" class="empty-cell">Failed to load data.</td></tr>';
    });
}

function renderTable(data, page) {
  const tbody = document.getElementById('movies-tbody');
  if (!data.movies || data.movies.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="empty-cell">No records found.</td></tr>';
    return;
  }

  const offset = (page - 1) * data.limit;
  tbody.innerHTML = data.movies.map((m, i) => {
    const lang = m.languages && m.languages.length > 0 ? m.languages[0] : (m.original_language || '—');
    const rating = m.vote_average != null ? m.vote_average.toFixed(1) : '—';
    return `<tr>
      <td>${offset + i + 1}</td>
      <td>${escHtml(m.title || m.original_title || '—')}</td>
      <td>${m.release_date || '—'}</td>
      <td>${m.release_year || '—'}</td>
      <td>${escHtml(lang)}</td>
      <td>${rating}</td>
    </tr>`;
  }).join('');
}

function renderPagination(data) {
  const info = document.getElementById('pagination-info');
  const controls = document.getElementById('pagination-controls');
  const { page, limit, total, total_pages } = data;

  const start = Math.min((page - 1) * limit + 1, total);
  const end = Math.min(page * limit, total);
  info.textContent = `Showing ${start} to ${end} of ${total.toLocaleString()} records${total < data._total_unfiltered ? ' (filtered)' : ''}`;

  controls.innerHTML = '';

  const prevBtn = pageBtn('←', page <= 1, () => loadMovies(page - 1));
  controls.appendChild(prevBtn);

  const pages = pagesToShow(page, total_pages);
  let lastPage = 0;
  pages.forEach(p => {
    if (p - lastPage > 1) {
      const ell = document.createElement('span');
      ell.className = 'page-ellipsis'; ell.textContent = '...';
      controls.appendChild(ell);
    }
    const btn = pageBtn(p, false, () => loadMovies(p));
    if (p === page) btn.classList.add('active');
    controls.appendChild(btn);
    lastPage = p;
  });

  const nextBtn = pageBtn('→', page >= total_pages, () => loadMovies(page + 1));
  controls.appendChild(nextBtn);
}

function pagesToShow(current, total) {
  const pages = new Set([1, total, current, current - 1, current + 1].filter(p => p >= 1 && p <= total));
  return [...pages].sort((a, b) => a - b);
}

function pageBtn(label, disabled, onClick) {
  const btn = document.createElement('button');
  btn.className = 'page-btn';
  btn.textContent = label;
  btn.disabled = disabled;
  if (!disabled) btn.addEventListener('click', onClick);
  return btn;
}

function applyFilters() { loadMovies(1); }

function resetFilters() {
  document.getElementById('filter-year').value = 'all';
  document.getElementById('filter-language').value = 'all';
  document.getElementById('sort-by').value = 'release_date';
  document.getElementById('sort-order').value = 'desc';
  loadMovies(1);
}

function toggleSort(field) {
  if (currentSortBy === field) {
    document.getElementById('sort-order').value = currentOrder === 'desc' ? 'asc' : 'desc';
  } else {
    document.getElementById('sort-by').value = field;
    document.getElementById('sort-order').value = 'desc';
  }
  loadMovies(1);
}

function updateSortIcons() {
  ['release_date', 'rating'].forEach(f => {
    const el = document.getElementById(`sort-icon-${f}`);
    if (!el) return;
    if (f === currentSortBy) {
      el.textContent = currentOrder === 'asc' ? '↑' : '↓';
    } else {
      el.textContent = '↕';
    }
  });
}

function escHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
