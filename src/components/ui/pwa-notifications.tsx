import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useNotifications } from '@/services/notifications';
import { 
  Bell, 
  BellOff, 
  Clock, 
  Calendar, 
  Gift, 
  Wifi, 
  Settings,
  Check,
  X
} from 'lucide-react';

interface NotificationSettings {
  appointments: boolean;
  promotions: boolean;
  offline: boolean;
  updates: boolean;
  reminders: boolean;
}

interface ScheduledNotification {
  id: string;
  type: 'appointment' | 'promotion' | 'reminder';
  title: string;
  scheduledFor: Date;
  sent: boolean;
}

export const PWANotificationCenter: React.FC = () => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [settings, setSettings] = useState<NotificationSettings>({
    appointments: true,
    promotions: true,
    offline: true,
    updates: true,
    reminders: true
  });
  const [scheduledNotifications, setScheduledNotifications] = useState<ScheduledNotification[]>([]);
  const [testNotificationSent, setTestNotificationSent] = useState(false);

  const { 
    requestPermission, 
    showNotification, 
    notifyAppointmentReminder,
    notifyPromotion,
    notifyOfflineMode,
    notifyUpdateAvailable
  } = useNotifications();

  useEffect(() => {
    // Check current permission
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }

    // Load settings from localStorage
    const savedSettings = localStorage.getItem('pwa-notification-settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }

    // Mock scheduled notifications
    setScheduledNotifications([
      {
        id: '1',
        type: 'appointment',
        title: 'Consulta de Limpeza - Dr. Silva',
        scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        sent: false
      },
      {
        id: '2',
        type: 'reminder',
        title: 'Lembrete: Escovação noturna',
        scheduledFor: new Date(Date.now() + 8 * 60 * 60 * 1000), // In 8 hours
        sent: false
      }
    ]);
  }, []);

  const handlePermissionRequest = async () => {
    const newPermission = await requestPermission();
    setPermission(newPermission);
  };

  const updateSetting = (key: keyof NotificationSettings, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('pwa-notification-settings', JSON.stringify(newSettings));
  };

  const sendTestNotification = async () => {
    if (permission === 'granted') {
      await showNotification({
        title: '🦷 Teste do Sorriso Inteligente',
        body: 'Notificações estão funcionando perfeitamente!',
        tag: 'test-notification',
        data: { type: 'test' }
      });
      setTestNotificationSent(true);
      setTimeout(() => setTestNotificationSent(false), 3000);
    }
  };

  const sendSampleAppointmentReminder = async () => {
    if (permission === 'granted') {
      await notifyAppointmentReminder({
        service: 'Implante',
        clinic: 'Sorriso Campo Belo',
        date: 'Hoje',
        time: '14:00'
      });
    }
  };

  const sendSamplePromotion = async () => {
    if (permission === 'granted') {
      await notifyPromotion({
        title: 'Promoção Especial',
        description: '30% de desconto em clareamento dental! Válido até sexta-feira.',
        validUntil: 'Sexta-feira'
      });
    }
  };

  const getPermissionBadge = () => {
    switch (permission) {
      case 'granted':
        return <Badge variant="default" className="flex items-center gap-1">
          <Bell className="h-3 w-3" />
          Permitido
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

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `Em ${days} dia${days > 1 ? 's' : ''}`;
    if (hours > 0) return `Em ${hours} hora${hours > 1 ? 's' : ''}`;
    return 'Agora';
  };

  return (
    <Card className="border-purple-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Bell className="h-5 w-5 text-purple-600" />
          Notification Center
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
              <Button size="sm" onClick={handlePermissionRequest}>
                Ativar
              </Button>
            </div>
          </div>
        )}

        {/* Notification Settings */}
        <div className="space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Configurações
          </h4>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                <span className="text-sm">Lembretes de consultas</span>
              </div>
              <Switch 
                checked={settings.appointments}
                onCheckedChange={(checked) => updateSetting('appointments', checked)}
                disabled={permission !== 'granted'}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gift className="h-4 w-4 text-green-600" />
                <span className="text-sm">Promoções e ofertas</span>
              </div>
              <Switch 
                checked={settings.promotions}
                onCheckedChange={(checked) => updateSetting('promotions', checked)}
                disabled={permission !== 'granted'}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wifi className="h-4 w-4 text-orange-600" />
                <span className="text-sm">Status de conexão</span>
              </div>
              <Switch 
                checked={settings.offline}
                onCheckedChange={(checked) => updateSetting('offline', checked)}
                disabled={permission !== 'granted'}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-purple-600" />
                <span className="text-sm">Lembretes de higiene</span>
              </div>
              <Switch 
                checked={settings.reminders}
                onCheckedChange={(checked) => updateSetting('reminders', checked)}
                disabled={permission !== 'granted'}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Scheduled Notifications */}
        <div className="space-y-3">
          <h4 className="font-medium">Próximas Notificações</h4>
          
          {scheduledNotifications.length > 0 ? (
            <div className="space-y-2">
              {scheduledNotifications.map((notification) => (
                <div 
                  key={notification.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="p-2 bg-white rounded-full">
                    {notification.type === 'appointment' && <Calendar className="h-4 w-4 text-blue-600" />}
                    {notification.type === 'reminder' && <Clock className="h-4 w-4 text-purple-600" />}
                    {notification.type === 'promotion' && <Gift className="h-4 w-4 text-green-600" />}
                  </div>
                  
                  <div className="flex-1">
                    <div className="font-medium text-sm">{notification.title}</div>
                    <div className="text-xs text-gray-600">
                      {formatDate(notification.scheduledFor)}
                    </div>
                  </div>
                  
                  {notification.sent ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Badge variant="outline" className="text-xs">
                      Agendada
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500 text-sm">
              Nenhuma notificação agendada
            </div>
          )}
        </div>

        <Separator />

        {/* Test Notifications */}
        {permission === 'granted' && (
          <div className="space-y-2">
            <h4 className="font-medium">Testar Notificações</h4>
            
            <div className="grid grid-cols-1 gap-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={sendTestNotification}
                disabled={testNotificationSent}
                className="w-full"
              >
                {testNotificationSent ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Enviado!
                  </>
                ) : (
                  <>
                    <Bell className="h-4 w-4 mr-2" />
                    Teste Geral
                  </>
                )}
              </Button>
              
              <Button 
                size="sm" 
                variant="outline"
                onClick={sendSampleAppointmentReminder}
                className="w-full"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Lembrete de Consulta
              </Button>
              
              <Button 
                size="sm" 
                variant="outline"
                onClick={sendSamplePromotion}
                className="w-full"
              >
                <Gift className="h-4 w-4 mr-2" />
                Promoção
              </Button>
            </div>
          </div>
        )}

        {/* Statistics */}
        <div className="p-3 bg-gray-50 rounded-lg">
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
};
