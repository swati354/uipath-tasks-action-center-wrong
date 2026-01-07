import React, { useState, useMemo } from 'react';
import { Search, Filter, RefreshCw, Eye, EyeOff, Key, FileText, ToggleLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useUiPathAssets } from '@/hooks/useUiPathAssets';
import { StatusBadge } from './StatusBadge';
const getAssetTypeIcon = (valueType: string) => {
  switch (valueType?.toLowerCase()) {
    case 'credential':
      return <Key className="w-4 h-4" />;
    case 'boolean':
      return <ToggleLeft className="w-4 h-4" />;
    default:
      return <FileText className="w-4 h-4" />;
  }
};
const getAssetTypeColor = (valueType: string) => {
  switch (valueType?.toLowerCase()) {
    case 'credential':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'boolean':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'text':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};
export function AssetsTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [showValues, setShowValues] = useState<Record<string, boolean>>({});
  const { data: assets, isLoading, error, refetch } = useUiPathAssets(undefined, true);
  const filteredAssets = useMemo(() => {
    if (!assets) return [];
    return assets.filter(asset => {
      const matchesSearch = asset.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           asset.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === 'all' || asset.valueType?.toLowerCase() === typeFilter.toLowerCase();
      return matchesSearch && matchesType;
    });
  }, [assets, searchTerm, typeFilter]);
  const toggleValueVisibility = (assetId: string) => {
    setShowValues(prev => ({
      ...prev,
      [assetId]: !prev[assetId]
    }));
  };
  const formatAssetValue = (asset: any) => {
    if (asset.valueType?.toLowerCase() === 'credential') {
      return showValues[asset.id.toString()] ? asset.value || '••••••••' : '••••••••';
    }
    if (asset.valueType?.toLowerCase() === 'boolean') {
      return asset.value === 'true' ? 'True' : 'False';
    }
    return asset.value || 'No value';
  };
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span>Loading Assets...</span>
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
          <CardTitle className="text-destructive">Error Loading Assets</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            {error instanceof Error ? error.message : 'Failed to load assets'}
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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Assets ({filteredAssets.length})</CardTitle>
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
              placeholder="Search assets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-40">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="text">Text</SelectItem>
              <SelectItem value="credential">Credential</SelectItem>
              <SelectItem value="boolean">Boolean</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {/* Table */}
        {filteredAssets.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {searchTerm || typeFilter !== 'all'
                ? 'No assets match your filters'
                : 'No assets found. Create assets in UiPath Orchestrator to see them here.'}
            </p>
          </div>
        ) : (
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssets.map((asset) => (
                  <TableRow key={asset.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      {asset.name}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={getAssetTypeColor(asset.valueType || 'text')}
                      >
                        <span className="flex items-center space-x-1">
                          {getAssetTypeIcon(asset.valueType || 'text')}
                          <span className="capitalize">
                            {asset.valueType || 'Text'}
                          </span>
                        </span>
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="flex items-center space-x-2">
                        <span className="truncate font-mono text-sm">
                          {formatAssetValue(asset)}
                        </span>
                        {asset.valueType?.toLowerCase() === 'credential' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => toggleValueVisibility(asset.id.toString())}
                            className="h-6 w-6 p-0"
                          >
                            {showValues[asset.id.toString()] ? (
                              <EyeOff className="w-3 h-3" />
                            ) : (
                              <Eye className="w-3 h-3" />
                            )}
                          </Button>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground max-w-xs truncate">
                      {asset.description || 'No description'}
                    </TableCell>
                    <TableCell className="text-right">
                      <StatusBadge
                        status="success"
                        text="Available"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}