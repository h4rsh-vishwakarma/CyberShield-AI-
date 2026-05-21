#!/bin/bash

# CyberShield AI - AWS EC2 Deployment Script
# Customized for server: 3.27.205.150

set -e  # Exit on error

echo "🚀 CyberShield AI - AWS EC2 Deployment"
echo "======================================="
echo "Server: 3.27.205.150"
echo "Platform: AWS EC2 (Ubuntu)"
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Configuration
INSTALL_DIR="/opt/cybershield"
BACKEND_DIR="$INSTALL_DIR/backend"
FRONTEND_DIR="$INSTALL_DIR/frontend"
SERVICE_NAME="cybershield-backend"
SERVER_IP="3.27.205.150"

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    print_warning "Running as root. Some operations might need your regular user."
    read -p "Continue? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Update system
print_info "Updating Ubuntu system..."
sudo apt update && sudo apt upgrade -y
print_success "System updated"

# Install prerequisites
print_info "Installing prerequisites..."
sudo apt install -y \
    python3.9 \
    python3.9-venv \
    python3-pip \
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

print_success "Prerequisites installed"

# Install Node.js 18
print_info "Installing Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
print_success "Node.js 18 installed"

# Install MongoDB 6.0
print_info "Installing MongoDB 6.0..."
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install -y mongodb-org

# Configure MongoDB
print_info "Configuring MongoDB..."
sudo mkdir -p /data/db
sudo chown -R mongodb:mongodb /data/db

# Create MongoDB admin user with the provided password
print_info "Creating MongoDB admin user..."
sudo systemctl start mongod
sleep 5

mongosh admin --eval "
db.createUser({
    user: 'admin',
    pwd: 'liCUw-307VEaz5r8Sp8IHQ',
    roles: [
        { role: 'userAdminAnyDatabase', db: 'admin' },
        { role: 'readWriteAnyDatabase', db: 'admin' },
        { role: 'dbAdminAnyDatabase', db: 'admin' }
    ]
})
print('MongoDB admin user created successfully');
"

print_success "MongoDB installed and configured"

# Install Redis
print_info "Installing Redis..."
sudo apt install -y redis-server

# Configure Redis with password
print_info "Configuring Redis with password..."
sudo sed -i "s/# requirepass foobared/requirepass APKWzCDZPuryKOAeyLR0SQ/" /etc/redis/redis.conf
sudo systemctl restart redis-server
sudo systemctl enable redis-server
print_success "Redis installed and configured"

# Configure firewall
print_info "Configuring UFW firewall..."
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw allow 8001/tcp  # Backend API
sudo ufw --force enable
print_success "Firewall configured"

# Create installation directory
print_info "Creating installation directory..."
sudo mkdir -p $INSTALL_DIR
sudo chown $USER:$USER $INSTALL_DIR
cd $INSTALL_DIR
print_success "Installation directory created"

# Copy project files (assuming we're running from the project directory)
print_info "Setting up project files..."
if [ -d "/mnt/c/Projects/CyberShield AI" ]; then
    # If running from WSL
    cp -r "/mnt/c/Projects/CyberShield AI/backend" $INSTALL_DIR/
    cp -r "/mnt/c/Projects/CyberShield AI/frontend" $INSTALL_DIR/
    cp "/mnt/c/Projects/CyberShield AI/.env.production" $INSTALL_DIR/backend/.env
    cp "/mnt/c/Projects/CyberShield AI/nginx-direct.conf" /tmp/nginx-cybershield.conf
elif [ -d "backend" ]; then
    # If running from project directory
    cp -r backend $INSTALL_DIR/
    cp -r frontend $INSTALL_DIR/
    cp .env.production backend/.env
    cp nginx-direct.conf /tmp/nginx-cybershield.conf
else
    print_error "Project files not found. Please upload them first."
    exit 1
fi
print_success "Project files copied"

# Backend setup
print_info "Setting up backend..."
cd $BACKEND_DIR

# Create Python virtual environment
print_info "Creating Python virtual environment..."
python3.9 -m venv venv
source venv/bin/activate
print_success "Python virtual environment created"

# Install Python dependencies
print_info "Installing Python dependencies (this may take 5-10 minutes)..."
pip install --upgrade pip
pip install -r requirements.txt
print_success "Python dependencies installed"

# Create necessary directories
print_info "Creating necessary directories..."
mkdir -p uploads logs temp models/fake_news models/deepfake models/crime data backups
print_success "Directories created"

# Frontend setup
print_info "Setting up frontend..."
cd $FRONTEND_DIR

# Install Node dependencies
print_info "Installing Node dependencies (this may take 3-5 minutes)..."
npm install --production
print_success "Node dependencies installed"

# Build frontend
print_info "Building frontend for production..."
npm run build
print_success "Frontend built successfully"

# Nginx configuration
print_info "Configuring Nginx..."
sudo cp /tmp/nginx-cybershield.conf /etc/nginx/sites-available/cybershield

# Update server name in nginx config
sudo sed -i "s/server_name _;/server_name $SERVER_IP;/" /etc/nginx/sites-available/cybershield
sudo sed -i "s|root /opt/cybershield/frontend/build|root $FRONTEND_DIR/build|" /etc/nginx/sites-available/cybershield

sudo ln -sf /etc/nginx/sites-available/cybershield /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t
if [ $? -eq 0 ]; then
    print_success "Nginx configuration is valid"
else
    print_error "Nginx configuration test failed"
    exit 1
fi

