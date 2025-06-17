
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  MapPin, 
  Phone, 
  Mail,
  Clock,
  MessageCircle,
  Send,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { animations } from '@/lib/animations';
import { supabase } from '@/integrations/supabase/client';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Save contact to Supabase
      const { error } = await supabase
        .from('contacts')
        .insert({
          nome: formData.name,
          email: formData.email,
          telefone: formData.phone,
          objetivo: `${formData.subject}: ${formData.message}`,
          stage: 'contact_form'
        });

      if (error) throw error;

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      }, 3000);

    } catch (error) {
      console.error('Erro ao enviar contato:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleWhatsApp = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    window.open(`https://wa.me/55${cleanPhone}`, '_blank');
  };

  const contacts = [
    {
      title: "Central de Atendimento",
      icon: Phone,
      value: "(35) 99891-3803",
      description: "WhatsApp e ligações",
      action: () => handleWhatsApp("(35) 99891-3803")
    },
    {
      title: "E-mail",
      icon: Mail,
      value: "contato@senhorsorriso.com.br",
      description: "Resposta em até 24h",
      action: () => window.open('mailto:contato@senhorsorriso.com.br')
    },
    {
      title: "Horário de Funcionamento",
      icon: Clock,
      value: "Seg-Sex: 8h às 19h",
      description: "Sábado: 8h às 13h",
      action: null
    }
  ];

  const locations = [
    {
      city: "Campo Belo - MG",
      address: "Av. Afonso Pena, 151, Centro",
      phone: "(35) 99891-3803"
    },
    {
      city: "Formiga - MG", 
      address: "R. Barão de Piumhy, 198, Centro",
      phone: "(37) 3443-0520"
    },
    {
      city: "Itararé - SP",
      address: "R. São Pedro, 1348, Centro", 
      phone: "(15) 99862-0028"
    },
    {
      city: "Capão Bonito - SP",
      address: "R. Floriano Peixoto, 732, Centro",
      phone: "(15) 2153-0549"
    },
    {
      city: "Itapeva - SP",
      address: "R. Doutor Pinheiro, 558, Centro",
      phone: "(15) 2153-0549"
    }
  ];

  return (
    <div className={`min-h-screen w-full bg-background mobile-scroll ${animations.pageEnter}`}>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-12 md:py-20">
        <div className="mobile-container">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="bg-white/20 text-white mb-4 mobile-text-sm">
              📞 Entre em Contato
            </Badge>
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-6">
              Estamos Aqui para <span className="text-yellow-300">Ajudar</span>
              <br />Você a Sorrir
            </h1>
            <p className="mobile-text-lg md:text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Tire suas dúvidas, agende sua consulta ou nos envie uma mensagem. 
              Nossa equipe está pronta para atendê-lo com carinho e atenção.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="mobile-container">
          <div className="mobile-grid lg:grid-cols-3 gap-6 md:gap-8">
            {contacts.map((contact, index) => (
              <Card key={index} className="text-center mobile-card-spacing hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <contact.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="mobile-text-lg md:text-xl">{contact.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-semibold mobile-text-base mb-2">{contact.value}</p>
                  <p className="text-gray-600 mobile-text-sm mb-4">{contact.description}</p>
                  {contact.action && (
                    <Button 
                      onClick={contact.action}
                      variant="outline"
                      className="mobile-button-sm"
                    >
                      Entrar em Contato
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map Section */}
      <section className="py-12 md:py-20">
        <div className="mobile-container">
          <div className="mobile-grid lg:grid-cols-2 gap-8 md:gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-6">Envie sua Mensagem</h2>
              
              {isSuccess ? (
                <Card className={`mobile-card-spacing ${animations.scaleIn}`}>
                  <CardContent className="text-center py-8">
                    <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                    <h3 className="mobile-text-xl font-bold text-green-600 mb-2">
                      Mensagem Enviada!
                    </h3>
                    <p className="text-gray-600 mobile-text-base mb-6">
                      Recebemos sua mensagem e entraremos em contato em breve.
                    </p>
                    <Button 
                      onClick={() => handleWhatsApp("(35) 99891-3803")}
                      className="bg-green-600 hover:bg-green-700 mobile-button"
                    >
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Falar no WhatsApp
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card className="mobile-card-spacing">
                  <CardContent className="pt-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="mobile-grid md:grid-cols-2 gap-4">
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
                          <Label htmlFor="phone" className="mobile-text-base">Telefone *</Label>
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
                      </div>

                      <div>
                        <Label htmlFor="email" className="mobile-text-base">E-mail *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleChange('email', e.target.value)}
                          placeholder="seu@email.com"
                          required
                          className="mobile-input mobile-focus"
                        />
                      </div>

                      <div>
                        <Label htmlFor="subject" className="mobile-text-base">Assunto</Label>
                        <select
                          id="subject"
                          value={formData.subject}
                          onChange={(e) => handleChange('subject', e.target.value)}
                          className="mobile-input mobile-focus w-full"
                        >
                          <option value="">Selecione um assunto</option>
                          <option value="Agendamento">Agendamento de Consulta</option>
                          <option value="Orçamento">Solicitação de Orçamento</option>
                          <option value="Dúvidas">Dúvidas sobre Tratamentos</option>
                          <option value="Sugestões">Sugestões e Elogios</option>
                          <option value="Reclamações">Reclamações</option>
                          <option value="Outros">Outros</option>
                        </select>
                      </div>

                      <div>
                        <Label htmlFor="message" className="mobile-text-base">Mensagem *</Label>
                        <textarea
                          id="message"
                          value={formData.message}
                          onChange={(e) => handleChange('message', e.target.value)}
                          placeholder="Conte-nos como podemos ajudar você..."
                          required
                          rows={4}
                          className="mobile-input mobile-focus w-full resize-none"
                        />
                      </div>

                      <Button 
                        type="submit" 
                        disabled={isSubmitting || !formData.name || !formData.phone || !formData.email || !formData.message}
                        className="w-full bg-blue-600 hover:bg-blue-700 mobile-button mobile-press"
                      >
                        {isSubmitting ? (
                          <>Enviando...</>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Enviar Mensagem
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Locations List */}
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-6">Nossas Unidades</h2>
              <div className="space-y-4">
                {locations.map((location, index) => (
                  <Card key={index} className="mobile-card-spacing hover:shadow-md transition-shadow">
                    <CardContent className="pt-4">
                      <h3 className="font-bold mobile-text-lg mb-2 text-blue-600">
                        {location.city}
                      </h3>
                      <div className="space-y-2 text-gray-600">
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                          <span className="mobile-text-sm">{location.address}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 flex-shrink-0" />
                          <span className="mobile-text-sm">{location.phone}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button 
                          size="sm"
                          variant="outline"
                          onClick={() => handleWhatsApp(location.phone)}
                          className="mobile-button-sm"
                        >
                          <MessageCircle className="mr-1 h-3 w-3" />
                          WhatsApp
                        </Button>
                        <Button 
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(`https://www.google.com/maps/search/${encodeURIComponent(location.address + ', ' + location.city)}`, '_blank')}
                          className="mobile-button-sm"
                        >
                          <MapPin className="mr-1 h-3 w-3" />
                          Ver no Mapa
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 bg-blue-600 text-white">
        <div className="mobile-container text-center">
          <MessageCircle className="h-16 w-16 mx-auto mb-6 text-yellow-300" />
          <h2 className="text-2xl md:text-4xl font-bold mb-6">
            Prefere Falar Diretamente Conosco?
          </h2>
          <p className="mobile-text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Nossa equipe está sempre disponível para atendê-lo via WhatsApp. 
            Tire suas dúvidas ou agende sua consulta agora mesmo!
          </p>
          
          <Button 
            size="lg" 
            className="bg-green-600 hover:bg-green-700 text-white font-semibold mobile-button-lg"
            onClick={() => handleWhatsApp("(35) 99891-3803")}
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            Conversar no WhatsApp
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
