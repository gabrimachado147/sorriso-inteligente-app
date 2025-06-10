
import React from 'react';
import { HomePage } from '@/components/Dashboard/HomePage';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();
  
  const handleNavigate = (page: string) => {
    navigate(`/${page}`);
  };

  return <HomePage onNavigate={handleNavigate} />;
};

export default Index;
