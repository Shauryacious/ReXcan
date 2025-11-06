import { Worker, Job } from 'bullmq';
import { QueueName } from '../config/queue.js';
import { DocumentJobData } from '../config/queue.js';
import { updateDocumentStatus, getDocumentById } from '../services/document.service.js';
import { DocumentStatus } from '../models/Document.model.js';
import { logger } from '../utils/logger.js';
import { env } from '../config/env.js';

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
    const { documentId, userId, filePath, fileType, fileName } = job.data;

    logger.info(`Processing document: ${documentId} (Job ID: ${job.id})`);

    try {
      // Update status to processing
      await updateDocumentStatus(documentId, DocumentStatus.PROCESSING);

      // TODO: Implement preprocessing logic here
      // This should include:
      // 1. File validation and verification
      // 2. Extract metadata (page count for PDFs, dimensions for images)
      // 3. OCR processing if needed
      // 4. File format conversion if needed
      // 5. Quality checks
      // 6. Any other preprocessing steps required before main processing

      logger.info(`TODO: Preprocessing for document ${documentId}`);
      logger.info(`File path: ${filePath}`);
      logger.info(`File type: ${fileType}`);
      logger.info(`File name: ${fileName}`);

      // Simulate processing delay (remove when implementing actual preprocessing)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // For now, mark as processed (update this when implementing actual preprocessing)
      await updateDocumentStatus(documentId, DocumentStatus.PROCESSED);

      logger.info(`Document ${documentId} preprocessing completed`);

      return {
        success: true,
        documentId,
        message: 'Document preprocessing completed (TODO: implement actual preprocessing)',
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

