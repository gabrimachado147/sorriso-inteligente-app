
import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  Facebook,
  Instagram,
  Youtube,
  ArrowRight
} from 'lucide-react';

const InstitutionalFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const clinics = [
    {
      city: "Campo Belo - MG",
      address: "Av. Afonso Pena, 151, Centro",
      phone: "(35) 99891-3803"
    },
    {
      city: "Formiga - MG", 
      address: "R. Barão de Piumhy, 198, Centro",
      phone: "(37) 3443-0520"
    },
    {
      city: "Itararé - SP",
      address: "R. São Pedro, 1348, Centro", 
      phone: "(15) 99862-0028"
    },
    {
      city: "Capão Bonito - SP",
      address: "R. Floriano Peixoto, 732, Centro",
      phone: "(15) 2153-0549"
    },
    {
      city: "Itapeva - SP",
      address: "R. Doutor Pinheiro, 558, Centro",
      phone: "(15) 2153-0549"
    }
  ];

  const services = [
    "Implantodontia",
    "Ortodontia", 
    "Limpeza Dental",
    "Clareamento",
    "Prótese Dentária",
    "Endodontia",
    "Periodontia",
    "Cirurgia Oral"
  ];

  const quickLinks = [
    { label: "Sobre Nós", href: "/about" },
    { label: "Tratamentos", href: "/services" },
    { label: "Unidades", href: "/locations" },
    { label: "Blog", href: "/blog" },
    { label: "Contato", href: "/contact" },
    { label: "Política de Privacidade", href: "/privacy" },
    { label: "Termos de Uso", href: "/terms" }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="bg-blue-600 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4">
              Receba Dicas de Saúde Bucal
            </h3>
            <p className="text-blue-100 mb-6">
              Cadastre-se e receba conteúdos exclusivos sobre cuidados dentários
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Seu melhor e-mail"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900"
              />
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6">
                Cadastrar
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-4 gap-12">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-2xl">
                  😁
                </div>
                <div>
                  <h3 className="text-xl font-bold">Senhor Sorriso</h3>
                  <p className="text-gray-400 text-sm">Clínica Odontológica</p>
                </div>
              </div>
              <p className="text-gray-400 mb-6">
                Transformando sorrisos há mais de 10 anos com tecnologia de ponta 
                e atendimento humanizado.
              </p>
              
              {/* Social Media */}
              <div className="flex gap-4">
                <Button variant="ghost" size="icon" className="hover:bg-blue-600">
                  <Facebook className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="hover:bg-pink-600">
                  <Instagram className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="hover:bg-red-600">
                  <Youtube className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Links Rápidos</h4>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.label}>
                    <a 
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Nossos Tratamentos</h4>
              <ul className="space-y-3">
                {services.map((service) => (
                  <li key={service}>
                    <a 
                      href="/services"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {service}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold mb-6">Contato</h4>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-blue-400 mt-1" />
                  <div>
                    <p className="text-white font-medium">Central de Atendimento</p>
                    <p className="text-gray-400">(35) 99891-3803</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-blue-400 mt-1" />
                  <div>
                    <p className="text-white font-medium">E-mail</p>
                    <p className="text-gray-400">contato@senhorsorriso.com.br</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-blue-400 mt-1" />
                  <div>
                    <p className="text-white font-medium">Horário de Funcionamento</p>
                    <p className="text-gray-400">Seg-Sex: 8h às 19h</p>
                    <p className="text-gray-400">Sábado: 8h às 13h</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Clinics Section */}
      <div className="border-t border-gray-800 py-12">
        <div className="container mx-auto px-4">
          <h4 className="text-lg font-semibold mb-8 text-center">Nossas Unidades</h4>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clinics.map((clinic, index) => (
              <div key={index} className="bg-gray-800 p-4 rounded-lg">
                <h5 className="font-semibold text-blue-400 mb-2">{clinic.city}</h5>
                <div className="space-y-2 text-sm text-gray-400">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5" />
                    <span>{clinic.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>{clinic.phone}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <Separator className="bg-gray-800" />
      <div className="py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} Senhor Sorriso Clínica Odontológica. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-6 mt-4 md:mt-0 text-sm text-gray-400">
              <span>CNPJ: 00.000.000/0001-00</span>
              <span>CRO-MG: 0000</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default InstitutionalFooter;
