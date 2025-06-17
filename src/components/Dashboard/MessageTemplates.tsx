
import React, { useState } from 'react';
import { toastSuccess, toastError } from '@/components/ui/custom-toast';
import { useMessageTemplates, type MessageTemplate } from '@/hooks/useMessageTemplates';
import { AppointmentRecord } from '@/services/supabase/appointments';
import { MessageTemplatesHeader } from './MessageTemplatesHeader';
import { TemplateCard } from './TemplateCard';
import { TemplateEditor } from './TemplateEditor';
import { MessagePreviewModal } from './MessagePreviewModal';

interface MessageTemplatesProps {
  onSendMessage?: (appointmentIds: string[], template: string) => void;
  appointments?: AppointmentRecord[];
}

export const MessageTemplates: React.FC<MessageTemplatesProps> = ({ 
  onSendMessage, 
  appointments = [] 
}) => {
  const { sendTemplateMessage, sendBulkReminders, previewMessage, isSending } = useMessageTemplates();
  
  const [templates, setTemplates] = useState<MessageTemplate[]>([
    {
      id: '1',
      name: 'Lembrete de Consulta',
      category: 'reminder',
      subject: 'Lembrete: Sua consulta é amanhã!',
      content: 'Olá {nome}! Lembramos que sua consulta está agendada para {data} às {horario} na {clinica}. Por favor, chegue 15 minutos antes. Qualquer dúvida, entre em contato conosco.',
      variables: ['nome', 'data', 'horario', 'clinica'],
      isActive: true,
      createdAt: new Date()
    },
    {
      id: '2',
      name: 'Confirmação de Agendamento',
      category: 'confirmation',
      subject: 'Agendamento Confirmado!',
      content: 'Parabéns {nome}! Seu agendamento foi confirmado para {data} às {horario}. Serviço: {servico}. Aguardamos você na {clinica}!',
      variables: ['nome', 'data', 'horario', 'servico', 'clinica'],
      isActive: true,
      createdAt: new Date()
    },
    {
      id: '3',
      name: 'Pós-Consulta',
      category: 'follow_up',
      subject: 'Como foi sua experiência?',
      content: 'Olá {nome}! Esperamos que tenha gostado do atendimento. Sua opinião é muito importante para nós. Avalie nosso serviço e ajude outros pacientes!',
      variables: ['nome'],
      isActive: true,
      createdAt: new Date()
    }
  ]);

  const [editingTemplate, setEditingTemplate] = useState<MessageTemplate | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [previewAppointment, setPreviewAppointment] = useState<AppointmentRecord | null>(null);

  const filteredTemplates = templates.filter(template => 
    selectedCategory === 'all' || template.category === selectedCategory
  );

  const handleSaveTemplate = (template: Omit<MessageTemplate, 'id' | 'createdAt'>) => {
    if (editingTemplate) {
      setTemplates(prev => prev.map(t => 
        t.id === editingTemplate.id 
          ? { ...template, id: editingTemplate.id, createdAt: editingTemplate.createdAt }
          : t
      ));
      toastSuccess('Template atualizado', 'Template salvo com sucesso!');
    } else {
      const newTemplate: MessageTemplate = {
        ...template,
        id: Date.now().toString(),
        createdAt: new Date()
      };
      setTemplates(prev => [newTemplate, ...prev]);
      toastSuccess('Template criado', 'Novo template adicionado!');
    }
    
    setEditingTemplate(null);
    setIsCreating(false);
  };

  const handleDeleteTemplate = (templateId: string) => {
    setTemplates(prev => prev.filter(t => t.id !== templateId));
    toastSuccess('Template excluído', 'Template removido com sucesso!');
  };

  const handleCopyTemplate = (template: MessageTemplate) => {
    navigator.clipboard.writeText(template.content);
    toastSuccess('Copiado!', 'Conteúdo copiado para a área de transferência');
  };

  const handleSendTemplate = async (template: MessageTemplate) => {
    if (appointments.length === 0) {
      toastError('Erro', 'Nenhum agendamento disponível para envio');
      return;
    }

    const confirmedAppointments = appointments.filter(apt => 
      apt.status === 'confirmed' || apt.status === 'pending'
    );

    if (confirmedAppointments.length === 0) {
      toastError('Erro', 'Nenhum agendamento confirmado/pendente encontrado');
      return;
    }

    const success = await sendTemplateMessage(template, confirmedAppointments);
    if (success && onSendMessage) {
      onSendMessage(confirmedAppointments.map(apt => apt.id), template.name);
    }
  };

  const handleQuickSendReminders = async () => {
    if (appointments.length === 0) {
      toastError('Erro', 'Nenhum agendamento disponível');
      return;
    }

    const today = new Date();
    const twoDaysFromNow = new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000);
    
    const upcomingAppointments = appointments.filter(apt => {
      const appointmentDate = new Date(apt.date);
      return apt.status === 'confirmed' && 
             appointmentDate >= today && 
             appointmentDate <= twoDaysFromNow;
    });

    if (upcomingAppointments.length === 0) {
      toastError('Info', 'Nenhum agendamento confirmado nos próximos 2 dias');
      return;
    }

    await sendBulkReminders(upcomingAppointments, 'reminder');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header centralizado */}
      <MessageTemplatesHeader
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        onCreateNew={() => setIsCreating(true)}
        onQuickSendReminders={handleQuickSendReminders}
        isSending={isSending}
      />

      {/* Templates Grid Centralizado */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 justify-items-center">
        {filteredTemplates.map(template => (
          <TemplateCard
            key={template.id}
            template={template}
            isSending={isSending}
            appointments={appointments}
            onCopy={handleCopyTemplate}
            onEdit={setEditingTemplate}
            onDelete={handleDeleteTemplate}
            onSend={handleSendTemplate}
            onPreview={setPreviewAppointment}
          />
        ))}
      </div>

      {/* Preview Modal */}
      <MessagePreviewModal
        previewAppointment={previewAppointment}
        templates={filteredTemplates}
        previewMessage={previewMessage}
        onClose={() => setPreviewAppointment(null)}
      />

      {/* Editor de Template */}
      {(isCreating || editingTemplate) && (
        <TemplateEditor
          template={editingTemplate}
          onSave={handleSaveTemplate}
          onCancel={() => {
            setEditingTemplate(null);
            setIsCreating(false);
          }}
        />
      )}
    </div>
  );
};
