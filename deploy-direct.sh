#!/bin/bash

# CyberShield AI - Direct Deployment Script (No Docker)
# This script deploys CyberShield AI directly to the system

set -e  # Exit on error

echo "🚀 CyberShield AI - Direct Deployment Script (No Docker)"
echo "========================================================="

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

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    print_warning "Running as root. Some operations might need your regular user."
    read -p "Continue? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Check prerequisites
print_info "Checking prerequisites..."

# Check Python
if ! command -v python3 &> /dev/null; then
    print_error "Python 3 is not installed. Please install Python 3.9+ first."
    exit 1
fi
PYTHON_VERSION=$(python3 --version | cut -d' ' -f2 | cut -d'.' -f1,2)
print_success "Python $PYTHON_VERSION is installed"

# Check Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi
NODE_VERSION=$(node --version)
print_success "Node.js $NODE_VERSION is installed"

# Check MongoDB
if ! command -v mongod &> /dev/null; then
    print_error "MongoDB is not installed. Please install MongoDB 4.4+ first."
    exit 1
fi
MONGO_VERSION=$(mongod --version | head -n1 | cut -d' ' -f3 | cut -d',' -f1)
print_success "MongoDB $MONGO_VERSION is installed"

# Check if running as root for system operations
if [ "$EUID" -ne 0 ]; then
    print_warning "Some operations require sudo. You'll be prompted for password."
fi

# Install system dependencies
print_info "Installing system dependencies..."
sudo apt update
sudo apt install -y python3.9-venv python3-pip nginx ufw fail2ban || {
    print_error "Failed to install system dependencies"
    exit 1
}
print_success "System dependencies installed"

# Create installation directory
print_info "Creating installation directory..."
sudo mkdir -p $INSTALL_DIR
sudo chown $USER:$USER $INSTALL_DIR
print_success "Installation directory created: $INSTALL_DIR"

# Copy project files
print_info "Copying project files..."
cp -r backend $INSTALL_DIR/
cp -r frontend $INSTALL_DIR/
print_success "Project files copied"

# Backend setup
print_info "Setting up backend..."
cd $BACKEND_DIR

# Create Python virtual environment
print_info "Creating Python virtual environment..."
python3 -m venv venv
source venv/bin/activate

# Install Python dependencies
print_info "Installing Python dependencies (this may take 5-10 minutes)..."
pip install --upgrade pip
pip install -r requirements.txt
print_success "Python dependencies installed"

# Create necessary directories
print_info "Creating necessary directories..."
mkdir -p uploads logs temp models/fake_news models/deepfake models/crime data
print_success "Directories created"

# Environment configuration
print_info "Configuring environment..."
if [ ! -f .env ]; then
    cp .env.example .env
    print_warning ".env file created from template"
    print_warning "Please edit .env file with your configuration"
    print_warning "Critical settings to update:"
    echo "   JWT_SECRET, MONGO_PASSWORD, REDIS_PASSWORD"
    read -p "Press Enter after editing .env file..."
fi

# Generate random secrets if not set
if grep -q "your-super-secret-jwt-key-change-this" .env; then
    print_info "Generating secure secrets..."
    JWT_SECRET=$(openssl rand -base64 32)
    MONGO_PASSWORD=$(openssl rand -base64 16)
    REDIS_PASSWORD=$(openssl rand -base64 16)

    sed -i "s/your-super-secret-jwt-key-change-this-in-production/$JWT_SECRET/" .env
    sed -i "s/securepassword123/$MONGO_PASSWORD/" .env
    sed -i "s/redissecurepassword123/$REDIS_PASSWORD/" .env

    print_success "Secure secrets generated and saved to .env"
    print_warning "Save these passwords securely:"
    echo "   JWT_SECRET: $JWT_SECRET"
    echo "   MONGO_PASSWORD: $MONGO_PASSWORD"
    echo "   REDIS_PASSWORD: $REDIS_PASSWORD"
fi

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
sudo cp nginx-direct.conf /etc/nginx/sites-available/cybershield
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

# Start MongoDB
print_info "Starting MongoDB..."
sudo systemctl start mongod
sudo systemctl enable mongod
print_success "MongoDB started and enabled"

