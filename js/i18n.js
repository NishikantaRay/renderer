/**
 * Internationalization (i18n) Module for Renderer
 * Provides multi-language support with RTL layout support
 */

class I18nManager {
    constructor(config = {}) {
        this.config = {
            defaultLanguage: config.defaultLanguage || 'en',
            availableLanguages: config.availableLanguages || ['en'],
            fallbackLanguage: config.fallbackLanguage || 'en',
            rtlLanguages: config.rtlLanguages || ['ar', 'he', 'fa', 'ur'],
            autoDetect: config.autoDetect !== false,
            persistLanguage: config.persistLanguage !== false,
            loadPath: config.loadPath || './locales/{{lng}}.json',
            ...config
        };

        this.currentLanguage = null;
        this.translations = {};
        this.formatters = {};
        this.init();
    }

    async init() {
        // Determine initial language
        this.currentLanguage = this.detectLanguage();
        
        // Load translations
        await this.loadTranslations(this.currentLanguage);
        
        // Apply language
        this.applyLanguage(this.currentLanguage);
        
        console.log('[i18n] Initialized with language:', this.currentLanguage);
    }

    /**
     * Detect user's preferred language
     */
    detectLanguage() {
        // 1. Check if language is persisted
        if (this.config.persistLanguage) {
            const saved = localStorage.getItem('renderer_language');
            if (saved && this.config.availableLanguages.includes(saved)) {
                return saved;
            }
        }

        // 2. Check URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        const urlLang = urlParams.get('lang');
        if (urlLang && this.config.availableLanguages.includes(urlLang)) {
            return urlLang;
        }

        // 3. Auto-detect from browser
        if (this.config.autoDetect) {
            const browserLang = this.getBrowserLanguage();
            if (browserLang && this.config.availableLanguages.includes(browserLang)) {
                return browserLang;
            }
        }

        // 4. Fallback to default
        return this.config.defaultLanguage;
    }

    /**
     * Get browser language
     */
    getBrowserLanguage() {
        const lang = navigator.language || navigator.userLanguage;
        return lang ? lang.split('-')[0] : null;
    }

    /**
     * Load translation file
     */
    async loadTranslations(language) {
        if (this.translations[language]) {
            return this.translations[language];
        }

        try {
            const path = this.config.loadPath.replace('{{lng}}', language);
            const response = await fetch(path);
            
            if (!response.ok) {
                throw new Error(`Failed to load translations: ${response.status}`);
            }
            
            const translations = await response.json();
            this.translations[language] = translations;
            
            console.log(`[i18n] Loaded translations for: ${language}`);
            return translations;
            
        } catch (error) {
            console.warn(`[i18n] Failed to load ${language}, using fallback`, error);
            
            // Load fallback
            if (language !== this.config.fallbackLanguage) {
                return this.loadTranslations(this.config.fallbackLanguage);
            }
            
            return {};
        }
    }

    /**
     * Apply language to the page
     */
    applyLanguage(language) {
        this.currentLanguage = language;
        
        // Set HTML attributes
        document.documentElement.lang = language;
        
        // Set RTL if needed
        const isRTL = this.config.rtlLanguages.includes(language);
        document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
        document.body.classList.toggle('rtl', isRTL);
        
        // Persist language
        if (this.config.persistLanguage) {
            localStorage.setItem('renderer_language', language);
        }
        
        // Translate all elements
        this.translatePage();
        
        // Dispatch event
        window.dispatchEvent(new CustomEvent('languagechange', {
            detail: { language, isRTL }
        }));
    }

    /**
     * Translate all elements on the page
     */
    translatePage() {
        // Translate elements with data-i18n attribute
        const elements = document.querySelectorAll('[data-i18n]');
        
        elements.forEach(element => {
            const key = element.dataset.i18n;
            const translation = this.t(key);
            
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translation;
            } else {
                element.textContent = translation;
            }
        });

        // Translate attributes
        const attrElements = document.querySelectorAll('[data-i18n-attr]');
        
        attrElements.forEach(element => {
            const attrConfig = element.dataset.i18nAttr;
            const pairs = attrConfig.split(';');
            
            pairs.forEach(pair => {
                const [attr, key] = pair.split(':');
                const translation = this.t(key.trim());
                element.setAttribute(attr.trim(), translation);
            });
        });

        // Translate HTML content
        const htmlElements = document.querySelectorAll('[data-i18n-html]');
        
