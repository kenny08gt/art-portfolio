#!/usr/bin/env bash
# deploy.sh — deploy art-portfolio to VPS
# Usage: ./deploy.sh
# Requires: git, node, npm, pm2, nginx on the server
set -euo pipefail

# ── Config ────────────────────────────────────────────────────────────────────
APP_DIR="/var/www/art-portfolio"
PM2_APP="art-portfolio-cms"
NGINX_CONF="/etc/nginx/sites-enabled/art-portfolio"

# ── Colors ────────────────────────────────────────────────────────────────────
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

info()    { echo -e "${GREEN}▶ $*${NC}"; }
warn()    { echo -e "${YELLOW}⚠ $*${NC}"; }
error()   { echo -e "${RED}✗ $*${NC}"; exit 1; }

# ── Preflight ─────────────────────────────────────────────────────────────────
info "Checking dependencies..."
command -v git  >/dev/null 2>&1 || error "git not found"
command -v node >/dev/null 2>&1 || error "node not found"
command -v npm  >/dev/null 2>&1 || error "npm not found"
command -v pm2  >/dev/null 2>&1 || error "pm2 not found (install: npm i -g pm2)"
command -v nginx >/dev/null 2>&1 || warn "nginx not found — skipping nginx steps"

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
  git clone "$(git remote get-url origin)" "$APP_DIR"
fi

# ── Check .env ────────────────────────────────────────────────────────────────
if [ ! -f "$APP_DIR/.env" ]; then
  warn ".env not found at $APP_DIR/.env"
  warn "Copy .env.example to .env and fill in JWT_SECRET and ADMIN_PASSWORD_HASH:"
  warn "  cd $APP_DIR && cp .env.example .env && nano .env"
  warn "  npm run setup-password yourPassword  # generates ADMIN_PASSWORD_HASH"
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
    --cwd "$APP_DIR" \
    --env production
fi

pm2 save

# ── Nginx config ──────────────────────────────────────────────────────────────
if command -v nginx >/dev/null 2>&1; then
  info "Installing nginx config..."
  sudo cp "$APP_DIR/nginx.conf" "$NGINX_CONF"
  # Replace placeholder root path with actual APP_DIR
  sudo sed -i "s|/var/www/art-portfolio|$APP_DIR|g" "$NGINX_CONF"
  sudo nginx -t && sudo systemctl reload nginx
  info "Nginx reloaded."
fi

# ── Run tests ─────────────────────────────────────────────────────────────────
info "Running tests..."
(cd "$APP_DIR" && npm test) || warn "Some tests failed — check output above"

# ── Done ──────────────────────────────────────────────────────────────────────
echo ""
info "Deploy complete!"
echo -e "  Site:  ${GREEN}http://your-domain/${NC}"
echo -e "  Admin: ${GREEN}http://your-domain/admin${NC}"
