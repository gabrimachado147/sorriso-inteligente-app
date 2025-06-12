
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Filters } from '@/components/ui/filters';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';
import { EnhancedSkeleton } from '@/components/ui/enhanced-skeleton';
import { Calendar as CalendarIcon } from 'lucide-react';
import { animations } from '@/lib/animations';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DateSelector } from './DateSelector';
import { TimeSelector } from './TimeSelector';
import { ClinicSelector } from './ClinicSelector';
import { ServiceSelector } from './ServiceSelector';
import { AppointmentSummary } from './AppointmentSummary';
import { RescheduleNotification } from './RescheduleNotification';
import { availableServices } from './constants/services';
import { useAppointmentSchedulerLogic } from '@/hooks/useAppointmentSchedulerLogic';

const AppointmentScheduler = () => {
  const [searchParams] = useSearchParams();
  const rescheduleId = searchParams.get('reschedule');
  
  const {
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    selectedClinic,
    setSelectedClinic,
    selectedService,
    setSelectedService,
    isLoading,
    showConfirmModal,
    setShowConfirmModal,
    filters,
    setFilters,
    availableClinics,
    filteredServices,
    filteredClinics,
    handleConfirmAppointment,
    handleScheduleAppointment,
    handleGoBack
  } = useAppointmentSchedulerLogic(rescheduleId);

  if (isLoading) {
    return (
      <div className={`p-6 space-y-6 ${animations.fadeIn}`}>
        <EnhancedSkeleton variant="appointment-card" count={3} />
      </div>
    );
  }

  return (
    <div className={`p-6 space-y-6 ${animations.pageEnter}`}>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <CalendarIcon className="h-6 w-6 text-primary" />
          {rescheduleId ? 'Reagendar Consulta' : 'Agendar Consulta'}
        </h1>
        <Button variant="outline" onClick={handleGoBack} className={animations.buttonHover}>
          Voltar
        </Button>
      </div>

      {rescheduleId && (
        <RescheduleNotification rescheduleId={rescheduleId} />
      )}

      {/* Filtros */}
      <Card className={animations.fadeIn}>
        <CardContent className="p-6">
          <Filters
            filters={filters}
            onFiltersChange={setFilters}
            availableClinics={availableClinics}
            availableServices={availableServices}
            placeholder="Buscar clínicas ou serviços..."
            showStatusFilter={false}
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DateSelector 
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
        />
        
        <TimeSelector
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          onTimeSelect={setSelectedTime}
        />
      </div>

      <ClinicSelector
        selectedClinic={selectedClinic}
        onClinicSelect={setSelectedClinic}
        filteredClinics={filteredClinics}
      />

      <ServiceSelector
        selectedService={selectedService}
        onServiceSelect={setSelectedService}
        filteredServices={filteredServices}
      />

      <AppointmentSummary
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        selectedClinic={selectedClinic}
        selectedService={selectedService}
        availableClinics={availableClinics}
        availableServices={availableServices}
        onConfirm={handleScheduleAppointment}
      />

      {/* Modal de Confirmação */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmAppointment}
        type="appointment"
        data={{
          date: selectedDate ? format(selectedDate, 'dd/MM/yyyy', { locale: ptBR }) : '',
          time: selectedTime,
          clinic: availableClinics.find(c => c.id === selectedClinic)?.name || '',
          service: availableServices.find(s => s.id === selectedService)?.name || ''
        }}
      />
    </div>
  );
};

export default AppointmentScheduler;
