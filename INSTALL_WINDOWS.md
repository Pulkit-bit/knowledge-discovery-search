# Windows Installation Guide

Step-by-step guide to set up the Knowledge Discovery & Internal Search application on Windows.

## Prerequisites Installation

### 1. Install Node.js

1. Download Node.js from https://nodejs.org/ (LTS version recommended)
2. Run the installer
3. Verify installation:
   ```cmd
   node --version
   npm --version
   ```

### 2. Install PostgreSQL

1. Download PostgreSQL from https://www.postgresql.org/download/windows/
2. Run the installer
3. During installation:
   - Remember the password you set for the `postgres` user
   - Default port: 5432
   - Install pgAdmin (optional but recommended)
4. Verify installation:
   ```cmd
   psql --version
   ```

### 3. Install Git (Optional)

1. Download Git from https://git-scm.com/download/win
2. Run the installer with default settings
3. Verify installation:
   ```cmd
   git --version
   ```

## Project Setup

### Step 1: Get the Code

If using Git:
```cmd
git clone <your-repo-url>
cd knowledge-discovery-search
```

Or download and extract the ZIP file.

### Step 2: Run Setup Script

```cmd
setup.bat
```

This will:
- Install root dependencies
- Install backend dependencies
- Install frontend dependencies
- Create `.env` file

### Step 3: Set Up PostgreSQL Database

#### Option A: Using Command Line

```cmd
# Open Command Prompt as Administrator

# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE knowledge_search;

# Exit psql
\q

# Initialize schema
psql -U postgres -d knowledge_search -f backend\database\init.sql
```

#### Option B: Using pgAdmin

1. Open pgAdmin
2. Connect to PostgreSQL server
3. Right-click "Databases" → "Create" → "Database"
4. Name: `knowledge_search`
5. Click "Save"
6. Right-click `knowledge_search` → "Query Tool"
7. Open `backend\database\init.sql`
8. Execute the script (F5)

### Step 4: Configure Environment

1. Open `backend\.env` in a text editor
2. Update the password:
   ```env
   DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/knowledge_search
   ```
3. Replace `YOUR_PASSWORD` with your PostgreSQL password
4. Save the file

### Step 5: Start the Application

#### Option A: Start Both Services Together

```cmd
npm run dev
```

This starts:
- Backend on http://localhost:5000
- Frontend on http://localhost:3000

#### Option B: Start Services Separately

Terminal 1 (Backend):
```cmd
cd backend
npm run dev
```

Terminal 2 (Frontend):
```cmd
cd frontend
npm run dev
```

### Step 6: Open in Browser

Navigate to: http://localhost:3000

## Verification

### Check Backend

Open http://localhost:5000/api/health

Should see:
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

### Check Frontend

Open http://localhost:3000

Should see the Knowledge Discovery interface.

### Check Database

```cmd
psql -U postgres -d knowledge_search

# List tables
\dt

# Check categories
SELECT * FROM categories;

# Exit
\q
```

## Common Windows-Specific Issues

### Issue: `psql` command not found

**Solution:**
Add PostgreSQL to PATH:
1. Search for "Environment Variables" in Windows
2. Edit "Path" in System Variables
3. Add: `C:\Program Files\PostgreSQL\14\bin`
4. Restart Command Prompt

### Issue: Port 5000 already in use

**Solution:**
```cmd
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F
```

Or change port in `backend\.env`:
```env
PORT=5001
```

### Issue: Permission denied on uploads folder

**Solution:**
1. Right-click `backend\uploads` folder
2. Properties → Security
3. Edit → Add → Everyone
4. Grant "Full control"
5. Apply

### Issue: npm install fails with EACCES

**Solution:**
Run Command Prompt as Administrator:
1. Search for "cmd"
2. Right-click → "Run as administrator"
3. Navigate to project directory
4. Run `npm install`

### Issue: PostgreSQL service not starting

**Solution:**
1. Open Services (services.msc)
2. Find "postgresql-x64-14" (or your version)
3. Right-click → Start
4. Set Startup type to "Automatic"

## Development Tools (Optional)

### VS Code

1. Download from https://code.visualstudio.com/
2. Install recommended extensions:
   - ESLint
   - Prettier
   - TypeScript and JavaScript Language Features
   - Tailwind CSS IntelliSense

