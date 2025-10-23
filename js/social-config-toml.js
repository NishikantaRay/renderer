/**
 * TOML-based Social Links Configuration
 * Loads social media configuration from config/social.toml
 */

class SocialConfig {
    constructor() {
        this.config = null;
        this.tomlParser = null;
    }

    // Initialize and load the TOML configuration
    async init() {
        try {
            // Load TOML parser from CDN
            await this.loadTomlParser();
            
            // Load the configuration file
            await this.loadConfig();
            
            return true;
        } catch (error) {
            console.error('Failed to initialize social configuration:', error);
            // Fallback to default configuration
            this.setDefaultConfig();
            return false;
        }
    }

    // Load TOML parser dynamically
    async loadTomlParser() {
        return new Promise((resolve, reject) => {
            // Check if TOML parser is already loaded
            if (window.TOML) {
                this.tomlParser = window.TOML;
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@iarna/toml@2.2.5/lib/toml-browser.js';
            script.onload = () => {
                this.tomlParser = window.TOML;
                resolve();
            };
            script.onerror = () => reject(new Error('Failed to load TOML parser'));
            document.head.appendChild(script);
        });
    }

    // Load configuration from TOML file
    async loadConfig() {
        try {
            const response = await fetch('./config/social.toml');
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const tomlContent = await response.text();
            this.config = this.tomlParser.parse(tomlContent);
            
            console.log('Social configuration loaded successfully from TOML');
        } catch (error) {
            console.error('Failed to load social.toml:', error);
            throw error;
        }
    }

    // Set default configuration as fallback
    setDefaultConfig() {
        this.config = {
            settings: {
                show_text: false,
                show_tooltips: true,
                max_visible: 6,
                icon_size: "20px",
                spacing: "1rem"
            },
            links: [
                {
                    id: 'github',
                    name: 'GitHub',
                    url: 'https://github.com/NishikantaRay',
                    icon: 'fab fa-github',
                    target: '_blank',
                    enabled: true
                },
                {
                    id: 'linkedin',
                    name: 'LinkedIn',
                    url: 'https://linkedin.com/in/nishikantaray',
                    icon: 'fab fa-linkedin',
                    target: '_blank',
                    enabled: true
                },
                {
                    id: 'email',
                    name: 'Email',
                    url: 'mailto:your.email@example.com',
                    icon: 'fas fa-envelope',
                    target: '_self',
                    enabled: true
                }
            ]
        };
    }

    // Get enabled social links
    getEnabledLinks() {
        if (!this.config) return [];
        
        return this.config.links
            .filter(link => link.enabled)
            .slice(0, this.config.settings.max_visible);
    }

    // Get settings
    getSettings() {
        return this.config?.settings || {};
    }

    // Generate social links HTML
    generateSocialLinksHTML() {
        const enabledLinks = this.getEnabledLinks();
        const settings = this.getSettings();
        
        if (enabledLinks.length === 0) return '';
        
        return enabledLinks.map(link => {
            const target = link.target ? `target="${link.target}"` : '';
            const tooltip = settings.show_tooltips ? `title="${link.name}"` : '';
            const text = settings.show_text ? `<span class="social-text">${link.name}</span>` : '';
            
            return `
                <a href="${link.url}" ${target} class="social-link" ${tooltip} data-social="${link.id}">
                    <span class="social-icon"><i class="${link.icon}"></i></span>
                    ${text}
                </a>
            `;
        }).join('');
    }

    // Generate CSS custom properties for styling
    generateSocialCSS() {
        const settings = this.getSettings();
        
        return `
            :root {
                --social-icon-size: ${settings.icon_size || '20px'};
                --social-spacing: ${settings.spacing || '1rem'};
            }
        `;
    }

    // Update social links in the DOM
    async updateSocialLinks(selector = '.social-links') {
        const containers = document.querySelectorAll(selector);
        
        if (containers.length === 0) {
            console.warn(`No elements found with selector: ${selector}`);
            return;
        }

        // Ensure configuration is loaded
        if (!this.config) {
            await this.init();
        }

        const html = this.generateSocialLinksHTML();
        const css = this.generateSocialCSS();

        // Update CSS
        let styleElement = document.getElementById('social-config-styles');
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = 'social-config-styles';
            document.head.appendChild(styleElement);
        }
        styleElement.textContent = css;

        // Update HTML
        containers.forEach(container => {
            container.innerHTML = html;
        });
    }

    // Reload configuration
    async reload() {
        await this.loadConfig();
        await this.updateSocialLinks();
    }
}

// Create global instance
window.socialConfig = new SocialConfig();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', async () => {
        await window.socialConfig.init();
    });
} else {
    window.socialConfig.init();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SocialConfig;
}