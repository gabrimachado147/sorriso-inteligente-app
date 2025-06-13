
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

interface GamificationData {
  id: string;
  user_id: string;
  points: number;
  level: number;
  achievements: string[];
  badges: string[];
  created_at: string;
  updated_at: string;
}

export const useGamificationData = () => {
  const { user } = useAuth();
  const [gamificationData, setGamificationData] = useState<GamificationData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchGamificationData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_gamification')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching gamification data:', error);
        return;
      }

      if (data) {
        setGamificationData(data);
      } else {
        // Criar dados de gamificação padrão se não existirem
        const defaultData = {
          user_id: user.id,
          points: 0,
          level: 1,
          achievements: [],
          badges: []
        };

        const { data: newData, error: createError } = await supabase
          .from('user_gamification')
          .insert(defaultData)
          .select()
          .single();

        if (!createError && newData) {
          setGamificationData(newData);
        }
      }
    } catch (error) {
      console.error('Error in fetchGamificationData:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGamificationData();
  }, [user]);

  return {
    gamificationData,
    loading,
    refetch: fetchGamificationData
  };
};
