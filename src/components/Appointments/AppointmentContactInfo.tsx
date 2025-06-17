
import React from 'react';
import { Phone, Mail } from 'lucide-react';

interface AppointmentContactInfoProps {
  phone: string;
  email?: string;
}

export const AppointmentContactInfo: React.FC<AppointmentContactInfoProps> = ({
  phone,
  email
}) => {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 text-sm">
        <Phone className="h-3 w-3 text-gray-400" />
        <span className="truncate">{phone}</span>
      </div>
      {email && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Mail className="h-3 w-3 text-gray-400" />
          <span className="truncate">{email}</span>
        </div>
      )}
    </div>
  );
};
