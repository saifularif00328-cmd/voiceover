// Service worker Asisten Motion Graphic by Saiful Arif
// - Aplikasi (shell) disimpan di cache sehingga bisa dibuka offline.
// - Halaman: jaringan dulu (selalu dapat versi terbaru saat online), cache saat offline.
// - Font dan pustaka MP3 dari CDN: cache otomatis setelah dipakai pertama kali.
// - Panggilan API (Gemini, Pexels, dst.) tidak pernah disentuh.
// Naikkan VERSION setiap kali file aplikasi berubah.
var VERSION = '2026-11-16.2';
var SHELL = 'vos-shell-' + VERSION, RUNTIME = 'vos-runtime-v1';
var SHELL_FILES = ['./', './index.html', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png', './icons/icon-maskable-512.png', './icons/apple-touch-icon.png', './icons/favicon.png'];
var CDN_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com', 'cdnjs.cloudflare.com'];

self.addEventListener('install', function(e){
  e.waitUntil(caches.open(SHELL).then(function(c){
    return Promise.all(SHELL_FILES.map(function(u){ return c.add(new Request(u, { cache: 'reload' })).catch(function(){}); }));
  }));
});
self.addEventListener('activate', function(e){
  e.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.filter(function(k){ return k !== SHELL && k !== RUNTIME; }).map(function(k){ return caches.delete(k); }));
  }).then(function(){ return self.clients.claim(); }));
});
self.addEventListener('message', function(e){ if (e.data === 'SKIP_WAITING') self.skipWaiting(); });

function swr(req, cacheName){
  return caches.open(cacheName).then(function(c){
    return c.match(req, { ignoreSearch: true }).then(function(hit){
      var net = fetch(req).then(function(r){ if (r && (r.ok || r.type === 'opaque')) c.put(req, r.clone()); return r; }).catch(function(){ return hit; });
      return hit || net;
    });
  });
}
self.addEventListener('fetch', function(e){
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  if (url.origin !== self.location.origin) {
    if (CDN_HOSTS.indexOf(url.hostname) >= 0) e.respondWith(swr(req, RUNTIME));
    return;
  }
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then(function(r){
      if (r && r.ok) { var copy = r.clone(); caches.open(SHELL).then(function(c){ c.put('./index.html', copy); }); }
      return r;
    }).catch(function(){
      return caches.match('./index.html', { ignoreSearch: true }).then(function(hit){ return hit || caches.match('./'); });
    }));
    return;
  }
  e.respondWith(swr(req, SHELL));
});
