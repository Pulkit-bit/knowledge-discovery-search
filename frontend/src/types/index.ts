export interface Document {
  id: string;
  filename: string;
  originalFilename: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  contentText?: string;
  categories: string[];
  uploadedAt: string;
  excerpt?: string;
  relevanceScore?: number;
}

export interface SearchResult {
  results: Document[];
  total: number;
  page: number;
  pageSize: number;
}

export interface FilterState {
  categories: string[];
  searchQuery: string;
}
