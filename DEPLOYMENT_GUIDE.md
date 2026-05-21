# 🚀 CyberShield AI - Server Deployment Guide

**Complete guide for deploying CyberShield AI to your server**

---

## 📋 **DEPLOYMENT CHECKLIST**

### **✅ What I've Prepared for You:**

#### **Docker Configuration:**
- ✅ Multi-stage `Dockerfile` for optimized builds
- ✅ `docker-compose.yml` with all services configured
- ✅ Nginx reverse proxy configuration
- ✅ MongoDB initialization script with default users

#### **Configuration Files:**
- ✅ `.env.example` with all environment variables
- ✅ `nginx.conf` - Main Nginx configuration
- ✅ `default.conf` - Site-specific Nginx configuration
- ✅ `prometheus.yml` - Monitoring configuration

#### **Deployment Scripts:**
- ✅ `deploy.sh` - Linux/macOS deployment script
- ✅ `deploy.bat` - Windows deployment script

#### **Monitoring Setup:**
- ✅ Prometheus configuration ready
- ✅ Grafana integration prepared
- ✅ Health check endpoints configured

---

## 🔧 **WHAT'S REQUIRED FROM YOUR SIDE:**

### **🖥️ Server Requirements:**

#### **Minimum Server Specs:**
- **OS:** Ubuntu 20.04+ / CentOS 8+ / Debian 11+ / Windows Server 2019+
- **RAM:** 4GB minimum (8GB recommended)
- **CPU:** 2 cores minimum (4 cores recommended)
- **Storage:** 50GB minimum (100GB recommended)
- **Network:** Stable internet connection

#### **Software Requirements:**
```bash
# Required Software
✅ Docker 20.10+
✅ Docker Compose 2.0+
✅ Git (for cloning repository)
✅ SSL Certificate (for HTTPS)
✅ Domain Name (recommended for production)
```

### **🔑 Required Information:**

#### **1. Server Access:**
```
📍 Server IP Address: _________________
👤 SSH Username: ______________________
🔐 SSH Password/Key: __________________
🌐 Domain Name: ________________________
```

#### **2. Database Configuration:**
```
🗄️  MongoDB Username: ________________
🔐 MongoDB Password: __________________
📊 Database Name: _____________________
```

#### **3. Security Credentials:**
```
🔑 JWT Secret: ________________________
🔐 Admin Password: ____________________
👤 Admin Email: _______________________
📧 SMTP Email: ________________________
🔐 SMTP Password: ____________________
```

#### **4. SSL/HTTPS (Optional but Recommended):**
```
🔒 SSL Certificate Path: ______________
🔑 SSL Key Path: ______________________
🌐 Domain: ___________________________
```

---

## 🚀 **DEPLOYMENT STEPS**

### **Step 1: Server Preparation**

#### **1.1 Connect to Your Server:**
```bash
# SSH into your server
ssh username@your-server-ip

# Or if using Windows PowerShell
ssh username@your-server-ip
```

#### **1.2 Update System:**
```bash
# Ubuntu/Debian
sudo apt update && sudo apt upgrade -y

# CentOS/RHEL
sudo yum update -y

# Windows Server
# Use Windows Update
```

#### **1.3 Install Docker:**
```bash
# Ubuntu/Debian
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# CentOS/RHEL
sudo yum install -y docker
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER

# Windows
# Download Docker Desktop from https://www.docker.com/products/docker-desktop
```

#### **1.4 Install Docker Compose:**
```bash
# Linux
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Windows
# Docker Compose comes with Docker Desktop
```

#### **1.5 Clone Repository:**
```bash
# Clone the repository
git clone <your-repository-url> cybershield-ai
cd cybershield-ai

# Or if uploading files
# Upload all project files to /home/username/cybershield-ai
```

---

### **Step 2: Configuration**

#### **2.1 Environment Configuration:**
```bash
# Copy environment template
cp .env.example .env

# Edit environment file
nano .env  # or vim .env
```

**Critical Environment Variables to Update:**
```bash
# Security
JWT_SECRET=your-secure-random-jwt-secret-min-32-chars
MONGO_PASSWORD=your-secure-mongodb-password
REDIS_PASSWORD=your-secure-redis-password
ADMIN_PASSWORD=your-secure-admin-password

# Database
MONGODB_URI=mongodb://admin:your-password@mongodb:27017/cybershield?authSource=admin

# Email (if using 2FA email notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Domain (if using custom domain)
DOMAIN=your-domain.com
BASE_URL=https://your-domain.com
FRONTEND_URL=https://your-domain.com
BACKEND_URL=https://your-domain.com/api

# SSL
SSL_ENABLED=true
SSL_CERT_PATH=/etc/nginx/ssl/cert.pem
SSL_KEY_PATH=/etc/nginx/ssl/key.pem
```

#### **2.2 SSL Certificate Setup (Optional but Recommended):**

