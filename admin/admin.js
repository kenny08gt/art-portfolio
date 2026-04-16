'use strict';

/* ── Auth helpers ──────────────────────────────────────────────────────────── */
const TOKEN_KEY = 'cms_token';
const getToken  = () => sessionStorage.getItem(TOKEN_KEY);
const setToken  = t  => sessionStorage.setItem(TOKEN_KEY, t);
const clearToken = () => sessionStorage.removeItem(TOKEN_KEY);

function authHeaders() {
  return { 'Content-Type': 'application/json', Authorization: 'Bearer ' + getToken() };
}

async function api(method, url, body) {
  const opts = { method, headers: authHeaders() };
  if (body !== undefined) opts.body = JSON.stringify(body);
  const res = await fetch(url, opts);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

/* ── Toast ─────────────────────────────────────────────────────────────────── */
let toastTimer;
function toast(msg, type = 'ok') {
  const el = document.getElementById('toast');
  clearTimeout(toastTimer);
  el.textContent = msg;
  el.className   = `toast toast--${type} show`;
  toastTimer = setTimeout(() => el.classList.remove('show'), 3500);
}

/* ── State ─────────────────────────────────────────────────────────────────── */
let content = {};

/* ── Init ──────────────────────────────────────────────────────────────────── */
(function init() {
  if (getToken()) {
    showDashboard();
  } else {
    document.getElementById('loginScreen').removeAttribute('hidden');
    document.getElementById('loginPassword').focus();
  }
})();

/* ── Login ─────────────────────────────────────────────────────────────────── */
document.getElementById('loginForm').addEventListener('submit', async e => {
  e.preventDefault();
  const password = document.getElementById('loginPassword').value;
  const errEl    = document.getElementById('loginError');
  errEl.textContent = '';

  try {
    const { token } = await fetch('/api/auth/login', {
      method  : 'POST',
      headers : { 'Content-Type': 'application/json' },
      body    : JSON.stringify({ password }),
    }).then(async r => {
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || 'Login failed');
      return d;
    });

    setToken(token);
    document.getElementById('loginScreen').setAttribute('hidden', '');
    showDashboard();
  } catch (err) {
    errEl.textContent = err.message;
  }
});

/* ── Logout ────────────────────────────────────────────────────────────────── */
document.getElementById('logoutBtn').addEventListener('click', () => {
  clearToken();
  location.reload();
});

/* ── Show dashboard ────────────────────────────────────────────────────────── */
async function showDashboard() {
  document.getElementById('loginScreen').setAttribute('hidden', '');
  document.getElementById('dashboard').removeAttribute('hidden');
  try {
    content = await api('GET', '/api/content');
    populateHero();
    populateStories();
    populateSculptures();
    populateAbout();
  } catch (err) {
    toast('Failed to load content: ' + err.message, 'err');
    if (err.message.includes('401') || err.message.includes('Unauthorized')) {
      clearToken();
      location.reload();
    }
  }
}

/* ── Tabs ──────────────────────────────────────────────────────────────────── */
document.getElementById('dashTabs').addEventListener('click', e => {
  const btn = e.target.closest('.tab');
  if (!btn) return;
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
  if (btn.dataset.tab === 'images') loadImages();
});

/* ── Save helpers ──────────────────────────────────────────────────────────── */
document.querySelectorAll('.btn-save[data-section]').forEach(btn => {
  btn.addEventListener('click', () => saveSection(btn.dataset.section));
});

async function saveAll() {
  try {
    await api('PUT', '/api/content', content);
    toast('Saved successfully');
  } catch (err) {
    toast('Save failed: ' + err.message, 'err');
  }
}

async function saveSection(section) {
  collectHero();
  collectAbout();
  await saveAll();
}

/* ══════════════════════════════════════════════════════════════
   HERO
══════════════════════════════════════════════════════════════ */
function populateHero() {
  document.getElementById('hero-tagline-en').value = content.hero?.tagline?.en || '';
  document.getElementById('hero-tagline-es').value = content.hero?.tagline?.es || '';
}

function collectHero() {
  if (!content.hero) content.hero = {};
  if (!content.hero.tagline) content.hero.tagline = {};
  content.hero.tagline.en = document.getElementById('hero-tagline-en').value;
  content.hero.tagline.es = document.getElementById('hero-tagline-es').value;
}

