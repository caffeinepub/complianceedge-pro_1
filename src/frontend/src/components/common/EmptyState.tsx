import { Card, CardContent } from '../ui/card';
import { useState } from 'react';

interface EmptyStateProps {
  title: string;
  description: string;
  action?: React.ReactNode;
  showIllustration?: boolean;
}

export default function EmptyState({ title, description, action, showIllustration = true }: EmptyStateProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        {showIllustration && !imageError && (
          <img 
            src="/assets/generated/compliance-dashboard-illustration.dim_1600x900.png" 
            alt="Empty state" 
            className="mb-6 h-48 w-auto opacity-50"
            onError={() => setImageError(true)}
          />
        )}
        <h3 className="mb-2 text-lg font-semibold">{title}</h3>
        <p className="mb-4 text-sm text-muted-foreground max-w-md">{description}</p>
        {action}
      </CardContent>
    </Card>
  );
}