        htmlElements.forEach(element => {
            const key = element.dataset.i18nHtml;
            const translation = this.t(key);
            element.innerHTML = translation;
        });
    }

    /**
     * Translate a key
     * @param {string} key - Translation key (dot notation supported)
     * @param {object} params - Parameters for interpolation
     */
    t(key, params = {}) {
        const translations = this.translations[this.currentLanguage] || {};
        
        // Get nested value
        let value = key.split('.').reduce((obj, k) => obj?.[k], translations);
        
        // Fallback to fallback language
        if (value === undefined && this.currentLanguage !== this.config.fallbackLanguage) {
            const fallbackTranslations = this.translations[this.config.fallbackLanguage] || {};
            value = key.split('.').reduce((obj, k) => obj?.[k], fallbackTranslations);
        }
        
        // Fallback to key itself
        if (value === undefined) {
            console.warn(`[i18n] Missing translation for key: ${key}`);
            return key;
        }
        
        // Interpolate parameters
        if (typeof value === 'string' && Object.keys(params).length > 0) {
            value = this.interpolate(value, params);
        }
        
        return value;
    }

    /**
     * Interpolate parameters in translation string
     */
    interpolate(str, params) {
        return str.replace(/\{\{(\w+)\}\}/g, (match, key) => {
            return params[key] !== undefined ? params[key] : match;
        });
    }

    /**
     * Change language
     */
    async changeLanguage(language) {
        if (!this.config.availableLanguages.includes(language)) {
            console.warn(`[i18n] Language not available: ${language}`);
            return false;
        }

        if (language === this.currentLanguage) {
            return true;
        }

        // Load translations if not already loaded
        await this.loadTranslations(language);
        
        // Apply language
        this.applyLanguage(language);
        
        return true;
    }

    /**
     * Get current language
     */
    getLanguage() {
        return this.currentLanguage;
    }

    /**
     * Get available languages
     */
    getAvailableLanguages() {
        return this.config.availableLanguages;
    }

    /**
     * Check if current language is RTL
     */
    isRTL() {
        return this.config.rtlLanguages.includes(this.currentLanguage);
    }

    /**
     * Format date according to locale
     */
    formatDate(date, format = {}) {
        const defaultFormat = {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };

        return new Intl.DateTimeFormat(this.currentLanguage, {
            ...defaultFormat,
            ...format
        }).format(date);
    }

    /**
     * Format number according to locale
     */
    formatNumber(number, format = {}) {
        return new Intl.NumberFormat(this.currentLanguage, format).format(number);
    }

    /**
     * Format currency according to locale
     */
    formatCurrency(amount, currency = 'USD') {
        return new Intl.NumberFormat(this.currentLanguage, {
            style: 'currency',
            currency
        }).format(amount);
    }

    /**
     * Format relative time (e.g., "2 days ago")
     */
    formatRelativeTime(date) {
        const now = new Date();
        const diff = now - date;
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const months = Math.floor(days / 30);
        const years = Math.floor(days / 365);

        if (years > 0) return this.t('time.years_ago', { count: years });
        if (months > 0) return this.t('time.months_ago', { count: months });
        if (days > 0) return this.t('time.days_ago', { count: days });
        if (hours > 0) return this.t('time.hours_ago', { count: hours });
        if (minutes > 0) return this.t('time.minutes_ago', { count: minutes });
        return this.t('time.just_now');
    }

    /**
     * Pluralization helper
     */
    plural(key, count) {
        const rules = this.getPluralRules();
        const rule = rules.select(count);
        return this.t(`${key}.${rule}`, { count });
    }

    /**
     * Get plural rules for current language
     */
    getPluralRules() {
        return new Intl.PluralRules(this.currentLanguage);
    }
}

// Default translations for common UI elements
const defaultTranslations = {
    en: {
        nav: {
            home: 'Home',
            about: 'About',
            projects: 'Projects',
            blog: 'Blog',
            resume: 'Resume',
            contact: 'Contact'
        },
        hero: {
            cta_primary: 'View My Work',
            cta_secondary: 'Get In Touch'
        },
        time: {
            just_now: 'Just now',
            minutes_ago: '{{count}} minutes ago',
            hours_ago: '{{count}} hours ago',
            days_ago: '{{count}} days ago',
            months_ago: '{{count}} months ago',
            years_ago: '{{count}} years ago'
        },
        common: {
            loading: 'Loading...',
            error: 'Error',
            success: 'Success',
            save: 'Save',
            cancel: 'Cancel',
            delete: 'Delete',
            edit: 'Edit',
            close: 'Close'
        }
    }
};

// Language Switcher Component
function createLanguageSwitcher(i18n) {
    const container = document.createElement('div');
    container.className = 'language-switcher';
    container.style.cssText = `
        position: fixed;
        top: 5rem;
        right: 1rem;
        z-index: 1000;
    `;

    const select = document.createElement('select');
    select.style.cssText = `
        padding: 0.5rem 1rem;
        border: 1px solid var(--border-color);
        border-radius: 6px;
        background: var(--bg-color);
        color: var(--text-color);
        cursor: pointer;
        font-size: 0.9rem;
    `;

    i18n.getAvailableLanguages().forEach(lang => {
        const option = document.createElement('option');
        option.value = lang;
        option.textContent = lang.toUpperCase();
        if (lang === i18n.getLanguage()) {
            option.selected = true;
        }
        select.appendChild(option);
    });

    select.addEventListener('change', async (e) => {
        await i18n.changeLanguage(e.target.value);
    });

    container.appendChild(select);
    return container;
}

// Auto-initialize if config exists
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', async () => {
        // Initialize i18n
        window.i18n = new I18nManager({
            defaultLanguage: 'en',
            availableLanguages: ['en', 'es', 'fr', 'de', 'ja', 'ar'],
            rtlLanguages: ['ar', 'he', 'fa', 'ur'],
            autoDetect: true,
            persistLanguage: true
        });

        // Add language switcher
        const switcher = createLanguageSwitcher(window.i18n);
        document.body.appendChild(switcher);

        console.log('[i18n] Language switcher added');
    });
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = I18nManager;
}
