/**
 * Trade import file parsing utilities
 * Supports CSV format using FileReader API
 */

import { parseCSVFile, type FileParseResult } from '../../../utils/bulkUploadFileParsing';

export interface ParsedRow {
  [key: string]: string;
}

export interface ParseResult {
  success: boolean;
  data?: ParsedRow[];
  error?: string;
}

/**
 * Parse CSV file into array of row objects
 * Refactored to use shared CSV parser
 */
export async function parseTradeFile(file: File): Promise<ParseResult> {
  try {
    // Validate file type
    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith('.csv')) {
      return {
        success: false,
        error: 'Only CSV files are supported',
      };
    }

    // Use shared CSV parser
    const result: FileParseResult = await parseCSVFile(file);

    if (!result.success) {
      return {
        success: false,
        error: result.error || 'Failed to parse CSV file',
      };
    }

    return {
      success: true,
      data: result.rows,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to parse file',
    };
  }
}
