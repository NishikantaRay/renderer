/**
 * TOML-based Social Links Configuration
 * Loads social media configuration from config/social.toml
 */

class SocialConfig {
    constructor() {
        this.config = null;
    }

    // Initialize and load the TOML configuration
    async init() {
        try {
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

    // Load configuration from TOML file
    async loadConfig() {
        try {
            const response = await fetch('./config/social.toml');
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const tomlContent = await response.text();
            
            // Use the shared TOML loader
            try {
                this.config = await window.tomlLoader.parse(tomlContent);
                console.log('Social configuration loaded successfully from TOML');
            } catch (parseError) {
                console.warn('TOML parsing failed, using default config:', parseError.message);
                this.setDefaultConfig();
            }
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
                    url: 'https://linkedin.com/in/nishikanta-ray-7786a0196',
                    icon: 'fab fa-linkedin',
                    target: '_blank',
                    enabled: true
                },
                {
                    id: 'twitter',
                    name: 'Twitter',
                    url: 'https://twitter.com/NishikantaRay5',
                    icon: 'fab fa-twitter',
                    target: '_blank',
                    enabled: true
                },
                {
                    id: 'email',
                    name: 'Email',
                    url: 'mailto:nishikantaray1@gmail.com',
                    icon: 'fas fa-envelope',
                    target: '_self',
                    enabled: true
                },
                {
                    id: 'youtube',
                    name: 'YouTube',
                    url: 'https://youtube.com/@nishikantaray5637',
                    icon: 'fab fa-youtube',
                    target: '_blank',
                    enabled: true
                },
                {
                    id: 'instagram',
                    name: 'Instagram',
                    url: 'https://instagram.com/nishikanta.ray',
                    icon: 'fab fa-instagram',
                    target: '_blank',
                    enabled: true
                },
                {
                    id: 'stackoverflow',
                    name: 'Stack Overflow',
                    url: 'https://stackoverflow.com/users/12345/nishikanta',
                    icon: 'fab fa-stack-overflow',
                    target: '_blank',
                    enabled: false
                },
                {
                    id: 'codepen',
                    name: 'CodePen',
                    url: 'https://codepen.io/nishikantaray',
                    icon: 'fab fa-codepen',
                    target: '_blank',
                    enabled: false
                },
                {
                    id: 'dribbble',
                    name: 'Dribbble',
                    url: 'https://dribbble.com/nishikantaray',
                    icon: 'fab fa-dribbble',
                    target: '_blank',
                    enabled: false
                },
                {
                    id: 'behance',
                    name: 'Behance',
                    url: 'https://behance.net/nishikantaray',
                    icon: 'fab fa-behance',
                    target: '_blank',
                    enabled: false
                }
            ]
        };
    }

    // Get enabled social links
    getEnabledLinks() {
        console.log('getEnabledLinks called');
        console.log('this.config:', this.config);
        
        if (!this.config || !this.config.links || !Array.isArray(this.config.links)) {
            console.warn('Social config links not available or not an array, using defaults');
            console.log('this.config?.links:', this.config?.links);
            console.log('Array.isArray(this.config?.links):', Array.isArray(this.config?.links));
            return [];
        }
        
        console.log('Available links:', this.config.links.length);
        const enabledLinks = this.config.links.filter(link => link.enabled);
        console.log('Enabled links:', enabledLinks.length);
        
        const maxVisible = this.config.settings?.max_visible || 6;
        const result = enabledLinks.slice(0, maxVisible);
        console.log('Final links to show:', result.length, result);
        
        return result;
    }

    // Get settings
    getSettings() {
        return this.config?.settings || {};
    }

    // Generate social links HTML
    generateSocialLinksHTML() {
        const enabledLinks = this.getEnabledLinks();
        const settings = this.getSettings();
        
        console.log('generateSocialLinksHTML called');
        console.log('enabledLinks:', enabledLinks);
        console.log('settings:', settings);
        
        if (enabledLinks.length === 0) {
            console.warn('No enabled links found, using fallback');
            // Force fallback HTML with default icons
            return `
                <a href="https://github.com/NishikantaRay" target="_blank" class="social-link" title="GitHub">
                    <span class="social-icon"><i class="fab fa-github"></i></span>
                </a>
                <a href="https://linkedin.com/in/nishikanta-ray-7786a0196" target="_blank" class="social-link" title="LinkedIn">
                    <span class="social-icon"><i class="fab fa-linkedin"></i></span>
                </a>
                <a href="https://twitter.com/NishikantaRay5" target="_blank" class="social-link" title="Twitter">
                    <span class="social-icon"><i class="fab fa-twitter"></i></span>
                </a>
                <a href="mailto:nishikantaray1@gmail.com" class="social-link" title="Email">
                    <span class="social-icon"><i class="fas fa-envelope"></i></span>
                </a>
            `;
        }
        
        const html = enabledLinks.map(link => {
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
        
        console.log('Generated HTML result:', html);
        return html;
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
        console.log('updateSocialLinks called with selector:', selector);
        const containers = document.querySelectorAll(selector);
        console.log('Found containers:', containers.length);
        
        if (containers.length === 0) {
            console.warn(`No elements found with selector: ${selector}`);
            return;
        }

        // Ensure configuration is loaded
        if (!this.config) {
            console.log('Config not loaded, initializing...');
            await this.init();
        }

        const html = this.generateSocialLinksHTML();
        const css = this.generateSocialCSS();

        console.log('Generated HTML length:', html.length);

        // Update CSS first
        let styleElement = document.getElementById('social-config-styles');
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = 'social-config-styles';
            document.head.appendChild(styleElement);
        }
        styleElement.textContent = css;

        // Update HTML with smooth transition
        containers.forEach((container, index) => {
            console.log(`Updating container ${index}:`, container);
            
            // Hide container during update to prevent flash
            const originalOpacity = container.style.opacity;
            container.style.opacity = '0';
            container.style.transition = 'opacity 0.3s ease';
            
            // Update content
            container.innerHTML = html;
            
            // Force reflow and show with fade-in
            container.offsetHeight;
            container.style.opacity = '1';
            
            // Clean up after transition
            setTimeout(() => {
                container.style.opacity = originalOpacity;
                container.style.transition = '';
            }, 300);
        });
        
        console.log('Social links update completed');
    }

    // Reload configuration
    async reload() {
        await this.loadConfig();
        await this.updateSocialLinks();
    }
}

// Create global instance
window.socialConfig = new SocialConfig();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SocialConfig;
}