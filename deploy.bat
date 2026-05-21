@echo off
REM CyberShield AI Deployment Script for Windows
REM This script automates the deployment process

echo 🚀 CyberShield AI - Deployment Script
echo ======================================
echo.

REM Color settings (Windows 10+)
set "GREEN=[92m"
set "RED=[91m"
set "YELLOW=[93m"
set "BLUE=[94m"
set "NC=[0m"

REM Functions
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

REM Check Docker
docker --version >nul 2>&1
if errorlevel 1 (
    call :print_error "Docker is not installed. Please install Docker Desktop first."
    pause
    exit /b 1
)
call :print_success "Docker is installed"

REM Check Docker Compose
docker-compose --version >nul 2>&1
if errorlevel 1 (
    call :print_error "Docker Compose is not installed. Please install Docker Compose first."
    pause
    exit /b 1
)
call :print_success "Docker Compose is installed"

REM Check if .env file exists
if not exist .env (
    call :print_warning ".env file not found. Creating from .env.example..."
    copy .env.example .env
    call :print_warning "Please edit .env file with your configuration before continuing!"
    pause
)
call :print_success ".env file found"

REM Create necessary directories
call :print_info "Creating necessary directories..."
if not exist uploads mkdir uploads
if not exist logs mkdir logs
if not exist logs\nginx mkdir logs\nginx
if not exist backups mkdir backups
if not exist ssl mkdir ssl
if not exist temp mkdir temp
if not exist models\fake_news mkdir models\fake_news
if not exist models\deepfake mkdir models\deepfake
if not exist models\crime mkdir models\crime
if not exist data mkdir data
call :print_success "Directories created"

REM Stop existing containers
call :print_info "Stopping existing containers..."
docker-compose down 2>nul
call :print_success "Containers stopped"

REM Build Docker images
call :print_info "Building Docker images (this may take 10-15 minutes)..."
docker-compose build --no-cache
if errorlevel 1 (
    call :print_error "Docker build failed!"
    pause
    exit /b 1
)
call :print_success "Docker images built"

REM Start containers
call :print_info "Starting containers..."
docker-compose up -d
if errorlevel 1 (
    call :print_error "Failed to start containers!"
    pause
    exit /b 1
)
call :print_success "Containers started"

REM Wait for services to be healthy
call :print_info "Waiting for services to be healthy..."
timeout /t 10 /nobreak >nul

REM Check container status
call :print_info "Checking container status..."
docker-compose ps

REM Wait for backend to be ready
call :print_info "Waiting for backend to be ready..."
set /a counter=0
:wait_loop
if %counter% geq 30 (
    call :print_warning "Backend is taking longer than expected to start..."
    goto :continue
)
curl -s http://localhost:8001/health >nul 2>&1
if errorlevel 1 (
    set /a counter+=1
    echo Waiting... (%counter%/30)
    timeout /t 2 /nobreak >nul
    goto :wait_loop
)
call :print_success "Backend is ready!"
:continue

REM Check MongoDB connection
call :print_info "Checking MongoDB connection..."
docker-compose exec -T mongodb mongosh --eval "db.adminCommand('ping')" >nul 2>&1
if errorlevel 1 (
    call :print_warning "MongoDB might not be fully ready yet"
) else (
    call :print_success "MongoDB is ready!"
)

REM Check Redis connection
call :print_info "Checking Redis connection..."
docker-compose exec -T redis redis-cli ping >nul 2>&1
if errorlevel 1 (
    call :print_warning "Redis might not be fully ready yet"
) else (
    call :print_success "Redis is ready!"
)

REM Display service URLs
echo.
call :print_success "🎉 Deployment completed successfully!"
echo.
echo 📍 Service URLs:
echo    🌐 Frontend:        http://localhost
echo    🔧 Backend API:     http://localhost:8001
echo    📚 API Docs:        http://localhost:8001/docs
echo    🔍 API Redoc:       http://localhost:8001/redoc
echo    ❤️  Health Check:    http://localhost:8001/health
echo.
echo 📊 Monitoring (if enabled):
echo    📈 Prometheus:      http://localhost:9090
echo    📊 Grafana:         http://localhost:3001 (admin/admin123)
echo.
echo 🔧 Default Users:
echo    👨‍💼 Admin:           admin@cybershield.ai / admin123
echo    👤 Demo:            demo@cybershield.ai / demo123
echo.
call :print_warning "⚠️  IMPORTANT: Change default passwords in production!"
call :print_warning "⚠️  Configure SSL/HTTPS for production deployment!"
echo.
echo 📝 Useful Commands:
echo    View logs:         docker-compose logs -f
echo    Stop services:     docker-compose down
echo    Restart services:  docker-compose restart
echo    Check status:      docker-compose ps
echo    Access backend:    docker-compose exec backend bash
echo    Access database:   docker-compose exec mongodb mongosh
echo.
call :print_success "Deployment completed! Your CyberShield AI system is now running."

REM Optional: Run health checks
call :print_info "Running health checks..."
timeout /t 5 /nobreak >nul

echo.
echo 🏥 Health Check Results:
echo --------------------------------

REM Backend health
curl -s http://localhost:8001/health >nul 2>&1
if errorlevel 1 (
    echo %RED%❌ Backend Health: FAILED%NC%
) else (
    echo %GREEN%✅ Backend Health: OK%NC%
)

REM Frontend health
curl -s http://localhost >nul 2>&1
if errorlevel 1 (
    echo %RED%❌ Frontend Health: FAILED%NC%
) else (
    echo %GREEN%✅ Frontend Health: OK%NC%
)

REM MongoDB health
docker-compose exec -T mongodb mongosh --eval "db.adminCommand('ping')" >nul 2>&1
if errorlevel 1 (
    echo %YELLOW%⚠️  MongoDB Health: PENDING%NC%
) else (
    echo %GREEN%✅ MongoDB Health: OK%NC%
)

REM Redis health
docker-compose exec -T redis redis-cli ping >nul 2>&1
if errorlevel 1 (
    echo %YELLOW%⚠️  Redis Health: PENDING%NC%
) else (
    echo %GREEN%✅ Redis Health: OK%NC%
)

echo.
call :print_success "🎊 CyberShield AI is ready for use!"
pause