#!/usr/bin/env bash
#
# Deploy Petals for Her to Hetzner (or any server with SSH alias "petals").
# Builds the frontend, syncs it and deploy files to the server, then rebuilds/restarts containers.
#
# Prerequisites:
#   - Docker (to build frontend if npm not installed)
#   - SSH access: ssh petals  (configure in ~/.ssh/config)
#   - Server has Docker and Docker Compose
#   - .env.production on the server with real secrets
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
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

echo "==> Building frontend..."
if command -v npm &>/dev/null; then
  cd "${REPO_ROOT}/frontend"
  npm ci
  npm run build
  cd "${REPO_ROOT}"
else
  echo "    (using Docker – no local Node required)"
  docker run --rm \
    -v "${REPO_ROOT}/frontend:/app" \
    -w /app \
    node:20-alpine \
    sh -c "npm ci && npm run build"
fi

echo "==> Updating server repo (${SSH_HOST})..."
# Pull before rsync of Caddyfile — rsync touches tracked files and would block git pull.
# Docker build uses ${APP_DIR} on the server; without pull, API routes can be missing → 404.
REMOTE_PULL="cd ${APP_DIR}"
if [ "${SKIP_GIT_PULL:-}" != "1" ]; then
  REMOTE_PULL="${REMOTE_PULL} && git pull --ff-only"
fi
ssh "${SSH_HOST}" "${REMOTE_PULL}"

echo "==> Syncing frontend dist to ${SSH_HOST}:${APP_DIR}/deploy/frontend-dist ..."
rsync -avz --delete "${REPO_ROOT}/frontend/dist/" "${SSH_HOST}:${APP_DIR}/deploy/frontend-dist/"

echo "==> Syncing deploy files to ${SSH_HOST}..."
rsync -avz "${REPO_ROOT}/deploy/Caddyfile" "${REPO_ROOT}/deploy/.env.production.example" "${SSH_HOST}:${APP_DIR}/deploy/" 2>/dev/null || true

echo "==> Rebuilding and restarting on ${SSH_HOST}..."
# Restart caddy so it reloads deploy/Caddyfile (bind-mounted). Otherwise /sitemap.xml can keep
# serving SPA index.html until Caddy reloads → GSC "Sitemap is HTML".
ssh "${SSH_HOST}" "cd ${APP_DIR} && docker compose -f docker-compose.prod.yml --env-file .env.production build web && docker compose -f docker-compose.prod.yml --env-file .env.production up -d && docker compose -f docker-compose.prod.yml --env-file .env.production restart caddy"

echo "==> Running migrations..."
ssh "${SSH_HOST}" "cd ${APP_DIR} && docker compose -f docker-compose.prod.yml --env-file .env.production exec -T web bundle exec rails db:prepare" 2>/dev/null || true

echo ""
echo "Done. App should be live at https://\${APP_HOST} (set in .env.production on the server)."
echo "  Logs:  ssh ${SSH_HOST} 'cd ${APP_DIR} && docker compose -f docker-compose.prod.yml --env-file .env.production logs -f'"
echo "  Caddy: ssh ${SSH_HOST} 'cd ${APP_DIR} && docker compose -f docker-compose.prod.yml --env-file .env.production logs -f caddy'"
