
import React, { useState } from 'react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { PageHead } from '@/components/SEO/PageHead';
import { EnhancedBreadcrumbs } from '@/components/ui/enhanced-breadcrumbs';
import { FeedbackSystem } from '@/components/ui/feedback-system';
import { GamificationStats } from '@/components/ui/gamification-elements';
import { MicroInteraction } from '@/components/ui/micro-interactions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User, Calendar, Settings, Bell, Heart, Star } from 'lucide-react';
import { animations } from '@/lib/animations';
import { useToast } from '@/hooks/use-toast';

const EnhancedProfilePage = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const breadcrumbItems = [
    { label: 'Início', href: '/' },
    { label: 'Meu Perfil', href: '/profile', icon: User }
  ];

  const [profileData, setProfileData] = useState({
    name: 'João Silva',
    email: 'joao.silva@email.com',
    phone: '(11) 99999-9999',
    birthDate: '1985-06-15',
    emergencyContact: '(11) 88888-8888',
    medicalNotes: 'Alergia a penicilina'
  });

  const appointments = [
    {
      id: 1,
      date: '2024-01-25',
      time: '14:00',
      service: 'Consulta de Rotina',
      clinic: 'Campo Belo',
      status: 'confirmed'
    },
    {
      id: 2,
      date: '2024-01-15',
      time: '10:30',
      service: 'Limpeza',
      clinic: 'Formiga',
      status: 'completed'
    }
  ];

  const handleSaveProfile = () => {
    setIsEditing(false);
    toast({
      title: "Perfil atualizado!",
      description: "Suas informações foram salvas com sucesso.",
    });
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      confirmed: 'bg-blue-100 text-blue-700',
      completed: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700'
    };
    return variants[status as keyof typeof variants] || variants.confirmed;
  };

  return (
    <>
      <PageHead
        title="Meu Perfil - Senhor Sorriso"
        description="Gerencie suas informações pessoais, histórico de consultas e preferências no Senhor Sorriso."
        keywords="perfil usuário, informações pessoais, histórico consultas, preferências, Senhor Sorriso"
        url="https://senhorsorrisso.com.br/profile"
      />
      <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <MainLayout>
          <div className={`w-full ${animations.pageEnter}`}>
            <div className="mobile-container px-4 py-6 max-w-7xl mx-auto">
              <div className="space-y-6">
                {/* Breadcrumbs */}
                <EnhancedBreadcrumbs items={breadcrumbItems} />

                {/* Header com Avatar */}
                <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                      <MicroInteraction type="hover-lift" trigger="hover">
                        <Avatar className="h-24 w-24">
                          <AvatarImage src="/placeholder-avatar.jpg" />
                          <AvatarFallback className="text-lg bg-primary text-white">
                            {profileData.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                      </MicroInteraction>
                      
                      <div className="flex-1 text-center md:text-left">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                          {profileData.name}
                        </h1>
                        <p className="text-gray-600 mb-3">{profileData.email}</p>
                        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                          <Badge className="bg-green-100 text-green-700">
                            <Heart className="h-3 w-3 mr-1" />
                            Paciente Ativo
                          </Badge>
                          <Badge className="bg-yellow-100 text-yellow-700">
                            <Star className="h-3 w-3 mr-1" />
                            Cliente Fidelidade
                          </Badge>
                        </div>
                      </div>

                      {/* Gamificação Mobile */}
                      <div className="md:hidden w-full">
                        <GamificationStats />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Layout Principal */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Gamificação Desktop */}
                  <div className="hidden lg:block">
                    <GamificationStats />
                  </div>

                  {/* Conteúdo Principal */}
                  <div className="lg:col-span-2">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <User className="h-5 w-5 text-primary" />
                          Informações Pessoais
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Tabs value={activeTab} onValueChange={setActiveTab}>
                          <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="personal">
                              <User className="h-4 w-4 mr-2" />
                              Pessoal
                            </TabsTrigger>
                            <TabsTrigger value="appointments">
                              <Calendar className="h-4 w-4 mr-2" />
                              Consultas
                            </TabsTrigger>
                            <TabsTrigger value="preferences">
                              <Settings className="h-4 w-4 mr-2" />
                              Preferências
                            </TabsTrigger>
                          </TabsList>

                          <TabsContent value="personal" className="space-y-4 mt-6">
                            <div className="flex justify-between items-center">
                              <h3 className="text-lg font-medium">Dados Pessoais</h3>
                              <MicroInteraction type="click-ripple" trigger="click">
                                <Button
                                  variant={isEditing ? "default" : "outline"}
                                  onClick={() => setIsEditing(!isEditing)}
                                >
                                  {isEditing ? 'Cancelar' : 'Editar'}
                                </Button>
                              </MicroInteraction>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="name">Nome Completo</Label>
                                <Input
                                  id="name"
                                  value={profileData.name}
                                  disabled={!isEditing}
                                  onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                                />
                              </div>
                              <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                  id="email"
                                  type="email"
                                  value={profileData.email}
                                  disabled={!isEditing}
                                  onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                                />
                              </div>
                              <div>
                                <Label htmlFor="phone">Telefone</Label>
                                <Input
                                  id="phone"
                                  value={profileData.phone}
                                  disabled={!isEditing}
                                  onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                                />
                              </div>
                              <div>
                                <Label htmlFor="birthDate">Data de Nascimento</Label>
                                <Input
                                  id="birthDate"
                                  type="date"
                                  value={profileData.birthDate}
                                  disabled={!isEditing}
                                  onChange={(e) => setProfileData({...profileData, birthDate: e.target.value})}
                                />
                              </div>
                              <div>
                                <Label htmlFor="emergency">Contato de Emergência</Label>
                                <Input
                                  id="emergency"
                                  value={profileData.emergencyContact}
                                  disabled={!isEditing}
                                  onChange={(e) => setProfileData({...profileData, emergencyContact: e.target.value})}
                                />
                              </div>
                            </div>

                            <div>
                              <Label htmlFor="medicalNotes">Observações Médicas</Label>
                              <Textarea
                                id="medicalNotes"
                                value={profileData.medicalNotes}
                                disabled={!isEditing}
                                onChange={(e) => setProfileData({...profileData, medicalNotes: e.target.value})}
                                placeholder="Alergias, medicamentos, observações importantes..."
                              />
                            </div>

                            {isEditing && (
                              <MicroInteraction type="scale-in" trigger="auto">
                                <Button onClick={handleSaveProfile} className="w-full">
                                  Salvar Alterações
                                </Button>
                              </MicroInteraction>
                            )}
                          </TabsContent>

                          <TabsContent value="appointments" className="space-y-4 mt-6">
                            <h3 className="text-lg font-medium">Histórico de Consultas</h3>
                            <div className="space-y-3">
                              {appointments.map((appointment) => (
                                <MicroInteraction key={appointment.id} type="hover-lift" trigger="hover">
                                  <Card className="p-4">
                                    <div className="flex items-center justify-between">
                                      <div>
                                        <h4 className="font-medium">{appointment.service}</h4>
                                        <p className="text-sm text-gray-600">
                                          {appointment.date} às {appointment.time}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                          Clínica: {appointment.clinic}
                                        </p>
                                      </div>
                                      <Badge className={getStatusBadge(appointment.status)}>
                                        {appointment.status === 'confirmed' ? 'Confirmada' :
                                         appointment.status === 'completed' ? 'Concluída' : 'Cancelada'}
                                      </Badge>
                                    </div>
                                  </Card>
                                </MicroInteraction>
                              ))}
                            </div>
                          </TabsContent>

                          <TabsContent value="preferences" className="space-y-4 mt-6">
                            <h3 className="text-lg font-medium">Preferências de Notificação</h3>
                            <div className="space-y-4">
                              <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="flex items-center gap-3">
                                  <Bell className="h-5 w-5 text-primary" />
                                  <div>
                                    <p className="font-medium">Lembretes de Consulta</p>
                                    <p className="text-sm text-gray-600">Receber notificações antes das consultas</p>
                                  </div>
                                </div>
                                <input type="checkbox" defaultChecked className="h-4 w-4" />
                              </div>
                              
                              <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="flex items-center gap-3">
                                  <Heart className="h-5 w-5 text-primary" />
                                  <div>
                                    <p className="font-medium">Dicas de Saúde Bucal</p>
                                    <p className="text-sm text-gray-600">Receber dicas e informações úteis</p>
                                  </div>
                                </div>
                                <input type="checkbox" defaultChecked className="h-4 w-4" />
                              </div>
                            </div>
                          </TabsContent>
                        </Tabs>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Feedback Lateral */}
                  <div>
                    <FeedbackSystem 
                      pageContext="Perfil do Usuário"
                      onSubmit={(feedback) => {
                        console.log('Feedback do Perfil:', feedback);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </MainLayout>
      </div>
    </>
  );
};

export default EnhancedProfilePage;
