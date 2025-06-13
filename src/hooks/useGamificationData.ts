
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

interface GamificationData {
  id?: string;
  points: number;
  level: number;
  badges: string[];
  achievements: string[];
}

export const useGamificationData = () => {
  const { user, isAuthenticated } = useAuth();
  const [gamificationData, setGamificationData] = useState<GamificationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGamificationData = async () => {
      if (!isAuthenticated || !user) {
        setGamificationData(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from('user_gamification')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          throw error;
        }

        if (data) {
          setGamificationData({
            ...data,
            badges: data.badges || [],
            achievements: data.achievements || []
          });
        } else {
          // Create default gamification data
          const defaultData = {
            user_id: user.id,
            points: 100, // Pontos iniciais de boas-vindas
            level: 1,
            badges: ['welcome'],
            achievements: ['first_login']
          };

          const { data: newData, error: createError } = await supabase
            .from('user_gamification')
            .insert(defaultData)
            .select()
            .single();

          if (createError) throw createError;
          setGamificationData({
            ...newData,
            badges: newData.badges || [],
            achievements: newData.achievements || []
          });
        }
      } catch (err) {
        console.error('Error loading gamification data:', err);
        setError('Erro ao carregar dados de gamificação');
      } finally {
        setLoading(false);
      }
    };

    loadGamificationData();
  }, [user, isAuthenticated]);

  const addPoints = async (points: number) => {
    if (!user || !gamificationData) return;

    try {
      const newPoints = gamificationData.points + points;
      const newLevel = Math.floor(newPoints / 500) + 1; // A cada 500 pontos, novo level

      const { data, error } = await supabase
        .from('user_gamification')
        .update({ 
          points: newPoints,
          level: newLevel 
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      setGamificationData({
        ...data,
        badges: data.badges || [],
        achievements: data.achievements || []
      });
      
      return { success: true, newLevel: newLevel > gamificationData.level };
    } catch (err) {
      console.error('Error adding points:', err);
      return { success: false };
    }
  };

  const addBadge = async (badge: string) => {
    if (!user || !gamificationData) return;

    try {
      const newBadges = [...gamificationData.badges, badge];

      const { data, error } = await supabase
        .from('user_gamification')
        .update({ badges: newBadges })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      setGamificationData({
        ...data,
        badges: data.badges || [],
        achievements: data.achievements || []
      });
      
      return { success: true };
    } catch (err) {
      console.error('Error adding badge:', err);
      return { success: false };
    }
  };

  return {
    gamificationData,
    loading,
    error,
    addPoints,
    addBadge,
    clearError: () => setError(null)
  };
};
