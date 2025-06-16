
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Smartphone, 
  Bell, 
  Download, 
  Wifi, 
  Battery,
  Shield,
  Palette
} from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';

interface PWASettingsPageProps {
  onNavigate: (page: string) => void;
}

export const PWASettingsPage: React.FC<PWASettingsPageProps> = ({ onNavigate }) => {
  const { 
    isInstallable, 
    isInstalled, 
    isOnline, 
    installApp,
    notificationPermission,
    requestNotificationPermission 
  } = usePWA();

  return (
    <div className="min-h-screen bg-background w-full">
      <div className="w-full px-4 py-6 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold mobile-text-xl flex items-center justify-center gap-2">
            <Settings className="h-6 w-6 text-primary" />
            Configurações PWA
          </h1>
          <p className="text-muted-foreground mobile-text-base mt-2">
            Configure sua experiência do aplicativo
          </p>
        </div>

        {/* Status do PWA */}
        <Card className="mobile-card-spacing">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 mobile-text-lg">
              <Smartphone className="h-5 w-5" />
              Status do Aplicativo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="mobile-text-base">Aplicativo Instalado</span>
              <Badge variant={isInstalled ? "default" : "secondary"}>
                {isInstalled ? "Sim" : "Não"}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="mobile-text-base">Status da Conexão</span>
              <Badge variant={isOnline ? "default" : "destructive"}>
                <Wifi className="h-3 w-3 mr-1" />
                {isOnline ? "Online" : "Offline"}
              </Badge>
            </div>

            {isInstallable && !isInstalled && (
              <Button 
                onClick={installApp} 
                className="w-full mobile-button"
              >
                <Download className="h-4 w-4 mr-2" />
                Instalar Aplicativo
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Notificações */}
        <Card className="mobile-card-spacing">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 mobile-text-lg">
              <Bell className="h-5 w-5" />
              Notificações
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="mobile-text-base font-medium">Notificações Push</p>
                <p className="text-sm text-muted-foreground mobile-text-sm">
                  Receba lembretes de consultas
                </p>
              </div>
              <Badge variant={
                notificationPermission === 'granted' ? 'default' :
                notificationPermission === 'denied' ? 'destructive' : 'secondary'
              }>
                {notificationPermission === 'granted' ? 'Ativado' :
                 notificationPermission === 'denied' ? 'Negado' : 'Pendente'}
              </Badge>
            </div>

            {notificationPermission !== 'granted' && (
              <Button
                onClick={requestNotificationPermission}
                variant="outline"
                className="w-full mobile-button"
              >
                Ativar Notificações
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Performance */}
        <Card className="mobile-card-spacing">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 mobile-text-lg">
              <Battery className="h-5 w-5" />
              Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="mobile-text-base font-medium">Modo Economia de Bateria</p>
                <p className="text-sm text-muted-foreground mobile-text-sm">
                  Reduz animações e sincronização
                </p>
              </div>
              <Switch />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="mobile-text-base font-medium">Cache Offline</p>
                <p className="text-sm text-muted-foreground mobile-text-sm">
                  Armazena dados para uso offline
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Segurança */}
        <Card className="mobile-card-spacing">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 mobile-text-lg">
              <Shield className="h-5 w-5" />
              Segurança
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="mobile-text-base font-medium">Autenticação Biométrica</p>
                <p className="text-sm text-muted-foreground mobile-text-sm">
                  Use impressão digital ou Face ID
                </p>
              </div>
              <Switch />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="mobile-text-base font-medium">Logout Automático</p>
                <p className="text-sm text-muted-foreground mobile-text-sm">
                  Sair após 30 minutos de inatividade
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Aparência */}
        <Card className="mobile-card-spacing">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 mobile-text-lg">
              <Palette className="h-5 w-5" />
              Aparência
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="mobile-text-base font-medium">Tema Escuro</p>
                <p className="text-sm text-muted-foreground mobile-text-sm">
                  Alternar entre tema claro e escuro
                </p>
              </div>
              <Switch />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="mobile-text-base font-medium">Animações</p>
                <p className="text-sm text-muted-foreground mobile-text-sm">
                  Ativar/desativar animações da interface
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
