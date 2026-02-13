/**
 * Collateral (pledged securities) bulk upload mapping and validation
 */

import type { ParsedRow } from '../../utils/bulkUploadFileParsing';
import type { CollateralRecord } from '../../backend';
import {
  validateNotEmpty,
  validateNumber,
  validateDate,
  validatePositiveNumber,
} from '../../utils/bulkUploadValidation';

export interface CollateralValidationError {
  rowNumber: number;
  errors: string[];
}

export interface CollateralImportResult {
  valid: boolean;
  collateral: CollateralRecord[];
  errors: CollateralValidationError[];
}

const REQUIRED_COLUMNS = ['client_id', 'security_name', 'quantity', 'pledge_date', 'market_value'];

/**
 * Validate and convert parsed rows to CollateralRecord objects
 */
export function validateAndConvertCollateral(rows: ParsedRow[]): CollateralImportResult {
  const errors: CollateralValidationError[] = [];
  const collateral: CollateralRecord[] = [];

  rows.forEach((row, index) => {
    const rowNumber = index + 2;
    const rowErrors = validateCollateralRow(row);

    if (rowErrors.length > 0) {
      errors.push({ rowNumber, errors: rowErrors });
    } else {
      try {
        const record = convertToCollateralRecord(row);
        collateral.push(record);
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
    collateral,
    errors,
  };
}

/**
 * Validate a single collateral row
 */
function validateCollateralRow(row: ParsedRow): string[] {
  const errors: string[] = [];

  // Validate client_id
  const clientIdError = validateNotEmpty(row.client_id, 'client_id');
  if (clientIdError) {
    errors.push(clientIdError);
  } else {
    const clientIdNumError = validateNumber(row.client_id, 'client_id');
    if (clientIdNumError) errors.push(clientIdNumError);
  }

  // Validate security_name
  const securityError = validateNotEmpty(row.security_name, 'security_name');
  if (securityError) errors.push(securityError);

  // Validate quantity
  const quantityError = validateNotEmpty(row.quantity, 'quantity');
  if (quantityError) {
    errors.push(quantityError);
  } else {
    const quantityNumError = validatePositiveNumber(row.quantity, 'quantity');
    if (quantityNumError) errors.push(quantityNumError);
  }

  // Validate pledge_date
  const pledgeDateError = validateNotEmpty(row.pledge_date, 'pledge_date');
  if (pledgeDateError) {
    errors.push(pledgeDateError);
  } else {
    const dateFormatError = validateDate(row.pledge_date, 'pledge_date');
    if (dateFormatError) errors.push(dateFormatError);
  }

  // Validate market_value
  const marketValueError = validateNotEmpty(row.market_value, 'market_value');
  if (marketValueError) {
    errors.push(marketValueError);
  } else {
    const marketValueNumError = validateNumber(row.market_value, 'market_value');
    if (marketValueNumError) errors.push(marketValueNumError);
  }

  return errors;
}

/**
 * Convert validated row to CollateralRecord
 */
function convertToCollateralRecord(row: ParsedRow): CollateralRecord {
  const pledgeDate = new Date(row.pledge_date.trim());
  const clientId = BigInt(parseInt(row.client_id.trim(), 10));
  const quantity = BigInt(parseInt(row.quantity.trim(), 10));
  const marketValue = parseFloat(row.market_value.trim());

  return {
    clientId,
    securityName: row.security_name.trim(),
    quantity,
    pledgeDate: BigInt(pledgeDate.getTime() * 1000000), // Convert to nanoseconds
    marketValue,
    recordedBy: null as any, // Will be set by backend
    recordedAt: BigInt(Date.now() * 1000000), // Will be overridden by backend
  };
}

export { REQUIRED_COLUMNS };
