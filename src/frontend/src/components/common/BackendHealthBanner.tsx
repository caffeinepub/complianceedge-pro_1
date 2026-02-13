import { Alert, AlertDescription } from '../ui/alert';
import { Button } from '../ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface BackendHealthBannerProps {
  onRetry: () => void;
  isRetrying: boolean;
}

export default function BackendHealthBanner({ onRetry, isRetrying }: BackendHealthBannerProps) {
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <span>
          Unable to connect to the backend service. Please check your connection and try again.
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          disabled={isRetrying}
          className="ml-4 shrink-0"
        >
          <RefreshCw className={`mr-2 h-3 w-3 ${isRetrying ? 'animate-spin' : ''}`} />
          {isRetrying ? 'Retrying...' : 'Retry'}
        </Button>
      </AlertDescription>
    </Alert>
  );
}
