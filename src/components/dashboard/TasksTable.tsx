import React, { useState, useMemo } from 'react';
import { Search, Filter, RefreshCw, User, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useUiPathTasks, useAssignTask, useCompleteTask } from '@/hooks/useUiPathTasks';
import { StatusBadge } from './StatusBadge';
import { CompleteTaskForm } from './CompleteTaskForm';
import { format } from 'date-fns';
import { TaskType } from 'uipath-sdk';
const getPriorityIcon = (priority: string) => {
  switch (priority?.toLowerCase()) {
    case 'high':
      return <AlertTriangle className="w-4 h-4 text-red-600" />;
    case 'medium':
      return <Clock className="w-4 h-4 text-yellow-600" />;
    case 'low':
      return <Clock className="w-4 h-4 text-green-600" />;
    default:
      return <Clock className="w-4 h-4 text-gray-600" />;
  }
};
const getPriorityColor = (priority: string) => {
  switch (priority?.toLowerCase()) {
    case 'high':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'low':
      return 'bg-green-100 text-green-800 border-green-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};
const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'pending':
      return 'warning';
    case 'inprogress':
    case 'assigned':
      return 'info';
    case 'completed':
      return 'success';
    case 'failed':
    case 'faulted':
      return 'error';
    default:
      return 'secondary';
  }
};
export function TasksTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [showCompleteForm, setShowCompleteForm] = useState(false);
  const { data: tasks, isLoading, error, refetch } = useUiPathTasks(undefined, true);
  const assignTask = useAssignTask();
  const completeTask = useCompleteTask();
  const filteredTasks = useMemo(() => {
    if (!tasks) return [];
    return tasks.filter(task => {
      const matchesSearch = task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           task.data?.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || task.status?.toLowerCase() === statusFilter.toLowerCase();
      const matchesPriority = priorityFilter === 'all' || task.priority?.toLowerCase() === priorityFilter.toLowerCase();
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, searchTerm, statusFilter, priorityFilter]);
  const handleAssignToMe = async (taskId: number) => {
    try {
      await assignTask.mutateAsync({
        taskId,
        userNameOrEmail: 'current-user@company.com' // In real app, get from auth context
      });
    } catch (error) {
      console.error('Failed to assign task:', error);
    }
  };
  const handleCompleteTask = (task: any) => {
    setSelectedTask(task);
    setShowCompleteForm(true);
  };
  const handleConfirmComplete = async (taskId: number, data: Record<string, any>, action: string) => {
    try {
      await completeTask.mutateAsync({
        taskId,
        type: TaskType.External, // Default to External, real app would determine from task
        data,
        action,
        folderId: 0
      });
      setShowCompleteForm(false);
      setSelectedTask(null);
    } catch (error) {
      console.error('Failed to complete task:', error);
    }
  };
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span>Loading Tasks...</span>
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
          <CardTitle className="text-destructive">Error Loading Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            {error instanceof Error ? error.message : 'Failed to load tasks'}
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
            <CardTitle>Tasks ({filteredTasks.length})</CardTitle>
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
                placeholder="Search tasks..."
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="inprogress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Table */}
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all'
                  ? 'No tasks match your filters'
                  : 'No tasks found. Create tasks in UiPath Action Center to see them here.'}
              </p>
            </div>
          ) : (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Assignee</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTasks.map((task) => (
                    <TableRow key={task.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div>
                          <div className="font-medium">{task.title}</div>
                          {task.data?.description && (
                            <div className="text-sm text-muted-foreground max-w-xs truncate">
                              {task.data.description}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getPriorityColor(task.priority || 'medium')}
                        >
                          <span className="flex items-center space-x-1">
                            {getPriorityIcon(task.priority || 'medium')}
                            <span className="capitalize">
                              {task.priority || 'Medium'}
                            </span>
                          </span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <StatusBadge
                          status={getStatusColor(task.status || 'pending')}
                          text={task.status || 'Pending'}
                        />
                      </TableCell>
                      <TableCell>
                        {task.assignedToUser ? (
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">{task.assignedToUser}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">Unassigned</span>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {task.dueDate
                          ? format(new Date(task.dueDate), 'MMM d, yyyy')
                          : 'No due date'
                        }
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          {!task.assignedToUser && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAssignToMe(task.id)}
                              disabled={assignTask.isPending}
                            >
                              <User className="w-4 h-4 mr-1" />
                              Assign to Me
                            </Button>
                          )}
                          {task.status?.toLowerCase() !== 'completed' && (
                            <Button
                              size="sm"
                              onClick={() => handleCompleteTask(task)}
                              disabled={completeTask.isPending}
                              className="bg-[#FA4616] hover:bg-[#E55A1B] text-white"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Complete
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      <CompleteTaskForm
        open={showCompleteForm}
        onOpenChange={setShowCompleteForm}
        task={selectedTask}
        onConfirm={handleConfirmComplete}
        isLoading={completeTask.isPending}
      />
    </>
  );
}