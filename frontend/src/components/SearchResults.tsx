import React from 'react';
import { Document } from '../types';
import { DocumentCard } from './DocumentCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SearchResultsProps {
  documents: Document[];
  total: number;
  page: number;
  pageSize: number;
  loading: boolean;
  onDocumentClick: (document: Document) => void;
  onPageChange: (page: number) => void;
  onDocumentDelete: (id: string) => void;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  documents,
  total,
  page,
  pageSize,
  loading,
  onDocumentClick,
  onPageChange,
  onDocumentDelete,
}) => {
  const totalPages = Math.ceil(total / pageSize);

  if (loading) {
    return (
      <div className="flex-1">
        <div className="grid grid-cols-1 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-gray-200 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-2">No documents found</p>
          <p className="text-sm text-gray-500">Try adjusting your search or filters</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Found {total} document{total !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-6">
        {documents.map((document) => (
          <DocumentCard
            key={document.id}
            document={document}
            onClick={() => onDocumentClick(document)}
            onDelete={onDocumentDelete}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-auto">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    page === pageNum
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
            className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};
