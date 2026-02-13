/**
 * Margin snapshots bulk upload mapping and validation
 */

import type { ParsedRow } from '../../utils/bulkUploadFileParsing';
import type { MarginSnapshot } from '../../backend';
import {
  validateNotEmpty,
  validateNumber,
  validateDate,
} from '../../utils/bulkUploadValidation';

export interface MarginSnapshotValidationError {
  rowNumber: number;
  errors: string[];
}

export interface MarginSnapshotImportResult {
  valid: boolean;
  snapshots: MarginSnapshot[];
  errors: MarginSnapshotValidationError[];
}

const REQUIRED_COLUMNS = ['date', 'margin_available', 'margin_used'];

/**
 * Validate and convert parsed rows to MarginSnapshot objects
 */
export function validateAndConvertMarginSnapshots(rows: ParsedRow[]): MarginSnapshotImportResult {
  const errors: MarginSnapshotValidationError[] = [];
  const snapshots: MarginSnapshot[] = [];

  rows.forEach((row, index) => {
    const rowNumber = index + 2;
    const rowErrors = validateMarginSnapshotRow(row);

    if (rowErrors.length > 0) {
      errors.push({ rowNumber, errors: rowErrors });
    } else {
      try {
        const snapshot = convertToMarginSnapshot(row);
        snapshots.push(snapshot);
      } catch (error) {
        errors.push({
          rowNumber,
          errors: [error instanceof Error ? error.message : 'Conversion failed'],
        });
      }
    }
  });

  return {
    valid: errors.length === 0,
    snapshots,
    errors,
  };
}

/**
 * Validate a single margin snapshot row
 */
function validateMarginSnapshotRow(row: ParsedRow): string[] {
  const errors: string[] = [];

  // Validate date
  const dateError = validateNotEmpty(row.date, 'date');
  if (dateError) {
    errors.push(dateError);
  } else {
    const dateFormatError = validateDate(row.date, 'date');
    if (dateFormatError) errors.push(dateFormatError);
  }

  // Validate margin_available
  const availableError = validateNotEmpty(row.margin_available, 'margin_available');
  if (availableError) {
    errors.push(availableError);
  } else {
    const availableNumError = validateNumber(row.margin_available, 'margin_available');
    if (availableNumError) errors.push(availableNumError);
  }

  // Validate margin_used
  const usedError = validateNotEmpty(row.margin_used, 'margin_used');
  if (usedError) {
    errors.push(usedError);
  } else {
    const usedNumError = validateNumber(row.margin_used, 'margin_used');
    if (usedNumError) errors.push(usedNumError);
  }

  return errors;
}

/**
 * Convert validated row to MarginSnapshot
 */
function convertToMarginSnapshot(row: ParsedRow): MarginSnapshot {
  const date = new Date(row.date.trim());
  const marginAvailable = parseFloat(row.margin_available.trim());
  const marginUsed = parseFloat(row.margin_used.trim());

  return {
    date: BigInt(date.getTime() * 1000000), // Convert to nanoseconds
    marginAvailable,
    marginUsed,
    snapshotTime: BigInt(Date.now() * 1000000), // Will be overridden by backend
    recordedBy: null as any, // Will be set by backend
  };
}

export { REQUIRED_COLUMNS };
