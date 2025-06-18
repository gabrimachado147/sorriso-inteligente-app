
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { Notification } from './types';

export const getIcon = (type: Notification['type']) => {
  switch (type) {
    case 'success': 
      return CheckCircle;
    case 'warning': 
      return AlertTriangle;
    case 'error': 
      return AlertCircle;
    case 'info':
      return Info;
    default: 
      return Info;
  }
};

export const getColor = (type: Notification['type']): string => {
  switch (type) {
    case 'success': 
      return 'text-green-600 bg-green-50 border-green-200';
    case 'warning': 
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'error': 
      return 'text-red-600 bg-red-50 border-red-200';
    case 'info':
      return 'text-blue-600 bg-blue-50 border-blue-200';
    default: 
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

export const formatTime = (timestamp: Date): string => {
  const now = new Date();
  const diff = now.getTime() - timestamp.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (days > 0) return `${days}d atrás`;
  if (hours > 0) return `${hours}h atrás`;
  if (minutes > 0) return `${minutes}m atrás`;
  return 'Agora';
};
