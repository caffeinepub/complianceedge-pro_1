import { useState, useRef, useId } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Alert, AlertDescription } from '../ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Upload, Download, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';
import { parseFile, type FileParseResult } from '../../utils/bulkUploadFileParsing';
import { validateRequiredColumns } from '../../utils/bulkUploadValidation';
import { downloadSampleFile } from '../../utils/sampleDownloads';
import { normalizeBackendError, logTechnicalError } from '../../utils/backendError';
import { toast } from 'sonner';
import type { BulkUploadConfig } from './bulkUploadTypes';

interface BulkUploadSectionProps {
  config: BulkUploadConfig;
  onImport: (rows: FileParseResult['rows']) => Promise<void>;
  disabled?: boolean;
}

export default function BulkUploadSection({ config, onImport, disabled }: BulkUploadSectionProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parseResult, setParseResult] = useState<FileParseResult | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileInputId = useId();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    const result = await parseFile(file);
    setParseResult(result);

    if (!result.success) {
      toast.error(result.error || 'Failed to parse file');
    }
  };

  const handleDownloadSample = async () => {
    setIsDownloading(true);
    try {
      await downloadSampleFile(config.sampleFileUrl, config.sampleFileName);
      toast.success('Sample file downloaded successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to download sample file';
      toast.error(message);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleImport = async () => {
    if (!parseResult || !parseResult.success) return;

    setIsImporting(true);
    try {
      await onImport(parseResult.rows);
      toast.success(`Successfully imported ${parseResult.rowCount} rows`);
      // Reset state
      setSelectedFile(null);
      setParseResult(null);
      // Reset file input using ref
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      // Normalize the error for user-friendly display
      const normalizedError = normalizeBackendError(error);
      
      // Log technical details to console
      logTechnicalError(normalizedError, 'Bulk Upload');
      
      // Show user-friendly message
      toast.error(normalizedError.userMessage, {
        duration: 6000,
        description: normalizedError.isSchemaError 
          ? 'Check the console for technical details.'
          : undefined,
      });
    } finally {
      setIsImporting(false);
    }
  };

  const missingColumns = parseResult?.success
    ? validateRequiredColumns(parseResult.headers, config.requiredColumns)
    : [];

  const hasErrors = !parseResult?.success || missingColumns.length > 0;
  const canImport = parseResult?.success && !hasErrors && !isImporting && !disabled;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{config.title}</CardTitle>
        <CardDescription>{config.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* File Selection */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadSample}
            disabled={isDownloading || disabled}
          >
            <Download className="h-4 w-4 mr-2" />
            {isDownloading ? 'Downloading...' : 'Download Sample'}
          </Button>
          <div className="flex-1">
            <label htmlFor={fileInputId} className={disabled ? 'cursor-not-allowed' : 'cursor-pointer'}>
              <Button variant="outline" asChild disabled={disabled}>
                <span className={disabled ? 'cursor-not-allowed' : 'cursor-pointer'}>
                  <Upload className="h-4 w-4 mr-2" />
                  Choose File
                </span>
              </Button>
            </label>
            <input
              ref={fileInputRef}
              id={fileInputId}
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="hidden"
              disabled={disabled}
            />
          </div>
          {selectedFile && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="h-4 w-4" />
              {selectedFile.name}
            </div>
          )}
        </div>

        {/* Required Columns Info */}
        <div className="p-3 bg-muted rounded-lg">
          <p className="text-xs font-medium mb-1">Required columns:</p>
          <p className="text-xs text-muted-foreground">
            {config.requiredColumns.join(', ')}
          </p>
        </div>

        {/* Parse Result */}
        {parseResult && (
          <div className="space-y-4">
            {/* Success/Error Summary */}
            {parseResult.success ? (
              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>
                  File parsed successfully: {parseResult.rowCount} rows detected with {parseResult.headers.length} columns
                </AlertDescription>
              </Alert>
            ) : (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{parseResult.error}</AlertDescription>
              </Alert>
            )}

            {/* Missing Columns Error */}
            {missingColumns.length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="font-medium mb-1">Missing required columns:</div>
                  <div className="text-sm">{missingColumns.join(', ')}</div>
                </AlertDescription>
              </Alert>
            )}

            {/* Preview Table */}
            {parseResult.success && parseResult.rows.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Preview (first 5 rows):</h4>
                <div className="border rounded-lg overflow-hidden">
                  <div className="max-h-64 overflow-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {parseResult.headers.map((header, index) => (
                            <TableHead key={index} className="whitespace-nowrap">
                              {header}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {parseResult.rows.slice(0, 5).map((row, rowIndex) => (
                          <TableRow key={rowIndex}>
                            {parseResult.headers.map((header, colIndex) => (
                              <TableCell key={colIndex} className="whitespace-nowrap">
                                {row[header] || '-'}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            )}

            {/* Import Button */}
            <div className="flex justify-end">
              <Button
                onClick={handleImport}
                disabled={!canImport}
              >
                {isImporting ? 'Importing...' : `Import ${parseResult.rowCount} Rows`}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
