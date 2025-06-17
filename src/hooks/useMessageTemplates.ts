
import { useState, useCallback } from 'react';
import { whatsappService } from '@/services/whatsapp';
import { toastSuccess, toastError } from '@/components/ui/custom-toast';
import { AppointmentRecord } from '@/services/supabase/appointments';

export interface MessageTemplate {
  id: string;
  name: string;
  category: 'reminder' | 'confirmation' | 'rescheduling' | 'follow_up' | 'marketing';
  subject: string;
  content: string;
  variables: string[];
  isActive: boolean;
  createdAt: Date;
}

export const useMessageTemplates = () => {
  const [isSending, setIsSending] = useState(false);

  const replaceVariables = useCallback((content: string, appointment: AppointmentRecord): string => {
    const variables = {
      nome: appointment.name,
      data: new Date(appointment.date).toLocaleDateString('pt-BR'),
      horario: appointment.time,
      clinica: appointment.clinic,
      servico: appointment.service,
      telefone: appointment.phone,
      status: appointment.status
    };

    let processedContent = content;
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`\\{${key}\\}`, 'g');
      processedContent = processedContent.replace(regex, value);
    });

    return processedContent;
  }, []);

  const sendTemplateMessage = useCallback(async (
    template: MessageTemplate,
    appointments: AppointmentRecord[]
  ): Promise<boolean> => {
    if (appointments.length === 0) {
      toastError('Erro', 'Nenhum agendamento selecionado para envio');
      return false;
    }

    setIsSending(true);
    let successCount = 0;
    let errorCount = 0;

    try {
      for (const appointment of appointments) {
        try {
          const personalizedMessage = replaceVariables(template.content, appointment);
          
          await whatsappService.sendMessage({
            to: appointment.phone,
            message: personalizedMessage
          });

          successCount++;
          
          // Pequena pausa entre envios para evitar rate limiting
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
          console.error(`Erro ao enviar mensagem para ${appointment.phone}:`, error);
          errorCount++;
        }
      }

      if (successCount > 0) {
        toastSuccess(
          'Mensagens Enviadas',
          `${successCount} mensagem(s) enviada(s) com sucesso${errorCount > 0 ? `. ${errorCount} falha(s)` : ''}`
        );
      }

      if (errorCount > 0 && successCount === 0) {
        toastError('Erro no Envio', 'Não foi possível enviar nenhuma mensagem');
      }

      return successCount > 0;
    } catch (error) {
      console.error('Erro geral no envio de mensagens:', error);
      toastError('Erro', 'Falha no sistema de envio de mensagens');
      return false;
    } finally {
      setIsSending(false);
    }
  }, [replaceVariables]);

  const sendBulkReminders = useCallback(async (
    appointments: AppointmentRecord[],
    templateType: 'reminder' | 'confirmation' = 'reminder'
  ): Promise<boolean> => {
    const reminderTemplate: MessageTemplate = {
      id: 'auto-reminder',
      name: 'Lembrete Automático',
      category: templateType,
      subject: 'Lembrete de Consulta',
      content: templateType === 'reminder' 
        ? 'Olá {nome}! Lembramos que sua consulta está agendada para {data} às {horario} na {clinica}. Por favor, chegue 15 minutos antes.'
        : 'Olá {nome}! Sua consulta foi confirmada para {data} às {horario} na {clinica}. Aguardamos você!',
      variables: ['nome', 'data', 'horario', 'clinica'],
      isActive: true,
      createdAt: new Date()
    };

    return await sendTemplateMessage(reminderTemplate, appointments);
  }, [sendTemplateMessage]);

  const previewMessage = useCallback((
    template: MessageTemplate,
    appointment: AppointmentRecord
  ): string => {
    return replaceVariables(template.content, appointment);
  }, [replaceVariables]);

  return {
    sendTemplateMessage,
    sendBulkReminders,
    previewMessage,
    isSending
  };
};
