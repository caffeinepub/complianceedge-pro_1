import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import type { KycDocument } from '../../backend';

interface ClientsTableProps {
  clients: KycDocument[];
}

export default function ClientsTable({ clients }: ClientsTableProps) {
  if (clients.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No clients to display
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="max-h-[600px] overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>PAN</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Documents</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{client.name}</TableCell>
                <TableCell>
                  <Badge variant="outline">{client.pan}</Badge>
                </TableCell>
                <TableCell className="max-w-xs truncate">{client.address}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{client.documents.length}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {new Date(Number(client.createdAt) / 1000000).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
