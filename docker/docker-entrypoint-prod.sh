#!/bin/bash
set -e

# Clean stale PIDs (dev paths; no-op if missing)
rm -f /tmp/server.pid /rails/tmp/pids/server.pid 2>/dev/null || true

wait_for_db() {
  echo "Waiting for database..."
  while ! pg_isready -h "$DATABASE_HOST" -p "${DATABASE_PORT:-5432}" -U "$DATABASE_USERNAME" -q; do
    echo "Database is unavailable - sleeping"
    sleep 2
  done
  echo "Database is ready!"
}

case "$1" in
  rails|rake|bundle)
    if [ -n "${DATABASE_HOST:-}" ]; then
      wait_for_db
      echo "Running db:prepare..."
      bundle exec rails db:prepare
    fi
    ;;
esac

exec "$@"
