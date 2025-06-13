
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, MessageCircle, MapPin } from 'lucide-react';
import { toastCall } from '@/components/ui/custom-toast';
import { useChatHandler } from '@/hooks/useChatHandler';
import { animations } from '@/lib/animations';

const EmergencyPage = () => {
  const { sendWhatsAppMessage, loading } = useChatHandler();

  const handleEmergencyCall = async () => {
    try {
      const emergencyNumber = import.meta.env.VITE_WA_BUSINESS_JID || '553171147487@s.whatsapp.net';
      await sendWhatsAppMessage(
        emergencyNumber, 
        'URGÊNCIA DENTAL: Preciso de atendimento de emergência imediato!'
      );
      toastCall("Emergência", "Conectando com atendimento de urgência...");
    } catch (error) {
      // Fallback para chamada telefônica
      window.open('tel:+5535998695479', '_self');
      toastCall("Emergência", "Discando para emergência...");
    }
  };

  const handleWhatsAppContact = async () => {
    try {
      const emergencyNumber = import.meta.env.VITE_WA_BUSINESS_JID || '553171147487@s.whatsapp.net';
      await sendWhatsAppMessage(
        emergencyNumber, 
        'Preciso de orientações para uma situação de urgência dental.'
      );
      toastCall("WhatsApp", "Conectando via WhatsApp...");
    } catch (error) {
      toastCall("Erro", "Não foi possível conectar via WhatsApp");
    }
  };

  return (
    <div className={`p-6 space-y-6 ${animations.pageEnter}`}>
      <div className={`${animations.fadeIn}`}>
        <h1 className="text-3xl font-bold text-red-600 mb-2">🚨 Atendimento de Emergência</h1>
        <p className="text-gray-600">Estamos aqui para ajudar em situações urgentes</p>
      </div>

      {/* Contatos de Emergência */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className={`border-red-200 bg-red-50 ${animations.slideInLeft}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <Phone className="h-6 w-6" />
              Ligação Direta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-700 mb-4">
              Para emergências imediatas, ligue diretamente para nossa central
            </p>
            <Button 
              className={`w-full bg-red-600 hover:bg-red-700 ${animations.buttonHover}`}
              onClick={handleEmergencyCall}
              disabled={loading}
            >
              <Phone className="h-4 w-4 mr-2" />
              {loading ? 'Conectando...' : 'Ligar para Emergência'}
            </Button>
            <p className="text-sm text-red-600 mt-2 text-center">
              (35) 99869-5479
            </p>
          </CardContent>
        </Card>

        <Card className={`border-green-200 bg-green-50 ${animations.slideInRight}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <MessageCircle className="h-6 w-6" />
              WhatsApp
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-green-700 mb-4">
              Envie uma mensagem via WhatsApp para orientação rápida
            </p>
            <Button 
              className={`w-full bg-green-600 hover:bg-green-700 ${animations.buttonHover}`}
              onClick={handleWhatsAppContact}
              disabled={loading}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              {loading ? 'Conectando...' : 'Contatar via WhatsApp'}
            </Button>
            <p className="text-sm text-green-600 mt-2 text-center">
              Resposta rápida
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Unidades Disponíveis */}
      <Card className={animations.fadeIn}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Nossas Unidades
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold">Campo Belo - MG</h3>
              <p className="text-sm text-gray-600">Av. Afonso Pena, 151, Centro - Campo Belo/MG</p>
              <p className="text-sm text-gray-600">CEP: 37270-000 | Tel: (35) 99869-5479</p>
            </div>

            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold">Formiga - MG</h3>
              <p className="text-sm text-gray-600">R. Barão de Piumhy, 198, Centro - Formiga/MG</p>
              <p className="text-sm text-gray-600">CEP: 35570-128 | Tel: (35) 9969-5479</p>
            </div>

            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold">Itararé - SP</h3>
              <p className="text-sm text-gray-600">R. São Pedro, 1348 (Loja), Centro - Itararé/SP</p>
              <p className="text-sm text-gray-600">CEP: 18460-009 | Tel: (35) 99969-5479</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orientações */}
      <Card className={`border-yellow-200 bg-yellow-50 ${animations.fadeIn}`}>
        <CardHeader>
          <CardTitle className="text-yellow-800">Orientações para Emergências</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-yellow-700">
            <div>
              <h4 className="font-medium">🦷 Dor de dente intensa</h4>
              <p className="text-sm">Enxágue com água morna e aplique compressa fria do lado externo</p>
            </div>
            <div>
              <h4 className="font-medium">🩸 Sangramento</h4>
              <p className="text-sm">Aplique pressão com gaze limpa e procure atendimento imediato</p>
            </div>
            <div>
              <h4 className="font-medium">🦷 Dente quebrado/perdido</h4>
              <p className="text-sm">Guarde o fragmento em leite e procure atendimento em até 1 hora</p>
            </div>
            <div>
              <h4 className="font-medium">😷 Inchaço facial</h4>
              <p className="text-sm">Aplique gelo e procure atendimento urgente - pode ser infecção</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmergencyPage;