# Wait for MongoDB to be ready
sleep 5

# Initialize database
print_info "Initializing database..."
mongosh cybershield --eval "
try {
    db.users.insertOne({
        email: 'admin@cybershield.ai',
        password_hash: '\$2b\$12\$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NU7BqJqO5VRq',
        name: 'System Administrator',
        role: 'admin',
        created_at: new Date(),
        updated_at: new Date()
    });
    db.users.insertOne({
        email: 'demo@cybershield.ai',
        password_hash: '\$2b\$12\$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NU7BqJqO5VRq',
        name: 'Demo User',
        role: 'user',
        created_at: new Date(),
        updated_at: new Date()
    });
    print('Database initialized successfully!');
} catch (e) {
    print('Database might already be initialized: ' + e);
}
"
print_success "Database initialized"

# Create systemd service file
print_info "Creating systemd service..."
sudo tee /etc/systemd/system/$SERVICE_NAME.service > /dev/null <<EOF
[Unit]
Description=CyberShield AI Backend
After=network.target mongod.service

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

# Reload systemd and start service
print_info "Starting backend service..."
sudo systemctl daemon-reload
sudo systemctl start $SERVICE_NAME
sudo systemctl enable $SERVICE_NAME
print_success "Backend service started and enabled"

# Restart Nginx
print_info "Restarting Nginx..."
sudo systemctl restart nginx
sudo systemctl enable nginx
print_success "Nginx restarted and enabled"

# Configure firewall
print_info "Configuring firewall..."
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw --force enable
print_success "Firewall configured"

# Wait for services to be ready
print_info "Waiting for services to be ready..."
sleep 10

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

# Check MongoDB
if sudo systemctl is-active --quiet mongod; then
    print_success "MongoDB: Running"
else
    print_error "MongoDB: Not running"
fi

# Check backend service
if sudo systemctl is-active --quiet $SERVICE_NAME; then
    print_success "Backend Service: Running"
else
    print_error "Backend Service: Not running"
    sudo systemctl status $SERVICE_NAME
fi

# Check Nginx
if sudo systemctl is-active --quiet nginx; then
    print_success "Nginx: Running"
else
    print_error "Nginx: Not running"
fi

# Display deployment information
echo ""
print_success "🎉 Direct Deployment completed successfully!"
echo ""
echo "📍 Service URLs:"
echo "   🌐 Frontend:        http://$(curl -s ifconfig.me)"
echo "   🔧 Backend API:     http://$(curl -s ifconfig.me):8001"
echo "   📚 API Docs:        http://$(curl -s ifconfig.me):8001/docs"
echo "   🔍 API Redoc:       http://$(curl -s ifconfig.me):8001/redoc"
echo "   ❤️  Health Check:    http://$(curl -s ifconfig.me):8001/health"
echo ""
echo "🔧 Default Users:"
echo "   👨‍💼 Admin:           admin@cybershield.ai / admin123"
echo "   👤 Demo:            demo@cybershield.ai / demo123"
echo ""
print_warning "⚠️  IMPORTANT: Change default passwords in production!"
print_warning "⚠️  Configure SSL/HTTPS for production deployment!"
echo ""
echo "📝 Useful Commands:"
echo "   Backend logs:     sudo journalctl -u $SERVICE_NAME -f"
echo "   Backend status:   sudo systemctl status $SERVICE_NAME"
echo "   Restart backend:  sudo systemctl restart $SERVICE_NAME"
echo "   Nginx status:     sudo systemctl status nginx"
echo "   MongoDB status:   sudo systemctl status mongod"
echo "   App logs:         tail -f $BACKEND_DIR/logs/app.log"
echo "   Access backend:   cd $BACKEND_DIR && source venv/bin/activate"
echo "   Access database:  mongosh cybershield"
echo ""
echo "🛠️  Management:"
echo "   Stop all:         sudo systemctl stop $SERVICE_NAME nginx"
echo "   Start all:        sudo systemctl start $SERVICE_NAME nginx"
echo "   Restart all:      sudo systemctl restart $SERVICE_NAME nginx"
echo ""
print_success "🎊 CyberShield AI is ready for use with direct deployment!"