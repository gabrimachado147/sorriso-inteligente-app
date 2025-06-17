
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Edit3, Save, X } from 'lucide-react';
import { availableServices } from './constants/services';

interface ServiceEditorProps {
  appointmentId: string;
  currentService: string;
  currentPrice?: number;
  currentNotes?: string;
  onUpdate: (appointmentId: string, service: string, price?: number, notes?: string) => void;
  isUpdating: boolean;
}

export const ServiceEditor: React.FC<ServiceEditorProps> = ({
  appointmentId,
  currentService,
  currentPrice,
  currentNotes,
  onUpdate,
  isUpdating
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(currentService);
  const [price, setPrice] = useState(currentPrice?.toString() || '');
  const [notes, setNotes] = useState(currentNotes || '');

  const handleSave = () => {
    const numericPrice = price ? parseFloat(price) : undefined;
    onUpdate(appointmentId, selectedService, numericPrice, notes);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setSelectedService(currentService);
    setPrice(currentPrice?.toString() || '');
    setNotes(currentNotes || '');
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Edit3 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Serviço</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Serviço</label>
            <Select value={selectedService} onValueChange={setSelectedService}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableServices.map((service) => (
                  <SelectItem key={service.id} value={service.name}>
                    {service.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Preço (R$)</label>
            <Input
              type="number"
              placeholder="0,00"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Observações</label>
            <Textarea
              placeholder="Adicione observações sobre o serviço..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isUpdating}
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={isUpdating}
            >
              <Save className="h-4 w-4 mr-2" />
              {isUpdating ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
