
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Clock } from 'lucide-react';

export interface ClinicSelectorProps {
  selectedClinic: string;
  onClinicSelect: (clinicId: string) => void;
  clinics: {
    id: string;
    name: string;
    city: string;
    state: string;
  }[];
}

export const ClinicSelector: React.FC<ClinicSelectorProps> = ({
  selectedClinic,
  onClinicSelect,
  clinics
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {clinics.map((clinic) => (
        <Card
          key={clinic.id}
          className={`cursor-pointer transition-all hover:shadow-md ${
            selectedClinic === clinic.id
              ? 'ring-2 ring-primary bg-primary/5'
              : 'hover:bg-gray-50'
          }`}
          onClick={() => onClinicSelect(clinic.id)}
        >
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">
                  {clinic.name}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {clinic.city}, {clinic.state}
                </p>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  <span>Seg-Sex: 8h-18h</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
