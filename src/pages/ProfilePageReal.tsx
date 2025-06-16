
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  User, 
  Bell, 
  Shield, 
  Gamepad2, 
  Accessibility,
  History,
  LogOut,
  Lock
} from 'lucide-react';
import { animations } from '@/lib/animations';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useRealUserAppointments } from '@/hooks/useRealUserAppointments';
import { useNotificationPreferences } from '@/hooks/useNotificationPreferences';
import { useGamificationData } from '@/hooks/useGamificationData';
import { ProfileTabReal } from '@/components/Profile/ProfileTabReal';
import { HistoryTabReal } from '@/components/Profile/HistoryTabReal';
import { NotificationsTab } from '@/components/Profile/NotificationsTab';
import { GamificationTab } from '@/components/Profile/GamificationTab';
import { AccessibilityTab } from '@/components/Profile/AccessibilityTab';
import { SecurityTab } from '@/components/Profile/SecurityTab';
import { toastSuccess, toastError } from '@/components/ui/custom-toast';

const ProfilePageReal = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile();
  const { loading: appointmentsLoading } = useRealUserAppointments();
  const { loading: preferencesLoading } = useNotificationPreferences();
  const { loading: gamificationLoading } = useGamificationData();
  
  const [activeTab, setActiveTab] = useState('profile');

  // Redirecionar para login se não estiver autenticado
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = async () => {
    try {
      const result = await logout();
      if (result.success) {
        toastSuccess('Logout realizado', 'Você foi desconectado com sucesso');
        navigate('/auth');
      } else {
        toastError('Erro', 'Não foi possível fazer logout');
      }
    } catch (error) {
      toastError('Erro', 'Erro interno do sistema');
    }
  };

  // Mostrar loading enquanto verifica autenticação
  if (!isAuthenticated) {
    return null; // Componente será redirecionado pelo useEffect
  }

  if (profileLoading || appointmentsLoading || preferencesLoading || gamificationLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold">Meu Perfil</h1>
          <Badge variant="secondary" className="px-3 py-1">
            {profile?.nome_completo || user?.email || 'Usuário'}
          </Badge>
        </div>
        <Button 
          variant="outline" 
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <LogOut className="h-4 w-4" />
          Sair
        </Button>
      </div>

      {/* Staff Access Card */}
      <div className={`flex justify-center ${animations.slideInTop}`}>
        <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm border-primary/20 shadow-lg mobile-card-spacing">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="bg-primary rounded-full p-3">
                <Lock className="h-6 w-6 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl text-primary mobile-text-xl">Acesso Funcionários</CardTitle>
            <p className="text-muted-foreground mobile-text-base">
              Selecione sua clínica e digite a senha para acessar os agendamentos
            </p>
          </CardHeader>
          <CardContent className="text-center">
            <Button 
              size="lg" 
              className="w-full text-lg font-semibold mobile-touch-target" 
              onClick={() => navigate('/appointments')}
            >
              Entrar
            </Button>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Histórico
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notificações
          </TabsTrigger>
          <TabsTrigger value="gamification" className="flex items-center gap-2">
            <Gamepad2 className="h-4 w-4" />
            Gamificação
          </TabsTrigger>
          <TabsTrigger value="accessibility" className="flex items-center gap-2">
            <Accessibility className="h-4 w-4" />
            Acessibilidade
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Segurança
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileTabReal onTabChange={setActiveTab} />
        </TabsContent>

        <TabsContent value="history">
          <HistoryTabReal />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationsTab />
        </TabsContent>

        <TabsContent value="gamification">
          <GamificationTab />
        </TabsContent>

        <TabsContent value="accessibility">
          <AccessibilityTab />
        </TabsContent>

        <TabsContent value="security">
          <SecurityTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePageReal;
