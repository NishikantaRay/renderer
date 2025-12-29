/**
 * Service Worker for Renderer Portfolio
 * Provides offline support and performance optimization through caching
 */

const CACHE_VERSION = 'renderer-v1.0.0';
const CACHE_NAME = `renderer-cache-${CACHE_VERSION}`;

// Assets to cache immediately on install
const CRITICAL_ASSETS = [
    '/',
    '/index.html',
    '/about.html',
    '/projects.html',
    '/blog.html',
    '/resume.html',
    '/contact.html',
    '/docs.html',
    '/editor.html',
    '/css/critical.css',
    '/css/home.css',
    '/css/projects.css',
    '/css/blog.css',
    '/css/resume.css',
    '/css/contact.css',
    '/css/about.css',
    '/js/toml-loader.js',
    '/js/fast-init.js',
    '/js/lazy-loader.js',
    '/js/performance-monitor.js',
    '/manifest.json',
    '/assets/images/favicon.ico'
];

// Config files to cache
const CONFIG_FILES = [
    '/config/home.toml',
    '/config/projects.toml',
    '/config/blog.toml',
    '/config/resume.toml',
    '/config/social.toml'
];

// Content files to cache
const CONTENT_FILES = [
    '/content/about.md',
    '/content/projects.md',
    '/content/contact.md'
];

// External resources (cache but don't wait for install)
const EXTERNAL_RESOURCES = [
    'https://rsms.me/inter/inter.css',
    'https://cdn.jsdelivr.net/npm/marked@9.1.2/marked.min.js'
];

/**
 * Install Event - Cache critical assets
 */
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] Caching critical assets');
                
                // Cache critical assets
                return cache.addAll(CRITICAL_ASSETS)
                    .then(() => {
                        console.log('[Service Worker] Critical assets cached');
                        
                        // Cache config and content files (don't fail if missing)
                        return Promise.allSettled([
                            ...CONFIG_FILES.map(url => cache.add(url).catch(() => console.log(`[SW] Optional: ${url}`))),
                            ...CONTENT_FILES.map(url => cache.add(url).catch(() => console.log(`[SW] Optional: ${url}`)))
                        ]);
                    });
            })
            .then(() => {
                console.log('[Service Worker] Installation complete');
                return self.skipWaiting(); // Activate immediately
            })
            .catch((error) => {
                console.error('[Service Worker] Installation failed:', error);
            })
    );
});

/**
 * Activate Event - Clean up old caches
 */
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activating...');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME && cacheName.startsWith('renderer-cache-')) {
                            console.log('[Service Worker] Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('[Service Worker] Activation complete');
                return self.clients.claim(); // Take control immediately
            })
    );
});

/**
 * Fetch Event - Serve from cache with network fallback
 * Strategy: Cache First, fallback to Network
 */
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Skip chrome-extension and browser-specific URLs
    if (url.protocol === 'chrome-extension:' || url.protocol === 'moz-extension:') {
        return;
    }
    
    // Choose strategy based on resource type
    if (isStaticAsset(url)) {
        event.respondWith(cacheFirstStrategy(request));
    } else if (isAPIRequest(url)) {
        event.respondWith(networkFirstStrategy(request));
    } else if (isDocument(request)) {
        event.respondWith(networkFirstStrategy(request));
    } else {
        event.respondWith(cacheFirstStrategy(request));
    }
});

/**
 * Cache First Strategy
 * Best for: Static assets, CSS, JS, images
 */
async function cacheFirstStrategy(request) {
    try {
        const cachedResponse = await caches.match(request);
        
        if (cachedResponse) {
            console.log('[Service Worker] Serving from cache:', request.url);
            
            // Update cache in background
            updateCacheInBackground(request);
            
            return cachedResponse;
        }
        
        // Not in cache, fetch from network
        console.log('[Service Worker] Not in cache, fetching:', request.url);
        const networkResponse = await fetch(request);
        
        // Cache the response for future use
        if (networkResponse.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
        
    } catch (error) {
        console.error('[Service Worker] Cache First failed:', error);
        
        // Return offline fallback page if available
        if (isDocument(request)) {
            const offlinePage = await caches.match('/offline.html');
            if (offlinePage) return offlinePage;
        }
        
        // Return a basic offline response
        return new Response('Offline - Content not available', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
                'Content-Type': 'text/plain'
            })
        });
    }
}

/**
 * Network First Strategy
 * Best for: HTML documents, API calls, dynamic content
 */
