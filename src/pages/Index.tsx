
import { HomePage } from "@/components/Dashboard/HomePage";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const handleNavigate = (page: string) => {
    const routes = {
      'home': '/',
      'appointments': '/schedule',
      'locations': '/clinics',
      'chat': '/chat',
      'profile': '/profile',
      'emergency': '/emergency'
    };
    navigate(routes[page as keyof typeof routes] || '/');
  };

  return <HomePage onNavigate={handleNavigate} />;
};

export default Index;
