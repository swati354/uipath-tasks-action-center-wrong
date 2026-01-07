import React from 'react';
import { TasksTable } from './TasksTable';
export function TasksTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Action Center Tasks
        </h2>
        <p className="text-muted-foreground">
          Manage human-in-the-loop tasks and workflow approvals
        </p>
      </div>
      <TasksTable />
    </div>
  );
}