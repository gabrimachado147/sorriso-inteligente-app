
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Bell, Mail, MessageSquare, Smartphone } from 'lucide-react';
import { animations } from '@/lib/animations';
import { useNotificationPreferences } from '@/hooks/useNotificationPreferences';
import { toastSuccess, toastError } from '@/components/ui/custom-toast';

export const NotificationsTab = () => {
  const { preferences, updatePreferences, loading } = useNotificationPreferences();
  const [localPreferences, setLocalPreferences] = useState({
    email_reminders: true,
    push_notifications: true,
    sms_reminders: true,
    marketing_emails: false
  });

  useEffect(() => {
    if (preferences) {
      setLocalPreferences({
        email_reminders: preferences.email_reminders ?? true,
        push_notifications: preferences.push_notifications ?? true,
        sms_reminders: preferences.sms_reminders ?? true,
        marketing_emails: preferences.marketing_emails ?? false
      });
    }
  }, [preferences]);

  const handlePreferenceChange = async (key: string, value: boolean) => {
    const newPreferences = { ...localPreferences, [key]: value };
    setLocalPreferences(newPreferences);

    try {
      const result = await updatePreferences(newPreferences);
      if (result && result.success) {
        toastSuccess('Preferências atualizadas', 'Suas configurações foram salvas');
      }
    } catch (error) {
      // Reverter mudança em caso de erro
      setLocalPreferences(localPreferences);
      toastError('Erro', 'Não foi possível salvar as configurações');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

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
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium">Lembretes por Email</p>
                <p className="text-sm text-gray-600">Receba lembretes de consultas por email</p>
              </div>
            </div>
            <Switch
              checked={localPreferences.email_reminders}
              onCheckedChange={(value) => handlePreferenceChange('email_reminders', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Smartphone className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium">Notificações Push</p>
                <p className="text-sm text-gray-600">Receba notificações no dispositivo</p>
              </div>
            </div>
            <Switch
              checked={localPreferences.push_notifications}
              onCheckedChange={(value) => handlePreferenceChange('push_notifications', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-5 w-5 text-purple-600" />
              <div>
                <p className="font-medium">SMS</p>
                <p className="text-sm text-gray-600">Receba lembretes por SMS</p>
              </div>
            </div>
            <Switch
              checked={localPreferences.sms_reminders}
              onCheckedChange={(value) => handlePreferenceChange('sms_reminders', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-orange-600" />
              <div>
                <p className="font-medium">Emails Promocionais</p>
                <p className="text-sm text-gray-600">Receba ofertas e novidades</p>
              </div>
            </div>
            <Switch
              checked={localPreferences.marketing_emails}
              onCheckedChange={(value) => handlePreferenceChange('marketing_emails', value)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
