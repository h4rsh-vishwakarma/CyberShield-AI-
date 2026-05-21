# CyberShield AI - Frontend Updates Deployment Script
# Run this from your local machine to deploy user isolation fixes

Write-Host "🚀 CyberShield AI - Frontend Updates Deployment" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green
Write-Host ""

# Configuration - UPDATE THESE PATHS
$KEY_PATH = "D:\Internship Tasks\EC2\trading_bot.pem"  # Your SSH key path
$SERVER = "ubuntu@3.27.205.150"
$PROJECT_DIR = "/home/ubuntu/CyberShield-AI-"

Write-Host "📡 Connecting to AWS server..." -ForegroundColor Yellow

# Pull latest changes on server
$pullCommand = "ssh -i `"$KEY_PATH`" -o StrictHostKeyChecking=no $SERVER 'cd $PROJECT_DIR; git pull origin main'"
Write-Host "📥 Pulling latest changes from GitHub..." -ForegroundColor Blue
Invoke-Expression $pullCommand

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Git pull successful!" -ForegroundColor Green
} else {
    Write-Host "❌ Git pull failed!" -ForegroundColor Red
    Write-Host "⚠️  This might be due to local changes on the server" -ForegroundColor Yellow
    Write-Host "Please resolve manually on the server first" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "🔧 Restarting frontend service..." -ForegroundColor Yellow

$restartCommand = "ssh -i `"$KEY_PATH`" -o StrictHostKeyChecking=no $SERVER 'sudo systemctl restart cybershield-frontend'"
Write-Host "🔄 Restarting frontend..." -ForegroundColor Blue
Invoke-Expression $restartCommand

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Frontend restarted!" -ForegroundColor Green
} else {
    Write-Host "❌ Frontend restart failed!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📋 Copying visualization files to nginx directory..." -ForegroundColor Yellow

$copyCommand = "ssh -i `"$KEY_PATH`" -o StrictHostKeyChecking=no $SERVER 'sudo cp $PROJECT_DIR/architecture-and-techstack.html /var/www/html/; sudo cp $PROJECT_DIR/tech-stack-visualization.html /var/www/html/; sudo cp $PROJECT_DIR/architecture-visualization.html /var/www/html/; sudo cp $PROJECT_DIR/test-user-isolation.html /var/www/html/; sudo chown www-data:www-data /var/www/html/*.html'"
Write-Host "📤 Copying files..." -ForegroundColor Blue
Invoke-Expression $copyCommand

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Visualization files copied!" -ForegroundColor Green
} else {
    Write-Host "⚠️  File copy failed (non-critical)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "⏳ Waiting for frontend to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

Write-Host ""
Write-Host "✅ Frontend updates deployed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 Access your application at: http://3.27.205.150" -ForegroundColor Cyan
Write-Host ""
Write-Host "🧪 Testing User Isolation:" -ForegroundColor Yellow
Write-Host "   1. Login with: testuser1@example.com / test123" -ForegroundColor White
Write-Host "   2. Dashboard should show: 1 Total Analysis" -ForegroundColor White
Write-Host "   3. Profile should show: 1 Total Analyses, New Contributor rank" -ForegroundColor White
Write-Host "   4. LOGOUT COMPLETELY (click logout, wait a few seconds)" -ForegroundColor Red
Write-Host "   5. Login with: testuser2@example.com / test123" -ForegroundColor White
Write-Host "   6. Dashboard should show: 0 Total Analyses" -ForegroundColor White
Write-Host "   7. Profile should show: 0 Total Analyses, New User rank" -ForegroundColor White
Write-Host ""
Write-Host "🎨 Architecture & Tech Stack Visualizations:" -ForegroundColor Yellow
Write-Host "   Unified: http://3.27.205.150/architecture-and-techstack.html" -ForegroundColor Cyan
Write-Host "   Tech Stack: http://3.27.205.150/tech-stack-visualization.html" -ForegroundColor Cyan
Write-Host "   Architecture: http://3.27.205.150/architecture-visualization.html" -ForegroundColor Cyan
Write-Host "   Test Page: http://3.27.205.150/test-user-isolation.html" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 For PPT Presentations:" -ForegroundColor Yellow
Write-Host "   - Open any of the visualization URLs" -ForegroundColor White
Write-Host "   - Use browser print function to save as PDF" -ForegroundColor White
Write-Host "   - Or take screenshots for direct insertion" -ForegroundColor White
Write-Host ""