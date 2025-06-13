
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedAt?: Date;
}

interface Achievement {
  id: string;
  type: 'appointment' | 'preventive' | 'streak' | 'challenge';
  points: number;
  description: string;
  date: Date;
}

interface GamificationData {
  totalPoints: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  badges: Badge[];
  recentAchievements: Achievement[];
  nextLevelPoints: number;
}

export const useGamification = () => {
  const { user } = useAuth();
  const [data, setData] = useState<GamificationData>({
    totalPoints: 0,
    level: 1,
    currentStreak: 0,
    longestStreak: 0,
    badges: [],
    recentAchievements: [],
    nextLevelPoints: 100
  });

  useEffect(() => {
    if (user) {
      loadGamificationData();
    }
  }, [user]);

  const loadGamificationData = () => {
    const stored = localStorage.getItem(`gamification-${user?.id}`);
    if (stored) {
      const parsed = JSON.parse(stored);
      setData({
        ...parsed,
        recentAchievements: parsed.recentAchievements.map((a: any) => ({
          ...a,
          date: new Date(a.date)
        }))
      });
    } else {
      initializeBadges();
    }
  };

  const initializeBadges = () => {
    const initialBadges: Badge[] = [
      {
        id: 'first-appointment',
        name: 'Primeiro Passo',
        description: 'Primeira consulta agendada',
        icon: '🎯',
        earned: false
      },
      {
        id: 'preventive-care',
        name: 'Cuidado Preventivo',
        description: '3 limpezas realizadas',
        icon: '🦷',
        earned: false
      },
      {
        id: 'streak-7',
        name: 'Compromissado',
        description: '7 consultas consecutivas',
        icon: '🔥',
        earned: false
      },
      {
        id: 'early-bird',
        name: 'Madrugador',
        description: '5 consultas antes das 9h',
        icon: '🌅',
        earned: false
      },
      {
        id: 'health-champion',
        name: 'Campeão da Saúde',
        description: 'Completou todos os desafios do mês',
        icon: '🏆',
        earned: false
      }
    ];

    setData(prev => ({ ...prev, badges: initialBadges }));
  };

  const addPoints = (points: number, description: string, type: Achievement['type']) => {
    const achievement: Achievement = {
      id: Date.now().toString(),
      type,
      points,
      description,
      date: new Date()
    };

    setData(prev => {
      const newTotalPoints = prev.totalPoints + points;
      const newLevel = Math.floor(newTotalPoints / 100) + 1;
      const nextLevelPoints = newLevel * 100;

      const updatedData = {
        ...prev,
        totalPoints: newTotalPoints,
        level: newLevel,
        nextLevelPoints,
        recentAchievements: [achievement, ...prev.recentAchievements.slice(0, 9)]
      };

      localStorage.setItem(`gamification-${user?.id}`, JSON.stringify(updatedData));
      return updatedData;
    });

    checkBadges();
    return achievement;
  };

  const updateStreak = (increment: boolean = true) => {
    setData(prev => {
      const newStreak = increment ? prev.currentStreak + 1 : 0;
      const longestStreak = Math.max(prev.longestStreak, newStreak);
      
      const updatedData = {
        ...prev,
        currentStreak: newStreak,
        longestStreak
      };

      localStorage.setItem(`gamification-${user?.id}`, JSON.stringify(updatedData));
      return updatedData;
    });

    if (increment) {
      checkBadges();
    }
  };

  const checkBadges = () => {
    setData(prev => {
      const updatedBadges = prev.badges.map(badge => {
        if (badge.earned) return badge;

        let shouldEarn = false;

        switch (badge.id) {
          case 'first-appointment':
            shouldEarn = prev.recentAchievements.some(a => a.type === 'appointment');
            break;
          case 'preventive-care':
            shouldEarn = prev.recentAchievements.filter(a => 
              a.type === 'preventive'
            ).length >= 3;
            break;
          case 'streak-7':
            shouldEarn = prev.currentStreak >= 7;
            break;
          case 'health-champion':
            shouldEarn = prev.totalPoints >= 500;
            break;
        }

        if (shouldEarn) {
          return { ...badge, earned: true, earnedAt: new Date() };
        }

        return badge;
      });

      return { ...prev, badges: updatedBadges };
    });
  };

  const earnBadge = (badgeId: string) => {
    setData(prev => {
      const updatedBadges = prev.badges.map(badge =>
        badge.id === badgeId 
          ? { ...badge, earned: true, earnedAt: new Date() }
          : badge
      );

      const updatedData = { ...prev, badges: updatedBadges };
      localStorage.setItem(`gamification-${user?.id}`, JSON.stringify(updatedData));
      return updatedData;
    });
  };

  const getProgressToNextLevel = () => {
    const currentLevelPoints = (data.level - 1) * 100;
    const pointsInCurrentLevel = data.totalPoints - currentLevelPoints;
    return (pointsInCurrentLevel / 100) * 100;
  };

  return {
    data,
    addPoints,
    updateStreak,
    earnBadge,
    getProgressToNextLevel
  };
};
