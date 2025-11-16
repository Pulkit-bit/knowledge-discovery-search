@echo off
echo ========================================
echo Starting Knowledge Discovery Application
echo ========================================
echo.

echo Checking if database is set up...
echo.

echo If you haven't set up the database yet:
echo 1. Open pgAdmin
echo 2. Create database: knowledge_search
echo 3. Run backend\database\init.sql
echo.
echo Press Ctrl+C to cancel, or
pause

echo.
echo Starting application...
echo.
echo Backend will start on: http://localhost:5000
echo Frontend will start on: http://localhost:3000
echo.
echo Press Ctrl+C to stop the application
echo.

npm run dev
