
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MoreHorizontal, Calendar, X, Phone, Mail, Trash2 } from 'lucide-react';
import { AppointmentActionsService } from '@/services/supabase/appointmentActions';
import { AppointmentRecord } from '@/services/supabase/appointments';
import { DeleteAppointmentDialog } from './DeleteAppointmentDialog';

interface AdminAppointmentActionsProps {
  appointment: AppointmentRecord;
  onUpdate: () => void;
  onDelete?: (appointmentId: string) => void;
}

export const AdminAppointmentActions: React.FC<AdminAppointmentActionsProps> = ({
  appointment,
  onUpdate,
  onDelete
}) => {
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rescheduleData, setRescheduleData] = useState({
    newDate: '',
    newTime: '',
    reason: ''
  });
  const [cancelReason, setCancelReason] = useState('');

  const canModify = appointment.status !== 'cancelled' && appointment.status !== 'completed';

  const handleReschedule = async () => {
    if (!rescheduleData.newDate || !rescheduleData.newTime) {
      return;
    }

    setLoading(true);
    try {
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
        reason: rescheduleData.reason || 'Reagendado pela administração'
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
        reason: cancelReason || 'Cancelado pela administração'
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

  const handleDelete = async () => {
    if (onDelete) {
      onDelete(appointment.id);
    }
    setIsDeleteOpen(false);
  };

  const handleContact = (type: 'phone' | 'email') => {
    if (type === 'phone' && appointment.phone) {
      window.open(`tel:${appointment.phone}`, '_blank');
    } else if (type === 'email' && appointment.email) {
      window.open(`mailto:${appointment.email}`, '_blank');
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Abrir menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Ações</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {appointment.phone && (
            <DropdownMenuItem onClick={() => handleContact('phone')}>
              <Phone className="mr-2 h-4 w-4" />
              Ligar para paciente
            </DropdownMenuItem>
          )}
          
          {appointment.email && (
            <DropdownMenuItem onClick={() => handleContact('email')}>
              <Mail className="mr-2 h-4 w-4" />
              Enviar email
            </DropdownMenuItem>
          )}
          
          {canModify && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setIsRescheduleOpen(true)}>
                <Calendar className="mr-2 h-4 w-4" />
                Reagendar
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setIsCancelOpen(true)}
                className="text-red-600"
              >
                <X className="mr-2 h-4 w-4" />
                Cancelar consulta
              </DropdownMenuItem>
            </>
          )}
          
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={() => setIsDeleteOpen(true)}
            className="text-red-600 focus:text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Excluir permanentemente
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Dialog de Reagendamento */}
      <Dialog open={isRescheduleOpen} onOpenChange={setIsRescheduleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reagendar Consulta - {appointment.name}</DialogTitle>
            <DialogDescription>
              Escolha uma nova data e horário para a consulta.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
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
            </div>
            <div>
              <Label htmlFor="reason">Motivo do reagendamento</Label>
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

      {/* Dialog de Cancelamento */}
      <AlertDialog open={isCancelOpen} onOpenChange={setIsCancelOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancelar Consulta - {appointment.name}</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja cancelar esta consulta? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="my-4">
            <Label htmlFor="cancelReason">Motivo do cancelamento</Label>
            <Textarea
              id="cancelReason"
              placeholder="Informe o motivo do cancelamento..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancelar ação</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancel}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700"
            >
              {loading ? 'Cancelando...' : 'Confirmar cancelamento'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog de Exclusão */}
      <DeleteAppointmentDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        appointment={appointment}
        isDeleting={loading}
      />
    </>
  );
};
