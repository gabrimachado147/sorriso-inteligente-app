
import { toastSuccess, toastError } from '@/components/ui/custom-toast';

export const useContactActions = () => {
  const handleWhatsAppContact = (message?: string) => {
    try {
      const defaultMessage = message || 'Olá! Gostaria de saber mais sobre os serviços da Senhor Sorriso.';
      const whatsappNumber = '5535998913803';
      const encodedMessage = encodeURIComponent(defaultMessage);
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
      
      window.open(whatsappUrl, '_blank');
      toastSuccess('WhatsApp', 'Redirecionando para o WhatsApp...');
    } catch (error) {
      console.error('Error opening WhatsApp:', error);
      toastError('Erro', 'Não foi possível abrir o WhatsApp');
    }
  };

  const handleEmergencyCall = () => {
    try {
      const emergencyPhone = 'tel:+5535998913803';
      window.location.href = emergencyPhone;
      toastSuccess('Emergência', 'Conectando com atendimento de emergência...');
    } catch (error) {
      console.error('Error making emergency call:', error);
      toastError('Erro', 'Não foi possível fazer a ligação');
    }
  };

  return {
    handleWhatsAppContact,
    handleEmergencyCall
  };
};
