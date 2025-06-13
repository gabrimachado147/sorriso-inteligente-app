
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
    description: 'Consulta inicial completa para avaliação do estado bucal',
    duration: 30,
    price: 'Gratuito',
    icon: <Search className="h-6 w-6" /> 
  },
  { 
    id: 'limpeza', 
    name: 'Limpeza Dental', 
    description: 'Profilaxia dental com remoção de tártaro e polimento',
    duration: 45,
    price: 'R$ 80,00',
    icon: <Sparkles className="h-6 w-6" /> 
  },
  { 
    id: 'restauracao', 
    name: 'Restauração', 
    description: 'Tratamento de cáries com resinas compostas',
    duration: 60,
    price: 'R$ 120,00',
    icon: <Wrench className="h-6 w-6" /> 
  },
  { 
    id: 'ortodontia', 
    name: 'Ortodontia', 
    description: 'Consulta ortodôntica para alinhamento dental',
    duration: 45,
    price: 'R$ 150,00',
    icon: <Smile className="h-6 w-6" /> 
  },
  { 
    id: 'implantodontia', 
    name: 'Implantodontia', 
    description: 'Avaliação para implantes dentários',
    duration: 60,
    price: 'R$ 200,00',
    icon: <Settings className="h-6 w-6" /> 
  },
  { 
    id: 'estetica-dental', 
    name: 'Estética Dental', 
    description: 'Tratamentos estéticos como clareamento e facetas',
    duration: 90,
    price: 'R$ 250,00',
    icon: <Sparkles className="h-6 w-6" /> 
  },
  { 
    id: 'proteses-fixas', 
    name: 'Próteses Fixas', 
    description: 'Consulta para próteses e coroas dentárias',
    duration: 75,
    price: 'R$ 300,00',
    icon: <Shield className="h-6 w-6" /> 
  },
  { 
    id: 'endodontia', 
    name: 'Endodontia', 
    description: 'Tratamento de canal radicular',
    duration: 120,
    price: 'R$ 180,00',
    icon: <Stethoscope className="h-6 w-6" /> 
  },
  { 
    id: 'odontopediatria', 
    name: 'Odontopediatria', 
    description: 'Atendimento odontológico especializado para crianças',
    duration: 45,
    price: 'R$ 100,00',
    icon: <Baby className="h-6 w-6" /> 
  },
  { 
    id: 'periodontia', 
    name: 'Periodontia', 
    description: 'Tratamento de doenças da gengiva',
    duration: 60,
    price: 'R$ 140,00',
    icon: <Heart className="h-6 w-6" /> 
  },
  { 
    id: 'clareamento', 
    name: 'Clareamento Dental', 
    description: 'Procedimento de clareamento dental profissional',
    duration: 90,
    price: 'R$ 200,00',
    icon: <Sparkles className="h-6 w-6" /> 
  },
  { 
    id: 'urgencia', 
    name: 'Atendimento de Urgência', 
    description: 'Atendimento imediato para dores e emergências',
    duration: 30,
    price: 'R$ 80,00',
    icon: <AlertTriangle className="h-6 w-6" /> 
  }
];
