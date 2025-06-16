
import React from 'react';
import HomePage from '@/components/Dashboard/HomePage';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  const handleStaffAccess = () => {
    navigate('/staff-login');
  };

  return (
    <div className="min-h-screen bg-background w-full">
      {/* Botão de acesso para funcionários */}
      <div className="fixed top-4 right-4 z-50">
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleStaffAccess}
          className="bg-white/90 backdrop-blur-sm border-primary/20 hover:bg-primary/10"
        >
          <Shield className="h-4 w-4 mr-2" />
          Acesso Funcionários
        </Button>
      </div>
      
      <div className="w-full">
        <HomePage />
      </div>
    </div>
  );
};

export default Index;
