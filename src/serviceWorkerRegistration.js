

export const register = () => {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
          navigator.serviceWorker.getRegistrations().then(function(registrations) {
            if (registrations.length === 0) {
              // Регистрируем Service Worker только если его еще нет
              navigator.serviceWorker.register('/service-worker.js').then(function(registration) {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
              }, function(err) {
                console.log('ServiceWorker registration failed: ', err);
              });
            } else {
              console.log('ServiceWorker already registered.');
            }
          });
        });
      }
}