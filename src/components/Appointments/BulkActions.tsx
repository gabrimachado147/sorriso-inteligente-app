
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { CheckSquare, X, MessageSquare, Calendar, Users } from 'lucide-react';
import { AppointmentRecord } from '@/services/supabase/appointments';

interface BulkActionsProps {
  selectedAppointments: string[];
  appointments: AppointmentRecord[];
  onBulkStatusUpdate: (appointmentIds: string[], status: string) => void;
  onSendBulkMessage: (appointmentIds: string[], template: string) => void;
  onClearSelection: () => void;
}

export const BulkActions: React.FC<BulkActionsProps> = ({
  selectedAppointments,
  appointments,
  onBulkStatusUpdate,
  onSendBulkMessage,
  onClearSelection
}) => {
  const [bulkStatus, setBulkStatus] = useState<string>('');
  const [messageTemplate, setMessageTemplate] = useState<string>('');

  const selectedCount = selectedAppointments.length;
  const selectedAppts = appointments.filter(apt => selectedAppointments.includes(apt.id));

  if (selectedCount === 0) return null;

  const handleBulkStatusUpdate = () => {
    if (bulkStatus && selectedAppointments.length > 0) {
      onBulkStatusUpdate(selectedAppointments, bulkStatus);
      setBulkStatus('');
      onClearSelection();
    }
  };

  const handleSendMessages = () => {
    if (messageTemplate && selectedAppointments.length > 0) {
      onSendBulkMessage(selectedAppointments, messageTemplate);
      setMessageTemplate('');
      onClearSelection();
    }
  };

  return (
    <Card className="mb-4 border-blue-200 bg-blue-50">
      <CardContent className="p-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
          <div className="flex items-center gap-2">
            <CheckSquare className="h-5 w-5 text-blue-600" />
            <span className="font-medium">
              {selectedCount} agendamento{selectedCount > 1 ? 's' : ''} selecionado{selectedCount > 1 ? 's' : ''}
            </span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClearSelection}
              className="ml-2"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {selectedAppts.slice(0, 3).map(apt => (
              <Badge key={apt.id} variant="secondary" className="text-xs">
                {apt.name}
              </Badge>
            ))}
            {selectedCount > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{selectedCount - 3} mais
              </Badge>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-2 ml-auto">
            <div className="flex items-center gap-2">
              <Select value={bulkStatus} onValueChange={setBulkStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Alterar status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="confirmed">Confirmar</SelectItem>
                  <SelectItem value="cancelled">Cancelar</SelectItem>
                  <SelectItem value="completed">Concluir</SelectItem>
                  <SelectItem value="no_show">No Show</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                size="sm" 
                onClick={handleBulkStatusUpdate}
                disabled={!bulkStatus}
              >
                <Calendar className="h-4 w-4 mr-1" />
                Aplicar
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Select value={messageTemplate} onValueChange={setMessageTemplate}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Enviar mensagem" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="reminder">Lembrete de consulta</SelectItem>
                  <SelectItem value="confirmation">Confirmação</SelectItem>
                  <SelectItem value="rescheduling">Reagendamento</SelectItem>
                  <SelectItem value="follow_up">Pós-consulta</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                size="sm" 
                onClick={handleSendMessages}
                disabled={!messageTemplate}
              >
                <MessageSquare className="h-4 w-4 mr-1" />
                Enviar
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
