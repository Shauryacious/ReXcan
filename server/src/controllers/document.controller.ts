import { Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { createDocument, getUserDocuments, getDocumentById } from '../services/document.service.js';
import { DocumentType } from '../models/Document.model.js';
import { ApiResponseHelper } from '../utils/apiResponse.js';
import { logger } from '../utils/logger.js';
import { AuthRequest } from '../types/auth.types.js';
import path from 'path';

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

