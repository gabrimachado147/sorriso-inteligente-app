import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { animations } from '@/lib/animations';
import { Clock, Calendar } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useRealUserAppointments } from '@/hooks/useRealUserAppointments';
import { useNavigate } from 'react-router-dom';

interface AppointmentsSectionProps {
  onReschedule: () => void;
  onViewAllAppointments: () => void;
}

export const AppointmentsSection: React.FC<AppointmentsSectionProps> = ({
  onReschedule,
  onViewAllAppointments
}) => {
  const { isAuthenticated } = useAuth();
  const { appointments, loading } = useRealUserAppointments();
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/profile');
  };

  if (!isAuthenticated) {
    return (
      <Card className={animations.slideInRight}>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Próximas Consultas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 mb-4">Faça login para ver suas consultas</p>
            <Button 
              variant="outline"
              onClick={handleLoginClick}
              className={animations.buttonHover}
            >
              Fazer Login
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className={animations.slideInRight}>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Próximas Consultas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-16 bg-gray-200 rounded-lg"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const upcomingAppointments = appointments.filter(apt => 
    apt.status === 'confirmed' && new Date(apt.date) >= new Date()
  ).slice(0, 2);

  return (
    <Card className={animations.slideInRight}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="h-5 w-5 mr-2" />
          Próximas Consultas
        </CardTitle>
      </CardHeader>
      <CardContent>
        {upcomingAppointments.length === 0 ? (
          <div className="text-center py-6">
            <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 mb-4">Você não tem consultas agendadas</p>
            <Button 
              variant="outline"
              onClick={onViewAllAppointments}
              className={animations.buttonHover}
            >
              Agendar Consulta
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingAppointments.map((appointment) => (
              <div key={appointment.id} className={`flex items-center justify-between p-3 bg-blue-50 rounded-lg ${animations.cardHover}`}>
                <div>
                  <p className="font-medium">{appointment.service}</p>
                  <p className="text-sm text-gray-600">{appointment.clinic}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(appointment.date).toLocaleDateString('pt-BR')} às {appointment.time}
                  </p>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={onReschedule}
                  className={animations.buttonHover}
                >
                  Remarcar
                </Button>
              </div>
            ))}
            
            <div className="text-center py-2">
              <Button 
                variant="ghost" 
                className={`text-primary ${animations.buttonHover}`}
                onClick={onViewAllAppointments}
              >
                Ver todas as consultas
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
