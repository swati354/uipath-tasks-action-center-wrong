import React from 'react';
import { Folder, ChevronDown } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFolderContext } from '@/hooks/useFolderContext';
// Mock folder data - in real implementation, this would come from UiPath API
const mockFolders = [
  { id: 1, name: 'Default', displayName: 'Default' },
  { id: 2, name: 'Production', displayName: 'Production' },
  { id: 3, name: 'Development', displayName: 'Development' },
  { id: 4, name: 'Testing', displayName: 'Testing' },
];
export function FolderSelector() {
  const { selectedFolderId, setSelectedFolderId } = useFolderContext();
  const selectedFolder = mockFolders.find(f => f.id === selectedFolderId);
  return (
    <div className="flex items-center space-x-2">
      <Folder className="w-4 h-4 text-muted-foreground" />
      <Select
        value={selectedFolderId?.toString() || ''}
        onValueChange={(value) => setSelectedFolderId(value ? parseInt(value) : null)}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Select folder">
            {selectedFolder?.displayName || 'All Folders'}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Folders</SelectItem>
          {mockFolders.map((folder) => (
            <SelectItem key={folder.id} value={folder.id.toString()}>
              {folder.displayName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}