#!/bin/bash

# CyberShield AI - Automated Deployment
# Runs complete deployment to AWS EC2

echo "🚀 CyberShield AI - Automated Deployment"
echo "========================================"
echo ""

# Configuration
KEY="D:/Internship Tasks/EC2/trading_bot.pem"
SERVER="ubuntu@3.27.205.150"
PROJECT_DIR="/home/ubuntu/CyberShield-AI-"

# Function to upload and execute
deploy_to_server() {
    echo "📤 Uploading deployment script..."
    scp -i "$KEY" deploy-server-ready.sh "$SERVER:$PROJECT_DIR/"

    if [ $? -ne 0 ]; then
        echo "❌ Upload failed!"
        exit 1
    fi

    echo "✅ Deployment script uploaded"
    echo ""
    echo "🔧 Starting deployment on server..."
    echo "⏱️  This will take 20-30 minutes..."
    echo ""

    ssh -i "$KEY" "$SERVER" "cd $PROJECT_DIR && chmod +x deploy-server-ready.sh && ./deploy-server-ready.sh"

    if [ $? -ne 0 ]; then
        echo "❌ Deployment failed!"
        exit 1
    fi

    echo ""
    echo "✅ Deployment completed!"
}

# Function to check deployment status
check_deployment() {
    echo ""
    echo "🔍 Checking deployment status..."

    ssh -i "$KEY" "$SERVER" << 'ENDSSH'
    echo "📊 Service Status:"
    echo "=================="
    sudo systemctl status mongod | head -3
    sudo systemctl status redis-server | head -3
    sudo systemctl status cybershield-backend | head -3
    sudo systemctl status nginx | head -3

    echo ""
    echo "🏥 Health Checks:"
    echo "=================="
    curl -s http://localhost:8001/health || echo "Backend: Starting..."
    curl -s http://localhost || echo "Frontend: Starting..."
ENDSSH
}

# Main deployment process
echo "🎯 Starting automated deployment to AWS EC2"
echo ""

# Check if deployment script exists
if [ ! -f "deploy-server-ready.sh" ]; then
    echo "❌ deploy-server-ready.sh not found!"
    echo "Please ensure you're in the CyberShield AI project directory"
    exit 1
fi

# Execute deployment
deploy_to_server

# Check deployment status
sleep 5
check_deployment

# Display access information
echo ""
echo "🎊 Deployment Complete!"
echo ""
echo "📍 Access Your Application:"
echo "   🌐 Frontend:        http://3.27.205.150"
echo "   🔧 Backend API:     http://3.27.205.150:8001"
echo "   📚 API Docs:        http://3.27.205.150:8001/docs"
echo ""
echo "🔐 Login Credentials:"
echo "   👨‍💼 Admin:           admin@cybershield.ai / admin123"
echo "   👤 Demo:            demo@cybershield.ai / demo123"
echo ""
echo "🛠️  Management Commands:"
echo "   ssh -i '$KEY' $SERVER"
echo "   sudo systemctl status cybershield-backend"
echo "   sudo journalctl -u cybershield-backend -f"
echo ""
echo "🚀 Your CyberShield AI system is now live!"