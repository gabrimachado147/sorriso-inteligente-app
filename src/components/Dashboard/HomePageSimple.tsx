import React from 'react';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="text-center bg-blue-500 text-white p-8 rounded-lg">
        <h1 className="text-2xl font-bold mb-2">Bem-vindo à Senhor Sorriso!</h1>
        <p className="mb-4 opacity-90">Seu sorriso perfeito está a um clique de distância</p>
        <button 
          className="bg-white text-blue-500 px-6 py-2 rounded-lg hover:bg-gray-100"
          onClick={() => onNavigate('appointments')}
        >
          Agendar Avaliação Gratuita
        </button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div 
          className="bg-white p-4 rounded-lg shadow hover:shadow-lg cursor-pointer text-center"
          onClick={() => onNavigate('chat')}
        >
          <div className="text-2xl mb-2">💬</div>
          <p className="font-medium">Chat IA</p>
          <p className="text-xs text-gray-500">Tire suas dúvidas</p>
        </div>

        <div 
          className="bg-white p-4 rounded-lg shadow hover:shadow-lg cursor-pointer text-center"
          onClick={() => onNavigate('locations')}
        >
          <div className="text-2xl mb-2">📍</div>
          <p className="font-medium">Unidades</p>
          <p className="text-xs text-gray-500">5 cidades</p>
        </div>

        <div 
          className="bg-white p-4 rounded-lg shadow hover:shadow-lg cursor-pointer text-center"
          onClick={() => onNavigate('appointments')}
        >
          <div className="text-2xl mb-2">📅</div>
          <p className="font-medium">Agendar</p>
          <p className="text-xs text-gray-500">Nova consulta</p>
        </div>

        <div 
          className="bg-white p-4 rounded-lg shadow hover:shadow-lg cursor-pointer text-center"
          onClick={() => onNavigate('emergency')}
        >
          <div className="text-2xl mb-2">🚨</div>
          <p className="font-medium">Urgência</p>
          <p className="text-xs text-gray-500">Atendimento 24h</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-semibold mb-2">Nossas Unidades</h3>
        <div className="space-y-2">
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="font-medium">Campo Belo - MG</p>
            <p className="text-sm text-gray-600">Av. Afonso Pena, 151</p>
            <p className="text-xs text-gray-500">(35) 99869-5479</p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <p className="font-medium">Formiga - MG</p>
            <p className="text-sm text-gray-600">R. Barão de Piumhy, 198</p>
            <p className="text-xs text-gray-500">(35) 9969-5479</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-semibold mb-2">Próximas Consultas</h3>
        <div className="p-3 bg-blue-50 rounded-lg">
          <p className="font-medium">Limpeza Dental</p>
          <p className="text-sm text-gray-600">Campo Belo - Dr. Silva</p>
          <p className="text-xs text-gray-500">15/06/2024 às 14:00</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-semibold mb-2">Nossos Serviços</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { name: 'Avaliação Gratuita', icon: '🔍' },
            { name: 'Limpeza Dental', icon: '🦷' },
            { name: 'Ortodontia', icon: '😬' },
            { name: 'Implantodontia', icon: '🔧' },
            { name: 'Clareamento', icon: '✨' },
            { name: 'Urgência 24h', icon: '🚨' },
          ].map((service) => (
            <div 
              key={service.name} 
              className="bg-gray-50 p-3 rounded-lg text-center hover:bg-gray-100 cursor-pointer"
              onClick={() => onNavigate('appointments')}
            >
              <div className="text-2xl mb-2">{service.icon}</div>
              <p className="text-sm font-medium">{service.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
