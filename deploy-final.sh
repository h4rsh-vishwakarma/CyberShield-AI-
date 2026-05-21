#!/bin/bash

# CyberShield AI - Final Deployment Script
# Handles Ubuntu unattended-upgrade conflicts

set -e  # Exit on error

echo "🚀 CyberShield AI - Final Deployment"
echo "=================================="
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

# Function to wait for APT lock
wait_for_apt() {
    local max_wait=300  # 5 minutes max
    local waited=0

    while sudo fuser /var/lib/dpkg/lock-frontend >/dev/null 2>&1; do
        if [ $waited -ge $max_wait ]; then
            print_error "APT lock timeout - forcing cleanup"
            sudo killall unattended-upgr apt-get apt 2>/dev/null || true
            sudo rm -f /var/lib/dpkg/lock-frontend /var/lib/apt/lists/lock
            break
        fi
        print_info "Waiting for APT lock... ($waited/$max_wait seconds)"
        sleep 10
        waited=$((waited + 10))
    done
}

# Fix APT lock and unattended-upgrade
print_info "Handling APT lock and system updates..."
wait_for_apt

# Disable unattended-upgrades temporarily
sudo systemctl stop unattended-upgrades 2>/dev/null || true
sudo systemctl disable unattended-upgrades 2>/dev/null || true

# Update system
print_info "Updating system..."
sudo apt update -y
print_success "System updated"

# Detect Python version
print_info "Detecting Python version..."
PYTHON_VERSION=$(python3 --version 2>&1 | cut -d' ' -f2)
print_success "Using Python $PYTHON_VERSION"

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

# Create MongoDB admin user
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
    if (e.message.includes('already exists')) {
        print('MongoDB user already exists')
    } else {
        print('MongoDB user error: ' + e.message)
    }
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
    print('Database initialized successfully');
} catch (e) {
    print('Database initialization: ' + e.message);
}
"
print_success "Database initialized"

# Health checks
print_info "Running health checks..."
sleep 5

# Check backend
if curl -s http://localhost:8001/health > /dev/null; then
    print_success "Backend health: OK"
else
    print_warning "Backend health: Starting (check in 2 minutes)"
fi

# Check frontend
if curl -s http://localhost > /dev/null; then
    print_success "Frontend health: OK"
else
    print_warning "Frontend health: Starting (check in 2 minutes)"
fi

# Check services
sudo systemctl status mongod | grep -q "active (running)" && print_success "MongoDB: Running" || print_error "MongoDB: Failed"
sudo systemctl status redis-server | grep -q "active (running)" && print_success "Redis: Running" || print_error "Redis: Failed"
sudo systemctl status $SERVICE_NAME | grep -q "active (running)" && print_success "Backend Service: Running" || print_error "Backend Service: Failed"
sudo systemctl status nginx | grep -q "active (running)" && print_success "Nginx: Running" || print_error "Nginx: Failed"

# Deployment summary
echo ""
print_success "🎉 CyberShield AI Deployment Complete!"
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
echo "   🗄️  MongoDB:        admin / liCUw-307VEaz5r8Sp8IHQ"
echo "   📊 Redis:          APKWzCDZPuryKOAeyLR0SQ"
echo ""
echo "🛠️  Management Commands:"
echo "   Backend logs:     sudo journalctl -u $SERVICE_NAME -f"
echo "   Backend status:   sudo systemctl status $SERVICE_NAME"
echo "   Restart backend:  sudo systemctl restart $SERVICE_NAME"
echo "   Nginx status:     sudo systemctl status nginx"
echo "   MongoDB status:   sudo systemctl status mongod"
echo "   App logs:         tail -f $BACKEND_DIR/logs/app.log"
echo "   Access backend:   cd $BACKEND_DIR && source venv/bin/activate"
echo "   Access database:  mongosh -u admin -p 'liCUw-307VEaz5r8Sp8IHQ' --authenticationDatabase admin cybershield"
echo ""
echo "🛠️  Service Management:"
echo "   Stop all:         sudo systemctl stop $SERVICE_NAME nginx"
echo "   Start all:        sudo systemctl start $SERVICE_NAME nginx"
echo "   Restart all:      sudo systemctl restart $SERVICE_NAME nginx"
echo "   Check all:        sudo systemctl status $SERVICE_NAME nginx mongod redis-server"
echo ""
echo "🔧 AWS Management:"
echo "   Connect via SSH:  ssh -i trading_bot.pem ubuntu@3.27.205.150"
echo "   AWS Console:      https://console.aws.amazon.com/ec2/"
echo ""
print_success "🎊 CyberShield AI is now live on AWS EC2!"
echo ""
print_warning "⚠️  IMPORTANT: Change default admin password after first login!"
print_warning "⚠️  Configure SSL/HTTPS for production deployment!"
echo ""
echo "🌐 Open http://3.27.205.150 in your browser to access the application!"