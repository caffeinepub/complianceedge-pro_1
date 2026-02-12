import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { AlertCircle } from 'lucide-react';
import EmptyState from '../../components/common/EmptyState';
import PermissionGate from '../../components/auth/PermissionGate';

export default function IntegrationsPage() {
  const navigate = useNavigate();

  return (
    <PermissionGate capability="manage_config">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/config' })}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">API Integrations</h2>
            <p className="text-muted-foreground">Configure external system connections</p>
          </div>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Note: Email integrations are not available. All notifications are in-app only.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle>Available Integrations</CardTitle>
            <CardDescription>KRA, Depositories, Accounting systems</CardDescription>
          </CardHeader>
          <CardContent>
            <EmptyState
              title="Integration Configuration"
              description="Configure connections to KRA (CVL, CAMS, NDML), depositories (NSDL, CDSL), and accounting systems. Email integrations are excluded."
              showIllustration={false}
            />
          </CardContent>
        </Card>
      </div>
    </PermissionGate>
  );
}
