@echo off
REM Frontend Startup Script for Misinformation AI (Windows)

echo 🚀 Starting Misinformation AI Frontend
echo ======================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

echo ✅ Node.js version: 
node --version

REM Check if npm is available
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ npm version: 
npm --version

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ Failed to install dependencies
        pause
        exit /b 1
    )
    echo ✅ Dependencies installed successfully
) else (
    echo ✅ Dependencies already installed
)

REM Check if backend is running
echo 🔍 Checking backend connection...
curl -s http://localhost:8000/ >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Backend is running on http://localhost:8000
) else (
    echo ⚠️  Backend is not running on http://localhost:8000
    echo 💡 Make sure to start the backend first:
    echo    cd ..\backend ^&^& python start_server.py
)

REM Start the development server
echo 🚀 Starting Next.js development server...
echo 📱 Frontend will be available at: http://localhost:3000
echo 🔗 Backend should be running at: http://localhost:8000
echo.
echo Press Ctrl+C to stop the server
echo.

npm run dev
