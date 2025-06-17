
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { User, LogOut, History, Settings, Bell, Shield, UserCog } from 'lucide-react';
import { ProfileTabReal } from '@/components/Profile/ProfileTabReal';
import { HistoryTabReal } from '@/components/Profile/HistoryTabReal';
import { NotificationsTab } from '@/components/Profile/NotificationsTab';
import { SecurityTab } from '@/components/Profile/SecurityTab';
import { AccessibilityTab } from '@/components/Profile/AccessibilityTab';
import { AuthForm } from '@/components/Auth/AuthForm';
import { useAuthPage } from '@/hooks/useAuthPage';
import { useNavigate } from 'react-router-dom';
import { animations } from '@/lib/animations';

const ProfilePage = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const navigate = useNavigate();
  
  const {
    isLogin,
    loading,
    formData,
    handleInputChange,
    handlePhoneChange,
    handleSubmit,
    handlePasswordReset,
    handleToggleMode,
    handleEnterWithoutAccount
  } = useAuthPage();

  const handleStaffAccess = () => {
    navigate('/staff-login');
  };

  // Botão de acesso administrativo fixo no topo
  const AdminAccessButton = () => (
    <div className="fixed top-4 right-4 z-50">
      <Button 
        variant="default"
        size="sm"
        onClick={handleStaffAccess}
        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg px-3 py-2 mobile-touch-target"
      >
        <UserCog className="h-4 w-4 mr-2" />
        Painel Administrativo
      </Button>
    </div>
  );

  if (!isAuthenticated) {
    return (
      <div className={`mobile-container px-4 py-6 ${animations.pageEnter}`}>
        <AdminAccessButton />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="w-full max-w-md mx-auto mobile-card-spacing">
            <CardHeader className="text-center pb-4">
              <CardTitle className="mobile-text-xl">Acesse sua Conta</CardTitle>
              <p className="text-muted-foreground mobile-text-base">
                Faça login para acessar seu perfil e histórico
              </p>
            </CardHeader>
            <CardContent>
              <AuthForm 
                isLogin={isLogin}
                formData={formData}
                loading={loading}
                onInputChange={handleInputChange}
                onPhoneChange={handlePhoneChange}
                onSubmit={handleSubmit}
                onToggleMode={handleToggleMode}
                onPasswordReset={handlePasswordReset}
                onEnterWithoutAccount={handleEnterWithoutAccount}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const handleSignOut = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <div className={`mobile-container px-4 py-6 ${animations.pageEnter}`}>
      <AdminAccessButton />
      
      {/* Header do Perfil */}
      <div className="text-center mb-8 mt-16">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
          <User className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-xl font-bold mobile-text-lg mb-1">
          {user?.user_metadata?.nome_completo || user?.email}
        </h1>
        <p className="text-muted-foreground mobile-text-sm">
          {user?.email}
        </p>
      </div>

      {/* Tabs do Perfil */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-4 h-auto bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-lg">
          <TabsTrigger value="profile" className="mobile-text-xs p-2 flex flex-col md:flex-row items-center mobile-touch-target rounded-md">
            <User className="h-4 w-4 mb-1 md:mb-0 md:mr-1" />
            <span>Perfil</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="mobile-text-xs p-2 flex flex-col md:flex-row items-center mobile-touch-target rounded-md">
            <History className="h-4 w-4 mb-1 md:mb-0 md:mr-1" />
            <span>Histórico</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="mobile-text-xs p-2 flex flex-col md:flex-row items-center mobile-touch-target rounded-md">
            <Bell className="h-4 w-4 mb-1 md:mb-0 md:mr-1" />
            <span>Notificações</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="mobile-text-xs p-2 flex flex-col md:flex-row items-center mobile-touch-target rounded-md">
            <Shield className="h-4 w-4 mb-1 md:mb-0 md:mr-1" />
            <span>Segurança</span>
          </TabsTrigger>
          <TabsTrigger value="accessibility" className="mobile-text-xs p-2 flex flex-col md:flex-row items-center mobile-touch-target rounded-md">
            <Settings className="h-4 w-4 mb-1 md:mb-0 md:mr-1" />
            <span>Acessibilidade</span>
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

        <TabsContent value="security">
          <SecurityTab />
        </TabsContent>

        <TabsContent value="accessibility">
          <AccessibilityTab />
        </TabsContent>
      </Tabs>

      {/* Botão de Logout */}
      <Button
        onClick={handleSignOut}
        variant="outline"
        className="w-full mobile-button h-12 mt-8"
        size="lg"
      >
        <LogOut className="h-5 w-5 mr-2" />
        Sair da Conta
      </Button>
    </div>
  );
};

export default ProfilePage;
