
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Phone } from 'lucide-react';
import { animations } from '@/lib/animations';

interface PhoneConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (phone: string) => void;
  appointmentData: {
    date: string;
    time: string;
    clinic: string;
    service: string;
  };
}

export const PhoneConfirmationModal: React.FC<PhoneConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  appointmentData
}) => {
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validatePhoneNumber = (phoneNumber: string): boolean => {
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    return cleanPhone.length >= 10 && cleanPhone.length <= 11;
  };

  const formatPhoneNumber = (phoneNumber: string): string => {
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    if (cleanPhone.length === 10) {
      return cleanPhone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else if (cleanPhone.length === 11) {
      return cleanPhone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return phoneNumber;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhone(formatted);
  };

  const handleConfirm = async () => {
    if (!validatePhoneNumber(phone)) {
      return;
    }

    setIsLoading(true);
    try {
      const cleanPhone = phone.replace(/\D/g, '');
      const formattedPhone = `+55${cleanPhone}`;
      await onConfirm(formattedPhone);
      onClose();
    } catch (error) {
      console.error('Erro ao confirmar agendamento:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isValidPhone = validatePhoneNumber(phone);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${animations.modalEnter} max-w-md`}>
        <DialogHeader>
          <div className="flex items-center space-x-3 mb-2">
            <Phone className="h-6 w-6 text-primary" />
            <DialogTitle className="text-lg font-semibold">
              Confirmar Telefone
            </DialogTitle>
          </div>
          <DialogDescription className="text-gray-600">
            Digite seu número de telefone para receber a confirmação do agendamento via WhatsApp.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Data:</span>
              <span>{appointmentData.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Horário:</span>
              <span>{appointmentData.time}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Clínica:</span>
              <span>{appointmentData.clinic}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Serviço:</span>
              <span>{appointmentData.service}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Número de Telefone</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="(31) 99999-9999"
              value={phone}
              onChange={handlePhoneChange}
              className="w-full"
            />
            {phone && !isValidPhone && (
              <p className="text-sm text-red-600">
                Digite um número válido com DDD
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirm}
              className="flex-1"
              disabled={!isValidPhone || isLoading}
            >
              {isLoading ? 'Confirmando...' : 'Confirmar Agendamento'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
