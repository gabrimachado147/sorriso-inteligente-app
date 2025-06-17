
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, User, Calendar, Clock, MapPin } from 'lucide-react';
import { MessageTemplate } from '@/hooks/useMessageTemplates';
import { AppointmentRecord } from '@/services/supabase/appointments';

interface MessagePreviewModalProps {
  template: MessageTemplate | null;
  appointment: AppointmentRecord | null;
  previewMessage: (template: MessageTemplate, appointment: AppointmentRecord) => string;
  onClose: () => void;
}

export const MessagePreviewModal: React.FC<MessagePreviewModalProps> = ({
  template,
  appointment,
  previewMessage,
  onClose
}) => {
  if (!template || !appointment) return null;

  const processedMessage = previewMessage(template, appointment);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-lg">Visualizar Mensagem</CardTitle>
            <p className="text-sm text-gray-600">Template: {template.name}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Informações do Paciente */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <User className="h-4 w-4" />
              Dados do Paciente
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="font-medium">Nome:</span> {appointment.name}
              </div>
              <div>
                <span className="font-medium">Telefone:</span> {appointment.phone}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span className="font-medium">Data:</span> {new Date(appointment.date).toLocaleDateString('pt-BR')}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span className="font-medium">Horário:</span> {appointment.time}
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span className="font-medium">Clínica:</span> {appointment.clinic}
              </div>
              <div>
                <span className="font-medium">Serviço:</span> {appointment.service}
              </div>
            </div>
          </div>

          {/* Template Info */}
          <div>
            <h4 className="font-medium mb-2">Informações do Template</h4>
            <div className="space-y-2">
              <div>
                <span className="text-sm font-medium text-gray-600">Categoria:</span>
                <Badge variant="secondary" className="ml-2 text-xs">
                  {template.category === 'reminder' && 'Lembrete'}
                  {template.category === 'confirmation' && 'Confirmação'}
                  {template.category === 'rescheduling' && 'Reagendamento'}
                  {template.category === 'follow_up' && 'Pós-consulta'}
                  {template.category === 'marketing' && 'Marketing'}
                </Badge>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">Assunto:</span>
                <p className="text-sm mt-1">{template.subject}</p>
              </div>
            </div>
          </div>

          {/* Mensagem Processada */}
          <div>
            <h4 className="font-medium mb-2">Mensagem que será enviada</h4>
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
              <p className="text-sm whitespace-pre-wrap">{processedMessage}</p>
            </div>
          </div>

          {/* Variáveis Detectadas */}
          {template.variables.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Variáveis Utilizadas</h4>
              <div className="flex flex-wrap gap-2">
                {template.variables.map(variable => (
                  <Badge key={variable} variant="outline" className="text-xs">
                    {`{${variable}}`}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <Button onClick={onClose}>
              Fechar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
