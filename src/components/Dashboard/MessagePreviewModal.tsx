
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageTemplate } from '@/hooks/useMessageTemplates';
import { AppointmentRecord } from '@/services/supabase/appointments';

interface MessagePreviewModalProps {
  previewAppointment: AppointmentRecord | null;
  templates: MessageTemplate[];
  previewMessage: (template: MessageTemplate, appointment: AppointmentRecord) => string;
  onClose: () => void;
}

export const MessagePreviewModal: React.FC<MessagePreviewModalProps> = ({
  previewAppointment,
  templates,
  previewMessage,
  onClose
}) => {
  if (!previewAppointment) return null;

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Preview da Mensagem</CardTitle>
      </CardHeader>
      <CardContent>
        {templates.map(template => (
          <div key={template.id} className="mb-4 p-3 border rounded">
            <h4 className="font-medium">{template.name}</h4>
            <p className="text-sm text-gray-600 mt-1">
              {previewMessage(template, previewAppointment)}
            </p>
          </div>
        ))}
        <Button onClick={onClose} className="mt-4">
          Fechar
        </Button>
      </CardContent>
    </Card>
  );
};
