
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Phone, Calendar, Clock, MapPin, Stethoscope } from 'lucide-react';

export interface PhoneConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (name?: string, phone?: string) => Promise<void>;
  appointmentData: {
    date: string;
    time: string;
    clinic: string;
    service: string;
  };
  isLoading: boolean;
}

export const PhoneConfirmationModal: React.FC<PhoneConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  appointmentData,
  isLoading
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleConfirm = async () => {
    if (!name.trim() || !phone.trim()) return;
    await onConfirm(name, phone);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Confirmar Agendamento
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Resumo do agendamento */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <h3 className="font-semibold text-sm mb-2">Resumo:</h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{appointmentData.date}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{appointmentData.time}</span>
              </div>
              <div className="flex items-center gap-1 col-span-2">
                <MapPin className="h-3 w-3" />
                <span className="truncate">{appointmentData.clinic}</span>
              </div>
              <div className="flex items-center gap-1 col-span-2">
                <Stethoscope className="h-3 w-3" />
                <span>{appointmentData.service}</span>
              </div>
            </div>
          </div>

          {/* Formulário */}
          <div className="space-y-3">
            <div>
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                placeholder="Digite seu nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
              />
            </div>
            
            <div>
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                placeholder="(11) 99999-9999"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={isLoading || !name.trim() || !phone.trim()}
              className="flex-1"
            >
              {isLoading ? 'Confirmando...' : 'Confirmar'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
