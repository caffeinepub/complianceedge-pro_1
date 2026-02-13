import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import BulkUploadSection from '../../components/bulk-upload/BulkUploadSection';
import ReconciliationRunsList from '../../components/reconciliation/ReconciliationRunsList';
import StatementRowsDialog from '../../components/reconciliation/StatementRowsDialog';
import PermissionGate from '../../components/auth/PermissionGate';
import BackendErrorBanner from '../../components/common/BackendErrorBanner';
import EmptyState from '../../components/common/EmptyState';
import { 
  useBulkUploadStatementRows,
  useGetReconciliationRuns,
  useGetStatementRows
} from '../../hooks/useQueries';
import {
  validateAndConvertStatementRows,
  REQUIRED_COLUMNS,
} from '../../features/bulk-upload/reconciliationBulkUpload';
import type { BulkUploadConfig } from '../../components/bulk-upload/bulkUploadTypes';
import type { ParsedRow } from '../../utils/bulkUploadFileParsing';
import { toast } from 'sonner';
import type { ReconciliationRun } from '../../backend';

export default function BankReconciliationPage() {
  const [selectedRun, setSelectedRun] = useState<ReconciliationRun | null>(null);
  const [showRowsDialog, setShowRowsDialog] = useState(false);

  const uploadMutation = useBulkUploadStatementRows();
  const { data: runs = [], isLoading: runsLoading, error: runsError } = useGetReconciliationRuns();
  const { data: statementRows = [] } = useGetStatementRows();

  const bulkUploadConfig: BulkUploadConfig = {
    requiredColumns: REQUIRED_COLUMNS,
    sampleFileUrl: '/assets/samples/bank-reconciliation-sample.csv',
    sampleFileName: 'bank-reconciliation-sample.csv',
    title: 'Upload Bank Statement',
    description: 'Upload bank statement rows for reconciliation',
  };

  const handleBulkImport = async (rows: ParsedRow[]) => {
    const result = validateAndConvertStatementRows(rows);

    if (!result.valid) {
      const errorMessages = result.errors
        .slice(0, 5)
        .map(e => `Row ${e.rowNumber}: ${e.errors.join(', ')}`)
        .join('\n');
      toast.error(`Validation failed:\n${errorMessages}${result.errors.length > 5 ? '\n...' : ''}`);
      throw new Error('Validation failed');
    }

    await uploadMutation.mutateAsync(result.rows);
    toast.success(`Successfully imported ${result.rows.length} statement rows`);
  };

  const handleViewRun = (run: ReconciliationRun) => {
    setSelectedRun(run);
    setShowRowsDialog(true);
  };

  if (runsError) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Bank Reconciliation</h2>
          <p className="text-muted-foreground">Upload and reconcile bank statements</p>
        </div>
        <BackendErrorBanner error={runsError} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Bank Reconciliation</h2>
        <p className="text-muted-foreground">Upload and reconcile bank statements</p>
      </div>

      <PermissionGate capability="manage_reconciliation">
        <BulkUploadSection
          config={bulkUploadConfig}
          onImport={handleBulkImport}
          disabled={uploadMutation.isPending}
        />
      </PermissionGate>

      <Card>
        <CardHeader>
          <CardTitle>Reconciliation Runs</CardTitle>
          <CardDescription>History of uploaded bank statements</CardDescription>
        </CardHeader>
        <CardContent>
          {runsLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading reconciliation runs...</div>
          ) : runs.length === 0 ? (
            <EmptyState
              title="No Reconciliation Runs"
              description="Upload a bank statement to create your first reconciliation run."
              showIllustration={false}
            />
          ) : (
            <ReconciliationRunsList runs={runs} onViewRun={handleViewRun} />
          )}
        </CardContent>
      </Card>

      {showRowsDialog && selectedRun && (
        <StatementRowsDialog
          open={showRowsDialog}
          onClose={() => {
            setShowRowsDialog(false);
            setSelectedRun(null);
          }}
          run={selectedRun}
          rows={statementRows}
        />
      )}
    </div>
  );
}
