import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import type { CollateralRecord } from '../../backend';

interface CollateralTableProps {
  collateral: CollateralRecord[];
}

export default function CollateralTable({ collateral }: CollateralTableProps) {
  if (collateral.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No collateral records to display
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="max-h-[600px] overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client ID</TableHead>
              <TableHead>Security</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead className="text-right">Market Value</TableHead>
              <TableHead>Pledge Date</TableHead>
              <TableHead>Recorded</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {collateral.map((record, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Badge variant="outline">{record.clientId.toString()}</Badge>
                </TableCell>
                <TableCell className="font-medium">{record.securityName}</TableCell>
                <TableCell className="text-right">{record.quantity.toString()}</TableCell>
                <TableCell className="text-right">₹{record.marketValue.toLocaleString()}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(Number(record.pledgeDate) / 1000000).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(Number(record.recordedAt) / 1000000).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
