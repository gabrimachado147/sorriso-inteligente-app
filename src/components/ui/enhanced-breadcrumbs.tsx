
import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { animations } from '@/lib/animations';

interface BreadcrumbItem {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  current?: boolean;
}

interface EnhancedBreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const EnhancedBreadcrumbs: React.FC<EnhancedBreadcrumbsProps> = ({
  items,
  className
}) => {
  return (
    <nav className={cn('flex items-center space-x-1 text-sm text-gray-600', animations.fadeInUp, className)}>
      <Link 
        to="/" 
        className="flex items-center hover:text-primary transition-colors duration-200"
      >
        <Home className="h-4 w-4" />
      </Link>
      
      {items.map((item, index) => (
        <React.Fragment key={item.href}>
          <ChevronRight className="h-4 w-4 text-gray-400" />
          
          {item.current ? (
            <span className="flex items-center gap-1 font-medium text-primary">
              {item.icon && <item.icon className="h-4 w-4" />}
              {item.label}
            </span>
          ) : (
            <Link
              to={item.href}
              className="flex items-center gap-1 hover:text-primary transition-colors duration-200"
            >
              {item.icon && <item.icon className="h-4 w-4" />}
              {item.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
