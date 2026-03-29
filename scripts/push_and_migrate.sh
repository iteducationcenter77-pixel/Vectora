#!/usr/bin/env bash
set -euo pipefail

# Usage: ./scripts/push_and_migrate.sh [remote-url] [--migrate]
REMOTE_URL=${1:-}
RUN_MIGRATE=false
if [[ ${2:-} == "--migrate" ]]; then
  RUN_MIGRATE=true
fi

echo "Preparing git commit..."
git status --porcelain
git add .
read -r -p "Commit message (leave empty for default): " msg
if [[ -z "$msg" ]]; then
  msg='Update site: migrations, scripts, and improvements'
fi
git commit -m "$msg" || true

if ! git remote get-url origin >/dev/null 2>&1; then
  if [[ -n "$REMOTE_URL" ]]; then
    git remote add origin "$REMOTE_URL"
  else
    echo "No remote 'origin' found. Provide a remote URL as the first arg or add origin and re-run." >&2
    exit 1
  fi
fi

git branch -M main
git push -u origin main

if [ "$RUN_MIGRATE" = true ]; then
  if [ ! -f .env ]; then
    echo ".env not found — migration requires DATABASE_URL in .env" >&2
    exit 1
  fi
  echo "Installing dependencies..."
  npm install
  echo "Running migration..."
  npm run migrate
fi

echo "Done."
