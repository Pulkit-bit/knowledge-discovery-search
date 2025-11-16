@echo off
echo ========================================
echo Database Setup Script
echo ========================================
echo.

echo This script will help you set up the PostgreSQL database.
echo.
echo Please ensure PostgreSQL is installed and running.
echo.

echo Step 1: Create the database
echo Run this command in psql or pgAdmin:
echo.
echo   CREATE DATABASE knowledge_search;
echo.
pause

echo.
echo Step 2: Initialize the schema
echo.
echo If psql is in your PATH, we'll try to run the initialization script.
echo Otherwise, you'll need to run it manually.
echo.

psql -U postgres -d knowledge_search -f backend\database\init.sql

if %errorlevel% neq 0 (
    echo.
    echo ========================================
    echo Automatic initialization failed.
    echo ========================================
    echo.
    echo Please run this command manually:
    echo.
    echo   psql -U postgres -d knowledge_search -f backend\database\init.sql
    echo.
    echo Or use pgAdmin:
    echo   1. Open pgAdmin
    echo   2. Connect to your PostgreSQL server
    echo   3. Open Query Tool for knowledge_search database
    echo   4. Open and execute backend\database\init.sql
    echo.
) else (
    echo.
    echo ========================================
    echo Database setup complete!
    echo ========================================
)

pause
