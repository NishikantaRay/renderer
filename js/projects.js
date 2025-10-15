class PortfolioPage {
  constructor() {
    this.currentTheme =
      localStorage.getItem("theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");
    
    this.config = null;
    this.init();
  }

  async init() {
    // Load configuration first
    await this.loadConfiguration();
    
    this.setupTheme();
    this.setupEventListeners();
    this.loadContent();
    this.setupAnalytics();
  }

  async loadConfiguration() {
    try {
      if (window.projectsConfig) {
        this.config = await window.projectsConfig.loadConfig();
        console.log('Projects config loaded:', this.config?.analytics?.enabled);
        window.projectsConfig.applyStyles();
        
        // Update page metadata based on configuration
        this.updatePageMetadata();
        
        // Apply configuration-based features
        this.applyConfigurationFeatures();
        
        // Force hide analytics section if disabled
        if (!window.projectsConfig.isEnabled('analytics')) {
          setTimeout(() => {
            const analyticsSection = document.querySelector('.analytics-section');
            if (analyticsSection) {
              analyticsSection.style.display = 'none';
              console.log('Force hiding analytics section after config load');
            }
          }, 100);
        }
      }
    } catch (error) {
      console.warn('Failed to load projects configuration:', error);
    }
  }

  updatePageMetadata() {
    if (!this.config) return;
    
    const meta = window.projectsConfig.getPageMeta();
    
    // Update page title and subtitle
    const pageTitle = document.querySelector('.page-title');
    if (pageTitle && meta.title) {
      pageTitle.textContent = meta.title;
    }
    
    const pageSubtitle = document.querySelector('.page-subtitle');
    if (pageSubtitle && meta.subtitle) {
      pageSubtitle.textContent = meta.subtitle;
    }
    
    // Update document title
    document.title = `${meta.title} - Your Name`;
    
    // Update meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && meta.description) {
      metaDesc.setAttribute('content', meta.description);
    }
  }

  applyConfigurationFeatures() {
    if (!this.config) return;
    
    // Apply performance optimizations
    if (window.projectsConfig.isEnabled('performance', 'lazy_load_images')) {
      this.setupLazyLoading();
    }
    
    // Apply UI enhancements
    if (window.projectsConfig.isEnabled('ui', 'back_to_top')) {
      this.addBackToTopButton();
    }
    
    // Apply interactive features
    if (window.projectsConfig.isEnabled('interactive', 'project_filtering')) {
      this.setupProjectFiltering();
    }
    
    // Setup debug mode if enabled
    if (window.projectsConfig.isEnabled('development', 'debug_mode')) {
      this.enableDebugMode();
    }
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
    // Check if markdown content is enabled
    if (!window.projectsConfig?.isEnabled('content', 'enable_markdown_content')) {
      this.renderFallbackContent();
      return;
    }

    try {
      const response = await fetch("./content/projects.md");
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const markdown = await response.text();
      const html = marked.parse(markdown);

      this.renderContent(html);
    } catch (error) {
      console.error("Failed to load content:", error);
      
      // Only show fallback if enabled in config
      if (window.projectsConfig?.isEnabled('content', 'enable_fallback_content')) {
        this.renderFallbackContent();
      } else {
        this.renderError();
      }
    }
  }

  renderContent(html) {
    const container = document.getElementById("content");
    if (container) {
      container.innerHTML = html;
      container.classList.add("fade-in");
      this.setupContentLinks(container);
    }
  }

  renderFallbackContent() {
    const container = document.getElementById("content");
    if (container) {
      let contentHTML = '';

      // Add intro if enabled
      if (window.projectsConfig?.isEnabled('content', 'show_intro')) {
        contentHTML += `
          <div class="projects-content">
            <p class="intro">Here are some of the projects I've worked on recently. Each represents a unique challenge and learning experience in modern web development.</p>
        `;
      } else {
        contentHTML += '<div class="projects-content">';
      }

      // Add project stats if enabled
      if (window.projectsConfig?.isEnabled('project_stats')) {
        const statsConfig = window.projectsConfig?.getSection('project_stats');
        contentHTML += this.generateProjectStats(statsConfig);
      }

      // Add featured projects if enabled
      if (window.projectsConfig?.isEnabled('featured_projects')) {
        const featuredConfig = window.projectsConfig?.getSection('featured_projects');
        contentHTML += this.generateFeaturedProjects(featuredConfig);
      }

      // Add open source section if enabled
      if (window.projectsConfig?.isEnabled('opensource')) {
        const opensourceConfig = window.projectsConfig?.getSection('opensource');
        contentHTML += this.generateOpenSourceSection(opensourceConfig);
      }

      // Add side projects if enabled
      if (window.projectsConfig?.isEnabled('side_projects')) {
        const sideProjectsConfig = window.projectsConfig?.getSection('side_projects');
        contentHTML += this.generateSideProjects(sideProjectsConfig);
      }

      // Add contact CTA if enabled
      if (window.projectsConfig?.isEnabled('contact_cta')) {
        const ctaConfig = window.projectsConfig?.getSection('contact_cta');
        contentHTML += this.generateContactCTA(ctaConfig);
      }

      contentHTML += '</div>';
      
      container.innerHTML = contentHTML;
      container.classList.add("fade-in");
      this.setupContentLinks(container);
      this.addProjectInteractions();
    }
  }

  generateProjectStats(config) {
    if (!config?.enabled) return '';
    
    return `
      <!-- Project Stats Overview -->
      <div class="project-stats" data-section="project-stats">
        ${config.show_completed_count ? '<div class="stat-card"><span class="stat-number">15+</span><span class="stat-label">Projects Completed</span></div>' : ''}
        ${config.show_active_count ? '<div class="stat-card"><span class="stat-number">5</span><span class="stat-label">Active Projects</span></div>' : ''}
        ${config.show_opensource_count ? '<div class="stat-card"><span class="stat-number">8+</span><span class="stat-label">Open Source</span></div>' : ''}
        ${config.show_technologies_count ? '<div class="stat-card"><span class="stat-number">12+</span><span class="stat-label">Technologies</span></div>' : ''}
      </div>
    `;
  }

  generateFeaturedProjects(config) {
    if (!config?.enabled) return '';
    
    const title = config?.title || 'Featured Work';
    
    return `
      <h2>${title}</h2>
      
      <div class="featured-projects" data-section="featured-projects">
        ${this.generateProjectCard({
          title: '🌐 Modern Web App',
          techStack: 'React • TypeScript • Node.js • PostgreSQL',
          description: 'A comprehensive full-stack web application featuring real-time collaboration, advanced data visualization, and progressive web app capabilities.',
          features: [
            'Real-time collaborative editing with WebSocket integration',
            'Advanced data visualization with D3.js and Chart.js',
            'Progressive Web App with offline functionality',
            'Comprehensive test coverage (90%+ code coverage)',
            'Responsive design optimized for all devices',
            'Role-based authentication and authorization'
          ],
          links: [
            { text: '🚀 Live Demo', url: 'https://example.com' },
            { text: '💻 GitHub', url: 'https://github.com/yourusername/project' },
            { text: '📖 Case Study', url: '#', onclick: "alert('Case study coming soon!')" }
          ],
          category: 'web-app',
          tech: 'react,typescript,nodejs'
        }, config)}
        
        ${this.generateProjectCard({
          title: '📱 Mobile-First Dashboard',
          techStack: 'Vue.js • Express • PostgreSQL • Redis',
          description: 'An intuitive analytics dashboard designed with mobile-first principles. Features interactive data visualizations, real-time updates, and accessibility compliance.',
          features: [
            'Interactive data visualizations with custom Vue components',
            'Real-time data updates using Server-Sent Events',
            'WCAG 2.1 AA accessibility compliance',
            'Advanced filtering and search capabilities',
            'Offline-first architecture with smart caching',
            'Multi-tenant support with role management'
          ],
          links: [
            { text: '🚀 Live Demo', url: 'https://example.com' },
            { text: '💻 GitHub', url: 'https://github.com/yourusername/project' },
            { text: '📚 Docs', url: '#', onclick: "alert('Documentation available on GitHub!')" }
          ],
          category: 'dashboard',
          tech: 'vue,express,postgresql'
        }, config)}
        
        ${this.generateProjectCard({
          title: '🎨 Component Design System',
          techStack: 'React • Storybook • TypeScript • Rollup',
          description: 'A comprehensive design system and component library used across multiple products. Features automated testing, extensive documentation, and seamless integration workflows.',
          features: [
            '50+ reusable components with consistent API design',
            'Comprehensive Storybook documentation with examples',
            'Dark/light theme support with CSS custom properties',
            'Automated visual regression testing with Chromatic',
            'TypeScript definitions for enhanced developer experience',
            'Automated NPM publishing with semantic versioning'
          ],
          links: [
            { text: '🎨 Storybook', url: 'https://example.com' },
            { text: '💻 GitHub', url: 'https://github.com/yourusername/project' },
            { text: '📦 NPM', url: '#', onclick: "alert('NPM package available!')" }
          ],
          category: 'design-system',
          tech: 'react,storybook,typescript'
        }, config)}
        
        ${this.generateProjectCard({
          title: '🚀 Static Site Generator',
          techStack: 'JavaScript • Markdown • Sass • Rollup',
          description: 'A fast, flexible static site generator optimized for blogs and documentation. Features hot reloading, plugin architecture, and exceptional build performance.',
          features: [
            'Lightning-fast builds with smart incremental compilation',
            'Plugin architecture for extensible functionality',
            'Hot module reloading for development efficiency',
            'SEO optimization with automatic meta tag generation',
            'Multiple theme support with easy customization',
            'Built-in syntax highlighting and code processing'
          ],
          links: [
            { text: '🚀 Live Demo', url: 'https://example.com' },
            { text: '💻 GitHub', url: 'https://github.com/yourusername/project' },
            { text: '⚡ CLI Tool', url: '#', onclick: "alert('CLI tool available via NPM!')" }
          ],
          category: 'tool',
          tech: 'javascript,markdown,css'
        }, config)}
      </div>
    `;
  }

  generateProjectCard(project, config) {
    return `
      <div class="project-card" data-category="${project.category}" data-tech="${project.tech}">
        <h3>${project.title}</h3>
        ${config?.show_tech_stack ? `<p class="tech-stack"><em>${project.techStack}</em></p>` : ''}
        <p>${project.description}</p>
        
        ${config?.show_features_list ? `
          <div class="features">
            <strong>Key Features:</strong>
            <ul>
              ${project.features.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
          </div>
        ` : ''}
        
        ${config?.show_project_links ? `
          <div class="project-links">
            ${project.links.map(link => `
              <a href="${link.url}" ${link.onclick ? `onclick="${link.onclick}"` : 'target="_blank" rel="noopener noreferrer"'}>${link.text}</a>
            `).join('')}
          </div>
        ` : ''}
      </div>
    `;
  }

  generateOpenSourceSection(config) {
    if (!config?.enabled) return '';
    
    const title = config?.title || 'Open Source Contributions';
    
    let content = `<h2>${title}</h2><div data-section="opensource">`;
    
    if (config?.show_github_stats) {
      content += `
        <div class="project-stats">
          <div class="stat-card">
            <span class="stat-number">1.2k</span>
            <span class="stat-label">GitHub Stars</span>
          </div>
          <div class="stat-card">
            <span class="stat-number">150+</span>
            <span class="stat-label">Pull Requests</span>
          </div>
          <div class="stat-card">
            <span class="stat-number">25+</span>
            <span class="stat-label">Repositories</span>
          </div>
          <div class="stat-card">
            <span class="stat-number">50+</span>
            <span class="stat-label">Contributors</span>
          </div>
        </div>
      `;
    }
    
    if (config?.show_contribution_details) {
      content += `
        <p>I actively contribute to open source projects and maintain several popular repositories:</p>
        <ul style="list-style: none; padding: 0;">
          <li style="margin-bottom: 1rem; padding: 1rem; border: 1px solid var(--border); border-radius: 8px;">
            <strong>awesome-web-dev</strong> - Curated list of web development resources ${config?.show_star_counts ? '⭐ 1.2k' : ''}
            <br><small style="color: var(--text-muted);">Comprehensive collection of tools, libraries, and learning resources for modern web development</small>
          </li>
          <li style="margin-bottom: 1rem; padding: 1rem; border: 1px solid var(--border); border-radius: 8px;">
            <strong>react-hooks-collection</strong> - Useful React hooks library ${config?.show_star_counts ? '⭐ 856' : ''}
            <br><small style="color: var(--text-muted);">Production-ready custom React hooks for common use cases with TypeScript support</small>
          </li>
          <li style="margin-bottom: 1rem; padding: 1rem; border: 1px solid var(--border); border-radius: 8px;">
            <strong>css-grid-examples</strong> - CSS Grid layout examples ${config?.show_star_counts ? '⭐ 432' : ''}
            <br><small style="color: var(--text-muted);">Interactive examples and templates for CSS Grid layouts with responsive design patterns</small>
          </li>
        </ul>
      `;
    }
    
    content += '</div>';
    return content;
  }

  generateSideProjects(config) {
    if (!config?.enabled) return '';
    
    const title = config?.title || 'Side Projects';
    
    return `
      <h2>${title}</h2>
      
      <div class="side-projects ${config?.grid_layout ? 'grid-layout' : ''}" data-section="side-projects">
        <div class="side-project">
          <h3>📝 Blog Platform</h3>
          ${config?.show_descriptions ? '<p>A minimalist blogging platform built with Next.js and markdown. Features automatic SEO optimization, comment system integration, and customizable themes.</p>' : ''}
        </div>

        <div class="side-project">
          <h3>🔧 Developer Tools</h3>
          ${config?.show_descriptions ? '<p>A collection of CLI tools and browser extensions designed to improve developer productivity, including code formatters, build optimizers, and debugging utilities.</p>' : ''}
        </div>

        <div class="side-project">
          <h3>🎯 Learning Projects</h3>
          ${config?.show_descriptions ? '<p>Experimental projects exploring cutting-edge technologies like WebAssembly, GraphQL federation, and serverless architectures to stay current with industry trends.</p>' : ''}
        </div>

        <div class="side-project">
          <h3>🤖 AI-Powered Tools</h3>
          ${config?.show_descriptions ? '<p>Exploring machine learning integration in web applications, including natural language processing for content generation and computer vision for image analysis.</p>' : ''}
        </div>
      </div>
    `;
  }

  generateContactCTA(config) {
    if (!config?.enabled) return '';
    
    return `
      <div class="cta" data-section="contact-cta">
        <p><em>${config?.text || 'Interested in collaborating?'} <a href="${config?.link_url || 'contact.html'}">${config?.link_text || "Let's connect!"}</a></em></p>
      </div>
    `;
  }

  addProjectInteractions() {
    // Only add interactions if enabled in config
    if (!window.projectsConfig?.isEnabled('featured_projects', 'enable_hover_effects')) {
      return;
    }

    // Add click handlers for project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-4px)';
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(-2px)';
      });
    });

    // Add filter functionality if enabled
    if (window.projectsConfig?.isEnabled('interactive', 'project_filtering')) {
      this.setupProjectFiltering();
    }

    // Animate stats on scroll if enabled
    if (window.projectsConfig?.isEnabled('project_stats', 'animate_numbers')) {
      this.setupStatsAnimation();
    }
  }

  setupStatsAnimation() {
    const statNumbers = document.querySelectorAll('.stat-number');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const text = element.textContent;
          const hasPlus = text.includes('+');
          const number = parseInt(text.replace(/[^0-9]/g, ''));
          
          this.animateNumber(element, 0, number, hasPlus ? '+' : '', 1000);
          observer.unobserve(element);
        }
      });
    });

    statNumbers.forEach(stat => observer.observe(stat));
  }

  setupProjectFiltering() {
    // Add filter functionality for project cards
    const techTags = document.querySelectorAll('[data-tech]');
    techTags.forEach(tag => {
      tag.addEventListener('click', (e) => {
        if (e.target.closest('.project-links')) return; // Don't filter when clicking links
        
        const tech = tag.getAttribute('data-tech');
        console.log('Project uses technologies:', tech);
        // Implement filtering logic here
        this.filterProjectsByTech(tech);
      });
    });
  }

  filterProjectsByTech(tech) {
    const allProjects = document.querySelectorAll('.project-card');
    allProjects.forEach(project => {
      const projectTech = project.getAttribute('data-tech');
      if (!tech || projectTech.includes(tech)) {
        project.style.display = 'block';
      } else {
        project.style.display = 'none';
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

  addBackToTopButton() {
    const backToTop = document.createElement('button');
    backToTop.innerHTML = '↑';
    backToTop.className = 'back-to-top';
    backToTop.style.cssText = `
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      width: 3rem;
      height: 3rem;
      border-radius: 50%;
      background: var(--accent);
      color: white;
      border: none;
      font-size: 1.2rem;
      cursor: pointer;
      opacity: 0;
      transition: opacity 0.3s ease;
      z-index: 1000;
    `;

    document.body.appendChild(backToTop);

    // Show/hide based on scroll position
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        backToTop.style.opacity = '1';
      } else {
        backToTop.style.opacity = '0';
      }
    });

    // Scroll to top on click
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  enableDebugMode() {
    console.log('🔧 Debug mode enabled for Projects page');
    console.log('Configuration:', window.projectsConfig?.getConfig());
    
    // Add debug info to page
    const debugInfo = document.createElement('div');
    debugInfo.style.cssText = `
      position: fixed;
      top: 10px;
      left: 10px;
      background: rgba(0,0,0,0.8);
      color: white;
      padding: 10px;
      border-radius: 5px;
      font-size: 12px;
      z-index: 9999;
      max-width: 300px;
    `;
    debugInfo.innerHTML = `
      <strong>Debug Mode</strong><br>
      Theme: ${this.currentTheme}<br>
      Config Loaded: ${!!this.config}<br>
      Analytics: ${window.projectsConfig?.isEnabled('analytics')}<br>
      Featured Projects: ${window.projectsConfig?.isEnabled('featured_projects')}
    `;
    document.body.appendChild(debugInfo);
  }

  animateNumber(element, start, end, suffix = "", duration = 1000) {
    const increment = (end - start) / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        current = end;
        clearInterval(timer);
      }
      element.textContent = Math.round(current) + suffix;
    }, 16);
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

  setupAnalytics() {
    // Only setup analytics if enabled in configuration
    if (!window.projectsConfig?.isEnabled('analytics')) {
      // Hide analytics section if disabled
      const analyticsSection = document.querySelector('.analytics-section');
      if (analyticsSection) {
        analyticsSection.style.display = 'none';
        console.log('Analytics section hidden via setupAnalytics');
      }
      return;
    }

    // Initialize analytics after a short delay to ensure DOM is ready
    setTimeout(() => {
      if (window.PROJECT_ANALYTICS_CONFIG) {
        this.initializeCharts();
        this.populateTimeline();
        this.populateStats();
      }
    }, 200);
  }

  initializeCharts() {
    const config = window.PROJECT_ANALYTICS_CONFIG;
    const isDark = this.currentTheme === "dark";

    // Initialize Weekly Activity Chart if enabled
    if (config.weeklyActivity.enabled && window.projectsConfig?.isEnabled('analytics', 'weekly_activity')) {
      this.initWeeklyActivityChart(config.weeklyActivity, isDark);
    } else {
      // Hide the chart container
      const chartContainer = document.getElementById("weeklyActivityChart")?.closest('.analytics-card');
      if (chartContainer) chartContainer.style.display = 'none';
    }

    // Initialize Project Stats Chart if enabled
    if (config.projectStats.enabled && window.projectsConfig?.isEnabled('analytics', 'project_distribution')) {
      this.initProjectStatsChart(config.projectStats, isDark);
    } else {
      // Hide the chart container
      const chartContainer = document.getElementById("projectStatsChart")?.closest('.analytics-card');
      if (chartContainer) chartContainer.style.display = 'none';
    }
  }

  initWeeklyActivityChart(activityConfig, isDark) {
    const ctx = document.getElementById("weeklyActivityChart");
    if (!ctx) return;

    const colors = activityConfig.colors;
    const chartColors = {
      commits: isDark ? colors.commits.dark : colors.commits.light,
      pullRequests: isDark
        ? colors.pullRequests.dark
        : colors.pullRequests.light,
      issues: isDark ? colors.issues.dark : colors.issues.light,
    };

    new Chart(ctx, {
      type: "line",
      data: {
        labels: activityConfig.data.labels,
        datasets: [
          {
            label: "Commits",
            data: activityConfig.data.commits,
            borderColor: chartColors.commits,
            backgroundColor: chartColors.commits + "20",
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: chartColors.commits,
            pointBorderColor: isDark ? "#0a0a0a" : "#ffffff",
            pointBorderWidth: 2,
            pointRadius: 4,
          },
          {
            label: "Pull Requests",
            data: activityConfig.data.pullRequests,
            borderColor: chartColors.pullRequests,
            backgroundColor: chartColors.pullRequests + "20",
            borderWidth: 2,
            fill: false,
            tension: 0.4,
            pointBackgroundColor: chartColors.pullRequests,
            pointBorderColor: isDark ? "#0a0a0a" : "#ffffff",
            pointBorderWidth: 2,
            pointRadius: 3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              color: isDark ? "#737373" : "#737373",
              padding: 15,
              usePointStyle: true,
              font: { size: 12 },
            },
          },
        },
        scales: {
          x: {
            grid: {
              color: isDark ? "#262626" : "#e5e5e5",
              borderColor: isDark ? "#262626" : "#e5e5e5",
            },
            ticks: {
              color: isDark ? "#737373" : "#737373",
              font: { size: 11 },
            },
          },
          y: {
            grid: {
              color: isDark ? "#262626" : "#e5e5e5",
              borderColor: isDark ? "#262626" : "#e5e5e5",
            },
            ticks: {
              color: isDark ? "#737373" : "#737373",
              font: { size: 11 },
            },
            beginAtZero: true,
          },
        },
      },
    });
  }

  initProjectStatsChart(statsConfig, isDark) {
    const ctx = document.getElementById("projectStatsChart");
    if (!ctx) return;

    const categoryData = statsConfig.data.categories;
    const colors = isDark
      ? categoryData.colors.dark
      : categoryData.colors.light;

    new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: categoryData.labels,
        datasets: [
          {
            data: categoryData.values,
            backgroundColor: colors,
            borderColor: isDark ? "#0a0a0a" : "#ffffff",
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              color: isDark ? "#737373" : "#737373",
              padding: 15,
              usePointStyle: true,
              font: { size: 12 },
            },
          },
        },
        cutout: "65%",
      },
    });
  }

  populateTimeline() {
    const config = window.PROJECT_ANALYTICS_CONFIG;
    const timelineContainer = document.getElementById("projectTimeline");

    if (!timelineContainer || !config.timeline.enabled || !window.projectsConfig?.isEnabled('analytics', 'timeline')) {
      const timelineCard = timelineContainer?.closest('.analytics-card');
      if (timelineCard) timelineCard.style.display = 'none';
      return;
    }

    const maxEvents = window.projectsConfig?.getSection('analytics')?.timeline?.max_events || 10;
    const eventsToShow = config.timeline.events.slice(0, maxEvents);

    const timelineHTML = eventsToShow
      .map(
        (event) => `
                    <li class="timeline-item">
                        <div class="timeline-date">${event.date}</div>
                        <div class="timeline-title">${event.title}</div>
                        <div class="timeline-description">${event.description}</div>
                    </li>
                `
      )
      .join("");

    timelineContainer.innerHTML = timelineHTML;
  }

  populateStats() {
    const config = window.PROJECT_ANALYTICS_CONFIG;
    const statsContainer = document.getElementById("projectStats");

    if (!statsContainer || !config.stats.enabled || !window.projectsConfig?.isEnabled('analytics', 'statistics')) {
      if (statsContainer) statsContainer.style.display = 'none';
      return;
    }

    const statsHTML = config.stats.metrics
      .map(
        (metric) => `
                    <div class="stat-item">
                        <span class="stat-number" id="${metric.id}">${metric.value}${metric.suffix}</span>
                        <span class="stat-label">${metric.label}</span>
                    </div>
                `
      )
      .join("");

    statsContainer.innerHTML = statsHTML;

    // Animate numbers if enabled
    if (window.projectsConfig?.isEnabled('analytics', 'show_animated_stats')) {
      config.stats.metrics.forEach((metric) => {
        this.animateNumber(
          metric.id,
          0,
          metric.value,
          metric.suffix,
          metric.animationDuration
        );
      });
    }
  }

  animateNumber(elementId, start, end, suffix = "", duration = 2000) {
    const element = document.getElementById(elementId);
    if (!element) return;

    const increment = (end - start) / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        current = end;
        clearInterval(timer);
      }
      element.textContent = Math.round(current) + suffix;
    }, 16);
  }
}

// Initialize app when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => new PortfolioPage());
} else {
  new PortfolioPage();
}
