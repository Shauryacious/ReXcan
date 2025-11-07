import { Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { createDocument, getUserDocuments, getDocumentById, updateDocumentExtractedData } from '../services/document.service.js';
import { DocumentType } from '../models/Document.model.js';
import { ApiResponseHelper } from '../utils/apiResponse.js';
import { logger } from '../utils/logger.js';
import { AuthRequest } from '../types/auth.types.js';
import path from 'path';
import { randomUUID } from 'crypto';

// Upload document (image or PDF)
export const uploadDocument = asyncHandler(
  async (req: AuthRequest, res: Response): Promise<Response> => {
    if (!req.file) {
      return ApiResponseHelper.badRequest(res, 'No file uploaded');
    }

    if (!req.user) {
      return ApiResponseHelper.unauthorized(res, 'User not authenticated');
    }

    const userId = (req.user as { _id: { toString: () => string } })._id.toString();
    const file = req.file;

    // Get selected model from request body or query, default to 'best'
    const selectedModel = (req.body.model || req.query.model || 'best') as string;

    // Validate model
    const validModels = ['gemini', 'openai', 'groq', 'claude', 'rexcan', 'best'];
    const model = validModels.includes(selectedModel) ? selectedModel : 'best';

    // Determine file type
    const fileExtension = path.extname(file.originalname).toLowerCase();
    const fileType =
      fileExtension === '.pdf' ? DocumentType.PDF : DocumentType.IMAGE;

    // Create document record and add to queue
    const { document, jobId } = await createDocument({
      userId,
      fileName: file.filename,
      originalFileName: file.originalname,
      filePath: file.path,
      fileType,
      mimeType: file.mimetype,
      fileSize: file.size,
      selectedModel: model,
    });

    logger.info(`Document uploaded: ${document._id} by user: ${userId}`);

    return ApiResponseHelper.created(
      res,
      {
        document: {
          id: document._id,
          fileName: document.fileName,
          originalFileName: document.originalFileName,
          fileType: document.fileType,
          fileSize: document.fileSize,
          status: document.status,
          queueJobId: jobId,
          createdAt: document.createdAt,
        },
      },
      'Document uploaded successfully'
    );
  }
);

// Get user's documents
export const getDocuments = asyncHandler(
  async (req: AuthRequest, res: Response): Promise<Response> => {
    if (!req.user) {
      return ApiResponseHelper.unauthorized(res, 'User not authenticated');
    }

    const userId = (req.user as { _id: { toString: () => string } })._id.toString();
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = parseInt(req.query.skip as string) || 0;

    const { documents, total } = await getUserDocuments(userId, limit, skip);

    return ApiResponseHelper.success(
      res,
      {
        documents,
        pagination: {
          total,
          limit,
          skip,
          hasMore: skip + limit < total,
        },
      },
      'Documents fetched successfully'
    );
  }
);

// Get single document by ID
export const getDocument = asyncHandler(
  async (req: AuthRequest, res: Response): Promise<Response> => {
    if (!req.user) {
      return ApiResponseHelper.unauthorized(res, 'User not authenticated');
    }

    const userId = (req.user as { _id: { toString: () => string } })._id.toString();
    const { id } = req.params;

    const document = await getDocumentById(id, userId);

    if (!document) {
      return ApiResponseHelper.notFound(res, 'Document not found');
    }

    return ApiResponseHelper.success(
      res,
      { document },
      'Document fetched successfully'
    );
  }
);

// Update document extracted data
export const updateDocument = asyncHandler(
  async (req: AuthRequest, res: Response): Promise<Response> => {
    if (!req.user) {
      return ApiResponseHelper.unauthorized(res, 'User not authenticated');
    }

    const userId = (req.user as { _id: { toString: () => string } })._id.toString();
    const { id } = req.params;
    const { extractedData, lineItems } = req.body;

    // Get document to verify ownership
    const document = await getDocumentById(id, userId);
    if (!document) {
      return ApiResponseHelper.notFound(res, 'Document not found');
    }

    // Prepare updated extracted data
    const currentExtractedData = document.extractedData || {};
    let updatedExtractedData = { ...currentExtractedData };

    // If lineItems are provided, update them
    if (lineItems && Array.isArray(lineItems)) {
      // Convert LineItem format to internal format
      updatedExtractedData.lineItems = lineItems.map((item: any) => ({
        description: item.description || '',
        quantity: item.quantity ?? undefined,
        unitPrice: item.unit_price ?? undefined,
        amount: item.total ?? undefined,
      }));
    }

    // If other extracted data fields are provided, merge them
    if (extractedData && typeof extractedData === 'object') {
      updatedExtractedData = {
        ...updatedExtractedData,
        ...extractedData,
        // Preserve lineItems if not being updated separately
        lineItems: extractedData.lineItems 
          ? extractedData.lineItems.map((item: any) => ({
              description: item.description || '',
              quantity: item.quantity ?? undefined,
              unitPrice: item.unitPrice ?? item.unit_price ?? undefined,
              amount: item.amount ?? item.total ?? undefined,
            }))
          : updatedExtractedData.lineItems,
      };
    }

    // Update document
    const updatedDocument = await updateDocumentExtractedData(id, updatedExtractedData);

    if (!updatedDocument) {
      return ApiResponseHelper.internalError(res, 'Failed to update document');
    }

    logger.info(`Document extracted data updated: ${id} by user: ${userId}`);

    return ApiResponseHelper.success(
      res,
      { document: updatedDocument },
      'Document updated successfully'
    );
  }
);

// Batch upload documents
export const uploadDocumentsBatch = asyncHandler(
  async (req: AuthRequest, res: Response): Promise<Response> => {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return ApiResponseHelper.badRequest(res, 'No files uploaded');
    }

    if (!req.user) {
      return ApiResponseHelper.unauthorized(res, 'User not authenticated');
    }

    const userId = (req.user as { _id: { toString: () => string } })._id.toString();
    const files = req.files as Express.Multer.File[];
    const batchId = randomUUID();

    // Get selected model from request body or query, default to 'best'
    const selectedModel = (req.body.model || req.query.model || 'best') as string;

    // Validate model
    const validModels = ['gemini', 'openai', 'groq', 'claude', 'rexcan', 'best'];
    const model = validModels.includes(selectedModel) ? selectedModel : 'best';

    const results: Array<{
      id: string;
      fileName: string;
      originalFileName: string;
      fileType: string;
      fileSize: number;
      status: string;
      queueJobId: string;
      createdAt: string;
      error?: string;
    }> = [];

    let successful = 0;
    let failed = 0;

    // Process each file
    for (const file of files) {
      try {
        // Determine file type
        const fileExtension = path.extname(file.originalname).toLowerCase();
        const fileType =
          fileExtension === '.pdf' ? DocumentType.PDF : DocumentType.IMAGE;

        // Create document record and add to queue
        const { document, jobId } = await createDocument({
          userId,
          fileName: file.filename,
          originalFileName: file.originalname,
          filePath: file.path,
          fileType,
          mimeType: file.mimetype,
          fileSize: file.size,
          selectedModel: model,
          batchId, // Add batch ID to track batch processing
        });

        results.push({
          id: (document._id as { toString: () => string }).toString(),
          fileName: document.fileName,
          originalFileName: document.originalFileName,
          fileType: document.fileType,
          fileSize: document.fileSize,
          status: document.status,
          queueJobId: jobId,
          createdAt: document.createdAt.toISOString(),
        });

        successful++;
        logger.info(`Document uploaded in batch: ${document._id} by user: ${userId}`);
      } catch (error) {
        failed++;
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        logger.error(`Failed to upload file in batch: ${file.originalname}`, error);
        
        results.push({
          id: '',
          fileName: file.filename,
          originalFileName: file.originalname,
          fileType: '',
          fileSize: file.size,
          status: 'failed',
          queueJobId: '',
          createdAt: new Date().toISOString(),
          error: errorMessage,
        });
      }
    }

    return ApiResponseHelper.success(
      res,
      {
        batchId,
        documents: results,
        total: files.length,
        successful,
        failed,
      },
      `Batch upload completed: ${successful} successful, ${failed} failed`
    );
  }
);

