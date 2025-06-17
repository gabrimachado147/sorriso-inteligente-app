import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Edit3, DollarSign, Save, X } from 'lucide-react';
import { AppointmentRecord } from '@/services/supabase/appointments';
import { animations } from '@/lib/animations';

interface ServiceEditorProps {
  appointment: AppointmentRecord;
  onUpdate: (appointmentId: string, service: string, price?: number) => void;
  isUpdating: boolean;
}

const availableServices = [
  'Avaliação Gratuita',
  'Limpeza Dental',
  'Clareamento Dental',
  'Ortodontia',
  'Implantodontia',
  'Restauração',
  'Extração',
  'Canal',
  'Prótese Dental',
  'Cirurgia Oral',
  'Periodontia',
  'Endodontia',
  'Estética Dental',
  'Urgência Dentária'
];

export const ServiceEditor: React.FC<ServiceEditorProps> = ({
  appointment,
  onUpdate,
  isUpdating
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(appointment.service);
  const [priceValue, setPriceValue] = useState<string>(
    typeof (appointment as AppointmentRecord & { price?: number }).price === 'number'
      ? ((appointment as AppointmentRecord & { price?: number }).price as number).toString()
      : ''
  );

  const handleSave = async () => {
    const price = priceValue ? parseFloat(priceValue.replace(',', '.')) : undefined;
    await onUpdate(appointment.id, selectedService, price);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setSelectedService(appointment.service);
    setPriceValue(
      typeof (appointment as AppointmentRecord & { price?: number }).price === 'number'
        ? ((appointment as AppointmentRecord & { price?: number }).price as number).toString()
        : ''
    );
    // Se existirem outros campos editáveis, restaurar aqui (exemplo: nome, telefone, etc)
    setIsOpen(false);
  };

  const formatCurrency = (value: string) => {
    // Remove caracteres não numéricos exceto vírgula e ponto
    const numbers = value.replace(/[^\d.,]/g, '');
    return numbers;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className={`h-auto p-1 hover:bg-blue-50 ${animations.buttonHover}`}
        >
          <Edit3 className="h-3 w-3" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit3 className="h-5 w-5" />
            Editar Serviço - {appointment.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="service">Tipo de Serviço</Label>
            <Select value={selectedService} onValueChange={setSelectedService}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o serviço" />
              </SelectTrigger>
              <SelectContent>
                {availableServices.map((service) => (
                  <SelectItem key={service} value={service}>
                    {service}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="price" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Valor do Serviço (R$)
            </Label>
            <Input
              id="price"
              type="text"
              placeholder="Ex: 150.00 ou 150,00"
              value={priceValue}
              onChange={(e) => {
                const formattedValue = formatCurrency(e.target.value);
                setPriceValue(formattedValue);
              }}
            />
            <p className="text-xs text-gray-500">
              Campo livre - Digite o valor cobrado e forma de pagamento se necessário
            </p>
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          <Button 
            variant="outline" 
            onClick={handleCancel}
            disabled={isUpdating}
          >
            <X className="h-4 w-4 mr-1" />
            Cancelar
          </Button>
          <Button 
            onClick={handleSave}
            disabled={isUpdating || !selectedService}
          >
            <Save className="h-4 w-4 mr-1" />
            {isUpdating ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
