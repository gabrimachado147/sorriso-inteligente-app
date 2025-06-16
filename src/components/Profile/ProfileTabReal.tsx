
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User } from 'lucide-react';
import { animations } from '@/lib/animations';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProfile';
import { toastSuccess, toastError } from '@/components/ui/custom-toast';
import { QuickLinks } from './QuickLinks';

interface ProfileTabRealProps {
  onTabChange: (tabValue: string) => void;
}

export const ProfileTabReal: React.FC<ProfileTabRealProps> = ({ onTabChange }) => {
  const { user } = useAuth();
  const { profile, updateProfile, createProfile, loading } = useUserProfile();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    nome_completo: '',
    telefone: '',
    data_nascimento: ''
  });

  React.useEffect(() => {
    if (profile) {
      setFormData({
        nome_completo: profile.nome_completo || '',
        telefone: profile.telefone || '',
        data_nascimento: profile.data_nascimento || ''
      });
    }
  }, [profile]);

  const handleSaveProfile = async () => {
    try {
      let result;
      
      if (profile) {
        // Atualizar perfil existente
        result = await updateProfile(formData);
      } else {
        // Criar novo perfil
        result = await createProfile(formData);
      }
      
      if (result && result.success) {
        setEditMode(false);
        toastSuccess('Perfil atualizado', 'Suas informações foram salvas com sucesso');
      } else {
        toastError('Erro', result?.error || 'Não foi possível atualizar o perfil');
      }
    } catch (error) {
      toastError('Erro', 'Erro interno do sistema');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
                placeholder={!profile ? "Digite seu nome completo" : undefined}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={(e) => setFormData(prev => ({ ...prev, telefone: e.target.value }))}
                disabled={!editMode}
                placeholder={!profile ? "(11) 99999-9999" : undefined}
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
            <div className="space-y-2">
              <Label htmlFor="data_nascimento">Data de Nascimento</Label>
              <Input
                id="data_nascimento"
                type="date"
                value={formData.data_nascimento}
                onChange={(e) => setFormData(prev => ({ ...prev, data_nascimento: e.target.value }))}
                disabled={!editMode}
              />
            </div>
          </div>
          
          {!profile && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-blue-700 text-sm">
                Complete seu perfil para uma melhor experiência no app.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <QuickLinks onTabChange={onTabChange} />
    </div>
  );
};
