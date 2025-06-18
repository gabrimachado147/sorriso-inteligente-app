
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { InteractiveFeedback } from './interactive-feedback';
import { LucideIcon } from 'lucide-react';

interface EnhancedCTAProps {
  title: string;
  description?: string;
  buttonText: string;
  onClick: () => void;
  icon?: LucideIcon;
  variant?: 'primary' | 'secondary' | 'urgent';
  badge?: string;
  disabled?: boolean;
  loading?: boolean;
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
  disabled = false,
  loading = false,
  className
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-primary to-blue-600 text-white border-0';
      case 'secondary':
        return 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-900 border border-gray-200';
      case 'urgent':
        return 'bg-gradient-to-r from-red-500 to-pink-600 text-white border-0 shadow-lg shadow-red-500/25';
      default:
        return 'bg-gradient-to-r from-primary to-blue-600 text-white border-0';
    }
  };

  const getButtonVariant = () => {
    switch (variant) {
      case 'primary':
        return 'default';
      case 'secondary':
        return 'outline';
      case 'urgent':
        return 'destructive';
      default:
        return 'default';
    }
  };

  return (
    <InteractiveFeedback feedbackType="scale" disabled={disabled || loading}>
      <div className={cn(
        'rounded-xl p-6 text-center transition-all duration-300',
        getVariantStyles(),
        disabled && 'opacity-50',
        className
      )}>
        {badge && (
          <Badge className="mb-3 bg-white/20 text-current border-white/30">
            {badge}
          </Badge>
        )}
        
        {Icon && (
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Icon className="h-6 w-6" />
            </div>
          </div>
        )}
        
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        
        {description && (
          <p className="text-sm opacity-90 mb-4">{description}</p>
        )}
        
        <Button
          onClick={onClick}
          disabled={disabled || loading}
          variant={getButtonVariant()}
          size="lg"
          className={cn(
            'w-full font-semibold shadow-lg',
            variant === 'primary' && 'bg-white text-primary hover:bg-gray-100',
            variant === 'secondary' && 'bg-primary text-white hover:bg-primary/90',
            variant === 'urgent' && 'bg-white text-red-600 hover:bg-gray-100'
          )}
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
              Processando...
            </>
          ) : (
            buttonText
          )}
        </Button>
      </div>
    </InteractiveFeedback>
  );
};
