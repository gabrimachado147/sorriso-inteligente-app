
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  User, 
  Bell, 
  Shield, 
  Gamepad2, 
  Accessibility,
  History,
  LogOut
} from 'lucide-react';
import { animations } from '@/lib/animations';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useUserAppointments } from '@/hooks/useUserAppointments';
import { useNotificationPreferences } from '@/hooks/useNotificationPreferences';
import { useGamificationData } from '@/hooks/useGamificationData';
import { ProfileTab } from '@/components/Profile/ProfileTab';
import { HistoryTab } from '@/components/Profile/HistoryTab';
import { NotificationsTab } from '@/components/Profile/NotificationsTab';
import { GamificationTab } from '@/components/Profile/GamificationTab';
import { AccessibilityTab } from '@/components/Profile/AccessibilityTab';
import { SecurityTab } from '@/components/Profile/SecurityTab';
import { toastSuccess, toastError } from '@/components/ui/custom-toast';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const { loading: appointmentsLoading } = useUserAppointments();
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
      <div className="mobile-container">
        <div className="animate-pulse mobile-spacing">
          <div className="h-6 md:h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-20 md:h-32 bg-gray-200 rounded"></div>
          <div className="h-40 md:h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`mobile-container mobile-spacing ${animations.pageEnter}`}>
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <div className="flex items-center gap-2 md:gap-4">
          <h1 className="mobile-title md:text-3xl font-bold">Meu Perfil</h1>
          <Badge variant="secondary" className="px-2 py-1 md:px-3 text-xs md:text-sm">
            {profile?.nome_completo || user?.email || 'Usuário'}
          </Badge>
        </div>
        <Button 
          variant="outline" 
          onClick={handleLogout}
          className="flex items-center gap-1 md:gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 text-xs md:text-sm mobile-button"
        >
          <LogOut className="h-3 w-3 md:h-4 md:w-4" />
          <span className="hidden md:inline">Sair</span>
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mobile-spacing">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 gap-1">
          <TabsTrigger value="profile" className="flex items-center gap-1 text-xs md:text-sm p-2 md:p-3">
            <User className="h-3 w-3 md:h-4 md:w-4" />
            <span className="hidden md:inline">Perfil</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-1 text-xs md:text-sm p-2 md:p-3">
            <History className="h-3 w-3 md:h-4 md:w-4" />
            <span className="hidden md:inline">Histórico</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-1 text-xs md:text-sm p-2 md:p-3">
            <Bell className="h-3 w-3 md:h-4 md:w-4" />
            <span className="hidden md:inline">Notificações</span>
          </TabsTrigger>
          <TabsTrigger value="gamification" className="flex items-center gap-1 text-xs md:text-sm p-2 md:p-3">
            <Gamepad2 className="h-3 w-3 md:h-4 md:w-4" />
            <span className="hidden md:inline">Gamificação</span>
          </TabsTrigger>
          <TabsTrigger value="accessibility" className="flex items-center gap-1 text-xs md:text-sm p-2 md:p-3">
            <Accessibility className="h-3 w-3 md:h-4 md:w-4" />
            <span className="hidden md:inline">Acessibilidade</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-1 text-xs md:text-sm p-2 md:p-3">
            <Shield className="h-3 w-3 md:h-4 md:w-4" />
            <span className="hidden md:inline">Segurança</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileTab onTabChange={setActiveTab} />
        </TabsContent>

        <TabsContent value="history">
          <HistoryTab />
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

export default ProfilePage;
