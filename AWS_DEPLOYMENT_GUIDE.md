# 🚀 AWS EC2 Deployment Guide - CyberShield AI

**Your Server:** 3.27.205.150 (Ubuntu)  
**Deployment Method:** Direct (No Docker)

---

## 🔧 **AWS SECURITY GROUP SETUP** (CRITICAL!)

### **Before Deploying, Configure Your AWS Security Group:**

1. **Go to AWS Console → EC2 → Security Groups**
2. **Find your instance's security group**
3. **Add these inbound rules:**

| Type | Protocol | Port | Source | Description |
|------|----------|------|--------|-------------|
| SSH | TCP | 22 | Your IP | SSH Access |
| HTTP | TCP | 80 | 0.0.0.0/0 | Frontend |
| HTTPS | TCP | 443 | 0.0.0.0/0 | Frontend (SSL) |
| Custom TCP | TCP | 8001 | 0.0.0.0/0 | Backend API |

**⚠️ IMPORTANT:** Without these rules, your application won't be accessible!

---

## 🚀 **DEPLOYMENT STEPS**

### **Step 1: Connect to Your AWS EC2 Server**

**From Windows PowerShell:**
```powershell
# Navigate to your key directory
cd "D:\Internship Tasks\EC2"

# Connect to your server
ssh -i trading_bot.pem ubuntu@3.27.205.150
```

**From Git Bash:**
```bash
cd "/d/Internship Tasks/EC2"
chmod 400 trading_bot.pem
ssh -i trading_bot.pem ubuntu@3.27.205.150
```

**If you get a permissions error:**
```bash
chmod 400 trading_bot.pem
ssh -i trading_bot.pem ubuntu@3.27.205.150
```

---

### **Step 2: Upload Project Files to Server**

**Option A: Using SCP (Recommended)**
```powershell
# From PowerShell in your project directory
cd "D:\Projects\CyberShield AI"

# Upload entire project
scp -i "D:\Internship Tasks\EC2\trading_bot.pem" -r . ubuntu@3.27.205.150:/home/ubuntu/cybershield-ai
```

**Option B: Using Git on Server**
```bash
# After connecting to server
git clone <your-repository-url> cybershield-ai
cd cybershield-ai
```

**Option C: Using FileZilla (GUI)**
1. Open FileZilla
2. Host: 3.27.205.150
3. Username: ubuntu
4. Key file: D:\Internship Tasks\EC2\trading_bot.pem
5. Upload all project files to /home/ubuntu/cybershield-ai

---

### **Step 3: Deploy to Server**

**After uploading files and connecting to server:**

```bash
# Navigate to project directory
cd /home/ubuntu/cybershield-ai

# Make deployment script executable
chmod +x deploy-aws.sh

# Run deployment
./deploy-aws.sh
```

**⏱️ Expected Time:** 20-30 minutes

---

## 📋 **DEPLOYMENT SCRIPT WILL AUTOMATICALLY:**

1. ✅ Update Ubuntu system
2. ✅ Install Python 3.9, Node.js 18
3. ✅ Install MongoDB with your password
4. ✅ Install Redis with your password
5. ✅ Configure UFW firewall
6. ✅ Install Nginx and configure it
7. ✅ Setup Python virtual environment
8. ✅ Install all Python dependencies
9. ✅ Build frontend for production
10. ✅ Create systemd service for backend
11. ✅ Start all services (MongoDB, Redis, Backend, Nginx)
12. ✅ Initialize database with admin user
13. ✅ Configure your secure credentials

---

## 🔐 **YOUR CREDENTIALS (SAVE THESE!)**

### **System Credentials:**
```
🔑 JWT Secret:     -1dGtsIcB8FKmk4YCIjQwhSWXdsB51nAWPjo8xupdrc
🗄️  MongoDB:        admin / liCUw-307VEaz5r8Sp8IHQ
📊 Redis:          (password) APKWzCDZPuryKOAeyLR0SQ
```

### **Application Credentials:**
```
👨‍💼 Admin Email:    admin@cybershield.ai
🔐 Admin Password: admin123 (CHANGE AFTER FIRST LOGIN!)

👤 Demo Email:     demo@cybershield.ai
🔐 Demo Password:  demo123
```

---

## 📍 **AFTER DEPLOYMENT - ACCESS YOUR APP**

### **Service URLs:**
```
🌐 Frontend:        http://3.27.205.150
🔧 Backend API:     http://3.27.205.150:8001
📚 API Docs:        http://3.27.205.150:8001/docs
🔍 API Redoc:       http://3.27.205.150:8001/redoc
❤️  Health Check:    http://3.27.205.150:8001/health
```

---

## 🛠️ **MANAGEMENT COMMANDS**

### **Service Management:**
```bash
# Backend
sudo systemctl start cybershield-backend
sudo systemctl stop cybershield-backend
sudo systemctl restart cybershield-backend
sudo systemctl status cybershield-backend

# All services
sudo systemctl restart cybershield-backend nginx mongod redis-server
sudo systemctl status cybershield-backend nginx mongod redis-server
```

### **View Logs:**
```bash
# Backend service logs
sudo journalctl -u cybershield-backend -f

# Application logs
tail -f /opt/cybershield/backend/logs/app.log

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log
```

### **Database Access:**
```bash
# Connect to MongoDB
mongosh -u admin -p 'liCUw-307VEaz5r8Sp8IHQ' --authenticationDatabase admin cybershield

# Connect to Redis
redis-cli -a APKWzCDZPuryKOAeyLR0SQ
```

