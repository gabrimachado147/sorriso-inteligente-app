
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Users } from 'lucide-react';

interface MessageTemplatesHeaderProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  onCreateNew: () => void;
  onQuickSendReminders: () => void;
  isSending: boolean;
}

export const MessageTemplatesHeader: React.FC<MessageTemplatesHeaderProps> = ({
  selectedCategory,
  setSelectedCategory,
  onCreateNew,
  onQuickSendReminders,
  isSending
}) => {
  return (
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
        
        <Button onClick={onCreateNew} size="sm">
          <Plus className="h-4 w-4 mr-1" />
          Novo Template
        </Button>

        <Button 
          onClick={onQuickSendReminders} 
          variant="outline" 
          size="sm"
          disabled={isSending}
        >
          <Users className="h-4 w-4 mr-1" />
          {isSending ? 'Enviando...' : 'Enviar Lembretes'}
        </Button>
      </div>
    </div>
  );
};
