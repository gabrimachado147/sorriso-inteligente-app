
import { useMemo } from 'react';

type TimeSlot = string;

interface TimeSlotData {
  timeSlots: TimeSlot[];
  isWeekend: boolean;
  isClosed: boolean;
}

export const useTimeSlots = (selectedDate?: Date): TimeSlotData => {
  const getAvailableTimeSlots = useMemo((): TimeSlot[] => {
    if (!selectedDate) return [];
    
    const dayOfWeek = selectedDate.getDay();
    
    // Segunda a Sexta: 8h às 19h
    const weekdaySlots: TimeSlot[] = [
      '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
      '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00'
    ];
    
    // Sábado: 8h às 13h
    const saturdaySlots: TimeSlot[] = [
      '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '12:00', '12:30', '13:00'
    ];
    
    // Domingo: fechado
    if (dayOfWeek === 0) {
      return [];
    }
    
    if (dayOfWeek === 6) {
      return saturdaySlots;
    }
    
    return weekdaySlots;
  }, [selectedDate]);

  const isWeekend = selectedDate?.getDay() === 6;
  const isClosed = selectedDate?.getDay() === 0;

  return {
    timeSlots: getAvailableTimeSlots,
    isWeekend,
    isClosed
  };
};
