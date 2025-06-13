
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  Bell, 
  Shield, 
  Gamepad2, 
  Accessibility,
  History,
  Settings,
  Award,
  Star
} from 'lucide-react';
import { animations } from '@/lib/animations';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useUserAppointments } from '@/hooks/useUserAppointments';
import { useNotificationPreferences } from '@/hooks/useNotificationPreferences';
import { useGamificationData } from '@/hooks/useGamificationData';
import { QuickLinks } from '@/components/Profile/QuickLinks';
import { toastSuccess, toastError } from '@/components/ui/custom-toast';

const ProfilePage = () => {
  const { user, isAuthenticated } = useAuth();
  const { profile, loading: profileLoading, updateProfile } = useProfile();
  const { appointments, loading: appointmentsLoading } = useUserAppointments();
  const { preferences, loading: preferencesLoading, updatePreferences } = useNotificationPreferences();
  const { gamificationData, loading: gamificationLoading } = useGamificationData();
  
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    nome_completo: '',
    telefone: ''
  });

  React.useEffect(() => {
    if (profile) {
      setFormData({
        nome_completo: profile.nome_completo || '',
        telefone: profile.telefone || ''
      });
    }
  }, [profile]);

  const handleSaveProfile = async () => {
    try {
      const result = await updateProfile(formData);
      if (result && result.success) {
        setEditMode(false);
        toastSuccess('Perfil atualizado', 'Suas informações foram salvas com sucesso');
      } else {
        toastError('Erro', 'Não foi possível atualizar o perfil');
      }
    } catch (error) {
      toastError('Erro', 'Erro interno do sistema');
    }
  };

  const handleNotificationToggle = async (key: string, value: boolean) => {
    if (!preferences) return;
    
    try {
      const result = await updatePreferences({ [key]: value });
      if (result && result.success) {
        toastSuccess('Configuração salva', 'Preferências de notificação atualizadas');
      }
    } catch (error) {
      toastError('Erro', 'Não foi possível atualizar as configurações');
    }
  };

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

      <Tabs defaultValue="profile" className="space-y-6">
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

        <TabsContent value="profile" className="space-y-6">
          <Card className={animations.fadeIn}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informações Pessoais
                </div>
                <Button
                  variant={editMode ? "default" : "outline"}
                  size="sm"
                  onClick={() => editMode ? handleSaveProfile() : setEditMode(true)}
                >
                  {editMode ? 'Salvar' : 'Editar'}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome Completo</Label>
                  <Input
                    id="nome"
                    value={formData.nome_completo}
                    onChange={(e) => setFormData(prev => ({ ...prev, nome_completo: e.target.value }))}
                    disabled={!editMode}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    value={formData.telefone}
                    onChange={(e) => setFormData(prev => ({ ...prev, telefone: e.target.value }))}
                    disabled={!editMode}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={user?.email || ''}
                    disabled
                    className="bg-gray-100"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <QuickLinks />
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card className={animations.fadeIn}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Histórico de Consultas
              </CardTitle>
            </CardHeader>
            <CardContent>
              {appointments.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">Você ainda não tem consultas agendadas</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {appointments.map((appointment) => (
                    <div key={appointment.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{appointment.service}</h4>
                        <Badge variant={
                          appointment.status === 'confirmed' ? 'default' :
                          appointment.status === 'completed' ? 'secondary' :
                          appointment.status === 'cancelled' ? 'destructive' : 'outline'
                        }>
                          {appointment.status === 'confirmed' ? 'Confirmado' :
                           appointment.status === 'completed' ? 'Concluído' :
                           appointment.status === 'cancelled' ? 'Cancelado' : appointment.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{appointment.clinic}</p>
                      <p className="text-sm text-gray-600">{appointment.date} às {appointment.time}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className={animations.fadeIn}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Preferências de Notificação
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-reminders">Lembretes por Email</Label>
                  <p className="text-sm text-gray-600">Receber lembretes de consultas por email</p>
                </div>
                <Switch
                  id="email-reminders"
                  checked={preferences?.email_reminders || false}
                  onCheckedChange={(checked) => handleNotificationToggle('email_reminders', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="sms-reminders">Lembretes por SMS</Label>
                  <p className="text-sm text-gray-600">Receber lembretes de consultas por SMS</p>
                </div>
                <Switch
                  id="sms-reminders"
                  checked={preferences?.sms_reminders || false}
                  onCheckedChange={(checked) => handleNotificationToggle('sms_reminders', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="push-notifications">Notificações Push</Label>
                  <p className="text-sm text-gray-600">Receber notificações no navegador</p>
                </div>
                <Switch
                  id="push-notifications"
                  checked={preferences?.push_notifications || false}
                  onCheckedChange={(checked) => handleNotificationToggle('push_notifications', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="marketing-emails">Emails Promocionais</Label>
                  <p className="text-sm text-gray-600">Receber ofertas e novidades</p>
                </div>
                <Switch
                  id="marketing-emails"
                  checked={preferences?.marketing_emails || false}
                  onCheckedChange={(checked) => handleNotificationToggle('marketing_emails', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gamification" className="space-y-6">
          <Card className={animations.fadeIn}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gamepad2 className="h-5 w-5" />
                Sistema de Pontuação
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">
                  {gamificationData?.points || 0}
                </div>
                <p className="text-gray-600">Pontos Totais</p>
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">Nível {gamificationData?.level || 1}</p>
                  <Progress value={((gamificationData?.points || 0) % 500) / 5} className="w-full" />
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  Conquistas
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {gamificationData?.badges?.map((badge, index) => (
                    <div key={index} className="text-center p-3 bg-blue-50 rounded-lg">
                      <Star className="h-6 w-6 mx-auto text-blue-600 mb-1" />
                      <p className="text-xs font-medium">{badge}</p>
                    </div>
                  )) || (
                    <p className="text-gray-500 col-span-full text-center">Nenhuma conquista ainda</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accessibility" className="space-y-6">
          <Card className={animations.fadeIn}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Accessibility className="h-5 w-5" />
                Configurações de Acessibilidade
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center py-8">
                <Accessibility className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">Configurações de acessibilidade em desenvolvimento</p>
                <p className="text-sm text-gray-500 mt-2">
                  Em breve você poderá personalizar a interface para suas necessidades
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className={animations.fadeIn}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Segurança da Conta
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center py-8">
                <Shield className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">Configurações de segurança em desenvolvimento</p>
                <p className="text-sm text-gray-500 mt-2">
                  Em breve você poderá gerenciar sua senha e configurações de segurança
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePage;
