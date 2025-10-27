/**
 * Fast Portfolio Initialization
 * Optimized loading sequence for maximum performance
 */

class FastPortfolioInit {
    constructor() {
        this.initStartTime = performance.now();
        this.criticalResourcesLoaded = false;
        this.enhancementsLoaded = false;
    }

    async init() {
        console.log('🚀 Starting fast portfolio initialization...');
        
        // Phase 1: Critical content and basic functionality
        await this.loadCriticalContent();
        
        // Phase 2: Enhanced features (non-blocking)
        this.loadEnhancements();
        
        // Phase 3: Analytics and optional features
        this.scheduleOptionalFeatures();
        
        this.logPerformance();
    }

    async loadCriticalContent() {
        const startTime = performance.now();
        
        try {
            // Load only essential scripts for basic functionality
            await Promise.all([
                this.loadTOMLConfig(),
                this.setupTheme(),
                this.setupNavigation()
            ]);
            
            // Load hero content immediately
            await this.loadHeroContent();
            
            this.criticalResourcesLoaded = true;
            console.log(`✅ Critical content loaded in ${Math.round(performance.now() - startTime)}ms`);
            
        } catch (error) {
            console.error('Failed to load critical content:', error);
            this.fallbackInit();
        }
    }

    async loadTOMLConfig() {
        // Use the existing TOML loader but with timeout
        if (window.tomlLoader) {
            try {
                const config = await Promise.race([
                    this.loadHomeConfig(),
                    new Promise((_, reject) => setTimeout(() => reject(new Error('Config timeout')), 2000))
                ]);
                return config;
            } catch (error) {
                console.warn('Using fallback config due to:', error.message);
                return this.getFallbackConfig();
            }
        }
        return this.getFallbackConfig();
    }

    async loadHomeConfig() {
        try {
            const response = await fetch('./config/home.toml');
            if (response.ok) {
                const tomlText = await response.text();
                return window.tomlLoader ? await window.tomlLoader.parse(tomlText) : this.getFallbackConfig();
            }
        } catch (error) {
            console.warn('Failed to load home config:', error);
        }
        return this.getFallbackConfig();
    }

    getFallbackConfig() {
        return {
            hero: {
                name: "John Doe",
                title: "Software Engineer & Full Stack Developer",
                profile_image: "https://ui-avatars.com/api/?name=John+Doe&size=240&background=0D8ABC&color=fff",
                intro: ["A passionate Software Engineer with expertise in full-stack development."],
                actions: {
                    primary_text: "Hire Me",
                    primary_link: "resume.html",
                    secondary_text: "Let's Talk",
                    secondary_link: "contact.html"
                }
            }
        };
    }

