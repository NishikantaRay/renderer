/**
 * Image Optimization Module for Renderer
 * Provides lazy loading, WebP support, responsive images, and performance optimization
 */

class ImageOptimizer {
    constructor(options = {}) {
        this.options = {
            lazyLoadThreshold: options.lazyLoadThreshold || '200px',
            enableWebP: options.enableWebP !== false,
            enableBlurHash: options.enableBlurHash || false,
            enableProgressiveLoading: options.enableProgressiveLoading !== false,
            quality: options.quality || 85,
            ...options
        };

        this.observer = null;
        this.images = new Set();
        this.supportsWebP = false;
        this.init();
    }

    async init() {
        // Check WebP support
        this.supportsWebP = await this.checkWebPSupport();
        console.log('[Image Optimizer] WebP supported:', this.supportsWebP);

        // Setup intersection observer for lazy loading
        this.setupLazyLoading();

        // Process existing images
        this.processImages();

        // Watch for new images
        this.setupMutationObserver();

        console.log('[Image Optimizer] Initialized');
    }

    /**
     * Check if browser supports WebP
     */
    async checkWebPSupport() {
        if (!self.createImageBitmap) return false;

        const webpData = 'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=';
        
        try {
            const blob = await fetch(webpData).then(r => r.blob());
            return await createImageBitmap(blob).then(() => true, () => false);
        } catch {
            return false;
        }
    }

