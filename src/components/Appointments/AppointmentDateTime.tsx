
import React from 'react';
import { Calendar, Clock } from 'lucide-react';

interface AppointmentDateTimeProps {
  date: string;
  time: string;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
};

export const AppointmentDateTime: React.FC<AppointmentDateTimeProps> = ({
  date,
  time
}) => {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 text-sm">
        <Calendar className="h-3 w-3 text-gray-400" />
        <span className="truncate">{formatDate(date)}</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Clock className="h-3 w-3 text-gray-400" />
        <span className="truncate">{time}</span>
      </div>
    </div>
  );
};
