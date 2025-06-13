
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User } from 'lucide-react';
import { animations } from '@/lib/animations';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { toastSuccess, toastError } from '@/components/ui/custom-toast';
import { QuickLinks } from './QuickLinks';

export const ProfileTab = () => {
  const { user } = useAuth();
  const { profile, updateProfile } = useProfile();
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
    </div>
  );
};
