import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { AlertCircle } from 'lucide-react';

interface BackendErrorBannerProps {
  error: Error | null;
  title?: string;
}

export default function BackendErrorBanner({ error, title = 'Error' }: BackendErrorBannerProps) {
  if (!error) return null;

  const isAuthError = error.message.includes('Unauthorized') || error.message.includes('permission');

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{isAuthError ? 'Access Denied' : title}</AlertTitle>
      <AlertDescription>{error.message}</AlertDescription>
    </Alert>
  );
}
