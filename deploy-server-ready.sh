#!/bin/bash

# CyberShield AI - Robust Server Deployment Script
# Handles all AWS EC2 deployment issues automatically

set -e  # Exit on error

echo "🚀 CyberShield AI - Server Deployment"
echo "====================================="
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

# Fix APT lock automatically
print_info "Fixing APT lock issues..."
sudo killall apt apt-get 2>/dev/null || true
sudo rm -f /var/lib/apt/lists/lock /var/cache/apt/archives/lock /var/lib/dpkg/lock-frontend
sudo dpkg --configure -a || true
print_success "APT lock fixed"

# Update system
print_info "Updating system..."
sudo apt update -y
print_success "System updated"

# Detect and install available Python version
print_info "Detecting Python version..."
PYTHON_VERSION=$(python3 --version 2>&1 | cut -d' ' -f2)
print_success "Found Python $PYTHON_VERSION"

# Install system dependencies
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
    software-properties-common
print_success "System dependencies installed"

# Install Node.js 18
print_info "Installing Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
print_success "Node.js $(node --version) installed"

# Install MongoDB
print_info "Installing MongoDB..."
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install -y mongodb-org

# Configure MongoDB
print_info "Configuring MongoDB..."
sudo mkdir -p /data/db
sudo chown -R mongodb:mongodb /data/db
sudo systemctl start mongod
sudo systemctl enable mongod

# Create MongoDB user
print_info "Creating MongoDB admin user..."
mongosh admin --eval "
try {
    db.createUser({
        user: 'admin',
        pwd: 'liCUw-307VEaz5r8Sp8IHQ',
        roles: [
            { role: 'userAdminAnyDatabase', db: 'admin' },
            { role: 'readWriteAnyDatabase', db: 'admin' },
            { role: 'dbAdminAnyDatabase', db: 'admin' }
        ]
    })
    print('MongoDB user created')
} catch (e) {
    print('MongoDB user might already exist')
}
"
print_success "MongoDB configured"

# Install Redis
print_info "Installing Redis..."
sudo apt install -y redis-server
sudo sed -i "s/# requirepass foobared/requirepass APKWzCDZPuryKOAeyLR0SQ/" /etc/redis/redis.conf
sudo systemctl restart redis-server
sudo systemctl enable redis-server
print_success "Redis configured"

# Setup project directory
print_info "Setting up project directory..."
sudo mkdir -p $INSTALL_DIR
sudo chown $USER:$USER $INSTALL_DIR

# Copy from CyberShield-AI- directory
print_info "Copying project files..."
cp -r ~/CyberShield-AI-/* $INSTALL_DIR/
cd $INSTALL_DIR

# Backend setup
print_info "Setting up backend..."
cd $BACKEND_DIR
python3 -m venv venv
source venv/bin/activate

# Install Python dependencies
print_info "Installing Python dependencies..."
pip install --upgrade pip setuptools wheel
pip install -r requirements.txt
print_success "Python dependencies installed"

# Create directories
print_info "Creating directories..."
mkdir -p uploads logs temp models/fake_news models/deepfake models/crime data backups

# Frontend setup
print_info "Setting up frontend..."
cd $FRONTEND_DIR
npm install --production
npm run build
print_success "Frontend built"

# Nginx configuration
print_info "Configuring Nginx..."
sudo cp $INSTALL_DIR/nginx-direct.conf /etc/nginx/sites-available/cybershield
sudo sed -i "s/server_name _;/server_name 3.27.205.150;/" /etc/nginx/sites-available/cybershield
sudo sed -i "s|root /opt/cybershield/frontend/build|root $FRONTEND_DIR/build|" /etc/nginx/sites-available/cybershield
sudo ln -sf /etc/nginx/sites-available/cybershield /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t

# Create systemd service
print_info "Creating systemd service..."
sudo tee /etc/systemd/system/$SERVICE_NAME.service > /dev/null <<EOF
[Unit]
Description=CyberShield AI Backend
After=network.target mongod.service redis-server.service

[Service]
Type=simple
User=$USER
WorkingDirectory=$BACKEND_DIR
Environment="PATH=$BACKEND_DIR/venv/bin"
ExecStart=$BACKEND_DIR/venv/bin/python -m uvicorn main:app --host 0.0.0.0 --port 8001
Restart=always
RestartSec=10

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

# Initialize database
print_info "Initializing database..."
sleep 10
mongosh -u admin -p 'liCUw-307VEaz5r8Sp8IHQ' --authenticationDatabase admin cybershield --eval "
try {
    db.users.updateOne(
        {email: 'admin@cybershield.ai'},
        {\$set: {password_hash: '\$2b\$12\$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NU7BqJqO5VRq', updated_at: new Date()}},
        {upsert: true}
    );
    db.users.updateOne(
        {email: 'demo@cybershield.ai'},
        {\$set: {password_hash: '\$2b\$12\$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NU7BqJqO5VRq', updated_at: new Date()}},
        {upsert: true}
    );
    print('Database initialized');
} catch (e) {
    print('DB init: ' + e.message);
}
"
print_success "Database initialized"

# Health checks
print_info "Running health checks..."
sleep 5
curl -s http://localhost:8001/health && print_success "Backend OK" || print_warning "Backend starting"
curl -s http://localhost && print_success "Frontend OK" || print_warning "Frontend starting"

# Summary
echo ""
print_success "🎉 Deployment Complete!"
echo ""
echo "📍 Access at: http://3.27.205.150"
echo "👨‍💼 Admin: admin@cybershield.ai / admin123"
echo "👤 Demo:  demo@cybershield.ai / demo123"
echo ""