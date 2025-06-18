
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EnhancedCTAProps {
  title: string;
  description: string;
  buttonText: string;
  onClick: () => void;
  icon?: LucideIcon;
  variant?: 'primary' | 'secondary';
  badge?: string;
  className?: string;
}

export const EnhancedCTA: React.FC<EnhancedCTAProps> = ({
  title,
  description,
  buttonText,
  onClick,
  icon: Icon,
  variant = 'primary',
  badge,
  className
}) => {
  const variantStyles = {
    primary: 'bg-gradient-to-br from-primary/10 via-blue-50 to-purple-50 border-primary/20',
    secondary: 'bg-gradient-to-br from-gray-50 to-white border-gray-200'
  };

  return (
    <Card className={cn('border-0 shadow-xl', variantStyles[variant], className)}>
      <CardContent className="p-8 text-center">
        {badge && (
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/30">
            {badge}
          </Badge>
        )}
        
        {Icon && (
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Icon className="h-8 w-8 text-white" />
          </div>
        )}
        
        <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">{description}</p>
        
        <Button 
          onClick={onClick}
          size="lg"
          className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );
};