    setupTheme() {
        return new Promise(resolve => {
            const currentTheme = localStorage.getItem("theme") || 
                (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
            
            document.documentElement.setAttribute("data-theme", currentTheme);
            
            // Setup theme toggle
            const themeToggle = document.getElementById("theme-toggle");
            if (themeToggle) {
                themeToggle.addEventListener("click", () => {
                    const newTheme = currentTheme === "dark" ? "light" : "dark";
                    document.documentElement.setAttribute("data-theme", newTheme);
                    localStorage.setItem("theme", newTheme);
                });
            }
            
            resolve();
        });
    }

    setupNavigation() {
        return new Promise(resolve => {
            // Mobile menu functionality
            const mobileToggle = document.getElementById("mobile-menu-toggle");
            const navLinks = document.getElementById("nav-links");
            
            if (mobileToggle && navLinks) {
                // Toggle mobile menu on hamburger click
                mobileToggle.addEventListener("click", (e) => {
                    e.stopPropagation(); // Prevent event bubbling
                    navLinks.classList.toggle("mobile-open");
                });
                
                // Close mobile menu when clicking on a navigation link
                navLinks.addEventListener("click", (e) => {
                    if (e.target.classList.contains("nav-link")) {
                        navLinks.classList.remove("mobile-open");
                    }
                });
                
                // Close mobile menu when clicking outside
                document.addEventListener("click", (e) => {
                    if (!e.target.closest(".nav")) {
                        navLinks.classList.remove("mobile-open");
                    }
                });
            }
            
            // Highlight current page
            document.querySelectorAll(".nav-link").forEach(link => {
                const href = link.getAttribute("href");
                link.classList.toggle("active", href === "index.html" || href === "./");
            });
            
            resolve();
        });
    }

    async loadHeroContent() {
        const config = await this.loadTOMLConfig();
        
        // Update profile image
        const profileImg = document.querySelector('.profile-img');
        if (profileImg && config.hero?.profile_image) {
            profileImg.src = config.hero.profile_image;
            profileImg.alt = config.hero.name || 'Profile';
        }
        
        // Update hero title
        const titleElement = document.querySelector('.hero-title');
        if (titleElement && config.hero?.name) {
            titleElement.textContent = config.hero.name;
        }
        
        // Update hero intro with fade-in
        const introElement = document.querySelector('.hero-intro');
        if (introElement && config.hero?.intro) {
            const introContent = Array.isArray(config.hero.intro) 
                ? config.hero.intro.map(p => `<p>${p}</p>`).join('')
                : `<p>${config.hero.intro}</p>`;
            
            introElement.innerHTML = introContent;
            introElement.classList.add('content-loaded');
        }
        
        // Update action buttons
        const actionsElement = document.querySelector('.hero-actions');
        if (config.hero?.actions) {
            const primaryBtn = document.querySelector('.btn-primary');
            const secondaryBtn = document.querySelector('.btn-secondary');
            
            if (primaryBtn) {
                primaryBtn.href = config.hero.actions.primary_link;
                const btnText = primaryBtn.querySelector('svg').nextSibling;
                if (btnText) btnText.textContent = ' ' + config.hero.actions.primary_text;
            }
            
            if (secondaryBtn) {
                secondaryBtn.href = config.hero.actions.secondary_link;
                const btnText = secondaryBtn.querySelector('svg').nextSibling;
                if (btnText) btnText.textContent = ' ' + config.hero.actions.secondary_text;
            }
        }
        
        if (actionsElement) {
            actionsElement.classList.add('content-loaded');
        }
    }

    loadEnhancements() {
        // Load these in the background without blocking
        setTimeout(async () => {
            try {
                await this.loadSocialLinks();
                await this.loadOptionalSections();
                this.enhancementsLoaded = true;
                console.log('✅ Enhancements loaded');
            } catch (error) {
                console.warn('Some enhancements failed to load:', error);
            }
        }, 100);
    }

    async loadSocialLinks() {
        try {
            const socialContainer = document.getElementById("social-links");
            if (!socialContainer) return;
            
            // Show loading state immediately
            socialContainer.innerHTML = `
                <div class="social-loading">
                    <div class="social-skeleton"></div>
                    <div class="social-skeleton"></div>
                    <div class="social-skeleton"></div>
                    <div class="social-skeleton"></div>
                    <div class="social-skeleton"></div>
                </div>
            `;
            
            // Wait for Font Awesome to be available before showing icons
            await this.waitForFontAwesome();
            
            // Load social configuration if available
            if (window.socialConfig && typeof window.socialConfig.init === 'function') {
                // Initialize social config with timeout
                const initPromise = window.socialConfig.init();
                const timeoutPromise = new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Social config timeout')), 1500)
                );
                
                try {
                    await Promise.race([initPromise, timeoutPromise]);
                    await window.socialConfig.updateSocialLinks('#social-links');
                } catch (error) {
                    console.warn('Social config failed or timed out, using fallback:', error);
                    this.loadFallbackSocialLinks();
                }
            } else {
                // Fallback social links - load directly without flash
                this.loadFallbackSocialLinks();
            }
        } catch (error) {
            console.warn('Failed to load social links, using fallback:', error);
            this.loadFallbackSocialLinks();
        }
    }

    async waitForFontAwesome() {
        // Check if Font Awesome is already loaded
        if (document.querySelector('link[href*="font-awesome"]')) {
            return new Promise((resolve) => {
                const checkFA = () => {
                    // Check if Font Awesome CSS is loaded by looking for FA class styles
                    const testEl = document.createElement('i');
                    testEl.className = 'fas fa-test';
                    testEl.style.position = 'absolute';
                    testEl.style.left = '-9999px';
                    document.body.appendChild(testEl);
                    
                    const styles = window.getComputedStyle(testEl);
                    const isLoaded = styles.fontFamily && (styles.fontFamily.includes('Font Awesome') || styles.fontFamily.includes('FontAwesome'));
                    
                    document.body.removeChild(testEl);
                    
                    if (isLoaded) {
                        resolve();
                    } else {
                        setTimeout(checkFA, 50);
                    }
                };
                
                // Start checking after a small delay
                setTimeout(checkFA, 100);
                
                // Fallback timeout
                setTimeout(resolve, 2000);
            });
        }
        return Promise.resolve();
    }

