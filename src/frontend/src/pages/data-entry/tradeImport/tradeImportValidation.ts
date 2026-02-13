/**
 * Trade import validation utilities
 */

import type { Trade } from '../../../backend';
import type { ParsedRow } from './tradeImportParsing';

export interface ValidationResult {
  valid: boolean;
  trades?: Trade[];
  errors?: string[];
}

const REQUIRED_COLUMNS = [
  'client_code',
  'trade_date',
  'exchange',
  'segment',
  'security',
  'side',
  'quantity',
  'price',
  'order_id',
  'trade_id',
];

/**
 * Validate parsed rows and convert to Trade objects
 */
export function validateAndConvertTrades(rows: ParsedRow[]): ValidationResult {
  const errors: string[] = [];
  
  // Check if we have any rows
  if (rows.length === 0) {
    return {
      valid: false,
      errors: ['No data rows found in file'],
    };
  }

  // Validate required columns
  const headers = Object.keys(rows[0]);
  const missingColumns = REQUIRED_COLUMNS.filter(col => !headers.includes(col));
  
  if (missingColumns.length > 0) {
    return {
      valid: false,
      errors: [
        `Missing required columns: ${missingColumns.join(', ')}`,
        `Required columns are: ${REQUIRED_COLUMNS.join(', ')}`,
      ],
    };
  }

  // Validate and convert each row
  const trades: Trade[] = [];
  
  rows.forEach((row, index) => {
    const rowNumber = index + 2; // +2 because: +1 for header, +1 for 1-based indexing
    const rowErrors = validateRow(row, rowNumber);
    
    if (rowErrors.length > 0) {
      errors.push(...rowErrors);
    } else {
      try {
        const trade = convertToTrade(row);
        trades.push(trade);
      } catch (error) {
        errors.push(`Row ${rowNumber}: ${error instanceof Error ? error.message : 'Conversion failed'}`);
      }
    }
  });

  if (errors.length > 0) {
    return {
      valid: false,
      errors,
    };
  }

  return {
    valid: true,
    trades,
  };
}

/**
 * Validate a single row
 */
function validateRow(row: ParsedRow, rowNumber: number): string[] {
  const errors: string[] = [];

  // Check required fields are not empty
  REQUIRED_COLUMNS.forEach(col => {
    if (!row[col] || row[col].trim() === '') {
      errors.push(`Row ${rowNumber}: Missing value for ${col}`);
    }
  });

  // Validate quantity is a positive integer
  const quantity = row.quantity?.trim();
  if (quantity) {
    const quantityNum = parseInt(quantity, 10);
    if (isNaN(quantityNum) || quantityNum <= 0) {
      errors.push(`Row ${rowNumber}: quantity must be a positive number (got: ${quantity})`);
    }
  }

  // Validate price is a positive number
  const price = row.price?.trim();
  if (price) {
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      errors.push(`Row ${rowNumber}: price must be a positive number (got: ${price})`);
    }
  }

  // Validate side is either BUY or SELL
  const side = row.side?.trim().toUpperCase();
  if (side && side !== 'BUY' && side !== 'SELL') {
    errors.push(`Row ${rowNumber}: side must be either BUY or SELL (got: ${row.side})`);
  }

  return errors;
}

/**
 * Convert validated row to Trade object
 */
function convertToTrade(row: ParsedRow): Trade {
  return {
    client_code: row.client_code.trim(),
    trade_date: row.trade_date.trim(),
    exchange: row.exchange.trim(),
    segment: row.segment.trim(),
    security: row.security.trim(),
    side: row.side.trim().toUpperCase(),
    quantity: BigInt(parseInt(row.quantity.trim(), 10)),
    price: parseFloat(row.price.trim()),
    order_id: row.order_id.trim(),
    trade_id: row.trade_id.trim(),
  };
}
