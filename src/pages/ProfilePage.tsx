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
  Star,
  Lock,
  Eye,
  EyeOff,
  Key
} from 'lucide-react';
import { animations } from '@/lib/animations';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useUserAppointments } from '@/hooks/useUserAppointments';
import { useNotificationPreferences } from '@/hooks/useNotificationPreferences';
import { useGamificationData } from '@/hooks/useGamificationData';
import { useAccessibility } from '@/hooks/useAccessibility';
import { useAutoTheme } from '@/hooks/useAutoTheme';
import { QuickLinks } from '@/components/Profile/QuickLinks';
import { AccessibilityPanel } from '@/components/Accessibility/AccessibilityPanel';
import { toastSuccess, toastError } from '@/components/ui/custom-toast';

const ProfilePage = () => {
  const { user, isAuthenticated } = useAuth();
  const { profile, loading: profileLoading, updateProfile } = useProfile();
  const { appointments, loading: appointmentsLoading } = useUserAppointments();
  const { preferences, loading: preferencesLoading, updatePreferences } = useNotificationPreferences();
  const { gamificationData, loading: gamificationLoading } = useGamificationData();
  const { settings: accessibilitySettings } = useAccessibility();
  const { theme, changeTheme } = useAutoTheme();
  
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    nome_completo: '',
    telefone: ''
  });
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    sessionTimeout: 30,
    emailAlerts: true,
    loginNotifications: true
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  React.useEffect(() => {
    if (profile) {
      setFormData({
        nome_completo: profile.nome_completo || '',
        telefone: profile.telefone || ''
      });
    }
  }, [profile]);

  const handleTabChange = (tabValue: string) => {
    setActiveTab(tabValue);
  };

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

  const handleSecurityToggle = (key: string, value: boolean) => {
    setSecuritySettings(prev => ({ ...prev, [key]: value }));
    toastSuccess('Configuração alterada', `${key} ${value ? 'ativado' : 'desativado'}`);
  };

  const handlePasswordChange = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toastError('Erro', 'As senhas não coincidem');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toastError('Erro', 'A nova senha deve ter pelo menos 6 caracteres');
      return;
    }
    toastSuccess('Senha alterada', 'Sua senha foi atualizada com sucesso');
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
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

          <QuickLinks onTabChange={handleTabChange} />
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
          <AccessibilityPanel />
          
          <Card className={animations.fadeIn}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Tema e Aparência
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Tema Atual</Label>
                  <p className="text-sm text-gray-600">
                    {theme === 'auto' ? 'Automático (baseado no horário)' : 
                     theme === 'dark' ? 'Escuro' : 'Claro'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={theme === 'light' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => changeTheme('light')}
                  >
                    Claro
                  </Button>
                  <Button
                    variant={theme === 'dark' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => changeTheme('dark')}
                  >
                    Escuro
                  </Button>
                  <Button
                    variant={theme === 'auto' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => changeTheme('auto')}
                  >
                    Auto
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className={animations.fadeIn}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Alteração de Senha
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Senha Atual</Label>
                <div className="relative">
                  <Input
                    id="current-password"
                    type={showCurrentPassword ? "text" : "password"}
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                    placeholder="Digite sua senha atual"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-password">Nova Senha</Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showNewPassword ? "text" : "password"}
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                    placeholder="Digite a nova senha"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="Confirme a nova senha"
                />
              </div>
              
              <Button onClick={handlePasswordChange} className="w-full">
                <Key className="h-4 w-4 mr-2" />
                Alterar Senha
              </Button>
            </CardContent>
          </Card>

          <Card className={animations.fadeIn}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Configurações de Segurança
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Autenticação em Duas Etapas</Label>
                  <p className="text-sm text-gray-600">Adicione uma camada extra de segurança</p>
                </div>
                <Switch
                  checked={securitySettings.twoFactorEnabled}
                  onCheckedChange={(checked) => handleSecurityToggle('twoFactorEnabled', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Alertas de Login por Email</Label>
                  <p className="text-sm text-gray-600">Receber notificação quando alguém fizer login</p>
                </div>
                <Switch
                  checked={securitySettings.emailAlerts}
                  onCheckedChange={(checked) => handleSecurityToggle('emailAlerts', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Notificações de Login</Label>
                  <p className="text-sm text-gray-600">Alertas sobre atividades de login suspeitas</p>
                </div>
                <Switch
                  checked={securitySettings.loginNotifications}
                  onCheckedChange={(checked) => handleSecurityToggle('loginNotifications', checked)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Timeout da Sessão</Label>
                <div className="flex items-center gap-4">
                  <Input
                    type="number"
                    value={securitySettings.sessionTimeout}
                    onChange={(e) => setSecuritySettings(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))}
                    className="w-24"
                    min="5"
                    max="480"
                  />
                  <span className="text-sm text-gray-600">minutos</span>
                </div>
                <p className="text-xs text-gray-500">Tempo limite para desconectar automaticamente por inatividade</p>
              </div>
              
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-3">Sessões Ativas</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Sessão Atual</p>
                      <p className="text-sm text-gray-600">Chrome - Windows • Agora</p>
                    </div>
                    <Badge variant="secondary">Ativo</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePage;
