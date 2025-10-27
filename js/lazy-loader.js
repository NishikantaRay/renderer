/**
 * Lazy Loader Utility
 * Efficiently loads JavaScript modules and external resources only when needed
 */

class LazyLoader {
    constructor() {
        this.loadedModules = new Set();
        this.loadingPromises = new Map();
    }

    // Load a JavaScript file with caching
    async loadScript(src, options = {}) {
        if (this.loadedModules.has(src)) {
            return Promise.resolve();
        }

        if (this.loadingPromises.has(src)) {
            return this.loadingPromises.get(src);
        }

        const promise = new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.async = options.async !== false;
            script.defer = options.defer !== false;
            
            const timeout = setTimeout(() => {
                script.remove();
                reject(new Error(`Script loading timeout: ${src}`));
            }, options.timeout || 10000);

            script.onload = () => {
                clearTimeout(timeout);
                this.loadedModules.add(src);
                resolve();
            };

            script.onerror = () => {
                clearTimeout(timeout);
                script.remove();
                reject(new Error(`Failed to load script: ${src}`));
            };

            document.head.appendChild(script);
        });

        this.loadingPromises.set(src, promise);
        
        try {
            await promise;
        } finally {
            this.loadingPromises.delete(src);
        }

        return promise;
    }

    // Load CSS file asynchronously
    async loadCSS(href, options = {}) {
        if (this.loadedModules.has(href)) {
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            
            const timeout = setTimeout(() => {
                link.remove();
                reject(new Error(`CSS loading timeout: ${href}`));
            }, options.timeout || 5000);

            link.onload = () => {
                clearTimeout(timeout);
                this.loadedModules.add(href);
                resolve();
            };

            link.onerror = () => {
                clearTimeout(timeout);
                link.remove();
                reject(new Error(`Failed to load CSS: ${href}`));
            };

            document.head.appendChild(link);
        });
    }

    // Load multiple resources in parallel
    async loadMultiple(resources) {
        const promises = resources.map(resource => {
            if (resource.type === 'script') {
                return this.loadScript(resource.src, resource.options);
            } else if (resource.type === 'css') {
                return this.loadCSS(resource.href, resource.options);
            }
        });

        return Promise.all(promises);
    }

    // Check if a module is loaded
    isLoaded(src) {
        return this.loadedModules.has(src);
    }

    // Preload resources without executing (for future use)
    preload(src, type = 'script') {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = src;
        link.as = type;
        document.head.appendChild(link);
    }
}

// Create global instance
window.lazyLoader = new LazyLoader();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LazyLoader;
}