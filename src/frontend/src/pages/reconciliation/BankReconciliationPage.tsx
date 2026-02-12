import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Upload, Download } from 'lucide-react';
import EmptyState from '../../components/common/EmptyState';
import PermissionGate from '../../components/auth/PermissionGate';

export default function BankReconciliationPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Bank Reconciliation</h2>
          <p className="text-muted-foreground">Upload and reconcile bank statements</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <a href="/assets/samples/bank-reconciliation-sample.csv" download>
              <Download className="h-4 w-4 mr-2" />
              Download Sample
            </a>
          </Button>
          <PermissionGate capability="manage_reconciliation">
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Upload Statement
            </Button>
          </PermissionGate>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reconciliation Runs</CardTitle>
          <CardDescription>View and manage bank reconciliation runs</CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState
            title="No Reconciliation Runs"
            description="Upload a bank statement to start a new reconciliation run. The system will automatically match transactions."
            action={
              <PermissionGate capability="manage_reconciliation">
                <Button>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload First Statement
                </Button>
              </PermissionGate>
            }
          />
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <p className="text-xs font-medium mb-1">Required columns:</p>
            <p className="text-xs text-muted-foreground">
              date, description, amount, type (credit/debit), reference
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
