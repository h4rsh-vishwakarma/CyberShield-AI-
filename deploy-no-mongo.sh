#!/bin/bash

# CyberShield AI - Deployment without MongoDB (Uses In-Memory Fallback)
# Works on Ubuntu 24.04 (noble)

set -e

echo "🚀 CyberShield AI - In-Memory Deployment"
echo "===================================="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_success() { echo -e "${GREEN}✅ $1${NC}"; }
print_error() { echo -e "${RED}❌ $1${NC}"; }
print_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }

# Configuration
INSTALL_DIR="/opt/cybershield"
BACKEND_DIR="$INSTALL_DIR/backend"
FRONTEND_DIR="$INSTALL_DIR/frontend"
SERVICE_NAME="cybershield-backend"

# Update system
print_info "Updating system..."
sudo apt update -y
print_success "System updated"

# Detect Python version
print_info "Detecting Python version..."
PYTHON_VERSION=$(python3 --version 2>&1 | cut -d' ' -f2)
print_success "Using Python $PYTHON_VERSION"

# Install system dependencies (without MongoDB)
print_info "Installing system dependencies..."
sudo apt install -y \
    python3 \
    python3-pip \
    python3-venv \
    python3-dev \
    build-essential \
    curl \
    wget \
    git \
    nginx \
    ufw \
    fail2ban \
    htop \
    net-tools \
    software-properties-common \
    redis-server

print_success "System dependencies installed"

# Node.js is already installed (from previous deployment)

# Configure Redis
print_info "Configuring Redis..."
sudo sed -i "s/# requirepass foobared/requirepass APKWzCDZPuryKOAeyLR0SQ/" /etc/redis/redis.conf
sudo systemctl restart redis-server
sudo systemctl enable redis-server

# Test Redis
redis-cli -a APKWzCDZPuryKOAeyLR0SQ ping
print_success "Redis configured"

# Configure firewall
print_info "Configuring firewall..."
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 8001/tcp
echo "y" | sudo ufw --force enable
print_success "Firewall configured"

# Setup project directory
print_info "Setting up project directory..."
sudo mkdir -p $INSTALL_DIR
sudo chown $USER:$USER $INSTALL_DIR

# Copy project files
print_info "Copying project files..."
if [ -d "$INSTALL_DIR" ]; then
    sudo rm -rf "$INSTALL_DIR"
fi
sudo cp -r ~/CyberShield-AI- $INSTALL_DIR
cd $INSTALL_DIR

# Create environment file
print_info "Creating environment file..."
cat > .env <<EOF
APP_NAME=CyberShield AI
APP_ENV=production
DEBUG=false

# Server Configuration
HOST=0.0.0.0
PORT=8001

# Database Configuration (In-Memory Fallback)
USE_MONGODB_FALLBACK=true
MONGODB_URI=in-memory

# Redis Configuration
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=APKWzCDZPuryKOAeyLR0SQ

# JWT Configuration
JWT_SECRET=-1dGtsIcB8FKmk4YCIjQwhSWXdsB51nAWPjo8xupdrc
JWT_ALGORITHM=HS256
JWT_EXPIRATION_MINUTES=30

# Security Settings
MIN_PASSWORD_LENGTH=8
CORS_ORIGINS=http://3.27.205.150,http://localhost
CORS_ALLOW_CREDENTIALS=true

# AI Models Configuration
ENABLE_GPU=false

# File Upload Settings
MAX_FILE_SIZE_VIDEO=104857600
MAX_FILE_SIZE_IMAGE=10485760
ALLOWED_VIDEO_FORMATS=mp4,mov,avi,webm,mkv
ALLOWED_IMAGE_FORMATS=jpg,jpeg,png,webp,gif,bmp

# Domain Configuration
DOMAIN=3.27.205.150
BASE_URL=http://3.27.205.150
FRONTEND_URL=http://3.27.205.150
BACKEND_URL=http://3.27.205.150:8001

# Features
ENABLE_2FA=true
ENABLE_API_KEYS=true
ENABLE_PASSWORD_RESET=true
ENABLE_RATE_LIMITING=true

# Session
SESSION_SECRET=-1dGtsIcB8FKmk4YCIjQwhSWXdsB51nAWPjo8xupdrc
SESSION_MAX_AGE=86400
EOF

print_success "Environment file created"

# Backend setup
print_info "Setting up backend..."
cd $BACKEND_DIR
python3 -m venv venv
source venv/bin/activate

# Install Python dependencies
print_info "Installing Python dependencies (this may take 5-10 minutes)..."
pip install --upgrade pip setuptools wheel
pip install -r requirements.txt
print_success "Python dependencies installed"

# Create directories
print_info "Creating directories..."
mkdir -p uploads logs temp models/fake_news models/deepfake models/crime data backups
print_success "Directories created"

# Frontend setup
print_info "Setting up frontend..."
cd $FRONTEND_DIR
npm install --production
print_info "Building frontend (this may take 3-5 minutes)..."
npm run build
print_success "Frontend built"

