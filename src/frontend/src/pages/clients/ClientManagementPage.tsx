import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Plus, Search, Upload, Users } from 'lucide-react';
import EmptyState from '../../components/common/EmptyState';
import PermissionGate from '../../components/auth/PermissionGate';
import ClientUpsertModal from '../../components/clients/ClientUpsertModal';
import BulkUploadSection from '../../components/bulk-upload/BulkUploadSection';
import ClientsTable from '../../components/clients/ClientsTable';
import { useBulkUploadClients, useGetAllClients } from '../../hooks/useQueries';
import {
  validateAndConvertClients,
  REQUIRED_COLUMNS,
} from '../../features/bulk-upload/clientBulkUpload';
import type { BulkUploadConfig } from '../../components/bulk-upload/bulkUploadTypes';
import type { ParsedRow } from '../../utils/bulkUploadFileParsing';
import { toast } from 'sonner';

export default function ClientManagementPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const bulkUploadMutation = useBulkUploadClients();
  const { data: clients = [], isLoading } = useGetAllClients();

  const bulkUploadConfig: BulkUploadConfig = {
    requiredColumns: REQUIRED_COLUMNS,
    sampleFileUrl: '/assets/samples/client-bulk-upload-sample.csv',
    sampleFileName: 'client-bulk-upload-sample.csv',
    title: 'Bulk Upload Clients',
    description: 'Upload multiple client records at once using a CSV file',
  };

  const handleBulkImport = async (rows: ParsedRow[]) => {
    const result = validateAndConvertClients(rows);

    if (!result.valid) {
      const errorMessage = result.errors
        .map((err) => `Row ${err.rowNumber}: ${err.errors.join(', ')}`)
        .join('\n');
      throw new Error(`Validation failed:\n${errorMessage}`);
    }

    await bulkUploadMutation.mutateAsync(result.clients);
  };

  const filteredClients = clients.filter((client) => {
    const query = searchQuery.toLowerCase();
    return (
      client.name.toLowerCase().includes(query) ||
      client.pan.toLowerCase().includes(query) ||
      client.address.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Client Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage client KYC records and documentation
          </p>
        </div>
        <PermissionGate capability="create_clients">
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Client
          </Button>
        </PermissionGate>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">
            <Users className="h-4 w-4 mr-2" />
            All Clients
          </TabsTrigger>
          <TabsTrigger value="upload">
            <Upload className="h-4 w-4 mr-2" />
            Upload & Actions
          </TabsTrigger>
        </TabsList>

        {/* All Clients Tab */}
        <TabsContent value="all" className="space-y-4">
          {/* Search */}
          <Card>
            <CardHeader>
              <CardTitle>Search Clients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, PAN, or address..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </CardContent>
          </Card>

          {/* Clients Table */}
          {isLoading ? (
            <Card>
              <CardContent className="py-8">
                <div className="text-center text-muted-foreground">Loading clients...</div>
              </CardContent>
            </Card>
          ) : filteredClients.length === 0 ? (
            <EmptyState
              title={searchQuery ? 'No clients found' : 'No clients yet'}
              description={
                searchQuery
                  ? 'Try adjusting your search query'
                  : 'Get started by adding your first client'
              }
              action={
                !searchQuery && (
                  <PermissionGate capability="create_clients">
                    <Button onClick={() => setShowCreateModal(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Client
                    </Button>
                  </PermissionGate>
                )
              }
            />
          ) : (
            <ClientsTable clients={filteredClients} />
          )}
        </TabsContent>

        {/* Upload & Actions Tab */}
        <TabsContent value="upload" className="space-y-4">
          <PermissionGate capability="create_clients">
            <BulkUploadSection config={bulkUploadConfig} onImport={handleBulkImport} />
          </PermissionGate>
        </TabsContent>
      </Tabs>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <ClientUpsertModal
          open={showCreateModal}
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </div>
  );
}
