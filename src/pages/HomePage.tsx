import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AuthWrapper } from '@/components/AuthWrapper';
import { Header } from '@/components/dashboard/Header';
import { ProcessesAssetsTab } from '@/components/dashboard/ProcessesAssetsTab';
import { TasksTab } from '@/components/dashboard/TasksTab';
export function HomePage() {
  return (
    <AuthWrapper>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8 md:py-10 lg:py-12">
            <Tabs defaultValue="processes-assets" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 max-w-md">
                <TabsTrigger value="processes-assets" className="text-sm font-medium">
                  Processes & Assets
                </TabsTrigger>
                <TabsTrigger value="tasks" className="text-sm font-medium">
                  Action Center Tasks
                </TabsTrigger>
              </TabsList>
              <TabsContent value="processes-assets" className="space-y-6">
                <ProcessesAssetsTab />
              </TabsContent>
              <TabsContent value="tasks" className="space-y-6">
                <TasksTab />
              </TabsContent>
            </Tabs>
          </div>
        </main>
        <footer className="border-t bg-muted/50 py-6 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-muted-foreground">
              © Powered by UiPath
            </p>
          </div>
        </footer>
      </div>
    </AuthWrapper>
  );
}