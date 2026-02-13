/**
 * Reconciliation (statement rows) bulk upload mapping and validation
 */

import type { ParsedRow } from '../../utils/bulkUploadFileParsing';
import type { StatementRow } from '../../backend';
import {
  validateNotEmpty,
  validateNumber,
  validateDate,
} from '../../utils/bulkUploadValidation';

export interface StatementRowValidationError {
  rowNumber: number;
  errors: string[];
}

export interface StatementRowImportResult {
  valid: boolean;
  rows: StatementRow[];
  errors: StatementRowValidationError[];
}

const REQUIRED_COLUMNS = ['date', 'description', 'amount', 'balance'];

/**
 * Validate and convert parsed rows to StatementRow objects
 */
export function validateAndConvertStatementRows(rows: ParsedRow[]): StatementRowImportResult {
  const errors: StatementRowValidationError[] = [];
  const statementRows: StatementRow[] = [];

  rows.forEach((row, index) => {
    const rowNumber = index + 2;
    const rowErrors = validateStatementRow(row);

    if (rowErrors.length > 0) {
      errors.push({ rowNumber, errors: rowErrors });
    } else {
      try {
        const statementRow = convertToStatementRow(row);
        statementRows.push(statementRow);
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
    rows: statementRows,
    errors,
  };
}

/**
 * Validate a single statement row
 */
function validateStatementRow(row: ParsedRow): string[] {
  const errors: string[] = [];

  // Validate date
  const dateError = validateNotEmpty(row.date, 'date');
  if (dateError) {
    errors.push(dateError);
  } else {
    const dateFormatError = validateDate(row.date, 'date');
    if (dateFormatError) errors.push(dateFormatError);
  }

  // Validate description
  const descError = validateNotEmpty(row.description, 'description');
  if (descError) errors.push(descError);

  // Validate amount
  const amountError = validateNotEmpty(row.amount, 'amount');
  if (amountError) {
    errors.push(amountError);
  } else {
    const amountNumError = validateNumber(row.amount, 'amount');
    if (amountNumError) errors.push(amountNumError);
  }

  // Validate balance
  const balanceError = validateNotEmpty(row.balance, 'balance');
  if (balanceError) {
    errors.push(balanceError);
  } else {
    const balanceNumError = validateNumber(row.balance, 'balance');
    if (balanceNumError) errors.push(balanceNumError);
  }

  return errors;
}

/**
 * Convert validated row to StatementRow
 */
function convertToStatementRow(row: ParsedRow): StatementRow {
  const date = new Date(row.date.trim());
  const amount = parseFloat(row.amount.trim());
  const balance = parseFloat(row.balance.trim());

  return {
    date: BigInt(date.getTime() * 1000000), // Convert to nanoseconds
    description: row.description.trim(),
    amount,
    balance,
    recordedBy: null as any, // Will be set by backend
  };
}

export { REQUIRED_COLUMNS };
