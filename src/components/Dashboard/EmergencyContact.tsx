
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { animations } from '@/lib/animations';
import { Phone } from 'lucide-react';
import { ButtonLoading } from '@/components/ui/enhanced-loading';

interface EmergencyContactProps {
  onEmergencyCall: () => void;
  chatLoading: boolean;
}

export const EmergencyContact: React.FC<EmergencyContactProps> = ({
  onEmergencyCall,
  chatLoading
}) => {
  return (
    <Card className={`bg-red-50 border-red-200 ${animations.fadeIn} ${animations.cardHover}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className={`font-semibold text-red-800 mb-1 ${animations.emergencyPulse}`}>
              Urgência Dental
            </h3>
            <p className="text-sm text-red-600">Atendimento para emergências odontológicas</p>
          </div>
          <Button 
            className={`bg-red-600 hover:bg-red-700 text-white border-0 shadow-sm px-4 py-2 h-auto whitespace-nowrap ${animations.buttonHover}`}
            onClick={onEmergencyCall}
            disabled={chatLoading}
            size="sm"
          >
            {chatLoading ? (
              <ButtonLoading text="Conectando..." size="sm" />
            ) : (
              <>
                <Phone className={`h-4 w-4 mr-2 ${animations.iconHover}`} />
                Contatar Agora
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
