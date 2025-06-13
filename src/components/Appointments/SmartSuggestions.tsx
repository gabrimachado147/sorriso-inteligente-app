
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Clock, TrendingUp } from 'lucide-react';
import { animations } from '@/lib/animations';
import { useSmartSuggestions } from '@/hooks/useSmartSuggestions';

interface SmartSuggestionsProps {
  selectedDate: Date | undefined;
  onTimeSelect: (time: string) => void;
  onServiceSelect: (serviceId: string) => void;
}

export const SmartSuggestions: React.FC<SmartSuggestionsProps> = ({
  selectedDate,
  onTimeSelect,
  onServiceSelect
}) => {
  const { suggestions, loading, getSuggestedTimesForDate } = useSmartSuggestions();

  if (loading) {
    return (
      <Card className={animations.fadeIn}>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!suggestions) return null;

  const suggestedTimes = selectedDate ? getSuggestedTimesForDate(selectedDate) : [];

  return (
    <Card className={`${animations.slideInLeft} border-l-4 border-l-primary`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <Lightbulb className="h-5 w-5" />
          Sugestões Inteligentes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Horários Sugeridos */}
        {suggestedTimes.length > 0 && (
          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Horários Recomendados
            </h4>
            <div className="space-y-2">
              {suggestedTimes.slice(0, 3).map((timeSlot) => (
                <div
                  key={timeSlot.time}
                  className="flex items-center justify-between p-2 bg-blue-50 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{timeSlot.time}</span>
                      <Badge 
                        variant="secondary" 
                        className="text-xs"
                      >
                        {Math.round(timeSlot.confidence * 100)}% match
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      {timeSlot.reason}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onTimeSelect(timeSlot.time)}
                    className={animations.buttonHover}
                  >
                    Selecionar
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Serviços Sugeridos */}
        {suggestions.suggestedServices.length > 0 && (
          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Serviços Populares
            </h4>
            <div className="flex flex-wrap gap-2">
              {suggestions.suggestedServices.map((service) => (
                <Button
                  key={service}
                  size="sm"
                  variant="outline"
                  onClick={() => onServiceSelect(service)}
                  className={`${animations.buttonHover} text-xs`}
                >
                  {service}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Dias Preferidos */}
        {suggestions.preferredDays.length > 0 && (
          <div>
            <h4 className="font-medium mb-2">Seus Dias Preferidos</h4>
            <div className="flex flex-wrap gap-1">
              {suggestions.preferredDays.map((day) => (
                <Badge key={day} variant="secondary" className="text-xs">
                  {day}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
