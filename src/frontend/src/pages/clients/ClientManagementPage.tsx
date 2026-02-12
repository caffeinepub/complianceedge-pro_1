import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Plus, Search, Download } from 'lucide-react';
import EmptyState from '../../components/common/EmptyState';
import PermissionGate from '../../components/auth/PermissionGate';
import ClientUpsertModal from '../../components/clients/ClientUpsertModal';

export default function ClientManagementPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Client Management</h2>
          <p className="text-muted-foreground">Manage client records and KYC documents</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <a href="/assets/samples/client-bulk-upload-sample.csv" download>
              <Download className="h-4 w-4 mr-2" />
              Download Sample
            </a>
          </Button>
          <PermissionGate capability="create_clients">
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Client
            </Button>
          </PermissionGate>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by UCC, Name, PAN, Mobile..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <EmptyState
            title="No Clients Found"
            description="Start by adding your first client to the system. Client records include KYC information and documents."
            action={
              <PermissionGate capability="create_clients">
                <Button onClick={() => setShowCreateModal(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Client
                </Button>
              </PermissionGate>
            }
          />
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <p className="text-xs font-medium mb-1">Bulk upload format:</p>
            <p className="text-xs text-muted-foreground">
              ucc, name, pan, mobile, email, address
            </p>
          </div>
        </CardContent>
      </Card>

      {showCreateModal && (
        <ClientUpsertModal
          open={showCreateModal}
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </div>
  );
}
