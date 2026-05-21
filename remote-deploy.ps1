# CyberShield AI - Remote Deployment Script
# Runs deployment on AWS EC2 server from local machine

Write-Host "🚀 CyberShield AI - Remote Deployment" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""

$KEY = "D:\Internship Tasks\EC2\trading_bot.pem"
$SERVER = "ubuntu@3.27.205.150"
$PROJECT_DIR = "/home/ubuntu/CyberShield-AI-"
$INSTALL_DIR = "/opt/cybershield"

Write-Host "📡 Connecting to AWS server..." -ForegroundColor Yellow

# Upload deployment script
Write-Host "📤 Uploading deployment script..." -ForegroundColor Blue
scp -i $KEY deploy-server-ready.sh "$SERVER:$PROJECT_DIR/"

# Execute deployment script on server
Write-Host "🔧 Running deployment on server..." -ForegroundColor Blue
Write-Host "This will take 20-30 minutes..." -ForegroundColor Yellow
Write-Host ""

$deployCommand = "ssh -i `"$KEY`" $SERVER `"cd $PROJECT_DIR && chmod +x deploy-server-ready.sh && ./deploy-server-ready.sh`""
Invoke-Expression $deployCommand

Write-Host ""
Write-Host "✅ Deployment completed!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 Access your application at:" -ForegroundColor Yellow
Write-Host "   Frontend: http://3.27.205.150" -ForegroundColor Cyan
Write-Host "   Backend API: http://3.27.205.150:8001" -ForegroundColor Cyan
Write-Host "   API Docs: http://3.27.205.150:8001/docs" -ForegroundColor Cyan
Write-Host ""
Write-Host "🔐 Login credentials:" -ForegroundColor Yellow
Write-Host "   Admin: admin@cybershield.ai / admin123" -ForegroundColor Cyan
Write-Host "   Demo: demo@cybershield.ai / demo123" -ForegroundColor Cyan
Write-Host ""