#!/bin/bash
set -e

echo "=== Pulling latest changes ==="
git pull origin main

echo "=== Installing dependencies ==="
npm install

echo "=== Building frontend ==="
npm run build --workspace frontend

echo "=== Reloading PM2 processes ==="
if pm2 list | grep -q "blog-backend"; then
  pm2 reload ecosystem.config.cjs --env production
else
  pm2 start ecosystem.config.cjs --env production
fi

pm2 save

echo "=== Deploy complete! ==="
