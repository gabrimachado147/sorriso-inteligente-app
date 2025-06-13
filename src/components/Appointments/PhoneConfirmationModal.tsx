
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
import { Calendar, Clock, MapPin, User2 } from 'lucide-react';
import { animations } from '@/lib/animations';

interface PhoneConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (name: string, phone: string) => void;
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
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !phone.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onConfirm(name.trim(), phone.trim());
      setName('');
      setPhone('');
    } catch (error) {
      console.error('Error confirming appointment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPhone = (value: string) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');
    
    // Aplica a máscara (XX) XXXXX-XXXX
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    
    return value;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    if (formatted.length <= 15) {
      setPhone(formatted);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`sm:max-w-md ${animations.slideInBottom}`}>
        <DialogHeader>
          <DialogTitle className="text-center">Finalizar Agendamento</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Resumo do agendamento */}
          <div className="bg-blue-50 p-4 rounded-lg space-y-3">
            <h3 className="font-semibold text-blue-900 mb-3">Resumo da Consulta</h3>
            
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="h-4 w-4 text-blue-600" />
              <span className="text-blue-800">{appointmentData.date}</span>
            </div>
            
            <div className="flex items-center gap-3 text-sm">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="text-blue-800">{appointmentData.time}</span>
            </div>
            
            <div className="flex items-center gap-3 text-sm">
              <MapPin className="h-4 w-4 text-blue-600" />
              <span className="text-blue-800">{appointmentData.clinic}</span>
            </div>
            
            <div className="flex items-center gap-3 text-sm">
              <User2 className="h-4 w-4 text-blue-600" />
              <span className="text-blue-800">{appointmentData.service}</span>
            </div>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo *</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Digite seu nome completo"
                required
                maxLength={100}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone/WhatsApp *</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="(11) 99999-9999"
                required
              />
              <p className="text-xs text-gray-500">
                Enviaremos a confirmação via WhatsApp
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={!name.trim() || !phone.trim() || isSubmitting}
              >
                {isSubmitting ? 'Confirmando...' : 'Confirmar Agendamento'}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