    /**
     * Setup lazy loading with Intersection Observer
     */
    setupLazyLoading() {
        const options = {
            root: null,
            rootMargin: this.options.lazyLoadThreshold,
            threshold: 0.01
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadImage(entry.target);
                    this.observer.unobserve(entry.target);
                }
            });
        }, options);
    }

    /**
     * Setup mutation observer to watch for new images
     */
    setupMutationObserver() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // Element node
                        if (node.tagName === 'IMG') {
                            this.processImage(node);
                        } else {
                            const images = node.querySelectorAll('img[data-src]');
                            images.forEach(img => this.processImage(img));
                        }
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    /**
     * Process all images on the page
     */
    processImages() {
        const images = document.querySelectorAll('img[data-src], img[loading="lazy"]');
        images.forEach(img => this.processImage(img));
    }

    /**
     * Process individual image
     */
    processImage(img) {
        if (this.images.has(img)) return;
        this.images.add(img);

        // Add blur-up effect
        if (this.options.enableProgressiveLoading && img.dataset.placeholder) {
            img.style.filter = 'blur(10px)';
            img.style.transition = 'filter 0.3s';
        }

        // Setup WebP source if supported
        if (this.supportsWebP && this.options.enableWebP) {
            this.setupWebPSource(img);
        }

        // Setup responsive images
        this.setupResponsiveImages(img);

        // Observe for lazy loading
        if (img.dataset.src && !img.src) {
            this.observer.observe(img);
        } else if (img.loading === 'lazy') {
            // Native lazy loading fallback
            this.observer.observe(img);
        }
    }

    /**
     * Setup WebP source for image
     */
    setupWebPSource(img) {
        const parent = img.parentElement;
        
        // Skip if already in picture element
        if (parent.tagName === 'PICTURE') return;

        const picture = document.createElement('picture');
        
        // Create WebP source
        const webpSource = document.createElement('source');
        const originalSrc = img.dataset.src || img.src;
        webpSource.srcset = this.getWebPUrl(originalSrc);
        webpSource.type = 'image/webp';
        
        // Insert picture element
        img.parentNode.insertBefore(picture, img);
        picture.appendChild(webpSource);
        picture.appendChild(img);
    }

    /**
     * Setup responsive images with srcset
     */
    setupResponsiveImages(img) {
        if (img.dataset.srcset || img.srcset) return;

        const src = img.dataset.src || img.src;
        if (!src) return;

        const sizes = [320, 640, 768, 1024, 1280, 1920];
        const srcset = sizes.map(size => {
            return `${this.getResizedUrl(src, size)} ${size}w`;
        }).join(', ');

        img.dataset.srcset = srcset;
        
        // Set sizes attribute
        if (!img.sizes) {
            img.sizes = '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw';
        }
    }

    /**
     * Load image
     */
    async loadImage(img) {
        const src = img.dataset.src;
        const srcset = img.dataset.srcset;

        if (!src) return;

        // Show placeholder while loading
        if (img.dataset.placeholder) {
            img.src = img.dataset.placeholder;
        }

        // Create temporary image to preload
        const tempImg = new Image();
        
        if (srcset) {
            tempImg.srcset = srcset;
            tempImg.sizes = img.sizes || img.dataset.sizes;
        }
        tempImg.src = src;

        try {
            await tempImg.decode();
            
            // Set actual src
            if (srcset) img.srcset = srcset;
            img.src = src;

            // Remove blur effect
            if (this.options.enableProgressiveLoading) {
                setTimeout(() => {
                    img.style.filter = 'none';
                }, 50);
            }

            // Mark as loaded
            img.classList.add('loaded');
            img.removeAttribute('data-src');
            img.removeAttribute('data-srcset');

            // Trigger loaded event
            img.dispatchEvent(new CustomEvent('imageloaded', {
                detail: { src, srcset }
            }));

            console.log('[Image Optimizer] Image loaded:', src);

        } catch (error) {
            console.error('[Image Optimizer] Failed to load image:', src, error);
            img.classList.add('load-error');
            
            // Show fallback
            if (img.dataset.fallback) {
                img.src = img.dataset.fallback;
            }
        }
    }

    /**
     * Get WebP URL for image
     */
    getWebPUrl(url) {
        // If using a CDN or image service, modify URL
        // Example for Cloudinary: add f_webp
        // Example for imgix: add fm=webp
        
        // Simple implementation: replace extension
        return url.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    }

    /**
     * Get resized URL for responsive images
     */
    getResizedUrl(url, width) {
        // If using a CDN or image service, add width parameter
        // Example for Cloudinary: add w_${width}
        // Example for imgix: add w=${width}
        
        // For local development, return original
        // In production, this should call your image service
        return url;
    }

    /**
     * Preload critical images
     */
    preloadCriticalImages(images) {
        images.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            
            if (this.supportsWebP) {
                link.type = 'image/webp';
                link.href = this.getWebPUrl(src);
            }
            
            document.head.appendChild(link);
        });

        console.log('[Image Optimizer] Preloaded', images.length, 'critical images');
    }

    /**
     * Generate BlurHash placeholder
     */
    async generateBlurHash(img) {
        // This requires blurhash library
        // Implementation would encode image to blurhash string
        // For now, return a simple gradient
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');
        
        // Simple blur effect
        ctx.filter = 'blur(10px)';
        ctx.drawImage(img, 0, 0, 32, 32);
        
        return canvas.toDataURL();
    }

    /**
     * Convert images to WebP (for build process)
     */
    static async convertToWebP(file, quality = 85) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const reader = new FileReader();

            reader.onload = (e) => {
                img.src = e.target.result;
            };

            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                
                canvas.toBlob((blob) => {
                    resolve(blob);
                }, 'image/webp', quality / 100);
            };

            img.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    /**
     * Get image statistics
     */
    getStats() {
        const loaded = Array.from(this.images).filter(img => img.classList.contains('loaded')).length;
        const errors = Array.from(this.images).filter(img => img.classList.contains('load-error')).length;

        return {
            total: this.images.size,
            loaded,
            errors,
            pending: this.images.size - loaded - errors,
            webpSupported: this.supportsWebP
        };
    }

    /**
     * Destroy and cleanup
     */
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
        this.images.clear();
        console.log('[Image Optimizer] Destroyed');
    }
}

// Auto-initialize if config exists
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        // Check if image optimization is enabled in config
        const imageOptConfig = {
            lazyLoadThreshold: '200px',
            enableWebP: true,
            enableProgressiveLoading: true,
            quality: 85
        };

        window.imageOptimizer = new ImageOptimizer(imageOptConfig);

        // Expose debug info
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            window.imageOptimizerDebug = {
                stats: () => window.imageOptimizer.getStats(),
                processImages: () => window.imageOptimizer.processImages(),
                preload: (images) => window.imageOptimizer.preloadCriticalImages(images)
            };
        }
    });
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ImageOptimizer;
}
