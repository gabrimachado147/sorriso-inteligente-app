
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';

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

  const parseJsonToStringArray = (jsonData: Json): string[] => {
    if (Array.isArray(jsonData)) {
      return jsonData.filter((item): item is string => typeof item === 'string');
    }
    return [];
  };

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
        const formattedData: GamificationData = {
          id: data.id,
          user_id: data.user_id,
          points: data.points,
          level: data.level,
          achievements: parseJsonToStringArray(data.achievements),
          badges: parseJsonToStringArray(data.badges),
          created_at: data.created_at,
          updated_at: data.updated_at
        };
        setGamificationData(formattedData);
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
          const formattedNewData: GamificationData = {
            id: newData.id,
            user_id: newData.user_id,
            points: newData.points,
            level: newData.level,
            achievements: parseJsonToStringArray(newData.achievements),
            badges: parseJsonToStringArray(newData.badges),
            created_at: newData.created_at,
            updated_at: newData.updated_at
          };
          setGamificationData(formattedNewData);
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
