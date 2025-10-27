/**
 * Projects Configuration Loader
 * Loads and parses TOML configuration for the projects page
 */

class ProjectsConfig {
    constructor() {
        this.config = null;
        this.fallbackConfig = this.getFallbackConfig();
    }

    async loadConfig() {
        try {
            const response = await fetch('./config/projects.toml');
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const tomlContent = await response.text();
            // Console log removed
            
            // Try multiple parsing approaches
            let parsedConfig;
            let parseMethod = 'unknown';
            
            // Try toml loader first
            if (window.tomlLoader) {
                try {
                    parsedConfig = await window.tomlLoader.parse(tomlContent);
                    parseMethod = 'tomlLoader';
                } catch (e) {
                    // Console warn removed;
                }
            }
            
            // Try direct access to loaded libraries
            if (!parsedConfig) {
                if (window.toml && window.toml.parse) {
                    try {
                        parsedConfig = window.toml.parse(tomlContent);
                        parseMethod = 'window.toml';
                    } catch (e) {
                        // Console warn removed;
                    }
                }
            }
            
            if (!parsedConfig) {
                if (window.TOML && window.TOML.parse) {
                    try {
                        parsedConfig = window.TOML.parse(tomlContent);
                        parseMethod = 'window.TOML';
                    } catch (e) {
                        // Console warn removed;
                    }
                }
            }
            
            // If all else fails, use the simple parser from tomlLoader
            if (!parsedConfig && window.tomlLoader) {
                try {
                    const simpleParser = window.tomlLoader.createSimpleTomlParser();
                    parsedConfig = simpleParser.parse(tomlContent);
                    parseMethod = 'simpleParser';
                } catch (e) {
                    // Console warn removed;
                }
            }
            
            if (!parsedConfig) {
                throw new Error('All TOML parsing methods failed');
            }
            
            this.config = parsedConfig;
            // Console log removed
            return this.config;
        } catch (error) {
            // Console warn removed;
            this.config = this.fallbackConfig;
            return this.config;
        }
    }

    getConfig() {
        return this.config || this.fallbackConfig;
    }

    // Check if a feature is enabled
    isEnabled(section, feature = null) {
        const config = this.getConfig();
        
        if (feature) {
            return config[section]?.[feature] === true;
        }
        
        return config[section]?.enabled === true;
    }

    // Get section configuration
    getSection(sectionName) {
        const config = this.getConfig();
        return config[sectionName] || {};
    }

    // Get page metadata
    getPageMeta() {
        const config = this.getConfig();
        return {
            title: config.page?.title || 'Projects',
            subtitle: config.page?.subtitle || 'A showcase of my recent work',
            description: config.seo?.meta_description || 'My projects - Developer, Designer, Creator'
        };
    }

    // Generate CSS display rules based on configuration
    generateDisplayRules() {
        const config = this.getConfig();
        const rules = [];

        // Navigation features
        if (!this.isEnabled('navigation', 'show_theme_toggle')) {
            rules.push('#theme-toggle { display: none !important; }');
        }
        if (!this.isEnabled('navigation', 'show_mobile_menu')) {
            rules.push('#mobile-menu-toggle { display: none !important; }');
        }

        // Analytics sections
        if (!this.isEnabled('analytics')) {
            rules.push('.analytics-section { display: none !important; }');
            // Console log removed
        } else {
            if (!this.isEnabled('analytics', 'charts')) {
                rules.push('.analytics-card:has(canvas) { display: none !important; }');
            }
            if (!this.isEnabled('analytics', 'timeline')) {
                rules.push('.analytics-card.timeline { display: none !important; }');
            }
            if (!this.isEnabled('analytics', 'statistics')) {
                rules.push('#projectStats { display: none !important; }');
            }
        }

        // Project sections
        if (!this.isEnabled('featured_projects')) {
            rules.push('[data-section="featured-projects"] { display: none !important; }');
        }
        if (!this.isEnabled('project_stats')) {
            rules.push('[data-section="project-stats"] { display: none !important; }');
        }
        if (!this.isEnabled('opensource')) {
            rules.push('[data-section="opensource"] { display: none !important; }');
        }
        if (!this.isEnabled('side_projects')) {
            rules.push('[data-section="side-projects"] { display: none !important; }');
        }
        if (!this.isEnabled('contact_cta')) {
            rules.push('[data-section="contact-cta"] { display: none !important; }');
        }

        // Footer
        if (!this.isEnabled('footer')) {
            rules.push('.footer { display: none !important; }');
        }

        // UI features
        if (!this.isEnabled('ui', 'animations')) {
            rules.push('* { transition: none !important; animation: none !important; }');
        }

        return rules;
    }

    // Apply configuration styles
    applyStyles() {
        const rules = this.generateDisplayRules();
        
        if (rules.length > 0) {
            const styleElement = document.createElement('style');
            styleElement.id = 'projects-config-styles';
            styleElement.textContent = rules.join('\n');
            document.head.appendChild(styleElement);
        }

        // Add data attributes for CSS targeting
        if (!this.isEnabled('analytics')) {
            document.body.setAttribute('data-analytics-disabled', 'true');
            // Console log removed
        }

        // Apply theme-specific configurations
        this.applyThemeConfig();
        this.applyAccessibilityConfig();
        this.applyPerformanceConfig();
    }

