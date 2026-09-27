/* ============================================================
   NutriKids — Service Worker do SHELL (GitHub Pages)
   ------------------------------------------------------------
   Este SW cuida apenas do "invólucro" do app (index.html,
   manifest.json e ícones), que é o que realmente precisa
   satisfazer os requisitos de instalabilidade do navegador.
   O conteúdo do NutriKids em si (que vive no domínio do
   Google Apps Script, dentro do <iframe>) é cross-origin e
   segue suas próprias regras — o Apps Script já responde com
   cache adequado para aquele conteúdo.
   ============================================================ */

const CACHE_NAME = 'nutrikids-shell-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    ).then(() => self.clients.claim())
  );
});

/* Cache-first apenas para os arquivos do próprio shell (mesmo origin).
   Requisições para o Apps Script (cross-origin, dentro do iframe)
   passam direto pela rede, sem interferência deste SW. */
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((resp) => {
        const copy = resp.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return resp;
      }).catch(() => cached);
    })
  );
});
