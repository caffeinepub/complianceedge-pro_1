import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert';
import { Upload, FileText, Edit, Download, CheckCircle2, AlertCircle, Loader2, X } from 'lucide-react';
import EmptyState from '../../components/common/EmptyState';
import PermissionGate from '../../components/auth/PermissionGate';
import ManualTradeEntryPanel from './components/ManualTradeEntryPanel';
import { parseTradeFile } from './tradeImport/tradeImportParsing';
import { validateAndConvertTrades } from './tradeImport/tradeImportValidation';
import { useImportTrades, useGetAllTrades } from '../../hooks/useQueries';
import { downloadSampleFile } from '../../utils/sampleDownloads';
import { toast } from 'sonner';

export default function TradeImportPage() {
  const [activeTab, setActiveTab] = useState('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const importMutation = useImportTrades();
  const { data: allTrades = [], isLoading: tradesLoading } = useGetAllTrades();

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setValidationErrors([]);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setValidationErrors([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDownloadSample = async () => {
    setIsDownloading(true);
    try {
      await downloadSampleFile(
        '/assets/samples/trade-import-sample.csv',
        'trade-import-sample.csv'
      );
      toast.success('Sample file downloaded successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to download sample file';
      toast.error(message);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setValidationErrors([]);

    try {
      // Parse file
      const parseResult = await parseTradeFile(selectedFile);
      
      if (!parseResult.success || !parseResult.data) {
        setValidationErrors([parseResult.error || 'Failed to parse file']);
        setIsProcessing(false);
        return;
      }

      // Validate and convert
      const validationResult = validateAndConvertTrades(parseResult.data);
      
      if (!validationResult.valid || !validationResult.trades) {
        setValidationErrors(validationResult.errors || ['Validation failed']);
        setIsProcessing(false);
        return;
      }

      // Import trades
      await importMutation.mutateAsync(validationResult.trades);
      
      // Success
      toast.success(`Successfully imported ${validationResult.trades.length} trades`);
      setSelectedFile(null);
      setValidationErrors([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Switch to history tab
      setActiveTab('history');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to import trades';
      setValidationErrors([errorMessage]);
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const isUploading = isProcessing || importMutation.isPending;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Trade Import</h2>
        <p className="text-muted-foreground">Import trades from files or enter manually</p>
      </div>

      <PermissionGate capability="create_trades">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="upload">
              <Upload className="h-4 w-4 mr-2" />
              Upload File
            </TabsTrigger>
            <TabsTrigger value="manual">
              <Edit className="h-4 w-4 mr-2" />
              Manual Entry
            </TabsTrigger>
            <TabsTrigger value="history">
              <FileText className="h-4 w-4 mr-2" />
              Import History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Upload Trade File</CardTitle>
                    <CardDescription>
                      Upload CSV files containing trade data
                    </CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleDownloadSample}
                    disabled={isDownloading}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {isDownloading ? 'Downloading...' : 'Download Sample'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* File Upload Area */}
                <div className="border-2 border-dashed rounded-lg p-12 text-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  
                  {!selectedFile ? (
                    <>
                      <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-sm font-medium mb-2">Select a file to upload</p>
                      <p className="text-xs text-muted-foreground mb-4">
                        Supported format: CSV
                      </p>
                      <Button onClick={handleBrowseClick} disabled={isUploading}>
                        Browse Files
                      </Button>
                    </>
                  ) : (
                    <>
                      <FileText className="h-12 w-12 mx-auto mb-4 text-primary" />
                      <p className="text-sm font-medium mb-2">{selectedFile.name}</p>
                      <p className="text-xs text-muted-foreground mb-4">
                        {(selectedFile.size / 1024).toFixed(2)} KB
                      </p>
                      <div className="flex gap-2 justify-center">
                        <Button onClick={handleUpload} disabled={isUploading}>
                          {isUploading ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <Upload className="h-4 w-4 mr-2" />
                              Upload & Import
                            </>
                          )}
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={handleRemoveFile}
                          disabled={isUploading}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Remove
                        </Button>
                      </div>
                    </>
                  )}
                </div>

                {/* Validation Errors */}
                {validationErrors.length > 0 && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Validation Errors</AlertTitle>
                    <AlertDescription>
                      <ul className="list-disc list-inside space-y-1 mt-2">
                        {validationErrors.map((error, index) => (
                          <li key={index} className="text-sm">{error}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}

                {/* Required Columns Info */}
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-xs font-medium mb-1">Required columns:</p>
                  <p className="text-xs text-muted-foreground">
                    client_code, trade_date, exchange, segment, security, side, quantity, price, order_id, trade_id
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manual">
            <ManualTradeEntryPanel />
          </TabsContent>

          <TabsContent value="history">
            {tradesLoading ? (
              <Card>
                <CardContent className="py-12">
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            ) : allTrades.length === 0 ? (
              <EmptyState
                title="No Import History"
                description="Your trade import history will appear here once you start importing trades."
              />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Import History</CardTitle>
                  <CardDescription>
                    {allTrades.length} trade{allTrades.length !== 1 ? 's' : ''} imported
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Client Code</TableHead>
                          <TableHead>Trade Date</TableHead>
                          <TableHead>Exchange</TableHead>
                          <TableHead>Segment</TableHead>
                          <TableHead>Security</TableHead>
                          <TableHead>Side</TableHead>
                          <TableHead className="text-right">Quantity</TableHead>
                          <TableHead className="text-right">Price</TableHead>
                          <TableHead>Order ID</TableHead>
                          <TableHead>Trade ID</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {allTrades.map((trade, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{trade.client_code}</TableCell>
                            <TableCell>{trade.trade_date}</TableCell>
                            <TableCell>{trade.exchange}</TableCell>
                            <TableCell>{trade.segment}</TableCell>
                            <TableCell>{trade.security}</TableCell>
                            <TableCell>
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                trade.side === 'BUY' 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                  : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                              }`}>
                                {trade.side}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">{trade.quantity.toString()}</TableCell>
                            <TableCell className="text-right">₹{trade.price.toFixed(2)}</TableCell>
                            <TableCell className="font-mono text-xs">{trade.order_id}</TableCell>
                            <TableCell className="font-mono text-xs">{trade.trade_id}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </PermissionGate>
    </div>
  );
}