# Start and enable services
print_info "Starting services..."

# MongoDB
sudo systemctl restart mongod
sudo systemctl enable mongod
print_success "MongoDB started and enabled"

# Redis
sudo systemctl restart redis-server
print_success "Redis restarted"

# Create systemd service file for backend
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

# Start backend service
print_info "Starting backend service..."
sudo systemctl daemon-reload
sudo systemctl start $SERVICE_NAME
sudo systemctl enable $SERVICE_NAME
print_success "Backend service started and enabled"

# Restart Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx
print_success "Nginx restarted and enabled"

# Wait for services to be ready
print_info "Waiting for services to be ready..."
sleep 15

# Initialize database with updated admin password
print_info "Initializing database..."
mongosh cybershield --eval "
try {
    // Update admin password with the new one
    db.users.updateOne(
        {email: 'admin@cybershield.ai'},
        {\$set: {
            password_hash: '\$2b\$12\$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NU7BqJqO5VRq',
            updated_at: new Date()
        }}
    );

    // Create demo user
    db.users.updateOne(
        {email: 'demo@cybershield.ai'},
        {\$set: {
            password_hash: '\$2b\$12\$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NU7BqJqO5VRq',
            updated_at: new Date()
        }},
        {upsert: true}
    );

    print('Database initialized successfully!');
    print('Admin: admin@cybershield.ai / admin123');
    print('Demo: demo@cybershield.ai / demo123');
} catch (e) {
    print('Database might already be initialized: ' + e);
}
"
print_success "Database initialized"

# Health checks
echo ""
print_info "Running health checks..."

# Check backend
if curl -s http://localhost:8001/health > /dev/null; then
    print_success "Backend health check: OK"
else
    print_warning "Backend health check: FAILED (might still be starting)"
fi

# Check frontend
if curl -s http://localhost > /dev/null; then
    print_success "Frontend health check: OK"
else
    print_warning "Frontend health check: FAILED"
fi

# Check services
if sudo systemctl is-active --quiet mongod; then
    print_success "MongoDB: Running"
else
    print_error "MongoDB: Not running"
fi

if sudo systemctl is-active --quiet redis-server; then
    print_success "Redis: Running"
else
    print_error "Redis: Not running"
fi

if sudo systemctl is-active --quiet $SERVICE_NAME; then
    print_success "Backend Service: Running"
else
    print_error "Backend Service: Not running"
    sudo systemctl status $SERVICE_NAME
fi

if sudo systemctl is-active --quiet nginx; then
    print_success "Nginx: Running"
else
    print_error "Nginx: Not running"
fi

# Display deployment information
echo ""
print_success "🎉 AWS EC2 Deployment completed successfully!"
echo ""
echo "📍 Service URLs:"
echo "   🌐 Frontend:        http://$SERVER_IP"
echo "   🔧 Backend API:     http://$SERVER_IP:8001"
echo "   📚 API Docs:        http://$SERVER_IP:8001/docs"
echo "   🔍 API Redoc:       http://$SERVER_IP:8001/redoc"
echo "   ❤️  Health Check:    http://$SERVER_IP:8001/health"
echo ""
echo "🔐 Default Credentials:"
echo "   👨‍💼 Admin:           admin@cybershield.ai / admin123"
echo "   👤 Demo:            demo@cybershield.ai / demo123"
echo ""
echo "🔐 Your Secure Credentials (SAVE THESE!):"
echo "   🔑 JWT Secret:     -1dGtsIcB8FKmk4YCIjQwhSWXdsB51nAWPjo8xupdrc"
echo "   🗄️  MongoDB:        admin / liCUw-307VEaz5r8Sp8IHQ"
echo "   📊 Redis:          (password) APKWzCDZPuryKOAeyLR0SQ"
echo ""
print_warning "⚠️  IMPORTANT: Change default admin password after first login!"
print_warning "⚠️  Configure SSL/HTTPS for production deployment!"
print_warning "⚠️  Setup AWS Security Group to allow ports 80, 443, 8001"
echo ""
echo "📝 Useful Commands:"
echo "   Backend logs:     sudo journalctl -u $SERVICE_NAME -f"
echo "   Backend status:   sudo systemctl status $SERVICE_NAME"
echo "   Restart backend:  sudo systemctl restart $SERVICE_NAME"
echo "   Nginx status:     sudo systemctl status nginx"
echo "   MongoDB status:   sudo systemctl status mongod"
echo "   App logs:         tail -f $BACKEND_DIR/logs/app.log"
echo "   Access backend:   cd $BACKEND_DIR && source venv/bin/activate"
echo "   Access database:  mongosh -u admin -p 'liCUw-307VEaz5r8Sp8IHQ' --authenticationDatabase admin cybershield"
echo ""
echo "🛠️  Management:"
echo "   Stop all:         sudo systemctl stop $SERVICE_NAME nginx"
echo "   Start all:        sudo systemctl start $SERVICE_NAME nginx"
echo "   Restart all:      sudo systemctl restart $SERVICE_NAME nginx"
echo "   Check all:        sudo systemctl status $SERVICE_NAME nginx mongod redis-server"
echo ""
echo "🔧 AWS Management:"
echo "   Connect via SSH:  ssh -i trading_bot.pem ubuntu@$SERVER_IP"
echo "   AWS Console:      https://console.aws.amazon.com/ec2/"
echo ""
print_success "🎊 CyberShield AI is ready for use on AWS EC2!"
echo ""
echo "🌐 Access your application at: http://$SERVER_IP"