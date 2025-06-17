
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { animations } from '@/lib/animations';
import { MessageTemplate } from '@/hooks/useMessageTemplates';

interface TemplateEditorProps {
  template?: MessageTemplate | null;
  onSave: (template: Omit<MessageTemplate, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

export const TemplateEditor: React.FC<TemplateEditorProps> = ({ template, onSave, onCancel }) => {
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
