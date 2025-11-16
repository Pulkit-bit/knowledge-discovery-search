# Project Structure

```
knowledge-discovery-search/
│
├── backend/                          # Backend API (Node.js + Express)
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts          # PostgreSQL connection pool
│   │   │
│   │   ├── middleware/
│   │   │   └── upload.ts            # Multer file upload configuration
│   │   │
│   │   ├── routes/
│   │   │   ├── documents.ts         # Document CRUD and search endpoints
│   │   │   └── categories.ts        # Category endpoints
│   │   │
│   │   ├── services/
│   │   │   ├── textExtractor.ts     # Extract text from PDF, DOCX, TXT
│   │   │   └── categorizer.ts       # Automatic document categorization
│   │   │
│   │   ├── types/
│   │   │   └── index.ts             # TypeScript type definitions
│   │   │
│   │   └── server.ts                # Express app entry point
│   │
│   ├── database/
│   │   └── init.sql                 # Database schema and seed data
│   │
│   ├── uploads/                     # Uploaded files storage (gitignored)
│   │
│   ├── package.json                 # Backend dependencies
│   ├── tsconfig.json                # TypeScript configuration
│   ├── .env                         # Environment variables (gitignored)
│   └── .env.example                 # Environment template
│
├── frontend/                         # Frontend UI (React + Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── SearchBar.tsx        # Search input with debouncing
│   │   │   ├── FilterPanel.tsx      # Category filter sidebar
│   │   │   ├── SearchResults.tsx    # Results list with pagination
│   │   │   ├── DocumentCard.tsx     # Individual document card
│   │   │   ├── PreviewPanel.tsx     # Document preview slide-out
│   │   │   └── UploadZone.tsx       # Drag-and-drop file upload
│   │   │
│   │   ├── api/
│   │   │   └── client.ts            # Axios API client
│   │   │
│   │   ├── types/
│   │   │   └── index.ts             # TypeScript type definitions
│   │   │
│   │   ├── App.tsx                  # Main application component
│   │   ├── main.tsx                 # React entry point
│   │   └── index.css                # Global styles (Tailwind)
│   │
│   ├── public/                      # Static assets
│   │
│   ├── package.json                 # Frontend dependencies
│   ├── tsconfig.json                # TypeScript configuration
│   ├── vite.config.ts               # Vite build configuration
│   ├── tailwind.config.js           # Tailwind CSS configuration
│   ├── postcss.config.js            # PostCSS configuration
│   └── index.html                   # HTML entry point
│
├── .kiro/                           # Kiro spec files
│   └── specs/
│       └── knowledge-discovery-search/
│           ├── requirements.md      # Feature requirements
│           ├── design.md            # Technical design
│           └── tasks.md             # Implementation tasks
│
├── package.json                     # Root package (runs both services)
├── .gitignore                       # Git ignore rules
│
├── README.md                        # Main documentation
├── QUICKSTART.md                    # Quick setup guide
├── DEPLOYMENT.md                    # Deployment instructions
├── HACKATHON_SUBMISSION.md          # Hackathon submission details
├── PROJECT_STRUCTURE.md             # This file
│
└── setup.bat                        # Windows setup script

```

## Key Directories Explained

