import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Settings, Users, Link as LinkIcon } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import PermissionGate from '../../components/auth/PermissionGate';

export default function ConfigurationHomePage() {
  const navigate = useNavigate();

  return (
    <PermissionGate capability="manage_config" fallback={
      <div className="text-center py-12">
        <p className="text-muted-foreground">You don't have permission to access configuration settings.</p>
      </div>
    }>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Configuration</h2>
          <p className="text-muted-foreground">Manage system settings and integrations</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="cursor-pointer hover:bg-accent transition-colors" onClick={() => navigate({ to: '/config/exchanges' })}>
            <CardHeader>
              <Settings className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Exchange Settings</CardTitle>
              <CardDescription>Configure NSE, BSE, MCX, NCDEX connections</CardDescription>
            </CardHeader>
          </Card>

          <Card className="cursor-pointer hover:bg-accent transition-colors" onClick={() => navigate({ to: '/config/users' })}>
            <CardHeader>
              <Users className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage users and role assignments</CardDescription>
            </CardHeader>
          </Card>

          <Card className="cursor-pointer hover:bg-accent transition-colors" onClick={() => navigate({ to: '/config/integrations' })}>
            <CardHeader>
              <LinkIcon className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>API Integrations</CardTitle>
              <CardDescription>Configure external system integrations</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </PermissionGate>
  );
}
