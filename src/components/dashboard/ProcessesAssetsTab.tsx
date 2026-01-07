import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProcessesTable } from './ProcessesTable';
import { AssetsTable } from './AssetsTable';
export function ProcessesAssetsTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Processes & Assets
        </h2>
        <p className="text-muted-foreground">
          View and manage your automation processes and configuration assets
        </p>
      </div>
      <Tabs defaultValue="processes" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-sm">
          <TabsTrigger value="processes" className="text-sm">
            Processes
          </TabsTrigger>
          <TabsTrigger value="assets" className="text-sm">
            Assets
          </TabsTrigger>
        </TabsList>
        <TabsContent value="processes" className="space-y-4">
          <ProcessesTable />
        </TabsContent>
        <TabsContent value="assets" className="space-y-4">
          <AssetsTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}