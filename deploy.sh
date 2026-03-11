#!/usr/bin/env bash
# deploy.sh — deploy art-portfolio to VPS
# Usage: ./deploy.sh
# Requires: git, node, npm, pm2, nginx on the server
set -euo pipefail

# ── Config ────────────────────────────────────────────────────────────────────
APP_DIR="/var/www/art-portfolio"
PM2_APP="art-portfolio-cms"
# Path to the nginx config file managed by certbot — edit if yours differs
NGINX_CONF="/etc/nginx/sites-available/art-portfolio"

# ── Colors ────────────────────────────────────────────────────────────────────
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

info()  { echo -e "${GREEN}▶ $*${NC}"; }
warn()  { echo -e "${YELLOW}⚠ $*${NC}"; }
error() { echo -e "${RED}✗ $*${NC}"; exit 1; }

# ── Preflight ─────────────────────────────────────────────────────────────────
info "Checking dependencies..."
command -v git   >/dev/null 2>&1 || error "git not found"
command -v node  >/dev/null 2>&1 || error "node not found"
command -v npm   >/dev/null 2>&1 || error "npm not found"
command -v pm2   >/dev/null 2>&1 || error "pm2 not found (install: npm i -g pm2)"
command -v nginx >/dev/null 2>&1 || warn  "nginx not found — skipping nginx steps"

# ── Create app directory if needed ────────────────────────────────────────────
if [ ! -d "$APP_DIR" ]; then
  info "Creating $APP_DIR..."
  sudo mkdir -p "$APP_DIR"
  sudo chown "$USER:$USER" "$APP_DIR"
fi

# ── Pull latest code ──────────────────────────────────────────────────────────
info "Pulling latest code..."
if [ -d "$APP_DIR/.git" ]; then
  git -C "$APP_DIR" fetch --all
  git -C "$APP_DIR" reset --hard origin/main
else
  git clone "$(git -C "$(dirname "$0")" remote get-url origin)" "$APP_DIR"
fi

# ── Check .env ────────────────────────────────────────────────────────────────
if [ ! -f "$APP_DIR/.env" ]; then
  warn ".env not found at $APP_DIR/.env"
  warn "Run the following to set it up:"
  warn "  cd $APP_DIR"
  warn "  cp .env.example .env"
  warn "  nano .env   # fill in JWT_SECRET (openssl rand -hex 32)"
  warn "  npm run setup-password yourAdminPassword   # paste output as ADMIN_PASSWORD_HASH"
  echo ""
  read -rp "Press Enter once .env is ready, or Ctrl+C to abort..." _
fi

# ── Install dependencies ──────────────────────────────────────────────────────
info "Installing npm dependencies..."
npm ci --prefix "$APP_DIR" --omit=dev

# ── Ensure uploads directory exists ──────────────────────────────────────────
mkdir -p "$APP_DIR/uploads"

# ── Start / restart with pm2 ─────────────────────────────────────────────────
info "Starting app with pm2..."
if pm2 describe "$PM2_APP" > /dev/null 2>&1; then
  pm2 restart "$PM2_APP"
else
  pm2 start "$APP_DIR/server.js" \
    --name "$PM2_APP" \
    --cwd  "$APP_DIR" \
    --env  production
fi

pm2 save

# ── Nginx config ──────────────────────────────────────────────────────────────
# IMPORTANT: we never blindly overwrite an existing nginx config because certbot
# manages the SSL blocks. We only copy nginx.conf if the file doesn't exist yet
# (i.e. first deploy). After that, edit the file on the server directly if needed
# — the copy in the repo is kept in sync as documentation.
if command -v nginx >/dev/null 2>&1; then
  if [ ! -f "$NGINX_CONF" ]; then
    info "Installing nginx config (first deploy)..."
    sudo cp "$APP_DIR/nginx.conf" "$NGINX_CONF"
    # Symlink into sites-enabled if not already there
    NGINX_ENABLED="/etc/nginx/sites-enabled/art-portfolio"
    [ -L "$NGINX_ENABLED" ] || sudo ln -s "$NGINX_CONF" "$NGINX_ENABLED"
    sudo nginx -t && sudo systemctl reload nginx
    info "Nginx installed and reloaded."
  else
    info "Nginx config already exists — skipping overwrite (certbot manages SSL blocks)."
    info "Reload nginx to pick up any other changes:"
    info "  sudo nginx -t && sudo systemctl reload nginx"
  fi
fi

# ── Run tests ─────────────────────────────────────────────────────────────────
info "Running tests..."
(cd "$APP_DIR" && npm test) || warn "Some tests failed — check output above"

# ── Done ──────────────────────────────────────────────────────────────────────
echo ""
info "Deploy complete!"
echo -e "  Site:  ${GREEN}https://art.alanhurtarte.com/${NC}"
echo -e "  Admin: ${GREEN}https://art.alanhurtarte.com/admin${NC}"
