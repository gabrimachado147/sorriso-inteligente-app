
import React from 'react';
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from '@/components/ui/breadcrumb';
import { Home, Code } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DeveloperBreadcrumbs: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Breadcrumb className="mb-6">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors"
          >
            <Home className="h-4 w-4" />
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage className="flex items-center gap-2 font-semibold">
            <Code className="h-4 w-4" />
            Developer Tools
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};
