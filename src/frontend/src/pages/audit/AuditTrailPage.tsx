import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Search, Download } from 'lucide-react';
import { useGetAuditEntries } from '../../hooks/useQueries';
import BackendErrorBanner from '../../components/common/BackendErrorBanner';
import EmptyState from '../../components/common/EmptyState';
import PermissionGate from '../../components/auth/PermissionGate';

export default function AuditTrailPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: entries, isLoading, error } = useGetAuditEntries();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Audit Trail</h2>
          <p className="text-muted-foreground">Immutable log of all system activities</p>
        </div>
        <PermissionGate capability="export_audit">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </PermissionGate>
      </div>

      {error && <BackendErrorBanner error={error as Error} />}

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by user, module, entity..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading audit entries...</div>
          ) : entries && entries.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entries.map((entry, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-mono text-xs">
                        {new Date(Number(entry.entryTime) / 1000000).toLocaleString()}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {entry.user.toString().slice(0, 8)}...
                      </TableCell>
                      <TableCell className="font-medium">{entry.action}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{entry.details}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <EmptyState
              title="No Audit Entries"
              description="System activities will be logged here automatically. All entries are immutable and cannot be edited or deleted."
              showIllustration={false}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
