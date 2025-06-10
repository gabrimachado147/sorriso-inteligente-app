// Service Worker para PWA - Sorriso Inteligente
const CACHE_NAME = 'sorriso-inteligente-v1.0.0';
const API_CACHE_NAME = 'sorriso-api-cache-v1.0.0';

// Recursos para cache imediato (App Shell)
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// URLs da API para cache
const API_ENDPOINTS = [
  '/api/clinics',
  '/api/services',
  '/api/appointments'
];

// Instalar Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  
  event.waitUntil(
    Promise.all([
      // Cache dos recursos estáticos
      caches.open(CACHE_NAME).then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      // Cache da API
      caches.open(API_CACHE_NAME).then((cache) => {
        console.log('[SW] API cache ready');
        return cache;
      })
    ]).then(() => {
      console.log('[SW] Installation complete');
      self.skipWaiting();
    })
  );
});

// Ativar Service Worker
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  
  event.waitUntil(
    Promise.all([
      // Limpar caches antigos
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== API_CACHE_NAME) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Assumir controle de todas as abas
      self.clients.claim()
    ]).then(() => {
      console.log('[SW] Activation complete');
    })
  );
});

// Interceptar requisições (Fetch)
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Estratégia para diferentes tipos de recursos
  if (request.method === 'GET') {
    // Recursos estáticos - Cache First
    if (isStaticAsset(url)) {
      event.respondWith(cacheFirst(request));
    }
    // API calls - Network First com fallback
    else if (isAPICall(url)) {
      event.respondWith(networkFirstWithCache(request));
    }
    // Páginas - Stale While Revalidate
    else if (isNavigation(request)) {
      event.respondWith(staleWhileRevalidate(request));
    }
    // Outros recursos - Network First
    else {
      event.respondWith(networkFirst(request));
    }
  }
});

// Estratégias de Cache

// Cache First - Para recursos estáticos
async function cacheFirst(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, networkResponse.clone());
    return networkResponse;
  } catch (error) {
    console.log('[SW] Cache first failed:', error);
    return new Response('Offline', { status: 503 });
  }
}

// Network First com Cache - Para API calls
async function networkFirstWithCache(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(API_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', error);
    
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Fallback para dados offline
    return getOfflineFallback(request);
  }
}

// Stale While Revalidate - Para páginas
async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => cachedResponse);
  
  return cachedResponse || fetchPromise;
}

// Network First - Para outros recursos
async function networkFirst(request) {
  try {
    return await fetch(request);
  } catch (error) {
    const cachedResponse = await caches.match(request);
    return cachedResponse || new Response('Offline', { status: 503 });
  }
}

// Helpers

function isStaticAsset(url) {
  return url.pathname.includes('.css') || 
         url.pathname.includes('.js') || 
         url.pathname.includes('.png') || 
         url.pathname.includes('.jpg') || 
         url.pathname.includes('.svg') ||
         url.pathname.includes('/icons/');
}

function isAPICall(url) {
  return url.pathname.startsWith('/api/') ||
         url.hostname !== self.location.hostname;
}

function isNavigation(request) {
  return request.mode === 'navigate' || 
         (request.method === 'GET' && request.headers.get('accept').includes('text/html'));
}

function getOfflineFallback(request) {
  const url = new URL(request.url);
  
  // Fallback para diferentes endpoints
  if (url.pathname.includes('/clinics')) {
    return new Response(JSON.stringify({
      message: 'Dados offline indisponíveis',
      offline: true,
      data: []
    }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    });
  }
  
  return new Response(JSON.stringify({
    message: 'Você está offline',
    offline: true
  }), {
    headers: { 'Content-Type': 'application/json' },
    status: 503
  });
}

// Background Sync para agendamentos offline
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync-appointments') {
    console.log('[SW] Background sync: appointments');
    event.waitUntil(syncAppointments());
  }
});

async function syncAppointments() {
  // Implementar sincronização de agendamentos offline
  try {
    const offlineAppointments = await getOfflineAppointments();
    for (const appointment of offlineAppointments) {
      await syncAppointment(appointment);
    }
  } catch (error) {
    console.log('[SW] Sync failed:', error);
  }
}

// Notificações Push
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.body || 'Nova notificação do Sorriso Inteligente',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [200, 100, 200],
    data: data.data || {},
    actions: [
      {
        action: 'view',
        title: 'Ver Detalhes',
        icon: '/icons/action-view.png'
      },
      {
        action: 'dismiss',
        title: 'Dispensar',
        icon: '/icons/action-dismiss.png'
      }
    ],
    tag: data.tag || 'general',
    requireInteraction: data.urgent || false
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'Sorriso Inteligente', options)
  );
});

// Clique em notificação
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const action = event.action;
  const data = event.notification.data;
  
  if (action === 'view' || !action) {
    event.waitUntil(
      clients.openWindow(data.url || '/')
    );
  }
});

console.log('[SW] Service Worker loaded successfully');
