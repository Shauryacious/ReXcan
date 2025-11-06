import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Determine which env file to load based on NODE_ENV
const nodeEnv = process.env.NODE_ENV || 'development';
const envFile = nodeEnv === 'production' ? '.env.production' : '.env.development';

// Load environment-specific file first, then fallback to .env
dotenv.config({ path: path.resolve(__dirname, '../../', envFile) });
dotenv.config({ path: path.resolve(__dirname, '../../', '.env') }); // .env takes precedence if exists

interface EnvConfig {
  nodeEnv: string;
  port: number;
  mongodb: {
    uri: string;
    uriTest: string;
  };
  jwt: {
    secret: string;
    expire: string;
  };
  cors: {
    origin: string;
  };
  rateLimit: {
    windowMs: number;
    maxRequests: number;
  };
  logLevel: string;
  redis: {
    host: string;
    port: number;
    password?: string;
  };
  storage: {
    basePath: string;
  };
}

const validateEnv = (): void => {
  const required = [
    'MONGODB_URI',
    'JWT_SECRET',
  ];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
};

export const env: EnvConfig = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/resxcan',
    uriTest: process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/resxcan_test',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret-change-in-production',
    expire: process.env.JWT_EXPIRE || '7d',
  },
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },
  logLevel: process.env.LOG_LEVEL || 'info',
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    ...(process.env.REDIS_PASSWORD && { password: process.env.REDIS_PASSWORD }),
  },
  storage: {
    basePath: process.env.STORAGE_BASE_PATH || 'storage',
  },
};

// Validate environment on import
if (env.nodeEnv !== 'test') {
  validateEnv();
}