---

## 🧪 **TEST YOUR DEPLOYMENT**

### **Health Checks:**
```bash
# Backend health
curl http://localhost:8001/health

# Frontend access
curl http://localhost

# API documentation
curl http://localhost:8001/docs
```

### **Browser Testing:**
1. Open browser
2. Go to: `http://3.27.205.150`
3. Login with: `admin@cybershield.ai` / `admin123`
4. Test features:
   - Dashboard statistics
   - Fake news analysis
   - Deepfake detection
   - Crime analytics

---

## ⚠️ **COMMON AWS ISSUES & SOLUTIONS**

### **Issue 1: Can't Connect via SSH**
```bash
# Check key permissions
chmod 400 trading_bot.pem

# Try with verbose output
ssh -vvv -i trading_bot.pem ubuntu@3.27.205.150
```

### **Issue 2: Connection Refused**
- **Check Security Group rules** (ports 80, 443, 8001)
- **Check UFW firewall:** `sudo ufw status`
- **Check if services are running:** `sudo systemctl status nginx`

### **Issue 3: Services Won't Start**
```bash
# Check service status
sudo systemctl status cybershield-backend

# View logs
sudo journalctl -u cybershield-backend -n 50

# Restart service
sudo systemctl restart cybershield-backend
```

### **Issue 4: MongoDB Connection Issues**
```bash
# Check MongoDB status
sudo systemctl status mongod

# Check MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log

# Test connection
mongosh -u admin -p 'liCUw-307VEaz5r8Sp8IHQ' --authenticationDatabase admin
```

### **Issue 5: Out of Memory**
```bash
# Check memory usage
free -h

# Check disk usage
df -h

# Restart services if needed
sudo systemctl restart mongod redis-server cybershield-backend
```

---

## 🔒 **SECURITY HARDENING**

### **After Successful Deployment:**

1. **Change Default Admin Password:**
```bash
# Login to app and change via UI, or:
mongosh -u admin -p 'liCUw-307VEaz5r8Sp8IHQ' --authenticationDatabase admin cybershield --eval "
db.users.updateOne(
    {email: 'admin@cybershield.ai'},
    {\$set: {updated_at: new Date()}}
)
"
```

2. **Setup SSL Certificate:**
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo certbot renew --dry-run
```

3. **Configure Fail2Ban:**
```bash
# Enable fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban

# Check status
sudo fail2ban-client status
```

4. **Setup Automatic Backups:**
```bash
# Create backup script
sudo nano /opt/backup-cybershield.sh

# Add cron job
sudo crontab -e
# Add: 0 2 * * * /opt/backup-cybershield.sh
```

---

## 📊 **PERFORMANCE MONITORING**

### **Check System Resources:**
```bash
# Overall system stats
htop

# Disk usage
df -h

# Memory usage
free -h

# Network connections
netstat -tulpn

# Docker stats (not using Docker, but good to know)
# docker stats (if needed later)
```

---

## 🎯 **DEPLOYMENT CHECKLIST**

### **Before Deployment:**
- [ ] AWS Security Group configured (ports 22, 80, 443, 8001)
- [ ] SSH key has correct permissions (400)
- [ ] Can connect to server via SSH
- [ ] Project files uploaded to server

### **During Deployment:**
- [ ] Deployment script runs without errors
- [ ] All services start successfully
- [ ] No dependency conflicts
- [ ] Database initializes properly

### **After Deployment:**
- [ ] Can access frontend in browser
- [ ] Can login with admin credentials
- [ ] Health checks return OK
- [ ] API documentation is accessible
- [ ] AI features are working
- [ ] Services are set to auto-start

---

## 🚨 **TROUBLESHOOTING QUICK GUIDE**

### **If Something Goes Wrong:**

```bash
# Check everything at once
sudo systemctl status cybershield-backend nginx mongod redis-server

# Check logs
sudo journalctl -u cybershield-backend -f
tail -f /opt/cybershield/backend/logs/app.log

# Restart everything
sudo systemctl restart cybershield-backend nginx mongod redis-server

# Check ports
sudo netstat -tulpn | grep -E ':(80|443|8001|27017|6379)'

# Test connectivity
curl http://localhost:8001/health
curl http://localhost
```

---

## 📞 **GETTING HELP**

### **Useful Commands:**
```bash
# System information
uname -a
df -h
free -h
uptime

# Service management
systemctl list-units --type=service
systemctl --failed

# Network troubleshooting
ping 8.8.8.8
nslookup google.com
curl -v http://localhost:8001/health
```

---

## 🎉 **SUCCESS CRITERIA**

Your deployment is successful when:

- ✅ Frontend loads at http://3.27.205.150
- ✅ Can login with admin credentials
- ✅ API docs accessible at http://3.27.205.150:8001/docs
- ✅ Health check returns OK
- ✅ All services running (`systemctl status` shows active)
- ✅ Can test fake news analysis
- ✅ Can test deepfake detection
- ✅ Dashboard shows statistics

---

## 🚀 **NEXT STEPS AFTER DEPLOYMENT**

1. **Test all features** end-to-end
2. **Change admin password** 
3. **Setup SSL certificate** (for HTTPS)
4. **Configure domain name** (if you have one)
5. **Setup monitoring** and alerts
6. **Configure backups**
7. **Test with real users**

---

**🎊 Your AWS EC2 deployment is ready to begin!**

Follow the steps above and you'll have CyberShield AI running on your AWS server in about 30 minutes.

**First step: Configure your AWS Security Group, then connect via SSH and run the deployment script!**