import { useState } from 'react';

import DocumentDetailsModal from '@/components/DocumentDetailsModal';
import DocumentsList from '@/components/DocumentsList';
import FileUpload from '@/components/FileUpload';
import { documentAPI } from '@/services/document.api';
import type { Document } from '@/types/document.types';

const Dashboard = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFileSelect = async (file: File) => {
    try {
      setIsUploading(true);
      setUploadError(null);
      setUploadSuccess(null);

      const response = await documentAPI.uploadDocument(file);

      if (response.success) {
        setUploadSuccess(`File "${file.name}" uploaded successfully!`);
        // Refresh documents list
        setRefreshTrigger((prev) => prev + 1);
        // Clear success message after 5 seconds
        setTimeout(() => setUploadSuccess(null), 5000);
      } else {
        throw new Error(response.message || 'Upload failed');
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'An error occurred while uploading the file';
      setUploadError(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDocumentSelect = async (document: Document) => {
    // Fetch full document details including extracted data
    try {
      const response = await documentAPI.getDocument(document.id);
      if (response.success && response.data) {
        setSelectedDocument(response.data.document);
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error('Error fetching document details:', error);
      // Fallback to using the document from the list
      setSelectedDocument(document);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDocument(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rexcan-light-grey-secondary to-white">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold bg-text-gradient bg-clip-text text-transparent mb-2">
              Document Upload
            </h1>
            <p className="text-rexcan-dark-blue-secondary text-lg">
              Upload invoices, receipts, and documents for processing
            </p>
          </div>

          {/* Upload Section */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold text-rexcan-dark-blue-primary mb-4">
              Upload Document
            </h2>

            {/* Success Message */}
            {uploadSuccess && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {uploadSuccess}
                </p>
              </div>
            )}

            {/* Error Message */}
            {uploadError && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {uploadError}
                </p>
              </div>
            )}

            <FileUpload
              onFileSelect={handleFileSelect}
              disabled={isUploading}
              maxSizeMB={50}
              acceptedTypes={['.pdf', '.jpg', '.jpeg', '.png', '.gif', '.webp']}
            />
          </div>

          {/* Documents List Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <DocumentsList
              refreshTrigger={refreshTrigger}
              onDocumentSelect={handleDocumentSelect}
            />
          </div>
        </div>
      </div>

      {/* Document Details Modal */}
      <DocumentDetailsModal
        document={selectedDocument}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Dashboard;
