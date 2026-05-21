# Quick Deploy - Minimal Files Only
# Fast upload to AWS EC2

Write-Host "🚀 Quick Deploy - Minimal Files Only" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Green
Write-Host ""

$KEY = "D:\Internship Tasks\EC2\trading_bot.pem"
$SERVER = "ubuntu@3.27.205.150"

Write-Host "⏸️  STOP: Press Ctrl+C to stop current upload" -ForegroundColor Red
Write-Host ""

Write-Host "🚀 Alternative Strategy:" -ForegroundColor Yellow
Write-Host ""
Write-Host "Instead of uploading all files, let's use git to create a clean deployment:" -ForegroundColor Blue
Write-Host ""

# Check if this is a git repository
if (Test-Path ".git") {
    Write-Host "✅ Git repository detected" -ForegroundColor Green
    Write-Host ""

    Write-Host "Option 1: Clone directly on server (FASTEST)" -ForegroundColor Yellow
    Write-Host "1. Stop current upload (Ctrl+C)" -ForegroundColor Blue
    Write-Host "2. Connect to server: ssh -i `"$KEY`" ubuntu@3.27.205.150" -ForegroundColor Blue
    Write-Host "3. Clone repo: git clone <your-repo-url> cybershield-ai" -ForegroundColor Blue
    Write-Host "4. Run deployment: cd cybershield-ai && ./deploy-aws.sh" -ForegroundColor Blue
    Write-Host ""

    Write-Host "Option 2: Create deployment package" -ForegroundColor Yellow
    Write-Host "1. Stop current upload (Ctrl+C)" -ForegroundColor Blue
    Write-Host "2. Create clean git archive:" -ForegroundColor Blue
    Write-Host "   git archive --format=tar.gz --output=deploy.tar.gz HEAD" -ForegroundColor Blue
    Write-Host "3. Upload only the tar file (~10MB):" -ForegroundColor Blue
    Write-Host "   scp -i `"$KEY`" deploy.tar.gz ubuntu@3.27.205.150:/tmp/" -ForegroundColor Blue
    Write-Host "4. Extract on server:" -ForegroundColor Blue
    Write-Host "   ssh -i `"$KEY`" ubuntu@3.27.205.150 'cd /home/ubuntu && tar -xzf /tmp/deploy.tar.gz && mv cybershield-ai cybershield-ai-new'" -ForegroundColor Blue
    Write-Host ""

    Write-Host "⏱️  Time estimates:" -ForegroundColor Yellow
    Write-Host "   Option 1 (Git clone): 2-3 minutes" -ForegroundColor Green
    Write-Host "   Option 2 (Tar upload): 5-10 minutes" -ForegroundColor Green
    Write-Host "   Current upload: 1+ hours ❌" -ForegroundColor Red
    Write-Host ""

} else {
    Write-Host "❌ Not a git repository" -ForegroundColor Red
    Write-Host ""
    Write-Host "Alternative: Upload only essential files manually" -ForegroundColor Yellow
    Write-Host ""

    Write-Host "Create these essential files:" -ForegroundColor Blue
    Write-Host "1. backend/main.py" -ForegroundColor Blue
    Write-Host "2. backend/auth.py" -ForegroundColor Blue
    Write-Host "3. backend/deepfake_detector.py" -ForegroundColor Blue
    Write-Host "4. backend/requirements.txt" -ForegroundColor Blue
    Write-Host "5. frontend/package.json" -ForegroundColor Blue
    Write-Host "6. frontend/src/ (entire directory)" -ForegroundColor Blue
    Write-Host "7. frontend/public/ (entire directory)" -ForegroundColor Blue
    Write-Host "8. .env.production" -ForegroundColor Blue
    Write-Host "9. nginx-direct.conf" -ForegroundColor Blue
    Write-Host "10. deploy-aws.sh" -ForegroundColor Blue
    Write-Host ""
}

Write-Host "🎯 RECOMMENDATION:" -ForegroundColor Yellow
Write-Host "Stop current upload (Ctrl+C) and use git clone method - it's fastest!" -ForegroundColor Green
Write-Host ""