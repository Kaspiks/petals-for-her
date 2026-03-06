#!/usr/bin/env bash
#
# Deploy Petals for Her to Hetzner (or any server with SSH alias "petals").
# Builds the frontend, syncs it and deploy files to the server, then rebuilds/restarts containers.
#
# Prerequisites:
#   - SSH access: ssh petals  (configure in ~/.ssh/config)
#   - Server has Docker and Docker Compose
#   - .env.production (or deploy/.env.production) with real secrets
#
# Usage:
#   ./deploy/release.sh [ssh_host]
#
# Examples:
#   ./deploy/release.sh petals
#   ./deploy/release.sh user@my-server.com
#
set -euo pipefail

SSH_HOST="${1:-petals}"
APP_DIR="${APP_DIR:-/opt/petals-for-her}"

echo "==> Building frontend..."
cd "$(dirname "$0")/../frontend"
npm ci
npm run build
cd ..

echo "==> Syncing frontend dist to ${SSH_HOST}:${APP_DIR}/deploy/frontend-dist ..."
rsync -avz --delete frontend/dist/ "${SSH_HOST}:${APP_DIR}/deploy/frontend-dist/"

echo "==> Syncing deploy files to ${SSH_HOST}..."
rsync -avz deploy/Caddyfile deploy/.env.production.example "${SSH_HOST}:${APP_DIR}/deploy/" 2>/dev/null || true

echo "==> Rebuilding and restarting on ${SSH_HOST}..."
ssh "${SSH_HOST}" "cd ${APP_DIR} && docker compose -f docker-compose.prod.yml --env-file .env.production build web && docker compose -f docker-compose.prod.yml --env-file .env.production up -d"

echo "==> Running migrations..."
ssh "${SSH_HOST}" "cd ${APP_DIR} && docker compose -f docker-compose.prod.yml --env-file .env.production exec -T web bundle exec rails db:prepare" 2>/dev/null || true

echo ""
echo "Done. App should be live at https://\${APP_HOST} (set in .env.production on the server)."
echo "  Logs:  ssh ${SSH_HOST} 'cd ${APP_DIR} && docker compose -f docker-compose.prod.yml --env-file .env.production logs -f'"
echo "  Caddy: ssh ${SSH_HOST} 'cd ${APP_DIR} && docker compose -f docker-compose.prod.yml --env-file .env.production logs -f caddy'"
