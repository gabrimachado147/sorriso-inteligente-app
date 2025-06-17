
import React from 'react';
import AppointmentSchedulerReal from '@/components/Appointments/AppointmentSchedulerReal';
import { PageHead } from '@/components/SEO/PageHead';
import { animations } from '@/lib/animations';

const SchedulePage = () => {
  return (
    <>
      <PageHead
        title="Agendar Consulta - Senhor Sorriso"
        description="Agende sua consulta odontológica online na rede Senhor Sorriso. Horários disponíveis, avaliação gratuita e atendimento de qualidade."
        keywords="agendar consulta, dentista, agendamento online, horário disponível, consulta odontológica, Senhor Sorriso"
        url="https://senhorsorrisso.com.br/schedule"
      />
      <div className={`w-full min-h-screen bg-background overflow-x-hidden ${animations.pageEnter}`}>
        <div className="mobile-container px-4 py-6 max-w-4xl mx-auto">
          <div className="space-y-6 overflow-x-hidden">
            <AppointmentSchedulerReal />
          </div>
        </div>
      </div>
    </>
  );
};

export default SchedulePage;