    loadFallbackSocialLinks() {
        const socialContainer = document.getElementById("social-links");
        if (socialContainer) {
            // Clear any existing content first
            socialContainer.innerHTML = '';
            
            // Add social links with Font Awesome icons if available, emoji fallback otherwise
            const hasFontAwesome = document.querySelector('link[href*="font-awesome"]');
            
            if (hasFontAwesome) {
                socialContainer.innerHTML = `
                    <a href="https://github.com/johndoe" target="_blank" class="social-link" title="GitHub" rel="noopener noreferrer">
                        <span class="social-icon"><i class="fab fa-github"></i></span>
                    </a>
                    <a href="https://linkedin.com/in/johndoe" target="_blank" class="social-link" title="LinkedIn" rel="noopener noreferrer">
                        <span class="social-icon"><i class="fab fa-linkedin"></i></span>
                    </a>
                    <a href="https://twitter.com/johndoe" target="_blank" class="social-link" title="Twitter" rel="noopener noreferrer">
                        <span class="social-icon"><i class="fab fa-twitter"></i></span>
                    </a>
                    <a href="mailto:john.doe@example.com" class="social-link" title="Email">
                        <span class="social-icon"><i class="fas fa-envelope"></i></span>
                    </a>
                    <a href="https://youtube.com/@johndoe" target="_blank" class="social-link" title="YouTube" rel="noopener noreferrer">
                        <span class="social-icon"><i class="fab fa-youtube"></i></span>
                    </a>
                `;
            } else {
                // Emoji fallback for when Font Awesome isn't available
                socialContainer.innerHTML = `
                    <a href="https://github.com/johndoe" target="_blank" class="social-link" title="GitHub" rel="noopener noreferrer">
                        <span class="social-icon">📂</span>
                    </a>
                    <a href="https://linkedin.com/in/johndoe" target="_blank" class="social-link" title="LinkedIn" rel="noopener noreferrer">
                        <span class="social-icon">💼</span>
                    </a>
                    <a href="https://twitter.com/johndoe" target="_blank" class="social-link" title="Twitter" rel="noopener noreferrer">
                        <span class="social-icon">🐦</span>
                    </a>
                    <a href="mailto:john.doe@example.com" class="social-link" title="Email">
                        <span class="social-icon">✉️</span>
                    </a>
                    <a href="https://youtube.com/@johndoe" target="_blank" class="social-link" title="YouTube" rel="noopener noreferrer">
                        <span class="social-icon">📺</span>
                    </a>
                `;
            }
        }
    }

    async loadOptionalSections() {
        const config = await this.loadTOMLConfig();
        
        // Only load sections that are enabled
        if (config.freelance_clients?.enabled) {
            this.loadFreelanceSection();
        }
        
        if (config.latest_products?.enabled) {
            this.loadProductsSection();
        }
    }

    loadFreelanceSection() {
        const section = document.getElementById('freelance-projects');
        if (section) {
            section.style.display = 'block';
            section.classList.add('section-visible');
        }
    }

    loadProductsSection() {
        const section = document.getElementById('latest-products');
        if (section) {
            section.style.display = 'block';
            section.classList.add('section-visible');
        }
    }

    scheduleOptionalFeatures() {
        // Load heavy features after user interaction or timeout
        const loadHeavyFeatures = () => {
            // Marked.js is now loaded on-demand in home.js when needed
            // This space can be used for other optional features
            console.log('🔧 Optional features area ready for future enhancements');
        };

        // Load after user interaction or 3 seconds
        const events = ['click', 'scroll', 'keydown', 'touchstart'];
        const loadOnce = () => {
            events.forEach(event => document.removeEventListener(event, loadOnce));
            loadHeavyFeatures();
        };

        events.forEach(event => document.addEventListener(event, loadOnce, { passive: true }));
        setTimeout(loadOnce, 3000);
    }

    fallbackInit() {
        console.warn('Using fallback initialization');
        
        // Basic theme setup
        this.setupTheme();
        this.setupNavigation();
        
        // Show basic content
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle && !heroTitle.textContent.trim()) {
            heroTitle.textContent = 'Nishikanta Ray';
        }
    }

    logPerformance() {
        const totalTime = performance.now() - this.initStartTime;
        console.log(`🏁 Portfolio initialized in ${Math.round(totalTime)}ms`);
        
        // Log to performance observer if available
        if ('performance' in window && 'measure' in performance) {
            performance.mark('portfolio-init-end');
            performance.measure('portfolio-init', 'portfolio-init-start', 'portfolio-init-end');
        }
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        performance.mark('portfolio-init-start');
        new FastPortfolioInit().init();
    });
} else {
    performance.mark('portfolio-init-start');
    new FastPortfolioInit().init();
}

// Export for debugging
window.FastPortfolioInit = FastPortfolioInit;