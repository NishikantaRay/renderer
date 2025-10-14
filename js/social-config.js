/**
 * Social Links Configuration
 * Configure all social media links and icons from one place
 */

window.SOCIAL_CONFIG = {
    // Social links configuration
    links: [
        {
            id: 'github',
            name: 'GitHub',
            url: 'https://github.com/yourusername',
            icon: 'fab fa-github',
            target: '_blank',
            enabled: true
        },
        {
            id: 'linkedin',
            name: 'LinkedIn',
            url: 'https://linkedin.com/in/yourusername',
            icon: 'fab fa-linkedin',
            target: '_blank',
            enabled: true
        },
        {
            id: 'twitter',
            name: 'Twitter',
            url: 'https://twitter.com/yourusername',
            icon: 'fab fa-twitter',
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
        },
        {
            id: 'instagram',
            name: 'Instagram',
            url: 'https://instagram.com/yourusername',
            icon: 'fab fa-instagram',
            target: '_blank',
            enabled: false
        },
        {
            id: 'youtube',
            name: 'YouTube',
            url: 'https://youtube.com/@yourusername',
            icon: 'fab fa-youtube',
            target: '_blank',
            enabled: false
        },
        {
            id: 'discord',
            name: 'Discord',
            url: 'https://discord.gg/yourinvite',
            icon: 'fab fa-discord',
            target: '_blank',
            enabled: false
        }
    ],

    // Display settings
    settings: {
        showText: false,  // Set to false for icons only
        showTooltips: true,
        maxVisible: 6,
        iconSize: '20px',
        spacing: '1rem'
    },

    // Get enabled social links
    getEnabledLinks() {
        return this.links.filter(link => link.enabled).slice(0, this.settings.maxVisible);
    },

    // Generate social links HTML
    generateSocialLinksHTML() {
        const enabledLinks = this.getEnabledLinks();
        
        return enabledLinks.map(link => {
            const target = link.target ? `target="${link.target}"` : '';
            const tooltip = this.settings.showTooltips ? `title="${link.name}"` : '';
            const text = this.settings.showText ? `<span class="social-text">${link.name}</span>` : '';
            
            return `
                <a href="${link.url}" ${target} class="social-link" ${tooltip} data-social="${link.id}">
                    <span class="social-icon"><i class="${link.icon}"></i></span>
                    ${text}
                </a>
            `;
        }).join('');
    }
};