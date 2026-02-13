/**
 * Backend error normalization utilities
 * Provides user-friendly error messages while preserving technical details
 */

export interface NormalizedError {
  userMessage: string;
  technicalMessage: string;
  isSchemaError: boolean;
}

/**
 * Patterns that indicate schema/decoding failures
 */
const SCHEMA_ERROR_PATTERNS = [
  /invalid principal/i,
  /candid.*decode/i,
  /candid.*type/i,
  /invalid.*argument/i,
  /field.*expected/i,
  /type mismatch/i,
  /deserialization/i,
];

/**
 * Normalize backend errors into user-friendly messages
 */
export function normalizeBackendError(error: unknown): NormalizedError {
  const technicalMessage = error instanceof Error ? error.message : String(error);
  
  // Check if this looks like a schema/decoding error
  const isSchemaError = SCHEMA_ERROR_PATTERNS.some(pattern => 
    pattern.test(technicalMessage)
  );

  if (isSchemaError) {
    return {
      userMessage: 'Import failed due to an invalid data format. Please re-download the sample CSV template and ensure your data matches the expected format exactly.',
      technicalMessage,
      isSchemaError: true,
    };
  }

  // For other errors, use the technical message as-is
  return {
    userMessage: technicalMessage,
    technicalMessage,
    isSchemaError: false,
  };
}

/**
 * Log technical error details to console for debugging
 */
export function logTechnicalError(error: NormalizedError, context?: string) {
  const prefix = context ? `[${context}]` : '[Backend Error]';
  console.error(`${prefix} Technical details:`, error.technicalMessage);
  if (error.isSchemaError) {
    console.error(`${prefix} This appears to be a schema/decoding error. Check that the data format matches the backend expectations.`);
  }
}
