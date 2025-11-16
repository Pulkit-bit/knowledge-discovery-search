# 🎯 Visual Setup Guide - 3 Simple Steps

## ✅ Already Done For You

```
[✓] Install Dependencies
[✓] Configure Environment  
[✓] Create Project Structure
[✓] Create Upload Directory
```

## 🔧 What You Need to Do

### Step 1️⃣: Set Up Database (5 minutes)

```
┌─────────────────────────────────────┐
│  Open pgAdmin                       │
│  (Search in Start Menu)             │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│  Right-click "Databases"            │
│  → Create → Database                │
│  → Name: knowledge_search           │
│  → Save                             │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│  Right-click "knowledge_search"     │
│  → Query Tool                       │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│  Click "Open File" icon             │
│  → Select:                          │
│     backend\database\init.sql       │
│  → Click Execute (F5)               │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│  ✅ Database Ready!                 │
└─────────────────────────────────────┘
```

### Step 2️⃣: Update Password (1 minute)

```
┌─────────────────────────────────────┐
│  Open: backend\.env                 │
│  (Use Notepad or any text editor)   │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│  Find this line:                    │
│  DATABASE_URL=postgresql://         │
│    postgres:password@localhost...   │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│  Replace "password" with your       │
│  actual PostgreSQL password         │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│  Save the file                      │
│  ✅ Configuration Updated!          │
└─────────────────────────────────────┘
```

### Step 3️⃣: Start Application (1 minute)

```
┌─────────────────────────────────────┐
│  Open Terminal/Command Prompt       │
│  in project folder                  │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│  Run: npm run dev                   │
│  (or double-click start-app.bat)    │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│  Wait for:                          │
│  "Server is running on port 5000"   │
│  "Local: http://localhost:3000"     │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│  Open Browser:                      │
│  http://localhost:3000              │
│  ✅ Application Running!            │
└─────────────────────────────────────┘
```

## 🎉 Success! What You'll See

```
┌────────────────────────────────────────────────┐
│  Knowledge Discovery                    [Upload]│
│  ┌──────────────────────────────────────────┐ │
│  │  🔍 Search documents, content...         │ │
│  └──────────────────────────────────────────┘ │
├────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────────────────────┐   │
│  │ Filters  │  │  Search Results          │   │
│  │          │  │  ┌────────────────────┐  │   │
│  │ □ Market │  │  │ 📄 Document 1      │  │   │
│  │ □ Sales  │  │  │ Marketing plan...  │  │   │
│  │ □ Product│  │  └────────────────────┘  │   │
│  │ □ Design │  │  ┌────────────────────┐  │   │
│  │          │  │  │ 📄 Document 2      │  │   │
│  └──────────┘  │  │ Sales report...    │  │   │
│                │  └────────────────────┘  │   │
│                └──────────────────────────┘   │
└────────────────────────────────────────────────┘
```

## 🧪 Quick Test Flow

```
1. Click "Upload Documents"
   ↓
2. Drag & drop a PDF or text file
   ↓
3. Wait for "Successfully uploaded"
   ↓
4. Type keywords in search bar
   ↓
5. See your document in results
   ↓
6. Click document to preview
   ↓
7. Click "Download" to get file back
   ↓
✅ Everything works!
```

## ❌ Troubleshooting Quick Fixes

### Problem: Can't find pgAdmin
```
Solution:
1. Search "pgAdmin" in Start Menu
2. Or look in: C:\Program Files\PostgreSQL\14\pgAdmin 4
3. Or use SQL Shell (psql) instead
```

### Problem: Database connection failed
```
Solution:
1. Check PostgreSQL is running:
   - Open services.msc
   - Find "postgresql-x64-14"
   - Ensure it's "Running"
2. Check password in backend\.env
```

### Problem: Port already in use
```
Solution:
1. Open backend\.env
2. Change: PORT=5000 to PORT=5001
3. Restart application
```

### Problem: Upload fails
```
Solution:
1. Check file size (< 50MB)
2. Check file type (PDF, DOCX, TXT, MD, images)
3. Check backend\uploads folder exists
```

## 📁 Important Files Location

```
RapidQuest-Hackathon/
│
├── START_HERE.md              ⭐ Read this first!
├── SETUP_COMPLETE.md          📋 What's been done
├── start-app.bat              🚀 Quick start script
│
├── backend/
│   ├── .env                   🔧 Update password here!
│   └── database/
│       └── init.sql           📊 Run this in pgAdmin
│
└── Documentation/
    ├── DATABASE_SETUP_INSTRUCTIONS.md
    ├── TROUBLESHOOTING.md
    └── SUBMISSION_CHECKLIST.md
```

## ⏱️ Time Breakdown

```
Database Setup:     ████░░░░░░  5 min
Update Password:    █░░░░░░░░░  1 min
Start Application:  █░░░░░░░░░  1 min
Test Features:      ████░░░░░░  10 min
─────────────────────────────────────
Total:              ██████████  ~20 min
```

## 🎯 Your Checklist

```
Before Starting:
□ PostgreSQL installed
□ PostgreSQL running (check services.msc)
□ Know your PostgreSQL password

Step 1 - Database:
□ pgAdmin opened
□ Database "knowledge_search" created
□ init.sql executed successfully
□ See 10 categories in database

Step 2 - Password:
□ backend\.env opened
□ Password updated
□ File saved

Step 3 - Start:
□ Terminal opened in project folder
□ npm run dev executed
□ Backend started (port 5000)
□ Frontend started (port 3000)
□ Browser opened to localhost:3000

Testing:
□ Upload a document
□ Search for content
□ Filter by category
□ Preview document
□ Download document
```

## 🚀 After Testing

```
1. Deploy (30 min)
   → See DEPLOYMENT.md
   
2. Record Video (30 min)
   → See SUBMISSION_CHECKLIST.md
   
3. Submit (5 min)
   → GitHub URL
   → Deployed URL
   → Video URL
```

## 💡 Pro Tips

```
✓ Use pgAdmin - it's the easiest way
✓ Keep terminal open to see logs
✓ Test with different file types
✓ Try searching for various keywords
✓ Check all categories work
✓ Test on different browsers
```

## 🆘 Need Help?

```
Quick Issues:     → START_HERE.md
Database Issues:  → DATABASE_SETUP_INSTRUCTIONS.md
Any Problems:     → TROUBLESHOOTING.md
Deployment:       → DEPLOYMENT.md
Submission:       → SUBMISSION_CHECKLIST.md
```

## ✅ Success Indicators

```
✓ Terminal shows: "Server is running on port 5000"
✓ Terminal shows: "Local: http://localhost:3000"
✓ Browser loads the interface
✓ Can upload files
✓ Can search documents
✓ Can filter by categories
✓ Can preview documents
✓ Can download files
```

---

## 🎊 You're Almost There!

Just 3 simple steps and ~20 minutes away from a fully working application!

**Start with:** `START_HERE.md` for detailed instructions.

**Current Status:**
```
[✓✓✓✓] Code Complete
[✓✓✓✓] Dependencies Installed
[✓✓✓✓] Environment Ready
[░░░░] Database Setup ← YOU ARE HERE
[░░░░] Application Running
```

Good luck! 🚀
