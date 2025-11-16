# Design Document

## Overview

The Knowledge Discovery & Internal Search system is a full-stack web application that enables marketing teams to upload, index, search, and discover internal documents. The system uses a modern tech stack with React frontend, Node.js/Express backend, and PostgreSQL with full-text search capabilities.

## Architecture

### High-Level Architecture

```
┌─────────────────┐
│  React Frontend │
│   (Vite + TS)   │
└────────┬────────┘
         │ REST API
         │
┌────────▼────────┐      ┌──────────────┐
│  Express API    │◄────►│ PostgreSQL   │
│   (Node.js)     │      │ (Full-text)  │
└────────┬────────┘      └──────────────┘
         │
         │
┌────────▼────────┐
│  File Storage   │
│  (Local/Disk)   │
└─────────────────┘
```

### Technology Stack

**Frontend:**
- React 18 with TypeScript
- Vite for build tooling
- TailwindCSS for styling
- React Query for data fetching
- Axios for API calls

**Backend:**
- Node.js with Express
- TypeScript
- Multer for file uploads
- pdf-parse for PDF text extraction
- mammoth for DOCX text extraction
- PostgreSQL with pg library

**Database:**
- PostgreSQL 14+ with full-text search (tsvector)

## Components and Interfaces

### Frontend Components

1. **App Component**
   - Root component with routing
   - Global state management

2. **SearchBar Component**
   - Input field for search queries
   - Real-time search suggestions
   - Props: `onSearch(query: string)`

3. **FilterPanel Component**
   - Category filters (checkboxes)
   - File type filters
   - Date range filters
   - Props: `categories: string[]`, `onFilterChange(filters: FilterState)`

4. **SearchResults Component**
   - Grid/list of document cards
   - Pagination controls
   - Props: `documents: Document[]`, `onDocumentClick(id: string)`

5. **DocumentCard Component**
   - Document thumbnail/icon
   - Title, excerpt, categories
   - Metadata (date, size)
   - Props: `document: Document`

6. **PreviewPanel Component**
   - Slide-out panel with document details
   - Text preview or thumbnail
   - Download/open actions
   - Props: `document: Document`, `onClose()`

7. **UploadZone Component**
   - Drag-and-drop file upload
   - File selection button
   - Upload progress indicator
   - Props: `onUpload(files: File[])`

### Backend API Endpoints

```
POST   /api/documents/upload          - Upload documents
GET    /api/documents/search          - Search documents
GET    /api/documents/:id             - Get document details
GET    /api/documents/:id/download    - Download document
GET    /api/categories                - Get all categories
DELETE /api/documents/:id             - Delete document
```

### API Request/Response Formats

**Upload Document:**
```typescript
// Request: multipart/form-data with files

// Response:
{
  success: true,
  documents: [
    {
      id: "uuid",
      filename: "marketing-plan.pdf",
      size: 1024000,
      uploadedAt: "2025-11-15T10:00:00Z",
      categories: ["Marketing", "Strategy"]
    }
  ]
}
```

**Search Documents:**
```typescript
// Request: GET /api/documents/search?q=campaign&category=Marketing

// Response:
{
  results: [
    {
      id: "uuid",
      filename: "campaign-brief.pdf",
      excerpt: "...campaign strategy for Q4...",
      categories: ["Marketing", "Campaign"],
      uploadedAt: "2025-11-15T10:00:00Z",
      size: 512000,
      relevanceScore: 0.95
    }
  ],
  total: 15,
  page: 1,
  pageSize: 20
}
```

## Data Models

### Database Schema

**documents table:**
```sql
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename VARCHAR(255) NOT NULL,
  original_filename VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  content_text TEXT,
  search_vector tsvector,
  uploaded_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_documents_search ON documents USING GIN(search_vector);
```

**categories table:**
```sql
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**document_categories table:**
```sql
CREATE TABLE document_categories (
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (document_id, category_id)
);
```

### TypeScript Interfaces

```typescript
interface Document {
  id: string;
  filename: string;
  originalFilename: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  contentText?: string;
  categories: string[];
  uploadedAt: Date;
  excerpt?: string;
  relevanceScore?: number;
}

interface SearchQuery {
  q: string;
  categories?: string[];
  fileTypes?: string[];
  page?: number;
  pageSize?: number;
}

interface SearchResult {
  results: Document[];
  total: number;
  page: number;
  pageSize: number;
}

interface FilterState {
  categories: string[];
  fileTypes: string[];
  dateRange?: { start: Date; end: Date };
}
```

## Error Handling

### Frontend Error Handling
- Display toast notifications for API errors
- Show inline validation errors for forms
- Graceful degradation for failed previews
- Retry logic for failed uploads

### Backend Error Handling
- Structured error responses with status codes
- Input validation using express-validator
- File upload size limits (50MB per file)
- Proper error logging
- Database transaction rollbacks on failures

### Error Response Format
```typescript
{
  success: false,
  error: {
    code: "UPLOAD_FAILED",
    message: "Failed to process document",
    details: "Unsupported file format"
  }
}
```

## Testing Strategy

### Unit Tests
- Text extraction functions
- Category classification logic
- Search query parsing
- API route handlers

### Integration Tests
- File upload flow
- Search functionality
- Database queries
- API endpoint responses

### Manual Testing
- Upload various file types
- Search with different queries
- Filter combinations
- Preview functionality
- Responsive design on different screens

## Implementation Notes

### Text Extraction Strategy
- PDF: Use pdf-parse library
- DOCX: Use mammoth library
- TXT/MD: Direct file read
- Images: Store metadata only (optional OCR future enhancement)

### Category Classification
- Simple keyword-based classification initially
- Predefined categories: Marketing, Sales, Product, Design, Strategy, Campaign, Research, Analytics
- Match keywords in filename and content
- Assign multiple categories if multiple matches

### Search Implementation
- PostgreSQL full-text search with tsvector
- Search across filename + content
- Rank by ts_rank for relevance
- Support phrase queries and AND/OR operators

### File Storage
- Store files in `uploads/` directory
- Use UUID for filenames to avoid conflicts
- Organize by upload date: `uploads/2025/11/15/uuid.pdf`

### Performance Considerations
- Index search_vector column for fast queries
- Paginate search results (20 per page)
- Lazy load document previews
- Cache category list
- Limit file upload size to 50MB
