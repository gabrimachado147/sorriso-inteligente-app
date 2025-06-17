
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Edit, Trash2, Send, Eye } from 'lucide-react';
import { animations } from '@/lib/animations';
import { MessageTemplate } from '@/hooks/useMessageTemplates';
import { AppointmentRecord } from '@/services/supabase/appointments';

interface TemplateCardProps {
  template: MessageTemplate;
  isSending: boolean;
  appointments: AppointmentRecord[];
  onCopy: (template: MessageTemplate) => void;
  onEdit: (template: MessageTemplate) => void;
  onDelete: (templateId: string) => void;
  onSend: (template: MessageTemplate) => void;
  onPreview: (template: MessageTemplate, appointment: AppointmentRecord) => void;
}

const categoryLabels = {
  reminder: 'Lembrete',
  confirmation: 'Confirmação',
  rescheduling: 'Reagendamento',
  follow_up: 'Pós-consulta',
  marketing: 'Marketing'
};

const categoryColors = {
  reminder: 'bg-blue-100 text-blue-700',
  confirmation: 'bg-green-100 text-green-700',
  rescheduling: 'bg-yellow-100 text-yellow-700',
  follow_up: 'bg-purple-100 text-purple-700',
  marketing: 'bg-pink-100 text-pink-700'
};

export const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  isSending,
  appointments,
  onCopy,
  onEdit,
  onDelete,
  onSend,
  onPreview
}) => {
  const handlePreview = () => {
    if (appointments.length > 0) {
      onPreview(template, appointments[0]);
    }
  };

  const handleDelete = () => {
    if (window.confirm(`Tem certeza que deseja excluir o template "${template.name}"?`)) {
      onDelete(template.id);
    }
  };

  return (
    <Card className={`${animations.fadeIn} hover:shadow-md transition-shadow w-full h-full flex flex-col`}>
      <CardHeader className="pb-3 flex-shrink-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-sm font-medium truncate">{template.name}</CardTitle>
            <Badge 
              variant="secondary" 
              className={`mt-1 text-xs ${categoryColors[template.category]}`}
            >
              {categoryLabels[template.category]}
            </Badge>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onCopy(template)}
              className="h-8 w-8 p-0"
              title="Copiar template"
            >
              <Copy className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(template)}
              className="h-8 w-8 p-0"
              title="Editar template"
            >
              <Edit className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
              title="Excluir template"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 flex-1 flex flex-col">
        <div className="space-y-3 flex-1">
          <div>
            <p className="text-xs font-medium text-gray-600 mb-1">Assunto:</p>
            <p className="text-sm line-clamp-2">{template.subject}</p>
          </div>
          
          <div className="flex-1">
            <p className="text-xs font-medium text-gray-600 mb-1">Conteúdo:</p>
            <p className="text-sm text-gray-700 line-clamp-3">{template.content}</p>
          </div>
          
          {template.variables.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-600 mb-1">Variáveis:</p>
              <div className="flex flex-wrap gap-1">
                {template.variables.map(variable => (
                  <Badge key={variable} variant="outline" className="text-xs">
                    {variable}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex gap-2 mt-4 pt-3 border-t">
          <Button 
            size="sm" 
            className="flex-1 min-w-0"
            onClick={() => onSend(template)}
            disabled={isSending || appointments.length === 0}
            title={appointments.length === 0 ? "Nenhum agendamento disponível" : "Enviar mensagem"}
          >
            <Send className="h-3 w-3 mr-1 flex-shrink-0" />
            <span className="truncate">{isSending ? 'Enviando...' : 'Enviar'}</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreview}
            className="flex-shrink-0"
            disabled={appointments.length === 0}
            title={appointments.length === 0 ? "Nenhum agendamento para visualizar" : "Visualizar mensagem"}
          >
            <Eye className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
