import apiClient from '../config/api.config';
import type {
  DocumentUploadResponse,
  DocumentsListResponse,
  DocumentResponse,
  ApiResponse,
} from '../types/document.types';

/**
 * Document API service
 * Handles all document-related API calls
 */
class DocumentAPI {
  /**
   * Upload a document (image or PDF)
   * @param file - File to upload
   * @param model - AI model to use for extraction ('gemini', 'openai', 'groq', 'claude', 'rexcan', 'best')
   * @param onUploadProgress - Optional progress callback
   */
  async uploadDocument(
    file: File,
    model: string = 'best',
    onUploadProgress?: (progress: number) => void
  ): Promise<DocumentUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('model', model);

    const response = await apiClient.post<DocumentUploadResponse>(
      '/documents/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total && onUploadProgress) {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onUploadProgress(progress);
          }
        },
        timeout: 120000, // 2 minutes timeout for large files
      }
    );
    return response.data;
  }

  /**
   * Get user's documents with pagination
   * @param limit - Number of documents per page
   * @param skip - Number of documents to skip
   */
  async getDocuments(limit = 50, skip = 0): Promise<DocumentsListResponse> {
    const response = await apiClient.get<DocumentsListResponse>('/documents', {
      params: { limit, skip },
    });
    return response.data;
  }

  /**
   * Get a single document by ID
   * @param documentId - Document ID
   */
  async getDocument(documentId: string): Promise<DocumentResponse> {
    const response = await apiClient.get<DocumentResponse>(
      `/documents/${documentId}`
    );
    return response.data;
  }

  /**
   * Update document extracted data
   * @param documentId - Document ID
   * @param extractedData - Partial extracted data to update
   * @param lineItems - Optional line items to update
   */
  async updateDocument(
    documentId: string,
    extractedData?: Partial<import('../types/document.types').ExtractedData>,
    lineItems?: import('../services/invoice.api').LineItem[]
  ): Promise<DocumentResponse> {
    const response = await apiClient.patch<DocumentResponse>(
      `/documents/${documentId}`,
      {
        extractedData,
        lineItems,
      }
    );
    return response.data;
  }
}

export const documentAPI = new DocumentAPI();

