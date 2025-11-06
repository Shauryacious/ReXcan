import { useEffect } from 'react';
import type { Document, ExtractedData } from '../types/document.types';

interface DocumentDetailsModalProps {
  document: Document | null;
  isOpen: boolean;
  onClose: () => void;
}

const DocumentDetailsModal = ({ document: doc, isOpen, onClose }: DocumentDetailsModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.documentElement.style.overflow = 'unset';
    }
    return () => {
      document.documentElement.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !doc) return null;

  const formatCurrency = (amount: number | undefined, currency: string | undefined): string => {
    if (amount === undefined || amount === null) return 'N/A';
    const currencySymbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : currency || '$';
    return `${currencySymbol}${amount.toFixed(2)}`;
  };

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const extractedData: ExtractedData | undefined = doc.extractedData;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-rexcan-dark-blue-secondary/20 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-rexcan-dark-blue-primary">
              Document Details
            </h2>
            <p className="text-sm text-rexcan-dark-blue-secondary mt-1">
              {doc.originalFileName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-rexcan-dark-blue-secondary hover:text-rexcan-dark-blue-primary transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Document Info */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-rexcan-dark-blue-primary mb-3">
              Document Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-rexcan-dark-blue-secondary">Status</p>
                <p className="font-medium capitalize">{doc.status}</p>
              </div>
              <div>
                <p className="text-sm text-rexcan-dark-blue-secondary">File Type</p>
                <p className="font-medium uppercase">{doc.fileType}</p>
              </div>
              {doc.selectedModel && (
                <div>
                  <p className="text-sm text-rexcan-dark-blue-secondary">AI Model Used</p>
                  <p className="font-medium capitalize">
                    {doc.selectedModel === 'best' ? 'Best Model (Recommended)' : doc.selectedModel}
                  </p>
                </div>
              )}
              <div>
                <p className="text-sm text-rexcan-dark-blue-secondary">File Size</p>
                <p className="font-medium">
                  {(doc.fileSize / 1024).toFixed(2)} KB
                </p>
              </div>
              <div>
                <p className="text-sm text-rexcan-dark-blue-secondary">Uploaded</p>
                <p className="font-medium">
                  {new Date(doc.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Extracted Data */}
          {extractedData ? (
            <div className="border-t border-rexcan-dark-blue-secondary/20 pt-6">
              <h3 className="text-lg font-semibold text-rexcan-dark-blue-primary mb-4">
                Extracted Invoice Data
              </h3>

              <div className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-2 gap-4">
                  {extractedData.invoiceNumber && (
                    <div>
                      <p className="text-sm text-rexcan-dark-blue-secondary mb-1">
                        Invoice Number
                      </p>
                      <p className="font-medium text-rexcan-dark-blue-primary">
                        {extractedData.invoiceNumber}
                      </p>
                    </div>
                  )}
                  {extractedData.vendorName && (
                    <div>
                      <p className="text-sm text-rexcan-dark-blue-secondary mb-1">
                        Vendor Name
                      </p>
                      <p className="font-medium text-rexcan-dark-blue-primary">
                        {extractedData.vendorName}
                      </p>
                    </div>
                  )}
                  {extractedData.invoiceDate && (
                    <div>
                      <p className="text-sm text-rexcan-dark-blue-secondary mb-1">
                        Invoice Date
                      </p>
                      <p className="font-medium text-rexcan-dark-blue-primary">
                        {formatDate(extractedData.invoiceDate)}
                      </p>
                    </div>
                  )}
                  {extractedData.dueDate && (
                    <div>
                      <p className="text-sm text-rexcan-dark-blue-secondary mb-1">
                        Due Date
                      </p>
                      <p className="font-medium text-rexcan-dark-blue-primary">
                        {formatDate(extractedData.dueDate)}
                      </p>
                    </div>
                  )}
                  {extractedData.totalAmount !== undefined && (
                    <div>
                      <p className="text-sm text-rexcan-dark-blue-secondary mb-1">
                        Total Amount
                      </p>
                      <p className="font-medium text-lg text-rexcan-dark-blue-primary">
                        {formatCurrency(extractedData.totalAmount, extractedData.currency)}
                      </p>
                    </div>
                  )}
                  {extractedData.currency && (
                    <div>
                      <p className="text-sm text-rexcan-dark-blue-secondary mb-1">
                        Currency
                      </p>
                      <p className="font-medium text-rexcan-dark-blue-primary">
                        {extractedData.currency}
                      </p>
                    </div>
                  )}
                  {extractedData.paymentTerms && (
                    <div className="col-span-2">
                      <p className="text-sm text-rexcan-dark-blue-secondary mb-1">
                        Payment Terms
                      </p>
                      <p className="font-medium text-rexcan-dark-blue-primary">
                        {extractedData.paymentTerms}
                      </p>
                    </div>
                  )}
                </div>

                {/* Tax Information */}
                {extractedData.taxInformation && (
                  <div className="border-t border-rexcan-dark-blue-secondary/20 pt-4">
                    <h4 className="text-md font-semibold text-rexcan-dark-blue-primary mb-3">
                      Tax Information
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      {extractedData.taxInformation.taxRate !== undefined && (
                        <div>
                          <p className="text-sm text-rexcan-dark-blue-secondary mb-1">
                            Tax Rate
                          </p>
                          <p className="font-medium text-rexcan-dark-blue-primary">
                            {extractedData.taxInformation.taxRate}%
                          </p>
                        </div>
                      )}
                      {extractedData.taxInformation.taxAmount !== undefined && (
                        <div>
                          <p className="text-sm text-rexcan-dark-blue-secondary mb-1">
                            Tax Amount
                          </p>
                          <p className="font-medium text-rexcan-dark-blue-primary">
                            {formatCurrency(
                              extractedData.taxInformation.taxAmount,
                              extractedData.currency
                            )}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Line Items */}
                {extractedData.lineItems && extractedData.lineItems.length > 0 && (
                  <div className="border-t border-rexcan-dark-blue-secondary/20 pt-4">
                    <h4 className="text-md font-semibold text-rexcan-dark-blue-primary mb-3">
                      Line Items
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-rexcan-dark-blue-secondary/20">
                            <th className="text-left py-2 px-3 text-rexcan-dark-blue-secondary font-semibold">
                              Description
                            </th>
                            <th className="text-right py-2 px-3 text-rexcan-dark-blue-secondary font-semibold">
                              Quantity
                            </th>
                            <th className="text-right py-2 px-3 text-rexcan-dark-blue-secondary font-semibold">
                              Unit Price
                            </th>
                            <th className="text-right py-2 px-3 text-rexcan-dark-blue-secondary font-semibold">
                              Amount
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {extractedData.lineItems.map((item, index) => (
                            <tr
                              key={index}
                              className="border-b border-rexcan-dark-blue-secondary/10"
                            >
                              <td className="py-2 px-3 text-rexcan-dark-blue-primary">
                                {item.description || 'N/A'}
                              </td>
                              <td className="py-2 px-3 text-right text-rexcan-dark-blue-primary">
                                {item.quantity ?? 'N/A'}
                              </td>
                              <td className="py-2 px-3 text-right text-rexcan-dark-blue-primary">
                                {item.unitPrice !== undefined
                                  ? formatCurrency(item.unitPrice, extractedData.currency)
                                  : 'N/A'}
                              </td>
                              <td className="py-2 px-3 text-right font-medium text-rexcan-dark-blue-primary">
                                {item.amount !== undefined
                                  ? formatCurrency(item.amount, extractedData.currency)
                                  : 'N/A'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="border-t border-rexcan-dark-blue-secondary/20 pt-6">
              <div className="text-center py-8">
                <p className="text-rexcan-dark-blue-secondary">
                  {doc.status === 'processed'
                    ? 'No extracted data available for this document.'
                    : doc.status === 'processing'
                      ? 'Document is being processed. Please check back later.'
                      : 'Document has not been processed yet.'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentDetailsModal;

