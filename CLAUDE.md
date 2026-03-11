# CLAUDE.md — Artist Portfolio + CMS

This file documents the project architecture, conventions, and workflows for Claude Code.

---

## Project Overview

A bilingual (EN/ES) static portfolio site for Alan Hurtarte (writer & sculptor), extended with a lightweight Node.js CMS backend so content can be edited without touching code.

**Live site:** served by nginx as static files
**Admin panel:** `/admin` — proxied to Node.js on port 3081
**API:** `/api/*` — proxied to Node.js on port 3081

---

## File Structure

```
artist-page/
├── index.html          # Main portfolio page (story/sculpture grids are JS-rendered)
├── styles.css          # All site styles
├── script.js           # Translations, dynamic rendering, CMS fetch, all site JS
├── favicon.svg
│
├── content.json        # CMS content (source of truth for editable text & images)
├── server.js           # Express API server (auth, content CRUD, image upload)
├── package.json        # npm deps + scripts
├── .env                # Secrets — NEVER commit (gitignored)
├── .env.example        # Template for .env
│
├── admin/
│   ├── index.html      # Admin panel UI
│   ├── admin.css       # Admin styles (dark theme)
│   └── admin.js        # Admin logic (auth, CRUD, image upload)
│
├── uploads/            # Uploaded images — gitignored
├── test/
│   └── server.test.js  # Integration tests (npm test)
│
├── nginx.conf          # nginx config with Node proxy
├── deploy.sh           # Automated deploy script
└── CLAUDE.md           # This file
```

---

## npm Scripts

| Command | What it does |
|---------|-------------|
| `npm start` | Start the CMS server (`node server.js`) |
| `npm test` | Run integration tests (`node test/server.test.js`) |
| `npm run setup-password yourPass` | Generate a bcrypt hash to put in `.env` |

---

## API Endpoints

| Method | Route | Auth | Purpose |
|--------|-------|------|---------|
| POST | `/api/auth/login` | No | Returns JWT if password correct |
| GET | `/api/content` | No | Returns `content.json` |
| PUT | `/api/content` | JWT | Overwrites `content.json` |
| GET | `/api/uploads` | JWT | Lists uploaded image URLs |
| POST | `/api/upload` | JWT | Upload image → returns `/uploads/filename` |
| DELETE | `/api/upload/:file` | JWT | Delete uploaded image |
| GET | `/admin` | No | Serves admin panel HTML |

**Security:**
- Password stored as bcrypt hash (`$2a$12$...`) in `.env`
- JWT: 24h expiry, signed with `JWT_SECRET`
- Login rate-limited: 10 attempts per 15 minutes → 429
- Multer: images only (jpg/png/webp), 5 MB max
- Path traversal prevented in delete endpoint via `path.basename()`

---

## content.json Structure

```json
{
  "hero": {
    "tagline": { "en": "...", "es": "..." }
  },
  "stories": [
    {
      "id": 1,
      "tag":      { "en": "Memory / Loss", "es": "Memoria / Pérdida" },
      "title":    { "en": "...", "es": "..." },
      "excerpt":  { "en": "...", "es": "..." },
      "fullText": { "en": "<p>...</p>", "es": "<p>...</p>" }
    }
  ],
  "sculptures": [
    {
      "id": 1,
      "image":    "/uploads/filename.jpg",
      "title":    { "en": "...", "es": "..." },
      "desc":     { "en": "...", "es": "..." },
      "year":     "2023",
      "modifier": "sculpture-item--tall"
    }
  ],
  "about": {
    "bio": {
      "en": ["paragraph 1", "paragraph 2", "..."],
      "es": ["párrafo 1",   "párrafo 2",   "..."]
    }
  },
  "contact": {
    "email": "alan.hurtarte@gmail.com"
  }
}
```

**Sculpture modifiers:** `""` (standard), `"sculpture-item--tall"`, `"sculpture-item--wide"`

---

## How the Frontend Loads Content

1. `DOMContentLoaded` fires → `loadCMSContent()` fetches `/api/content`
2. On success: `activeStories` and `activeSculptures` are set from CMS data; hero tagline and about bios are merged into the `translations` object
3. On failure (server down / offline): silently falls back to hardcoded `defaultStories` / `defaultSculptures` in `script.js` — **the site always works**
4. `renderStories(activeStories)` and `renderSculptures(activeSculptures)` populate the DOM
5. `applyTranslations('en')` applies all `[data-i18n]` static text
6. `initScrollReveal()` sets up scroll animations

