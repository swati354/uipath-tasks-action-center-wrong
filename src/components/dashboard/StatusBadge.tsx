import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
interface StatusBadgeProps {
  status: 'success' | 'warning' | 'error' | 'info' | 'secondary';
  text: string;
  className?: string;
}
const statusStyles = {
  success: 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200',
  warning: 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200',
  error: 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200',
  info: 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200',
  secondary: 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200',
};
export function StatusBadge({ status, text, className }: StatusBadgeProps) {
  return (
    <Badge 
      variant="outline" 
      className={cn(statusStyles[status], className)}
    >
      {text}
    </Badge>
  );
}