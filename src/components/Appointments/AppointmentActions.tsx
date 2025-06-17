
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, X, Clock, MoreVertical } from 'lucide-react';
import { AppointmentActionsService } from '@/services/supabase/appointmentActions';
import { RealAppointmentRecord } from '@/services/supabase/realAppointments';

interface AppointmentActionsProps {
  appointment: RealAppointmentRecord;
  onUpdate: () => void;
  isAdmin?: boolean;
}

export const AppointmentActions: React.FC<AppointmentActionsProps> = ({
  appointment,
  onUpdate,
  isAdmin = false
}) => {
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rescheduleData, setRescheduleData] = useState({
    newDate: '',
    newTime: '',
    reason: ''
  });
  const [cancelReason, setCancelReason] = useState('');

  const canModify = appointment.status === 'confirmed' || appointment.status === 'pending';
  const isPastAppointment = new Date(appointment.date) < new Date();

  const handleReschedule = async () => {
    if (!rescheduleData.newDate || !rescheduleData.newTime) {
      return;
    }

    setLoading(true);
    try {
      // Verificar disponibilidade do horário
      const isAvailable = await AppointmentActionsService.isTimeSlotAvailable(
        rescheduleData.newDate,
        rescheduleData.newTime,
        appointment.clinic,
        appointment.id
      );

      if (!isAvailable) {
        alert('Este horário já está ocupado. Escolha outro horário.');
        return;
      }

      await AppointmentActionsService.rescheduleAppointment({
        appointmentId: appointment.id,
        newDate: rescheduleData.newDate,
        newTime: rescheduleData.newTime,
        reason: rescheduleData.reason
      });

      setIsRescheduleOpen(false);
      setRescheduleData({ newDate: '', newTime: '', reason: '' });
      onUpdate();
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    setLoading(true);
    try {
      await AppointmentActionsService.cancelAppointment({
        appointmentId: appointment.id,
        reason: cancelReason
      });

      setIsCancelOpen(false);
      setCancelReason('');
      onUpdate();
    } catch (error) {
      console.error('Error cancelling appointment:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-800 whitespace-nowrap">Confirmado</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800 whitespace-nowrap">Cancelado</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800 whitespace-nowrap">Concluído</Badge>;
      case 'no_show':
        return <Badge className="bg-orange-100 text-orange-800 whitespace-nowrap">Não Compareceu</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 whitespace-nowrap">{status}</Badge>;
    }
  };

  if (!canModify) {
    return (
      <div className="flex items-center justify-center w-full">
        {getStatusBadge(appointment.status)}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 w-full">
      <div className="flex-shrink-0">
        {getStatusBadge(appointment.status)}
      </div>
      
      {!isPastAppointment && (
        <div className="flex items-center gap-1 ml-auto">
          {/* Mobile: Dropdown Menu */}
          <div className="block sm:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-white z-50">
                <Dialog open={isRescheduleOpen} onOpenChange={setIsRescheduleOpen}>
                  <DialogTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                      <Calendar className="h-4 w-4 mr-2" />
                      Reagendar
                    </DropdownMenuItem>
                  </DialogTrigger>
                </Dialog>
                
                <AlertDialog open={isCancelOpen} onOpenChange={setIsCancelOpen}>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600">
                      <X className="h-4 w-4 mr-2" />
                      Cancelar
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                </AlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Desktop: Individual Buttons */}
          <div className="hidden sm:flex gap-1">
            <Dialog open={isRescheduleOpen} onOpenChange={setIsRescheduleOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="whitespace-nowrap text-xs">
                  <Calendar className="h-3 w-3 mr-1" />
                  Reagendar
                </Button>
              </DialogTrigger>
            </Dialog>

            <AlertDialog open={isCancelOpen} onOpenChange={setIsCancelOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 whitespace-nowrap text-xs">
                  <X className="h-3 w-3 mr-1" />
                  Cancelar
                </Button>
              </AlertDialogTrigger>
            </AlertDialog>
          </div>

          {/* Reagendar Dialog */}
          <Dialog open={isRescheduleOpen} onOpenChange={setIsRescheduleOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Reagendar Consulta</DialogTitle>
                <DialogDescription>
                  Escolha uma nova data e horário para sua consulta.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="newDate">Nova Data</Label>
                  <Input
                    id="newDate"
                    type="date"
                    value={rescheduleData.newDate}
                    onChange={(e) => setRescheduleData(prev => ({ ...prev, newDate: e.target.value }))}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <Label htmlFor="newTime">Novo Horário</Label>
                  <Input
                    id="newTime"
                    type="time"
                    value={rescheduleData.newTime}
                    onChange={(e) => setRescheduleData(prev => ({ ...prev, newTime: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="reason">Motivo (opcional)</Label>
                  <Textarea
                    id="reason"
                    placeholder="Informe o motivo do reagendamento..."
                    value={rescheduleData.reason}
                    onChange={(e) => setRescheduleData(prev => ({ ...prev, reason: e.target.value }))}
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setIsRescheduleOpen(false)}
                    disabled={loading}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleReschedule}
                    disabled={loading || !rescheduleData.newDate || !rescheduleData.newTime}
                  >
                    {loading ? 'Reagendando...' : 'Reagendar'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Cancelar Dialog */}
          <AlertDialog open={isCancelOpen} onOpenChange={setIsCancelOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Cancelar Consulta</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja cancelar esta consulta? Esta ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="my-4">
                <Label htmlFor="cancelReason">Motivo do cancelamento (opcional)</Label>
                <Textarea
                  id="cancelReason"
                  placeholder="Informe o motivo do cancelamento..."
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                />
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={loading}>Não cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleCancel}
                  disabled={loading}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {loading ? 'Cancelando...' : 'Sim, cancelar consulta'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </div>
  );
};
