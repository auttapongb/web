#!/usr/bin/env bash
# Deploy Verity Tech static site to Ubuntu 24.04
# Usage: sudo ./deploy/deploy.sh
set -euo pipefail

WEB_ROOT="${WEB_ROOT:-/var/www/veritytech}"
PM2_PORT="${PM2_PORT:-8500}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

echo "[1/5] Syncing files to ${WEB_ROOT}..."
mkdir -p "$WEB_ROOT"
rsync -av --delete \
  --exclude '.git' \
  --exclude '.env' \
  --exclude 'deploy/' \
  "$PROJECT_DIR/" "$WEB_ROOT/"

echo "[2/5] Setting permissions..."
chown -R www-data:www-data "$WEB_ROOT"

echo "[3/5] Installing nginx config..."
if [ -f /etc/nginx/sites-available/veritytech ]; then
  cp "$SCRIPT_DIR/nginx.conf" /etc/nginx/sites-available/veritytech
else
  cp "$SCRIPT_DIR/nginx.conf" /etc/nginx/sites-available/veritytech
  ln -sf /etc/nginx/sites-available/veritytech /etc/nginx/sites-enabled/veritytech
fi
nginx -t
systemctl reload nginx

echo "[4/5] Starting PM2 static server on port ${PM2_PORT}..."
cd "$WEB_ROOT"
pm2 startOrReload "$SCRIPT_DIR/ecosystem.config.cjs" --update-env
pm2 save

echo "[5/5] Running verification..."
"$PROJECT_DIR/scripts/verify.sh"

echo "Deploy complete."
