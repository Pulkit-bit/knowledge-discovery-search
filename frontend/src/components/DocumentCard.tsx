import React from 'react';
import { FileText, File, Image, Trash2 } from 'lucide-react';
import { Document } from '../types';

interface DocumentCardProps {
  document: Document;
  onClick: () => void;
  onDelete: (id: string) => void;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({ document, onClick, onDelete }) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when deleting
    if (window.confirm(`Are you sure you want to delete "${document.originalFilename}"?`)) {
      onDelete(document.id);
    }
  };
  const getFileIcon = () => {
    if (document.mimeType.includes('pdf')) {
      return <FileText className="w-8 h-8 text-red-500" />;
    } else if (document.mimeType.includes('image')) {
      return <Image className="w-8 h-8 text-green-500" />;
    } else {
      return <File className="w-8 h-8 text-blue-500" />;
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer p-4 border border-gray-200 relative group"
    >
      {/* Delete button - shows on hover */}
      <button
        onClick={handleDelete}
        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
        title="Delete document"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">{getFileIcon()}</div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate mb-1">
            {document.originalFilename}
          </h3>
          
          {document.excerpt && (
            <p className="text-sm text-gray-600 line-clamp-2 mb-2">
              {document.excerpt}
            </p>
          )}
          
          <div className="flex flex-wrap gap-2 mb-2">
            {document.categories.map((category) => (
              <span
                key={category}
                className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded"
              >
                {category}
              </span>
            ))}
          </div>
          
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>{formatFileSize(document.fileSize)}</span>
            <span>•</span>
            <span>{formatDate(document.uploadedAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
