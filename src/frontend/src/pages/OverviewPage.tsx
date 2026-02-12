import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { usePermissions } from '../hooks/usePermissions';
import { TrendingUp, AlertCircle, FileText, Shield, Upload, Play, BookOpen } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

export default function OverviewPage() {
  const { can } = usePermissions();
  const navigate = useNavigate();

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
            <CardTitle className="text-sm font-medium">Compliance Health</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">94/100</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +3 vs last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Actions</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">3 reports due this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Turnover</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹1,247 Cr</div>
            <p className="text-xs text-muted-foreground">NSE: ₹840 Cr | BSE: ₹100 Cr</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Margin Status</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">98.2%</div>
            <p className="text-xs text-muted-foreground">
              <Badge variant="outline" className="text-xs">All snapshots compliant</Badge>
            </p>
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
            <div className="flex items-start gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
              <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
              <div className="flex-1 text-sm">
                <p className="font-medium">Peak margin shortfall detected</p>
                <p className="text-xs text-muted-foreground">Client ABC123 (Snapshot 3)</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
              <div className="flex-1 text-sm">
                <p className="font-medium">127 clients approaching margin call</p>
                <p className="text-xs text-muted-foreground">Review required</p>
              </div>
            </div>
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
                <p className="font-medium">Possible wash trade pattern</p>
                <p className="text-xs text-muted-foreground">Client XYZ789 (5 instances today)</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted">
              <Shield className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div className="flex-1 text-sm">
                <p className="font-medium">High-value transaction</p>
                <p className="text-xs text-muted-foreground">₹45L cash deposit by Client DEF456</p>
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
                  <div className="text-xs text-muted-foreground">5 reports ready</div>
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
                  <div className="text-xs text-muted-foreground">Settlement & P&L</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
