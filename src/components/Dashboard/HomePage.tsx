import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppointments } from '@/hooks/useAppointments';
import { useRealtimeAppointments } from '@/hooks/useRealtimeAppointments';
import { EnhancedSkeleton } from '@/components/ui/enhanced-skeleton';
import { animations } from '@/lib/animations';
import { AppointmentsSection } from './AppointmentsSection';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { appointments, isLoading } = useAppointments();
  const { realtimeConnected } = useRealtimeAppointments();

  // Simulate filtering for the home page (e.g., upcoming appointments)
  const filteredAppointments = appointments.filter(apt => new Date(apt.date).getTime() >= Date.now());

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <EnhancedSkeleton variant="card" count={3} />
      </div>
    );
  }

  return (
    <div className={`container mx-auto p-6 space-y-6 ${animations.pageEnter}`}>
      {/* Hero Section */}
      <section className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Bem-vindo ao Painel</h1>
        <p className="text-gray-600">Visualize seus próximos agendamentos e gerencie sua clínica.</p>
      </section>

      {/* Appointments Overview */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Próximos Agendamentos</h2>
          <button 
            onClick={() => navigate('/appointments')}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Ver todos →
          </button>
        </div>
        <AppointmentsSection 
          appointments={filteredAppointments.slice(0, 5)}
          selectedClinic="all"
          realtimeConnected={realtimeConnected}
          onReschedule={() => navigate('/appointments')}
          onViewAllAppointments={() => navigate('/appointments')}
        />
      </section>

      {/* Quick Actions */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer" onClick={() => navigate('/appointments')}>
            <h3 className="text-lg font-semibold text-gray-800">Agendar Consulta</h3>
            <p className="text-gray-600">Marque uma nova consulta para um paciente.</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer" onClick={() => navigate('/appointments')}>
            <h3 className="text-lg font-semibold text-gray-800">Verificar Agenda</h3>
            <p className="text-gray-600">Visualize e gerencie sua agenda diária.</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer" onClick={() => navigate('/admin')}>
            <h3 className="text-lg font-semibold text-gray-800">Painel Administrativo</h3>
            <p className="text-gray-600">Acesse as configurações e relatórios da clínica.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-gray-500 mt-8">
        <p>© {new Date().getFullYear()} Senhor Sorriso. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default HomePage;
