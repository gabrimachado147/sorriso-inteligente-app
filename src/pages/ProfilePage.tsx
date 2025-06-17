
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
      <div className="mobile-container px-4 py-6 max-w-4xl mx-auto">
        {/* Header do Perfil */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-2xl font-bold mb-2">
            {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Usuário'}
          </h1>
          <p className="text-gray-600 text-sm">
            {user?.email}
          </p>
        </div>

        {/* Tabs do Perfil */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 h-auto bg-white border border-gray-200 rounded-lg p-1">
            <TabsTrigger 
              value="profile" 
              className="flex flex-col items-center gap-1 py-3 px-2 text-xs data-[state=active]:bg-primary data-[state=active]:text-white rounded-md transition-all"
            >
              <User className="h-4 w-4" />
              <span>Perfil</span>
            </TabsTrigger>
            <TabsTrigger 
              value="history" 
              className="flex flex-col items-center gap-1 py-3 px-2 text-xs data-[state=active]:bg-primary data-[state=active]:text-white rounded-md transition-all"
            >
              <History className="h-4 w-4" />
              <span>Histórico</span>
            </TabsTrigger>
            <TabsTrigger 
              value="notifications" 
              className="flex flex-col items-center gap-1 py-3 px-2 text-xs data-[state=active]:bg-primary data-[state=active]:text-white rounded-md transition-all"
            >
              <Bell className="h-4 w-4" />
              <span>Notific.</span>
            </TabsTrigger>
            <TabsTrigger 
              value="security" 
              className="flex flex-col items-center gap-1 py-3 px-2 text-xs data-[state=active]:bg-primary data-[state=active]:text-white rounded-md transition-all"
            >
              <Shield className="h-4 w-4" />
              <span>Segur.</span>
            </TabsTrigger>
            <TabsTrigger 
              value="accessibility" 
              className="flex flex-col items-center gap-1 py-3 px-2 text-xs data-[state=active]:bg-primary data-[state=active]:text-white rounded-md transition-all"
            >
              <Settings className="h-4 w-4" />
              <span>Access.</span>
            </TabsTrigger>
          </TabsList>

          <div className="min-h-[400px]">
            <TabsContent value="profile" className="mt-6 space-y-0">
              <ProfileTabReal onTabChange={setActiveTab} />
            </TabsContent>

            <TabsContent value="history" className="mt-6 space-y-0">
              <HistoryTabReal />
            </TabsContent>

            <TabsContent value="notifications" className="mt-6 space-y-0">
              <NotificationsTab />
            </TabsContent>

            <TabsContent value="security" className="mt-6 space-y-0">
              <SecurityTab />
            </TabsContent>

            <TabsContent value="accessibility" className="mt-6 space-y-0">
              <AccessibilityTab />
            </TabsContent>
          </div>
        </Tabs>

        {/* Botão de Logout */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="w-full h-12 text-gray-700 border-gray-300 hover:bg-gray-50 hover:text-gray-900"
              size="lg"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Sair da Conta
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
