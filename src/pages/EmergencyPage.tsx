
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, MessageCircle, MapPin, AlertTriangle } from 'lucide-react';

const EmergencyPage = () => {
  const handleEmergencyCall = () => {
    window.open('tel:+5535998695479', '_self');
  };

  const handleWhatsApp = () => {
    const message = 'Olá! Tenho uma emergência odontológica e preciso de ajuda urgente.';
    const whatsappUrl = `https://wa.me/5535998695479?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-red-600 flex items-center justify-center gap-2">
          <AlertTriangle className="h-6 w-6" />
          Emergência Odontológica
        </h1>
        <p className="text-gray-600 mt-2">
          Atendimento 24 horas para situações urgentes
        </p>
      </div>

      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-700">Situação de Emergência?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-red-600 font-medium">
            Para situações de extrema urgência, ligue imediatamente:
          </p>
          <Button 
            className="w-full bg-red-600 hover:bg-red-700"
            onClick={handleEmergencyCall}
          >
            <Phone className="h-4 w-4 mr-2" />
            Ligar Agora: (35) 99869-5479
          </Button>
        </CardContent>
      </Card>

      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="text-green-700">WhatsApp Emergência</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-green-600">
            Envie uma mensagem via WhatsApp para orientação rápida
          </p>
          <Button 
            className="w-full bg-green-600 hover:bg-green-700"
            onClick={handleWhatsApp}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Contatar via WhatsApp
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Unidades com Plantão 24h
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold">Clínica Central</h3>
              <p className="text-sm text-gray-600">Rua Principal, 123 - Centro</p>
              <p className="text-sm text-blue-600 font-medium">24h - Todos os dias</p>
            </div>
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold">Unidade Norte</h3>
              <p className="text-sm text-gray-600">Av. Norte, 456 - Bairro Norte</p>
              <p className="text-sm text-blue-600 font-medium">24h - Fins de semana</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatPage;
