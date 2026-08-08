// Service Worker Registration Module for KrishiSync PWA

export function registerServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    const isProduction = import.meta.env.PROD;

    window.addEventListener('load', () => {
      if (isProduction) {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('[PWA] KrishiSync Service Worker registered with scope:', registration.scope);

            registration.onupdatefound = () => {
              const installingWorker = registration.installing;
              if (installingWorker) {
                installingWorker.onstatechange = () => {
                  if (installingWorker.state === 'installed') {
                    if (navigator.serviceWorker.controller) {
                      console.log('[PWA] New version of KrishiSync available. Refresh to update.');
                    } else {
                      console.log('[PWA] KrishiSync App Shell cached for offline use.');
                    }
                  }
                };
              }
            };
          })
          .catch((error) => {
            console.error('[PWA] Service Worker registration failed:', error);
          });
      } else {
        console.log('[PWA] Development mode active: Service Worker registration bypassed to preserve HMR.');
      }
    });
  }
}
