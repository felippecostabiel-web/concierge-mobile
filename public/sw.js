// Service Worker — Concierge Mobile
// Passthrough: sem cache de rede, apenas habilita instalação como PWA

self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()))
self.addEventListener('fetch', (e) => e.respondWith(fetch(e.request)))
