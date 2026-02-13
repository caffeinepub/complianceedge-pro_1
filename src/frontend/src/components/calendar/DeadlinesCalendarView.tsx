import { useMemo } from 'react';
import { Badge } from '../ui/badge';
import type { RegulatoryDeadline } from '../../backend';

interface DeadlinesCalendarViewProps {
  deadlines: RegulatoryDeadline[];
}

export default function DeadlinesCalendarView({ deadlines }: DeadlinesCalendarViewProps) {
  const deadlinesByMonth = useMemo(() => {
    const grouped = new Map<string, RegulatoryDeadline[]>();
    
    deadlines.forEach(deadline => {
      const date = new Date(Number(deadline.dueDate) / 1000000);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!grouped.has(monthKey)) {
        grouped.set(monthKey, []);
      }
      grouped.get(monthKey)!.push(deadline);
    });

    return Array.from(grouped.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([monthKey, items]) => ({
        monthKey,
        monthLabel: new Date(monthKey + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'long' }),
        deadlines: items.sort((a, b) => Number(a.dueDate - b.dueDate)),
      }));
  }, [deadlines]);

  if (deadlines.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No deadlines to display
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {deadlinesByMonth.map(({ monthKey, monthLabel, deadlines }) => (
        <div key={monthKey}>
          <h3 className="text-lg font-semibold mb-3">{monthLabel}</h3>
          <div className="space-y-2">
            {deadlines.map(deadline => {
              const dueDate = new Date(Number(deadline.dueDate) / 1000000);
              const isOverdue = dueDate < new Date() && deadline.status === 'Pending';

              return (
                <div
                  key={deadline.id.toString()}
                  className="p-4 border rounded-lg hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`font-medium ${isOverdue ? 'text-destructive' : ''}`}>
                          {dueDate.toLocaleDateString()}
                        </span>
                        <Badge variant="outline" className="text-xs">{deadline.category}</Badge>
                        <Badge variant={deadline.status === 'Submitted' ? 'default' : isOverdue ? 'destructive' : 'secondary'}>
                          {deadline.status}
                        </Badge>
                      </div>
                      <div className="font-medium">{deadline.title}</div>
                      {deadline.description && (
                        <div className="text-sm text-muted-foreground mt-1">{deadline.description}</div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
