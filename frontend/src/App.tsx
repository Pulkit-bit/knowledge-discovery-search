import React, { useState, useEffect, useCallback } from 'react';
import { SearchBar } from './components/SearchBar';
import { FilterPanel } from './components/FilterPanel';
import { SearchResults } from './components/SearchResults';
import { PreviewPanel } from './components/PreviewPanel';
import { UploadZone } from './components/UploadZone';
import { Document, SearchResult } from './types';
import apiClient from './api/client';
import { FileSearch } from 'lucide-react';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult>({
    results: [],
    total: 0,
    page: 1,
    pageSize: 20,
  });
  const [loading, setLoading] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [showUpload, setShowUpload] = useState(false);

  const fetchDocuments = useCallback(async (page: number = 1) => {
    setLoading(true);
    try {
      const params: any = {
        page,
        pageSize: 20,
      };

      if (searchQuery) {
        params.q = searchQuery;
      }

      if (selectedCategories.length > 0) {
        params.categories = selectedCategories;
      }

      const response = await apiClient.get('/documents/search', { params });

      if (response.data.success) {
        setSearchResults(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch documents:', error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCategories]);

  useEffect(() => {
    fetchDocuments(1);
  }, [fetchDocuments]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCategoryChange = (categories: string[]) => {
    setSelectedCategories(categories);
  };

  const handleDocumentClick = async (document: Document) => {
    try {
      const response = await apiClient.get(`/documents/${document.id}`);
      if (response.data.success) {
        setSelectedDocument(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch document details:', error);
      setSelectedDocument(document);
    }
  };

  const handlePageChange = (page: number) => {
    fetchDocuments(page);
  };

  const handleUploadComplete = () => {
    setShowUpload(false);
    fetchDocuments(1);
  };

  const handleDocumentDelete = async (id: string) => {
    try {
      const response = await apiClient.delete(`/documents/${id}`);
      if (response.data.success) {
        // Refresh the document list
        fetchDocuments(searchResults.page);
        // Close preview if the deleted document was open
        if (selectedDocument?.id === id) {
          setSelectedDocument(null);
        }
      }
    } catch (error) {
      console.error('Failed to delete document:', error);
      alert('Failed to delete document. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <FileSearch className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">
                Knowledge Discovery
              </h1>
            </div>
            <button
              onClick={() => setShowUpload(!showUpload)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              {showUpload ? 'Hide Upload' : 'Upload Documents'}
            </button>
          </div>

          {showUpload && (
            <div className="mb-6">
              <UploadZone onUploadComplete={handleUploadComplete} />
            </div>
          )}

          <SearchBar onSearch={handleSearch} initialValue={searchQuery} />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <aside className="flex-shrink-0">
            <FilterPanel
              selectedCategories={selectedCategories}
              onCategoryChange={handleCategoryChange}
            />
          </aside>

          {/* Search Results */}
          <SearchResults
            documents={searchResults.results}
            total={searchResults.total}
            page={searchResults.page}
            pageSize={searchResults.pageSize}
            loading={loading}
            onDocumentClick={handleDocumentClick}
            onPageChange={handlePageChange}
            onDocumentDelete={handleDocumentDelete}
          />
        </div>
      </main>

      {/* Preview Panel */}
      <PreviewPanel
        document={selectedDocument}
        onClose={() => setSelectedDocument(null)}
        onDelete={handleDocumentDelete}
      />
    </div>
  );
}

export default App;
