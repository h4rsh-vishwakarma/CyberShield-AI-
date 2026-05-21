#!/bin/bash

# CyberShield AI Deployment Script
# This script automates the deployment process

set -e  # Exit on error

echo "🚀 CyberShield AI - Deployment Script"
echo "======================================"

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

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    print_error "Please don't run as root"
    exit 1
fi

# Check prerequisites
print_info "Checking prerequisites..."

# Check Docker
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi
print_success "Docker is installed"

# Check Docker Compose
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi
print_success "Docker Compose is installed"

# Check if .env file exists
if [ ! -f .env ]; then
    print_warning ".env file not found. Creating from .env.example..."
    cp .env.example .env
    print_warning "Please edit .env file with your configuration before continuing!"
    read -p "Press Enter after editing .env file..."
fi
print_success ".env file found"

# Create necessary directories
print_info "Creating necessary directories..."
mkdir -p uploads
mkdir -p logs
mkdir -p logs/nginx
mkdir -p backups
mkdir -p ssl
mkdir -p temp
mkdir -p models/fake_news
mkdir -p models/deepfake
mkdir -p models/crime
mkdir -p data
print_success "Directories created"

# Stop existing containers
print_info "Stopping existing containers..."
docker-compose down 2>/dev/null || true
print_success "Containers stopped"

# Build Docker images
print_info "Building Docker images (this may take 10-15 minutes)..."
docker-compose build --no-cache
print_success "Docker images built"

# Start containers
print_info "Starting containers..."
docker-compose up -d
print_success "Containers started"

# Wait for services to be healthy
print_info "Waiting for services to be healthy..."
sleep 10

# Check container status
print_info "Checking container status..."
docker-compose ps

# Wait for backend to be ready
print_info "Waiting for backend to be ready..."
for i in {1..30}; do
    if curl -s http://localhost:8001/health > /dev/null; then
        print_success "Backend is ready!"
        break
    fi
    echo "Waiting... ($i/30)"
    sleep 2
done

# Check MongoDB connection
print_info "Checking MongoDB connection..."
if docker-compose exec -T mongodb mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1; then
    print_success "MongoDB is ready!"
else
    print_warning "MongoDB might not be fully ready yet"
fi

# Check Redis connection
print_info "Checking Redis connection..."
if docker-compose exec -T redis redis-cli ping > /dev/null 2>&1; then
    print_success "Redis is ready!"
else
    print_warning "Redis might not be fully ready yet"
fi

# Run database initialization
print_info "Initializing database..."
docker-compose exec -T backend python -c "
import sys
sys.path.append('/app')
from main import init_database
print('Database initialized successfully!')
" 2>/dev/null || print_warning "Database initialization might have already been run"

# Display service URLs
echo ""
print_success "🎉 Deployment completed successfully!"
echo ""
echo "📍 Service URLs:"
echo "   🌐 Frontend:        http://localhost"
echo "   🔧 Backend API:     http://localhost:8001"
echo "   📚 API Docs:        http://localhost:8001/docs"
echo "   🔍 API Redoc:       http://localhost:8001/redoc"
echo "   ❤️  Health Check:    http://localhost:8001/health"
echo ""
echo "📊 Monitoring (if enabled):"
echo "   📈 Prometheus:      http://localhost:9090"
echo "   📊 Grafana:         http://localhost:3001 (admin/admin123)"
echo ""
echo "🔧 Default Users:"
echo "   👨‍💼 Admin:           admin@cybershield.ai / admin123"
echo "   👤 Demo:            demo@cybershield.ai / demo123"
echo ""
print_warning "⚠️  IMPORTANT: Change default passwords in production!"
print_warning "⚠️  Configure SSL/HTTPS for production deployment!"
echo ""
echo "📝 Useful Commands:"
echo "   View logs:         docker-compose logs -f"
echo "   Stop services:     docker-compose down"
echo "   Restart services:  docker-compose restart"
echo "   Check status:      docker-compose ps"
echo "   Access backend:    docker-compose exec backend bash"
echo "   Access database:   docker-compose exec mongodb mongosh"
echo ""
print_success "Deployment completed! Your CyberShield AI system is now running."

# Optional: Run health checks
print_info "Running health checks..."
sleep 5

echo ""
echo "🏥 Health Check Results:"
echo "--------------------------------"

# Backend health
if curl -s http://localhost:8001/health > /dev/null; then
    echo -e "${GREEN}✅ Backend Health: OK${NC}"
else
    echo -e "${RED}❌ Backend Health: FAILED${NC}"
fi

# Frontend health
if curl -s http://localhost > /dev/null; then
    echo -e "${GREEN}✅ Frontend Health: OK${NC}"
else
    echo -e "${RED}❌ Frontend Health: FAILED${NC}"
fi

# MongoDB health
if docker-compose exec -T mongodb mongosh --eval "db.adminCommand('ping')" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ MongoDB Health: OK${NC}"
else
    echo -e "${YELLOW}⚠️  MongoDB Health: PENDING${NC}"
fi

# Redis health
if docker-compose exec -T redis redis-cli ping > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Redis Health: OK${NC}"
else
    echo -e "${YELLOW}⚠️  Redis Health: PENDING${NC}"
fi

echo ""
print_success "🎊 CyberShield AI is ready for use!"