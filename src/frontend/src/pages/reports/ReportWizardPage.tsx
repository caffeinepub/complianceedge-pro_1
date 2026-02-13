import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { ArrowLeft, FileText, AlertCircle, Download } from 'lucide-react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { 
  useGetReportTemplates, 
  useGenerateReport,
  useGetAllClients,
  useGetAllTrades,
  useGetMarginSnapshots,
  useGetReconciliationRuns,
  useGetRegulatoryDeadlines
} from '../../hooks/useQueries';
import { exportToCSV } from '../../utils/export';
import { toast } from 'sonner';
import { getReportDataRequirements, generateReportData } from '../../features/reports/reportTemplates';

export default function ReportWizardPage() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { templateId?: string };
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(search.templateId || null);

  const { data: templates = [] } = useGetReportTemplates();
  const { data: clients = [] } = useGetAllClients();
  const { data: trades = [] } = useGetAllTrades();
  const { data: marginSnapshots = [] } = useGetMarginSnapshots();
  const { data: reconciliationRuns = [] } = useGetReconciliationRuns();
  const { data: deadlines = [] } = useGetRegulatoryDeadlines();
  const generateMutation = useGenerateReport();

  const selectedTemplate = templates.find(t => t.id === selectedTemplateId);

  const handleGenerate = async () => {
    if (!selectedTemplate) return;

    const requirements = getReportDataRequirements(selectedTemplate.id);
    const missingData: string[] = [];

    if (requirements.clients && clients.length === 0) missingData.push('clients');
    if (requirements.trades && trades.length === 0) missingData.push('trades');
    if (requirements.marginSnapshots && marginSnapshots.length === 0) missingData.push('margin snapshots');
    if (requirements.reconciliationRuns && reconciliationRuns.length === 0) missingData.push('reconciliation runs');
    if (requirements.deadlines && deadlines.length === 0) missingData.push('regulatory deadlines');

    if (missingData.length > 0) {
      toast.error(`Missing required data: ${missingData.join(', ')}. Please upload the necessary data first.`);
      return;
    }

    try {
      const reportData = generateReportData(selectedTemplate.id, {
        clients,
        trades,
        marginSnapshots,
        reconciliationRuns,
        deadlines,
      });

      await generateMutation.mutateAsync({
        templateId: selectedTemplate.id,
        parameters: JSON.stringify({ timestamp: Date.now() }),
      });

      exportToCSV(reportData, `${selectedTemplate.id}-${Date.now()}.csv`);
      toast.success('Report generated and downloaded successfully');
    } catch (error) {
      toast.error('Failed to generate report');
    }
  };

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
        <CardContent className="space-y-4">
          {templates.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No report templates available
            </div>
          ) : (
            <div className="grid gap-2">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplateId(template.id)}
                  className={`p-4 border rounded-lg text-left transition-colors ${
                    selectedTemplateId === template.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium">{template.name}</div>
                      <div className="text-sm text-muted-foreground mt-1">{template.description}</div>
                    </div>
                    <span className="text-xs px-2 py-1 rounded bg-muted">{template.category}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {selectedTemplate && (
        <Card>
          <CardHeader>
            <CardTitle>Generate Report</CardTitle>
            <CardDescription>{selectedTemplate.name}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <FileText className="h-4 w-4" />
              <AlertDescription>
                This report will be generated using your uploaded data and exported as a CSV file.
              </AlertDescription>
            </Alert>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSelectedTemplateId(null)}>
                Change Template
              </Button>
              <Button onClick={handleGenerate} disabled={generateMutation.isPending}>
                <Download className="h-4 w-4 mr-2" />
                {generateMutation.isPending ? 'Generating...' : 'Generate & Download'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
