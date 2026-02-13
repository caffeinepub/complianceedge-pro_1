/**
 * Client-specific bulk upload mapping and validation
 */

import type { ParsedRow } from '../../utils/bulkUploadFileParsing';
import type { BulkClient } from '../../backend';
import { validateNotEmpty, validatePattern } from '../../utils/bulkUploadValidation';
import { PAN_REGEX } from '../../validation/pan';

export interface ClientBulkUploadRow {
  ucc: string;
  name: string;
  pan: string;
  mobile: string;
  email: string;
  address: string;
}

export interface ClientValidationError {
  rowNumber: number;
  errors: string[];
}

export interface ClientImportResult {
  valid: boolean;
  clients: BulkClient[];
  errors: ClientValidationError[];
}

const REQUIRED_COLUMNS = ['ucc', 'name', 'pan', 'mobile', 'email', 'address'];

/**
 * Validate and convert parsed rows to BulkClient objects
 */
export function validateAndConvertClients(rows: ParsedRow[]): ClientImportResult {
  const errors: ClientValidationError[] = [];
  const clients: BulkClient[] = [];

  rows.forEach((row, index) => {
    const rowNumber = index + 2; // +2 for header and 1-based indexing
    const rowErrors = validateClientRow(row);

    if (rowErrors.length > 0) {
      errors.push({ rowNumber, errors: rowErrors });
    } else {
      try {
        const client = convertToBulkClient(row);
        clients.push(client);
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
    clients,
    errors,
  };
}

/**
 * Validate a single client row
 */
function validateClientRow(row: ParsedRow): string[] {
  const errors: string[] = [];

  // Validate required fields
  const nameError = validateNotEmpty(row.name, 'name');
  if (nameError) errors.push(nameError);

  const panError = validateNotEmpty(row.pan, 'pan');
  if (panError) {
    errors.push(panError);
  } else {
    // Validate PAN format
    const panFormatError = validatePattern(
      row.pan.trim().toUpperCase(),
      'PAN',
      PAN_REGEX,
      'must be a valid PAN format (e.g., ABCDE1234F)'
    );
    if (panFormatError) errors.push(panFormatError);
  }

  const addressError = validateNotEmpty(row.address, 'address');
  if (addressError) errors.push(addressError);

  // UCC, mobile, and email are optional but should be validated if present
  // (basic validation only)

  return errors;
}

/**
 * Convert validated row to BulkClient (backend will set createdBy/createdAt/updatedAt)
 */
function convertToBulkClient(row: ParsedRow): BulkClient {
  return {
    name: row.name.trim(),
    pan: row.pan.trim().toUpperCase(),
    address: row.address.trim(),
    documents: [],
  };
}

export { REQUIRED_COLUMNS };
