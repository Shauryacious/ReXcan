import { Document, DocumentType, DocumentStatus, IDocument } from '../models/Document.model.js';
import { addDocumentToQueue, DocumentJobData } from '../config/queue.js';
import { logger } from '../utils/logger.js';
import path from 'path';

export interface CreateDocumentInput {
  userId: string;
  fileName: string;
  originalFileName: string;
  filePath: string;
  fileType: DocumentType;
  mimeType: string;
  fileSize: number;
}

export const createDocument = async (
  input: CreateDocumentInput
): Promise<{ document: IDocument; jobId: string }> => {
  try {
    // Create document record
    const document = new Document({
      ...input,
      status: DocumentStatus.UPLOADED,
    });

    await document.save();
    logger.info(`Document created: ${document._id}`);

    // Add to processing queue
    const jobData: DocumentJobData = {
      documentId: document._id.toString(),
      userId: input.userId,
      filePath: input.filePath,
      fileType: input.fileType === DocumentType.PDF ? 'pdf' : 'image',
      fileName: input.fileName,
    };

    const jobId = await addDocumentToQueue(jobData);

    // Update document with queue job ID and status
    document.queueJobId = jobId;
    document.status = DocumentStatus.QUEUED;
    await document.save();

    return { document, jobId };
  } catch (error) {
    logger.error('Error creating document:', error);
    throw error;
  }
};

export const getDocumentById = async (
  documentId: string,
  userId: string
): Promise<IDocument | null> => {
  try {
    const document = await Document.findOne({
      _id: documentId,
      userId,
    });

    return document;
  } catch (error) {
    logger.error('Error fetching document:', error);
    throw error;
  }
};

export const getUserDocuments = async (
  userId: string,
  limit: number = 50,
  skip: number = 0
): Promise<{ documents: IDocument[]; total: number }> => {
  try {
    const [documents, total] = await Promise.all([
      Document.find({ userId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip),
      Document.countDocuments({ userId }),
    ]);

    return { documents, total };
  } catch (error) {
    logger.error('Error fetching user documents:', error);
    throw error;
  }
};

export const updateDocumentStatus = async (
  documentId: string,
  status: DocumentStatus,
  errorMessage?: string
): Promise<IDocument | null> => {
  try {
    const updateData: any = { status };
    if (status === DocumentStatus.PROCESSED) {
      updateData.processedAt = new Date();
    }
    if (errorMessage) {
      updateData.errorMessage = errorMessage;
    }

    const document = await Document.findByIdAndUpdate(documentId, updateData, {
      new: true,
    });

    return document;
  } catch (error) {
    logger.error('Error updating document status:', error);
    throw error;
  }
};

