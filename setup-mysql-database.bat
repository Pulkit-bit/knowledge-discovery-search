@echo off
echo ========================================
echo MySQL Database Setup
echo ========================================
echo.

echo This will create the knowledge_search database in MySQL.
echo.
echo Make sure MySQL is running before continuing!
echo.
pause

echo.
echo Enter your MySQL root password when prompted...
echo.

mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS knowledge_search; USE knowledge_search; SOURCE backend/database/init-mysql.sql;"

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo Database setup complete!
    echo ========================================
    echo.
    echo Next steps:
    echo 1. Update backend\.env with your MySQL password
    echo 2. Run: npm run dev
    echo 3. Open: http://localhost:3000
    echo.
) else (
    echo.
    echo ========================================
    echo Setup failed!
    echo ========================================
    echo.
    echo Please try one of these methods:
    echo.
    echo Method 1: MySQL Workbench
    echo   1. Open MySQL Workbench
    echo   2. Create schema: knowledge_search
    echo   3. Execute: backend\database\init-mysql.sql
    echo.
    echo Method 2: Manual Command Line
    echo   mysql -u root -p
    echo   CREATE DATABASE knowledge_search;
    echo   USE knowledge_search;
    echo   SOURCE backend\database\init-mysql.sql;
    echo   exit;
    echo.
    echo See MYSQL_SETUP.md for detailed instructions.
    echo.
)

pause
