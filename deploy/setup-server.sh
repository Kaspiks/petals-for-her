#!/usr/bin/env bash
#
# Run this ONCE on the server (e.g. ssh petals 'bash -s' < deploy/setup-server.sh)
# from the project root, or copy-paste into the server after cd /opt/petals-for-her.
# Creates .env.production with generated secrets; you still need to add RAILS_MASTER_KEY and optional SMTP_*.
#
set -euo pipefail

cd "$(dirname "$0")/.."
ENV_FILE=".env.production"

if [ -f "$ENV_FILE" ]; then
  echo ".env.production already exists. Edit it to add RAILS_MASTER_KEY and SMTP_* if needed."
  exit 0
fi

cp deploy/.env.production.example "$ENV_FILE"

# Generate secrets (Rails accepts any 64-byte hex for SECRET_KEY_BASE)
SECRET=$(openssl rand -hex 64)
JWT_SECRET=$(openssl rand -hex 32)
DB_PASS=$(openssl rand -hex 16)

# Replace placeholders (works on Linux and macOS)
if sed --version 2>/dev/null | grep -q GNU; then
  sed -i "s/^SECRET_KEY_BASE=.*/SECRET_KEY_BASE=${SECRET}/" "$ENV_FILE"
  sed -i "s/^DEVISE_JWT_SECRET_KEY=.*/DEVISE_JWT_SECRET_KEY=${JWT_SECRET}/" "$ENV_FILE"
  sed -i "s/^DATABASE_PASSWORD=.*/DATABASE_PASSWORD=${DB_PASS}/" "$ENV_FILE"
else
  sed -i '' "s/^SECRET_KEY_BASE=.*/SECRET_KEY_BASE=${SECRET}/" "$ENV_FILE"
  sed -i '' "s/^DEVISE_JWT_SECRET_KEY=.*/DEVISE_JWT_SECRET_KEY=${JWT_SECRET}/" "$ENV_FILE"
  sed -i '' "s/^DATABASE_PASSWORD=.*/DATABASE_PASSWORD=${DB_PASS}/" "$ENV_FILE"
fi

echo "Created ${ENV_FILE} with generated secrets."
echo ""
echo "Next:"
echo "  1. Edit .env.production and set RAILS_MASTER_KEY (copy from your local config/master.key)."
echo "  2. Optionally set SMTP_* for email (Resend, SendGrid, etc.)."
echo "  3. From your LOCAL machine run:  ./deploy/release.sh petals"
echo ""
