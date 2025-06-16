import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Bell, Plus, Trash2, Edit2 } from 'lucide-react';
import { useReminders, type Reminder } from '@/hooks/useReminders';
import { toastSuccess } from '@/components/ui/custom-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const ReminderManager: React.FC = () => {
  const { reminders, createReminder, updateReminder, deleteReminder, getUpcomingReminders } = useReminders();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingReminder, setEditingReminder] = useState<string | null>(null);

  const [newReminder, setNewReminder] = useState({
    type: 'custom' as const,
    title: '',
    message: '',
    scheduledFor: '',
    advanceTime: 30,
    push: true,
    email: false
  });

  const handleCreateReminder = () => {
    if (!newReminder.title || !newReminder.scheduledFor) return;

    const reminderData: Omit<Reminder, 'id'> = {
      type: newReminder.type,
      title: newReminder.title,
      message: newReminder.message,
      scheduledFor: new Date(newReminder.scheduledFor),
      notificationSettings: {
        push: newReminder.push,
        email: newReminder.email,
        advanceTime: newReminder.advanceTime
      },
      active: true
    };

    createReminder(reminderData);
    setNewReminder({
      type: 'custom',
      title: '',
      message: '',
      scheduledFor: '',
      advanceTime: 30,
      push: true,
      email: false
    });
    setShowCreateForm(false);
    toastSuccess('Sucesso', 'Lembrete criado com sucesso!');
  };

  const handleToggleReminder = (id: string, active: boolean) => {
    updateReminder(id, { active });
  };

  const handleDeleteReminder = (id: string) => {
    deleteReminder(id);
    toastSuccess('Sucesso', 'Lembrete removido!');
  };

  const upcomingReminders = getUpcomingReminders();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Meus Lembretes
          </CardTitle>
          <Button
            onClick={() => setShowCreateForm(!showCreateForm)}
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Lembrete
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {showCreateForm && (
            <Card className="p-4 bg-blue-50">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Título</Label>
                    <Input
                      id="title"
                      value={newReminder.title}
                      onChange={(e) => setNewReminder(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Ex: Lembrete de consulta"
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Tipo</Label>
                    <Select
                      value={newReminder.type}
                      onValueChange={(value: string) => setNewReminder(prev => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="custom">Personalizado</SelectItem>
                        <SelectItem value="appointment">Consulta</SelectItem>
                        <SelectItem value="medication">Medicação</SelectItem>
                        <SelectItem value="checkup">Check-up</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="message">Mensagem</Label>
                  <Input
                    id="message"
                    value={newReminder.message}
                    onChange={(e) => setNewReminder(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Descrição do lembrete"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="scheduledFor">Data e Hora</Label>
                    <Input
                      id="scheduledFor"
                      type="datetime-local"
                      value={newReminder.scheduledFor}
                      onChange={(e) => setNewReminder(prev => ({ ...prev, scheduledFor: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="advanceTime">Avisar com antecedência (min)</Label>
                    <Select
                      value={newReminder.advanceTime.toString()}
                      onValueChange={(value) => setNewReminder(prev => ({ ...prev, advanceTime: parseInt(value) }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutos</SelectItem>
                        <SelectItem value="30">30 minutos</SelectItem>
                        <SelectItem value="60">1 hora</SelectItem>
                        <SelectItem value="1440">1 dia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="push"
                      checked={newReminder.push}
                      onCheckedChange={(checked) => setNewReminder(prev => ({ ...prev, push: checked }))}
                    />
                    <Label htmlFor="push">Notificação Push</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="email"
                      checked={newReminder.email}
                      onCheckedChange={(checked) => setNewReminder(prev => ({ ...prev, email: checked }))}
                    />
                    <Label htmlFor="email">Email</Label>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleCreateReminder}>
                    Criar Lembrete
                  </Button>
                  <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                    Cancelar
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {upcomingReminders.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              Nenhum lembrete próximo
            </p>
          ) : (
            <div className="space-y-3">
              {upcomingReminders.map((reminder) => (
                <div
                  key={reminder.id}
                  className="flex items-center justify-between p-3 bg-white border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{reminder.title}</h4>
                      <span className={`px-2 py-1 text-xs rounded ${
                        reminder.type === 'appointment' ? 'bg-blue-100 text-blue-800' :
                        reminder.type === 'medication' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {reminder.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{reminder.message}</p>
                    <p className="text-xs text-gray-500">
                      {format(reminder.scheduledFor, 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={reminder.active}
                      onCheckedChange={(checked) => handleToggleReminder(reminder.id, checked)}
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteReminder(reminder.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
