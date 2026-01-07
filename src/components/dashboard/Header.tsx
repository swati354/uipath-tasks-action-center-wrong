import React from 'react';
import { Activity, Wifi, WifiOff } from 'lucide-react';
import { FolderSelector } from './FolderSelector';
import { Badge } from '@/components/ui/badge';
import { useUiPathAuth } from '@/contexts/UiPathAuthContext';
export function Header() {
  const { isAuthenticated } = useUiPathAuth();
  return (
    <header className="border-b bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#FA4616] rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  UiPath Orchestrator Control Center
                </h1>
                <p className="text-sm text-muted-foreground">
                  Monitor and manage your automation processes
                </p>
              </div>
            </div>
          </div>
          {/* Connection Status and Folder Selector */}
          <div className="flex items-center space-x-4">
            <FolderSelector />
            <div className="flex items-center space-x-2">
              {isAuthenticated ? (
                <>
                  <Wifi className="w-4 h-4 text-green-600" />
                  <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                    Connected
                  </Badge>
                </>
              ) : (
                <>
                  <WifiOff className="w-4 h-4 text-red-600" />
                  <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-200">
                    Disconnected
                  </Badge>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}