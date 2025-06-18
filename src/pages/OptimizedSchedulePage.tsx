
import React from 'react';
import OptimizedAppointmentScheduler from '@/components/Appointments/OptimizedAppointmentScheduler';
import { PageHead } from '@/components/SEO/PageHead';
import { animations } from '@/lib/animations';

const OptimizedSchedulePage = () => {
  return (
    <>
      <PageHead
        title="Agendar Consulta - Senhor Sorriso"
        description="Agende sua consulta odontológica online na rede Senhor Sorriso. Interface otimizada, horários disponíveis em tempo real e agendamento simplificado."
        keywords="agendar consulta, dentista, agendamento online, horário disponível, consulta odontológica, Senhor Sorriso, interface otimizada"
        url="https://senhorsorrisso.com.br/schedule"
      />
      <div className={`w-full min-h-screen ${animations.pageEnter}`}>
        <OptimizedAppointmentScheduler />
      </div>
    </>
  );
};

export default OptimizedSchedulePage;
