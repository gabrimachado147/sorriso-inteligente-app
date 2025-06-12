
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface RescheduleNotificationProps {
  rescheduleId: string;
}

export const RescheduleNotification: React.FC<RescheduleNotificationProps> = ({
  rescheduleId
}) => {
  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardContent className="p-4">
        <p className="text-blue-800">
          <strong>Reagendamento:</strong> Você está alterando a consulta #{rescheduleId}
        </p>
      </CardContent>
    </Card>
  );
};