    applyThemeConfig() {
        const config = this.getConfig();
        
        if (config.navigation?.sticky_navigation) {
            document.querySelector('.nav')?.classList.add('sticky');
        }

        if (config.ui?.smooth_scrolling) {
            document.documentElement.style.scrollBehavior = 'smooth';
        }

        if (config.accessibility?.high_contrast_mode) {
            document.documentElement.classList.add('high-contrast');
        }
    }

    applyAccessibilityConfig() {
        const config = this.getConfig();
        
        if (config.accessibility?.focus_indicators) {
            document.documentElement.classList.add('enhanced-focus');
        }

        if (config.accessibility?.keyboard_navigation) {
            this.setupKeyboardNavigation();
        }
    }

    applyPerformanceConfig() {
        const config = this.getConfig();
        
        if (config.performance?.lazy_load_images) {
            this.setupLazyLoading();
        }

        if (config.performance?.preload_critical_content) {
            this.preloadCriticalResources();
        }
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Escape key to close modals/menus
            if (e.key === 'Escape') {
                document.querySelector('.nav-links')?.classList.remove('mobile-open');
            }
        });
    }

    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            imageObserver.unobserve(img);
                        }
                    }
                });
            });

            // Observe all images with data-src attribute
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    preloadCriticalResources() {
        // Preload critical CSS and fonts
        const criticalResources = [
            { href: './css/projects.css', as: 'style' },
            { href: 'https://rsms.me/inter/inter.css', as: 'style' }
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource.href;
            link.as = resource.as;
            if (resource.crossorigin) link.crossOrigin = resource.crossorigin;
            document.head.appendChild(link);
        });
    }

    // Get fallback configuration
    getFallbackConfig() {
        return {
            page: {
                title: "Projects",
                subtitle: "A showcase of my recent work in web development, design, and open source contributions."
            },
            content: {
                enable_markdown_content: true,
                enable_fallback_content: true,
                show_intro: true,
                show_loading_indicator: true
            },
            navigation: {
                enabled: true,
                show_theme_toggle: true,
                show_mobile_menu: true,
                sticky_navigation: false
            },
            featured_projects: {
                enabled: true,
                title: "Featured Work",
                show_tech_stack: true,
                show_features_list: true,
                show_project_links: true,
                enable_hover_effects: true,
                show_categories: true
            },
            project_stats: {
                enabled: true,
                title: "Project Overview",
                show_completed_count: true,
                show_active_count: true,
                show_opensource_count: true,
                show_technologies_count: true,
                animate_numbers: true
            },
            analytics: {
                enabled: true,
                title: "Project Analytics & Activity",
                description: "Development metrics and project insights",
                charts: {
                    enabled: true,
                    weekly_activity: true,
                    project_distribution: true,
                    show_chart_descriptions: true
                },
                timeline: {
                    enabled: true,
                    title: "Recent Project Milestones",
                    description: "Latest project updates and achievements",
                    show_event_types: true,
                    max_events: 10
                },
                statistics: {
                    enabled: true,
                    show_animated_stats: true,
                    show_stat_descriptions: true
                }
            },
            opensource: {
                enabled: true,
                title: "Open Source Contributions",
                show_github_stats: true,
                show_contribution_details: true,
                show_repository_links: true,
                show_star_counts: true
            },
            side_projects: {
                enabled: true,
                title: "Side Projects",
                show_descriptions: true,
                show_tech_focus: true,
                grid_layout: true
            },
            contact_cta: {
                enabled: true,
                text: "Interested in collaborating or learning more about any of these projects?",
                link_text: "Let's connect!",
                link_url: "contact.html"
            },
            footer: {
                enabled: true,
                text: "Built with",
                link_text: "Marked.js",
                link_url: "https://github.com/markedjs/marked",
                year: new Date().getFullYear()
            },
            ui: {
                animations: true,
                smooth_scrolling: true,
                back_to_top: false,
                breadcrumbs: false,
                progress_indicator: false
            },
            accessibility: {
                high_contrast_mode: false,
                focus_indicators: true,
                screen_reader_support: true,
                keyboard_navigation: true
            },
            performance: {
                lazy_load_images: true,
                preload_critical_content: true,
                enable_service_worker: false,
                cache_content: true
            },
            interactive: {
                project_filtering: false,
                search_functionality: false,
                sort_options: false,
                bookmarking: false,
                sharing_buttons: false
            },
            development: {
                debug_mode: false,
                performance_metrics: false,
                error_logging: false,
                feature_flags: true
            }
        };
    }

    // Debug helper
    logConfig() {
        // Console log removed
    }
}

// Create global instance
window.projectsConfig = new ProjectsConfig();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProjectsConfig;
}