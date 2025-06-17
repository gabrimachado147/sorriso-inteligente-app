
import React from 'react';
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
import { Trash2, AlertTriangle } from 'lucide-react';
import { AppointmentRecord } from '@/services/supabase/appointments';

interface DeleteAppointmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  appointment: AppointmentRecord | null;
  isDeleting: boolean;
}

export const DeleteAppointmentDialog: React.FC<DeleteAppointmentDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  appointment,
  isDeleting
}) => {
  if (!appointment) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-100 rounded-full">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <AlertDialogTitle className="text-lg font-semibold text-red-800">
              Excluir Agendamento
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-gray-600">
            Tem certeza que deseja excluir permanentemente este agendamento? 
            Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="bg-gray-50 p-4 rounded-lg space-y-2 my-4">
          <div className="flex justify-between">
            <span className="font-medium">Paciente:</span>
            <span>{appointment.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Data:</span>
            <span>{new Date(appointment.date).toLocaleDateString('pt-BR')}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Horário:</span>
            <span>{appointment.time}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Serviço:</span>
            <span>{appointment.service}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Clínica:</span>
            <span>{appointment.clinic}</span>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {isDeleting ? 'Excluindo...' : 'Excluir Permanentemente'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
