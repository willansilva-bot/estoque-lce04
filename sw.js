/*
 * Service worker do atalho Estoque LCE-04 (GitHub Pages).
 * Guarda SOMENTE os arquivos estáticos desta página (HTML, manifest, ícones).
 * Nunca intercepta nem guarda nada de outro domínio (script.google.com, Google
 * Sheets, login Google): o estoque, os usuários e as permissões vêm sempre do
 * servidor. Para publicar uma mudança, aumente VERSAO.
 */
var VERSAO = 'lce04-atalho-v2';
var ARQUIVOS = ['./', 'manifest.webmanifest', 'icone-192.png', 'icone-512.png', 'icone-maskable-512.png',
  'apple-touch-icon-180.png', 'favicon-32.png', 'favicon-16.png'];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(VERSAO).then(function (c) { return c.addAll(ARQUIVOS); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (nomes) {
    return Promise.all(nomes.filter(function (n) { return n.indexOf('lce04-atalho-') === 0 && n !== VERSAO; })
      .map(function (n) { return caches.delete(n); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  if (url.origin !== self.location.origin || url.pathname.indexOf(new URL('./', self.registration.scope).pathname) !== 0) return; // outro site: não mexe
  if (req.mode === 'navigate') {
    // Página: rede primeiro (sempre a versão nova); sem rede, a cópia guardada (que mostra "sem conexão").
    e.respondWith(fetch(req).catch(function () {
      return caches.open(VERSAO).then(function (c) { return c.match('./'); });
    }));
    return;
  }
  // Ícones e manifest: cópia guardada, senão rede.
  e.respondWith(caches.open(VERSAO).then(function (c) {
    return c.match(req, { ignoreSearch: true }).then(function (r) { return r || fetch(req); });
  }));
});
