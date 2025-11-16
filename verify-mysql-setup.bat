@echo off
echo ========================================
echo Verifying MySQL Database Setup
echo ========================================
echo.

echo Checking if tables exist in knowledge_search database...
echo.
echo Enter your MySQL password when prompted...
echo.

mysql -u root -p -D knowledge_search -e "SHOW TABLES; SELECT COUNT(*) as category_count FROM categories;"

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo Verification Complete!
    echo ========================================
    echo.
    echo You should see:
    echo - 3 tables: categories, document_categories, documents
    echo - category_count: 10
    echo.
    echo If you see these, you're ready to run: npm run dev
    echo.
) else (
    echo.
    echo ========================================
    echo Tables not found!
    echo ========================================
    echo.
    echo You need to run the initialization script:
    echo.
    echo In MySQL Workbench:
    echo 1. Select knowledge_search schema
    echo 2. File -^> Open SQL Script
    echo 3. Select: backend\database\init-mysql.sql
    echo 4. Execute (lightning bolt icon)
    echo.
)

pause
