#!/bin/bash
echo "Starting Deployment Process..."

# Build the React frontend
echo "Building Frontend..."
cd frontend
npm install
npm run build
cd ..

# Setup backend dependencies
echo "Installing Backend Production Dependencies..."
cd backend
npm install --production

# Restart PM2 using the ecosystem file
echo "Restarting PM2 Service..."
pm2 start ecosystem.config.js --env production || pm2 restart ecosystem.config.js --env production

echo "Deployment Successful! 🚀"
