
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Phone, MessageCircle, MapPin, Clock } from 'lucide-react';

const EmergencyPage = () => {
  const handleEmergencyCall = () => {
    window.open('tel:+5535999999999', '_self');
  };

  const handleWhatsAppEmergency = () => {
    const message = encodeURIComponent("🚨 EMERGÊNCIA ODONTOLÓGICA - Preciso de atendimento urgente!");
    window.open(`https://wa.me/5535999999999?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-background w-full">
      <div className="w-full px-4 py-6 space-y-6">
        {/* Header de Emergência */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
              <AlertTriangle className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-red-600 mobile-text-xl">
            Emergência Odontológica
          </h1>
          <p className="text-gray-600 mobile-text-base">
            Estamos aqui para ajudar em situações de urgência
          </p>
        </div>

        {/* Botões de Contato de Emergência */}
        <div className="space-y-4">
          <Card className="border-red-200 bg-red-50/50">
            <CardContent className="p-6">
              <div className="space-y-4">
                <Button
                  onClick={handleEmergencyCall}
                  className="w-full bg-red-600 hover:bg-red-700 text-white mobile-button"
                  size="lg"
                >
                  <Phone className="h-5 w-5 mr-2" />
                  Ligar Agora - Emergência
                </Button>
                
                <Button
                  onClick={handleWhatsAppEmergency}
                  variant="outline"
                  className="w-full border-red-300 text-red-600 hover:bg-red-50 mobile-button"
                  size="lg"
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  WhatsApp Emergência
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Informações sobre Emergências */}
        <Card className="mobile-card-spacing">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600 mobile-text-lg">
              <AlertTriangle className="h-5 w-5" />
              Quando é Emergência?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm mobile-text-sm">Dor de dente intensa e contínua</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm mobile-text-sm">Inchaço facial ou gengival</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm mobile-text-sm">Trauma dental ou facial</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-sm mobile-text-sm">Sangramento que não para</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Horários de Atendimento */}
        <Card className="mobile-card-spacing">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 mobile-text-lg">
              <Clock className="h-5 w-5 text-primary" />
              Atendimento de Emergência
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm mobile-text-sm"><strong>Seg-Sex:</strong> 8h às 18h (atendimento regular)</p>
              <p className="text-sm mobile-text-sm"><strong>Sábado:</strong> 8h às 13h</p>
              <p className="text-sm mobile-text-sm text-red-600"><strong>Emergências:</strong> Entre em contato conosco</p>
            </div>
          </CardContent>
        </Card>

        {/* Localização */}
        <Card className="mobile-card-spacing">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 mobile-text-lg">
              <MapPin className="h-5 w-5 text-primary" />
              Nossas Clínicas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm mobile-text-sm">
              <div>
                <p className="font-medium">Campo Belo - MG</p>
                <p className="text-gray-600">Rua Principal, 123 - Centro</p>
              </div>
              <div>
                <p className="font-medium">Formiga - MG</p>
                <p className="text-gray-600">Av. Central, 456 - Centro</p>
              </div>
              <div>
                <p className="font-medium">Itararé - SP</p>
                <p className="text-gray-600">Rua da Saúde, 789 - Centro</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmergencyPage;
