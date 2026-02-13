import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { useUpdateRegulatoryDeadlineStatus } from '../../hooks/useQueries';
import { toast } from 'sonner';
import type { RegulatoryDeadline } from '../../backend';

interface DeadlinesListProps {
  deadlines: RegulatoryDeadline[];
}

export default function DeadlinesList({ deadlines }: DeadlinesListProps) {
  const updateStatusMutation = useUpdateRegulatoryDeadlineStatus();

  const sortedDeadlines = [...deadlines].sort((a, b) => Number(a.dueDate - b.dueDate));

  const handleStatusChange = async (deadlineId: bigint, newStatus: string) => {
    try {
      await updateStatusMutation.mutateAsync({ deadlineId, status: newStatus });
      toast.success('Status updated successfully');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  if (deadlines.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No deadlines to display
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="max-h-[600px] overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedDeadlines.map((deadline) => {
              const dueDate = new Date(Number(deadline.dueDate) / 1000000);
              const isOverdue = dueDate < new Date() && deadline.status === 'Pending';

              return (
                <TableRow key={deadline.id.toString()}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{deadline.title}</div>
                      {deadline.description && (
                        <div className="text-sm text-muted-foreground mt-1">{deadline.description}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{deadline.category}</Badge>
                  </TableCell>
                  <TableCell className={isOverdue ? 'text-destructive font-medium' : ''}>
                    {dueDate.toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant={deadline.status === 'Submitted' ? 'default' : isOverdue ? 'destructive' : 'secondary'}>
                      {deadline.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {deadline.status === 'Pending' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusChange(deadline.id, 'Submitted')}
                        disabled={updateStatusMutation.isPending}
                      >
                        Mark Submitted
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
