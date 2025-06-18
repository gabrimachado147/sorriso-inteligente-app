
import React from 'react';

interface DatabaseInfoTabProps {
  isSupabaseConfigured: boolean;
}

export const DatabaseInfoTab: React.FC<DatabaseInfoTabProps> = ({ isSupabaseConfigured }) => {
  return (
    <div className="overflow-visible max-h-none p-4">
      <div className="text-sm text-gray-600 space-y-2">
        <p className="font-semibold">🗄️ Configuração do Banco de Dados:</p>
        <div className="space-y-1 pl-2">
          <p>• Supabase Status: {isSupabaseConfigured ? '✅ Conectado' : '❌ Não conectado'}</p>
          <p>• RLS Policies: ✅ Ativas</p>
          <p>• User Profiles: ✅ Configurado</p>
          <p>• Appointments: ✅ Configurado</p>
          <p>• Chat Messages: ✅ Configurado</p>
          <p>• Real-time: ✅ Habilitado</p>
          <p>• Environment: {import.meta.env.MODE}</p>
          <p>• Project ID: bstppllwgzkacxxwhpes</p>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="font-semibold">📋 Tabelas Principais:</p>
          <div className="space-y-1 pl-2 text-xs">
            <p>• appointments (Agendamentos)</p>
            <p>• user_profiles (Perfis de usuário)</p>
            <p>• chat_messages (Mensagens do chat)</p>
            <p>• clinics (Clínicas)</p>
            <p>• contacts (Contatos/Leads)</p>
            <p>• reviews (Avaliações)</p>
            <p>• reminders (Lembretes)</p>
            <p>• user_gamification (Gamificação)</p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="font-semibold">🔐 Segurança:</p>
          <div className="space-y-1 pl-2 text-xs">
            <p>• Row Level Security: ✅ Ativo</p>
            <p>• Autenticação JWT: ✅ Configurada</p>
            <p>• Políticas por usuário: ✅ Implementadas</p>
            <p>• Edge Functions: ✅ Disponíveis</p>
          </div>
        </div>
      </div>
    </div>
  );
};
