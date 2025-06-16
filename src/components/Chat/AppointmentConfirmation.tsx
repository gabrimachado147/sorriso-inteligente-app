
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Calendar, Clock, MapPin, User } from 'lucide-react';
import { animations } from '@/lib/animations';

interface AppointmentConfirmationProps {
  appointmentData: {
    name: string;
    service: string;
    clinic: string;
    date: string;
    time: string;
  };
}

export const AppointmentConfirmation: React.FC<AppointmentConfirmationProps> = ({ 
  appointmentData 
}) => {
  return (
    <Card className={`bg-green-50 border-green-200 ${animations.scaleIn}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          
          <div className="flex-1">
            <h4 className="font-semibold text-green-800 mb-2">
              ✅ Agendamento Confirmado!
            </h4>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-green-700">
                <User className="h-4 w-4" />
                <span>{appointmentData.name}</span>
              </div>
              
              <div className="flex items-center gap-2 text-green-700">
                <Calendar className="h-4 w-4" />
                <span>{appointmentData.date}</span>
              </div>
              
              <div className="flex items-center gap-2 text-green-700">
                <Clock className="h-4 w-4" />
                <span>{appointmentData.time}</span>
              </div>
              
              <div className="flex items-center gap-2 text-green-700">
                <MapPin className="h-4 w-4" />
                <span>{appointmentData.clinic}</span>
              </div>
            </div>
            
            <div className="mt-3 p-2 bg-white rounded border border-green-200">
              <p className="text-xs text-green-600">
                💬 Você receberá um lembrete via WhatsApp 1 dia antes da consulta.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
