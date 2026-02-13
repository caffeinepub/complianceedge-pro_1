import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Button } from '../ui/button';
import { AlertTriangle } from 'lucide-react';

interface AdminEmailMismatchBannerProps {
  savedEmail: string;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export default function AdminEmailMismatchBanner({ 
  savedEmail, 
  onRefresh,
  isRefreshing 
}: AdminEmailMismatchBannerProps) {
  const ADMIN_EMAIL = 'sanjeev.vohra@gmail.com';

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Admin Access Not Granted</AlertTitle>
      <AlertDescription className="mt-2 space-y-2">
        <p>
          Your profile email <strong>{savedEmail}</strong> does not match the configured admin email <strong>{ADMIN_EMAIL}</strong>.
        </p>
        <p className="text-sm">
          To receive Super Admin access, please update your profile email to <strong>{ADMIN_EMAIL}</strong> and save. 
          Then use the "Refresh Profile" action in the user menu to reload your permissions.
        </p>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRefresh}
          disabled={isRefreshing}
          className="mt-2"
        >
          {isRefreshing ? 'Refreshing...' : 'Refresh Profile Now'}
        </Button>
      </AlertDescription>
    </Alert>
  );
}
