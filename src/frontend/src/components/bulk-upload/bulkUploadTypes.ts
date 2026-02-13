/**
 * Shared types for bulk upload functionality
 */

import type { ParsedRow } from '../../utils/bulkUploadFileParsing';

export interface BulkUploadConfig {
  requiredColumns: string[];
  sampleFileUrl: string;
  sampleFileName: string;
  title: string;
  description: string;
}

export interface ImportSummary {
  total: number;
  successful: number;
  failed: number;
  skipped: number;
}

export { ParsedRow };
