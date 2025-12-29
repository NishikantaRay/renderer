/**
 * Service Worker Registration and Management
 * Include this script in your HTML pages to enable offline support
 */

(function() {
    'use strict';

    // Check if service workers are supported
    if (!('serviceWorker' in navigator)) {
        console.warn('Service Workers not supported in this browser');
        return;
    }

    // Configuration
    const SW_CONFIG = {
        scriptUrl: '/sw.js',
        scope: '/',
        updateInterval: 60 * 60 * 1000, // Check for updates every hour
        enableNotifications: false,
        enableBackgroundSync: false
    };

    // State management
    let registration = null;
    let isOnline = navigator.onLine;
    let updateAvailable = false;

    /**
     * Register Service Worker
     */
    async function registerServiceWorker() {
        try {
            registration = await navigator.serviceWorker.register(SW_CONFIG.scriptUrl, {
                scope: SW_CONFIG.scope
            });

            console.log('[SW Manager] Service Worker registered successfully');
            console.log('[SW Manager] Scope:', registration.scope);

            // Handle updates
            registration.addEventListener('updatefound', handleUpdateFound);

            // Check for updates periodically
            setInterval(() => {
                registration.update();
            }, SW_CONFIG.updateInterval);

            // Handle controller change
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                console.log('[SW Manager] New service worker activated');
                window.location.reload();
            });

            // Initial update check
            await registration.update();

            return registration;

        } catch (error) {
            console.error('[SW Manager] Service Worker registration failed:', error);
            throw error;
        }
    }

    /**
     * Handle Service Worker update
     */
    function handleUpdateFound() {
        const newWorker = registration.installing;

        console.log('[SW Manager] New service worker found');

        newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('[SW Manager] New version available');
                updateAvailable = true;
                showUpdateNotification();
            }
        });
    }

    /**
     * Show update notification to user
     */
    function showUpdateNotification() {
        const notification = document.createElement('div');
        notification.id = 'sw-update-notification';
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #0969da;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            max-width: 400px;
            animation: slideIn 0.3s ease-out;
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 1rem;">
                <div style="flex: 1;">
                    <strong>Update Available</strong>
                    <p style="margin: 0.5rem 0 0; font-size: 0.9rem; opacity: 0.9;">
                        A new version of the portfolio is available.
                    </p>
                </div>
                <button id="sw-reload-btn" style="
                    background: white;
                    color: #0969da;
                    border: none;
                    padding: 0.5rem 1rem;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: 600;
                    white-space: nowrap;
                ">
                    Reload
                </button>
            </div>
        `;

        document.body.appendChild(notification);

        // Add animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);

        // Handle reload button
        document.getElementById('sw-reload-btn').addEventListener('click', () => {
            activateUpdate();
        });
    }

    /**
     * Activate service worker update
     */
    function activateUpdate() {
        if (!registration || !registration.waiting) return;

        // Tell service worker to skip waiting
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });

        // Reload page once new service worker is activated
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            window.location.reload();
        });
    }

    /**
     * Monitor online/offline status
     */
    function setupOnlineOfflineMonitoring() {
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Show initial status if offline
        if (!isOnline) {
            handleOffline();
        }
    }

    function handleOnline() {
        console.log('[SW Manager] Back online');
        isOnline = true;
        hideOfflineIndicator();
        
        // Sync data if background sync is enabled
        if (SW_CONFIG.enableBackgroundSync && registration && registration.sync) {
            registration.sync.register('sync-analytics').catch(console.error);
        }
    }

    function handleOffline() {
        console.log('[SW Manager] Offline mode');
        isOnline = false;
        showOfflineIndicator();
    }

    /**
     * Show offline indicator
     */
    function showOfflineIndicator() {
        let indicator = document.getElementById('offline-indicator');
        
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.id = 'offline-indicator';
            indicator.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                background: #ffc107;
                color: #000;
                text-align: center;
                padding: 0.75rem;
                font-weight: 600;
                z-index: 10000;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
            `;
            indicator.innerHTML = '📡 Offline Mode - Some features may be limited';
            document.body.appendChild(indicator);
        }
    }

    /**
     * Hide offline indicator
     */
    function hideOfflineIndicator() {
        const indicator = document.getElementById('offline-indicator');
        if (indicator) {
            indicator.style.transition = 'opacity 0.3s';
            indicator.style.opacity = '0';
            setTimeout(() => indicator.remove(), 300);
        }
    }

    /**
     * Get cache statistics
     */
    async function getCacheStats() {
        if (!registration) return null;

        return new Promise((resolve) => {
            const messageChannel = new MessageChannel();
            
            messageChannel.port1.onmessage = (event) => {
                resolve(event.data.size);
            };

            registration.active?.postMessage(
                { type: 'GET_CACHE_SIZE' },
                [messageChannel.port2]
            );
        });
    }

    /**
     * Clear all caches
     */
    async function clearCaches() {
        if (!registration) return;

        registration.active?.postMessage({ type: 'CLEAR_CACHE' });
        
        // Also clear cache storage
        if ('caches' in window) {
            const cacheNames = await caches.keys();
            await Promise.all(cacheNames.map(name => caches.delete(name)));
        }

        console.log('[SW Manager] All caches cleared');
    }

    /**
     * Unregister Service Worker
     */
    async function unregisterServiceWorker() {
        if (!registration) return;

        const success = await registration.unregister();
        
        if (success) {
            console.log('[SW Manager] Service Worker unregistered');
            await clearCaches();
        }

        return success;
    }

    /**
     * Public API
     */
    window.serviceWorkerManager = {
        register: registerServiceWorker,
        unregister: unregisterServiceWorker,
        getCacheStats,
        clearCaches,
        activateUpdate,
        isOnline: () => isOnline,
        hasUpdate: () => updateAvailable,
        getRegistration: () => registration
    };

    /**
     * Initialize on page load
     */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    async function init() {
        try {
            await registerServiceWorker();
            setupOnlineOfflineMonitoring();
            
            console.log('[SW Manager] Initialized successfully');
            
            // Dispatch custom event
            window.dispatchEvent(new CustomEvent('sw-ready', {
                detail: { registration }
            }));
            
        } catch (error) {
            console.error('[SW Manager] Initialization failed:', error);
        }
    }

    // Debug helpers (only in development)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        window.swDebug = {
            stats: getCacheStats,
            clear: clearCaches,
            update: () => registration?.update(),
            unregister: unregisterServiceWorker,
            status: () => ({
                registered: !!registration,
                active: !!registration?.active,
                waiting: !!registration?.waiting,
                installing: !!registration?.installing,
                online: isOnline,
                updateAvailable
            })
        };
    }

})();
