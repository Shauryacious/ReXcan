import { useState, useEffect } from 'react';
import type { Document } from '../types/document.types';
import { documentAPI } from '../services/document.api';

interface DocumentsListProps {
  refreshTrigger?: number;
  onDocumentSelect?: (document: Document) => void;
}

const DocumentsList = ({ refreshTrigger, onDocumentSelect }: DocumentsListProps) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 50,
    skip: 0,
    hasMore: false,
  });

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await documentAPI.getDocuments(pagination.limit, pagination.skip);
      
      if (response.success && response.data) {
        setDocuments(response.data.documents);
        setPagination(response.data.pagination);
      } else {
        setError(response.message || 'Failed to fetch documents');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch documents';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchDocuments();
  }, [refreshTrigger]);

  const getStatusColor = (status: Document['status']) => {
    switch (status) {
      case 'processed':
        return 'bg-green-500/20 text-green-600 border-green-500/30';
      case 'processing':
        return 'bg-blue-500/20 text-blue-600 border-blue-500/30';
      case 'queued':
        return 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30';
      case 'failed':
        return 'bg-red-500/20 text-red-600 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-600 border-gray-500/30';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getFileIcon = (fileType: Document['fileType']) => {
    if (fileType === 'pdf') {
      return (
        <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4 18h12V6h-4V2H4v16zm-2 1V0h12l4 4v16H2v-1z" />
        </svg>
      );
    }
    return (
      <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    );
  };

  if (loading && documents.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00FFD8]"></div>
      </div>
    );
  }

  if (error && documents.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => void fetchDocuments()}
          className="px-4 py-2 bg-rexcan-dark-blue-primary text-white rounded-lg hover:bg-rexcan-dark-blue-secondary transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-rexcan-dark-blue-secondary mb-2">No documents uploaded yet</p>
        <p className="text-sm text-rexcan-dark-blue-secondary/70">
          Upload your first document to get started
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-rexcan-dark-blue-primary">
          Your Documents ({pagination.total})
        </h3>
        <button
          onClick={() => void fetchDocuments()}
          className="text-sm text-[#00FFD8] hover:text-[#39FF14] transition-colors"
        >
          Refresh
        </button>
      </div>

      <div className="grid gap-4">
        {documents.map((document, index) => (
          <div
            key={document.id || `doc-${index}`}
            onClick={() => onDocumentSelect?.(document)}
            className={`
              bg-white rounded-lg border border-rexcan-dark-blue-secondary/20 p-4
              hover:border-[#00FFD8]/50 hover:shadow-lg transition-all duration-200
              ${onDocumentSelect ? 'cursor-pointer' : ''}
            `}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1 min-w-0">
                <div className="flex-shrink-0 mt-1">
                  {getFileIcon(document.fileType)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-rexcan-dark-blue-primary truncate">
                    {document.originalFileName}
                  </h4>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-rexcan-dark-blue-secondary">
                    <span>{formatFileSize(document.fileSize)}</span>
                    <span>•</span>
                    <span className="uppercase">{document.fileType}</span>
                    <span>•</span>
                    <span>{formatDate(document.createdAt)}</span>
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0 ml-4">
                <span
                  className={`
                    inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border
                    ${getStatusColor(document.status)}
                  `}
                >
                  {document.status}
                </span>
              </div>
            </div>
            {document.errorMessage && (
              <div className="mt-3 pt-3 border-t border-red-200">
                <p className="text-sm text-red-600">{document.errorMessage}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {pagination.hasMore && (
        <div className="text-center pt-4">
          <button
            onClick={() => {
              setPagination((prev) => ({ ...prev, skip: prev.skip + prev.limit }));
              void fetchDocuments();
            }}
            className="px-6 py-2 bg-rexcan-dark-blue-primary text-white rounded-lg hover:bg-rexcan-dark-blue-secondary transition-colors"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default DocumentsList;

