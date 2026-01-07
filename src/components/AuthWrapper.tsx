import React, { ReactNode } from 'react';
import { useUiPathAuth } from '@/contexts/UiPathAuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
interface AuthWrapperProps {
  children: ReactNode;
}
export function AuthWrapper({ children }: AuthWrapperProps) {
  const { isInitializing, isAuthenticated, error, retry } = useUiPathAuth();
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center space-x-2">
              <Loader2 className="w-6 h-6 animate-spin text-[#FA4616]" />
              <span>Connecting to UiPath</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground">
              Initializing UiPath SDK and authenticating...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center space-x-2 text-destructive">
              <AlertCircle className="w-6 h-6" />
              <span>Authentication Error</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <div className="text-center">
              <Button onClick={retry} className="bg-[#FA4616] hover:bg-[#E55A1B] text-white">
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry Connection
              </Button>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>Make sure you have:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Valid UiPath credentials</li>
                <li>Proper OAuth configuration</li>
                <li>Network access to UiPath Orchestrator</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>UiPath Authentication Required</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-muted-foreground">
              Please authenticate with UiPath Orchestrator to continue.
            </p>
            <Button onClick={retry} className="bg-[#FA4616] hover:bg-[#E55A1B] text-white">
              <RefreshCw className="w-4 h-4 mr-2" />
              Authenticate
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  return <>{children}</>;
}