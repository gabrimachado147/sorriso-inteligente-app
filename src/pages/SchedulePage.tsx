
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
        breadcrumbs={[
          { name: "Início", url: "https://senhorsorrisso.com.br/" },
          { name: "Agendar Consulta", url: "https://senhorsorrisso.com.br/schedule" }
        ]}
      />
      <div className={`space-y-6 ${animations.pageEnter}`}>
        <AppointmentSchedulerReal />
      </div>
    </>
  );
};

export default SchedulePage;
