import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, Phone, Calendar, Edit2, LogOut, Save, X, CalendarPlus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { ProtectedRoute } from '@/components/Auth/ProtectedRoute';
import { QuickLinks } from '@/components/Profile/QuickLinks';
import { toastSuccess, toastError } from '@/components/ui/custom-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { profile, loading, updateProfile } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    nome_completo: '',
    telefone: ''
  });

  React.useEffect(() => {
    if (profile) {
      setEditData({
        nome_completo: profile.nome_completo,
        telefone: profile.telefone
      });
    }
  }, [profile]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (profile) {
      setEditData({
        nome_completo: profile.nome_completo,
        telefone: profile.telefone
      });
    }
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      const result = await updateProfile(editData);
      
      if (result.success) {
        toastSuccess('Sucesso', 'Perfil atualizado com sucesso!');
        setIsEditing(false);
      } else {
        toastError('Erro', result.error || 'Erro ao atualizar perfil');
      }
    } catch (error) {
      toastError('Erro', 'Erro inesperado ao atualizar perfil');
    }
  };

  const handleLogout = async () => {
    try {
      const result = await logout();
      if (result.success) {
        toastSuccess('Sucesso', 'Logout realizado com sucesso!');
      }
    } catch (error) {
      toastError('Erro', 'Erro ao fazer logout');
    }
  };

  const formatPhone = (phone: string) => {
    const numbers = phone.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return phone;
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhone(value);
    setEditData(prev => ({ ...prev, telefone: formatted }));
  };

  const handleScheduleWithoutAccount = () => {
    navigate('/schedule');
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="p-6 space-y-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <User className="h-6 w-6" />
            Meu Perfil
          </h1>
          <Card>
            <CardContent className="p-6">
              <p>Carregando...</p>
            </CardContent>
          </Card>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <User className="h-6 w-6" />
          Meu Perfil
        </h1>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Informações Pessoais</CardTitle>
            {!isEditing ? (
              <Button variant="outline" size="sm" onClick={handleEdit}>
                <Edit2 className="h-4 w-4 mr-2" />
                Editar
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
                <Button size="sm" onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome Completo</Label>
                  <Input
                    id="nome"
                    value={editData.nome_completo}
                    onChange={(e) => setEditData(prev => ({ ...prev, nome_completo: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    value={editData.telefone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    maxLength={15}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <span>{profile?.nome_completo || 'Nome não informado'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <span>{profile?.telefone || 'Telefone não informado'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <span>
                    Cliente desde: {profile?.created_at 
                      ? format(new Date(profile.created_at), 'MMMM yyyy', { locale: ptBR })
                      : 'Data não disponível'
                    }
                  </span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Quick Links para recursos avançados */}
        <QuickLinks />

        <Card>
          <CardHeader>
            <CardTitle>Ações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              className="w-full" 
              variant="default"
              onClick={handleScheduleWithoutAccount}
            >
              <CalendarPlus className="h-4 w-4 mr-2" />
              Agendar sem criar conta
            </Button>
            <Button className="w-full" variant="outline">
              Alterar Senha
            </Button>
            <Button className="w-full" variant="outline">
              Preferências de Notificação
            </Button>
            <Button 
              className="w-full" 
              variant="destructive"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair da Conta
            </Button>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
};

export default ProfilePage;
