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
import { pythonAPIService } from '../services/python-api.service.js';
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
    const { documentId, filePath, fileType, fileName, selectedModel = 'best' } = job.data;

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

      // Step 1: Upload file to Python service
      logger.info(`Uploading file to Python service: ${fullFilePath}`);
      const uploadResponse = await pythonAPIService.uploadFile(
        fullFilePath,
        fileName
      );
      logger.info(`File uploaded to Python service, job_id: ${uploadResponse.job_id}`);

      // Step 2: Process invoice using Python service
      logger.info(`Processing invoice with Python service, job_id: ${uploadResponse.job_id}`);
      const invoiceExtract = await pythonAPIService.processInvoice(
        uploadResponse.job_id
      );
      logger.info(`Invoice processed successfully, job_id: ${uploadResponse.job_id}`);

      // Step 3: Transform Python service response to our document format
      const extractedData = {
        invoiceNumber: invoiceExtract.invoice_id || undefined,
        vendorName: invoiceExtract.vendor_name || undefined,
        vendorId: invoiceExtract.vendor_id || undefined,
        invoiceDate: invoiceExtract.invoice_date || undefined,
        dueDate: invoiceExtract.due_date || undefined,
        totalAmount: invoiceExtract.total_amount || undefined,
        amountSubtotal: invoiceExtract.amount_subtotal || undefined,
        amountTax: invoiceExtract.amount_tax || undefined,
        currency: invoiceExtract.currency || undefined,
        lineItems: invoiceExtract.line_items?.map((item) => ({
          description: item.description,
          quantity: item.quantity || undefined,
          unitPrice: item.unit_price || undefined,
          total: item.total || undefined,
        })),
        // Python service specific fields
        fieldConfidences: invoiceExtract.field_confidences,
        fieldReasons: invoiceExtract.field_reasons,
        fieldSources: invoiceExtract.field_sources,
        timings: invoiceExtract.timings,
        llmUsed: invoiceExtract.llm_used,
        llmFields: invoiceExtract.llm_fields,
        dedupeHash: invoiceExtract.dedupe_hash || undefined,
        isDuplicate: invoiceExtract.is_duplicate,
        isNearDuplicate: invoiceExtract.is_near_duplicate,
        nearDuplicates: invoiceExtract.near_duplicates,
        arithmeticMismatch: invoiceExtract.arithmetic_mismatch,
        needsHumanReview: invoiceExtract.needs_human_review,
        llmCallReason: invoiceExtract.llm_call_reason,
        ocrBlocks: invoiceExtract.raw_ocr_blocks,
        rawExtraction: invoiceExtract, // Store full response
      };

      // Update document with extracted data and Python job ID
      await updateDocumentExtractedData(documentId, extractedData);
      // Store Python job ID for future operations
      const { Document } = await import('../models/Document.model.js');
      await Document.findByIdAndUpdate(documentId, {
        pythonJobId: uploadResponse.job_id,
      });
      logger.info(`Extracted data saved for document ${documentId}`);

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