### Postman

1. Download from https://www.postman.com/downloads/
2. Use to test API endpoints

### pgAdmin

Included with PostgreSQL installation.
Use for database management and queries.

## Building for Production

### Backend

```cmd
cd backend
npm run build
```

Output in `backend\dist\`

### Frontend

```cmd
cd frontend
npm run build
```

Output in `frontend\dist\`

## Running Production Build

### Backend

```cmd
cd backend
set NODE_ENV=production
npm start
```

### Frontend

Serve the `frontend\dist` folder using any static file server:

```cmd
# Using http-server (install first: npm install -g http-server)
cd frontend\dist
http-server -p 3000
```

## Stopping the Application

### If running with `npm run dev`

Press `Ctrl + C` in the terminal

### If running separately

Press `Ctrl + C` in each terminal window

### If process is stuck

```cmd
# Find Node processes
tasklist | findstr node

# Kill all Node processes
taskkill /IM node.exe /F
```

## Uninstallation

### Remove Application

1. Delete project folder
2. Delete database:
   ```cmd
   psql -U postgres
   DROP DATABASE knowledge_search;
   \q
   ```

### Remove Dependencies (Optional)

1. Uninstall Node.js from Control Panel
2. Uninstall PostgreSQL from Control Panel
3. Delete remaining folders:
   - `C:\Program Files\nodejs`
   - `C:\Program Files\PostgreSQL`
   - `%APPDATA%\npm`

## Backup and Restore

### Backup Database

```cmd
pg_dump -U postgres knowledge_search > backup.sql
```

### Restore Database

```cmd
psql -U postgres knowledge_search < backup.sql
```

### Backup Uploaded Files

Copy `backend\uploads` folder to backup location

## Performance Tips for Windows

1. **Exclude from Windows Defender:**
   - Add `node_modules` folders to exclusions
   - Add project directory to exclusions

2. **Use SSD:**
   - Install project on SSD for better performance

3. **Close Unnecessary Programs:**
   - Free up RAM and CPU

4. **Use Windows Terminal:**
   - Better than Command Prompt
   - Download from Microsoft Store

## Firewall Configuration

If you need to access from other devices:

1. Open Windows Firewall
2. Advanced Settings
3. Inbound Rules → New Rule
4. Port → TCP → 3000, 5000
5. Allow the connection
6. Apply to all profiles

## Next Steps

1. ✅ Application is running
2. 📝 Read README.md for features
3. 🧪 Test all functionality
4. 🚀 Deploy (see DEPLOYMENT.md)
5. 🎥 Record demo video
6. 📤 Submit to hackathon

## Quick Reference

### Start Application
```cmd
npm run dev
```

### Stop Application
```
Ctrl + C
```

### Restart PostgreSQL
```cmd
net stop postgresql-x64-14
net start postgresql-x64-14
```

### View Logs
- Backend: Terminal output
- Frontend: Browser console (F12)
- Database: `C:\Program Files\PostgreSQL\14\data\log`

### Reset Everything
```cmd
# Stop services
Ctrl + C

# Delete node_modules
rmdir /s /q node_modules
rmdir /s /q backend\node_modules
rmdir /s /q frontend\node_modules

# Reinstall
npm install
cd backend && npm install
cd ..\frontend && npm install
cd ..

# Reset database
psql -U postgres
DROP DATABASE knowledge_search;
CREATE DATABASE knowledge_search;
\q
psql -U postgres -d knowledge_search -f backend\database\init.sql

# Restart
npm run dev
```

## Support

Having issues? Check:
1. TROUBLESHOOTING.md
2. README.md
3. QUICKSTART.md

## Success Checklist

- [ ] Node.js installed
- [ ] PostgreSQL installed
- [ ] Database created
- [ ] Dependencies installed
- [ ] Environment configured
- [ ] Backend running (port 5000)
- [ ] Frontend running (port 3000)
- [ ] Can upload files
- [ ] Can search documents
- [ ] Can filter by categories
- [ ] Can preview documents
- [ ] Can download files

If all checked, you're ready to go! 🎉

---

**Windows Version Tested:** Windows 10/11
**Node.js Version:** 18+
**PostgreSQL Version:** 14+
