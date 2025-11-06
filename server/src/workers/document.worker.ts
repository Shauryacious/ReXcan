import { Worker, Job } from 'bullmq';
import { QueueName } from '../config/queue.js';
import { DocumentJobData } from '../config/queue.js';
import {
  updateDocumentStatus,
  updateDocumentExtractedData,
} from '../services/document.service.js';
import { DocumentStatus } from '../models/Document.model.js';
import { logger } from '../utils/logger.js';
import { env } from '../config/env.js';
import {
  extractInvoiceDataFromImage,
  extractInvoiceDataFromPDF,
} from '../services/gemini.service.js';
import path from 'path';

// Worker configuration
const workerOptions = {
  connection: {
    host: env.redis.host,
    port: env.redis.port,
    ...(env.redis.password && { password: env.redis.password }),
  },
  concurrency: 5, // Process 5 jobs concurrently
  limiter: {
    max: 10, // Max 10 jobs
    duration: 1000, // Per 1 second
  },
};

// Create worker
export const documentWorker = new Worker<DocumentJobData>(
  QueueName.DOCUMENT_PROCESSING,
  async (job: Job<DocumentJobData>) => {
    const { documentId, filePath, fileType, fileName } = job.data;

    logger.info(`Processing document: ${documentId} (Job ID: ${job.id})`);

    try {
      // Update status to processing
      await updateDocumentStatus(documentId, DocumentStatus.PROCESSING);

      logger.info(`Processing document: ${documentId}`);
      logger.info(`File path: ${filePath}`);
      logger.info(`File type: ${fileType}`);
      logger.info(`File name: ${fileName}`);

      // Get the full file path
      const fullFilePath = path.resolve(env.storage.basePath, filePath);

      // Extract invoice data using Google Gemini API
      let extractedData;
      if (fileType === 'pdf') {
        logger.info(`Extracting data from PDF: ${fullFilePath}`);
        extractedData = await extractInvoiceDataFromPDF(fullFilePath);
      } else {
        logger.info(`Extracting data from image: ${fullFilePath}`);
        extractedData = await extractInvoiceDataFromImage(fullFilePath);
      }

      // Update document with extracted data
      if (extractedData) {
        await updateDocumentExtractedData(documentId, extractedData);
        logger.info(`Extracted data saved for document ${documentId}`);
      }

      // Mark as processed
      await updateDocumentStatus(documentId, DocumentStatus.PROCESSED);

      logger.info(`Document ${documentId} processing completed successfully`);

      return {
        success: true,
        documentId,
        message: 'Document processing completed',
        extractedData,
      };
    } catch (error) {
      logger.error(`Error processing document ${documentId}:`, error);

      // Update status to failed
      await updateDocumentStatus(
        documentId,
        DocumentStatus.FAILED,
        error instanceof Error ? error.message : 'Unknown error occurred'
      );

      throw error;
    }
  },
  workerOptions
);

// Worker event listeners
documentWorker.on('completed', (job) => {
  logger.info(`Job ${job.id} completed successfully`);
});

documentWorker.on('failed', (job, err) => {
  logger.error(`Job ${job?.id} failed:`, err);
});

documentWorker.on('error', (error) => {
  logger.error('Worker error:', error);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, closing worker...');
  await documentWorker.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, closing worker...');
  await documentWorker.close();
  process.exit(0);
});

