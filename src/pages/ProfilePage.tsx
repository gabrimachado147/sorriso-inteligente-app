import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { EnhancedSkeleton } from '@/components/ui/enhanced-skeleton';
import useAuth from '@/hooks/useAuth';
import { appointmentService } from '@/services/supabase/appointments';
import { format } from 'date-fns';
import type { Appointment } from '@/integrations/supabase/types';

interface AppointmentWithDetails extends Appointment {
  clinic?: { id: string; name: string } | null;
  dentist?: { id: string; full_name?: string } | null;
  service?: { id: string; name?: string } | null;
  appointment_time?: string | null;
  date?: string;
  time?: string;
}

const ProfilePage: React.FC = () => {
  const {
    user,
    profile,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
    clearError,
  } = useAuth();

  const [appointments, setAppointments] = useState<AppointmentWithDetails[]>([]);
  const [formType, setFormType] = useState<'login' | 'register'>('login');

  useEffect(() => {
    const loadAppointments = async () => {
      if (isAuthenticated && user) {
        try {
          const data = await appointmentService.getUserAppointments(user.id, {
            upcoming: true,
            limit: 5,
          });
          setAppointments(data);
        } catch (err) {
          console.error('Failed to load appointments:', err);
        }
      }
    };
    loadAppointments();
  }, [isAuthenticated, user]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await login({
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    });
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await register({
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <EnhancedSkeleton variant="list-item" count={3} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto p-6 space-y-4">
        {error && (
          <Alert variant="destructive" onClick={clearError}>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {formType === 'login' ? (
          <Card>
            <CardHeader>
              <CardTitle>Entrar</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <Input type="email" name="email" placeholder="Email" required />
                <Input type="password" name="password" placeholder="Senha" required />
                <Button type="submit" className="w-full">Entrar</Button>
              </form>
              <Button variant="ghost" className="mt-4 w-full" onClick={() => setFormType('register')}>
                Criar conta
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Criar Conta</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRegister} className="space-y-4">
                <Input name="name" placeholder="Nome" required />
                <Input type="email" name="email" placeholder="Email" required />
                <Input name="phone" placeholder="Telefone" />
                <Input type="password" name="password" placeholder="Senha" required />
                <Button type="submit" className="w-full">Registrar</Button>
              </form>
              <Button variant="ghost" className="mt-4 w-full" onClick={() => setFormType('login')}>
                Já tenho conta
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Minha Conta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p><strong>Nome:</strong> {profile?.full_name || user?.email}</p>
          <p><strong>Email:</strong> {profile?.email || user?.email}</p>
          {profile?.phone && <p><strong>Telefone:</strong> {profile.phone}</p>}
          <Button variant="outline" onClick={() => logout()} className="mt-4">Sair</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Próximas Consultas</CardTitle>
        </CardHeader>
        <CardContent>
          {appointments.length === 0 ? (
            <p className="text-sm text-gray-500">Nenhuma consulta agendada.</p>
          ) : (
            <ul className="space-y-3">
              {appointments.map((apt) => (
                <li key={apt.id} className="p-3 border rounded-lg flex justify-between">
                  <div>
                    <p className="font-medium">
                      {typeof apt.service === 'string' ? apt.service : apt.service?.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {format(new Date(apt.appointment_date), 'dd/MM/yyyy')} às {apt.appointment_time}
                    </p>
                    {apt.clinic && (
                      <p className="text-sm text-gray-600">
                        {typeof apt.clinic === 'string' ? apt.clinic : apt.clinic.name}
                      </p>
                    )}
                  </div>
                  <span className="text-sm capitalize">{apt.status}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
