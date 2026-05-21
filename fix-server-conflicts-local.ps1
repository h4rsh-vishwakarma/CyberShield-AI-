# CyberShield AI - Fix Server Git Conflicts (Local Script)
# Run this from your local machine to fix git conflicts on AWS server

Write-Host "🔧 CyberShield AI - Fix Server Git Conflicts" -ForegroundColor Green
Write-Host "===========================================" -ForegroundColor Green
Write-Host ""

# Configuration
$KEY_PATH = "D:\Internship Tasks\EC2\trading_bot.pem"
$SERVER = "ubuntu@3.27.205.150"

Write-Host "📡 Connecting to AWS server..." -ForegroundColor Yellow

# Upload and execute fix script
$uploadCommand = "scp -i `"$KEY_PATH`" -o StrictHostKeyChecking=no fix-server-conflicts.sh `$SERVER`:/home/ubuntu/`"
Write-Host "📤 Uploading fix script to server..." -ForegroundColor Blue
Invoke-Expression $uploadCommand

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Fix script uploaded!" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to upload fix script!" -ForegroundColor Red
    Write-Host "📋 Manual fix needed on server:" -ForegroundColor Yellow
    Write-Host "   SSH into server and run:" -ForegroundColor White
    Write-Host "   cd /home/ubuntu/CyberShield-AI-" -ForegroundColor Cyan
    Write-Host "   git stash push" -ForegroundColor Cyan
    Write-Host "   rm -f deploy-no-mongo.sh deploy-server-ready.sh" -ForegroundColor Cyan
    Write-Host "   git pull origin main" -ForegroundColor Cyan
    Write-Host "   sudo systemctl restart cybershield-frontend" -ForegroundColor Cyan
    exit 1
}

Write-Host ""
Write-Host "🔧 Executing fix script on server..." -ForegroundColor Yellow

$executeCommand = "ssh -i `"$KEY_PATH`" -o StrictHostKeyChecking=no $SERVER 'chmod +x /home/ubuntu/fix-server-conflicts.sh && /home/ubuntu/fix-server-conflicts.sh'"
Write-Host "⚙️  Running fix script..." -ForegroundColor Blue
Invoke-Expression $executeCommand

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Server conflicts fixed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📍 Access your application at: http://3.27.205.150" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "🧪 Test the user isolation fix:" -ForegroundColor Yellow
    Write-Host "   - Login with testuser1@example.com (should show 1 analysis)" -ForegroundColor White
    Write-Host "   - Logout completely" -ForegroundColor Red
    Write-Host "   - Login with testuser2@example.com (should show 0 analyses)" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "❌ Automated fix failed!" -ForegroundColor Red
    Write-Host "📋 Please fix manually on the server:" -ForegroundColor Yellow
    Write-Host "   1. SSH into the server" -ForegroundColor White
    Write-Host "   2. cd /home/ubuntu/CyberShield-AI-" -ForegroundColor Cyan
    Write-Host "   3. git stash push" -ForegroundColor Cyan
    Write-Host "   4. rm -f deploy-no-mongo.sh deploy-server-ready.sh" -ForegroundColor Cyan
    Write-Host "   5. git pull origin main" -ForegroundColor Cyan
    Write-Host "   6. sudo systemctl restart cybershield-frontend" -ForegroundColor Cyan
    exit 1
}