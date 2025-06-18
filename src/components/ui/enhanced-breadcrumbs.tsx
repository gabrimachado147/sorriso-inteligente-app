
import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { InteractiveFeedback } from './interactive-feedback';

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface EnhancedBreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
}

export const EnhancedBreadcrumbs: React.FC<EnhancedBreadcrumbsProps> = ({
  items,
  className
}) => {
  const location = useLocation();

  // Gerar breadcrumbs automaticamente se não fornecidos
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathnames = location.pathname.split('/').filter(x => x);
    
    const routeNames: Record<string, string> = {
      '': 'Início',
      'developer': 'Ferramentas de Desenvolvimento',
      'chat': 'Chat IA',
      'appointments': 'Agendamentos',
      'clinics': 'Nossas Clínicas',
      'profile': 'Perfil',
      'admin': 'Administração',
      'analytics': 'Relatórios',
      'gamification': 'Gamificação',
      'reminders': 'Lembretes'
    };

    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Início', href: '/', icon: Home }
    ];

    let currentPath = '';
    pathnames.forEach((pathname) => {
      currentPath += `/${pathname}`;
      breadcrumbs.push({
        label: routeNames[pathname] || pathname.charAt(0).toUpperCase() + pathname.slice(1),
        href: currentPath
      });
    });

    return breadcrumbs;
  };

  const breadcrumbItems = items || generateBreadcrumbs();

  return (
    <nav className={cn('flex items-center space-x-1 text-sm text-muted-foreground', className)}>
      {breadcrumbItems.map((item, index) => {
        const isLast = index === breadcrumbItems.length - 1;
        const IconComponent = item.icon;

        return (
          <React.Fragment key={index}>
            {index > 0 && (
              <ChevronRight className="h-4 w-4 text-muted-foreground/50" />
            )}
            
            {isLast ? (
              <span className="font-medium text-foreground flex items-center gap-1">
                {IconComponent && <IconComponent className="h-4 w-4" />}
                {item.label}
              </span>
            ) : (
              <InteractiveFeedback feedbackType="ripple">
                <Link
                  to={item.href || '/'}
                  className="hover:text-foreground transition-colors flex items-center gap-1 px-1 py-0.5 rounded"
                >
                  {IconComponent && <IconComponent className="h-4 w-4" />}
                  {item.label}
                </Link>
              </InteractiveFeedback>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
