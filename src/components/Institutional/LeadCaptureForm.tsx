
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { animations } from '@/lib/animations';
import { cn } from '@/lib/utils';

interface LeadCaptureFormProps {
  source?: string;
  campaign?: string;
  className?: string;
}

const LeadCaptureForm: React.FC<LeadCaptureFormProps> = ({ 
  source = 'institutional_website',
  campaign = 'lead_capture',
  className 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    clinic: '',
    service: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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
    'Endodontia'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create appointment
      const { error: appointmentError } = await supabase
        .from('appointments')
        .insert({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          clinic: formData.clinic,
          service: formData.service,
          date: new Date().toISOString().split('T')[0], // Today's date
          time: 'A definir',
          status: 'pending',
          source: source,
          notes: `Lead capturado via ${campaign}`
        });

      if (appointmentError) throw appointmentError;

      // Track analytics event
      await supabase
        .from('analytics_events')
        .insert({
          event_type: 'lead_captured',
          data: {
            source,
            campaign,
            clinic: formData.clinic,
            service: formData.service
          }
        });

      setIsSuccess(true);
      
      // Reset form after success
      setTimeout(() => {
        setIsSuccess(false);
        setFormData({ name: '', phone: '', email: '', clinic: '', service: '' });
      }, 3000);

    } catch (error) {
      console.error('Erro ao capturar lead:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isSuccess) {
    return (
      <Card className={cn('mobile-card-spacing', animations.scaleIn, className)}>
        <CardContent className="text-center py-8">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h3 className="mobile-text-xl font-bold text-green-600 mb-2">
            Agendamento Recebido!
          </h3>
          <p className="text-gray-600 mobile-text-base mb-6">
            Entraremos em contato em até 2 horas para confirmar sua avaliação gratuita.
          </p>
          <Button 
            onClick={() => window.open('https://wa.me/5535998695479', '_blank')}
            className="bg-green-600 hover:bg-green-700 mobile-button"
          >
            <Phone className="mr-2 h-4 w-4" />
            Falar no WhatsApp Agora
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('mobile-card-spacing', animations.fadeInUp, className)}>
      <CardHeader className="text-center">
        <CardTitle className="mobile-text-xl md:text-2xl">
          🎯 Agende sua Avaliação Gratuita
        </CardTitle>
        <p className="text-gray-600 mobile-text-base">
          Preencha os dados abaixo e receba seu plano de tratamento personalizado
        </p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="mobile-text-base">Nome Completo *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Seu nome completo"
              required
              className="mobile-input mobile-focus"
            />
          </div>

          <div>
            <Label htmlFor="phone" className="mobile-text-base">WhatsApp *</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="(00) 00000-0000"
              required
              className="mobile-input mobile-focus"
            />
          </div>

          <div>
            <Label htmlFor="email" className="mobile-text-base">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="seu@email.com"
              className="mobile-input mobile-focus"
            />
          </div>

          <div>
            <Label htmlFor="clinic" className="mobile-text-base">Unidade Preferida *</Label>
            <select
              id="clinic"
              value={formData.clinic}
              onChange={(e) => handleChange('clinic', e.target.value)}
              required
              className="mobile-input mobile-focus w-full"
            >
              <option value="">Selecione uma unidade</option>
              {clinics.map(clinic => (
                <option key={clinic} value={clinic}>{clinic}</option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="service" className="mobile-text-base">Tratamento de Interesse</Label>
            <select
              id="service"
              value={formData.service}
              onChange={(e) => handleChange('service', e.target.value)}
              className="mobile-input mobile-focus w-full"
            >
              <option value="">Selecione um tratamento</option>
              {services.map(service => (
                <option key={service} value={service}>{service}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
            <Clock className="h-5 w-5 text-blue-600 flex-shrink-0" />
            <p className="mobile-text-sm text-blue-700">
              Resposta em até 2 horas • Avaliação 100% gratuita
            </p>
          </div>

          <Button 
            type="submit" 
            disabled={isSubmitting || !formData.name || !formData.phone || !formData.clinic}
            className="w-full bg-blue-600 hover:bg-blue-700 mobile-button mobile-press"
          >
            {isSubmitting ? (
              <>Enviando...</>
            ) : (
              <>
                Agendar Avaliação Gratuita
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>

          <p className="text-xs text-gray-500 text-center mobile-text-xs">
            Ao enviar, você concorda com nossos termos de uso e política de privacidade.
          </p>
        </form>
      </CardContent>
    </Card>
  );
};

export default LeadCaptureForm;
