/**
 * Performance Monitor
 * Tracks and reports page loading performance metrics
 */

class PerformanceMonitor {
    constructor() {
        this.metrics = {};
        this.isSupported = 'performance' in window && 'getEntriesByType' in performance;
        
        if (this.isSupported) {
            this.init();
        }
    }

    init() {
        // Mark important milestones
        this.markMilestone('page-start');
        
        // Monitor when critical resources are loaded
        document.addEventListener('DOMContentLoaded', () => {
            this.markMilestone('dom-ready');
            this.measureCriticalResourcesLoading();
        });

        window.addEventListener('load', () => {
            this.markMilestone('window-load');
            setTimeout(() => this.generateReport(), 100);
        });

        // Monitor First Contentful Paint and other Web Vitals
        this.observeWebVitals();
    }

    markMilestone(name) {
        if (this.isSupported) {
            performance.mark(name);
        }
    }

    measureCriticalResourcesLoading() {
        if (!this.isSupported) return;

        // Measure CSS loading time
        const cssEntries = performance.getEntriesByType('resource').filter(entry => 
            entry.name.includes('.css') && entry.name.includes('critical')
        );
        
        if (cssEntries.length > 0) {
            this.metrics.criticalCSSTime = Math.round(cssEntries[0].responseEnd - cssEntries[0].startTime);
        }

        // Measure JavaScript loading time
        const jsEntries = performance.getEntriesByType('resource').filter(entry => 
            entry.name.includes('fast-init.js')
        );
        
        if (jsEntries.length > 0) {
            this.metrics.criticalJSTime = Math.round(jsEntries[0].responseEnd - jsEntries[0].startTime);
        }

        // Measure profile image loading time
        const imgEntries = performance.getEntriesByType('resource').filter(entry => 
            entry.name.includes('avatars.githubusercontent.com')
        );
        
        if (imgEntries.length > 0) {
            this.metrics.profileImageTime = Math.round(imgEntries[0].responseEnd - imgEntries[0].startTime);
        }
    }

