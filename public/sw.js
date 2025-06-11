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
  console.log('[SW] Background sync triggered:', event.tag);
  
  if (event.tag === 'background-sync-appointments') {
    console.log('[SW] Background sync: appointments');
    event.waitUntil(syncAppointments());
  } else if (event.tag === 'background-sync-chat') {
    console.log('[SW] Background sync: chat messages');
    event.waitUntil(syncChatMessages());
  }
});

// Tratamento de mensagens do cliente
self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
    return;
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
    return;
  }
  
  if (event.data && event.data.type === 'SYNC_APPOINTMENTS') {
    syncAppointments().then(() => {
      event.ports[0].postMessage({ success: true });
    }).catch(error => {
      event.ports[0].postMessage({ success: false, error: error.message });
    });
    return;
  }
});

async function syncAppointments() {
  try {
    console.log('[SW] Starting appointment sync...');
    
    // Buscar dados offline do IndexedDB ou localStorage
    const offlineData = await getOfflineData('appointments');
    
    if (!offlineData || offlineData.length === 0) {
      console.log('[SW] No offline appointments to sync');
      return;
    }
    
    // Sincronizar cada agendamento
    for (const appointment of offlineData) {
      try {
        await syncSingleAppointment(appointment);
        await removeOfflineData('appointments', appointment.id);
        console.log('[SW] Synced appointment:', appointment.id);
      } catch (error) {
        console.error('[SW] Failed to sync appointment:', appointment.id, error);
        throw error; // Re-throw para tentar novamente
      }
    }
    
    // Notificar cliente sobre sincronização bem-sucedida
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'SYNC_COMPLETE',
        data: { type: 'appointments', count: offlineData.length }
      });
    });
    
    console.log('[SW] Appointment sync completed');
  } catch (error) {
    console.error('[SW] Appointment sync failed:', error);
    throw error;
  }
}

async function syncChatMessages() {
  try {
    console.log('[SW] Starting chat sync...');
    
    const offlineMessages = await getOfflineData('chat_messages');
    
    if (!offlineMessages || offlineMessages.length === 0) {
      console.log('[SW] No offline messages to sync');
      return;
    }
    
    for (const message of offlineMessages) {
      try {
        await syncSingleMessage(message);
        await removeOfflineData('chat_messages', message.id);
        console.log('[SW] Synced message:', message.id);
      } catch (error) {
        console.error('[SW] Failed to sync message:', message.id, error);
        throw error;
      }
    }
    
    console.log('[SW] Chat sync completed');
  } catch (error) {
    console.error('[SW] Chat sync failed:', error);
    throw error;
  }
}

async function syncSingleAppointment(appointment) {
  const response = await fetch('/api/appointments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${appointment.token || ''}`
    },
    body: JSON.stringify(appointment.data)
  });
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  
  return response.json();
}

async function syncSingleMessage(message) {
  const response = await fetch('/api/chat/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${message.token || ''}`
    },
    body: JSON.stringify(message.data)
  });
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  
  return response.json();
}

// Funções auxiliares para dados offline (usando IndexedDB via helper)
async function getOfflineData(storeName) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('SorrisoInteligenteDB', 1);
    
    request.onerror = () => reject(request.error);
    
    request.onsuccess = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(storeName)) {
        resolve([]);
        return;
      }
      
      const transaction = db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const getAllRequest = store.getAll();
      
      getAllRequest.onsuccess = () => resolve(getAllRequest.result);
      getAllRequest.onerror = () => reject(getAllRequest.error);
    };
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: 'id' });
      }
    };
  });
}

async function removeOfflineData(storeName, id) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('SorrisoInteligenteDB', 1);
    
    request.onerror = () => reject(request.error);
    
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const deleteRequest = store.delete(id);
      
      deleteRequest.onsuccess = () => resolve();
      deleteRequest.onerror = () => reject(deleteRequest.error);
    };
  });
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
