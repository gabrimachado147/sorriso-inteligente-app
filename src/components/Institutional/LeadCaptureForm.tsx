
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { 
  Calendar, 
  MapPin, 
  Phone, 
  Clock,
  CheckCircle,
  Gift
} from 'lucide-react';

interface LeadCaptureFormProps {
  source?: string;
  campaign?: string;
  className?: string;
}

const LeadCaptureForm: React.FC<LeadCaptureFormProps> = ({ 
  source = 'website',
  campaign = 'avaliacao-gratuita',
  className = ''
}) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    clinic: '',
    service: '',
    message: '',
    preferredTime: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const clinics = [
    'Campo Belo - MG',
    'Formiga - MG', 
    'Itararé - SP',
    'Capão Bonito - SP',
    'Itapeva - SP'
  ];

  const services = [
    'Avaliação Gratuita',
    'Implantodontia',
    'Ortodontia',
    'Limpeza Dental', 
    'Clareamento',
    'Prótese Dentária',
    'Endodontia',
    'Urgência Odontológica'
  ];

  const timePreferences = [
    'Manhã (8h às 12h)',
    'Tarde (13h às 17h)',
    'Final da tarde (17h às 19h)',
    'Sábado pela manhã'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Save lead to Supabase
      const { error } = await supabase
        .from('contacts')
        .insert({
          nome: formData.name,
          telefone: formData.phone,
          email: formData.email,
          empresa: formData.clinic,
          objetivo: `${formData.service} - ${formData.message}`,
          stage: 'new_lead',
          click_id: `${source}_${campaign}_${Date.now()}`
        });

      if (error) throw error;

      // Save to appointments if it's for scheduling
      if (formData.service !== 'Avaliação Gratuita') {
        await supabase
          .from('appointments')
          .insert({
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            clinic: formData.clinic,
            service: formData.service,
            date: new Date().toISOString().split('T')[0],
            time: '09:00',
            status: 'pending',
            notes: `Horário preferido: ${formData.preferredTime}. Mensagem: ${formData.message}`,
            source: source
          });
      }

      toast({
        title: "Solicitação Enviada!",
        description: "Em breve entraremos em contato para confirmar seu agendamento.",
      });

      // Reset form
      setFormData({
        name: '',
        phone: '',
        email: '',
        clinic: '',
        service: '',
        message: '',
        preferredTime: ''
      });

      // Track conversion event
      console.log('Lead converted:', {
        source,
        campaign,
        service: formData.service,
        clinic: formData.clinic
      });

    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Erro ao enviar",
        description: "Tente novamente ou entre em contato via WhatsApp.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className={`w-full max-w-md ${className}`}>
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Gift className="h-6 w-6 text-yellow-500" />
          <Badge className="bg-yellow-500 text-black">OFERTA ESPECIAL</Badge>
        </div>
        <CardTitle className="text-2xl">Avaliação 100% Gratuita</CardTitle>
        <p className="text-gray-600">Preencha o formulário e agende agora mesmo</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome Completo *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Seu nome completo"
              required
            />
          </div>

          <div>
            <Label htmlFor="phone">WhatsApp *</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="(00) 00000-0000"
              required
            />
          </div>

          <div>
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <Label htmlFor="clinic">Unidade de Preferência *</Label>
            <Select value={formData.clinic} onValueChange={(value) => handleInputChange('clinic', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Escolha a unidade" />
              </SelectTrigger>
              <SelectContent>
                {clinics.map((clinic) => (
                  <SelectItem key={clinic} value={clinic}>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {clinic}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="service">Tratamento de Interesse *</Label>
            <Select value={formData.service} onValueChange={(value) => handleInputChange('service', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Escolha o tratamento" />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service} value={service}>
                    {service}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="preferredTime">Horário de Preferência</Label>
            <Select value={formData.preferredTime} onValueChange={(value) => handleInputChange('preferredTime', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Escolha o horário" />
              </SelectTrigger>
              <SelectContent>
                {timePreferences.map((time) => (
                  <SelectItem key={time} value={time}>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {time}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="message">Observações</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              placeholder="Conte-nos sobre sua necessidade..."
              rows={3}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700" 
            disabled={isSubmitting || !formData.name || !formData.phone || !formData.clinic || !formData.service}
          >
            {isSubmitting ? (
              'Enviando...'
            ) : (
              <>
                <Calendar className="mr-2 h-4 w-4" />
                Agendar Avaliação Gratuita
              </>
            )}
          </Button>

          <div className="space-y-2 text-xs text-gray-500">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Sem taxa de adesão</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Atendimento no mesmo dia</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Financiamento em até 24x</span>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default LeadCaptureForm;
