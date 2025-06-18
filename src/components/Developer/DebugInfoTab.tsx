
import React from 'react';
import { DEVELOPMENT_CONFIG } from '@/config/development';

export const DebugInfoTab: React.FC = () => {
  // Função helper para acessar deviceMemory de forma segura
  const getDeviceMemory = () => {
    const nav = navigator as any;
    return nav.deviceMemory || 'N/A';
  };

  // Função helper para acessar connection de forma segura
  const getConnectionType = () => {
    const nav = navigator as any;
    return nav.connection?.effectiveType || 'N/A';
  };

  return (
    <div className="overflow-visible max-h-none p-4">
      <div className="text-sm text-gray-600 space-y-2">
        <p className="font-semibold">🐛 Informações de Debug:</p>
        <div className="space-y-1 pl-2">
          <p>• Environment: {import.meta.env.MODE}</p>
          <p>• Logging: {DEVELOPMENT_CONFIG.VERBOSE_LOGGING ? '✅' : '❌'}</p>
          <p>• XAI Insights: {DEVELOPMENT_CONFIG.ENABLE_XAI_INSIGHTS ? '✅' : '❌'}</p>
          <p>• Performance Monitor: {DEVELOPMENT_CONFIG.ENABLE_DEV_PERFORMANCE_MONITOR ? '✅' : '❌'}</p>
          <p>• Dev Mode: {import.meta.env.DEV ? '✅' : '❌'}</p>
          <p>• URL atual: {window.location.pathname}</p>
          <p>• Build Time: {new Date().toLocaleString()}</p>
          <p>• Hot Reload: {import.meta.env.DEV ? '✅ Ativo' : '❌ Inativo'}</p>
          <p>• Source Maps: {import.meta.env.DEV ? '✅ Disponível' : '❌ Não disponível'}</p>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="font-semibold">⚡ Performance:</p>
          <div className="space-y-1 pl-2 text-xs">
            <p>• Memory Usage: {getDeviceMemory()} GB</p>
            <p>• Connection: {getConnectionType()}</p>
            <p>• User Agent: {navigator.userAgent.substring(0, 50)}...</p>
            <p>• Screen: {window.screen.width}x{window.screen.height}</p>
            <p>• Viewport: {window.innerWidth}x{window.innerHeight}</p>
            <p>• React: Strict Mode Ativo</p>
            <p>• TypeScript: Verificação ativa</p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="font-semibold">🔧 Variáveis de Ambiente:</p>
          <div className="space-y-1 pl-2 text-xs">
            <p>• VITE_ENABLE_XAI: {import.meta.env.VITE_ENABLE_XAI || 'false'}</p>
            <p>• VITE_DEBUG_MODE: {import.meta.env.VITE_DEBUG_MODE || 'false'}</p>
            <p>• Mode: {import.meta.env.MODE}</p>
            <p>• DEV: {import.meta.env.DEV ? 'true' : 'false'}</p>
            <p>• PWA Support: ✅ Configurado</p>
          </div>
        </div>
      </div>
    </div>
  );
};
