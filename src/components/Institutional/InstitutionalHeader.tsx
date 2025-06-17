
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Phone, Mail } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

export const InstitutionalHeader: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navItems = [
    { label: 'Início', href: '/institutional' },
    { label: 'Sobre', href: '/institutional/about' },
    { label: 'Serviços', href: '/institutional/services' },
    { label: 'Unidades', href: '/institutional/locations' },
    { label: 'Contato', href: '/institutional/contact' }
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 w-full shadow-sm">
      <div className="mobile-container">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/institutional" className="flex items-center space-x-3 mobile-focus">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden bg-primary/10">
              <img 
                src="/lovable-uploads/a077d15e-e6ba-4de3-833a-6913d8203ffd.png" 
                alt="Senhor Sorriso" 
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-xl font-bold text-primary mobile-text-lg">Senhor Sorriso</h1>
          </Link>

          {/* Desktop Navigation */}
          {!isMobile && (
            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="text-gray-700 hover:text-primary mobile-transition mobile-focus font-medium"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          )}

          {/* Contact Info - Desktop */}
          {!isMobile && (
            <div className="hidden lg:flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>(11) 99999-9999</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>contato@senhorrsorriso.com</span>
              </div>
            </div>
          )}

          {/* CTA Button - Desktop */}
          {!isMobile && (
            <Button asChild className="hidden md:flex">
              <Link to="/">Acessar App</Link>
            </Button>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              className="mobile-touch-target"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          )}
        </div>

        {/* Mobile Navigation */}
        {isMobile && isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 space-y-4 bg-white">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="block py-3 px-4 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg mobile-transition mobile-touch-target font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            
            <div className="border-t border-gray-200 pt-4 space-y-3">
              <div className="flex items-center space-x-2 px-4 text-sm text-gray-600">
                <Phone className="h-4 w-4" />
                <span>(11) 99999-9999</span>
              </div>
              <div className="flex items-center space-x-2 px-4 text-sm text-gray-600">
                <Mail className="h-4 w-4" />
                <span>contato@senhorrsorriso.com</span>
              </div>
              <div className="px-4 pt-2">
                <Button asChild className="w-full mobile-touch-target">
                  <Link to="/" onClick={() => setIsMenuOpen(false)}>
                    Acessar App
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
