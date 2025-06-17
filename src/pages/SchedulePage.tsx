
import React from 'react';
import AppointmentSchedulerReal from '@/components/Appointments/AppointmentSchedulerReal';
import { animations } from '@/lib/animations';

const SchedulePage = () => {
  return (
    <div className={`space-y-6 ${animations.pageEnter}`}>
      <div className="text-center mb-6">
        <h1 className="text-lg font-bold">Agendar Consulta</h1>
        <p className="text-muted-foreground mt-2">
          Escolha data, horário e serviço desejado
        </p>
      </div>
      <AppointmentSchedulerReal />
    </div>
  );
};

export default SchedulePage;
