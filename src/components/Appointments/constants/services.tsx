
import React from 'react';
import { 
  Stethoscope, 
  Search, 
  Sparkles, 
  Wrench, 
  Smile, 
  Settings, 
  Shield, 
  Baby, 
  Heart, 
  AlertTriangle 
} from 'lucide-react';

export const availableServices = [
  { 
    id: 'avaliacao-gratuita', 
    name: 'Avaliação Gratuita', 
    icon: <Search className="h-6 w-6" /> 
  },
  { 
    id: 'limpeza', 
    name: 'Limpeza Dental', 
    icon: <Sparkles className="h-6 w-6" /> 
  },
  { 
    id: 'restauracao', 
    name: 'Restauração', 
    icon: <Wrench className="h-6 w-6" /> 
  },
  { 
    id: 'ortodontia', 
    name: 'Ortodontia', 
    icon: <Smile className="h-6 w-6" /> 
  },
  { 
    id: 'implantodontia', 
    name: 'Implantodontia', 
    icon: <Settings className="h-6 w-6" /> 
  },
  { 
    id: 'estetica-dental', 
    name: 'Estética Dental', 
    icon: <Sparkles className="h-6 w-6" /> 
  },
  { 
    id: 'proteses-fixas', 
    name: 'Próteses Fixas', 
    icon: <Shield className="h-6 w-6" /> 
  },
  { 
    id: 'endodontia', 
    name: 'Endodontia', 
    icon: <Stethoscope className="h-6 w-6" /> 
  },
  { 
    id: 'odontopediatria', 
    name: 'Odontopediatria', 
    icon: <Baby className="h-6 w-6" /> 
  },
  { 
    id: 'periodontia', 
    name: 'Periodontia', 
    icon: <Heart className="h-6 w-6" /> 
  },
  { 
    id: 'urgencia', 
    name: 'Atendimento de Urgência', 
    icon: <AlertTriangle className="h-6 w-6" /> 
  }
];
