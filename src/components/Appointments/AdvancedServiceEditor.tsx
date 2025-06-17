
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Check, X, Percent } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface AdvancedServiceEditorProps {
  service: string;
  price?: number;
  originalPrice?: number;
  discountPercent?: number;
  paymentMethod?: string;
  onSave: (service: string, price?: number, originalPrice?: number, discountPercent?: number, paymentMethod?: string) => void;
  onCancel: () => void;
}

const paymentMethods = [
  'Dinheiro',
  'PIX',
  'Cartão de Débito',
  'Cartão de Crédito',
  'Cartão de Crédito (2x)',
  'Cartão de Crédito (3x)',
  'Cartão de Crédito (4x)',
  'Cartão de Crédito (5x)',
  'Cartão de Crédito (6x)',
  'Cartão de Crédito (12x)',
  'Boleto Bancário',
  'Transferência Bancária',
  'Cheque'
];

export const AdvancedServiceEditor: React.FC<AdvancedServiceEditorProps> = ({
  service,
  price,
  originalPrice,
  discountPercent,
  paymentMethod,
  onSave,
  onCancel
}) => {
  const [selectedService, setSelectedService] = useState(service);
  const [originalPriceValue, setOriginalPriceValue] = useState(
    originalPrice ? `R$ ${originalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'R$ 0,00'
  );
  const [discountValue, setDiscountValue] = useState(discountPercent?.toString() || '0');
  const [finalPriceValue, setFinalPriceValue] = useState(
    price ? `R$ ${price.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'R$ 0,00'
  );
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(paymentMethod || '');

  const services = [
    'Limpeza',
    'Restauração',
    'Extração',
    'Clareamento',
    'Ortodontia',
    'Implante',
    'Canal',
    'Prótese',
    'Consulta',
    'Emergência',
    'Cirurgia',
    'Periodontia'
  ];

  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    if (!numericValue) return 'R$ 0,00';
    const cents = parseInt(numericValue);
    const reais = cents / 100;
    const limitedReais = Math.min(reais, 50000);
    return `R$ ${limitedReais.toLocaleString('pt-BR', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  };

  const parseCurrencyToNumber = (currencyString: string): number => {
    const numericString = currencyString
      .replace('R$', '')
      .trim()
      .replace(/\./g, '')
      .replace(',', '.');
    
    const parsed = parseFloat(numericString) || 0;
    return parsed >= 1 && parsed <= 50000 ? parsed : 0;
  };

  const calculateFinalPrice = (originalPrice: number, discount: number): number => {
    if (discount < 0 || discount > 100) return originalPrice;
    return originalPrice * (1 - discount / 100);
  };

  const handleOriginalPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCurrency(e.target.value);
    setOriginalPriceValue(formattedValue);
    
    const numericPrice = parseCurrencyToNumber(formattedValue);
    const discount = parseFloat(discountValue) || 0;
    const finalPrice = calculateFinalPrice(numericPrice, discount);
    
    setFinalPriceValue(`R$ ${finalPrice.toLocaleString('pt-BR', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`);
  };

  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value) {
      value = Math.min(parseInt(value), 100).toString();
    }
    setDiscountValue(value);
    
    const originalPrice = parseCurrencyToNumber(originalPriceValue);
    const discount = parseFloat(value) || 0;
    const finalPrice = calculateFinalPrice(originalPrice, discount);
    
    setFinalPriceValue(`R$ ${finalPrice.toLocaleString('pt-BR', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`);
  };

  const handleSave = () => {
    const originalPrice = parseCurrencyToNumber(originalPriceValue);
    const discount = parseFloat(discountValue) || 0;
    const finalPrice = parseCurrencyToNumber(finalPriceValue);
    
    onSave(
      selectedService,
      finalPrice > 0 ? finalPrice : undefined,
      originalPrice > 0 ? originalPrice : undefined,
      discount > 0 ? discount : undefined,
      selectedPaymentMethod || undefined
    );
  };

  const isValidData = () => {
    const originalPrice = parseCurrencyToNumber(originalPriceValue);
    const discount = parseFloat(discountValue) || 0;
    return originalPrice >= 1 && originalPrice <= 50000 && discount >= 0 && discount <= 100;
  };

  return (
    <div className="space-y-3 p-4 border rounded-lg bg-white shadow-sm min-w-96">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="service" className="text-xs font-medium">Serviço</Label>
          <Select value={selectedService} onValueChange={setSelectedService}>
            <SelectTrigger className="h-8">
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
        </div>

        <div>
          <Label htmlFor="payment" className="text-xs font-medium">Forma de Pagamento</Label>
          <Select value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
            <SelectTrigger className="h-8">
              <SelectValue placeholder="Selecionar" />
            </SelectTrigger>
            <SelectContent>
              {paymentMethods.map(method => (
                <SelectItem key={method} value={method}>
                  {method}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <Label htmlFor="originalPrice" className="text-xs font-medium">Preço Original</Label>
          <Input
            id="originalPrice"
            type="text"
            value={originalPriceValue}
            onChange={handleOriginalPriceChange}
            placeholder="R$ 0,00"
            className="h-8 text-sm"
          />
        </div>

        <div>
          <Label htmlFor="discount" className="text-xs font-medium">Desconto (%)</Label>
          <div className="relative">
            <Input
              id="discount"
              type="text"
              value={discountValue}
              onChange={handleDiscountChange}
              placeholder="0"
              className="h-8 text-sm pr-6"
              maxLength={3}
            />
            <Percent className="absolute right-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
          </div>
        </div>

        <div>
          <Label htmlFor="finalPrice" className="text-xs font-medium">Preço Final</Label>
          <Input
            id="finalPrice"
            type="text"
            value={finalPriceValue}
            readOnly
            className="h-8 text-sm bg-gray-50 font-medium text-green-600"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button 
          size="sm" 
          onClick={handleSave} 
          className="h-8"
          disabled={!isValidData()}
        >
          <Check className="h-4 w-4 mr-1" />
          Salvar
        </Button>
        
        <Button size="sm" variant="ghost" onClick={onCancel} className="h-8">
          <X className="h-4 w-4 mr-1" />
          Cancelar
        </Button>
      </div>
    </div>
  );
};
