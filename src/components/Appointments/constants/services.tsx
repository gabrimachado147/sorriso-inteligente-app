
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
  AlertTriangle 
} from 'lucide-react';

export const availableServices = [
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
    id: 'limpeza-dental',
    name: 'Limpeza Dental',
    description: 'Profilaxia e remoção de tártaro',
    duration: 45,
    price: 'A partir de R$ 80',
    category: 'preventivo',
    icon: <Sparkles className="h-6 w-6" />
  },
  {
    id: 'restauracao',
    name: 'Restauração',
    description: 'Tratamento de cáries e restaurações',
    duration: 60,
    price: 'A partir de R$ 120',
    category: 'restaurativo',
    icon: <Wrench className="h-6 w-6" />
  },
  {
    id: 'ortodontia-consulta',
    name: 'Ortodontia',
    description: 'Avaliação para aparelho ortodôntico',
    duration: 45,
    price: 'A partir de R$ 100',
    category: 'ortodontia',
    icon: <Smile className="h-6 w-6" />
  },
  {
    id: 'implantodontia-consulta',
    name: 'Implantodontia',
    description: 'Avaliação para implantes dentários',
    duration: 60,
    price: 'A partir de R$ 150',
    category: 'implantodontia',
    icon: <Settings className="h-6 w-6" />
  },
  {
    id: 'clareamento-dental',
    name: 'Clareamento Dental',
    description: 'Clareamento dental profissional',
    duration: 90,
    price: 'A partir de R$ 300',
    category: 'estético',
    icon: <Sparkles className="h-6 w-6" />
  },
  {
    id: 'endodontia',
    name: 'Endodontia',
    description: 'Tratamento de canal',
    duration: 90,
    price: 'A partir de R$ 200',
    category: 'restaurativo',
    icon: <Stethoscope className="h-6 w-6" />
  },
  {
    id: 'atendimento-urgencia',
    name: 'Atendimento de Urgência',
    description: 'Para casos de dor e emergências',
    duration: 30,
    price: 'A partir de R$ 100',
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
