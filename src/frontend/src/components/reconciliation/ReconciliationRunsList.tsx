import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Eye } from 'lucide-react';
import type { ReconciliationRun } from '../../backend';

interface ReconciliationRunsListProps {
  runs: ReconciliationRun[];
  onViewRun: (run: ReconciliationRun) => void;
}

export default function ReconciliationRunsList({ runs, onViewRun }: ReconciliationRunsListProps) {
  if (runs.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No reconciliation runs to display
      </div>
    );
  }

  const sortedRuns = [...runs].sort((a, b) => Number(b.uploadDate - a.uploadDate));

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="max-h-[600px] overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Run ID</TableHead>
              <TableHead>Upload Date</TableHead>
              <TableHead>Row Count</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedRuns.map((run) => (
              <TableRow key={run.runId.toString()}>
                <TableCell>
                  <Badge variant="outline">#{run.runId.toString()}</Badge>
                </TableCell>
                <TableCell className="text-sm">
                  {new Date(Number(run.uploadDate) / 1000000).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{run.rowCount.toString()}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={run.status === 'Completed' ? 'default' : 'secondary'}>
                    {run.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewRun(run)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
