import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { FileText } from 'lucide-react';
import type { ReportTemplate } from '../../backend';

interface ReportTemplatesListProps {
  templates: ReportTemplate[];
  onSelectTemplate: (template: ReportTemplate) => void;
}

export default function ReportTemplatesList({ templates, onSelectTemplate }: ReportTemplatesListProps) {
  if (templates.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No report templates to display
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {templates.map((template) => (
        <Card key={template.id} className="hover:border-primary/50 transition-colors">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  {template.name}
                </CardTitle>
                <CardDescription className="mt-1">{template.description}</CardDescription>
              </div>
              <Badge variant="outline">{template.category}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => onSelectTemplate(template)}
            >
              Select Template
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
