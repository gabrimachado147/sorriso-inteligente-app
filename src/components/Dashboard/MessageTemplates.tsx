import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageSquare, Edit, Trash2, Plus, Send, Copy, Eye, Users } from 'lucide-react';
import { animations } from '@/lib/animations';
import { toastSuccess, toastError } from '@/components/ui/custom-toast';
import { useMessageTemplates, type MessageTemplate } from '@/hooks/useMessageTemplates';
import { AppointmentRecord } from '@/services/supabase/appointments';

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

    // Para demonstração, vamos usar agendamentos confirmados
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

    // Enviar lembretes para agendamentos confirmados dos próximos 2 dias
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

  const extractVariables = (content: string): string[] => {
    const matches = content.match(/\{([^}]+)\}/g);
    return matches ? matches.map(match => match.slice(1, -1)) : [];
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header centralizado */}
      <div className="text-center space-y-4">
        <div>
          <h3 className="text-xl font-semibold">Templates de Mensagens</h3>
          <p className="text-sm text-gray-600">Gerencie templates para comunicação com pacientes</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="reminder">Lembretes</SelectItem>
              <SelectItem value="confirmation">Confirmações</SelectItem>
              <SelectItem value="rescheduling">Reagendamento</SelectItem>
              <SelectItem value="follow_up">Pós-consulta</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={() => setIsCreating(true)} size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Novo Template
          </Button>

          <Button 
            onClick={handleQuickSendReminders} 
            variant="outline" 
            size="sm"
            disabled={isSending}
          >
            <Users className="h-4 w-4 mr-1" />
            {isSending ? 'Enviando...' : 'Enviar Lembretes'}
          </Button>
        </div>
      </div>

      {/* Templates Grid Centralizado */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 justify-items-center">
        {filteredTemplates.map(template => (
          <Card key={template.id} className={`${animations.fadeIn} hover:shadow-md transition-shadow w-full max-w-sm`}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-sm font-medium">{template.name}</CardTitle>
                  <Badge 
                    variant="secondary" 
                    className={`mt-1 text-xs ${categoryColors[template.category]}`}
                  >
                    {categoryLabels[template.category]}
                  </Badge>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopyTemplate(template)}
                    className="h-6 w-6 p-0"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingTemplate(template)}
                    className="h-6 w-6 p-0"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteTemplate(template.id)}
                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-medium text-gray-600 mb-1">Assunto:</p>
                  <p className="text-sm">{template.subject}</p>
                </div>
                
                <div>
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
                
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleSendTemplate(template)}
                    disabled={isSending}
                  >
                    <Send className="h-3 w-3 mr-1" />
                    {isSending ? 'Enviando...' : 'Enviar'}
                  </Button>
                  
                  {appointments.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPreviewAppointment(appointments[0])}
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Preview Modal */}
      {previewAppointment && (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Preview da Mensagem</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredTemplates.map(template => (
              <div key={template.id} className="mb-4 p-3 border rounded">
                <h4 className="font-medium">{template.name}</h4>
                <p className="text-sm text-gray-600 mt-1">
                  {previewMessage(template, previewAppointment)}
                </p>
              </div>
            ))}
            <Button onClick={() => setPreviewAppointment(null)} className="mt-4">
              Fechar
            </Button>
          </CardContent>
        </Card>
      )}

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

interface TemplateEditorProps {
  template?: MessageTemplate | null;
  onSave: (template: Omit<MessageTemplate, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

const TemplateEditor: React.FC<TemplateEditorProps> = ({ template, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: template?.name || '',
    category: template?.category || 'reminder' as const,
    subject: template?.subject || '',
    content: template?.content || '',
    isActive: template?.isActive ?? true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const variables = extractVariables(formData.content);
    onSave({ ...formData, variables });
  };

  const extractVariables = (content: string): string[] => {
    const matches = content.match(/\{([^}]+)\}/g);
    return matches ? matches.map(match => match.slice(1, -1)) : [];
  };

  const detectedVariables = extractVariables(formData.content);

  return (
    <Card className={`${animations.slideInTop} max-w-4xl mx-auto`}>
      <CardHeader>
        <CardTitle className="text-lg text-center">
          {template ? 'Editar Template' : 'Novo Template'}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nome</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nome do template"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Categoria</label>
              <Select value={formData.category} onValueChange={(value: any) => setFormData(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="reminder">Lembrete</SelectItem>
                  <SelectItem value="confirmation">Confirmação</SelectItem>
                  <SelectItem value="rescheduling">Reagendamento</SelectItem>
                  <SelectItem value="follow_up">Pós-consulta</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Assunto</label>
            <Input
              value={formData.subject}
              onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
              placeholder="Assunto da mensagem"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Conteúdo</label>
            <Textarea
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Conteúdo da mensagem. Use {variavel} para inserir dados dinâmicos."
              rows={6}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Use chaves para variáveis: {'{nome}'}, {'{data}'}, {'{horario}'}, etc.
            </p>
          </div>
          
          {detectedVariables.length > 0 && (
            <div>
              <label className="block text-sm font-medium mb-1">Variáveis Detectadas</label>
              <div className="flex flex-wrap gap-1">
                {detectedVariables.map(variable => (
                  <Badge key={variable} variant="outline" className="text-xs">
                    {variable}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-center gap-4 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit">
              {template ? 'Atualizar' : 'Criar'} Template
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
