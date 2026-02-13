import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Search, FileText, Calendar } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import EmptyState from '../../components/common/EmptyState';
import PermissionGate from '../../components/auth/PermissionGate';
import ReportTemplatesList from '../../components/reports/ReportTemplatesList';
import { useGetReportTemplates } from '../../hooks/useQueries';

export default function ReportLibraryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { data: templates = [], isLoading } = useGetReportTemplates();

  const filteredTemplates = templates.filter(template => {
    const query = searchQuery.toLowerCase();
    return (
      template.name.toLowerCase().includes(query) ||
      template.description.toLowerCase().includes(query) ||
      template.category.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Report Library</h2>
          <p className="text-muted-foreground">Browse and generate compliance reports</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate({ to: '/reports/scheduled' })}>
            <Calendar className="h-4 w-4 mr-2" />
            Scheduled Reports
          </Button>
          <PermissionGate capability="generate_reports">
            <Button onClick={() => navigate({ to: '/reports/wizard' })}>
              <FileText className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </PermissionGate>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search reports by name, regulation, exchange..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading templates...</div>
          ) : templates.length === 0 ? (
            <EmptyState
              title="No Report Templates"
              description="Report templates are not available at this time."
              showIllustration={false}
            />
          ) : filteredTemplates.length === 0 ? (
            <EmptyState
              title="No Results Found"
              description={`No templates match "${searchQuery}". Try a different search term.`}
              showIllustration={false}
            />
          ) : (
            <ReportTemplatesList 
              templates={filteredTemplates} 
              onSelectTemplate={(template) => navigate({ to: '/reports/wizard', search: { templateId: template.id } })}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
