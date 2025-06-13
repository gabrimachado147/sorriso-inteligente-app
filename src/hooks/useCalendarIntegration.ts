
import { useState } from 'react';
import { toastSuccess, toastError } from '@/components/ui/custom-toast';

interface CalendarEvent {
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  location?: string;
  url?: string;
}

export const useCalendarIntegration = () => {
  const [isSupported, setIsSupported] = useState(
    'calendar' in navigator || 'webkitAddToCalendar' in navigator
  );

  const addToCalendar = async (event: CalendarEvent) => {
    try {
      // Verificar se é um PWA ou dispositivo móvel
      if ('calendar' in navigator) {
        // API nativa do calendário (ainda em desenvolvimento nos navegadores)
        await addToNativeCalendar(event);
      } else {
        // Fallback para diferentes métodos
        await addToCalendarFallback(event);
      }
      
      toastSuccess('Sucesso', 'Evento adicionado ao calendário!');
      return true;
    } catch (error) {
      console.error('Erro ao adicionar ao calendário:', error);
      toastError('Erro', 'Não foi possível adicionar ao calendário');
      return false;
    }
  };

  const addToNativeCalendar = async (event: CalendarEvent) => {
    // Implementação futura para API nativa
    throw new Error('API nativa ainda não suportada');
  };

  const addToCalendarFallback = async (event: CalendarEvent) => {
    // Detectar plataforma e usar método apropriado
    const userAgent = navigator.userAgent;
    
    if (/iPhone|iPad|iPod/.test(userAgent)) {
      addToiOSCalendar(event);
    } else if (/Android/.test(userAgent)) {
      addToAndroidCalendar(event);
    } else {
      addToWebCalendar(event);
    }
  };

  const addToiOSCalendar = (event: CalendarEvent) => {
    const startDate = formatDateForURL(event.startDate);
    const endDate = formatDateForURL(event.endDate);
    
    const calendarURL = `calshow:${startDate}`;
    window.location.href = calendarURL;
  };

  const addToAndroidCalendar = (event: CalendarEvent) => {
    const startTime = event.startDate.getTime();
    const endTime = event.endDate.getTime();
    
    const intent = `intent://calendar.google.com/calendar/event?` +
      `action=TEMPLATE&` +
      `text=${encodeURIComponent(event.title)}&` +
      `dates=${formatDateForGoogle(event.startDate)}/${formatDateForGoogle(event.endDate)}&` +
      `details=${encodeURIComponent(event.description || '')}&` +
      `location=${encodeURIComponent(event.location || '')}` +
      `#Intent;scheme=https;package=com.google.android.calendar;end`;
    
    window.location.href = intent;
  };

  const addToWebCalendar = (event: CalendarEvent) => {
    // Criar arquivo ICS para download
    const icsContent = generateICSContent(event);
    downloadICSFile(icsContent, `${event.title}.ics`);
  };

  const generateICSContent = (event: CalendarEvent): string => {
    const startDate = formatDateForICS(event.startDate);
    const endDate = formatDateForICS(event.endDate);
    const now = formatDateForICS(new Date());
    
    return [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Senhor Sorriso//App//EN',
      'BEGIN:VEVENT',
      `UID:${Date.now()}@senhorsorriso.com`,
      `DTSTAMP:${now}`,
      `DTSTART:${startDate}`,
      `DTEND:${endDate}`,
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.description || ''}`,
      `LOCATION:${event.location || ''}`,
      `URL:${event.url || ''}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');
  };

  const downloadICSFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  const formatDateForURL = (date: Date): string => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const formatDateForGoogle = (date: Date): string => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const formatDateForICS = (date: Date): string => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const addAppointmentToCalendar = async (appointmentData: {
    service: string;
    clinic: string;
    date: string;
    time: string;
    duration?: number;
  }) => {
    const [day, month, year] = appointmentData.date.split('/');
    const [hours, minutes] = appointmentData.time.split(':');
    
    const startDate = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hours),
      parseInt(minutes)
    );
    
    const endDate = new Date(startDate.getTime() + (appointmentData.duration || 60) * 60000);
    
    const event: CalendarEvent = {
      title: `${appointmentData.service} - Senhor Sorriso`,
      description: `Consulta de ${appointmentData.service} na unidade ${appointmentData.clinic}`,
      startDate,
      endDate,
      location: appointmentData.clinic,
      url: window.location.origin + '/profile'
    };
    
    return await addToCalendar(event);
  };

  return {
    isSupported,
    addToCalendar,
    addAppointmentToCalendar
  };
};
