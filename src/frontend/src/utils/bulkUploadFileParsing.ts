/**
 * Shared file parsing utilities for bulk upload
 * Supports CSV format using FileReader API
 */

export interface ParsedRow {
  [key: string]: string;
}

export interface FileParseResult {
  success: boolean;
  headers: string[];
  rowCount: number;
  rows: ParsedRow[];
  error?: string;
}

/**
 * Parse CSV file into array of row objects
 */
export async function parseCSVFile(file: File): Promise<FileParseResult> {
  try {
    const text = await readFileAsText(file);
    return parseCSVText(text);
  } catch (error) {
    return {
      success: false,
      headers: [],
      rowCount: 0,
      rows: [],
      error: error instanceof Error ? error.message : 'Failed to parse CSV file',
    };
  }
}

/**
 * Parse CSV text content
 */
function parseCSVText(text: string): FileParseResult {
  const lines = text.split(/\r?\n/).filter(line => line.trim());
  
  if (lines.length === 0) {
    return {
      success: false,
      headers: [],
      rowCount: 0,
      rows: [],
      error: 'File is empty',
    };
  }

  // Parse header row
  const headers = parseCSVLine(lines[0]);
  
  if (headers.length === 0) {
    return {
      success: false,
      headers: [],
      rowCount: 0,
      rows: [],
      error: 'No headers found in file',
    };
  }

  // Parse data rows
  const rows: ParsedRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length > 0) {
      const row: ParsedRow = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      rows.push(row);
    }
  }

  return {
    success: true,
    headers,
    rowCount: rows.length,
    rows,
  };
}

/**
 * Parse a single CSV line, handling quoted fields
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        current += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // Field separator
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  // Add last field
  result.push(current.trim());

  return result;
}

/**
 * Read file as text
 */
function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === 'string') {
        resolve(result);
      } else {
        reject(new Error('Failed to read file as text'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

/**
 * Parse file based on extension (CSV or XLSX)
 */
export async function parseFile(file: File): Promise<FileParseResult> {
  const fileName = file.name.toLowerCase();
  
  if (fileName.endsWith('.csv')) {
    return parseCSVFile(file);
  } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
    return {
      success: false,
      headers: [],
      rowCount: 0,
      rows: [],
      error: 'Excel files (.xlsx/.xls) are not yet supported. Please use CSV format.',
    };
  } else {
    return {
      success: false,
      headers: [],
      rowCount: 0,
      rows: [],
      error: 'Unsupported file format. Please use CSV files.',
    };
  }
}
