
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
  const [priceValue, setPriceValue] = useState(
    price ? `R$ ${price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'R$ 0,00'
  );

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

  const formatCurrency = (value: string) => {
    // Remove tudo que não é dígito
    const numericValue = value.replace(/\D/g, '');
    
    // Se não há valor, retorna R$ 0,00
    if (!numericValue) return 'R$ 0,00';
    
    // Converte para centavos
    const cents = parseInt(numericValue);
    const reais = cents / 100;
    
    // Limita o valor máximo a R$ 50.000,00
    const limitedReais = Math.min(reais, 50000);
    
    // Formata como moeda brasileira
    return `R$ ${limitedReais.toLocaleString('pt-BR', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  };

  const parseCurrencyToNumber = (currencyString: string): number => {
    // Remove "R$" e espaços, substitui vírgula por ponto
    const numericString = currencyString
      .replace('R$', '')
      .trim()
      .replace(/\./g, '') // Remove pontos de milhares
      .replace(',', '.'); // Substitui vírgula decimal por ponto
    
    const parsed = parseFloat(numericString) || 0;
    
    // Retorna apenas se estiver na faixa permitida (R$ 1,00 a R$ 50.000,00)
    if (parsed >= 1 && parsed <= 50000) {
      return parsed;
    }
    
    return 0;
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCurrency(e.target.value);
    setPriceValue(formattedValue);
  };

  const handleSave = () => {
    const numericPrice = parseCurrencyToNumber(priceValue);
    onSave(selectedService, numericPrice > 0 ? numericPrice : undefined);
  };

  const isValidPrice = () => {
    const numericPrice = parseCurrencyToNumber(priceValue);
    return numericPrice >= 1 && numericPrice <= 50000;
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
      
      <div className="relative">
        <Input
          type="text"
          value={priceValue}
          onChange={handlePriceChange}
          placeholder="R$ 0,00"
          className={`w-28 text-sm ${
            priceValue !== 'R$ 0,00' && !isValidPrice() 
              ? 'border-red-300 focus:border-red-500' 
              : ''
          }`}
        />
        {priceValue !== 'R$ 0,00' && !isValidPrice() && (
          <div className="absolute top-full left-0 mt-1 text-xs text-red-600 whitespace-nowrap">
            Entre R$ 1,00 e R$ 50.000,00
          </div>
        )}
      </div>
      
      <Button 
        size="sm" 
        onClick={handleSave} 
        className="h-8 w-8 p-0"
        disabled={priceValue !== 'R$ 0,00' && !isValidPrice()}
      >
        <Check className="h-4 w-4" />
      </Button>
      
      <Button size="sm" variant="ghost" onClick={onCancel} className="h-8 w-8 p-0">
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};
