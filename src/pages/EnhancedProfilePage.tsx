
import React, { useState } from 'react';
import { MainLayout } from '@/components/Layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PageHead } from '@/components/SEO/PageHead';
import { EnhancedBreadcrumbs } from '@/components/ui/enhanced-breadcrumbs';
import { FeedbackSystem } from '@/components/ui/feedback-system';
import { GamificationStats } from '@/components/ui/gamification-elements';
import { SuccessAnimation } from '@/components/ui/success-animation';
import { 
  User, 
  Calendar, 
  Settings, 
  Bell, 
  CreditCard, 
  Shield,
  Edit2,
  Save,
  Camera
} from 'lucide-react';
import { animations } from '@/lib/animations';

const EnhancedProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const breadcrumbItems = [
    { label: 'Início', href: '/' },
    { label: 'Meu Perfil', href: '/profile', icon: User, current: true }
  ];

  const handleSave = () => {
    setShowSuccess(true);
    setIsEditing(false);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  return (
    <>
      <PageHead
        title="Meu Perfil - Senhor Sorriso"
        description="Gerencie suas informações pessoais, consulte seu histórico e configure preferências no Senhor Sorriso."
        keywords="perfil, configurações, histórico consultas, dados pessoais, Senhor Sorriso"
        url="https://senhorsorrisso.com.br/profile"
      />
      <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <MainLayout>
          <div className={`w-full ${animations.pageEnter}`}>
            <div className="mobile-container px-4 py-6 max-w-7xl mx-auto">
              <div className="space-y-6">
                {/* Breadcrumbs */}
                <EnhancedBreadcrumbs items={breadcrumbItems} />

                {/* Header */}
                <div className="text-center">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
                    <User className="h-8 w-8 text-primary" />
                    Meu Perfil
                  </h1>
                  <p className="text-muted-foreground max-w-3xl mx-auto">
                    Gerencie suas informações pessoais e preferências para uma experiência personalizada
                  </p>
                </div>

                {/* Layout Principal */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Sidebar com Gamificação */}
                  <div className="lg:col-span-1 space-y-6">
                    <GamificationStats />
                    
                    <FeedbackSystem 
                      pageContext="Página de Perfil do Usuário"
                      onSubmit={(feedback) => {
                        console.log('Feedback do Perfil:', feedback);
                      }}
                    />
                  </div>

                  {/* Conteúdo Principal */}
                  <div className="lg:col-span-3">
                    <Tabs defaultValue="personal" className="space-y-6">
                      <TabsList className="grid w-full grid-cols-4 lg:grid-cols-6">
                        <TabsTrigger value="personal" className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span className="hidden sm:inline">Dados</span>
                        </TabsTrigger>
                        <TabsTrigger value="appointments" className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span className="hidden sm:inline">Consultas</span>
                        </TabsTrigger>
                        <TabsTrigger value="notifications" className="flex items-center gap-2">
                          <Bell className="h-4 w-4" />
                          <span className="hidden sm:inline">Notificações</span>
                        </TabsTrigger>
                        <TabsTrigger value="billing" className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4" />
                          <span className="hidden sm:inline">Pagamento</span>
                        </TabsTrigger>
                        <TabsTrigger value="security" className="flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          <span className="hidden sm:inline">Segurança</span>
                        </TabsTrigger>
                        <TabsTrigger value="settings" className="flex items-center gap-2">
                          <Settings className="h-4 w-4" />
                          <span className="hidden sm:inline">Configurações</span>
                        </TabsTrigger>
                      </TabsList>

                      {/* Dados Pessoais */}
                      <TabsContent value="personal">
                        <Card className={animations.fadeInUp}>
                          <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                              <User className="h-5 w-5 text-primary" />
                              Informações Pessoais
                            </CardTitle>
                            <Button
                              variant={isEditing ? "default" : "outline"}
                              size="sm"
                              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                              className={animations.buttonHover}
                            >
                              {isEditing ? (
                                <>
                                  <Save className="h-4 w-4 mr-2" />
                                  Salvar
                                </>
                              ) : (
                                <>
                                  <Edit2 className="h-4 w-4 mr-2" />
                                  Editar
                                </>
                              )}
                            </Button>
                          </CardHeader>
                          <CardContent className="space-y-6">
                            {/* Avatar */}
                            <div className="flex flex-col items-center space-y-4">
                              <div className="relative">
                                <Avatar className="h-24 w-24">
                                  <AvatarImage src="/placeholder-avatar.jpg" />
                                  <AvatarFallback className="text-lg">JS</AvatarFallback>
                                </Avatar>
                                {isEditing && (
                                  <Button
                                    size="sm"
                                    className="absolute -bottom-2 -right-2 rounded-full p-2 h-8 w-8"
                                  >
                                    <Camera className="h-3 w-3" />
                                  </Button>
                                )}
                              </div>
                            </div>

                            {/* Formulário */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="name">Nome Completo</Label>
                                <Input
                                  id="name"
                                  defaultValue="João Silva"
                                  disabled={!isEditing}
                                  className={!isEditing ? "bg-gray-50" : ""}
                                />
                              </div>
                              <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                  id="email"
                                  type="email"
                                  defaultValue="joao@email.com"
                                  disabled={!isEditing}
                                  className={!isEditing ? "bg-gray-50" : ""}
                                />
                              </div>
                              <div>
                                <Label htmlFor="phone">Telefone</Label>
                                <Input
                                  id="phone"
                                  defaultValue="(11) 99999-9999"
                                  disabled={!isEditing}
                                  className={!isEditing ? "bg-gray-50" : ""}
                                />
                              </div>
                              <div>
                                <Label htmlFor="birth">Data de Nascimento</Label>
                                <Input
                                  id="birth"
                                  type="date"
                                  defaultValue="1990-01-01"
                                  disabled={!isEditing}
                                  className={!isEditing ? "bg-gray-50" : ""}
                                />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>

                      {/* Outras abas com conteúdo placeholder */}
                      <TabsContent value="appointments">
                        <Card className={animations.fadeInUp}>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Calendar className="h-5 w-5 text-primary" />
                              Histórico de Consultas
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-gray-600">Suas consultas aparecerão aqui.</p>
                          </CardContent>
                        </Card>
                      </TabsContent>

                      <TabsContent value="notifications">
                        <Card className={animations.fadeInUp}>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Bell className="h-5 w-5 text-primary" />
                              Preferências de Notificação
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-gray-600">Configure suas notificações aqui.</p>
                          </CardContent>
                        </Card>
                      </TabsContent>

                      <TabsContent value="billing">
                        <Card className={animations.fadeInUp}>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <CreditCard className="h-5 w-5 text-primary" />
                              Informações de Pagamento
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-gray-600">Gerencie seus métodos de pagamento.</p>
                          </CardContent>
                        </Card>
                      </TabsContent>

                      <TabsContent value="security">
                        <Card className={animations.fadeInUp}>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Shield className="h-5 w-5 text-primary" />
                              Segurança da Conta
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-gray-600">Configure a segurança da sua conta.</p>
                          </CardContent>
                        </Card>
                      </TabsContent>

                      <TabsContent value="settings">
                        <Card className={animations.fadeInUp}>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Settings className="h-5 w-5 text-primary" />
                              Configurações Gerais
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-gray-600">Personalize sua experiência.</p>
                          </CardContent>
                        </Card>
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </MainLayout>
      </div>

      <SuccessAnimation
        show={showSuccess}
        message="Informações atualizadas com sucesso!"
      />
    </>
  );
};

export default EnhancedProfilePage;
