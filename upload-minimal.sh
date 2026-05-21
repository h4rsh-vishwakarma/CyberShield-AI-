#!/bin/bash

# Minimal Upload Script - Only Source Code (50MB vs 500MB+)
# Upload to AWS EC2: 3.27.205.150

echo "🚀 Minimal Upload Script - CyberShield AI"
echo "=========================================="
echo ""

# Configuration
SERVER="ubuntu@3.27.205.150"
KEY="D:/Internship/Tasks/EC2/trading_bot.pem"
REMOTE_DIR="/home/ubuntu/cybershield-ai"

echo "📦 Uploading only essential files (~50MB total)"
echo ""

# Create temporary directory for minimal upload
TEMP_DIR="./upload-minimal"
rm -rf "$TEMP_DIR"
mkdir -p "$TEMP_DIR"

echo "📋 Preparing minimal file set..."

# Backend files (only source code, no dependencies)
echo "   📦 Backend source files..."
mkdir -p "$TEMP_DIR/backend"
cp backend/main.py "$TEMP_DIR/backend/"
cp backend/auth.py "$TEMP_DIR/backend/"
cp backend/deepfake_detector.py "$TEMP_DIR/backend/"
cp backend/requirements.txt "$TEMP_DIR/backend/"
cp backend/*.py "$TEMP_DIR/backend/" 2>/dev/null || true

# Frontend files (only source, no node_modules)
echo "   📦 Frontend source files..."
mkdir -p "$TEMP_DIR/frontend"
cp frontend/package.json "$TEMP_DIR/frontend/"
cp frontend/package-lock.json "$TEMP_DIR/frontend/" 2>/dev/null || true
cp frontend/.env "$TEMP_DIR/frontend/" 2>/dev/null || true

# Copy frontend source code (excluding node_modules and build)
rsync -av --exclude='node_modules' --exclude='build' --exclude='dist' --exclude='.git' \
    frontend/src/ "$TEMP_DIR/frontend/src/"
rsync -av --exclude='node_modules' --exclude='build' --exclude='dist' --exclude='.git' \
    frontend/public/ "$TEMP_DIR/frontend/public/" 2>/dev/null || true

# Configuration files
echo "   📦 Configuration files..."
cp .env.production "$TEMP_DIR/"
cp nginx-direct.conf "$TEMP_DIR/"
cp deploy-aws.sh "$TEMP_DIR/"

# Get size
SIZE=$(du -sh "$TEMP_DIR" | cut -f1)
echo "   ✅ Prepared files: $SIZE"
echo ""

# Upload to server
echo "🚀 Uploading to AWS EC2..."
echo ""

scp -i "$KEY" -r "$TEMP_DIR"/* "$SERVER:$REMOTE_DIR/"

echo ""
echo "✅ Upload complete!"
echo ""
echo "📝 Next steps on server:"
echo "   ssh -i $KEY $SERVER"
echo "   cd $REMOTE_DIR"
echo "   chmod +x deploy-aws.sh"
echo "   ./deploy-aws.sh"
echo ""

# Cleanup
rm -rf "$TEMP_DIR"
echo "🧹 Cleaned up temporary files"
echo ""
echo "🎊 Ready for deployment!"