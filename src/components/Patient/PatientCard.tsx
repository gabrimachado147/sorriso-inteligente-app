
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Phone, Calendar, MapPin } from 'lucide-react';

interface PatientCardProps {
  patient: {
    id: string;
    name: string;
    phone: string;
    email?: string;
    lastAppointment?: string;
    status: 'active' | 'inactive' | 'pending';
    city?: string;
  };
  onViewDetails?: (patientId: string) => void;
  onScheduleAppointment?: (patientId: string) => void;
  variant?: 'compact' | 'detailed';
}

export const PatientCard: React.FC<PatientCardProps> = ({
  patient,
  onViewDetails,
  onScheduleAppointment,
  variant = 'compact'
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <User className="h-5 w-5 text-primary" />
            {patient.name}
          </CardTitle>
          <Badge className={getStatusColor(patient.status)}>
            {patient.status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Phone className="h-4 w-4" />
          {patient.phone}
        </div>
        
        {patient.email && variant === 'detailed' && (
          <div className="text-sm text-gray-600">
            {patient.email}
          </div>
        )}
        
        {patient.city && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4" />
            {patient.city}
          </div>
        )}
        
        {patient.lastAppointment && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            Última consulta: {patient.lastAppointment}
          </div>
        )}
        
        <div className="flex gap-2 pt-2">
          {onViewDetails && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(patient.id)}
              className="flex-1"
            >
              Ver Detalhes
            </Button>
          )}
          {onScheduleAppointment && (
            <Button
              size="sm"
              onClick={() => onScheduleAppointment(patient.id)}
              className="flex-1"
            >
              Agendar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
