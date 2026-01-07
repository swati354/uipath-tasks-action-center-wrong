import React, { useState } from 'react';
import { CheckCircle, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
interface CompleteTaskFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: any;
  onConfirm: (taskId: number, data: Record<string, any>, action: string) => void;
  isLoading: boolean;
}
export function CompleteTaskForm({
  open,
  onOpenChange,
  task,
  onConfirm,
  isLoading
}: CompleteTaskFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [action, setAction] = useState<string>('approve');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (task?.id) {
      onConfirm(task.id, formData, action);
    }
  };
  const handleInputChange = (key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };
  if (!task) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-[#FA4616]" />
            <span>Complete Task</span>
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{task.title}</h3>
              <Badge variant="outline" className="capitalize">
                {task.priority || 'Medium'}
              </Badge>
            </div>
            {task.description && (
              <p className="text-sm text-muted-foreground">
                {task.description}
              </p>
            )}
          </div>
          {/* Action Selection */}
          <div className="space-y-2">
            <Label htmlFor="action">Action</Label>
            <Select value={action} onValueChange={setAction}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="approve">Approve</SelectItem>
                <SelectItem value="reject">Reject</SelectItem>
                <SelectItem value="submit">Submit</SelectItem>
                <SelectItem value="complete">Complete</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Form Fields */}
          <div className="space-y-3">
            <div>
              <Label htmlFor="comments" className="text-sm">
                Comments
              </Label>
              <Textarea
                id="comments"
                placeholder="Enter your comments..."
                value={formData.comments || ''}
                onChange={(e) => handleInputChange('comments', e.target.value)}
                rows={3}
              />
            </div>
            {action === 'reject' && (
              <div>
                <Label htmlFor="reason" className="text-sm">
                  Rejection Reason
                </Label>
                <Input
                  id="reason"
                  placeholder="Enter reason for rejection..."
                  value={formData.reason || ''}
                  onChange={(e) => handleInputChange('reason', e.target.value)}
                />
              </div>
            )}
            {action === 'approve' && (
              <div>
                <Label htmlFor="approvalNotes" className="text-sm">
                  Approval Notes
                </Label>
                <Input
                  id="approvalNotes"
                  placeholder="Enter approval notes..."
                  value={formData.approvalNotes || ''}
                  onChange={(e) => handleInputChange('approvalNotes', e.target.value)}
                />
              </div>
            )}
          </div>
          <DialogFooter className="flex items-center space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-[#FA4616] hover:bg-[#E55A1B] text-white"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Completing...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Complete Task
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}