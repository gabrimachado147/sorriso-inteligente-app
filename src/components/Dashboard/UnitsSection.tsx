
import React, { memo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import { animations } from '@/lib/animations';
import { useProductionClinics } from '@/hooks/useProductionData';

interface UnitsSectionProps {
  onViewUnits: () => void;
  onScheduleClinic: (clinicId?: string) => void;
}

export const UnitsSection: React.FC<UnitsSectionProps> = memo(({
  onViewUnits,
  onScheduleClinic
}) => {
  const { clinics, loading } = useProductionClinics();

  if (loading) {
    return (
      <Card className={animations.slideInLeft}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-lg">
            <MapPin className="h-5 w-5 mr-2" />
            Nossas Unidades
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-20 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={animations.slideInLeft}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <MapPin className="h-5 w-5 mr-2" />
          Nossas Unidades
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {clinics.map((clinic) => (
            <div key={clinic.id} className={`p-3 border rounded-lg ${animations.cardHover}`}>
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm text-gray-900">{clinic.name}</h4>
                  <p className="text-xs text-gray-700 mt-1">{clinic.address}</p>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => onScheduleClinic(clinic.id)}
                  className={`${animations.buttonHover} px-3 py-1 text-xs shrink-0 text-gray-900 border-gray-300 hover:bg-gray-50 font-medium`}
                  aria-label={`Agendar consulta na unidade ${clinic.name}`}
                >
                  Agendar
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
});

UnitsSection.displayName = 'UnitsSection';
