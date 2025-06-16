
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { User, LogOut, History, Settings, Bell, Shield } from 'lucide-react';
import { ProfileTabReal } from '@/components/Profile/ProfileTabReal';
import { HistoryTabReal } from '@/components/Profile/HistoryTabReal';
import { NotificationsTab } from '@/components/Profile/NotificationsTab';
import { SecurityTab } from '@/components/Profile/SecurityTab';
import { AccessibilityTab } from '@/components/Profile/AccessibilityTab';
import { AuthForm } from '@/components/Auth/AuthForm';

const ProfilePage = () => {
  const { user, isAuthenticated, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background w-full">
        <div className="w-full px-4 py-6">
          <Card className="mobile-card-spacing">
            <CardHeader className="text-center">
              <CardTitle className="mobile-text-xl">Acesse sua Conta</CardTitle>
              <p className="text-muted-foreground mobile-text-base">
                Faça login para acessar seu perfil e histórico
              </p>
            </CardHeader>
            <CardContent>
              <AuthForm />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background w-full">
      <div className="w-full px-4 py-6">
        {/* Header do Perfil */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-2xl font-bold mobile-text-xl">
            {user?.user_metadata?.nome_completo || user?.email}
          </h1>
          <p className="text-muted-foreground mobile-text-base">
            {user?.email}
          </p>
        </div>

        {/* Tabs do Perfil */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-6">
            <TabsTrigger value="profile" className="mobile-text-xs">
              <User className="h-4 w-4 mr-1" />
              Perfil
            </TabsTrigger>
            <TabsTrigger value="history" className="mobile-text-xs">
              <History className="h-4 w-4 mr-1" />
              Histórico
            </TabsTrigger>
            <TabsTrigger value="notifications" className="mobile-text-xs">
              <Bell className="h-4 w-4 mr-1" />
              Notificações
            </TabsTrigger>
            <TabsTrigger value="security" className="mobile-text-xs">
              <Shield className="h-4 w-4 mr-1" />
              Segurança
            </TabsTrigger>
            <TabsTrigger value="accessibility" className="mobile-text-xs">
              <Settings className="h-4 w-4 mr-1" />
              Acessibilidade
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <ProfileTabReal />
          </TabsContent>

          <TabsContent value="history">
            <HistoryTabReal />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationsTab />
          </TabsContent>

          <TabsContent value="security">
            <SecurityTab />
          </TabsContent>

          <TabsContent value="accessibility">
            <AccessibilityTab />
          </TabsContent>
        </Tabs>

        {/* Botão de Logout */}
        <div className="mt-8">
          <Button
            onClick={handleSignOut}
            variant="outline"
            className="w-full mobile-button"
            size="lg"
          >
            <LogOut className="h-5 w-5 mr-2" />
            Sair da Conta
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
