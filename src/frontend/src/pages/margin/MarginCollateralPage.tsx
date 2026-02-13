import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Shield, Package, FileText, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert';
import BulkUploadSection from '../../components/bulk-upload/BulkUploadSection';
import CollateralTable from '../../components/margin/CollateralTable';
import EmptyState from '../../components/common/EmptyState';
import { usePermissions } from '../../hooks/usePermissions';
import { 
  useBulkUploadMarginSnapshots, 
  useBulkUploadCollateral,
  useGetMarginSnapshots,
  useGetCollateralRecords
} from '../../hooks/useQueries';
import {
  validateAndConvertMarginSnapshots,
  REQUIRED_COLUMNS as MARGIN_REQUIRED_COLUMNS,
} from '../../features/bulk-upload/marginSnapshotsBulkUpload';
import {
  validateAndConvertCollateral,
  REQUIRED_COLUMNS as COLLATERAL_REQUIRED_COLUMNS,
} from '../../features/bulk-upload/collateralBulkUpload';
import type { BulkUploadConfig } from '../../components/bulk-upload/bulkUploadTypes';
import type { ParsedRow } from '../../utils/bulkUploadFileParsing';
import { toast } from 'sonner';

export default function MarginCollateralPage() {
  const { can } = usePermissions();
  const canManageMargin = can('manage_margin');
  
  const marginUploadMutation = useBulkUploadMarginSnapshots();
  const collateralUploadMutation = useBulkUploadCollateral();
  const { data: marginSnapshots = [], isLoading: marginLoading } = useGetMarginSnapshots();
  const { data: collateralRecords = [], isLoading: collateralLoading } = useGetCollateralRecords();

  const marginUploadConfig: BulkUploadConfig = {
    requiredColumns: MARGIN_REQUIRED_COLUMNS,
    sampleFileUrl: '/assets/samples/margin-snapshot-sample.csv',
    sampleFileName: 'margin-snapshot-sample.csv',
    title: 'Upload Margin Snapshots',
    description: 'Upload daily margin snapshots with available and used margin data',
  };

  const collateralUploadConfig: BulkUploadConfig = {
    requiredColumns: COLLATERAL_REQUIRED_COLUMNS,
    sampleFileUrl: '/assets/samples/collateral-sample.csv',
    sampleFileName: 'collateral-sample.csv',
    title: 'Upload Pledged Securities',
    description: 'Upload collateral records with client, security, quantity, and market value',
  };

  const handleMarginImport = async (rows: ParsedRow[]) => {
    const result = validateAndConvertMarginSnapshots(rows);

    if (!result.valid) {
      const errorMessages = result.errors
        .slice(0, 5)
        .map(e => `Row ${e.rowNumber}: ${e.errors.join(', ')}`)
        .join('\n');
      toast.error(`Validation failed:\n${errorMessages}${result.errors.length > 5 ? '\n...' : ''}`);
      throw new Error('Validation failed');
    }

    await marginUploadMutation.mutateAsync(result.snapshots);
    toast.success(`Successfully imported ${result.snapshots.length} margin snapshots`);
  };

  const handleCollateralImport = async (rows: ParsedRow[]) => {
    const result = validateAndConvertCollateral(rows);

    if (!result.valid) {
      const errorMessages = result.errors
        .slice(0, 5)
        .map(e => `Row ${e.rowNumber}: ${e.errors.join(', ')}`)
        .join('\n');
      toast.error(`Validation failed:\n${errorMessages}${result.errors.length > 5 ? '\n...' : ''}`);
      throw new Error('Validation failed');
    }

    await collateralUploadMutation.mutateAsync(result.collateral);
    toast.success(`Successfully imported ${result.collateral.length} collateral records`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Margin & Collateral</h2>
        <p className="text-muted-foreground">Monitor margin utilization and pledged securities</p>
      </div>

      <Tabs defaultValue="snapshots">
        <TabsList>
          <TabsTrigger value="snapshots">
            <Shield className="h-4 w-4 mr-2" />
            Margin Snapshots
          </TabsTrigger>
          <TabsTrigger value="collateral">
            <Package className="h-4 w-4 mr-2" />
            Pledged Securities
          </TabsTrigger>
          <TabsTrigger value="reports" disabled>
            <FileText className="h-4 w-4 mr-2" />
            Daily Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="snapshots" className="space-y-4">
          {!canManageMargin && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Permission Required</AlertTitle>
              <AlertDescription>
                You do not have permission to upload margin or collateral data. Please contact your administrator to enable the "manage_margin" capability for your role.
              </AlertDescription>
            </Alert>
          )}
          
          <BulkUploadSection
            config={marginUploadConfig}
            onImport={handleMarginImport}
            disabled={!canManageMargin || marginUploadMutation.isPending}
          />

          <Card>
            <CardHeader>
              <CardTitle>Uploaded Margin Snapshots</CardTitle>
              <CardDescription>Historical margin data records</CardDescription>
            </CardHeader>
            <CardContent>
              {marginLoading ? (
                <div className="text-center py-8 text-muted-foreground">Loading snapshots...</div>
              ) : marginSnapshots.length === 0 ? (
                <EmptyState
                  title="No Margin Snapshots"
                  description="Upload margin snapshot data to track margin utilization over time."
                  showIllustration={false}
                />
              ) : (
                <div className="text-sm text-muted-foreground">
                  {marginSnapshots.length} snapshot{marginSnapshots.length !== 1 ? 's' : ''} uploaded. 
                  Latest: {new Date(Number(marginSnapshots[marginSnapshots.length - 1].date) / 1000000).toLocaleDateString()}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="collateral" className="space-y-4">
          {!canManageMargin && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Permission Required</AlertTitle>
              <AlertDescription>
                You do not have permission to upload margin or collateral data. Please contact your administrator to enable the "manage_margin" capability for your role.
              </AlertDescription>
            </Alert>
          )}
          
          <BulkUploadSection
            config={collateralUploadConfig}
            onImport={handleCollateralImport}
            disabled={!canManageMargin || collateralUploadMutation.isPending}
          />

          <Card>
            <CardHeader>
              <CardTitle>Pledged Securities</CardTitle>
              <CardDescription>Collateral records by client</CardDescription>
            </CardHeader>
            <CardContent>
              {collateralLoading ? (
                <div className="text-center py-8 text-muted-foreground">Loading collateral...</div>
              ) : collateralRecords.length === 0 ? (
                <EmptyState
                  title="No Collateral Records"
                  description="Upload pledged securities data to track client collateral positions."
                  showIllustration={false}
                />
              ) : (
                <CollateralTable collateral={collateralRecords} />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Daily Reports</CardTitle>
              <CardDescription>Coming soon</CardDescription>
            </CardHeader>
            <CardContent>
              <EmptyState
                title="Daily Reports"
                description="Automated daily margin and collateral reports will be available soon."
                showIllustration={false}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
