# ✅ Pre-Flight Checklist - Before Running npm run dev

## What You've Done ✅

1. ✅ Created MySQL schema: `knowledge_search`
2. ✅ Updated password in `backend\.env`: `Pulkit@0410`

## Critical: Did You Run the SQL Script?

**IMPORTANT:** After creating the schema, you MUST execute the initialization script to create tables and add categories.

### Check if you did this:

**Option 1: Run verification script**
```cmd
verify-mysql-setup.bat
```

This will tell you if tables exist.

**Option 2: Check manually in MySQL Workbench**
1. Select `knowledge_search` schema
2. Look for "Tables" section
3. You should see:
   - `categories`
   - `document_categories`
   - `documents`

### If Tables Don't Exist - Run This Now:

**In MySQL Workbench:**
1. Click on `knowledge_search` schema (to select it)
2. Go to: File → Open SQL Script
3. Navigate to: `backend\database\init-mysql.sql`
4. Click "Execute" (⚡ lightning bolt icon)
5. You should see "3 rows affected" or similar success message

**Or Command Line:**
```cmd
mysql -u root -p knowledge_search < backend\database\init-mysql.sql
```

## Final Checklist Before npm run dev

- [ ] MySQL is running
- [ ] Schema `knowledge_search` exists
- [ ] Tables created (documents, categories, document_categories)
- [ ] 10 categories inserted
- [ ] Password updated in `backend\.env`
- [ ] `backend\uploads` folder exists

## Verify Everything is Ready

Run this to check:
```cmd
verify-mysql-setup.bat
```

You should see:
```
Tables in knowledge_search:
- categories
- document_categories  
- documents

category_count: 10
```

## If Everything Checks Out ✅

You're ready to start!

```cmd
npm run dev
```

Wait for:
- "Server is running on port 5000"
- "Local: http://localhost:3000"

Then open: http://localhost:3000

## Quick SQL Script Execution (if needed)

If you haven't run the init script yet, here's the quickest way:

**MySQL Workbench:**
1. Select `knowledge_search` database (click on it)
2. Click "Open SQL Script" icon (folder icon in toolbar)
3. Select: `D:\downloads\RapidQuest-Hackathon\backend\database\init-mysql.sql`
4. Click Execute (⚡ icon or Ctrl+Shift+Enter)
5. Check output - should say "3 rows affected" or similar

## What the Init Script Does

Creates 3 tables:
1. **documents** - stores uploaded files and content
2. **categories** - stores 10 predefined categories
3. **document_categories** - links documents to categories

Inserts 10 categories:
- Marketing
- Sales
- Product
- Design
- Strategy
- Campaign
- Research
- Analytics
- Content
- Social Media

## Common Issues

### "Table doesn't exist" error when starting
**Solution:** Run the init-mysql.sql script

### "Access denied" error
**Solution:** Check password in backend\.env matches your MySQL password

### "Can't connect to MySQL server"
**Solution:** Make sure MySQL is running (check Services)

## Ready to Start?

Once you've confirmed:
1. ✅ Tables exist
2. ✅ Categories inserted
3. ✅ Password correct

Run:
```cmd
npm run dev
```

## Next Steps After Starting

1. Open http://localhost:3000
2. Upload a test document
3. Search for keywords
4. Filter by categories
5. Preview and download

---

**Need Help?**
- Run `verify-mysql-setup.bat` to check setup
- See `MYSQL_SETUP.md` for detailed instructions
- See `TROUBLESHOOTING.md` for common issues
