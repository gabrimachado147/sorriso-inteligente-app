
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Code, 
  Zap, 
  Trophy, 
  BookOpen, 
  BarChart3,
  Database,
  Cpu,
  ChevronRight
} from 'lucide-react';

interface NavigationItem {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  status: 'active' | 'beta' | 'new' | 'pro';
  category: 'analysis' | 'tools' | 'learning' | 'performance';
  onClick: () => void;
}

interface EnhancedDeveloperNavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const EnhancedDeveloperNavigation: React.FC<EnhancedDeveloperNavigationProps> = ({
  activeSection,
  onSectionChange
}) => {
  const navigationItems: NavigationItem[] = [
    {
      id: 'live-analysis',
      title: 'Análise ao Vivo',
      description: 'Monitoramento em tempo real do código',
      icon: Brain,
      status: 'active',
      category: 'analysis',
      onClick: () => onSectionChange('live-analysis')
    },
    {
      id: 'ai-assistant',
      title: 'Assistente IA',
      description: 'Suporte inteligente para desenvolvimento',
      icon: Zap,
      status: 'pro',
      category: 'tools',
      onClick: () => onSectionChange('ai-assistant')
    },
    {
      id: 'code-analysis',
      title: 'Análise de Código',
      description: 'Relatórios detalhados de qualidade',
      icon: Code,
      status: 'active',
      category: 'analysis',
      onClick: () => onSectionChange('code-analysis')
    },
    {
      id: 'performance',
      title: 'Performance',
      description: 'Métricas e otimizações avançadas',
      icon: BarChart3,
      status: 'beta',
      category: 'performance',
      onClick: () => onSectionChange('performance')
    },
    {
      id: 'challenges',
      title: 'Desafios',
      description: 'Gamificação para desenvolvedores',
      icon: Trophy,
      status: 'new',
      category: 'learning',
      onClick: () => onSectionChange('challenges')
    },
    {
      id: 'tutorial',
      title: 'Tutoriais',
      description: 'Guias interativos passo a passo',
      icon: BookOpen,
      status: 'active',
      category: 'learning',
      onClick: () => onSectionChange('tutorial')
    },
    {
      id: 'database',
      title: 'Database Manager',
      description: 'Gestão inteligente do banco de dados',
      icon: Database,
      status: 'active',
      category: 'tools',
      onClick: () => onSectionChange('database')
    },
    {
      id: 'system',
      title: 'Sistema',
      description: 'Informações e configurações do sistema',
      icon: Cpu,
      status: 'active',
      category: 'tools',
      onClick: () => onSectionChange('system')
    }
  ];

  const getStatusBadge = (status: NavigationItem['status']) => {
    switch (status) {
      case 'pro':
        return <Badge className="bg-purple-100 text-purple-700 text-xs">PRO</Badge>;
      case 'beta':
        return <Badge className="bg-blue-100 text-blue-700 text-xs">BETA</Badge>;
      case 'new':
        return <Badge className="bg-green-100 text-green-700 text-xs">NOVO</Badge>;
      default:
        return null;
    }
  };

  const getCategoryColor = (category: NavigationItem['category']) => {
    switch (category) {
      case 'analysis': return 'border-l-4 border-l-purple-500';
      case 'tools': return 'border-l-4 border-l-blue-500';
      case 'learning': return 'border-l-4 border-l-green-500';
      case 'performance': return 'border-l-4 border-l-yellow-500';
      default: return 'border-l-4 border-l-gray-300';
    }
  };

  const categories = [
    { id: 'analysis', name: 'Análise', items: navigationItems.filter(item => item.category === 'analysis') },
    { id: 'tools', name: 'Ferramentas', items: navigationItems.filter(item => item.category === 'tools') },
    { id: 'performance', name: 'Performance', items: navigationItems.filter(item => item.category === 'performance') },
    { id: 'learning', name: 'Aprendizado', items: navigationItems.filter(item => item.category === 'learning') }
  ];

  return (
    <div className="space-y-4 lg:space-y-6 w-full">
      <div className="text-center">
        <h2 className="text-lg lg:text-xl font-bold mb-2">🚀 Central de Desenvolvimento</h2>
        <p className="text-xs lg:text-sm text-gray-600 px-2">
          Ferramentas avançadas para otimizar seu workflow
        </p>
      </div>

      {categories.map(category => (
        <div key={category.id} className="space-y-2">
          <h3 className="text-xs lg:text-sm font-semibold text-gray-500 uppercase tracking-wide px-1">
            {category.name}
          </h3>
          <div className="grid grid-cols-1 gap-2 lg:gap-3">
            {category.items.map(item => {
              const IconComponent = item.icon;
              const isActive = activeSection === item.id;
              
              return (
                <Card
                  key={item.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    isActive 
                      ? 'ring-2 ring-primary bg-primary/5 shadow-md' 
                      : 'hover:border-gray-300'
                  } ${getCategoryColor(item.category)}`}
                  onClick={item.onClick}
                >
                  <CardContent className="p-3 lg:p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-2 lg:gap-3 flex-1 min-w-0">
                        <div className={`p-1.5 lg:p-2 rounded-lg flex-shrink-0 ${
                          isActive 
                            ? 'bg-primary text-white' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          <IconComponent className="h-3 w-3 lg:h-4 lg:w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1 lg:gap-2 mb-1 flex-wrap">
                            <h4 className="font-medium text-xs lg:text-sm truncate">
                              {item.title}
                            </h4>
                            {getStatusBadge(item.status)}
                          </div>
                          <p className="text-xs text-gray-600 line-clamp-2 lg:line-clamp-none">
                            {item.description}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className={`h-3 w-3 lg:h-4 lg:w-4 transition-transform duration-200 flex-shrink-0 ml-1 ${
                        isActive ? 'text-primary rotate-90' : 'text-gray-400'
                      }`} />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
