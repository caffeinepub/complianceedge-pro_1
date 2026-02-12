import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Plus, Calendar as CalendarIcon, List } from 'lucide-react';
import EmptyState from '../../components/common/EmptyState';
import PermissionGate from '../../components/auth/PermissionGate';

export default function RegulatoryCalendarPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Regulatory Calendar</h2>
          <p className="text-muted-foreground">Track compliance deadlines and submissions</p>
        </div>
        <PermissionGate capability="manage_calendar">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Deadline
          </Button>
        </PermissionGate>
      </div>

      <Tabs defaultValue="calendar">
        <TabsList>
          <TabsTrigger value="calendar">
            <CalendarIcon className="h-4 w-4 mr-2" />
            Calendar View
          </TabsTrigger>
          <TabsTrigger value="list">
            <List className="h-4 w-4 mr-2" />
            List View
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Deadlines</CardTitle>
              <CardDescription>Next 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <EmptyState
                title="No Upcoming Deadlines"
                description="Add regulatory deadlines to track compliance submissions. Reminders will appear as in-app alerts."
                showIllustration={false}
                action={
                  <PermissionGate capability="manage_calendar">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Deadline
                    </Button>
                  </PermissionGate>
                }
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>All Deadlines</CardTitle>
              <CardDescription>Sorted by due date</CardDescription>
            </CardHeader>
            <CardContent>
              <EmptyState
                title="No Deadlines"
                description="Your regulatory calendar is empty. Start adding compliance deadlines."
                showIllustration={false}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
