import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, Mail, Phone, MapPin, Calendar, Edit, Save, X } from 'lucide-react';
import { toastSuccess } from '@/components/ui/custom-toast';

<<<<<<< HEAD
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
=======
const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'João da Silva',
    email: 'joao@email.com',
    phone: '(11) 99999-9999',
    address: 'São Paulo, SP',
    memberSince: 'Janeiro 2024'
  });
  const [editData, setEditData] = useState(profileData);

  const handleEdit = () => {
    setEditData(profileData);
    setIsEditing(true);
  };

  const handleSave = () => {
    setProfileData(editData);
    setIsEditing(false);
    toastSuccess('Sucesso', 'Perfil atualizado com sucesso!');
  };

  const handleCancel = () => {
    setEditData(profileData);
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <User className="h-6 w-6" />
        Meu Perfil
      </h1>
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Informações Pessoais</CardTitle>
            {!isEditing ? (
              <Button onClick={handleEdit} variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button onClick={handleSave} size="sm">
                  <Save className="h-4 w-4 mr-2" />
                  Salvar
                </Button>
                <Button onClick={handleCancel} variant="outline" size="sm">
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isEditing ? (
            <>
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <span>{profileData.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <span>{profileData.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <span>{profileData.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <span>{profileData.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <span>Cliente desde: {profileData.memberSince}</span>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">Nome</label>
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <Input
                    value={editData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <Input
                    type="email"
                    value={editData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Telefone</label>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <Input
                    value={editData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Endereço</label>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <Input
                    value={editData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <span>Cliente desde: {profileData.memberSince}</span>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button 
            className="w-full" 
            variant="outline"
            onClick={() => window.location.href = '/schedule'}
          >
            <Calendar className="mr-2 h-4 w-4" />
            Ver Minhas Consultas
          </Button>
          <Button 
            className="w-full" 
            variant="outline"
            onClick={() => window.location.href = '/chat'}
          >
            <User className="mr-2 h-4 w-4" />
            Falar com Assistente
          </Button>
          <Button 
            className="w-full" 
            variant="outline"
            onClick={() => window.location.href = '/emergency'}
          >
            <Phone className="mr-2 h-4 w-4" />
            Emergência
          </Button>
          <Button 
            className="w-full" 
            variant="outline"
            onClick={() => window.location.href = '/pwa-settings'}
          >
            <MapPin className="mr-2 h-4 w-4" />
            Configurações do App
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preferências</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button 
            className="w-full" 
            variant="outline"
            onClick={() => toastSuccess('Preferências', 'Configurações de notificação em desenvolvimento')}
          >
            Preferências de Notificação
          </Button>
          <Button 
            className="w-full" 
            variant="outline"
            onClick={() => toastSuccess('Senha', 'Alteração de senha em desenvolvimento')}
          >
            Alterar Senha
          </Button>
          <Button 
            className="w-full" 
            variant="outline"
            onClick={() => toastSuccess('Privacidade', 'Configurações de privacidade em desenvolvimento')}
          >
            Privacidade e Segurança
          </Button>
        </CardContent>
      </Card>
>>>>>>> main
    </div>
  );
};

export default ProfilePage;
