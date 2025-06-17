
import React from 'react';
import AppointmentSchedulerReal from '@/components/Appointments/AppointmentSchedulerReal';
import { animations } from '@/lib/animations';

const SchedulePage = () => {
  return (
    <div className={`space-y-6 ${animations.pageEnter}`}>
      <AppointmentSchedulerReal />
    </div>
  );
};

export default SchedulePage;
