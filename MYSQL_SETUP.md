# MySQL Setup Guide - MUCH EASIER! ✅

Since you already have MySQL installed, this will be super quick!

## Step 1: Create Database (2 minutes)

### Option A: Using MySQL Workbench (Easiest)

1. Open **MySQL Workbench**
2. Connect to your local MySQL server
3. Click "Create a new schema" button (cylinder icon)
4. Name: `knowledge_search`
5. Click "Apply" → "Apply" → "Finish"
6. Click on `knowledge_search` to select it
7. Click "Open SQL Script" → Select `backend\database\init-mysql.sql`
8. Click "Execute" (⚡ lightning bolt icon)
9. Done! ✅

### Option B: Using Command Line

```cmd
# Connect to MySQL
mysql -u root -p
# Enter your password

# Create database
CREATE DATABASE knowledge_search;

# Use the database
USE knowledge_search;

# Run the initialization script
source D:/downloads/RapidQuest-Hackathon/backend/database/init-mysql.sql;
# (Replace with your actual path)

# Verify tables were created
SHOW TABLES;

# You should see: documents, categories, document_categories

# Check categories
SELECT * FROM categories;

# You should see 10 categories

# Exit
exit;
```

### Option C: Using phpMyAdmin (if installed)

1. Open phpMyAdmin (usually http://localhost/phpmyadmin)
2. Click "New" to create database
3. Name: `knowledge_search`
4. Click "Create"
5. Click on `knowledge_search` database
6. Click "Import" tab
7. Choose file: `backend\database\init-mysql.sql`
8. Click "Go"
9. Done! ✅

## Step 2: Update Password (1 minute)

1. Open `backend\.env`
2. Update these lines:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password_here
   DB_NAME=knowledge_search
   ```
3. Replace `your_mysql_password_here` with your actual MySQL root password
4. If you don't have a password, leave it empty: `DB_PASSWORD=`
5. Save the file

## Step 3: Start Application (1 minute)

```cmd
npm run dev
```

Or double-click: `start-app.bat`

## Step 4: Test

Open: http://localhost:3000

Upload a document and search! 🎉

## Verify Database Setup

Check if everything is set up correctly:

```cmd
mysql -u root -p
USE knowledge_search;
SHOW TABLES;
SELECT * FROM categories;
exit;
```

You should see:
- 3 tables: documents, categories, document_categories
- 10 categories in the categories table

## Troubleshooting

### MySQL Not Running?

**Windows:**
1. Open Services (services.msc)
2. Find "MySQL" or "MySQL80"
3. Right-click → Start

**Or use command:**
```cmd
net start MySQL80
```

### Can't Connect to MySQL?

1. Check MySQL is running (see above)
2. Verify your password in `backend\.env`
3. Try connecting with MySQL Workbench first to test credentials

### Port 3306 Already in Use?

MySQL default port is 3306. If you changed it, update `backend\.env`:
```env
DB_HOST=localhost:3307
```

### Tables Not Created?

Run the SQL script manually:
1. Open MySQL Workbench
2. Connect to server
3. Select `knowledge_search` database
4. Open `backend\database\init-mysql.sql`
5. Execute the script

## Why MySQL is Easier

✅ Already installed on your system
✅ Familiar tools (Workbench, phpMyAdmin)
✅ No new software to install
✅ Simple configuration
✅ Full-text search still works!

## What Changed?

- ✅ Switched from PostgreSQL to MySQL
- ✅ Updated database connection code
- ✅ Created MySQL-compatible SQL schema
- ✅ Updated all queries to MySQL syntax
- ✅ Full-text search using MySQL FULLTEXT indexes

## Features Still Work

✅ File upload
✅ Text extraction
✅ Full-text search (using MySQL FULLTEXT)
✅ Automatic categorization
✅ Category filtering
✅ Document preview
✅ File download

## Next Steps

1. ✅ Create database (Step 1 above)
2. ✅ Update password (Step 2 above)
3. ✅ Start application (Step 3 above)
4. 🧪 Test features
5. 🚀 Deploy
6. 🎥 Record demo
7. 📤 Submit

---

**Total Time:** ~5 minutes to fully running!

Much easier than PostgreSQL setup! 🎊
