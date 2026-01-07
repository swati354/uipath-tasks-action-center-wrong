import React, { createContext, useContext, useState, ReactNode } from 'react';
interface FolderContextType {
  selectedFolderId: number | null;
  setSelectedFolderId: (folderId: number | null) => void;
}
const FolderContext = createContext<FolderContextType | undefined>(undefined);
interface FolderProviderProps {
  children: ReactNode;
}
export function FolderProvider({ children }: FolderProviderProps) {
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const value = {
    selectedFolderId,
    setSelectedFolderId,
  };
  return (
    <FolderContext.Provider value={value}>
      {children}
    </FolderContext.Provider>
  );
}
export function useFolderContext() {
  const context = useContext(FolderContext);
  if (context === undefined) {
    throw new Error('useFolderContext must be used within a FolderProvider');
  }
  return context;
}