import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  Bell, 
  BellOff, 
  Clock, 
  Calendar, 
  MessageCircle,
  Stethoscope,
  AlertTriangle,
  CheckCircle,
  Settings,
  Trash2,
  Plus
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface NotificationSettings {
  appointments: boolean;
  reminders: boolean;
  updates: boolean;
  emergency: boolean;
  chat: boolean;
}

interface ScheduledNotification {
  id: string;
  title: string;
  body: string;
  scheduledTime: Date;
  type: 'appointment' | 'reminder' | 'update' | 'emergency';
  enabled: boolean;
}

export function PWANotificationCenter() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [settings, setSettings] = useState<NotificationSettings>({
    appointments: true,
    reminders: true,
    updates: true,
    emergency: true,
    chat: false
  });
  const [scheduledNotifications, setScheduledNotifications] = useState<ScheduledNotification[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize notification permission and settings
  useEffect(() => {
    setPermission(Notification.permission);
    
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('pwa-notification-settings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('[PWANotifications] Failed to parse settings:', error);
      }
    }

    // Load scheduled notifications
    loadScheduledNotifications();
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('pwa-notification-settings', JSON.stringify(settings));
  }, [settings]);

  const loadScheduledNotifications = () => {
    const saved = localStorage.getItem('pwa-scheduled-notifications');
    if (saved) {
      try {
        const notifications = JSON.parse(saved).map((n: ScheduledNotification & { scheduledTime: string }) => ({
          ...n,
          scheduledTime: new Date(n.scheduledTime)
        }));
        setScheduledNotifications(notifications);
      } catch (error) {
        console.error('[PWANotifications] Failed to parse scheduled notifications:', error);
      }
    }
  };

  const saveScheduledNotifications = (notifications: ScheduledNotification[]) => {
    localStorage.setItem('pwa-scheduled-notifications', JSON.stringify(notifications));
    setScheduledNotifications(notifications);
  };

  const requestPermission = async () => {
    setIsLoading(true);
    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      
      if (result === 'granted') {
        toast({
          title: "Notificações ativadas",
          description: "Você receberá lembretes importantes sobre suas consultas.",
        });
        
        // Show a test notification
        showTestNotification();
      } else {
        toast({
          title: "Permissão negada",
          description: "Você pode ativar as notificações nas configurações do navegador.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('[PWANotifications] Permission request failed:', error);
      toast({
        title: "Erro",
        description: "Não foi possível solicitar permissão para notificações.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const showTestNotification = () => {
    if (permission === 'granted') {
      new Notification('Sorriso Inteligente', {
        body: 'Notificações ativadas com sucesso! 🦷',
        icon: '/icons/icon-192x192.svg',
        badge: '/icons/icon-72x72.svg',
        tag: 'test-notification'
      });
    }
  };

  const scheduleNotification = useCallback((
    title: string,
    body: string,
    scheduledTime: Date,
    type: ScheduledNotification['type']
  ) => {
    const notification: ScheduledNotification = {
      id: `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title,
      body,
      scheduledTime,
      type,
      enabled: true
    };

    const updated = [...scheduledNotifications, notification];
    saveScheduledNotifications(updated);

    // Schedule the actual notification
    const timeUntilNotification = scheduledTime.getTime() - Date.now();
    if (timeUntilNotification > 0) {
      setTimeout(() => {
        // Map notification type to settings key
        const settingsKey = notification.type === 'appointment' ? 'appointments' : notification.type;
        if (permission === 'granted' && settings[settingsKey as keyof NotificationSettings]) {
          new Notification(title, {
            body,
            icon: '/icons/icon-192x192.svg',
            badge: '/icons/icon-72x72.svg',
            tag: notification.id,
            requireInteraction: notification.type === 'emergency'
          });
        }
      }, timeUntilNotification);
    }

    toast({
      title: "Lembrete agendado",
      description: `Notificação será enviada em ${formatDate(scheduledTime)}`,
    });
  }, [scheduledNotifications, permission, settings]);

  const removeScheduledNotification = (id: string) => {
    const updated = scheduledNotifications.filter(n => n.id !== id);
    saveScheduledNotifications(updated);
    
    toast({
      title: "Lembrete removido",
      description: "A notificação foi cancelada.",
    });
  };

  const toggleNotificationEnabled = (id: string) => {
    const updated = scheduledNotifications.map(n => 
      n.id === id ? { ...n, enabled: !n.enabled } : n
    );
    saveScheduledNotifications(updated);
  };

  const updateSetting = (key: keyof NotificationSettings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const scheduleAppointmentReminder = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);

    scheduleNotification(
      'Lembrete de Consulta',
      'Você tem uma consulta agendada para hoje às 14:00',
      tomorrow,
      'appointment'
    );
  };

  const scheduleMaintenanceReminder = () => {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    nextWeek.setHours(10, 0, 0, 0);

    scheduleNotification(
      'Hora da Limpeza Dental',
      'Está na hora de agendar sua limpeza dental semestral!',
      nextWeek,
      'reminder'
    );
  };

  const getPermissionBadge = () => {
    switch (permission) {
      case 'granted':
        return <Badge variant="default" className="flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          Ativo
        </Badge>;
      case 'denied':
        return <Badge variant="destructive" className="flex items-center gap-1">
          <BellOff className="h-3 w-3" />
          Negado
        </Badge>;
      default:
        return <Badge variant="secondary" className="flex items-center gap-1">
          <Bell className="h-3 w-3" />
          Pendente
        </Badge>;
    }
  };

  const getTypeIcon = (type: ScheduledNotification['type']) => {
    switch (type) {
      case 'appointment':
        return <Calendar className="h-4 w-4 text-blue-500" />;
      case 'reminder':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'emergency':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'update':
        return <Settings className="h-4 w-4 text-gray-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `em ${days} dia${days > 1 ? 's' : ''}`;
    if (hours > 0) return `em ${hours} hora${hours > 1 ? 's' : ''}`;
    return 'agora';
  };

  return (
    <Card className="border-purple-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Bell className="h-5 w-5 text-purple-600" />
          Central de Notificações
          {getPermissionBadge()}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Permission Request */}
        {permission !== 'granted' && (
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-purple-600" />
              <div className="flex-1">
                <h4 className="font-medium text-purple-800">Ativar Notificações</h4>
                <p className="text-sm text-purple-600">
                  Receba lembretes importantes sobre suas consultas
                </p>
              </div>
              <Button 
                size="sm" 
                onClick={requestPermission}
                disabled={isLoading}
              >
                Ativar
              </Button>
            </div>
          </div>
        )}

        {/* Notification Settings */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Configurações</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-500" />
                <span className="text-sm">Consultas agendadas</span>
              </div>
              <Switch
                checked={settings.appointments}
                onCheckedChange={(checked) => updateSetting('appointments', checked)}
                disabled={permission !== 'granted'}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-yellow-500" />
                <span className="text-sm">Lembretes de manutenção</span>
              </div>
              <Switch
                checked={settings.reminders}
                onCheckedChange={(checked) => updateSetting('reminders', checked)}
                disabled={permission !== 'granted'}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Mensagens do chat</span>
              </div>
              <Switch
                checked={settings.chat}
                onCheckedChange={(checked) => updateSetting('chat', checked)}
                disabled={permission !== 'granted'}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <span className="text-sm">Emergências</span>
              </div>
              <Switch
                checked={settings.emergency}
                onCheckedChange={(checked) => updateSetting('emergency', checked)}
                disabled={permission !== 'granted'}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-gray-500" />
                <span className="text-sm">Atualizações do app</span>
              </div>
              <Switch
                checked={settings.updates}
                onCheckedChange={(checked) => updateSetting('updates', checked)}
                disabled={permission !== 'granted'}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Quick Schedule Actions */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Agendar Lembretes</h4>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={scheduleAppointmentReminder}
              disabled={permission !== 'granted'}
              className="flex-1"
            >
              <Plus className="h-3 w-3 mr-1" />
              Consulta
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={scheduleMaintenanceReminder}
              disabled={permission !== 'granted'}
              className="flex-1"
            >
              <Plus className="h-3 w-3 mr-1" />
              Limpeza
            </Button>
          </div>
        </div>

        {/* Scheduled Notifications */}
        {scheduledNotifications.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Lembretes Agendados</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {scheduledNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg text-sm"
                >
                  {getTypeIcon(notification.type)}
                  <div className="flex-1">
                    <div className="font-medium">{notification.title}</div>
                    <div className="text-gray-600 text-xs">
                      {formatDate(notification.scheduledTime)}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Switch
                      checked={notification.enabled}
                      onCheckedChange={() => toggleNotificationEnabled(notification.id)}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeScheduledNotification(notification.id)}
                      className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Test Notification */}
        {permission === 'granted' && (
          <div className="pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={showTestNotification}
              className="w-full"
            >
              <Bell className="h-3 w-3 mr-1" />
              Testar Notificação
            </Button>
          </div>
        )}

        {/* Statistics */}
        <div className="pt-2 border-t">
          <div className="text-sm font-medium mb-2">Estatísticas</div>
          <div className="grid grid-cols-3 gap-2 text-xs text-center">
            <div>
              <div className="font-medium">0</div>
              <div className="text-gray-600">Enviadas</div>
            </div>
            <div>
              <div className="font-medium">{scheduledNotifications.length}</div>
              <div className="text-gray-600">Agendadas</div>
            </div>
            <div>
              <div className="font-medium">100%</div>
              <div className="text-gray-600">Taxa de entrega</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default PWANotificationCenter;
