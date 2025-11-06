// Document type
export type DocumentType = 'pdf' | 'image';

export type DocumentStatus = 'uploaded' | 'queued' | 'processing' | 'processed' | 'failed';

export interface ExtractedData {
  invoiceNumber?: string;
  vendorName?: string;
  invoiceDate?: string;
  dueDate?: string;
  totalAmount?: number;
  currency?: string;
  lineItems?: Array<{
    description?: string;
    quantity?: number;
    unitPrice?: number;
    amount?: number;
  }>;
  taxInformation?: {
    taxRate?: number;
    taxAmount?: number;
  };
  paymentTerms?: string;
  rawExtraction?: Record<string, unknown>;
}

export interface Document {
  id: string;
  userId: string;
  fileName: string;
  originalFileName: string;
  filePath: string;
  fileType: DocumentType;
  mimeType: string;
  fileSize: number;
  status: DocumentStatus;
  queueJobId?: string;
  metadata?: {
    pageCount?: number;
    dimensions?: {
      width?: number;
      height?: number;
    };
  };
  extractedData?: ExtractedData;
  errorMessage?: string;
  processedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Document upload response
export interface DocumentUploadResponse {
  success: boolean;
  message: string;
  data: {
    document: {
      id: string;
      fileName: string;
      originalFileName: string;
      fileType: DocumentType;
      fileSize: number;
      status: DocumentStatus;
      queueJobId: string;
      createdAt: string;
    };
  };
}

// Documents list response
export interface DocumentsListResponse {
  success: boolean;
  message: string;
  data: {
    documents: Document[];
    pagination: {
      total: number;
      limit: number;
      skip: number;
      hasMore: boolean;
    };
  };
}

// Single document response
export interface DocumentResponse {
  success: boolean;
  message: string;
  data: {
    document: Document;
  };
}

// API response wrapper (re-exported from auth.types for consistency)
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

