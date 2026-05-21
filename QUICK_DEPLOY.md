# 🚀 QUICK DEPLOYMENT GUIDE

**Fast-track deployment for CyberShield AI**

---

## ⚡ **5-MINUTE DEPLOYMENT**

### **Prerequisites Check:**
```bash
# You need:
✅ Server with SSH access
✅ 4GB+ RAM, 2+ CPU cores
✅ 50GB+ storage
✅ Docker & Docker Compose installed
```

### **Quick Start Commands:**

#### **1. Connect to Server:**
```bash
ssh username@your-server-ip
```

#### **2. Upload & Deploy:**
```bash
# Upload project files (via SCP/SFTP/Git)
git clone <your-repo-url> cybershield-ai
cd cybershield-ai

# Configure environment
cp .env.example .env
nano .env  # Update JWT_SECRET, MONGO_PASSWORD, REDIS_PASSWORD

# Deploy!
chmod +x deploy.sh
./deploy.sh
```

#### **3. Verify Deployment:**
```bash
# Health check
curl http://your-server-ip/health

# Check status
docker-compose ps

# Access application
# Open browser: http://your-server-ip
```

---

## 🔑 **MINIMUM REQUIRED CHANGES**

### **Update These in `.env` file:**

```bash
# MUST CHANGE THESE:
JWT_SECRET=generate-random-32-char-secret-here
MONGO_PASSWORD=secure-mongodb-password-here
REDIS_PASSWORD=secure-redis-password-here

# RECOMMENDED:
ADMIN_PASSWORD=secure-admin-password-here
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

---

## 📱 **ACCESS YOUR APPLICATION**

### **Default Credentials:**
```
Admin:  admin@cybershield.ai / admin123
Demo:   demo@cybershield.ai / demo123
```

### **Service URLs:**
```
Frontend:       http://your-server-ip
Backend API:    http://your-server-ip:8001
API Docs:       http://your-server-ip:8001/docs
Health Check:   http://your-server-ip:8001/health
```

---

## 🛠️ **COMMON COMMANDS**

```bash
# View logs
docker-compose logs -f

# Restart services
docker-compose restart

# Stop services
docker-compose down

# Check status
docker-compose ps

# Access backend
docker-compose exec backend bash

# Access database
docker-compose exec mongodb mongosh
```

---

## 🚨 **TROUBLESHOOTING**

### **Services won't start:**
```bash
docker-compose down -v
docker-compose up -d
```

### **Check logs:**
```bash
docker-compose logs backend
docker-compose logs nginx
```

### **Health check:**
```bash
curl http://localhost:8001/health
docker-compose ps
```

---

## 📚 **DETAILED DOCUMENTATION**

- **Full Guide:** [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
- **Readiness:** [DEPLOYMENT_READINESS.md](DEPLOYMENT_READINESS.md)
- **System Status:** [SYSTEM_STATUS_REPORT.md](SYSTEM_STATUS_REPORT.md)

---

## ✅ **SUCCESS CHECKLIST**

- [ ] All containers running (`docker-compose ps`)
- [ ] Health check OK (`curl /health`)
- [ ] Frontend loads in browser
- [ ] Can login with admin credentials
- [ ] API docs accessible

---

## 🎯 **NEED HELP?**

```bash
# Check everything
docker-compose ps
docker-compose logs -f

# Restart if needed
docker-compose restart

# Check system resources
htop
df -h
```

---

**🚀 Ready to deploy in 5 minutes!**