
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  Menu, 
  Phone, 
  MapPin,
  Clock,
  X
} from 'lucide-react';

const InstitutionalHeader: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleCTAClick = () => {
    // Redirect to PWA app scheduling
    window.open('/schedule', '_blank');
  };

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/5535998695479', '_blank');
  };

  const navigationItems = [
    { label: 'Início', href: '/' },
    { label: 'Sobre Nós', href: '/about' },
    { label: 'Tratamentos', href: '/services' },
    { label: 'Unidades', href: '/locations' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contato', href: '/contact' }
  ];

  return (
    <>
      {/* Top Bar */}
      <div className="bg-blue-800 text-white py-2">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>(35) 99891-3803</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Seg-Sex: 8h-19h | Sáb: 8h-13h</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>5 Unidades em MG e SP</span>
              </div>
            </div>
            <Button 
              size="sm" 
              variant="secondary"
              onClick={handleWhatsAppClick}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Phone className="h-4 w-4 mr-2" />
              WhatsApp
            </Button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-xl">
                😁
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Senhor Sorriso</h1>
                <p className="text-xs text-gray-500">Clínica Odontológica</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navigationItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Button 
                variant="outline"
                onClick={handleWhatsAppClick}
              >
                Falar no WhatsApp
              </Button>
              <Button 
                onClick={handleCTAClick}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Agendar Avaliação
              </Button>
            </div>

            {/* Mobile Menu */}
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      😁
                    </div>
                    <span className="font-bold">Senhor Sorriso</span>
                  </div>
                </div>

                <nav className="space-y-4 mb-8">
                  {navigationItems.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </a>
                  ))}
                </nav>

                <div className="space-y-3">
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={() => {
                      handleCTAClick();
                      setIsMenuOpen(false);
                    }}
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Agendar Avaliação
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      handleWhatsAppClick();
                      setIsMenuOpen(false);
                    }}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    WhatsApp
                  </Button>
                </div>

                <div className="mt-8 pt-8 border-t">
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>(35) 99891-3803</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>Seg-Sex: 8h-19h</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>5 Unidades em MG e SP</span>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  );
};

export default InstitutionalHeader;
