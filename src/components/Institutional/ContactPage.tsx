
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { animations } from '@/lib/animations';
import { LeadCaptureForm } from './LeadCaptureForm';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  MessageSquare,
  Calendar,
  Headphones,
  Users
} from 'lucide-react';
import { useContactActions } from '@/hooks/useContactActions';

const ContactPage = () => {
  const { handleWhatsAppContact, handleEmergencyCall } = useContactActions();

  const contactMethods = [
    {
      icon: Phone,
      title: "Telefone",
      description: "Ligue para nós",
      info: "(35) 99891-3803",
      action: () => handleEmergencyCall(),
      primary: true
    },
    {
      icon: MessageSquare,
      title: "WhatsApp",
      description: "Chat direto conosco",
      info: "Atendimento online",
      action: () => handleWhatsAppContact(),
      primary: true
    },
    {
      icon: Mail,
      title: "Email",
      description: "Envie sua mensagem",
      info: "contato@senhorrsorriso.com",
      action: () => window.location.href = 'mailto:contato@senhorrsorriso.com'
    },
    {
      icon: MapPin,
      title: "Endereços",
      description: "Visite nossas unidades",
      info: "3 unidades na região",
      action: () => {},
      link: "/institutional/locations"
    }
  ];

  const workingHours = [
    { day: "Segunda a Sexta", hours: "8h às 18h" },
    { day: "Sábado", hours: "8h às 12h" },
    { day: "Domingo", hours: "Fechado" }
  ];

  const emergencyInfo = [
    "Dor de dente intensa",
    "Traumas e acidentes",
    "Quebra de próteses",
    "Sangramentos",
    "Inchaços repentinos"
  ];

  return (
    <div className="py-8 md:py-16 space-y-16">
      {/* Header Section */}
      <section className="text-center space-y-6">
        <div className={`space-y-4 ${animations.fadeInUp}`}>
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            <Headphones className="h-3 w-3 mr-1" />
            Fale Conosco
          </Badge>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900">
            Entre em contato conosco
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Nossa equipe está pronta para atender você. Escolha a forma mais conveniente 
            para entrar em contato e esclarecer suas dúvidas.
          </p>
        </div>
      </section>

      {/* Quick Contact Methods */}
      <section className="mobile-container">
        <div className="mobile-grid md:grid-cols-2 lg:grid-cols-4">
          {contactMethods.map((method, index) => {
            const Icon = method.icon;
            return (
              <Card key={method.title} 
                    className={`mobile-card-spacing h-full text-center cursor-pointer group hover:shadow-lg mobile-transition ${animations.scaleIn} ${
                      method.primary ? 'border-primary/20 bg-primary/5' : ''
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                    onClick={method.action}>
                <CardHeader>
                  <div className={`mx-auto mb-4 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 mobile-transition ${
                    method.primary ? 'bg-primary text-white' : 'bg-primary/10 text-primary'
                  }`}>
                    <Icon className="h-8 w-8" />
                  </div>
                  <CardTitle className="mobile-text-lg group-hover:text-primary mobile-transition">
                    {method.title}
                  </CardTitle>
                  <CardDescription className="mobile-text-base">
                    {method.description}
                  </CardDescription>
                  <p className={`font-semibold mobile-text-base ${
                    method.primary ? 'text-primary' : 'text-gray-700'
                  }`}>
                    {method.info}
                  </p>
                </CardHeader>
                {method.link && (
                  <CardContent>
                    <Button variant="outline" className="w-full mobile-touch-target" asChild>
                      <Link to={method.link}>Ver Unidades</Link>
                    </Button>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      </section>

      {/* Contact Form and Info */}
      <section className="bg-gray-50 py-12 md:py-16 -mx-4 md:-mx-6 lg:-mx-8">
        <div className="mobile-container">
          <div className="mobile-grid lg:grid-cols-2 gap-12 items-start">
            {/* Contact Form */}
            <div className={`${animations.fadeInUp}`}>
              <LeadCaptureForm />
            </div>

            {/* Contact Information */}
            <div className={`space-y-8 ${animations.fadeInUp} ${animations.slideInRight}`}>
              {/* Working Hours */}
              <Card className="mobile-card-spacing">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="mobile-text-lg">Horário de Funcionamento</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {workingHours.map((schedule, index) => (
                    <div key={schedule.day} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                      <span className="text-gray-700 mobile-text-base">{schedule.day}</span>
                      <span className="font-semibold text-primary mobile-text-base">{schedule.hours}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Emergency Info */}
              <Card className="mobile-card-spacing border-orange-200 bg-orange-50">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                      <Phone className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <CardTitle className="mobile-text-lg text-orange-800">Emergências 24h</CardTitle>
                      <CardDescription className="text-orange-600">Para situações urgentes</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-orange-700 mobile-text-base">
                    Atendemos emergências odontológicas 24 horas por dia:
                  </p>
                  <ul className="space-y-2">
                    {emergencyInfo.map((item, index) => (
                      <li key={index} className="flex items-center gap-2 text-orange-700 mobile-text-sm">
                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    variant="default" 
                    className="w-full bg-orange-600 hover:bg-orange-700 mobile-touch-target"
                    onClick={handleEmergencyCall}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Ligar Agora
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900">Ações Rápidas</h3>
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start mobile-touch-target"
                    onClick={() => handleWhatsAppContact('Gostaria de agendar uma consulta')}
                  >
                    <Calendar className="h-4 w-4 mr-3" />
                    Agendar Consulta via WhatsApp
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start mobile-touch-target"
                    onClick={() => handleWhatsAppContact('Gostaria de saber sobre os preços dos tratamentos')}
                  >
                    <MessageSquare className="h-4 w-4 mr-3" />
                    Solicitar Orçamento
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start mobile-touch-target" 
                    asChild
                  >
                    <Link to="/institutional/locations">
                      <MapPin className="h-4 w-4 mr-3" />
                      Ver Localização das Unidades
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Quick Links */}
      <section className="py-12 md:py-16">
        <div className="mobile-container">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Dúvidas Frequentes
            </h2>
            <p className="text-lg text-gray-600">
              Encontre respostas rápidas para as perguntas mais comuns
            </p>
          </div>

          <div className="mobile-grid md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                question: "Como agendar uma consulta?",
                answer: "Você pode agendar via WhatsApp, telefone ou através do nosso formulário online."
              },
              {
                question: "Vocês atendem convênios?",
                answer: "Sim, trabalhamos com diversos convênios. Entre em contato para verificar."
              },
              {
                question: "Qual o horário de funcionamento?",
                answer: "Segunda a sexta das 8h às 18h, sábado das 8h às 12h."
              },
              {
                question: "Fazem atendimento de emergência?",
                answer: "Sim, temos atendimento de emergência 24 horas por dia."
              },
              {
                question: "Onde ficam as unidades?",
                answer: "Temos 3 unidades estrategicamente localizadas na região."
              },
              {
                question: "Oferecem avaliação gratuita?",
                answer: "Sim, a primeira consulta de avaliação é totalmente gratuita."
              }
            ].map((faq, index) => (
              <Card key={index} className={`mobile-card-spacing ${animations.fadeInUp}`}
                    style={{ animationDelay: `${index * 100}ms` }}>
                <CardHeader>
                  <CardTitle className="mobile-text-base">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mobile-text-sm">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
