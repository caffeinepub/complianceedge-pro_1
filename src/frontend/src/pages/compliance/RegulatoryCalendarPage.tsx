import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Plus, Calendar as CalendarIcon, List } from 'lucide-react';
import EmptyState from '../../components/common/EmptyState';
import PermissionGate from '../../components/auth/PermissionGate';
import AddDeadlineDialog from '../../components/calendar/AddDeadlineDialog';
import DeadlinesList from '../../components/calendar/DeadlinesList';
import DeadlinesCalendarView from '../../components/calendar/DeadlinesCalendarView';
import { useGetRegulatoryDeadlines } from '../../hooks/useQueries';

export default function RegulatoryCalendarPage() {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { data: deadlines = [], isLoading } = useGetRegulatoryDeadlines();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Regulatory Calendar</h2>
          <p className="text-muted-foreground">Track compliance deadlines and submissions</p>
        </div>
        <PermissionGate capability="manage_calendar">
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Deadline
          </Button>
        </PermissionGate>
      </div>

      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">
            <List className="h-4 w-4 mr-2" />
            List View
          </TabsTrigger>
          <TabsTrigger value="calendar">
            <CalendarIcon className="h-4 w-4 mr-2" />
            Calendar View
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>All Deadlines</CardTitle>
              <CardDescription>Sorted by due date</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">Loading deadlines...</div>
              ) : deadlines.length === 0 ? (
                <EmptyState
                  title="No Deadlines"
                  description="Your regulatory calendar is empty. Start adding compliance deadlines."
                  showIllustration={false}
                  action={
                    <PermissionGate capability="manage_calendar">
                      <Button onClick={() => setShowAddDialog(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add First Deadline
                      </Button>
                    </PermissionGate>
                  }
                />
              ) : (
                <DeadlinesList deadlines={deadlines} />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle>Calendar View</CardTitle>
              <CardDescription>Deadlines by month</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">Loading calendar...</div>
              ) : deadlines.length === 0 ? (
                <EmptyState
                  title="No Deadlines"
                  description="Add regulatory deadlines to see them on the calendar."
                  showIllustration={false}
                />
              ) : (
                <DeadlinesCalendarView deadlines={deadlines} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {showAddDialog && (
        <AddDeadlineDialog
          open={showAddDialog}
          onClose={() => setShowAddDialog(false)}
        />
      )}
    </div>
  );
}
