
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Clock, 
  Zap, 
  CheckCircle,
  Users,
  BarChart3
} from 'lucide-react';

const successMetrics = [
  {
    icon: TrendingUp,
    metric: "87%",
    description: "Aumento na produtividade do desenvolvimento",
    color: "text-green-600"
  },
  {
    icon: Clock,
    metric: "65%",
    description: "Redução no tempo de debug",
    color: "text-blue-600"
  },
  {
    icon: Zap,
    metric: "92%",
    description: "Performance otimizada automaticamente",
    color: "text-purple-600"
  },
  {
    icon: Users,
    metric: "50+",
    description: "Desenvolvedores ativos usando as ferramentas",
    color: "text-orange-600"
  }
];

export const DeveloperSuccessStories: React.FC = () => {
  return (
    <Card className="bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 border-blue-200 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-xl">
          <BarChart3 className="h-6 w-6 text-blue-600" />
          Impacto Comprovado
          <Badge variant="secondary" className="bg-green-100 text-green-700 animate-pulse">
            EM TEMPO REAL
          </Badge>
        </CardTitle>
        <p className="text-muted-foreground">
          Resultados mensuráveis que nossa suite de ferramentas entrega para equipes de desenvolvimento
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {successMetrics.map((item, index) => {
            const Icon = item.icon;
            return (
              <div 
                key={index}
                className="text-center p-4 bg-white/60 rounded-lg backdrop-blur-sm border border-white/20 hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <Icon className={`h-8 w-8 mx-auto mb-2 ${item.color}`} />
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {item.metric}
                </div>
                <div className="text-xs text-muted-foreground mt-1 leading-tight">
                  {item.description}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 p-4 bg-white/40 rounded-lg border border-white/30">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="font-semibold text-green-700">Case de Sucesso Recente</span>
          </div>
          <p className="text-sm text-gray-700">
            <strong>Clínica Odontológica Premium:</strong> Implementação completa resultou em 
            <span className="font-bold text-blue-600"> redução de 3 horas diárias</span> no tempo 
            de desenvolvimento e <span className="font-bold text-green-600">zero bugs críticos</span> em produção nos últimos 30 dias.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
