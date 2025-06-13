
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { 
  User, 
  Calendar, 
  Phone, 
  Mail, 
  MapPin,
  Shield,
  Bell,
  Gamepad2,
  Trophy,
  Star,
  Award,
  History,
  Settings,
  Accessibility,
  Eye,
  Type,
  Palette,
  Volume2
} from 'lucide-react';
import { animations } from '@/lib/animations';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useUserAppointments } from '@/hooks/useUserAppointments';
import { useNotificationPreferences } from '@/hooks/useNotificationPreferences';
import { useGamificationData } from '@/hooks/useGamificationData';
import { QuickLinks } from '@/components/Profile/QuickLinks';
import { toastSuccess, toastError } from '@/components/ui/custom-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const ProfilePage = () => {
  const { user, logout, updatePassword } = useAuth();
  const { profile, loading: profileLoading, updateProfile } = useProfile();
  const { appointments, loading: appointmentsLoading } = useUserAppointments();
  const { preferences, updatePreferences } = useNotificationPreferences();
  const { gamificationData } = useGamificationData();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nome_completo: '',
    telefone: ''
  });
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // URL params para tabs
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, []);

  useEffect(() => {
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
      if (result.success) {
        setIsEditing(false);
        toastSuccess('Sucesso', 'Perfil atualizado com sucesso!');
      } else {
        toastError('Erro', result.error || 'Erro ao atualizar perfil');
      }
    } catch (error) {
      toastError('Erro', 'Erro ao atualizar perfil');
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toastError('Erro', 'As senhas não coincidem');
      return;
    }

    if (newPassword.length < 6) {
      toastError('Erro', 'A senha deve ter pelo menos 6 caracteres');
      return;
    }

    try {
      const result = await updatePassword(newPassword);
      if (result.success) {
        setNewPassword('');
        setConfirmPassword('');
        toastSuccess('Sucesso', 'Senha alterada com sucesso!');
      } else {
        toastError('Erro', result.error || 'Erro ao alterar senha');
      }
    } catch (error) {
      toastError('Erro', 'Erro ao alterar senha');
    }
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-800">Confirmado</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Cancelado</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800">Concluído</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
    }
  };

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`container mx-auto px-4 py-8 ${animations.pageEnter}`}>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header do Perfil */}
        <Card className={`${animations.fadeIn}`}>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {profile?.nome_completo || 'Usuário'}
                  </h1>
                  <p className="text-gray-600">{user?.email}</p>
                  <p className="text-sm text-gray-500">
                    Membro desde {format(new Date(profile?.created_at || ''), 'MMMM yyyy', { locale: ptBR })}
                  </p>
                </div>
              </div>
              
              {gamificationData && (
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{gamificationData.points}</div>
                    <div className="text-xs text-gray-500">Pontos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">Nível {gamificationData.level}</div>
                    <div className="text-xs text-gray-500">Atual</div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Links Rápidos */}
        <QuickLinks />

        {/* Tabs do Perfil */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
            <TabsTrigger value="notifications">Notificações</TabsTrigger>
            <TabsTrigger value="gamification">Gamificação</TabsTrigger>
            <TabsTrigger value="accessibility">Acessibilidade</TabsTrigger>
            <TabsTrigger value="security">Segurança</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Informações Pessoais
                  </CardTitle>
                  <Button
                    variant={isEditing ? "default" : "outline"}
                    onClick={isEditing ? handleSaveProfile : () => setIsEditing(true)}
                  >
                    {isEditing ? 'Salvar' : 'Editar'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nome Completo</Label>
                    <Input
                      value={formData.nome_completo}
                      onChange={(e) => setFormData(prev => ({ ...prev, nome_completo: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Telefone</Label>
                    <Input
                      value={formData.telefone}
                      onChange={(e) => setFormData(prev => ({ ...prev, telefone: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input value={user?.email || ''} disabled />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Histórico de Consultas
                </CardTitle>
              </CardHeader>
              <CardContent>
                {appointmentsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-2 text-gray-600">Carregando histórico...</p>
                  </div>
                ) : appointments.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">Nenhuma consulta encontrada</p>
                    <Button 
                      className="mt-4" 
                      onClick={() => window.location.href = '/schedule'}
                    >
                      Agendar Primeira Consulta
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {appointments.map((appointment) => (
                      <div key={appointment.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <h3 className="font-medium">{appointment.service}</h3>
                            <p className="text-sm text-gray-600">{appointment.clinic}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span>📅 {appointment.date}</span>
                              <span>🕒 {appointment.time}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            {getStatusBadge(appointment.status)}
                            <p className="text-xs text-gray-500 mt-2">
                              {format(new Date(appointment.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Preferências de Notificação
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Lembretes por Email</Label>
                      <p className="text-sm text-gray-500">Receber lembretes de consultas por email</p>
                    </div>
                    <Switch
                      checked={preferences?.email_reminders || false}
                      onCheckedChange={(checked) => updatePreferences({ email_reminders: checked })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Lembretes por SMS</Label>
                      <p className="text-sm text-gray-500">Receber lembretes de consultas por SMS</p>
                    </div>
                    <Switch
                      checked={preferences?.sms_reminders || false}
                      onCheckedChange={(checked) => updatePreferences({ sms_reminders: checked })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Notificações Push</Label>
                      <p className="text-sm text-gray-500">Receber notificações no navegador</p>
                    </div>
                    <Switch
                      checked={preferences?.push_notifications || false}
                      onCheckedChange={(checked) => updatePreferences({ push_notifications: checked })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Emails de Marketing</Label>
                      <p className="text-sm text-gray-500">Receber ofertas e novidades</p>
                    </div>
                    <Switch
                      checked={preferences?.marketing_emails || false}
                      onCheckedChange={(checked) => updatePreferences({ marketing_emails: checked })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gamification" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gamepad2 className="h-5 w-5" />
                  Sistema de Gamificação
                </CardTitle>
              </CardHeader>
              <CardContent>
                {gamificationData ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <Trophy className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-blue-600">{gamificationData.points}</div>
                        <div className="text-sm text-gray-600">Pontos Totais</div>
                      </div>
                      
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <Star className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-purple-600">Nível {gamificationData.level}</div>
                        <div className="text-sm text-gray-600">Nível Atual</div>
                      </div>
                      
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <Award className="h-8 w-8 text-green-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-green-600">{gamificationData.badges.length}</div>
                        <div className="text-sm text-gray-600">Badges</div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Badges Conquistadas</h4>
                      <div className="flex flex-wrap gap-2">
                        {gamificationData.badges.map((badge, index) => (
                          <Badge key={index} variant="secondary" className="capitalize">
                            🏆 {badge.replace('_', ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Conquistas</h4>
                      <div className="space-y-2">
                        {gamificationData.achievements.map((achievement, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                            <Award className="h-4 w-4 text-yellow-600" />
                            <span className="capitalize">{achievement.replace('_', ' ')}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Gamepad2 className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">Dados de gamificação não disponíveis</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="accessibility" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Accessibility className="h-5 w-5" />
                  Configurações de Acessibilidade
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        Alto Contraste
                      </Label>
                      <p className="text-sm text-gray-500">Aumentar contraste para melhor visibilidade</p>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="flex items-center gap-2">
                        <Type className="h-4 w-4" />
                        Texto Grande
                      </Label>
                      <p className="text-sm text-gray-500">Aumentar tamanho do texto</p>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Type className="h-4 w-4" />
                      Tamanho da Fonte
                    </Label>
                    <div className="px-3">
                      <Slider
                        value={[16]}
                        onValueChange={() => {}}
                        max={24}
                        min={12}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-500 mt-1">
                        <span>12px</span>
                        <span>18px</span>
                        <span>24px</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="flex items-center gap-2">
                        <Volume2 className="h-4 w-4" />
                        Leitor de Tela
                      </Label>
                      <p className="text-sm text-gray-500">Compatibilidade com leitores de tela</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Segurança da Conta
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Nova Senha</Label>
                    <Input
                      type="password"
                      placeholder="Digite a nova senha"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Confirmar Nova Senha</Label>
                    <Input
                      type="password"
                      placeholder="Confirme a nova senha"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  
                  <Button onClick={handleChangePassword} disabled={!newPassword || !confirmPassword}>
                    Alterar Senha
                  </Button>
                </div>
                
                <hr />
                
                <div>
                  <h4 className="font-medium text-red-600 mb-2">Zona de Perigo</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Desconectar da conta atual
                  </p>
                  <Button variant="destructive" onClick={handleLogout}>
                    Sair da Conta
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfilePage;
