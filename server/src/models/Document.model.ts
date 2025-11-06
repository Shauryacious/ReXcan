import mongoose, { Document, Schema } from 'mongoose';

export enum DocumentType {
  PDF = 'pdf',
  IMAGE = 'image',
}

export enum DocumentStatus {
  UPLOADED = 'uploaded',
  QUEUED = 'queued',
  PROCESSING = 'processing',
  PROCESSED = 'processed',
  FAILED = 'failed',
}

export interface IDocument extends Document {
  userId: mongoose.Types.ObjectId;
  fileName: string;
  originalFileName: string;
  filePath: string;
  fileType: DocumentType;
  mimeType: string;
  fileSize: number; // in bytes
  status: DocumentStatus;
  queueJobId?: string;
  metadata?: {
    pageCount?: number;
    dimensions?: {
      width?: number;
      height?: number;
    };
  };
  errorMessage?: string;
  processedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const documentSchema = new Schema<IDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    fileName: {
      type: String,
      required: [true, 'File name is required'],
    },
    originalFileName: {
      type: String,
      required: [true, 'Original file name is required'],
    },
    filePath: {
      type: String,
      required: [true, 'File path is required'],
    },
    fileType: {
      type: String,
      enum: Object.values(DocumentType),
      required: [true, 'File type is required'],
    },
    mimeType: {
      type: String,
      required: [true, 'MIME type is required'],
    },
    fileSize: {
      type: Number,
      required: [true, 'File size is required'],
      min: [0, 'File size must be positive'],
    },
    status: {
      type: String,
      enum: Object.values(DocumentStatus),
      default: DocumentStatus.UPLOADED,
      index: true,
    },
    queueJobId: {
      type: String,
      index: true,
    },
    metadata: {
      pageCount: Number,
      dimensions: {
        width: Number,
        height: Number,
      },
    },
    errorMessage: String,
    processedAt: Date,
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Indexes for efficient queries
documentSchema.index({ userId: 1, createdAt: -1 });
documentSchema.index({ status: 1, createdAt: -1 });
documentSchema.index({ queueJobId: 1 });

export const Document = mongoose.model<IDocument>('Document', documentSchema);

