
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  User, 
  Bell, 
  Shield, 
  Gamepad2, 
  Accessibility,
  History
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

const ProfilePage = () => {
  const { user, isAuthenticated } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const { loading: appointmentsLoading } = useUserAppointments();
  const { loading: preferencesLoading } = useNotificationPreferences();
  const { loading: gamificationLoading } = useGamificationData();
  
  const [activeTab, setActiveTab] = useState('profile');

  if (!isAuthenticated) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Acesso Restrito</h1>
        <p className="text-gray-600 mb-6">Você precisa estar logado para acessar esta página.</p>
        <Button onClick={() => window.location.href = '/auth'}>
          Fazer Login
        </Button>
      </div>
    );
  }

  if (profileLoading || appointmentsLoading || preferencesLoading || gamificationLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 space-y-6 ${animations.pageEnter}`}>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Meu Perfil</h1>
        <Badge variant="secondary" className="px-3 py-1">
          {profile?.nome_completo || user?.email || 'Usuário'}
        </Badge>
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
          <ProfileTab />
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
