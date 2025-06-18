
import React from 'react';

interface AppointmentTableFooterProps {
  totalAppointments: number;
  selectedCount: number;
}

export const AppointmentTableFooter: React.FC<AppointmentTableFooterProps> = ({
  totalAppointments,
  selectedCount
}) => {
  return (
    <div className="flex items-center justify-between text-sm text-gray-600">
      <div>
        Mostrando {totalAppointments} agendamento{totalAppointments !== 1 ? 's' : ''}
        {selectedCount > 0 && (
          <span className="ml-2 text-blue-600">
            ({selectedCount} selecionado{selectedCount !== 1 ? 's' : ''})
          </span>
        )}
      </div>
    </div>
  );
};
