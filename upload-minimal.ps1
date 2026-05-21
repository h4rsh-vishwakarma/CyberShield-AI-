# Minimal Upload Script - Only Source Code (50MB vs 500MB+)
# Upload to AWS EC2: 3.27.205.150

Write-Host "🚀 Minimal Upload Script - CyberShield AI" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""

# Configuration
$SERVER = "ubuntu@3.27.205.150"
$KEY = "D:\Internship Tasks\EC2\trading_bot.pem"
$REMOTE_DIR = "/home/ubuntu/cybershield-ai"
$TEMP_DIR = ".\upload-minimal"

Write-Host "📦 Uploading only essential files (~50MB total)" -ForegroundColor Yellow
Write-Host ""

# Create temporary directory for minimal upload
Write-Host "📋 Preparing minimal file set..." -ForegroundColor Blue
if (Test-Path $TEMP_DIR) {
    Remove-Item -Recurse -Force $TEMP_DIR
}
New-Item -ItemType Directory -Path $TEMP_DIR | Out-Null

# Backend files (only source code, no dependencies)
Write-Host "   📦 Backend source files..." -ForegroundColor Blue
New-Item -ItemType Directory -Force "$TEMP_DIR\backend" | Out-Null
Copy-Item "backend\main.py" "$TEMP_DIR\backend\" -Force
Copy-Item "backend\auth.py" "$TEMP_DIR\backend\" -Force
Copy-Item "backend\deepfake_detector.py" "$TEMP_DIR\backend\" -Force
Copy-Item "backend\requirements.txt" "$TEMP_DIR\backend\" -Force

# Copy all Python files except compiled ones
Get-ChildItem "backend\*.py" -Exclude "*test*.py","*__pycache__*" | ForEach-Object {
    Copy-Item $_.FullName "$TEMP_DIR\backend\" -Force
}

# Frontend files (only source, no node_modules)
Write-Host "   📦 Frontend source files..." -ForegroundColor Blue
New-Item -ItemType Directory -Force "$TEMP_DIR\frontend" | Out-Null
Copy-Item "frontend\package.json" "$TEMP_DIR\frontend\" -Force
if (Test-Item "frontend\package-lock.json") {
    Copy-Item "frontend\package-lock.json" "$TEMP_DIR\frontend\" -Force
}

# Copy frontend source (src and public directories)
if (Test-Item "frontend\src") {
    Copy-Item -Recurse "frontend\src" "$TEMP_DIR\frontend\src\" -Force
}
if (Test-Item "frontend\public") {
    Copy-Item -Recurse "frontend\public" "$TEMP_DIR\frontend\public\" -Force
}

# Configuration files
Write-Host "   📦 Configuration files..." -ForegroundColor Blue
Copy-Item ".env.production" "$TEMP_DIR\" -Force
Copy-Item "nginx-direct.conf" "$TEMP_DIR\" -Force
Copy-Item "deploy-aws.sh" "$TEMP_DIR\" -Force

# Get size
$SIZE = (Get-ChildItem -Path $TEMP_DIR -Recurse -File | Measure-Object -Property Length -Sum).Sum / 1MB
Write-Host "   ✅ Prepared files: $([math]::Round($SIZE, 2)) MB" -ForegroundColor Green
Write-Host ""

# Upload to server
Write-Host "🚀 Uploading to AWS EC2..." -ForegroundColor Yellow
Write-Host ""

$uploadCommand = "scp -i `"$KEY`" -r `"$TEMP_DIR\*`" `"$SERVER`:$REMOTE_DIR/`""
Invoke-Expression $uploadCommand

Write-Host ""
Write-Host "✅ Upload complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next steps on server:" -ForegroundColor Blue
Write-Host "   ssh -i `"$KEY`" $SERVER"
Write-Host "   cd $REMOTE_DIR"
Write-Host "   chmod +x deploy-aws.sh"
Write-Host "   ./deploy-aws.sh"
Write-Host ""

# Cleanup
Remove-Item -Recurse -Force $TEMP_DIR
Write-Host "🧹 Cleaned up temporary files" -ForegroundColor Green
Write-Host ""
Write-Host "🎊 Ready for deployment!" -ForegroundColor Green