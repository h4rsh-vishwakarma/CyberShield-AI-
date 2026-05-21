#!/bin/bash

# CyberShield AI - Quick Frontend Update Script
# Run this on the AWS server to update frontend with user isolation fixes

echo "🚀 CyberShield AI - Quick Frontend Update"
echo "=========================================="
echo ""

# Navigate to project directory
cd /home/ubuntu/CyberShield-AI- || exit 1

echo "📡 Pulling latest changes from GitHub..."
git pull origin main

echo ""
echo "🔧 Restarting frontend service..."
sudo systemctl restart cybershield-frontend

echo ""
echo "⏳ Waiting for frontend to start..."
sleep 5

echo ""
echo "✅ Frontend update completed!"
echo ""
echo "📍 Testing user isolation:"
echo "   1. Login with testuser1@example.com / test123"
echo "   2. Check dashboard and profile should show 1 analysis"
echo "   3. Logout completely"
echo "   4. Login with testuser2@example.com / test123"
echo "   5. Check dashboard and profile should show 0 analyses"
echo ""