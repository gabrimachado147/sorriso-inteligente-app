
import React from 'react';
import { toast as sonnerToast } from 'sonner';
import { Check, X, AlertCircle, Info, Calendar, Phone, MapPin } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'appointment' | 'call' | 'location';

interface CustomToastOptions {
  title: string;
  description?: string;
  type: ToastType;
  duration?: number;
}

const getToastConfig = (type: ToastType) => {
  switch (type) {
    case 'success':
      return {
        icon: <Check className="h-5 w-5 text-green-600" />,
        className: 'border-green-200 bg-green-50',
        titleClassName: 'text-green-800',
        descriptionClassName: 'text-green-600'
      };
    case 'error':
      return {
        icon: <X className="h-5 w-5 text-red-600" />,
        className: 'border-red-200 bg-red-50',
        titleClassName: 'text-red-800',
        descriptionClassName: 'text-red-600'
      };
    case 'warning':
      return {
        icon: <AlertCircle className="h-5 w-5 text-yellow-600" />,
        className: 'border-yellow-200 bg-yellow-50',
        titleClassName: 'text-yellow-800',
        descriptionClassName: 'text-yellow-600'
      };
    case 'info':
      return {
        icon: <Info className="h-5 w-5 text-blue-600" />,
        className: 'border-blue-200 bg-blue-50',
        titleClassName: 'text-blue-800',
        descriptionClassName: 'text-blue-600'
      };
    case 'appointment':
      return {
        icon: <Calendar className="h-5 w-5 text-primary" />,
        className: 'border-primary/20 bg-primary/5',
        titleClassName: 'text-primary',
        descriptionClassName: 'text-primary/70'
      };
    case 'call':
      return {
        icon: <Phone className="h-5 w-5 text-green-600" />,
        className: 'border-green-200 bg-green-50',
        titleClassName: 'text-green-800',
        descriptionClassName: 'text-green-600'
      };
    case 'location':
      return {
        icon: <MapPin className="h-5 w-5 text-blue-600" />,
        className: 'border-blue-200 bg-blue-50',
        titleClassName: 'text-blue-800',
        descriptionClassName: 'text-blue-600'
      };
    default:
      return {
        icon: <Info className="h-5 w-5 text-gray-600" />,
        className: 'border-gray-200 bg-gray-50',
        titleClassName: 'text-gray-800',
        descriptionClassName: 'text-gray-600'
      };
  }
};

export const customToast = ({ title, description, type, duration = 4000 }: CustomToastOptions) => {
  const config = getToastConfig(type);

  return sonnerToast.custom(
    (t) => (
      <div className={`flex items-start space-x-3 p-4 rounded-lg border ${config.className} shadow-lg max-w-md`}>
        <div className="flex-shrink-0 mt-0.5">
          {config.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium ${config.titleClassName}`}>
            {title}
          </p>
          {description && (
            <p className={`text-sm mt-1 ${config.descriptionClassName}`}>
              {description}
            </p>
          )}
        </div>
        <button
          onClick={() => sonnerToast.dismiss(t)}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    ),
    { duration }
  );
};

// Helpers para tipos específicos
export const toastSuccess = (title: string, description?: string) => 
  customToast({ title, description, type: 'success' });

export const toastError = (title: string, description?: string) => 
  customToast({ title, description, type: 'error' });

export const toastWarning = (title: string, description?: string) => 
  customToast({ title, description, type: 'warning' });

export const toastInfo = (title: string, description?: string) => 
  customToast({ title, description, type: 'info' });

export const toastAppointment = (title: string, description?: string) => 
  customToast({ title, description, type: 'appointment' });

export const toastCall = (title: string, description?: string) => 
  customToast({ title, description, type: 'call' });

export const toastLocation = (title: string, description?: string) => 
  customToast({ title, description, type: 'location' });
