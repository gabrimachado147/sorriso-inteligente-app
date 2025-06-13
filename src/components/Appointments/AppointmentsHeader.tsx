
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, LogOut } from 'lucide-react';

interface AppointmentsHeaderProps {
  userClinicName: string;
  loggedInUser: string;
  onLogout: () => void;
}

export const AppointmentsHeader: React.FC<AppointmentsHeaderProps> = ({
  userClinicName,
  loggedInUser,
  onLogout
}) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Calendar className="h-6 w-6 text-primary" />
          Agendamentos - {userClinicName}
        </h1>
        <p className="text-gray-600 mt-1">
          Logado como: <span className="font-medium">{loggedInUser}</span>
        </p>
      </div>
      <Button variant="outline" onClick={onLogout} className="flex items-center gap-2">
        <LogOut className="h-4 w-4" />
        Sair
      </Button>
    </div>
  );
};
