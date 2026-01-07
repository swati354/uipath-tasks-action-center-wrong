import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { initializeUiPathSDK, getUiPath } from '@/lib/uipath';
interface UiPathAuthContextType {
  isInitializing: boolean;
  isAuthenticated: boolean;
  error: string | null;
  retry: () => void;
}
const UiPathAuthContext = createContext<UiPathAuthContextType | undefined>(undefined);
interface UiPathAuthProviderProps {
  children: ReactNode;
}
export function UiPathAuthProvider({ children }: UiPathAuthProviderProps) {
  const [isInitializing, setIsInitializing] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const initializeAuth = async () => {
    setIsInitializing(true);
    setError(null);
    try {
      console.log('🔄 Initializing UiPath SDK...');
      await initializeUiPathSDK();
      const uipath = getUiPath();
      const authenticated = uipath.isAuthenticated();
      console.log('✅ UiPath SDK initialized, authenticated:', authenticated);
      setIsAuthenticated(authenticated);
    } catch (err) {
      console.error('❌ UiPath SDK initialization failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to initialize UiPath SDK');
      setIsAuthenticated(false);
    } finally {
      setIsInitializing(false);
    }
  };
  useEffect(() => {
    initializeAuth();
  }, []);
  const retry = () => {
    initializeAuth();
  };
  const value = {
    isInitializing,
    isAuthenticated,
    error,
    retry,
  };
  return (
    <UiPathAuthContext.Provider value={value}>
      {children}
    </UiPathAuthContext.Provider>
  );
}
export function useUiPathAuth() {
  const context = useContext(UiPathAuthContext);
  if (context === undefined) {
    throw new Error('useUiPathAuth must be used within a UiPathAuthProvider');
  }
  return context;
}