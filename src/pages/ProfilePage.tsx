
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
          <div className="h-8 md:h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-24 md:h-32 bg-gray-200 rounded"></div>
          <div className="h-48 md:h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`mobile-container mobile-spacing ${animations.pageEnter}`}>
      <div className="flex items-center justify-between mb-6 md:mb-6">
        <div className="flex items-center gap-3 md:gap-4">
          <h1 className="mobile-title md:text-3xl font-bold">Meu Perfil</h1>
          <Badge variant="secondary" className="px-3 py-1 md:px-3 text-sm md:text-sm">
            {profile?.nome_completo || user?.email || 'Usuário'}
          </Badge>
        </div>
        <Button 
          variant="outline" 
          onClick={handleLogout}
          className="flex items-center gap-2 md:gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 mobile-button"
        >
          <LogOut className="h-4 w-4 md:h-4 md:w-4" />
          <span className="hidden md:inline">Sair</span>
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mobile-tabs">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 gap-1">
          <TabsTrigger value="profile" className="flex items-center gap-1 text-xs md:text-sm p-3 md:p-3">
            <User className="h-4 w-4 md:h-4 md:w-4" />
            <span className="hidden md:inline">Perfil</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-1 text-xs md:text-sm p-3 md:p-3">
            <History className="h-4 w-4 md:h-4 md:w-4" />
            <span className="hidden md:inline">Histórico</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-1 text-xs md:text-sm p-3 md:p-3">
            <Bell className="h-4 w-4 md:h-4 md:w-4" />
            <span className="hidden md:inline">Notificações</span>
          </TabsTrigger>
          <TabsTrigger value="gamification" className="flex items-center gap-1 text-xs md:text-sm p-3 md:p-3">
            <Gamepad2 className="h-4 w-4 md:h-4 md:w-4" />
            <span className="hidden md:inline">Gamificação</span>
          </TabsTrigger>
          <TabsTrigger value="accessibility" className="flex items-center gap-1 text-xs md:text-sm p-3 md:p-3">
            <Accessibility className="h-4 w-4 md:h-4 md:w-4" />
            <span className="hidden md:inline">Acessibilidade</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-1 text-xs md:text-sm p-3 md:p-3">
            <Shield className="h-4 w-4 md:h-4 md:w-4" />
            <span className="hidden md:inline">Segurança</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mobile-tab-content">
          <ProfileTab onTabChange={setActiveTab} />
        </TabsContent>

        <TabsContent value="history" className="mobile-tab-content">
          <HistoryTab />
        </TabsContent>

        <TabsContent value="notifications" className="mobile-tab-content">
          <NotificationsTab />
        </TabsContent>

        <TabsContent value="gamification" className="mobile-tab-content">
          <GamificationTab />
        </TabsContent>

        <TabsContent value="accessibility" className="mobile-tab-content">
          <AccessibilityTab />
        </TabsContent>

        <TabsContent value="security" className="mobile-tab-content">
          <SecurityTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePage;
