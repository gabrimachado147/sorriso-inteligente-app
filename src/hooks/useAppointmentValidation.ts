
import { useState, useMemo } from 'react';

export interface AppointmentFormData {
  selectedDate?: Date;
  selectedTime: string;
  selectedClinic: string;
  selectedService: string;
}

export const useAppointmentValidation = (formData: AppointmentFormData) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isFormValid = useMemo(() => {
    const { selectedDate, selectedTime, selectedClinic, selectedService } = formData;
    return !!(selectedDate && selectedTime && selectedClinic && selectedService);
  }, [formData]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.selectedDate) {
      newErrors.date = 'Selecione uma data';
    }
    
    if (!formData.selectedTime) {
      newErrors.time = 'Selecione um horário';
    }
    
    if (!formData.selectedClinic) {
      newErrors.clinic = 'Selecione uma clínica';
    }
    
    if (!formData.selectedService) {
      newErrors.service = 'Selecione um serviço';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearErrors = () => {
    setErrors({});
  };

  return {
    errors,
    isFormValid,
    validateForm,
    clearErrors
  };
};
