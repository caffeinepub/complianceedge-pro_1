/**
 * Trade import file parsing utilities
 * Supports CSV format using FileReader API
 */

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
 */
export async function parseTradeFile(file: File): Promise<ParseResult> {
  try {
    // Validate file type
    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith('.csv')) {
      return {
        success: false,
        error: 'Unsupported file format. Please upload a CSV file.',
      };
    }

    // Read file content
    const content = await readFileAsText(file);
    
    // Parse CSV content
    const rows = parseCSV(content);
    
    if (rows.length === 0) {
      return {
        success: false,
        error: 'File is empty or could not be parsed.',
      };
    }

    return {
      success: true,
      data: rows,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to parse file',
    };
  }
}

/**
 * Read file content as text using FileReader
 */
function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      if (event.target?.result) {
        resolve(event.target.result as string);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
    
    reader.readAsText(file);
  });
}

/**
 * Parse CSV content into array of objects
 * Handles quoted fields with commas
 */
function parseCSV(content: string): ParsedRow[] {
  const lines = content.trim().split('\n');
  
  if (lines.length < 2) {
    return [];
  }

  // Parse header row
  const headers = parseCSVLine(lines[0]);
  
  // Parse data rows
  const rows: ParsedRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue; // Skip empty lines
    
    const values = parseCSVLine(line);
    
    // Create object from headers and values
    const row: ParsedRow = {};
    headers.forEach((header, index) => {
      row[header.trim()] = values[index]?.trim() || '';
    });
    
    rows.push(row);
  }
  
  return rows;
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
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  // Add last field
  result.push(current);
  
  return result;
}
