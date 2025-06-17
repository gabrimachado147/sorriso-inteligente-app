
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { AppointmentRecord } from '@/services/supabase/appointments';
import { AppointmentStatusBadge } from './AppointmentStatusBadge';
import { ServiceEditor } from './ServiceEditor';
import { BulkActions } from './BulkActions';
import { Phone, Mail, Calendar, Clock, User } from 'lucide-react';
import { animations } from '@/lib/animations';

interface EnhancedAppointmentsTableProps {
  appointments: AppointmentRecord[];
  onStatusChange: (appointmentId: string, newStatus: 'confirmed' | 'cancelled' | 'completed' | 'no_show') => void;
  onServiceUpdate: (appointmentId: string, service: string, price?: number) => void;
  onBulkStatusUpdate: (appointmentIds: string[], status: string) => void;
  onSendBulkMessage: (appointmentIds: string[], template: string) => void;
  isUpdating: boolean;
}

export const EnhancedAppointmentsTable: React.FC<EnhancedAppointmentsTableProps> = ({
  appointments,
  onStatusChange,
  onServiceUpdate,
  onBulkStatusUpdate,
  onSendBulkMessage,
  isUpdating
}) => {
  const [selectedAppointments, setSelectedAppointments] = useState<string[]>([]);
  const [editingService, setEditingService] = useState<string | null>(null);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedAppointments(appointments.map(apt => apt.id));
    } else {
      setSelectedAppointments([]);
    }
  };

  const handleSelectAppointment = (appointmentId: string, checked: boolean) => {
    if (checked) {
      setSelectedAppointments(prev => [...prev, appointmentId]);
    } else {
      setSelectedAppointments(prev => prev.filter(id => id !== appointmentId));
    }
  };

  const isAllSelected = appointments.length > 0 && selectedAppointments.length === appointments.length;
  const isPartiallySelected = selectedAppointments.length > 0 && selectedAppointments.length < appointments.length;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR');
  };

  const formatTime = (timeStr: string) => {
    return timeStr.slice(0, 5);
  };

  if (appointments.length === 0) {
    return (
      <Card className={animations.fadeIn}>
        <CardContent className="p-8 text-center">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum agendamento encontrado</h3>
          <p className="text-gray-600">Não há agendamentos para os filtros selecionados.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <BulkActions
        selectedAppointments={selectedAppointments}
        appointments={appointments}
        onBulkStatusUpdate={onBulkStatusUpdate}
        onSendBulkMessage={onSendBulkMessage}
        onClearSelection={() => setSelectedAppointments([])}
      />

      <Card className={animations.fadeIn}>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={isAllSelected}
                      onCheckedChange={handleSelectAll}
                      aria-label="Selecionar todos"
                      className={isPartiallySelected ? "data-[state=checked]:bg-primary" : ""}
                    />
                  </TableHead>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Contato</TableHead>
                  <TableHead>Data/Hora</TableHead>
                  <TableHead>Serviço</TableHead>
                  <TableHead>Clínica</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((appointment) => (
                  <TableRow 
                    key={appointment.id}
                    className={`hover:bg-gray-50 transition-colors ${
                      selectedAppointments.includes(appointment.id) ? 'bg-blue-50' : ''
                    }`}
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedAppointments.includes(appointment.id)}
                        onCheckedChange={(checked) => 
                          handleSelectAppointment(appointment.id, checked as boolean)
                        }
                        aria-label={`Selecionar agendamento de ${appointment.name}`}
                      />
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">{appointment.name}</p>
                          {appointment.email && (
                            <p className="text-xs text-gray-500">{appointment.email}</p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="h-3 w-3 text-gray-400" />
                          <span>{appointment.phone}</span>
                        </div>
                        {appointment.email && (
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Mail className="h-3 w-3 text-gray-400" />
                            <span className="truncate max-w-32">{appointment.email}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {formatDate(appointment.date)}
                          </p>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {formatTime(appointment.time)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      {editingService === appointment.id ? (
                        <ServiceEditor
                          service={appointment.service}
                          price={(appointment as any).price}
                          onSave={(service: string, price?: number) => {
                            onServiceUpdate(appointment.id, service, price);
                            setEditingService(null);
                          }}
                          onCancel={() => setEditingService(null)}
                        />
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingService(appointment.id)}
                          className="h-auto p-1 hover:bg-gray-100"
                        >
                          <div className="text-left">
                            <p className="font-medium text-gray-900 text-sm">
                              {appointment.service}
                            </p>
                            {(appointment as any).price && (
                              <p className="text-xs text-green-600">
                                R$ {(appointment as any).price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              </p>
                            )}
                          </div>
                        </Button>
                      )}
                    </TableCell>
                    
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">
                        {appointment.clinic}
                      </Badge>
                    </TableCell>
                    
                    <TableCell>
                      <AppointmentStatusBadge
                        status={appointment.status}
                        appointmentId={appointment.id}
                        onStatusChange={onStatusChange}
                        isUpdating={isUpdating}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between text-sm text-gray-600">
        <div>
          Mostrando {appointments.length} agendamento{appointments.length !== 1 ? 's' : ''}
          {selectedAppointments.length > 0 && (
            <span className="ml-2 text-blue-600">
              ({selectedAppointments.length} selecionado{selectedAppointments.length !== 1 ? 's' : ''})
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
