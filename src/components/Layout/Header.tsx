
import React from 'react';
import { Bell, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="flex items-center justify-between p-4 max-w-7xl mx-auto">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center overflow-hidden bg-primary/10">
              <img 
                src="/lovable-uploads/a077d15e-e6ba-4de3-833a-6913d8203ffd.png" 
                alt="Senhor Sorriso" 
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-primary">Senhor Sorriso</h1>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              2
            </span>
          </Button>
        </div>
      </div>
    </header>
  );
};
