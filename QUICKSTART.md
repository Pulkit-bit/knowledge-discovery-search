# Quick Start Guide

Get the Knowledge Discovery & Search application running in 5 minutes!

## Prerequisites

- Node.js (v18+)
- PostgreSQL (v14+)
- Git

## Step 1: Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd knowledge-discovery-search

# Run setup script (Windows)
setup.bat

# Or install manually
npm install
cd backend && npm install
cd ../frontend && npm install
```

## Step 2: Set Up Database

```bash
# Create database
psql -U postgres
CREATE DATABASE knowledge_search;
\q

# Initialize schema
psql -U postgres -d knowledge_search -f backend/database/init.sql
```

## Step 3: Configure Environment

Edit `backend/.env`:

```env
PORT=5000
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/knowledge_search
UPLOAD_DIR=uploads
MAX_FILE_SIZE=52428800
```

Replace `YOUR_PASSWORD` with your PostgreSQL password.

## Step 4: Start the Application

```bash
# From root directory
npm run dev
```

This starts both backend (port 5000) and frontend (port 3000).

## Step 5: Open in Browser

Navigate to: http://localhost:3000

## First Steps

1. **Upload Documents**: Click "Upload Documents" and add some files
2. **Search**: Type keywords in the search bar
3. **Filter**: Select categories from the left panel
4. **Preview**: Click any document to view details

## Troubleshooting

### Database Connection Error

```bash
# Check PostgreSQL is running
pg_isready

# Verify database exists
psql -U postgres -l | grep knowledge_search
```

### Port Already in Use

```bash
# Change ports in:
# - backend/.env (PORT=5001)
# - frontend/vite.config.ts (port: 3001)
```

### Module Not Found

```bash
# Reinstall dependencies
cd backend && rm -rf node_modules && npm install
cd ../frontend && rm -rf node_modules && npm install
```

## Sample Test Data

Upload these types of files to test:
- Marketing PDFs
- Campaign documents
- Product specifications
- Design mockups
- Research reports

## Next Steps

- Read [README.md](README.md) for detailed documentation
- Check [DEPLOYMENT.md](DEPLOYMENT.md) for deployment guide
- Customize categories in `backend/src/services/categorizer.ts`

## Demo Video Checklist

Before recording your demo:

- [ ] Upload 10-15 diverse documents
- [ ] Test search with various keywords
- [ ] Show category filtering
- [ ] Demonstrate document preview
- [ ] Show download functionality
- [ ] Explain automatic categorization
- [ ] Highlight responsive design

## Support

Having issues? Check:
1. All services are running (backend + frontend + PostgreSQL)
2. Environment variables are set correctly
3. Database is initialized
4. Ports are not in use by other applications

Good luck with your hackathon! 🚀
