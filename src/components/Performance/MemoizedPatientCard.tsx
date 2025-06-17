
import React, { memo, useCallback, useMemo } from 'react';
import { PatientCard } from '@/components/Patient/PatientCard';

interface MemoizedPatientCardProps {
  patient: {
    id: string;
    name: string;
    phone: string;
    email?: string;
    lastAppointment?: string;
    status: 'active' | 'inactive' | 'pending';
    city?: string;
  };
  onViewDetails?: (patientId: string) => void;
  onScheduleAppointment?: (patientId: string) => void;
  variant?: 'compact' | 'detailed';
}

export const MemoizedPatientCard = memo<MemoizedPatientCardProps>(({
  patient,
  onViewDetails,
  onScheduleAppointment,
  variant = 'compact'
}) => {
  // Memoize callbacks to prevent unnecessary re-renders
  const handleViewDetails = useCallback(() => {
    onViewDetails?.(patient.id);
  }, [onViewDetails, patient.id]);

  const handleScheduleAppointment = useCallback(() => {
    onScheduleAppointment?.(patient.id);
  }, [onScheduleAppointment, patient.id]);

  // Memoize patient status color calculation
  const statusProps = useMemo(() => {
    return {
      className: `status-${patient.status}`,
      color: patient.status === 'active' ? 'green' : 
             patient.status === 'pending' ? 'yellow' : 'gray'
    };
  }, [patient.status]);

  return (
    <PatientCard
      patient={patient}
      onViewDetails={onViewDetails ? handleViewDetails : undefined}
      onScheduleAppointment={onScheduleAppointment ? handleScheduleAppointment : undefined}
      variant={variant}
    />
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for better memoization
  return (
    prevProps.patient.id === nextProps.patient.id &&
    prevProps.patient.name === nextProps.patient.name &&
    prevProps.patient.status === nextProps.patient.status &&
    prevProps.patient.lastAppointment === nextProps.patient.lastAppointment &&
    prevProps.variant === nextProps.variant &&
    prevProps.onViewDetails === nextProps.onViewDetails &&
    prevProps.onScheduleAppointment === nextProps.onScheduleAppointment
  );
});

MemoizedPatientCard.displayName = 'MemoizedPatientCard';
