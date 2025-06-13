
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
import { Card, CardContent } from '@/components/ui/card';
import { User, Phone, Calendar, MapPin, Clock, Stethoscope } from 'lucide-react';
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

  const handleSubmit = async () => {
    if (!name.trim() || !phone.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onConfirm(name.trim(), phone.trim());
      setName('');
      setPhone('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setName('');
    setPhone('');
    onClose();
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return value;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setPhone(formatted);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className={`sm:max-w-md ${animations.fadeIn}`}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-primary">
            <User className="h-5 w-5" />
            Confirmar Agendamento
          </DialogTitle>
          <DialogDescription>
            Para finalizar seu agendamento, precisamos de algumas informações
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Resumo do Agendamento */}
          <Card className="border-l-4 border-l-primary bg-primary/5">
            <CardContent className="p-4">
              <h3 className="font-semibold text-primary mb-3">Resumo do Agendamento</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span>{appointmentData.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-green-600" />
                  <span>{appointmentData.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-purple-600" />
                  <span>{appointmentData.clinic}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Stethoscope className="h-4 w-4 text-orange-600" />
                  <span>{appointmentData.service}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Formulário de Dados */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Nome Completo *
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Digite seu nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full"
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">
                Número de Telefone *
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(11) 99999-9999"
                value={phone}
                onChange={handlePhoneChange}
                className="w-full"
                disabled={isSubmitting}
                maxLength={15}
              />
            </div>
          </div>

          {/* Botões */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              className={`flex-1 ${animations.buttonHover}`}
              disabled={!name.trim() || !phone.trim() || isSubmitting}
            >
              {isSubmitting ? 'Confirmando...' : 'Confirmar Agendamento'}
            </Button>
          </div>

          <p className="text-xs text-gray-500 text-center">
            Após confirmar, você receberá uma mensagem no WhatsApp com os detalhes do agendamento
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
