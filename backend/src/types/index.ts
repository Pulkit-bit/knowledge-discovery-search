export interface Document {
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

export interface SearchQuery {
  q: string;
  categories?: string[];
  fileTypes?: string[];
  page?: number;
  pageSize?: number;
}

export interface SearchResult {
  results: Document[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: string;
  };
}
