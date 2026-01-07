import React, { useState } from 'react';
import { Play, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
interface StartProcessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  process: any;
  onConfirm: (processKey: string, inputArguments?: Record<string, any>) => void;
  isLoading: boolean;
}
export function StartProcessDialog({
  open,
  onOpenChange,
  process,
  onConfirm,
  isLoading
}: StartProcessDialogProps) {
  const [inputArguments, setInputArguments] = useState<Record<string, any>>({});
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (process?.key) {
      onConfirm(process.key, inputArguments);
    }
  };
  const handleInputChange = (key: string, value: any) => {
    setInputArguments(prev => ({
      ...prev,
      [key]: value
    }));
  };
  if (!process) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Play className="w-5 h-5 text-[#FA4616]" />
            <span>Start Process</span>
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{process.name}</h3>
              <Badge variant="outline">
                v{process.processVersion || '1.0'}
              </Badge>
            </div>
            {process.description && (
              <p className="text-sm text-muted-foreground">
                {process.description}
              </p>
            )}
          </div>
          {/* Input Arguments Section */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Input Arguments (Optional)</Label>
            {/* Common input arguments - in real implementation, these would come from process definition */}
            <div className="space-y-3">
              <div>
                <Label htmlFor="config" className="text-xs text-muted-foreground">
                  Configuration
                </Label>
                <Input
                  id="config"
                  placeholder="Enter configuration value..."
                  value={inputArguments.config || ''}
                  onChange={(e) => handleInputChange('config', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="notes" className="text-xs text-muted-foreground">
                  Notes
                </Label>
                <Textarea
                  id="notes"
                  placeholder="Enter any notes for this execution..."
                  value={inputArguments.notes || ''}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows={3}
                />
              </div>
            </div>
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
                  Starting...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Start Process
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}