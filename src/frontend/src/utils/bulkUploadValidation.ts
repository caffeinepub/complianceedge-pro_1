/**
 * Generic validation utilities for bulk upload
 */

import type { ParsedRow } from './bulkUploadFileParsing';

export interface RowError {
  rowNumber: number;
  errors: string[];
}

export interface ValidationResult {
  valid: boolean;
  rowErrors: RowError[];
  missingColumns: string[];
}

/**
 * Validate that required columns are present
 */
export function validateRequiredColumns(
  headers: string[],
  requiredColumns: string[]
): string[] {
  const normalizedHeaders = headers.map(h => h.toLowerCase().trim());
  const missingColumns = requiredColumns.filter(
    col => !normalizedHeaders.includes(col.toLowerCase())
  );
  return missingColumns;
}

/**
 * Create a row error object
 */
export function createRowError(rowNumber: number, errors: string[]): RowError {
  return { rowNumber, errors };
}

/**
 * Validate that a field is not empty
 */
export function validateNotEmpty(value: string, fieldName: string): string | null {
  if (!value || value.trim() === '') {
    return `${fieldName} is required`;
  }
  return null;
}

/**
 * Validate that a field is a valid number
 */
export function validateNumber(value: string, fieldName: string): string | null {
  const num = parseFloat(value);
  if (isNaN(num)) {
    return `${fieldName} must be a valid number (got: ${value})`;
  }
  return null;
}

/**
 * Validate that a field is a positive number
 */
export function validatePositiveNumber(value: string, fieldName: string): string | null {
  const num = parseFloat(value);
  if (isNaN(num) || num <= 0) {
    return `${fieldName} must be a positive number (got: ${value})`;
  }
  return null;
}

/**
 * Validate that a field matches a regex pattern
 */
export function validatePattern(
  value: string,
  fieldName: string,
  pattern: RegExp,
  errorMessage: string
): string | null {
  if (!pattern.test(value)) {
    return `${fieldName} ${errorMessage} (got: ${value})`;
  }
  return null;
}

/**
 * Validate date format (basic check)
 */
export function validateDate(value: string, fieldName: string): string | null {
  const date = new Date(value);
  if (isNaN(date.getTime())) {
    return `${fieldName} must be a valid date (got: ${value})`;
  }
  return null;
}