### `/backend/src/`
Contains all backend application code:
- **config/**: Database and other configurations
- **middleware/**: Express middleware (file upload, etc.)
- **routes/**: API endpoint handlers
- **services/**: Business logic (text extraction, categorization)
- **types/**: Shared TypeScript types

### `/frontend/src/`
Contains all frontend application code:
- **components/**: React UI components
- **api/**: API client and HTTP utilities
- **types/**: Shared TypeScript types

### `/backend/database/`
Database-related files:
- **init.sql**: Creates tables, indexes, and seed data

### `/backend/uploads/`
File storage directory (created automatically):
```
uploads/
└── 2025/
    └── 11/
        └── 15/
            ├── uuid1.pdf
            ├── uuid2.docx
            └── uuid3.txt
```

## File Naming Conventions

- **Components**: PascalCase (e.g., `SearchBar.tsx`)
- **Services**: camelCase (e.g., `textExtractor.ts`)
- **Routes**: camelCase (e.g., `documents.ts`)
- **Types**: camelCase (e.g., `index.ts`)
- **Config**: camelCase (e.g., `database.ts`)

## Technology Stack by Directory

### Backend (`/backend/`)
- Node.js + Express
- TypeScript
- PostgreSQL (pg)
- Multer (file uploads)
- pdf-parse (PDF extraction)
- mammoth (DOCX extraction)

### Frontend (`/frontend/`)
- React 18
- TypeScript
- Vite
- TailwindCSS
- Axios
- Lucide React (icons)

## Build Outputs

### Backend
```
backend/
└── dist/              # Compiled JavaScript (gitignored)
    ├── config/
    ├── middleware/
    ├── routes/
    ├── services/
    ├── types/
    └── server.js
```

### Frontend
```
frontend/
└── dist/              # Production build (gitignored)
    ├── assets/
    │   ├── index-[hash].js
    │   └── index-[hash].css
    └── index.html
```

## Environment Files

### Backend `.env`
```
PORT=5000
DATABASE_URL=postgresql://...
UPLOAD_DIR=uploads
MAX_FILE_SIZE=52428800
```

### Frontend (Vite)
Environment variables prefixed with `VITE_`:
```
VITE_API_URL=http://localhost:5000/api
```

## Database Schema

### Tables
1. **documents**: Stores document metadata and content
2. **categories**: Predefined category list
3. **document_categories**: Many-to-many relationship

### Indexes
- GIN index on `search_vector` for full-text search
- B-tree index on `uploaded_at` for sorting

## API Endpoints

### Documents
- `POST /api/documents/upload`
- `GET /api/documents/search`
- `GET /api/documents/:id`
- `GET /api/documents/:id/download`
- `DELETE /api/documents/:id`

### Categories
- `GET /api/categories`

## Development Workflow

1. **Start Development**:
   ```bash
   npm run dev  # Runs both backend and frontend
   ```

2. **Backend Only**:
   ```bash
   cd backend && npm run dev
   ```

3. **Frontend Only**:
   ```bash
   cd frontend && npm run dev
   ```

4. **Build for Production**:
   ```bash
   npm run build  # Builds both
   ```

## Port Configuration

- **Backend**: 5000 (configurable in `.env`)
- **Frontend**: 3000 (configurable in `vite.config.ts`)
- **Database**: 5432 (PostgreSQL default)

## Important Files

### Configuration
- `backend/tsconfig.json` - Backend TypeScript config
- `frontend/tsconfig.json` - Frontend TypeScript config
- `frontend/vite.config.ts` - Vite build config
- `frontend/tailwind.config.js` - Tailwind CSS config

### Documentation
- `README.md` - Main documentation
- `QUICKSTART.md` - Quick setup guide
- `DEPLOYMENT.md` - Deployment guide
- `HACKATHON_SUBMISSION.md` - Submission details

### Scripts
- `setup.bat` - Windows setup automation
- `package.json` - Root scripts for running both services

## Git Ignored Files

- `node_modules/` - Dependencies
- `dist/` - Build outputs
- `.env` - Environment variables
- `uploads/` - Uploaded files
- `*.log` - Log files

## Adding New Features

### New API Endpoint
1. Add route in `backend/src/routes/`
2. Add service logic in `backend/src/services/`
3. Update types in `backend/src/types/`

### New UI Component
1. Create component in `frontend/src/components/`
2. Import and use in `App.tsx`
3. Update types in `frontend/src/types/`

### New Database Table
1. Add CREATE TABLE in `backend/database/init.sql`
2. Update types in `backend/src/types/`
3. Add queries in relevant routes

## Testing Locations

### Backend Tests (future)
```
backend/
└── tests/
    ├── routes/
    ├── services/
    └── integration/
```

### Frontend Tests (future)
```
frontend/
└── tests/
    ├── components/
    └── integration/
```
