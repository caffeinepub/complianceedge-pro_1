import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import type { ReconciliationRun, StatementRow } from '../../backend';

interface StatementRowsDialogProps {
  open: boolean;
  onClose: () => void;
  run: ReconciliationRun;
  rows: StatementRow[];
}

export default function StatementRowsDialog({ open, onClose, run, rows }: StatementRowsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Reconciliation Run #{run.runId.toString()}</DialogTitle>
          <DialogDescription>
            Uploaded on {new Date(Number(run.uploadDate) / 1000000).toLocaleString()} • {run.rowCount.toString()} rows
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-auto">
          {rows.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No statement rows available for this run
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.slice(0, 100).map((row, index) => (
                    <TableRow key={index}>
                      <TableCell className="text-sm">
                        {new Date(Number(row.date) / 1000000).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{row.description}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant={row.amount >= 0 ? 'default' : 'destructive'}>
                          ₹{Math.abs(row.amount).toLocaleString()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ₹{row.balance.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          {rows.length > 100 && (
            <p className="text-sm text-muted-foreground text-center mt-4">
              Showing first 100 of {rows.length} rows
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
