@echo off
REM IndiCrafts Docker Build Script for Windows
REM This script builds all Docker images for the IndiCrafts application

echo 🐳 Building IndiCrafts Docker Images...

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker is not running. Please start Docker Desktop and try again.
    exit /b 1
)

REM Check if .env file exists
if not exist .env (
    echo [WARNING] .env file not found. Creating from template...
    copy env.example .env
    echo [WARNING] Please edit .env file with your configuration before running again.
    exit /b 1
)

REM Build backend
echo [INFO] Building backend image...
cd server
docker build -t indicrafts-backend .
if %errorlevel% neq 0 (
    echo [ERROR] Failed to build backend image
    exit /b 1
)
echo [SUCCESS] Backend image built successfully!
cd ..

REM Build frontend
echo [INFO] Building frontend image...
cd frontend
docker build -t indicrafts-frontend .
if %errorlevel% neq 0 (
    echo [ERROR] Failed to build frontend image
    exit /b 1
)
echo [SUCCESS] Frontend image built successfully!
cd ..

echo [SUCCESS] All Docker images built successfully!
echo.
echo 🚀 You can now run:
echo    docker-compose up -d          # For production
echo    docker-compose -f docker-compose.dev.yml up -d  # For development
echo.
echo 📊 Check status with:
echo    docker-compose ps
echo.
echo 📝 View logs with:
echo    docker-compose logs -f