**Using Let's Encrypt (Free):**
```bash
# Install Certbot
sudo apt install certbot -y  # Ubuntu/Debian
sudo yum install certbot -y  # CentOS/RHEL

# Generate certificate
sudo certbot certonly --standalone -d your-domain.com

# Copy certificates to project
sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem ssl/cert.pem
sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem ssl/key.pem
sudo chmod 644 ssl/cert.pem ssl/key.pem
```

**Using Custom SSL:**
```bash
# Create SSL directory
mkdir -p ssl

# Copy your certificates
cp your-cert.pem ssl/cert.pem
cp your-key.pem ssl/key.pem

# Set permissions
chmod 644 ssl/cert.pem ssl/key.pem
```

---

### **Step 3: Deployment**

#### **3.1 Run Deployment Script:**
```bash
# Make script executable (Linux/macOS)
chmod +x deploy.sh

# Run deployment
./deploy.sh

# Or on Windows
deploy.bat
```

#### **3.2 Manual Deployment (Alternative):**
```bash
# Create directories
mkdir -p uploads logs logs/nginx backups ssl temp models/fake_news models/deepfake models/crime data

# Stop existing containers
docker-compose down

# Build images
docker-compose build --no-cache

# Start containers
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

---

### **Step 4: Verification**

#### **4.1 Health Checks:**
```bash
# Backend health
curl http://your-server-ip:8001/health

# Frontend health
curl http://your-server-ip

# API documentation
curl http://your-server-ip:8001/docs
```

#### **4.2 Check Services:**
```bash
# Container status
docker-compose ps

# Service logs
docker-compose logs backend
docker-compose logs nginx
docker-compose logs mongodb
docker-compose logs redis

# Database connection
docker-compose exec mongodb mongosh --eval "db.adminCommand('ping')"

# Redis connection
docker-compose exec redis redis-cli ping
```

---

### **Step 5: Post-Deployment Configuration**

#### **5.1 Change Default Passwords:**
```bash
# Access backend container
docker-compose exec backend bash

# Update admin password
python -c "
from main import get_password_hash
print('New admin password hash:', get_password_hash('your-new-password'))
"

# Update password in MongoDB
docker-compose exec mongodb mongosh cybershield --eval "
db.users.updateOne(
    {email: 'admin@cybershield.ai'},
    {\$set: {password_hash: 'new-hash-from-above'}}
)
"
```

#### **5.2 Configure Firewall:**
```bash
# Ubuntu/Debian (UFW)
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp
sudo ufw enable

# CentOS/RHEL (firewalld)
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --reload

# Windows
# Configure Windows Firewall rules
```

#### **5.3 Setup Domain (if applicable):**
```bash
# Update DNS records
# A record: your-domain.com -> your-server-ip
# www record: www.your-domain.com -> your-server-ip

# Test DNS propagation
nslookup your-domain.com
ping your-domain.com
```

#### **5.4 Setup Monitoring (Optional):**
```bash
# Enable monitoring
docker-compose --profile monitoring up -d prometheus grafana

# Access Grafana
# URL: http://your-server-ip:3001
# Default credentials: admin/admin123
```

---

## 🔍 **TESTING & VALIDATION**

### **End-to-End Testing Checklist:**

#### **1. User Authentication:**
```bash
# Test registration
curl -X POST http://your-server-ip/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!","name":"Test User"}'

# Test login
curl -X POST http://your-server-ip/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@cybershield.ai","password":"admin123"}'
```

#### **2. AI Features:**
```bash
# Test fake news detection (requires JWT token)
curl -X POST http://your-server-ip/api/fake-news/analyze \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"text":"This is a test news article"}'

# Test deepfake detection (requires file upload)
curl -X POST http://your-server-ip/api/deepfake/detect-image \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@test-image.jpg"
```

#### **3. Database Operations:**
```bash
# Check MongoDB collections
docker-compose exec mongodb mongosh cybershield --eval "show collections"

# Check user data
docker-compose exec mongodb mongosh cybershield --eval "db.users.find().pretty()"

# Check analysis results
docker-compose exec mongodb mongosh cybershield --eval "db.analysis_results.find().pretty()"
```

#### **4. Performance Testing:**
```bash
# Load testing with Apache Bench
ab -n 1000 -c 10 http://your-server-ip/health

# API response time testing
time curl http://your-server-ip/api/dashboard/stats
```

---

## 🛠️ **MANAGEMENT & MAINTENANCE**

### **Common Commands:**

```bash
# View logs
docker-compose logs -f                    # All logs
docker-compose logs -f backend          # Backend logs
docker-compose logs -f nginx            # Nginx logs
docker-compose logs -f mongodb          # MongoDB logs

# Container management
docker-compose ps                        # Status
docker-compose restart                  # Restart all
docker-compose restart backend          # Restart specific service
docker-compose stop                     # Stop all
docker-compose down                     # Stop and remove containers

# Database management
docker-compose exec mongodb mongosh     # Access MongoDB
docker-compose exec redis redis-cli     # Access Redis

