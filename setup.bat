@echo off
echo ========================================
echo Knowledge Discovery Setup Script
echo ========================================
echo.

echo [1/5] Installing root dependencies...
call npm install
if %errorlevel% neq 0 (
    echo Error: Failed to install root dependencies
    exit /b 1
)
echo.

echo [2/5] Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo Error: Failed to install backend dependencies
    exit /b 1
)
cd ..
echo.

echo [3/5] Installing frontend dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo Error: Failed to install frontend dependencies
    exit /b 1
)
cd ..
echo.

echo [4/5] Creating backend .env file...
if not exist backend\.env (
    copy backend\.env.example backend\.env
    echo Created backend\.env file. Please update with your database credentials.
) else (
    echo backend\.env already exists, skipping...
)
echo.

echo [5/5] Setup complete!
echo.
echo ========================================
echo Next Steps:
echo ========================================
echo 1. Set up PostgreSQL database:
echo    - Create database: CREATE DATABASE knowledge_search;
echo    - Run: psql -U postgres -d knowledge_search -f backend\database\init.sql
echo.
echo 2. Update backend\.env with your database credentials
echo.
echo 3. Start the application:
echo    - Run: npm run dev
echo    - Or start services separately:
echo      Backend:  cd backend ^&^& npm run dev
echo      Frontend: cd frontend ^&^& npm run dev
echo.
echo 4. Open http://localhost:3000 in your browser
echo ========================================
pause
