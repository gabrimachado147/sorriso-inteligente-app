import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Gamepad2, Award, Star } from 'lucide-react';
import { animations } from '@/lib/animations';
import { useGamificationData } from '@/hooks/useGamificationData';

export const GamificationTab = () => {
  const { gamificationData } = useGamificationData();

  return (
    <div className="space-y-6">
      <Card className={animations.fadeIn}>
        <CardHeader>
          <CardTitle className="flex items-center justify-center gap-2 text-lg">
            <Gamepad2 className="h-5 w-5" />
            Sistema de Pontuação
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">
              {gamificationData?.points || 0}
            </div>
            <p className="text-gray-600">Pontos Totais</p>
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Nível {gamificationData?.level || 1}</p>
              <Progress value={((gamificationData?.points || 0) % 500) / 5} className="w-full" />
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-3 flex items-center justify-center gap-2 text-lg">
              <Award className="h-4 w-4" />
              Conquistas
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {gamificationData?.badges?.map((badge, index) => (
                <div key={index} className="text-center p-3 bg-blue-50 rounded-lg">
                  <Star className="h-6 w-6 mx-auto text-blue-600 mb-1" />
                  <p className="text-xs font-medium">{badge}</p>
                </div>
              )) || (
                <p className="text-gray-500 col-span-full text-center">Nenhuma conquista ainda</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