    observeWebVitals() {
        if (!this.isSupported) return;

        // First Contentful Paint
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.name === 'first-contentful-paint') {
                    this.metrics.firstContentfulPaint = Math.round(entry.startTime);
                }
                if (entry.name === 'largest-contentful-paint') {
                    this.metrics.largestContentfulPaint = Math.round(entry.startTime);
                }
            }
        });

        try {
            observer.observe({ entryTypes: ['paint', 'largest-contentful-paint'] });
        } catch (e) {
            // Fallback for browsers that don't support these metrics
            console.log('Some performance metrics not supported in this browser');
        }

        // Cumulative Layout Shift
        let cumulativeLayoutShift = 0;
        const clsObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (!entry.hadRecentInput) {
                    cumulativeLayoutShift += entry.value;
                }
            }
            this.metrics.cumulativeLayoutShift = Math.round(cumulativeLayoutShift * 1000) / 1000;
        });

        try {
            clsObserver.observe({ entryTypes: ['layout-shift'] });
        } catch (e) {
            // Fallback for browsers that don't support layout-shift
        }
    }

    measureToInteractive() {
        if (!this.isSupported) return;

        // Simple Time to Interactive approximation
        const navigationEntry = performance.getEntriesByType('navigation')[0];
        if (navigationEntry) {
            this.metrics.timeToInteractive = Math.round(navigationEntry.loadEventEnd - navigationEntry.startTime);
        }
    }

    generateReport() {
        if (!this.isSupported) {
            console.log('⚠️ Performance API not supported in this browser');
            return;
        }

        this.measureToInteractive();

        // Calculate key timings
        const navigation = performance.getEntriesByType('navigation')[0];
        const domReady = performance.getEntriesByName('dom-ready')[0];
        const windowLoad = performance.getEntriesByName('window-load')[0];

        this.metrics.domReadyTime = domReady ? Math.round(domReady.startTime) : 'N/A';
        this.metrics.windowLoadTime = windowLoad ? Math.round(windowLoad.startTime) : 'N/A';
        this.metrics.ttfb = navigation ? Math.round(navigation.responseStart - navigation.requestStart) : 'N/A';

        // Count total resources
        const resources = performance.getEntriesByType('resource');
        this.metrics.totalResources = resources.length;
        this.metrics.totalTransferSize = Math.round(
            resources.reduce((total, resource) => total + (resource.transferSize || 0), 0) / 1024
        );

        // Log performance report
        this.logReport();
        
        // Send to analytics if configured
        this.sendToAnalytics();
    }

    logReport() {
        console.group('🚀 Performance Report');
        console.log('📊 Core Metrics:');
        console.log(`  • Time to First Byte: ${this.metrics.ttfb}ms`);
        console.log(`  • First Contentful Paint: ${this.metrics.firstContentfulPaint || 'N/A'}ms`);
        console.log(`  • Largest Contentful Paint: ${this.metrics.largestContentfulPaint || 'N/A'}ms`);
        console.log(`  • DOM Ready: ${this.metrics.domReadyTime}ms`);
        console.log(`  • Window Load: ${this.metrics.windowLoadTime}ms`);
        console.log(`  • Time to Interactive: ${this.metrics.timeToInteractive}ms`);
        
        console.log('🎯 Critical Resources:');
        console.log(`  • Critical CSS: ${this.metrics.criticalCSSTime || 'N/A'}ms`);
        console.log(`  • Critical JS: ${this.metrics.criticalJSTime || 'N/A'}ms`);
        console.log(`  • Profile Image: ${this.metrics.profileImageTime || 'N/A'}ms`);
        
        console.log('📈 Web Vitals:');
        console.log(`  • Cumulative Layout Shift: ${this.metrics.cumulativeLayoutShift || 'N/A'}`);
        
        console.log('📦 Resources:');
        console.log(`  • Total Resources: ${this.metrics.totalResources}`);
        console.log(`  • Total Transfer Size: ${this.metrics.totalTransferSize}KB`);
        
        // Performance grades
        const grades = this.calculateGrades();
        console.log('🏆 Performance Grades:');
        Object.entries(grades).forEach(([metric, grade]) => {
            console.log(`  • ${metric}: ${grade.grade} (${grade.value})`);
        });
        
        console.groupEnd();
    }

    calculateGrades() {
        const grades = {};
        
        // First Contentful Paint grading
        if (this.metrics.firstContentfulPaint) {
            const fcp = this.metrics.firstContentfulPaint;
            if (fcp <= 1800) grades.FCP = { grade: '🟢 Good', value: fcp + 'ms' };
            else if (fcp <= 3000) grades.FCP = { grade: '🟡 Needs Improvement', value: fcp + 'ms' };
            else grades.FCP = { grade: '🔴 Poor', value: fcp + 'ms' };
        }
        
        // Largest Contentful Paint grading
        if (this.metrics.largestContentfulPaint) {
            const lcp = this.metrics.largestContentfulPaint;
            if (lcp <= 2500) grades.LCP = { grade: '🟢 Good', value: lcp + 'ms' };
            else if (lcp <= 4000) grades.LCP = { grade: '🟡 Needs Improvement', value: lcp + 'ms' };
            else grades.LCP = { grade: '🔴 Poor', value: lcp + 'ms' };
        }
        
        // Cumulative Layout Shift grading
        if (this.metrics.cumulativeLayoutShift !== undefined) {
            const cls = this.metrics.cumulativeLayoutShift;
            if (cls <= 0.1) grades.CLS = { grade: '🟢 Good', value: cls };
            else if (cls <= 0.25) grades.CLS = { grade: '🟡 Needs Improvement', value: cls };
            else grades.CLS = { grade: '🔴 Poor', value: cls };
        }
        
        return grades;
    }

    sendToAnalytics() {
        // You can extend this to send metrics to your analytics service
        // For example: Google Analytics, Plausible, etc.
        
        if (typeof gtag !== 'undefined') {
            gtag('event', 'performance_timing', {
                event_category: 'Performance',
                event_label: 'Page Load',
                value: this.metrics.windowLoadTime
            });
        }
    }

    // Public method to get current metrics
    getMetrics() {
        return this.metrics;
    }
}

// Initialize performance monitoring
if (typeof window !== 'undefined') {
    window.performanceMonitor = new PerformanceMonitor();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceMonitor;
}