# Backup
docker-compose exec mongodb mongodump --archive=/data/backup-$(date +%Y%m%d).gz
docker-compose exec mongodb mongosh --eval "db.adminCommand('shutdown')"

# Updates
git pull                                # Update code
docker-compose build --no-cache         # Rebuild images
docker-compose up -d                    # Restart with new images
```

### **Monitoring:**

```bash
# System resources
htop                                    # System monitor
df -h                                   # Disk usage
docker stats                            # Container stats

# Application logs
tail -f logs/app.log                    # Application logs
tail -f logs/nginx/access.log          # Nginx access logs
tail -f logs/nginx/error.log           # Nginx error logs

# Health checks
curl http://localhost:8001/health       # Backend health
docker-compose ps                       # Container status
```

---

## 🚨 **TROUBLESHOOTING**

### **Common Issues & Solutions:**

#### **1. Containers won't start:**
```bash
# Check logs
docker-compose logs

# Check disk space
df -h

# Restart Docker
sudo systemctl restart docker

# Remove all containers and start fresh
docker-compose down -v
docker-compose up -d
```

#### **2. Database connection issues:**
```bash
# Check MongoDB status
docker-compose ps mongodb

# Restart MongoDB
docker-compose restart mongodb

# Check MongoDB logs
docker-compose logs mongodb

# Test connection
docker-compose exec mongodb mongosh --eval "db.adminCommand('ping')"
```

#### **3. Port conflicts:**
```bash
# Check what's using ports
sudo netstat -tulpn | grep :80
sudo netstat -tulpn | grep :8001

# Change ports in docker-compose.yml if needed
```

#### **4. Memory issues:**
```bash
# Check memory usage
free -h

# Docker stats
docker stats

# Increase swap space if needed
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

#### **5. SSL certificate issues:**
```bash
# Check certificate files
ls -la ssl/

# Verify certificate
openssl x509 -in ssl/cert.pem -text -noout

# Check Nginx configuration
docker-compose exec nginx nginx -t

# Restart Nginx
docker-compose restart nginx
```

---

## 📊 **PERFORMANCE OPTIMIZATION**

### **Recommended Settings:**

#### **1. Docker Resource Limits:**
```yaml
# Add to docker-compose.yml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '2.0'
          memory: 2G
        reservations:
          cpus: '1.0'
          memory: 1G
```

#### **2. Database Optimization:**
```bash
# MongoDB configuration
docker-compose exec mongodb mongosh --eval "
db.adminCommand({
    setParameter: 1,
    maxConns: 1000,
    journalCommitIntervalMs: 100
})
"
```

#### **3. Nginx Optimization:**
```nginx
# Add to nginx.conf
worker_processes auto;
worker_connections 2048;
keepalive_timeout 65;
client_max_body_size 100M;
```

---

## 🔒 **SECURITY RECOMMENDATIONS**

### **Critical Security Steps:**

#### **1. Change Default Credentials:**
```bash
# Update all default passwords
# Admin password, database passwords, JWT secrets
```

#### **2. Enable HTTPS:**
```bash
# Configure SSL certificates
# Update nginx configuration for HTTPS
# Redirect HTTP to HTTPS
```

#### **3. Firewall Configuration:**
```bash
# Only allow necessary ports
# Block unused ports
# Setup fail2ban for brute force protection
```

#### **4. Regular Updates:**
```bash
# Keep system updated
# Update Docker images regularly
# Monitor security advisories
```

#### **5. Backup Strategy:**
```bash
# Automated database backups
# Regular file backups
# Disaster recovery plan
```

---

## 📞 **SUPPORT & RESOURCES**

### **Documentation:**
- API Documentation: `http://your-server-ip:8001/docs`
- Project README: Available in repository
- Development Guide: `docs/DEVELOPMENT_GUIDE.md`

### **Monitoring:**
- Grafana Dashboard: `http://your-server-ip:3001`
- Prometheus: `http://your-server-ip:9090`
- Health Checks: `http://your-server-ip:8001/health`

### **Logs Location:**
- Application logs: `./logs/app.log`
- Nginx access logs: `./logs/nginx/access.log`
- Nginx error logs: `./logs/nginx/error.log`
- Docker logs: `docker-compose logs`

---

## 🎉 **DEPLOYMENT SUCCESS!**

Your CyberShield AI system is now deployed and ready for use!

**Next Steps:**
1. ✅ Access your application at `http://your-server-ip`
2. ✅ Login with admin credentials (remember to change password!)
3. ✅ Configure email settings for 2FA notifications
4. ✅ Setup monitoring and alerts
5. ✅ Perform end-to-end testing
6. ✅ Configure backup strategy

**For issues or questions:**
- Check logs: `docker-compose logs -f`
- Health check: `curl http://your-server-ip:8001/health`
- Container status: `docker-compose ps`

---

**🚀 Your CyberShield AI system is production-ready!**

*Deployed with ❤️ for Digital Security*