import React, { useState, useMemo } from 'react';
import { Search, Play, Filter, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useUiPathProcesses, useStartProcess } from '@/hooks/useUiPathProcesses';
import { useFolderContext } from '@/hooks/useFolderContext';
import { StatusBadge } from './StatusBadge';
import { StartProcessDialog } from './StartProcessDialog';
import { format } from 'date-fns';
export function ProcessesTable() {
  const { selectedFolderId } = useFolderContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedProcess, setSelectedProcess] = useState<any>(null);
  const [showStartDialog, setShowStartDialog] = useState(false);
  const { data: processes, isLoading, error, refetch } = useUiPathProcesses(selectedFolderId, true);
  const startProcess = useStartProcess();
  const filteredProcesses = useMemo(() => {
    if (!processes) return [];
    return processes.filter(process => {
      const matchesSearch = process.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           process.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || process.isActive === (statusFilter === 'active');
      return matchesSearch && matchesStatus;
    });
  }, [processes, searchTerm, statusFilter]);
  const handleStartProcess = (process: any) => {
    setSelectedProcess(process);
    setShowStartDialog(true);
  };
  const handleConfirmStart = async (processKey: string, inputArguments?: Record<string, any>) => {
    try {
      await startProcess.mutateAsync({
        processKey,
        folderId: selectedFolderId || 0
      });
      setShowStartDialog(false);
      setSelectedProcess(null);
    } catch (error) {
      console.error('Failed to start process:', error);
    }
  };
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span>Loading Processes...</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-destructive">Error Loading Processes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            {error instanceof Error ? error.message : 'Failed to load processes'}
          </p>
          <Button onClick={() => refetch()} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }
  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Processes ({filteredProcesses.length})</CardTitle>
            <Button onClick={() => refetch()} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search processes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Table */}
          {filteredProcesses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== 'all' 
                  ? 'No processes match your filters' 
                  : 'No processes found. Create processes in UiPath Orchestrator to see them here.'}
              </p>
            </div>
          ) : (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Version</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Modified</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProcesses.map((process) => (
                    <TableRow key={process.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">
                        {process.name}
                      </TableCell>
                      <TableCell className="text-muted-foreground max-w-xs truncate">
                        {process.description || 'No description'}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {process.processVersion || 'N/A'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <StatusBadge 
                          status={process.isActive ? 'success' : 'secondary'}
                          text={process.isActive ? 'Active' : 'Inactive'}
                        />
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {process.lastModifiedTime 
                          ? format(new Date(process.lastModifiedTime), 'MMM d, yyyy HH:mm')
                          : 'N/A'
                        }
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          onClick={() => handleStartProcess(process)}
                          disabled={!process.isActive || startProcess.isPending}
                          className="bg-[#FA4616] hover:bg-[#E55A1B] text-white"
                        >
                          <Play className="w-4 h-4 mr-1" />
                          Start
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      <StartProcessDialog
        open={showStartDialog}
        onOpenChange={setShowStartDialog}
        process={selectedProcess}
        onConfirm={handleConfirmStart}
        isLoading={startProcess.isPending}
      />
    </>
  );
}