import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { ArrowLeft, Plus } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import EmptyState from '../common/EmptyState';
import PermissionGate from '../auth/PermissionGate';

export default function UserManagementPage() {
  const navigate = useNavigate();

  return (
    <PermissionGate capability="manage_users">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/config' })}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h2 className="text-2xl font-bold tracking-tight">User Management</h2>
            <p className="text-muted-foreground">Manage users and role assignments</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Invite User
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>System Users</CardTitle>
            <CardDescription>View and manage user accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <EmptyState
              title="User Management"
              description="Super Admin can create users, assign roles (one per user), and manage permissions. Role-based access control is enforced throughout the application."
              showIllustration={false}
            />
          </CardContent>
        </Card>
      </div>
    </PermissionGate>
  );
}
