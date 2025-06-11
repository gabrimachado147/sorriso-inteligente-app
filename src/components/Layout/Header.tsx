
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bell, Menu, User, ArrowLeft, Search, LogOut, Settings, Calendar, AlertTriangle, MapPin, MessageCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { toastInfo, toastSuccess, toastError } from '@/components/ui/custom-toast';
import { AuthService } from '@/services/auth';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [notificationCount, setNotificationCount] = useState(3);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  // Não mostrar botão voltar na página inicial
  const showBackButton = location.pathname !== '/';

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1); // Volta para a página anterior
    } else {
      navigate('/'); // Se não há histórico, vai para home
    }
  };

  const handleNotificationClick = () => {
    setNotificationCount(0);
    toastInfo('Notificações', 'Você possui consultas pendentes de confirmação');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleLogout = async () => {
    try {
      const response = await AuthService.logout();
      if (response.success) {
        toastSuccess('Logout', 'Logout realizado com sucesso!');
        navigate('/');
      } else {
        toastError('Erro', response.error || 'Erro ao fazer logout');
      }
    } catch (error) {
      toastError('Erro', 'Erro ao fazer logout');
    }
  };

  const handleMenuClick = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Implementar lógica de pesquisa
      const query = searchQuery.toLowerCase();
      if (query.includes('agendar') || query.includes('consulta')) {
        navigate('/schedule');
        toastSuccess('Pesquisa', 'Redirecionando para agendamentos');
      } else if (query.includes('clínica') || query.includes('unidade')) {
        navigate('/clinics');
        toastSuccess('Pesquisa', 'Redirecionando para clínicas');
      } else if (query.includes('emergência') || query.includes('urgência')) {
        navigate('/emergency');
        toastSuccess('Pesquisa', 'Redirecionando para emergência');
      } else if (query.includes('chat') || query.includes('conversar')) {
        navigate('/chat');
        toastSuccess('Pesquisa', 'Redirecionando para chat');
      } else {
        navigate('/chat');
        toastInfo('Pesquisa', `Perguntando ao assistente: "${searchQuery}"`);
      }
      setSearchQuery('');
      setShowSearch(false);
    }
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (showSearch) {
      setSearchQuery('');
    }
  };

  return (
    <header className="bg-white shadow-sm border-b px-4 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-3 flex-1">
        {showBackButton && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="mr-2"
            aria-label="Voltar"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={handleMenuClick}
          aria-label="Menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">SI</span>
          </div>
          <span className="font-semibold text-lg text-primary hidden sm:block">Sorriso Inteligente</span>
        </div>
        
        {/* Campo de Pesquisa */}
        {showSearch ? (
          <form onSubmit={handleSearch} className="flex-1 max-w-md mx-4">
            <Input
              type="text"
              placeholder="Pesquisar agendamentos, clínicas, serviços..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
              autoFocus
            />
          </form>
        ) : (
          <div className="flex-1" />
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        {/* Botão de Pesquisa */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSearch}
          className="hidden sm:flex"
          aria-label="Pesquisar"
        >
          <Search className="h-5 w-5" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative" aria-label="Notificações">
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <Badge
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {notificationCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuItem onClick={handleNotificationClick}>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">Consulta confirmada</p>
                <p className="text-xs text-muted-foreground">
                  Sua consulta para amanhã às 14h foi confirmada
                </p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleNotificationClick}>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">Lembrete de consulta</p>
                <p className="text-xs text-muted-foreground">
                  Não esqueça da sua consulta hoje às 10h
                </p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleNotificationClick}>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">Resultado do exame</p>
                <p className="text-xs text-muted-foreground">
                  Seus resultados estão prontos para consulta
                </p>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Opções do usuário">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleProfileClick}>
              <User className="mr-2 h-4 w-4" />
              Meu Perfil
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/schedule')}>
              <Calendar className="mr-2 h-4 w-4" />
              Minhas Consultas
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/emergency')}>
              <AlertTriangle className="mr-2 h-4 w-4" />
              Emergência
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/pwa-settings')}>
              <Settings className="mr-2 h-4 w-4" />
              Configurações
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Mobile Sidebar */}
      {showMobileMenu && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden" onClick={() => setShowMobileMenu(false)}>
          <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-lg p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">SI</span>
                </div>
                <span className="font-semibold text-lg text-primary">Sorriso Inteligente</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowMobileMenu(false)} aria-label="Fechar menu">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </div>
            
            <nav className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  navigate('/');
                  setShowMobileMenu(false);
                }}
              >
                <User className="mr-2 h-4 w-4" />
                Início
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  navigate('/schedule');
                  setShowMobileMenu(false);
                }}
              >
                <Calendar className="mr-2 h-4 w-4" />
                Agendamentos
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  navigate('/clinics');
                  setShowMobileMenu(false);
                }}
              >
                <MapPin className="mr-2 h-4 w-4" />
                Clínicas
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  navigate('/chat');
                  setShowMobileMenu(false);
                }}
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Chat
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  navigate('/emergency');
                  setShowMobileMenu(false);
                }}
              >
                <AlertTriangle className="mr-2 h-4 w-4" />
                Emergência
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  navigate('/profile');
                  setShowMobileMenu(false);
                }}
              >
                <User className="mr-2 h-4 w-4" />
                Perfil
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  navigate('/pwa-settings');
                  setShowMobileMenu(false);
                }}
              >
                <Settings className="mr-2 h-4 w-4" />
                Configurações
              </Button>
              
              <div className="pt-4 border-t">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-600"
                  onClick={() => {
                    handleLogout();
                    setShowMobileMenu(false);
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </Button>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};
