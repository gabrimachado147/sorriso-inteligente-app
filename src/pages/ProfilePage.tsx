
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
import { useAuthPage } from '@/hooks/useAuthPage';
import { animations } from '@/lib/animations';

const ProfilePage = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  
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

  if (!isAuthenticated) {
    return (
      <div className={`w-full min-h-screen bg-background overflow-x-hidden ${animations.pageEnter}`}>
        <div className="mobile-container px-4 py-6">
          <div className="flex items-center justify-center min-h-[70vh]">
            <Card className="w-full max-w-md mx-auto mobile-card-spacing">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-lg">Acesse sua Conta</CardTitle>
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
    <div className={`w-full min-h-screen bg-background overflow-x-hidden ${animations.pageEnter}`}>
      <div className="mobile-container px-4 py-6">
        {/* Header do Perfil */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <User className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-lg font-bold mb-1 truncate">
            {user?.user_metadata?.nome_completo || user?.email}
          </h1>
          <p className="text-muted-foreground mobile-text-sm truncate px-4">
            {user?.email}
          </p>
        </div>

        {/* Tabs do Perfil */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <div className="overflow-x-auto mobile-scroll">
            <TabsList className="grid grid-cols-5 w-full min-w-[480px] md:min-w-0 h-auto bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-lg p-1">
              <TabsTrigger 
                value="profile" 
                className="mobile-text-xs p-2 flex flex-col items-center mobile-touch-target rounded-md min-w-0"
              >
                <User className="h-3 w-3 md:h-4 md:w-4 mb-1 flex-shrink-0" />
                <span className="truncate w-full text-center">Perfil</span>
              </TabsTrigger>
              <TabsTrigger 
                value="history" 
                className="mobile-text-xs p-2 flex flex-col items-center mobile-touch-target rounded-md min-w-0"
              >
                <History className="h-3 w-3 md:h-4 md:w-4 mb-1 flex-shrink-0" />
                <span className="truncate w-full text-center">Histórico</span>
              </TabsTrigger>
              <TabsTrigger 
                value="notifications" 
                className="mobile-text-xs p-2 flex flex-col items-center mobile-touch-target rounded-md min-w-0"
              >
                <Bell className="h-3 w-3 md:h-4 md:w-4 mb-1 flex-shrink-0" />
                <span className="truncate w-full text-center">Notific.</span>
              </TabsTrigger>
              <TabsTrigger 
                value="security" 
                className="mobile-text-xs p-2 flex flex-col items-center mobile-touch-target rounded-md min-w-0"
              >
                <Shield className="h-3 w-3 md:h-4 md:w-4 mb-1 flex-shrink-0" />
                <span className="truncate w-full text-center">Segur.</span>
              </TabsTrigger>
              <TabsTrigger 
                value="accessibility" 
                className="mobile-text-xs p-2 flex flex-col items-center mobile-touch-target rounded-md min-w-0"
              >
                <Settings className="h-3 w-3 md:h-4 md:w-4 mb-1 flex-shrink-0" />
                <span className="truncate w-full text-center">Access.</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="overflow-x-hidden">
            <TabsContent value="profile" className="mt-4">
              <ProfileTabReal onTabChange={setActiveTab} />
            </TabsContent>

            <TabsContent value="history" className="mt-4">
              <HistoryTabReal />
            </TabsContent>

            <TabsContent value="notifications" className="mt-4">
              <NotificationsTab />
            </TabsContent>

            <TabsContent value="security" className="mt-4">
              <SecurityTab />
            </TabsContent>

            <TabsContent value="accessibility" className="mt-4">
              <AccessibilityTab />
            </TabsContent>
          </div>
        </Tabs>

        {/* Botão de Logout */}
        <Button
          onClick={handleSignOut}
          variant="outline"
          className="w-full mobile-button h-12 mt-6 truncate"
          size="lg"
        >
          <LogOut className="h-4 w-4 md:h-5 md:w-5 mr-2 flex-shrink-0" />
          <span className="truncate">Sair da Conta</span>
        </Button>
      </div>
    </div>
  );
};

export default ProfilePage;
