import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import EmptyState from '../../components/common/EmptyState';
import PermissionGate from '../../components/auth/PermissionGate';

export default function ExchangeSettingsPage() {
  const navigate = useNavigate();

  return (
    <PermissionGate capability="manage_config">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/config' })}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Exchange Settings</h2>
            <p className="text-muted-foreground">Configure exchange connections and credentials</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Connected Exchanges</CardTitle>
            <CardDescription>Manage NSE, BSE, MCX, NCDEX configurations</CardDescription>
          </CardHeader>
          <CardContent>
            <EmptyState
              title="Exchange Configuration"
              description="Configure trading member IDs, API credentials, and auto-import settings for each exchange."
              showIllustration={false}
            />
          </CardContent>
        </Card>
      </div>
    </PermissionGate>
  );
}
