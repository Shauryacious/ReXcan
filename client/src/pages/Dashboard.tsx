import { useState } from 'react';

import DocumentDetailsModal from '@/components/DocumentDetailsModal';
import DocumentsList from '@/components/DocumentsList';
import FileUpload from '@/components/FileUpload';
import { documentAPI } from '@/services/document.api';
import type { Document } from '@/types/document.types';
import { MODEL_OPTIONS, type AIModel } from '@/types/model.types';

const Dashboard = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<AIModel>('best');

  const handleFileSelect = async (file: File) => {
    try {
      setIsUploading(true);
      setUploadError(null);
      setUploadSuccess(null);

      const response = await documentAPI.uploadDocument(file, selectedModel);

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
            <h2 className="text-2xl font-semibold text-rexcan-dark-blue-primary mb-6">
              Upload Document
            </h2>

            {/* Model Selection Card */}
            <div className="mb-6 p-5 bg-gradient-to-br from-rexcan-light-grey-secondary/50 to-white rounded-xl border border-rexcan-dark-blue-secondary/10 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-5 h-5 text-[#00FFD8]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                  <label
                    htmlFor="model-select"
                    className="text-base font-semibold text-rexcan-dark-blue-primary"
                  >
                    Select AI Model
                  </label>
                </div>
                {MODEL_OPTIONS.find((opt) => opt.value === selectedModel)?.recommended && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#00FFD8]/20 text-[#00FFD8] border border-[#00FFD8]/30">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Recommended
                  </span>
                )}
              </div>
              
              <div className="relative">
                <select
                  id="model-select"
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value as AIModel)}
                  className="w-full px-4 py-3 pr-10 border-2 border-rexcan-dark-blue-secondary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00FFD8] focus:border-[#00FFD8] bg-white text-rexcan-dark-blue-primary font-medium transition-all duration-200 hover:border-rexcan-dark-blue-secondary/40 appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isUploading}
                >
                  {MODEL_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-rexcan-dark-blue-secondary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

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
