import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { AlertCircle, Shield } from 'lucide-react';
import EmptyState from '../../components/common/EmptyState';

export default function SurveillanceAlertsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Surveillance Alerts</h2>
        <p className="text-muted-foreground">Monitor and investigate trading patterns</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">12 critical, 23 medium, 12 low</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Under Investigation</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Assigned to compliance team</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved (30d)</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">124</div>
            <p className="text-xs text-muted-foreground">89 false positives</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Alerts</TabsTrigger>
          <TabsTrigger value="wash">Wash Trading</TabsTrigger>
          <TabsTrigger value="front">Front Running</TabsTrigger>
          <TabsTrigger value="aml">PMLA/AML</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>Alert Queue</CardTitle>
              <CardDescription>All surveillance alerts requiring review</CardDescription>
            </CardHeader>
            <CardContent>
              <EmptyState
                title="No Active Alerts"
                description="Surveillance alerts will appear here when suspicious patterns are detected."
                showIllustration={false}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wash">
          <EmptyState
            title="No Wash Trading Alerts"
            description="Alerts for potential wash trading patterns will appear here."
            showIllustration={false}
          />
        </TabsContent>

        <TabsContent value="front">
          <EmptyState
            title="No Front Running Alerts"
            description="Alerts for potential front running will appear here."
            showIllustration={false}
          />
        </TabsContent>

        <TabsContent value="aml">
          <EmptyState
            title="No AML Alerts"
            description="PMLA/AML compliance alerts will appear here."
            showIllustration={false}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
