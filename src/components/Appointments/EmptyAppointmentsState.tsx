
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { animations } from '@/lib/animations';

export const EmptyAppointmentsState: React.FC = () => {
  return (
    <Card className={animations.fadeIn}>
      <CardContent className="p-8 text-center">
        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Nenhum agendamento encontrado
        </h3>
        <p className="text-gray-600">
          Não há agendamentos que correspondam aos filtros selecionados.
        </p>
      </CardContent>
    </Card>
  );
};
