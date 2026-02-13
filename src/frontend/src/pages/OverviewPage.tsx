import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { usePermissions } from '../hooks/usePermissions';
import { TrendingUp, AlertCircle, FileText, Shield, Upload, Play, BookOpen } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { useGetDashboardMetrics } from '../hooks/useQueries';
import { Skeleton } from '../components/ui/skeleton';

export default function OverviewPage() {
  const { can } = usePermissions();
  const navigate = useNavigate();
  const { data: metrics, isLoading } = useGetDashboardMetrics();

  const totalClients = metrics ? Number(metrics.totalClients) : 0;
  const totalTrades = metrics ? Number(metrics.totalTrades) : 0;
  const latestMarginAvailable = metrics?.latestMarginAvailable ?? 0;
  const latestMarginUsed = metrics?.latestMarginUsed ?? 0;
  const reconciliationRunCount = metrics ? Number(metrics.reconciliationRunCount) : 0;
  const pendingDeadlines = metrics ? Number(metrics.pendingDeadlines) : 0;

  const marginUtilization = latestMarginAvailable > 0 
    ? ((latestMarginUsed / latestMarginAvailable) * 100).toFixed(1)
    : '0.0';

  return (
    <div className="space-y-6">
      {/* How to Use Guide Card */}
      <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <BookOpen className="h-5 w-5 text-primary" />
            How to Use This Platform
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            New to ComplianceEdge Pro? Learn how to import trades, manage clients, record margin snapshots, 
            generate reports, and more with our comprehensive guide.
          </p>
          <Button onClick={() => navigate({ to: '/how-to-use' })}>
            <BookOpen className="h-4 w-4 mr-2" />
            View Complete Guide
          </Button>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{totalClients}</div>
                <p className="text-xs text-muted-foreground">
                  {totalClients === 0 ? 'No clients uploaded yet' : 'Active client accounts'}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Trades</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{totalTrades}</div>
                <p className="text-xs text-muted-foreground">
                  {totalTrades === 0 ? 'No trades imported yet' : 'Imported trade records'}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Margin Status</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {latestMarginAvailable === 0 ? (
                    <span className="text-muted-foreground">-</span>
                  ) : (
                    <span className={parseFloat(marginUtilization) > 90 ? 'text-destructive' : 'text-green-600'}>
                      {marginUtilization}%
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {latestMarginAvailable === 0 ? (
                    'No margin snapshots uploaded'
                  ) : (
                    `Used: ₹${(latestMarginUsed / 10000000).toFixed(2)}Cr / ₹${(latestMarginAvailable / 10000000).toFixed(2)}Cr`
                  )}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Deadlines</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">{pendingDeadlines}</div>
                <p className="text-xs text-muted-foreground">
                  {reconciliationRunCount} reconciliation {reconciliationRunCount === 1 ? 'run' : 'runs'} completed
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">System Alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {latestMarginAvailable > 0 && parseFloat(marginUtilization) > 90 ? (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
                <div className="flex-1 text-sm">
                  <p className="font-medium">High margin utilization detected</p>
                  <p className="text-xs text-muted-foreground">Current utilization: {marginUtilization}%</p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted">
                <Shield className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div className="flex-1 text-sm">
                  <p className="font-medium">No critical alerts</p>
                  <p className="text-xs text-muted-foreground">All systems operating normally</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Surveillance Alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted">
              <Shield className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="flex-1 text-sm">
                <p className="font-medium">No surveillance alerts</p>
                <p className="text-xs text-muted-foreground">Pattern detection active</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      {can('create_trades') && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Button 
                variant="outline" 
                className="h-auto flex-col items-start p-4 gap-2"
                onClick={() => navigate({ to: '/data-entry/trade-import' })}
              >
                <Upload className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Import Trades</div>
                  <div className="text-xs text-muted-foreground">Upload trade files</div>
                </div>
              </Button>

              <Button 
                variant="outline" 
                className="h-auto flex-col items-start p-4 gap-2"
                onClick={() => navigate({ to: '/reports' })}
              >
                <FileText className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Generate Reports</div>
                  <div className="text-xs text-muted-foreground">Create compliance reports</div>
                </div>
              </Button>

              <Button 
                variant="outline" 
                className="h-auto flex-col items-start p-4 gap-2"
                onClick={() => navigate({ to: '/margin' })}
              >
                <Shield className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Margin Check</div>
                  <div className="text-xs text-muted-foreground">Validate activities</div>
                </div>
              </Button>

              <Button 
                variant="outline" 
                className="h-auto flex-col items-start p-4 gap-2"
                disabled
              >
                <Play className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Run EOD Process</div>
                  <div className="text-xs text-muted-foreground">Coming soon</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
