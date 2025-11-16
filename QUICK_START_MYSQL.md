# 🚀 Quick Start with MySQL - 3 Commands!

## ✅ Already Done
- Dependencies installed
- MySQL configuration set up
- Code converted to MySQL

## 🎯 What You Do (5 minutes)

### 1. Create Database & Tables

Open MySQL Workbench or command line:

```sql
CREATE DATABASE knowledge_search;
USE knowledge_search;
SOURCE D:/downloads/RapidQuest-Hackathon/backend/database/init-mysql.sql;
```

(Replace path with your actual project path)

### 2. Update Password

Edit `backend\.env`:
```env
DB_PASSWORD=your_mysql_password
```

(If no password, leave empty: `DB_PASSWORD=`)

### 3. Start Application

```cmd
npm run dev
```

### 4. Open Browser

http://localhost:3000

## ✅ Done!

That's it! Your application is running with MySQL.

---

## Alternative: One-Line Database Setup

If MySQL command line is in your PATH:

```cmd
mysql -u root -p -e "CREATE DATABASE knowledge_search; USE knowledge_search; SOURCE backend/database/init-mysql.sql;"
```

Enter password when prompted.

---

## Verify It Works

1. Upload a PDF or text file
2. Search for keywords
3. Filter by categories
4. Preview document
5. Download file

All features work exactly the same!

---

## Need Help?

See `MYSQL_SETUP.md` for detailed instructions.

---

**Time to Running:** ~5 minutes
**Difficulty:** Easy (you already have MySQL!)
