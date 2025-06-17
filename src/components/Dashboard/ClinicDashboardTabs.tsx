
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, TrendingUp, Calendar, MessageSquare, Settings } from 'lucide-react';

interface ClinicDashboardTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const tabOptions = [
  { value: 'overview', label: 'Visão Geral', icon: Eye },
  { value: 'analytics', label: 'Analytics', icon: TrendingUp },
  { value: 'appointments', label: 'Agendamentos', icon: Calendar },
  { value: 'messages', label: 'Mensagens', icon: MessageSquare },
  { value: 'advanced', label: 'Avançado', icon: Settings }
];

export const ClinicDashboardTabs: React.FC<ClinicDashboardTabsProps> = ({
  activeTab,
  setActiveTab
}) => {
  return (
    <div className="w-full">
      {/* Mobile Dropdown */}
      <div className="block md:hidden mb-4">
        <Select value={activeTab} onValueChange={setActiveTab}>
          <SelectTrigger className="w-full max-w-sm mx-auto">
            <SelectValue placeholder="Selecione uma seção" />
          </SelectTrigger>
          <SelectContent className="z-50 bg-white border shadow-lg">
            {tabOptions.map((option) => {
              const Icon = option.icon;
              return (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {option.label}
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      {/* Desktop Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="hidden md:block w-full">
        <div className="w-full flex justify-center mb-6">
          <TabsList className="inline-flex h-12 items-center justify-center rounded-lg bg-gray-100 p-1 text-muted-foreground">
            {tabOptions.map((option) => {
              const Icon = option.icon;
              return (
                <TabsTrigger 
                  key={option.value}
                  value={option.value} 
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm gap-2"
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden lg:inline">{option.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>
      </Tabs>
    </div>
  );
};