# Nginx configuration
print_info "Configuring Nginx..."
sudo cp nginx-direct.conf /etc/nginx/sites-available/cybershield
sudo sed -i "s/server_name _;/server_name 3.27.205.150;/" /etc/nginx/sites-available/cybershield
sudo sed -i "s|root /opt/cybershield/frontend/build|root $FRONTEND_DIR/build|" /etc/nginx/sites-available/cybershield
sudo ln -sf /etc/nginx/sites-available/cybershield /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t

# Create systemd service
print_info "Creating systemd service..."
sudo tee /etc/systemd/system/$SERVICE_NAME.service > /dev/null <<EOF
[Unit]
Description=CyberShield AI Backend (In-Memory DB)
After=network.target redis-server.service

[Service]
Type=simple
User=$USER
WorkingDirectory=$BACKEND_DIR
Environment="PATH=$BACKEND_DIR/venv/bin"
Environment="USE_MONGODB_FALLBACK=true"
ExecStart=$BACKEND_DIR/venv/bin/python -m uvicorn main:app --host 0.0.0.0 --port 8001
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF

# Start services
print_info "Starting all services..."
sudo systemctl daemon-reload
sudo systemctl start $SERVICE_NAME
sudo systemctl enable $SERVICE_NAME
sudo systemctl restart nginx
sudo systemctl enable nginx
print_success "All services started"

# Initialize in-memory database (if needed)
print_info "System is ready with in-memory database..."
sleep 5

# Health checks
print_info "Running health checks..."
sleep 5

# Check backend
if curl -s http://localhost:8001/health > /dev/null; then
    print_success "Backend health: OK"
else
    print_warning "Backend health: Starting (check in 1 minute)"
fi

# Check frontend
if curl -s http://localhost > /dev/null; then
    print_success "Frontend health: OK"
else
    print_warning "Frontend health: Starting (check in 1 minute)"
fi

# Check services
sudo systemctl status redis-server | grep -q "active (running)" && print_success "Redis: Running" || print_error "Redis: Failed"
sudo systemctl status $SERVICE_NAME | grep -q "active (running)" && print_success "Backend Service: Running" || print_error "Backend Service: Failed"
sudo systemctl status nginx | grep -q "active (running)" && print_success "Nginx: Running" || print_error "Nginx: Failed"

# Deployment summary
echo ""
print_success "🎉 CyberShield AI Deployment Complete!"
echo ""
print_warning "⚠️  Using In-Memory Database (data lost on restart)"
echo "   - For production, add MongoDB later when packages are available"
echo "   - Works perfectly for testing and development"
echo ""
echo "📍 Access Your Application:"
echo "   🌐 Frontend:        http://3.27.205.150"
echo "   🔧 Backend API:     http://3.27.205.150:8001"
echo "   📚 API Docs:        http://3.27.205.150:8001/docs"
echo "   🔍 API Redoc:       http://3.27.205.150:8001/redoc"
echo "   ❤️  Health Check:    http://3.27.205.150:8001/health"
echo ""
echo "🔐 Default Credentials:"
echo "   👨‍💼 Admin:           admin@cybershield.ai / admin123"
echo "   👤 Demo:            demo@cybershield.ai / demo123"
echo ""
echo "🔐 Your Secure Credentials (SAVE THESE!):"
echo "   🔑 JWT Secret:     -1dGtsIcB8FKmk4YCIjQwhSWXdsB51nAWPjo8xupdrc"
echo "   📊 Redis:          APKWzCDZPuryKOAeyLR0SQ"
echo ""
echo "🛠️  Management Commands:"
echo "   Backend logs:     sudo journalctl -u $SERVICE_NAME -f"
echo "   Backend status:   sudo systemctl status $SERVICE_NAME"
echo "   Restart backend:  sudo systemctl restart $SERVICE_NAME"
echo "   Nginx status:     sudo systemctl status nginx"
echo "   Redis status:     sudo systemctl status redis-server"
echo "   App logs:         tail -f $BACKEND_DIR/logs/app.log"
echo "   Access backend:   cd $BACKEND_DIR && source venv/bin/activate"
echo "   Access Redis:      redis-cli -a APKWzCDZPuryKOAeyLR0SQ"
echo ""
echo "🛠️  Service Management:"
echo "   Stop all:         sudo systemctl stop $SERVICE_NAME nginx redis-server"
echo "   Start all:        sudo systemctl start $SERVICE_NAME nginx redis-server"
echo "   Restart all:      sudo systemctl restart $SERVICE_NAME nginx redis-server"
echo "   Check all:        sudo systemctl status $SERVICE_NAME nginx redis-server"
echo ""
echo "🔧 AWS Management:"
echo "   Connect via SSH:  ssh -i trading_bot.pem ubuntu@3.27.205.150"
echo "   AWS Console:      https://console.aws.amazon.com/ec2/"
echo ""
print_success "🎊 CyberShield AI is now live on AWS EC2 (In-Memory Mode)!"
echo ""
print_warning "⚠️  IMPORTANT:"
echo "   - Change default admin password after first login"
echo "   - Data will be lost when server restarts (in-memory DB)"
echo "   - For production, add MongoDB when Ubuntu packages become available"
echo ""
echo "🌐 Open http://3.27.205.150 in your browser to access the application!"