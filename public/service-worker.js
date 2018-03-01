var dataCacheName = 'weatherData-v1';
var cacheName = 'weatherPWA-step-6-1';
var filesToCache = [
  '/',
  '/pwa/work/index.html',
  '/pwa/work/scripts/app.js',
  '/pwa/work/styles/inline.css',
  '/pwa/work/images/clear.png',
  '/pwa/work/images/cloudy-scattered-showers.png',
  '/pwa/work/images/cloudy.png',
  '/pwa/work/images/fog.png',
  '/pwa/work/images/ic_add_white_24px.svg',
  '/pwa/work/images/ic_refresh_white_24px.svg',
  '/pwa/work/images/partly-cloudy.png',
  '/pwa/work/images/rain.png',
  '/pwa/work/images/scattered-showers.png',
  '/pwa/work/images/sleet.png',
  '/pwa/work/images/snow.png',
  '/pwa/work/images/thunderstorm.png',
  '/pwa/work/images/wind.png'

];

self.addEventListener('install', function(e){
    console.log('[ServiceWorker] Install');
    e.waitUntil(
        caches.open(cacheName).then(function(cache)
        {
            console.log('[ServiceWorker] Caching app shell');
            return cache.addAll(filesToCache);
        })
    );
});

self.addEventListener('activate', function(e) {
    console.log('[ServiceWorker] Activate');
    e.waitUntil(
      caches.keys().then(function(keyList) {
        return Promise.all(keyList.map(function(key) {
          if (key !== cacheName && key !== dataCacheName) {
            console.log('[ServiceWorker] Removing old cache', key);
            return caches.delete(key);
          }
        }));
      })
    );
    return self.clients.claim();
});  

self.addEventListener('fetch', function (e) {
   console.log('[ServiceWorker] fetch', e.request.url);
   var dataUrl = 'https://query.yahooapis.com/v1/public/yql';
   if(e.request.url.indexOf(dataUrl) > -1){
    e.respondWith(
        caches.open(dataCacheName).then(function(cache) {
          return fetch(e.request).then(function(response){
            cache.put(e.request.url, response.clone());
            return response;
          });
        })
      );  
   }else{
    e.respondWith(
        caches.match(e.request).then(function (response) {
            return response || fetch(e.request);
        })
    ) 
   }
});