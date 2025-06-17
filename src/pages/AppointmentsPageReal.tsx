
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Plus, History } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { HistoryTabReal } from '@/components/Profile/HistoryTabReal';
import { animations } from '@/lib/animations';

const AppointmentsPageReal = () => {
  const navigate = useNavigate();

  const handleNewAppointment = () => {
    navigate('/schedule');
  };

  return (
    <div className={`space-y-6 ${animations.pageEnter}`}>
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold mobile-text-xl flex items-center justify-center gap-2">
          <Calendar className="h-6 w-6 text-primary" />
          Minhas Consultas
        </h1>
        <p className="text-muted-foreground mobile-text-base mt-2">
          Gerencie seus agendamentos e histórico
        </p>
      </div>

      {/* Quick Actions */}
      <Card className="mobile-card-spacing">
        <CardHeader>
          <CardTitle className="mobile-text-lg">Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Button
              onClick={handleNewAppointment}
              className="w-full mobile-button"
              size="lg"
            >
              <Plus className="h-5 w-5 mr-2" />
              Agendar Nova Consulta
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Histórico de Consultas */}
      <Card className="mobile-card-spacing">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 mobile-text-lg">
            <History className="h-5 w-5" />
            Histórico de Consultas
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-4 md:p-6">
            <HistoryTabReal />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppointmentsPageReal;
