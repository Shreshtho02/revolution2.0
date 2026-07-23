var CACHE = "revolution-v4";
var URLS = [
  "/revolution2.0/",
  "/revolution2.0/styles.css",
  "/revolution2.0/script.js",
  "/revolution2.0/supabase-config.js",
  "/revolution2.0/invoice.html",
  "/revolution2.0/assets/assets.js"
];
self.addEventListener("install", function(e) {
  e.waitUntil(caches.open(CACHE).then(function(c) { return c.addAll(URLS); }));
  self.skipWaiting();
});
self.addEventListener("activate", function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE; }).map(function(k) { return caches.delete(k); })
      );
    }).then(function() { return clients.claim(); })
  );
});
self.addEventListener("fetch", function(e) {
  e.respondWith(
    caches.match(e.request).then(function(r) { return r || fetch(e.request); })
  );
});