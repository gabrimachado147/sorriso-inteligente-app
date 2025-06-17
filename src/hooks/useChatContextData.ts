
import { useMemo } from 'react';
import { useProductionClinics, useProductionServices } from './useProductionData';
import ChatKnowledgeBase from '@/services/chatKnowledgeBase';

// Hook específico para fornecer informações contextuais completas para o chat IA
export const useChatContextData = () => {
  const { getOperatingHoursInfo, isClinicOpen, clinics } = useProductionClinics();
  const { services } = useProductionServices();

  const knowledgeContext = useMemo(() => ChatKnowledgeBase.getChatContext(), []);

  const getChatContextInfo = () => {
    const operatingHours = getOperatingHoursInfo();
    const currentlyOpen = isClinicOpen();
    
    return {
      // Informações básicas
      operatingHours,
      currentlyOpen,
      totalClinics: clinics.length,
      availableServices: services.map(s => s.name),
      locations: clinics.map(c => `${c.name} - ${c.city}/${c.state}`),
      
      // Horários detalhados
      workingHours: {
        weekdays: "8h às 19h",
        saturday: "8h às 13h", 
        sunday: "Fechado"
      },
      
      // Base de conhecimento
      knowledgeBase: {
        totalEntries: knowledgeContext.totalEntries,
        categories: knowledgeContext.categories,
        searchFunction: ChatKnowledgeBase.searchKnowledge,
        getBestMatch: ChatKnowledgeBase.getBestMatch,
        getAllEntries: ChatKnowledgeBase.getAllEntries
      }
    };
  };

  // Função para buscar respostas na base de conhecimento
  const searchKnowledge = (query: string) => {
    return ChatKnowledgeBase.searchKnowledge(query);
  };

  // Função para obter a melhor resposta para uma pergunta
  const getBestAnswer = (query: string) => {
    return ChatKnowledgeBase.getBestMatch(query);
  };

  return {
    getChatContextInfo,
    searchKnowledge,
    getBestAnswer,
    knowledgeCategories: knowledgeContext.categories
  };
};

export default useChatContextData;
