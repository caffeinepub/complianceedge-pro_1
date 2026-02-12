import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import EmptyState from '../../components/common/EmptyState';

export default function ReportWizardPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/reports' })}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Report Generation Wizard</h2>
          <p className="text-muted-foreground">Configure and generate compliance reports</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Report Template</CardTitle>
          <CardDescription>Choose a report template to begin</CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState
            title="Report Wizard"
            description="The report generation wizard will guide you through selecting a template, configuring parameters, validating data, and exporting in multiple formats."
            showIllustration={false}
          />
        </CardContent>
      </Card>
    </div>
  );
}
