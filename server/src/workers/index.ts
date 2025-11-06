import { documentWorker } from './document.worker.js';
import { logger } from '../utils/logger.js';

export const startWorkers = (): void => {
  logger.info('Starting document processing workers...');
  // Workers are automatically started when imported
  // Additional worker initialization can be added here if needed
};

export { documentWorker };

