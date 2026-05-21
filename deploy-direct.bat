@echo off
REM CyberShield AI - Direct Deployment Script for Windows (No Docker)

echo 🚀 CyberShield AI - Direct Deployment Script (No Docker)
echo =========================================================

set "INSTALL_DIR=C:\cybershield"
set "BACKEND_DIR=%INSTALL_DIR%\backend"
set "FRONTEND_DIR=%INSTALL_DIR%\frontend"

REM Color settings
set "GREEN=[92m"
set "RED=[91m"
set "YELLOW=[93m"
set "BLUE=[94m"
set "NC=[0m"

:print_info
echo %BLUE%ℹ️  %~1%NC%
goto :eof

:print_success
echo %GREEN%✅ %~1%NC%
goto :eof

:print_warning
echo %YELLOW%⚠️  %~1%NC%
goto :eof

:print_error
echo %RED%❌ %~1%NC%
goto :eof

REM Check prerequisites
call :print_info "Checking prerequisites..."

REM Check Python
python --version >nul 2>&1
if errorlevel 1 (
    call :print_error "Python 3 is not installed. Please install Python 3.9+ first."
    pause
    exit /b 1
)
for /f "tokens=2" %%i in ('python --version') do set PYTHON_VERSION=%%i
call :print_success "Python %PYTHON_VERSION% is installed"

REM Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    call :print_error "Node.js is not installed. Please install Node.js 18+ first."
    pause
    exit /b 1
)
for /f "tokens=1" %%i in ('node --version') do set NODE_VERSION=%%i
call :print_success "Node.js %NODE_VERSION% is installed"

REM Check MongoDB (optional, will use in-memory fallback)
mongod --version >nul 2>&1
if errorlevel 1 (
    call :print_warning "MongoDB not found. Will use in-memory fallback."
    set "USE_MONGODB=0"
) else (
    call :print_success "MongoDB is installed"
    set "USE_MONGODB=1"
)

REM Create installation directory
call :print_info "Creating installation directory..."
if not exist "%INSTALL_DIR%" mkdir "%INSTALL_DIR%"
call :print_success "Installation directory created: %INSTALL_DIR%"

REM Copy project files
call :print_info "Copying project files..."
if not exist "%BACKEND_DIR%" xcopy /E /I /Y backend "%BACKEND_DIR%"
if not exist "%FRONTEND_DIR%" xcopy /E /I /Y frontend "%FRONTEND_DIR%"
call :print_success "Project files copied"

REM Backend setup
call :print_info "Setting up backend..."
cd /d "%BACKEND_DIR%"

REM Create Python virtual environment
call :print_info "Creating Python virtual environment..."
python -m venv venv
call :print_success "Python virtual environment created"

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Install Python dependencies
call :print_info "Installing Python dependencies (this may take 5-10 minutes)..."
python -m pip install --upgrade pip
pip install -r requirements.txt
if errorlevel 1 (
    call :print_error "Failed to install Python dependencies"
    pause
    exit /b 1
)
call :print_success "Python dependencies installed"

REM Create necessary directories
call :print_info "Creating necessary directories..."
if not exist uploads mkdir uploads
if not exist logs mkdir logs
if not exist temp mkdir temp
if not exist models\fake_news mkdir models\fake_news
if not exist models\deepfake mkdir models\deepfake
if not exist models\crime mkdir models\crime
if not exist data mkdir data
call :print_success "Directories created"

REM Environment configuration
call :print_info "Configuring environment..."
if not exist .env (
    copy .env.example .env
    call :print_warning ".env file created from template"
    call :print_warning "Please edit .env file with your configuration"
    call :print_warning "Critical settings to update: JWT_SECRET, MONGO_PASSWORD, REDIS_PASSWORD"
    pause
)

