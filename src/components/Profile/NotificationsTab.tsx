
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Bell } from 'lucide-react';
import { animations } from '@/lib/animations';
import { useNotificationPreferences } from '@/hooks/useNotificationPreferences';
import { toastSuccess, toastError } from '@/components/ui/custom-toast';

export const NotificationsTab = () => {
  const { preferences, updatePreferences } = useNotificationPreferences();

  const handleNotificationToggle = async (key: string, value: boolean) => {
    if (!preferences) return;
    
    try {
      const result = await updatePreferences({ [key]: value });
      if (result && result.success) {
        toastSuccess('Configuração salva', 'Preferências de notificação atualizadas');
      }
    } catch (error) {
      toastError('Erro', 'Não foi possível atualizar as configurações');
    }
  };

  return (
    <div className="space-y-6">
      <Card className={animations.fadeIn}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Preferências de Notificação
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email-reminders">Lembretes por Email</Label>
              <p className="text-sm text-gray-600">Receber lembretes de consultas por email</p>
            </div>
            <Switch
              id="email-reminders"
              checked={preferences?.email_reminders || false}
              onCheckedChange={(checked) => handleNotificationToggle('email_reminders', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="sms-reminders">Lembretes por SMS</Label>
              <p className="text-sm text-gray-600">Receber lembretes de consultas por SMS</p>
            </div>
            <Switch
              id="sms-reminders"
              checked={preferences?.sms_reminders || false}
              onCheckedChange={(checked) => handleNotificationToggle('sms_reminders', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="push-notifications">Notificações Push</Label>
              <p className="text-sm text-gray-600">Receber notificações no navegador</p>
            </div>
            <Switch
              id="push-notifications"
              checked={preferences?.push_notifications || false}
              onCheckedChange={(checked) => handleNotificationToggle('push_notifications', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="marketing-emails">Emails Promocionais</Label>
              <p className="text-sm text-gray-600">Receber ofertas e novidades</p>
            </div>
            <Switch
              id="marketing-emails"
              checked={preferences?.marketing_emails || false}
              onCheckedChange={(checked) => handleNotificationToggle('marketing_emails', checked)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
