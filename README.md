# Knowledge Discovery & Internal Search

A powerful web application that helps marketing teams efficiently search, discover, and access their internal documents and digital assets. Built with React, Node.js, Express, and PostgreSQL.

## Features

- **Smart Document Upload**: Drag-and-drop or select multiple files (PDF, DOCX, TXT, MD, images)
- **Full-Text Search**: Fast and accurate search across document content and filenames
- **Automatic Categorization**: AI-powered categorization by topic, project, and team
- **Advanced Filtering**: Filter documents by categories
- **Document Preview**: Quick preview with metadata and content excerpts
- **Responsive Design**: Works seamlessly on desktop and tablet devices

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- TailwindCSS for styling
- Axios for API calls
- Lucide React for icons

### Backend
- Node.js with Express
- TypeScript
- PostgreSQL with full-text search
- Multer for file uploads
- pdf-parse and mammoth for text extraction

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd knowledge-discovery-search
```

### 2. Set Up PostgreSQL Database

First, create a PostgreSQL database:

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE knowledge_search;

# Exit psql
\q
```

Then, run the initialization script:

```bash
psql -U postgres -d knowledge_search -f backend/database/init.sql
```

### 3. Configure Backend Environment

Create a `.env` file in the `backend` directory:

```bash
cd backend
cp .env.example .env
```

Edit the `.env` file with your database credentials:

```env
PORT=5000
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/knowledge_search
UPLOAD_DIR=uploads
MAX_FILE_SIZE=52428800
```

### 4. Install Dependencies

Install backend dependencies:

```bash
cd backend
npm install
```

Install frontend dependencies:

```bash
cd ../frontend
npm install
```

### 5. Run the Application

#### Option 1: Run Both Services Together (from root directory)

```bash
npm install
npm run dev
```

#### Option 2: Run Services Separately

Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Usage

### Uploading Documents

1. Click the "Upload Documents" button in the header
2. Drag and drop files or click "Select Files"
3. Supported formats: PDF, DOCX, TXT, MD, JPG, PNG, GIF
4. Maximum file size: 50MB per file

### Searching Documents

1. Enter keywords in the search bar
2. Results appear automatically as you type
3. Click on any document card to view details

### Filtering Results

1. Use the filter panel on the left to select categories
2. Multiple categories can be selected
3. Click "Clear" to remove all filters

### Viewing Document Details

1. Click on any document in the search results
2. A preview panel slides in from the right
3. View metadata, categories, and content preview
4. Click "Download Document" to download the file

## API Endpoints

### Documents

- `POST /api/documents/upload` - Upload one or more documents
- `GET /api/documents/search` - Search documents with filters
- `GET /api/documents/:id` - Get document details
- `GET /api/documents/:id/download` - Download a document
- `DELETE /api/documents/:id` - Delete a document

### Categories

- `GET /api/categories` - Get all available categories

## Project Structure

```
knowledge-discovery-search/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts
│   │   ├── middleware/
│   │   │   └── upload.ts
│   │   ├── routes/
│   │   │   ├── documents.ts
│   │   │   └── categories.ts
│   │   ├── services/
│   │   │   ├── textExtractor.ts
│   │   │   └── categorizer.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── server.ts
│   ├── database/
│   │   └── init.sql
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── SearchBar.tsx
│   │   │   ├── FilterPanel.tsx
│   │   │   ├── SearchResults.tsx
│   │   │   ├── DocumentCard.tsx
│   │   │   ├── PreviewPanel.tsx
│   │   │   └── UploadZone.tsx
│   │   ├── api/
│   │   │   └── client.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## Key Features Explained

### Automatic Categorization

Documents are automatically categorized based on keyword matching in filenames and content:

- **Marketing**: brand, promotion, advertising
- **Sales**: revenue, deals, customers
- **Product**: features, roadmap, development
- **Design**: UI, UX, mockups
- **Strategy**: planning, goals, objectives
- **Campaign**: launches, initiatives
- **Research**: analysis, surveys, insights
- **Analytics**: metrics, KPIs, performance
- **Content**: blogs, articles, copy
- **Social Media**: social platforms, engagement

### Full-Text Search

The application uses PostgreSQL's full-text search capabilities:
- Searches across both filenames and document content
- Results ranked by relevance
- Fast performance with indexed search vectors

### Text Extraction

Supports multiple document formats:
- **PDF**: Extracted using pdf-parse
- **DOCX**: Extracted using mammoth
- **TXT/MD**: Direct file reading
- **Images**: Metadata only (content not extracted)

## Building for Production

### Backend

```bash
cd backend
npm run build
npm start
```

### Frontend

```bash
cd frontend
npm run build
```

The built files will be in `frontend/dist/`. Serve them using any static file server or integrate with your backend.

## Deployment

### Environment Variables for Production

Update your `.env` file with production values:

```env
PORT=5000
DATABASE_URL=postgresql://user:password@production-host:5432/knowledge_search
UPLOAD_DIR=/var/app/uploads
MAX_FILE_SIZE=52428800
NODE_ENV=production
```

### Recommended Deployment Platforms

- **Backend**: Heroku, Railway, Render, AWS EC2
- **Frontend**: Vercel, Netlify, AWS S3 + CloudFront
- **Database**: AWS RDS, Heroku Postgres, Supabase

## Troubleshooting

### Database Connection Issues

- Verify PostgreSQL is running: `pg_isready`
- Check connection string in `.env`
- Ensure database exists: `psql -l`

### File Upload Issues

- Check `UPLOAD_DIR` exists and has write permissions
- Verify `MAX_FILE_SIZE` is appropriate
- Check disk space availability

### Search Not Working

- Verify database initialization script ran successfully
- Check that `search_vector` column is populated
- Ensure PostgreSQL full-text search extension is enabled

## Contributing

This project was built for a hackathon challenge. Feel free to fork and improve!

## License

MIT License

## Author

Built with ❤️ for the AI-Powered Marketing Hackathon Challenge
