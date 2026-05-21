#!/bin/bash

# CyberShield AI - Fix Git Conflicts on Server
# Run this on the AWS server to resolve merge conflicts

echo "🔧 CyberShield AI - Fix Git Conflicts"
echo "===================================="
echo ""

cd /home/ubuntu/CyberShield-AI- || exit 1

echo "📋 Current git status:"
git status

echo ""
echo "🗑️  Stashing local changes..."
git stash push -m "Local changes before merge"

echo ""
echo "🧹 Removing untracked files that conflict..."
rm -f deploy-no-mongo.sh deploy-server-ready.sh

echo ""
echo "📥 Pulling latest changes from GitHub..."
git pull origin main

echo ""
echo "📋 Git status after pull:"
git status

echo ""
echo "✅ Git pull completed successfully!"
echo ""
echo "🔧 Restarting frontend service..."
sudo systemctl restart cybershield-frontend

echo ""
echo "⏳ Waiting for frontend to start..."
sleep 5

echo ""
echo "📋 Copying visualization files to nginx directory..."
sudo cp architecture-and-techstack.html /var/www/html/
sudo cp tech-stack-visualization.html /var/www/html/
sudo cp architecture-visualization.html /var/www/html/
sudo cp test-user-isolation.html /var/www/html/
sudo chown www-data:www-data /var/www/html/*.html

echo ""
echo "✅ Server updated successfully!"
echo ""
echo "📍 Access your application at: http://3.27.205.150"
echo ""
echo "🧪 Testing User Isolation:"
echo "   1. Login with: testuser1@example.com / test123"
echo "   2. Dashboard should show: 1 Total Analysis"
echo "   3. Profile should show: 1 Total Analyses, New Contributor rank"
echo "   4. LOGOUT COMPLETELY (click logout, wait a few seconds)"
echo "   5. Login with: testuser2@example.com / test123"
echo "   6. Dashboard should show: 0 Total Analyses"
echo "   7. Profile should show: 0 Total Analyses, New User rank"
echo ""
echo "🎨 Visualization URLs:"
echo "   - http://3.27.205.150/architecture-and-techstack.html"
echo "   - http://3.27.205.150/tech-stack-visualization.html"
echo "   - http://3.27.205.150/architecture-visualization.html"
echo "   - http://3.27.205.150/test-user-isolation.html"
echo ""