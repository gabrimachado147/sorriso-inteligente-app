
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
    full_name: '',
    phone: '',
    date_of_birth: ''
  });

  React.useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        date_of_birth: profile.date_of_birth || ''
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
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4 mobile-skeleton-text"></div>
          <div className="h-32 bg-gray-200 rounded mobile-skeleton"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className={`${animations.fadeIn} mobile-card-spacing`}>
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
              className="mobile-touch-target"
            >
              {editMode ? 'Salvar' : 'Editar'}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome" className="mobile-text-sm">Nome Completo</Label>
              <Input
                id="nome"
                value={formData.full_name}
                onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                disabled={!editMode}
                placeholder={!profile ? "Digite seu nome completo" : undefined}
                className="mobile-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefone" className="mobile-text-sm">Telefone</Label>
              <Input
                id="telefone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                disabled={!editMode}
                placeholder={!profile ? "(11) 99999-9999" : undefined}
                className="mobile-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="mobile-text-sm">Email</Label>
              <Input
                id="email"
                value={user?.email || ''}
                disabled
                className="bg-gray-100 mobile-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="data_nascimento" className="mobile-text-sm">Data de Nascimento</Label>
              <Input
                id="data_nascimento"
                type="date"
                value={formData.date_of_birth}
                onChange={(e) => setFormData(prev => ({ ...prev, date_of_birth: e.target.value }))}
                disabled={!editMode}
                className="mobile-input"
              />
            </div>
          </div>
          
          {!profile && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-blue-700 text-sm mobile-text-sm">
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
