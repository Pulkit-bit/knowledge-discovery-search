# 🚀 START HERE - Quick Setup Guide

## ✅ What's Already Done

1. ✅ Dependencies installed (root, backend, frontend)
2. ✅ Environment file configured (`backend\.env`)
3. ✅ Upload directory created (`backend\uploads`)

## 📋 What You Need to Do

### Step 1: Set Up PostgreSQL Database (5 minutes)

**You need to do this manually because PostgreSQL requires your password.**

#### Option A: Using pgAdmin (Recommended - Easiest)

1. Open **pgAdmin** from Start Menu
2. Connect to your PostgreSQL server (enter password)
3. Right-click "Databases" → "Create" → "Database"
4. Name: `knowledge_search` → Save
5. Right-click `knowledge_search` → "Query Tool"
6. Click "Open File" → Select `backend\database\init.sql`
7. Click "Execute" (F5 or ▶️ button)
8. Done! ✅

#### Option B: Using SQL Shell (psql)

1. Open "SQL Shell (psql)" from Start Menu
2. Press Enter 4 times (use defaults)
3. Enter your PostgreSQL password
4. Copy and paste these commands:

```sql
CREATE DATABASE knowledge_search;
\c knowledge_search
\i 'D:/downloads/RapidQuest-Hackathon/backend/database/init.sql'
\q
```

(Replace the path with your actual project path)

### Step 2: Update Database Password (1 minute)

1. Open `backend\.env` in a text editor
2. Find this line:
   ```
   DATABASE_URL=postgresql://postgres:password@localhost:5432/knowledge_search
   ```
3. Replace `password` with your actual PostgreSQL password
4. Save the file

### Step 3: Start the Application (1 minute)

Open a terminal in the project root and run:

```cmd
npm run dev
```

This will start:
- Backend on http://localhost:5000
- Frontend on http://localhost:3000

**Wait for both services to start** (you'll see "Server is running" and "Local: http://localhost:3000")

### Step 4: Open in Browser

Navigate to: **http://localhost:3000**

You should see the Knowledge Discovery interface! 🎉

## 🧪 Quick Test

1. Click "Upload Documents"
2. Drag and drop a PDF or text file
3. Wait for upload to complete
4. Search for keywords from your document
5. Click on the document to preview
6. Try filtering by categories

## ❌ Troubleshooting

### PostgreSQL Not Installed?

Download from: https://www.postgresql.org/download/windows/

### Database Setup Failed?

See detailed instructions in: `DATABASE_SETUP_INSTRUCTIONS.md`

### Port Already in Use?

Kill the process or change port in `backend\.env`:
```
PORT=5001
```

### Backend Won't Start?

1. Check PostgreSQL is running (services.msc)
2. Verify database password in `backend\.env`
3. Ensure database `knowledge_search` exists

### Frontend Won't Start?

1. Check backend is running first
2. Try: `cd frontend && npm run dev`

## 📁 Important Files

- `backend\.env` - Database configuration (UPDATE PASSWORD HERE)
- `backend\database\init.sql` - Database schema (run this in pgAdmin)
- `DATABASE_SETUP_INSTRUCTIONS.md` - Detailed database setup
- `TROUBLESHOOTING.md` - Common issues and solutions

## 🎯 Next Steps After Testing

1. ✅ Test all features locally
2. 🚀 Deploy (see `DEPLOYMENT.md`)
3. 🎥 Record demo video (see `SUBMISSION_CHECKLIST.md`)
4. 📤 Submit to hackathon

## 💡 Quick Commands

```cmd
# Start application
npm run dev

# Stop application
Ctrl + C

# Start backend only
cd backend && npm run dev

# Start frontend only
cd frontend && npm run dev

# Check if PostgreSQL is running
services.msc
```

## 🆘 Need Help?

1. Check `TROUBLESHOOTING.md`
2. Check `DATABASE_SETUP_INSTRUCTIONS.md`
3. Check `README.md`

---

**Current Status:**
- ✅ Dependencies installed
- ✅ Environment configured
- ⏳ Database setup (YOU NEED TO DO THIS)
- ⏳ Start application (AFTER DATABASE SETUP)

**Time to Complete:** ~10 minutes total
