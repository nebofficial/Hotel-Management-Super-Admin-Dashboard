#!/bin/bash

set -e  # STOP on any error

echo "======================================"
echo "🚀 PRODUCTION DEPLOYMENT STARTED (SUPER ADMIN)"
echo "======================================"

APP_DIR="/root/Hotel-Management-Super-Admin-Dashboard"
APP_NAME="hotel-super-admin-dashboard"
PORT=2051
BRANCH="main"

cd "$APP_DIR"

echo "📌 Ensuring $BRANCH branch"
git checkout "$BRANCH"

echo "📥 Fetching latest code"
git fetch origin
git reset --hard "origin/$BRANCH"

echo "🧹 Cleaning previous build"
rm -rf .next node_modules

echo "📦 Installing dependencies (pnpm)"
pnpm install --no-frozen-lockfile

echo "🔍 Verifying Next.js"
if [ ! -f "node_modules/.bin/next" ]; then
  echo "❌ Next.js not installed. Aborting deploy."
  exit 1
fi

echo "🏗 Building Next.js application"
pnpm build

echo "♻ Restarting app with PM2 on port $PORT"
PORT=$PORT pm2 restart "$APP_NAME" --update-env || \
PORT=$PORT pm2 start pnpm --name "$APP_NAME" -- start

echo "💾 Saving PM2 state"
pm2 save

echo "======================================"
echo "✅ SUPER ADMIN DEPLOYMENT COMPLETED (PORT $PORT)"
echo "======================================"