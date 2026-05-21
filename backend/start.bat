@echo off
REM CyberShield AI Backend Startup Script for Windows

echo ================================================
echo    CyberShield AI Backend Startup
echo ================================================

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python is not installed. Please install Python 3.9+ first.
    pause
    exit /b 1
)

echo ✅ Python is installed

REM Check if MongoDB is needed and running
echo 🔍 Checking MongoDB connection...
tasklist | find "mongod.exe" >nul 2>&1
if %errorlevel% neq 0 (
    echo 📦 MongoDB is not running. Starting MongoDB...
    mkdir data\db 2>nul
    start /B mongod --dbpath data\db --logpath data\mongodb.log --bind_ip 127.0.0.1 --port 27017
    echo ✅ MongoDB started
    timeout /t 2 >nul
) else (
    echo ✅ MongoDB is already running
)

REM Check virtual environment
if not exist "venv" (
    echo 📦 Creating Python virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo 🔧 Activating virtual environment...
call venv\Scripts\activate

REM Install dependencies
echo 📦 Installing/updating dependencies...
pip install -r requirements.txt --quiet

REM Create necessary directories
echo 📁 Creating necessary directories...
if not exist "uploads" mkdir uploads
if not exist "logs" mkdir logs
if not exist "data\db" mkdir data\db

REM Check if .env file exists
if not exist ".env" (
    echo ⚙️ Creating .env file from template...
    copy .env.example .env
    echo ✅ .env file created. Update it with your configuration if needed.
)

REM Start the backend server
echo ================================================
echo 🚀 Starting FastAPI server
echo ================================================
echo 🌐 API will be available at: http://localhost:8000
echo 📚 API Documentation: http://localhost:8000/docs
echo 💡 Press Ctrl+C to stop the server
echo ================================================

REM Run the server
python main.py

pause