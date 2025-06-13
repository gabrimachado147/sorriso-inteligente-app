
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

interface HealthMetric {
  date: Date;
  type: 'appointment' | 'cleaning' | 'treatment' | 'checkup';
  service: string;
  notes?: string;
  rating?: number;
}

interface HealthTrend {
  period: string;
  appointments: number;
  preventiveCare: number;
  treatments: number;
  averageRating: number;
}

interface HealthInsight {
  id: string;
  type: 'recommendation' | 'warning' | 'congratulation';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  actionRequired?: boolean;
}

export const useHealthAnalytics = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<HealthMetric[]>([]);
  const [trends, setTrends] = useState<HealthTrend[]>([]);
  const [insights, setInsights] = useState<HealthInsight[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadHealthData();
    }
  }, [user]);

  const loadHealthData = () => {
    setLoading(true);
    
    // Simular dados de saúde
    const mockMetrics: HealthMetric[] = [
      {
        date: new Date('2024-01-15'),
        type: 'cleaning',
        service: 'Limpeza Dental',
        rating: 5,
        notes: 'Excelente limpeza, sem tártaro'
      },
      {
        date: new Date('2024-02-20'),
        type: 'checkup',
        service: 'Avaliação de Rotina',
        rating: 4,
        notes: 'Pequena cárie identificada'
      },
      {
        date: new Date('2024-03-10'),
        type: 'treatment',
        service: 'Restauração',
        rating: 5,
        notes: 'Tratamento de cárie concluído'
      },
      {
        date: new Date('2024-04-15'),
        type: 'cleaning',
        service: 'Limpeza Dental',
        rating: 5,
        notes: 'Saúde bucal excelente'
      }
    ];

    const mockTrends: HealthTrend[] = [
      {
        period: 'Jan 2024',
        appointments: 1,
        preventiveCare: 1,
        treatments: 0,
        averageRating: 5
      },
      {
        period: 'Fev 2024',
        appointments: 1,
        preventiveCare: 0,
        treatments: 0,
        averageRating: 4
      },
      {
        period: 'Mar 2024',
        appointments: 1,
        preventiveCare: 0,
        treatments: 1,
        averageRating: 5
      },
      {
        period: 'Abr 2024',
        appointments: 1,
        preventiveCare: 1,
        treatments: 0,
        averageRating: 5
      }
    ];

    setMetrics(mockMetrics);
    setTrends(mockTrends);
    generateInsights(mockMetrics, mockTrends);
    setLoading(false);
  };

  const generateInsights = (metrics: HealthMetric[], trends: HealthTrend[]) => {
    const insights: HealthInsight[] = [];

    // Analisar frequência de consultas
    const lastAppointment = metrics[metrics.length - 1];
    const daysSinceLastAppointment = Math.floor(
      (new Date().getTime() - lastAppointment.date.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceLastAppointment > 180) {
      insights.push({
        id: 'overdue-checkup',
        type: 'warning',
        title: 'Consulta em Atraso',
        message: 'Você não faz uma consulta há mais de 6 meses. Recomendamos agendar uma avaliação.',
        priority: 'high',
        actionRequired: true
      });
    }

    // Analisar cuidados preventivos
    const preventiveCareCount = metrics.filter(m => m.type === 'cleaning').length;
    if (preventiveCareCount >= 2) {
      insights.push({
        id: 'good-prevention',
        type: 'congratulation',
        title: 'Parabéns pelo Cuidado Preventivo!',
        message: 'Você está mantendo uma boa rotina de limpezas dentais.',
        priority: 'low'
      });
    }

    // Analisar ratings
    const averageRating = metrics.reduce((sum, m) => sum + (m.rating || 0), 0) / metrics.length;
    if (averageRating >= 4.5) {
      insights.push({
        id: 'high-satisfaction',
        type: 'congratulation',
        title: 'Alta Satisfação',
        message: 'Suas avaliações mostram excelente satisfação com os tratamentos.',
        priority: 'low'
      });
    }

    // Recomendar próxima consulta
    insights.push({
      id: 'next-appointment',
      type: 'recommendation',
      title: 'Próxima Consulta Recomendada',
      message: 'Baseado no seu histórico, recomendamos uma limpeza em breve.',
      priority: 'medium'
    });

    setInsights(insights);
  };

  const addHealthMetric = (metric: Omit<HealthMetric, 'date'>) => {
    const newMetric: HealthMetric = {
      ...metric,
      date: new Date()
    };

    const updatedMetrics = [...metrics, newMetric];
    setMetrics(updatedMetrics);

    // Salvar no localStorage
    localStorage.setItem(`health-metrics-${user?.id}`, JSON.stringify(updatedMetrics));
    
    // Regenerar insights
    generateInsights(updatedMetrics, trends);

    return newMetric;
  };

  const getHealthScore = () => {
    if (metrics.length === 0) return 0;

    const preventiveScore = (metrics.filter(m => m.type === 'cleaning').length / metrics.length) * 40;
    const ratingScore = (metrics.reduce((sum, m) => sum + (m.rating || 0), 0) / metrics.length) * 20;
    const frequencyScore = metrics.length >= 4 ? 40 : (metrics.length / 4) * 40;

    return Math.min(100, Math.round(preventiveScore + ratingScore + frequencyScore));
  };

  const getRecommendations = () => {
    return insights.filter(i => i.type === 'recommendation' || i.priority === 'high');
  };

  return {
    metrics,
    trends,
    insights,
    loading,
    addHealthMetric,
    getHealthScore,
    getRecommendations,
    refreshAnalytics: loadHealthData
  };
};
