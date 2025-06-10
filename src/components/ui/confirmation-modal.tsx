
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
import { animations } from '@/lib/animations';
import { Calendar, X, User, AlertCircle } from 'lucide-react';

interface AppointmentInfo {
  date: string;
  time: string;
  clinic: string;
  service: string;
}

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  type: 'appointment' | 'cancel' | 'personal-data' | 'emergency';
  title?: string;
  description?: string;
  data?: AppointmentInfo;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  type,
  title,
  description,
  data
}) => {
  const getModalContent = () => {
    switch (type) {
      case 'appointment':
        return {
          icon: <Calendar className="h-6 w-6 text-primary" />,
          title: title || 'Confirmar Agendamento',
          description: description || `Deseja confirmar o agendamento para ${data?.date} às ${data?.time} na unidade ${data?.clinic}?`,
          confirmText: 'Confirmar Agendamento',
          cancelText: 'Cancelar',
          confirmStyle: 'bg-primary hover:bg-primary/90'
        };
      
      case 'cancel':
        return {
          icon: <X className="h-6 w-6 text-destructive" />,
          title: title || 'Cancelar Consulta',
          description: description || 'Tem certeza que deseja cancelar esta consulta? Esta ação não pode ser desfeita.',
          confirmText: 'Sim, Cancelar',
          cancelText: 'Manter Consulta',
          confirmStyle: 'bg-destructive hover:bg-destructive/90'
        };
      
      case 'personal-data':
        return {
          icon: <User className="h-6 w-6 text-blue-600" />,
          title: title || 'Confirmar Dados Pessoais',
          description: description || 'Confirme se seus dados estão corretos antes de prosseguir com o agendamento.',
          confirmText: 'Dados Corretos',
          cancelText: 'Editar Dados',
          confirmStyle: 'bg-blue-600 hover:bg-blue-700'
        };
      
      case 'emergency':
        return {
          icon: <AlertCircle className="h-6 w-6 text-red-600" />,
          title: title || 'Urgência Dental',
          description: description || 'Detectamos que você tem uma urgência dental. Deseja ser direcionado para o atendimento prioritário?',
          confirmText: 'Sim, é Urgente',
          cancelText: 'Agendamento Normal',
          confirmStyle: 'bg-red-600 hover:bg-red-700'
        };
      
      default:
        return {
          icon: <Calendar className="h-6 w-6 text-primary" />,
          title: title || 'Confirmar Ação',
          description: description || 'Deseja confirmar esta ação?',
          confirmText: 'Confirmar',
          cancelText: 'Cancelar',
          confirmStyle: 'bg-primary hover:bg-primary/90'
        };
    }
  };

  const content = getModalContent();

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className={`${animations.modalEnter} max-w-md`}>
        <AlertDialogHeader>
          <div className="flex items-center space-x-3 mb-2">
            {content.icon}
            <AlertDialogTitle className="text-lg font-semibold">
              {content.title}
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-gray-600">
            {content.description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        {data && type === 'appointment' && (
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Data:</span>
              <span>{data.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Horário:</span>
              <span>{data.time}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Clínica:</span>
              <span>{data.clinic}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Serviço:</span>
              <span>{data.service}</span>
            </div>
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose} className={animations.buttonHover}>
            {content.cancelText}
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className={`${content.confirmStyle} ${animations.buttonHover}`}
          >
            {content.confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
