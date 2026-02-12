import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Button } from '../../components/ui/button';
import { TrendingUp, Shield, FileText, Download } from 'lucide-react';
import EmptyState from '../../components/common/EmptyState';
import PermissionGate from '../../components/auth/PermissionGate';
import { useGetMarginSnapshots } from '../../hooks/useQueries';

export default function MarginCollateralPage() {
  const { data: snapshots, isLoading } = useGetMarginSnapshots();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Margin & Collateral</h2>
          <p className="text-muted-foreground">Monitor margin utilization and collateral</p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <a href="/assets/samples/margin-snapshot-sample.csv" download>
            <Download className="h-4 w-4 mr-2" />
            Download Sample
          </a>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Margin</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹124.7 Cr</div>
            <p className="text-xs text-muted-foreground">Cash: ₹87.3 Cr | Collateral: ₹37.4 Cr</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Peak Margin</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">98.4%</div>
            <p className="text-xs text-muted-foreground">Latest snapshot (3:30 PM)</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Margin Calls</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">34</div>
            <p className="text-xs text-muted-foreground">Total shortfall: ₹12.4L</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="snapshots">
        <TabsList>
          <TabsTrigger value="snapshots">Margin Snapshots</TabsTrigger>
          <TabsTrigger value="collateral">Pledged Securities</TabsTrigger>
          <TabsTrigger value="reports">Daily Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="snapshots">
          <Card>
            <CardHeader>
              <CardTitle>Peak Margin Snapshots</CardTitle>
              <CardDescription>View and record margin snapshots</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">Loading...</div>
              ) : snapshots && snapshots.length > 0 ? (
                <div className="text-sm">Found {snapshots.length} snapshots</div>
              ) : (
                <EmptyState
                  title="No Snapshots Recorded"
                  description="Start recording peak margin snapshots to track compliance."
                  showIllustration={false}
                />
              )}
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <p className="text-xs font-medium mb-1">Required columns:</p>
                <p className="text-xs text-muted-foreground">
                  client_code, snapshot_id, required_margin, available_margin, shortfall, exchange
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="collateral">
          <EmptyState
            title="No Pledged Securities"
            description="Pledged securities and collateral tracking will appear here."
            showIllustration={false}
          />
        </TabsContent>

        <TabsContent value="reports">
          <EmptyState
            title="No Daily Reports"
            description="Daily margin reports will be generated and listed here."
            showIllustration={false}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