**Language toggle** calls `applyTranslations(next)` + re-renders stories and sculptures.
**Story modal** (`openModal(id)`) looks up story by id from `activeStories`.
Event listeners on story buttons use **event delegation** on `#storiesGrid` (required because cards are dynamically rendered).

---

## .env File

```
ADMIN_PASSWORD_HASH=$2a$12$...   # output of: npm run setup-password yourPass
JWT_SECRET=long_random_hex_string  # output of: openssl rand -hex 32
PORT=3000                          # optional, defaults to 3000
```

---

## First-Time VPS Setup

```bash
# 1. Clone the repo
git clone https://github.com/kenny08gt/art-portfolio.git /var/www/art-portfolio
cd /var/www/art-portfolio

# 2. Create .env
cp .env.example .env
# Generate a random JWT secret:
openssl rand -hex 32
# Generate a password hash:
npm run setup-password yourAdminPassword
# Paste both into .env

# 3. Install pm2 globally (once per server)
npm install -g pm2

# 4. Run the deploy script
./deploy.sh
```

---

## Deploying Updates

```bash
# On your local machine — push your changes:
git push origin main

# On the VPS:
./deploy.sh
```

The deploy script:
1. `git reset --hard origin/main` — pulls latest code
2. Checks `.env` exists
3. `npm ci --omit=dev` — installs production dependencies
4. Creates `uploads/` if missing
5. `pm2 restart art-portfolio-cms` (or starts it fresh)
6. Copies `nginx.conf` to `/etc/nginx/sites-enabled/art-portfolio` and reloads nginx
7. Runs `npm test`

---

## nginx Config

- **Domain:** `art.alanhurtarte.com`
- **Node port:** `3081`
- **SSL:** managed by Certbot — do not manually edit the SSL blocks
- **Config file on server:** `/etc/nginx/sites-available/art-portfolio`

The repo's `nginx.conf` is kept in sync as documentation and is used only on **first deploy** (when the file doesn't exist yet). Subsequent deploys skip it to avoid clobbering certbot's SSL blocks.

```nginx
upstream nodejs { server 127.0.0.1:3081; }

# HTTPS server (SSL managed by Certbot)
server {
    server_name art.alanhurtarte.com;
    listen 443 ssl;
    ssl_certificate     /etc/letsencrypt/live/art.alanhurtarte.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/art.alanhurtarte.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    location /api/    { proxy_pass http://nodejs; ... }
    location /admin   { proxy_pass http://nodejs; ... }
    location /uploads/{ alias /var/www/art-portfolio/uploads/; }
    location /        { try_files $uri $uri/ /index.html; }
}

# HTTP → HTTPS redirect (managed by Certbot)
server {
    listen 80;
    server_name art.alanhurtarte.com;
    return 301 https://$host$request_uri;
}
```

Static files (HTML/CSS/JS) are served directly by nginx — Node only handles `/api/` and `/admin`.

---

## Running Tests

```bash
npm test
```

Tests cover (16 assertions):
- `GET /api/content` returns valid structure
- Login with correct password → 200 + JWT
- Login with wrong password → 401
- Login with no password → 400
- Protected PUT without token → 401
- Protected PUT with bad token → 401
- PUT with valid token updates content on disk
- Content is restorable
- 11 rapid login attempts → at least one 429
- `GET /admin` serves HTML

---

## Admin Panel Usage

1. Navigate to `http://your-domain/admin`
2. Enter the admin password set up in `.env`
3. Use the tabs to edit content:
   - **Hero** — tagline in EN and ES
   - **Stories** — add/edit/delete stories with full HTML support for full text
   - **Sculptures** — add/edit/delete sculptures with image URL and layout modifier
   - **About** — edit bio paragraphs (add/remove paragraphs)
   - **Images** — drag & drop or file picker upload; click URL to copy; delete button on hover
4. Each section has a **Save** button — writes directly to `content.json` on the server
5. Changes appear on the live site immediately on next page load

---

## Key Conventions

- **Bilingual content:** always provide both `en` and `es` for user-facing strings
- **Story fullText:** raw HTML string — use `<p>` and `<em>` tags, no wrapper element needed
- **IDs:** story and sculpture IDs are stable integers; when adding via admin, a `Date.now()` ID is assigned automatically
- **Images:** upload via admin Images tab → copy the `/uploads/filename` URL → paste into sculpture image field
- **No build step:** plain HTML/CSS/JS — no bundler, no transpiler
