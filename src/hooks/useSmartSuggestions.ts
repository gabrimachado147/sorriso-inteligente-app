
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

interface TimeSlot {
  time: string;
  confidence: number;
  reason: string;
}

interface SmartSuggestion {
  preferredTimes: TimeSlot[];
  preferredDays: string[];
  suggestedServices: string[];
}

export const useSmartSuggestions = () => {
  const { user } = useAuth();
  const [suggestions, setSuggestions] = useState<SmartSuggestion | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadUserPreferences();
    }
  }, [user]);

  const loadUserPreferences = async () => {
    setLoading(true);
    try {
      // Simular análise do histórico do usuário
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Baseado no histórico simulado, criar sugestões
      const mockSuggestions: SmartSuggestion = {
        preferredTimes: [
          { time: '14:00', confidence: 0.85, reason: 'Horário mais agendado anteriormente' },
          { time: '09:00', confidence: 0.72, reason: 'Menos trânsito neste horário' },
          { time: '16:00', confidence: 0.68, reason: 'Horário com menor tempo de espera' }
        ],
        preferredDays: ['Segunda', 'Quarta', 'Sexta'],
        suggestedServices: ['Limpeza Dental', 'Avaliação Gratuita']
      };
      
      setSuggestions(mockSuggestions);
    } catch (error) {
      console.error('Erro ao carregar sugestões:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSuggestedTimesForDate = (date: Date): TimeSlot[] => {
    if (!suggestions) return [];
    
    const dayOfWeek = date.getDay();
    const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const currentDay = dayNames[dayOfWeek];
    
    // Se é um dia preferido, retornar horários com maior confiança
    if (suggestions.preferredDays.includes(currentDay)) {
      return suggestions.preferredTimes.map(slot => ({
        ...slot,
        confidence: slot.confidence + 0.1
      }));
    }
    
    return suggestions.preferredTimes;
  };

  return {
    suggestions,
    loading,
    getSuggestedTimesForDate,
    refreshSuggestions: loadUserPreferences
  };
};
