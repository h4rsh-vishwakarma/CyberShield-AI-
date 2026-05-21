#!/bin/bash

# CyberShield AI Backend Startup Script

echo "🚀 Starting CyberShield AI Backend..."
echo "================================"

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.9+ first."
    exit 1
fi

# Check if MongoDB is running
echo "🔍 Checking MongoDB connection..."
if command -v mongod &> /dev/null; then
    # Try to start MongoDB if it's not running
    if ! pgrep -x "mongod" > /dev/null; then
        echo "📦 Starting MongoDB..."
        mkdir -p ./data/db
        mongod --dbpath ./data/db --fork --logpath ./data/mongodb.log --bind_ip 127.0.0.1 --port 27017 > /dev/null 2>&1 &
        MONGO_PID=$!
        echo "✅ MongoDB started (PID: $MONGO_PID)"
        sleep 2
    else
        echo "✅ MongoDB is already running"
    fi
else
    echo "⚠️  MongoDB not found. Install MongoDB or update MONGODB_URI in .env"
fi

# Check virtual environment
if [ ! -d "venv" ]; then
    echo "📦 Creating Python virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📦 Installing/updating dependencies..."
pip install -r requirements.txt --quiet

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p uploads logs data/db

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚙️  Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created. Update it with your configuration if needed."
fi

# Start the backend server
echo "🚀 Starting FastAPI server..."
echo "================================"
echo "🌐 API will be available at: http://localhost:8000"
echo "📚 API Documentation: http://localhost:8000/docs"
echo "💡 Press Ctrl+C to stop the server"
echo "================================"

# Run the server
python main.py