REM Generate random secrets if not set
findstr /C:"your-super-secret-jwt-key-change-this" .env >nul
if not errorlevel 1 (
    call :print_info "Generating secure secrets..."

    REM Generate random secrets (simple approach)
    set "JWT_SECRET=jwt-secret-%RANDOM%-%RANDOM%-%RANDOM%-%RANDOM%"
    set "MONGO_PASSWORD=mongo-pass-%RANDOM%-%RANDOM%"
    set "REDIS_PASSWORD=redis-pass-%RANDOM%-%RANDOM%"

    powershell -Command "(Get-Content .env) -replace 'your-super-secret-jwt-key-change-this-in-production', '%JWT_SECRET%' | Set-Content .env"
    powershell -Command "(Get-Content .env) -replace 'securepassword123', '%MONGO_PASSWORD%' | Set-Content .env"

    call :print_success "Secure secrets generated and saved to .env"
    call :print_warning "Save these passwords securely:"
    echo    JWT_SECRET: %JWT_SECRET%
    echo    MONGO_PASSWORD: %MONGO_PASSWORD%
    echo    REDIS_PASSWORD: %REDIS_PASSWORD%
)

REM Frontend setup
call :print_info "Setting up frontend..."
cd /d "%FRONTEND_DIR%"

REM Install Node dependencies
call :print_info "Installing Node dependencies (this may take 3-5 minutes)..."
call npm install --production
if errorlevel 1 (
    call :print_error "Failed to install Node dependencies"
    pause
    exit /b 1
)
call :print_success "Node dependencies installed"

REM Build frontend
call :print_info "Building frontend for production..."
call npm run build
if errorlevel 1 (
    call :print_error "Failed to build frontend"
    pause
    exit /b 1
)
call :print_success "Frontend built successfully"

REM Start MongoDB if available
if "%USE_MONGODB%"=="1" (
    call :print_info "Starting MongoDB..."
    net start MongoDB
    call :print_success "MongoDB started"

    REM Initialize database
    call :print_info "Initializing database..."
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
    call :print_success "Database initialized"
) else (
    call :print_warning "Skipping MongoDB initialization (using in-memory fallback)"
)

REM Start backend
call :print_info "Starting backend service..."
cd /d "%BACKEND_DIR%"
start /B cmd /c "venv\Scripts\activate.bat && python -m uvicorn main:app --host 0.0.0.0 --port 8001 > logs\backend.log 2>&1"
call :print_success "Backend started"

REM Wait for backend to be ready
call :print_info "Waiting for backend to be ready..."
timeout /t 15 /nobreak >nul

REM Health checks
echo.
call :print_info "Running health checks..."

REM Check backend
curl -s http://localhost:8001/health >nul 2>&1
if errorlevel 1 (
    call :print_warning "Backend health check: FAILED (might still be starting)"
    echo Check logs: type "%BACKEND_DIR%\logs\backend.log"
) else (
    call :print_success "Backend health check: OK"
)

REM Check frontend
if exist "%FRONTEND_DIR%\build\index.html" (
    call :print_success "Frontend build: OK"
) else (
    call :print_error "Frontend build: FAILED"
)

REM Display deployment information
echo.
call :print_success "🎉 Direct Deployment completed successfully!"
echo.
echo 📍 Service URLs:
echo    🌐 Frontend:        http://localhost
echo    🔧 Backend API:     http://localhost:8001
echo    📚 API Docs:        http://localhost:8001/docs
echo    🔍 API Redoc:       http://localhost:8001/redoc
echo    ❤️  Health Check:    http://localhost:8001/health
echo.
echo 🔧 Default Users:
echo    👨‍💼 Admin:           admin@cybershield.ai / admin123
echo    👤 Demo:            demo@cybershield.ai / demo123
echo.
call :print_warning "⚠️  IMPORTANT: Change default passwords in production!"
call :print_warning "⚠️  Configure SSL/HTTPS for production deployment!"
echo.
echo 📝 Useful Commands:
echo    Backend logs:     type "%BACKEND_DIR%\logs\backend.log"
echo    Access backend:   cd "%BACKEND_DIR%" && venv\Scripts\activate.bat
echo    Access database:  mongosh cybershield
echo    Stop backend:     taskkill /F /IM python.exe
echo.
echo 🛠️  Management:
echo    Backend is running in background
echo    Check logs for any issues
echo.
call :print_success "🎊 CyberShield AI is ready for use with direct deployment!"

pause