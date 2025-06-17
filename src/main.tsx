
import { createRoot } from 'react-dom/client'
import App from './App';
import './index.css'

// Importar serviços de produção
import { errorTracker } from '@/services/errorTracking';
import { performanceMonitor } from '@/services/performance';
import { PRODUCTION_CONFIG } from '@/config/production';

// Inicializar monitoramento de performance
console.log('🚀 Inicializando Senhor Sorriso App v2.0');
console.log('📊 Performance monitoring:', PRODUCTION_CONFIG.PERFORMANCE_MONITORING ? 'Ativo' : 'Inativo');
console.log('🔍 Error tracking:', PRODUCTION_CONFIG.ENABLE_ERROR_TRACKING ? 'Ativo' : 'Inativo');

// Registrar Service Worker para PWA
if ('serviceWorker' in navigator && PRODUCTION_CONFIG.PWA_ENABLED) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });
      
      console.log('✅ [PWA] Service Worker registered:', registration.scope);
      
      // Verificar por atualizações
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('🔄 [PWA] New content is available, refresh to update');
              
              // Mostrar notificação de atualização se suportado
              if ('Notification' in window && Notification.permission === 'granted') {
                new Notification('Senhor Sorriso', {
                  body: 'Nova versão disponível! Recarregue a página para atualizar.',
                  icon: '/icons/icon-192x192.png',
                  tag: 'app-update'
                });
              }
            }
          });
        }
      });
      
    } catch (error) {
      console.error('❌ [PWA] Service Worker registration failed:', error);
      errorTracker.reportCustomError('Service Worker registration failed', { error: error.message });
    }
  });
}

// Configurar PWA prompt de instalação
let deferredPrompt: any;
window.addEventListener('beforeinstallprompt', (e) => {
  console.log('💾 [PWA] Install prompt available');
  e.preventDefault();
  deferredPrompt = e;
  
  // Você pode mostrar um botão personalizado de instalação aqui
  // ou salvar o evento para usar mais tarde
});

window.addEventListener('appinstalled', () => {
  console.log('✅ [PWA] App was installed');
  deferredPrompt = null;
  
  // Analytics: app instalado
  if (PRODUCTION_CONFIG.ENABLE_ANALYTICS) {
    performanceMonitor.measureCustom('pwa_install', 0, {
      type: 'app_installed',
      timestamp: new Date().toISOString()
    });
  }
});

// Detectar quando o app é lançado como PWA
if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
  console.log('📱 [PWA] Running as installed app');
}

// Inicializar aplicação
const root = createRoot(document.getElementById("root")!);
root.render(<App />);

// Log de inicialização bem-sucedida
console.log('🎉 Senhor Sorriso App iniciado com sucesso!');
console.log('🌐 Domínio:', window.location.hostname);
console.log('📍 URL:', window.location.href);

// Em produção, remover logs de desenvolvimento
if (import.meta.env.PROD) {
  // Desabilitar logs do console em produção (opcional)
  // console.log = () => {};
  // console.warn = () => {};
}
