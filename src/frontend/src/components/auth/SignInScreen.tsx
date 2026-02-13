import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';
import { useState } from 'react';

export default function SignInScreen() {
  const { login, loginStatus, loginError } = useInternetIdentity();
  const [logoError, setLogoError] = useState(false);

  const isLoggingIn = loginStatus === 'logging-in';

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            {!logoError ? (
              <img 
                src="/assets/generated/complianceedge-pro-logo.dim_512x128.png" 
                alt="ComplianceEdge Pro" 
                className="h-12"
                onError={() => setLogoError(true)}
              />
            ) : (
              <div className="text-2xl font-bold">ComplianceEdge Pro</div>
            )}
          </div>
          <CardTitle className="text-2xl">Welcome to ComplianceEdge Pro</CardTitle>
          <CardDescription>
            Sign in with Internet Identity to access your compliance dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loginError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{loginError.message}</AlertDescription>
            </Alert>
          )}
          
          <Alert>
            <AlertDescription className="text-sm">
              Note: Email features are not available in this version. All notifications and alerts will appear in-app only.
            </AlertDescription>
          </Alert>

          <Button 
            onClick={login} 
            disabled={isLoggingIn}
            className="w-full"
            size="lg"
          >
            {isLoggingIn ? 'Signing in...' : 'Sign in with Internet Identity'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
