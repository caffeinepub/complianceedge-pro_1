import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Plus, ArrowLeft } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import EmptyState from '../../components/common/EmptyState';
import PermissionGate from '../../components/auth/PermissionGate';

export default function ScheduledReportsPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/reports' })}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold tracking-tight">Scheduled Reports</h2>
          <p className="text-muted-foreground">Automate report generation</p>
        </div>
        <PermissionGate capability="schedule_reports">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Schedule Report
          </Button>
        </PermissionGate>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Automated Report Schedules</CardTitle>
          <CardDescription>Configure reports to generate automatically</CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState
            title="No Scheduled Reports"
            description="Set up automated report generation to run daily, weekly, monthly, or on custom schedules. Failures will appear as in-app alerts."
            action={
              <PermissionGate capability="schedule_reports">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Schedule
                </Button>
              </PermissionGate>
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}
