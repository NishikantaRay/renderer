class PortfolioPage {
  constructor() {
    this.currentTheme =
      localStorage.getItem("theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");

    this.init();
  }

  init() {
    this.setupTheme();
    this.setupEventListeners();
    this.loadContent();
  }

  setupTheme() {
    document.documentElement.setAttribute("data-theme", this.currentTheme);

    // Listen for system theme changes
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (e) => {
        if (!localStorage.getItem("theme")) {
          this.currentTheme = e.matches ? "dark" : "light";
          document.documentElement.setAttribute(
            "data-theme",
            this.currentTheme
          );
        }
      });
  }

  setupEventListeners() {
    // Theme toggle
    document.getElementById("theme-toggle").addEventListener("click", () => {
      this.currentTheme = this.currentTheme === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", this.currentTheme);
      localStorage.setItem("theme", this.currentTheme);
    });

    // Mobile menu toggle
    const mobileToggle = document.getElementById("mobile-menu-toggle");
    const navLinks = document.querySelector(".nav-links");

    if (mobileToggle && navLinks) {
      mobileToggle.addEventListener("click", () => {
        navLinks.classList.toggle("mobile-open");
      });

      // Close mobile menu when clicking outside
      document.addEventListener("click", (e) => {
        if (!mobileToggle.contains(e.target) && !navLinks.contains(e.target)) {
          navLinks.classList.remove("mobile-open");
        }
      });
    }
  }

  async loadContent() {
    try {
      // Load social configuration
      const socialConfig = await this.loadSocialConfig();
      
      const response = await fetch("./content/contact.md");
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const markdown = await response.text();
      const html = marked.parse(markdown);

      this.renderContent(html, socialConfig);
    } catch (error) {
      console.error("Failed to load content:", error);
      this.renderFallbackContent();
    }
  }

  async loadSocialConfig() {
    try {
      // Use the global social config instance
      if (window.socialConfig) {
        await window.socialConfig.init();
        return window.socialConfig.config || this.getSocialFallback();
      }
      throw new Error('Social config not available');
    } catch (error) {
      console.warn('Loading social config fallback:', error);
      return this.getSocialFallback();
    }
  }

  getSocialFallback() {
    return {
      settings: {
        show_text: true,
        show_tooltips: true,
        max_visible: 6,
        icon_size: "20px",
        spacing: "1rem"
      },
      links: [
        {
          id: "github",
          name: "GitHub",
          url: "https://github.com/NishikantaRay",
          icon: "fab fa-github",
          target: "_blank",
          enabled: true
        },
        {
          id: "linkedin",
          name: "LinkedIn", 
          url: "https://linkedin.com/in/nishikantaray",
          icon: "fab fa-linkedin",
          target: "_blank",
          enabled: true
        },
        {
          id: "twitter",
          name: "Twitter",
          url: "https://twitter.com/nishikantaray",
          icon: "fab fa-twitter",
          target: "_blank",
          enabled: true
        },
        {
          id: "email",
          name: "Email",
          url: "mailto:nishikantaray@example.com",
          icon: "fas fa-envelope",
          target: "_self",
          enabled: true
        }
      ]
    };
  }

  renderContent(html, socialConfig) {
    const container = document.getElementById("content");
    if (container) {
      const socialLinksHtml = this.generateSocialLinks(socialConfig);
      container.innerHTML = html + socialLinksHtml;
      container.classList.add("fade-in");
      this.setupContentLinks(container);
    }
  }

  generateSocialLinks(config) {
    const enabledLinks = config.links.filter(link => link.enabled);
    const visibleLinks = enabledLinks.slice(0, config.settings.max_visible);
    
    const linksHtml = visibleLinks.map(link => `
      <a href="${link.url}" 
         target="${link.target}" 
         rel="noopener noreferrer" 
         class="social-link"
         title="${link.name}">
        <i class="${link.icon}"></i>
        ${config.settings.show_text ? `<span>${link.name}</span>` : ''}
      </a>
    `).join('');

    return `
      <div class="social-links">
        ${linksHtml}
      </div>
    `;
  }

  renderFallbackContent() {
    const container = document.getElementById("content");
    if (container) {
      const socialConfig = this.getSocialFallback();
      const socialLinksHtml = this.generateSocialLinks(socialConfig);
      
      container.innerHTML = `
        <div class="contact-content">
          <p class="intro">Let's connect! I'm always interested in discussing new opportunities, collaborating on projects, or just having a conversation about technology and design.</p>
          
          <div class="contact-info">
            <h2>Get In Touch</h2>
            <p>Feel free to reach out through any of these channels:</p>
            <p><a href="mailto:nishikantaray@example.com">nishikantaray@example.com</a></p>
          </div>

          ${socialLinksHtml}

          <div class="status-section">
            <h2>Current Status</h2>
            <div class="status-indicator">
              <span class="status-dot"></span>
              <span>Available for new opportunities</span>
            </div>
            <p>I'm currently open to frontend/full-stack opportunities, freelance projects, and interesting collaborations.</p>
            <p>Response time: Usually within 24-48 hours</p>
          </div>

          <div class="status-section">
            <h2>What I Do</h2>
            <p>Frontend development • Full-stack applications • UI/UX design • Performance optimization</p>
          </div>
        </div>
      `;
      container.classList.add("fade-in");
      this.setupContentLinks(container);
    }
  }

  renderError() {
    const container = document.getElementById("content");
    if (container) {
      container.innerHTML = `
                        <p style="color: var(--text-muted); text-align: center; padding: 2rem;">
                            Content not available. Please check back later.
                        </p>
                    `;
    }
  }

  setupContentLinks(container) {
    // Open external links in new tab
    container.querySelectorAll('a[href^="http"]').forEach((link) => {
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
    });
  }
}

// Initialize app when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => new PortfolioPage());
} else {
  new PortfolioPage();
}