async function networkFirstStrategy(request) {
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            console.log('[Service Worker] Network response:', request.url);
            
            // Update cache with fresh content
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
        
    } catch (error) {
        console.log('[Service Worker] Network failed, trying cache:', request.url);
        
        const cachedResponse = await caches.match(request);
        
        if (cachedResponse) {
            console.log('[Service Worker] Serving stale content from cache');
            return cachedResponse;
        }
        
        // Return offline fallback
        if (isDocument(request)) {
            const offlinePage = await caches.match('/offline.html');
            if (offlinePage) return offlinePage;
        }
        
        return new Response('Offline - Content not available', {
            status: 503,
            statusText: 'Service Unavailable'
        });
    }
}

/**
 * Update cache in background (Stale-While-Revalidate)
 */
function updateCacheInBackground(request) {
    fetch(request)
        .then((response) => {
            if (response.ok) {
                caches.open(CACHE_NAME)
                    .then((cache) => cache.put(request, response));
            }
        })
        .catch(() => {
            // Silently fail - we already have cached version
        });
}

/**
 * Helper: Check if request is for static asset
 */
function isStaticAsset(url) {
    const staticExtensions = ['.css', '.js', '.jpg', '.jpeg', '.png', '.gif', '.svg', '.woff', '.woff2', '.ttf', '.ico'];
    return staticExtensions.some(ext => url.pathname.endsWith(ext));
}

/**
 * Helper: Check if request is for API
 */
function isAPIRequest(url) {
    return url.pathname.includes('/api/') || url.pathname.endsWith('.json');
}

/**
 * Helper: Check if request is for HTML document
 */
function isDocument(request) {
    return request.destination === 'document' || 
           request.headers.get('Accept')?.includes('text/html');
}

/**
 * Message Handler - Handle messages from main thread
 */
self.addEventListener('message', (event) => {
    const { type, data } = event.data;
    
    switch (type) {
        case 'SKIP_WAITING':
            self.skipWaiting();
            break;
            
        case 'CLAIM_CLIENTS':
            self.clients.claim();
            break;
            
        case 'CACHE_URLS':
            if (data?.urls) {
                cacheUrls(data.urls);
            }
            break;
            
        case 'CLEAR_CACHE':
            clearAllCaches();
            break;
            
        case 'GET_CACHE_SIZE':
            getCacheSize().then(size => {
                event.ports[0].postMessage({ size });
            });
            break;
            
        default:
            console.log('[Service Worker] Unknown message type:', type);
    }
});

/**
 * Cache specific URLs on demand
 */
async function cacheUrls(urls) {
    try {
        const cache = await caches.open(CACHE_NAME);
        await Promise.allSettled(urls.map(url => cache.add(url)));
        console.log('[Service Worker] Cached additional URLs:', urls.length);
    } catch (error) {
        console.error('[Service Worker] Failed to cache URLs:', error);
    }
}

/**
 * Clear all caches
 */
async function clearAllCaches() {
    try {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
        console.log('[Service Worker] All caches cleared');
    } catch (error) {
        console.error('[Service Worker] Failed to clear caches:', error);
    }
}

/**
 * Calculate cache size
 */
async function getCacheSize() {
    try {
        const cache = await caches.open(CACHE_NAME);
        const keys = await cache.keys();
        
        let totalSize = 0;
        for (const request of keys) {
            const response = await cache.match(request);
            if (response) {
                const blob = await response.blob();
                totalSize += blob.size;
            }
        }
        
        return {
            items: keys.length,
            bytes: totalSize,
            megabytes: (totalSize / 1024 / 1024).toFixed(2)
        };
    } catch (error) {
        console.error('[Service Worker] Failed to calculate cache size:', error);
        return { items: 0, bytes: 0, megabytes: '0' };
    }
}

/**
 * Background Sync (if supported)
 */
self.addEventListener('sync', (event) => {
    console.log('[Service Worker] Background sync:', event.tag);
    
    if (event.tag === 'sync-analytics') {
        event.waitUntil(syncAnalytics());
    }
});

async function syncAnalytics() {
    // Implement analytics sync logic here
    console.log('[Service Worker] Syncing analytics data');
}

/**
 * Push Notifications (if supported)
 */
self.addEventListener('push', (event) => {
    const data = event.data?.json() || {};
    const title = data.title || 'Renderer Portfolio';
    const options = {
        body: data.body || 'New update available',
        icon: '/assets/images/icon-192.png',
        badge: '/assets/images/badge-72.png',
        data: data
    };
    
    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    event.waitUntil(
        clients.openWindow(event.notification.data.url || '/')
    );
});

console.log('[Service Worker] Script loaded');
