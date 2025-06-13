
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { animations } from '@/lib/animations';
import { Phone } from 'lucide-react';

interface EmergencyContactProps {
  onEmergencyCall: () => void;
  chatLoading: boolean;
}

export const EmergencyContact: React.FC<EmergencyContactProps> = ({
  onEmergencyCall,
  chatLoading
}) => {
  return (
    <Card className={`bg-red-50 border-red-200 ${animations.fadeIn}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-red-800">Urgência Dental</h3>
            <p className="text-sm text-red-600">Atendimento imediato para emergências</p>
          </div>
          <Button 
            className={`bg-red-600 hover:bg-red-700 ${animations.buttonHover}`}
            onClick={onEmergencyCall}
            disabled={chatLoading}
          >
            <Phone className="h-4 w-4 mr-2" />
            {chatLoading ? 'Conectando...' : 'Contatar Agora'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
