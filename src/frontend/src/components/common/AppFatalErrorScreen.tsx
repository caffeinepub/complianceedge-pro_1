import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';

interface AppFatalErrorScreenProps {
  title: string;
  message: string;
  error?: Error | null;
  onReload: () => void;
}

export default function AppFatalErrorScreen({ title, message, error, onReload }: AppFatalErrorScreenProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-destructive/10 p-3">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
          </div>
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription className="text-xs font-mono break-all">
                {error.message}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              If this problem persists, please try:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              <li>Clearing your browser cache</li>
              <li>Using a different browser</li>
              <li>Contacting support if the issue continues</li>
            </ul>
          </div>

          <Button onClick={onReload} className="w-full" size="lg">
            <RefreshCw className="mr-2 h-4 w-4" />
            Reload Page
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
