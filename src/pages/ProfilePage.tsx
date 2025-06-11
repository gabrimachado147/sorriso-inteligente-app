import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, Mail, Phone, MapPin, Calendar, Edit, Save, X } from 'lucide-react';
import { toastSuccess } from '@/components/ui/custom-toast';

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
    </div>
  );
};

export default ProfilePage;