/* ══════════════════════════════════════════════════════════════
   STORIES
══════════════════════════════════════════════════════════════ */
function populateStories() {
  const list = document.getElementById('storiesList');
  list.innerHTML = '';
  (content.stories || []).forEach(story => {
    const row = document.createElement('div');
    row.className   = 'item-row';
    row.dataset.id  = story.id;
    row.innerHTML = `
      <div>
        <div class="item-row__title">${escHtml(story.title?.en || '(untitled)')}</div>
        <div class="item-row__sub">${escHtml(story.tag?.en || '')}</div>
      </div>
      <div class="item-row__actions">
        <button class="btn-edit"   data-action="edit"   data-id="${story.id}">Edit</button>
        <button class="btn-delete" data-action="delete" data-id="${story.id}">Delete</button>
      </div>`;
    list.appendChild(row);
  });
}

document.getElementById('storiesList').addEventListener('click', e => {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;
  const id = parseInt(btn.dataset.id, 10);
  if (btn.dataset.action === 'edit')   openStoryEdit(id);
  if (btn.dataset.action === 'delete') deleteStory(id);
});

document.getElementById('addStoryBtn').addEventListener('click', () => openStoryEdit(null));

function openStoryEdit(id) {
  const panel = document.getElementById('storyEditPanel');
  document.getElementById('storyEditHeading').textContent = id ? 'Edit Story' : 'New Story';

  if (id) {
    const s = (content.stories || []).find(x => x.id === id);
    if (!s) return;
    document.getElementById('storyEditId').value        = s.id;
    document.getElementById('story-tag-en').value       = s.tag?.en       || '';
    document.getElementById('story-tag-es').value       = s.tag?.es       || '';
    document.getElementById('story-title-en').value     = s.title?.en     || '';
    document.getElementById('story-title-es').value     = s.title?.es     || '';
    document.getElementById('story-excerpt-en').value   = s.excerpt?.en   || '';
    document.getElementById('story-excerpt-es').value   = s.excerpt?.es   || '';
    document.getElementById('story-fulltext-en').value  = s.fullText?.en  || '';
    document.getElementById('story-fulltext-es').value  = s.fullText?.es  || '';
  } else {
    document.getElementById('storyEditId').value = '';
    ['tag-en','tag-es','title-en','title-es','excerpt-en','excerpt-es','fulltext-en','fulltext-es']
      .forEach(k => document.getElementById(`story-${k}`).value = '');
  }

  panel.removeAttribute('hidden');
  panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

document.getElementById('storyEditCancel').addEventListener('click', () => {
  document.getElementById('storyEditPanel').setAttribute('hidden', '');
});

document.getElementById('storyEditSave').addEventListener('click', async () => {
  const idVal = document.getElementById('storyEditId').value;
  const story = {
    id       : idVal ? parseInt(idVal, 10) : Date.now(),
    tag      : { en: val('story-tag-en'),      es: val('story-tag-es') },
    title    : { en: val('story-title-en'),    es: val('story-title-es') },
    excerpt  : { en: val('story-excerpt-en'),  es: val('story-excerpt-es') },
    fullText : { en: val('story-fulltext-en'), es: val('story-fulltext-es') },
  };

  if (!content.stories) content.stories = [];
  if (idVal) {
    const idx = content.stories.findIndex(s => s.id === story.id);
    if (idx !== -1) content.stories[idx] = story;
    else content.stories.push(story);
  } else {
    content.stories.push(story);
  }

  await saveSection('stories');
  document.getElementById('storyEditPanel').setAttribute('hidden', '');
  populateStories();
});

async function deleteStory(id) {
  if (!confirm('Delete this story?')) return;
  content.stories = (content.stories || []).filter(s => s.id !== id);
  await saveSection('stories');
  populateStories();
}

/* ══════════════════════════════════════════════════════════════
   SCULPTURES
══════════════════════════════════════════════════════════════ */
function populateSculptures() {
  const list = document.getElementById('sculpturesList');
  list.innerHTML = '';
  (content.sculptures || []).forEach(s => {
    const row = document.createElement('div');
    row.className  = 'item-row';
    row.dataset.id = s.id;
    row.innerHTML = `
      <div style="display:flex;align-items:center;gap:.75rem;flex:1;min-width:0">
        ${s.image ? `<img src="${escHtml(s.image)}" style="width:48px;height:48px;object-fit:cover;border-radius:4px;flex-shrink:0" />` : ''}
        <div>
          <div class="item-row__title">${escHtml(s.title?.en || '(untitled)')}</div>
          <div class="item-row__sub">${escHtml(s.desc?.en || '')} · ${escHtml(s.year || '')}</div>
        </div>
      </div>
      <div class="item-row__actions">
        <button class="btn-edit"   data-action="edit"   data-id="${s.id}">Edit</button>
        <button class="btn-delete" data-action="delete" data-id="${s.id}">Delete</button>
      </div>`;
    list.appendChild(row);
  });
}

document.getElementById('sculpturesList').addEventListener('click', e => {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;
  const id = parseInt(btn.dataset.id, 10);
  if (btn.dataset.action === 'edit')   openSculptureEdit(id);
  if (btn.dataset.action === 'delete') deleteSculpture(id);
});

document.getElementById('addSculptureBtn').addEventListener('click', () => openSculptureEdit(null));

function openSculptureEdit(id) {
  const panel = document.getElementById('sculptureEditPanel');
  document.getElementById('sculptureEditHeading').textContent = id ? 'Edit Sculpture' : 'New Sculpture';

  if (id) {
    const s = (content.sculptures || []).find(x => x.id === id);
    if (!s) return;
    document.getElementById('sculptureEditId').value    = s.id;
    document.getElementById('sculpture-title-en').value = s.title?.en || '';
    document.getElementById('sculpture-title-es').value = s.title?.es || '';
    document.getElementById('sculpture-desc-en').value  = s.desc?.en  || '';
    document.getElementById('sculpture-desc-es').value  = s.desc?.es  || '';
    document.getElementById('sculpture-year').value     = s.year       || '';
    document.getElementById('sculpture-modifier').value = s.modifier   || '';
    document.getElementById('sculpture-image').value    = s.image      || '';
  } else {
    document.getElementById('sculptureEditId').value = '';
    ['title-en','title-es','desc-en','desc-es','year','image']
      .forEach(k => document.getElementById(`sculpture-${k}`).value = '');
    document.getElementById('sculpture-modifier').value = '';
  }

  panel.removeAttribute('hidden');
  panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

document.getElementById('sculptureEditCancel').addEventListener('click', () => {
  document.getElementById('sculptureEditPanel').setAttribute('hidden', '');
});

document.getElementById('sculptureEditSave').addEventListener('click', async () => {
  const idVal = document.getElementById('sculptureEditId').value;
  const s = {
    id      : idVal ? parseInt(idVal, 10) : Date.now(),
    image   : val('sculpture-image'),
    title   : { en: val('sculpture-title-en'), es: val('sculpture-title-es') },
    desc    : { en: val('sculpture-desc-en'),  es: val('sculpture-desc-es') },
    year    : val('sculpture-year'),
    modifier: document.getElementById('sculpture-modifier').value,
  };

  if (!content.sculptures) content.sculptures = [];
  if (idVal) {
    const idx = content.sculptures.findIndex(x => x.id === s.id);
    if (idx !== -1) content.sculptures[idx] = s;
    else content.sculptures.push(s);
  } else {
    content.sculptures.push(s);
  }

  await saveSection('sculptures');
  document.getElementById('sculptureEditPanel').setAttribute('hidden', '');
  populateSculptures();
});

async function deleteSculpture(id) {
  if (!confirm('Delete this sculpture?')) return;
  content.sculptures = (content.sculptures || []).filter(s => s.id !== id);
  await saveSection('sculptures');
  populateSculptures();
}

/* ══════════════════════════════════════════════════════════════
   ABOUT
══════════════════════════════════════════════════════════════ */
function populateAbout() {
  renderAboutFields();
}

function renderAboutFields() {
  const container = document.getElementById('aboutBioFields');
  container.innerHTML = '';
  const enParas = content.about?.bio?.en || [];
  const esParas = content.about?.bio?.es || [];
  const count   = Math.max(enParas.length, esParas.length);

  for (let i = 0; i < count; i++) {
    const row = document.createElement('div');
    row.className = 'bio-para-row field-row';
    row.dataset.index = i;
    row.innerHTML = `
      <div class="field-group">
        <label>Paragraph ${i + 1} (EN)</label>
        <textarea rows="4" data-lang="en" data-index="${i}">${escHtml(enParas[i] || '')}</textarea>
      </div>
      <div class="field-group">
        <label>Paragraph ${i + 1} (ES)</label>
        <textarea rows="4" data-lang="es" data-index="${i}">${escHtml(esParas[i] || '')}</textarea>
      </div>
      <button class="btn-delete" data-action="remove-para" data-index="${i}" title="Remove paragraph">✕</button>
    `;
    container.appendChild(row);
  }
}

document.getElementById('aboutBioFields').addEventListener('click', e => {
  const btn = e.target.closest('[data-action="remove-para"]');
  if (!btn) return;
  const idx = parseInt(btn.dataset.index, 10);
  if (!content.about?.bio) return;
  content.about.bio.en.splice(idx, 1);
  content.about.bio.es.splice(idx, 1);
  renderAboutFields();
});

document.getElementById('addBioParaBtn').addEventListener('click', () => {
  if (!content.about)      content.about      = {};
  if (!content.about.bio)  content.about.bio  = { en: [], es: [] };
  content.about.bio.en.push('');
  content.about.bio.es.push('');
  renderAboutFields();
});

function collectAbout() {
  if (!content.about)     content.about     = {};
  if (!content.about.bio) content.about.bio = { en: [], es: [] };

  const enTexts = [];
  const esTexts = [];
  document.querySelectorAll('#aboutBioFields textarea[data-lang="en"]')
    .forEach(ta => enTexts.push(ta.value));
  document.querySelectorAll('#aboutBioFields textarea[data-lang="es"]')
    .forEach(ta => esTexts.push(ta.value));

  content.about.bio.en = enTexts;
  content.about.bio.es = esTexts;
}

/* ══════════════════════════════════════════════════════════════
   IMAGES
══════════════════════════════════════════════════════════════ */
async function loadImages() {
  try {
    const urls = await api('GET', '/api/uploads');
    renderImageGrid(urls);
  } catch (err) {
    toast('Could not load images: ' + err.message, 'err');
  }
}

function renderImageGrid(urls) {
  const grid = document.getElementById('imagesGrid');
  grid.innerHTML = '';
  if (!urls.length) {
    grid.innerHTML = '<p style="color:var(--muted);font-size:.85rem">No images uploaded yet.</p>';
    return;
  }
  urls.forEach(url => {
    const thumb = document.createElement('div');
    thumb.className = 'img-thumb';
    thumb.innerHTML = `
      <img src="${escHtml(url)}" alt="" loading="lazy" />
      <div class="img-thumb__url" title="Click to copy URL">${escHtml(url)}</div>
      <button class="img-thumb__del" data-url="${escHtml(url)}" title="Delete">✕</button>`;
    grid.appendChild(thumb);
  });
}

document.getElementById('imagesGrid').addEventListener('click', async e => {
  // Copy URL on label click
  const label = e.target.closest('.img-thumb__url');
  if (label) {
    const url = label.closest('.img-thumb').querySelector('img').src;
    const path = new URL(url).pathname;
    await navigator.clipboard.writeText(path).catch(() => {});
    toast('URL copied: ' + path);
    return;
  }

  // Delete
  const del = e.target.closest('.img-thumb__del');
  if (del) {
    const url  = del.dataset.url;
    const file = url.split('/').pop();
    if (!confirm(`Delete ${file}?`)) return;
    try {
      await api('DELETE', `/api/upload/${file}`);
      toast('Image deleted');
      loadImages();
    } catch (err) {
      toast('Delete failed: ' + err.message, 'err');
    }
  }
});

// File input upload
document.getElementById('fileInput').addEventListener('change', e => {
  uploadFiles(Array.from(e.target.files));
  e.target.value = '';
});

// Drag & drop upload
const uploadArea = document.getElementById('uploadArea');
uploadArea.addEventListener('dragover',  e => { e.preventDefault(); uploadArea.classList.add('dragover'); });
uploadArea.addEventListener('dragleave', ()  => uploadArea.classList.remove('dragover'));
uploadArea.addEventListener('drop', e => {
  e.preventDefault();
  uploadArea.classList.remove('dragover');
  uploadFiles(Array.from(e.dataTransfer.files));
});

async function uploadFiles(files) {
  const imageFiles = files.filter(f => /^image\/(jpeg|png|webp)$/.test(f.type));
  if (!imageFiles.length) { toast('No valid images selected', 'err'); return; }

  let ok = 0;
  for (const file of imageFiles) {
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', {
        method  : 'POST',
        headers : { Authorization: 'Bearer ' + getToken() },
        body    : fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      ok++;
    } catch (err) {
      toast(`Upload failed for ${file.name}: ${err.message}`, 'err');
    }
  }

  if (ok) {
    toast(`${ok} image${ok > 1 ? 's' : ''} uploaded`);
    loadImages();
  }
}

/* ── Utilities ─────────────────────────────────────────────────────────────── */
function val(id) {
  return document.getElementById(id)?.value?.trim() || '';
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
