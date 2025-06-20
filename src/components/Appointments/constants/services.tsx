import React from 'react';
import { 
  Search, 
  Sparkles, 
  Wrench, 
  Smile, 
  Settings, 
  Stethoscope, 
  Baby, 
  Heart, 
  AlertTriangle,
  Crown,
  Shield
} from 'lucide-react';

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: string;
  category: string;
  icon: React.ReactElement<{ className?: string }>;
}

export const availableServices: ServiceItem[] = [
  {
    id: 'avaliacao-gratuita',
    name: 'Avaliação Gratuita',
    description: 'Consulta inicial completa sem custo',
    duration: 30,
    price: 'Gratuito',
    category: 'preventivo',
    icon: <Search className="h-6 w-6" />
  },
  {
    id: 'limpeza',
    name: 'Limpeza',
    description: 'Profilaxia e remoção de tártaro',
    duration: 45,
    price: '',
    category: 'preventivo',
    icon: <Sparkles className="h-6 w-6" />
  },
  {
    id: 'restauracao',
    name: 'Restauração',
    description: 'Tratamento de cáries e restaurações',
    duration: 60,
    price: '',
    category: 'restaurativo',
    icon: <Wrench className="h-6 w-6" />
  },
  {
    id: 'ortodontia',
    name: 'Ortodontia',
    description: 'Avaliação para aparelho ortodôntico',
    duration: 45,
    price: '',
    category: 'ortodontia',
    icon: <Smile className="h-6 w-6" />
  },
  {
    id: 'implantodontia',
    name: 'Implantodontia',
    description: 'Avaliação para implantes dentários',
    duration: 60,
    price: '',
    category: 'implantodontia',
    icon: <Settings className="h-6 w-6" />
  },
  {
    id: 'estetica-dental',
    name: 'Estética Dental',
    description: 'Clareamento e procedimentos estéticos',
    duration: 90,
    price: '',
    category: 'estético',
    icon: <Sparkles className="h-6 w-6" />
  },
  {
    id: 'proteses-fixas',
    name: 'Próteses Fixas',
    description: 'Coroas, pontes e próteses fixas',
    duration: 90,
    price: '',
    category: 'restaurativo',
    icon: <Crown className="h-6 w-6" />
  },
  {
    id: 'endodontia',
    name: 'Endodontia',
    description: 'Tratamento de canal',
    duration: 90,
    price: '',
    category: 'restaurativo',
    icon: <Stethoscope className="h-6 w-6" />
  },
  {
    id: 'odontopediatria',
    name: 'Odontopediatria',
    description: 'Atendimento especializado para crianças',
    duration: 45,
    price: '',
    category: 'preventivo',
    icon: <Baby className="h-6 w-6" />
  },
  {
    id: 'periodontia',
    name: 'Periodontia',
    description: 'Tratamento de gengivas e periodonto',
    duration: 60,
    price: '',
    category: 'preventivo',
    icon: <Shield className="h-6 w-6" />
  },
  {
    id: 'atendimento-urgencia',
    name: 'Atendimento de Urgência',
    description: 'Para casos de dor e emergências',
    duration: 30,
    price: '',
    category: 'urgencia',
    icon: <AlertTriangle className="h-6 w-6" />
  }
];

export const serviceCategories = [
  { id: 'preventivo', name: 'Preventivo', color: 'bg-green-100 text-green-800' },
  { id: 'restaurativo', name: 'Restaurativo', color: 'bg-blue-100 text-blue-800' },
  { id: 'ortodontia', name: 'Ortodontia', color: 'bg-purple-100 text-purple-800' },
  { id: 'estético', name: 'Estético', color: 'bg-pink-100 text-pink-800' },
  { id: 'implantodontia', name: 'Implantodontia', color: 'bg-orange-100 text-orange-800' },
  { id: 'urgencia', name: 'Urgência', color: 'bg-red-100 text-red-800' }
];
