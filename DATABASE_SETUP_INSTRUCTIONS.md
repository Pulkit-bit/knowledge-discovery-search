# Database Setup Instructions

## Quick Setup (Choose One Method)

### Method 1: Using pgAdmin (Easiest)

1. **Open pgAdmin** (should be installed with PostgreSQL)

2. **Connect to PostgreSQL Server**
   - Expand "Servers" in the left panel
   - Enter your password if prompted

3. **Create Database**
   - Right-click "Databases"
   - Select "Create" → "Database"
   - Name: `knowledge_search`
   - Click "Save"

4. **Run Initialization Script**
   - Right-click on `knowledge_search` database
   - Select "Query Tool"
   - Click "Open File" icon
   - Navigate to: `backend\database\init.sql`
   - Click "Execute" (F5 or play button)
   - You should see "Query returned successfully"

### Method 2: Using Command Line

If PostgreSQL is in your PATH:

```cmd
# Create database
psql -U postgres
CREATE DATABASE knowledge_search;
\q

# Initialize schema
psql -U postgres -d knowledge_search -f backend\database\init.sql
```

### Method 3: Using SQL Shell (psql)

1. Open "SQL Shell (psql)" from Start Menu
2. Press Enter for default values (Server, Database, Port, Username)
3. Enter your PostgreSQL password
4. Run these commands:

```sql
CREATE DATABASE knowledge_search;
\c knowledge_search
\i 'D:/downloads/RapidQuest-Hackathon/backend/database/init.sql'
\q
```

(Replace the path with your actual project path)

## Verify Setup

After setup, verify the database:

### Using pgAdmin:
1. Refresh the database list
2. Expand `knowledge_search` → "Schemas" → "public" → "Tables"
3. You should see: `documents`, `categories`, `document_categories`

### Using Command Line:
```cmd
psql -U postgres -d knowledge_search
\dt
SELECT * FROM categories;
\q
```

You should see 10 categories listed.

## Troubleshooting

### PostgreSQL Not Installed?

Download and install from: https://www.postgresql.org/download/windows/

During installation:
- Remember the password for `postgres` user
- Use default port: 5432
- Install pgAdmin (recommended)

### Can't Find pgAdmin?

Search for "pgAdmin" in Windows Start Menu, or:
- Usually located at: `C:\Program Files\PostgreSQL\14\pgAdmin 4\bin\pgAdmin4.exe`

### Connection Failed?

1. Check if PostgreSQL service is running:
   - Open Services (services.msc)
   - Find "postgresql-x64-14" (or your version)
   - Ensure it's "Running"
   - If not, right-click → Start

2. Check your password is correct

3. Verify port 5432 is not blocked

## Next Step

After database setup is complete, update `backend\.env` with your PostgreSQL password, then proceed to start the application.
