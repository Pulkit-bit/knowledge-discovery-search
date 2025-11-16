import React from 'react';
import { X, Download, FileText, File, Image, Trash2 } from 'lucide-react';
import { Document } from '../types';

interface PreviewPanelProps {
  document: Document | null;
  onClose: () => void;
  onDelete: (id: string) => void;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({ document, onClose, onDelete }) => {
  if (!document) return null;

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${document.originalFilename}"?`)) {
      onDelete(document.id);
      onClose();
    }
  };

  const getFileIcon = () => {
    if (document.mimeType.includes('pdf')) {
      return <FileText className="w-12 h-12 text-red-500" />;
    } else if (document.mimeType.includes('image')) {
      return <Image className="w-12 h-12 text-green-500" />;
    } else {
      return <File className="w-12 h-12 text-blue-500" />;
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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDownload = () => {
    window.open(`/api/documents/${document.id}/download`, '_blank');
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl z-50 transform transition-transform">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Document Preview</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0">{getFileIcon()}</div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 break-words">
                  {document.originalFilename}
                </h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {document.categories.map((category) => (
                    <span
                      key={category}
                      className="inline-block px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Metadata */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">Details</h4>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">File Size:</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {formatFileSize(document.fileSize)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">Uploaded:</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {formatDate(document.uploadedAt)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">Type:</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {document.mimeType.split('/')[1].toUpperCase()}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Content Preview */}
            {document.contentText && (
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Content Preview</h4>
                <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {document.contentText.substring(0, 1000)}
                    {document.contentText.length > 1000 && '...'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-6 space-y-3">
            <button
              onClick={handleDownload}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Download className="w-5 h-5" />
              Download Document
            </button>
            <button
              onClick={handleDelete}
              className="w-full flex items-center justify-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              <Trash2 className="w-5 h-5" />
              Delete Document
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
