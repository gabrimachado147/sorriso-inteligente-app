
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Check, X } from 'lucide-react';

interface ServiceEditorProps {
  service: string;
  price?: number;
  onSave: (service: string, price?: number) => void;
  onCancel: () => void;
}

export const ServiceEditor: React.FC<ServiceEditorProps> = ({
  service,
  price,
  onSave,
  onCancel
}) => {
  const [selectedService, setSelectedService] = useState(service);
  const [servicePrice, setServicePrice] = useState(price || 0);

  const services = [
    'Limpeza',
    'Restauração',
    'Extração',
    'Clareamento',
    'Ortodontia',
    'Implante',
    'Canal',
    'Prótese'
  ];

  const handleSave = () => {
    onSave(selectedService, servicePrice || undefined);
  };

  return (
    <div className="flex items-center gap-2 min-w-0">
      <Select value={selectedService} onValueChange={setSelectedService}>
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {services.map(service => (
            <SelectItem key={service} value={service}>
              {service}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Input
        type="number"
        value={servicePrice}
        onChange={(e) => setServicePrice(Number(e.target.value))}
        placeholder="Preço"
        className="w-20"
        min="0"
        step="0.01"
      />
      
      <Button size="sm" onClick={handleSave} className="h-8 w-8 p-0">
        <Check className="h-4 w-4" />
      </Button>
      
      <Button size="sm" variant="ghost" onClick={onCancel} className="h-8 w-8 p-0">
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};
