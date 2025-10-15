class MinimalPortfolio {
  constructor() {
    this.currentTheme =
      localStorage.getItem("theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");
    this.contentCache = new Map();
    this.homeConfig = null;

    this.init().catch(error => console.error('Failed to initialize portfolio:', error));
  }

  async init() {
    this.setupTheme();
    this.setupEventListeners();
    await this.loadHomeConfig();
    await this.loadAllContent();
    this.setupNavigation();
    this.setupDashboard();
    await this.setupSocialLinks();
    await this.loadFreelanceProjects();
    await this.loadLatestProducts();
    this.updateHeroContent();
    this.updateSectionHeaders();
    this.updateFooter();
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
    const navLinks = document.getElementById("nav-links");
    if (mobileToggle && navLinks) {
      mobileToggle.addEventListener("click", () => {
        navLinks.classList.toggle("mobile-open");
      });

      // Close mobile menu when clicking on a link
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

    // Navigation - handle both internal links and external page links
    document.querySelectorAll(".nav-link, .nav-brand").forEach((link) => {
      link.addEventListener("click", (e) => {
        const href = e.target.getAttribute("href");

        // If it's an external page link (starts with /), let the browser handle it
        if (href && href.startsWith("/") && href !== "/") {
          return; // Let the browser handle the navigation
        }

        // If it's an internal anchor link, handle smooth scrolling
        if (href && href.startsWith("#")) {
          e.preventDefault();
          this.scrollToSection(href);
          this.updateActiveNav(href);
        }
      });
    });

    // Smooth scroll for internal links in content
    document.addEventListener("click", (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (link) {
        e.preventDefault();
        this.scrollToSection(link.getAttribute("href"));
      }
    });
  }

  setupNavigation() {
    // Since this is now a multipage structure, we don't need intersection observer
    // Just ensure the correct nav item is highlighted on page load
    this.highlightCurrentPage();
  }

  highlightCurrentPage() {
    // Highlight the Home nav item since we're on index.html (root)
    document.querySelectorAll(".nav-link").forEach((link) => {
      const href = link.getAttribute("href");
      link.classList.toggle("active", href === "/");
    });
  }

  scrollToSection(target) {
    const element = document.querySelector(target);
    if (element) {
      const offsetTop = element.offsetTop - 80;
      window.scrollTo({
        top: Math.max(0, offsetTop),
        behavior: "smooth",
      });
    }
  }

  updateActiveNav(target) {
    // For index.html, handle internal section navigation
    if (target && target.startsWith("#")) {
      document.querySelectorAll(".nav-link").forEach((link) => {
        const href = link.getAttribute("href");
        if (href && href.startsWith("#")) {
          link.classList.toggle("active", href === target);
        }
      });
    } else {
      // Ensure Home link stays active on index.html for external page navigation
      document.querySelectorAll(".nav-link").forEach((link) => {
        const href = link.getAttribute("href");
        if (href === "index.html") {
          link.classList.add("active");
        }
      });
    }
  }

  async loadHomeConfig() {
    try {
      console.log('Loading home configuration...');
      console.log('TOML library available:', typeof window.toml);
      
      // Try to load TOML configuration
      const response = await fetch('./config/home.toml');
      console.log('Fetch response status:', response.status, response.ok);
      
      if (response.ok) {
        const tomlText = await response.text();
        console.log('TOML text loaded, length:', tomlText.length);
        console.log('First 200 chars:', tomlText.substring(0, 200));
        
        // Use the global TOML parser if available
        if (window.toml && window.toml.parse) {
          this.homeConfig = window.toml.parse(tomlText);
          console.log('Home config loaded from TOML:', this.homeConfig);
        } else {
          console.error('TOML parser not available - using fallback');
          throw new Error('TOML parser not available');
        }
      } else {
        throw new Error('Failed to fetch home.toml');
      }
    } catch (error) {
      console.warn('Loading home config fallback:', error);
      this.homeConfig = this.getHomeConfigFallback();
      console.log('Using fallback config:', this.homeConfig);
    }
  }

  getHomeConfigFallback() {
    return {
      hero: {
        name: "Your Name",
        title: "Full-Stack Developer & Designer",
        intro: [
          "I work on web development, user experience design, and modern frontend technologies among other digital things.",
          "This website is an archive of my work and thoughts. Currently, I'm into React, TypeScript, and building modern web applications."
        ],
        actions: {
          primary_text: "Hire Me",
          primary_link: "resume.html",
          secondary_text: "Let's Talk",
          secondary_link: "#contact"
        }
      },
      freelance_clients: {
        enabled: true,
        title: "Trusted by Clients",
        subtitle: "Companies I've worked with",
        contact_email: "nishikantaray@example.com",
        contact_text: "Contact Me",
        clients: [
          {
            id: 1,
            name: "TechStart Inc.",
            logo: "🚀",
            logo_type: "emoji",
            status: "completed",
            period: "Oct-Dec 2024",
            project: "E-commerce Platform"
          },
          {
            id: 2,
            name: "DataCorp",
            logo: "📊",
            logo_type: "emoji",
            status: "completed",
            period: "Sep-Nov 2024",
            project: "Analytics Dashboard"
          }
        ]
      },
      latest_products: {
        enabled: true,
        title: "Latest Products",
        subtitle: "Tools and apps I've built",
        view_all_text: "View All Products",
        view_all_link: "projects.html#products",
        products: [
          {
            id: 1,
            title: "Portfolio Builder",
            description: "A drag-and-drop portfolio builder for developers and designers.",
            status: "launched",
            technologies: ["React", "Node.js", "MongoDB", "Tailwind"],
            version: "v2.1.0",
            users: "500+ users",
            live_url: "https://portfoliobuilder.example.com",
            github_url: "https://github.com/yourusername/portfolio-builder"
          },
          {
            id: 2,
            title: "Code Snippet Manager",
            description: "Organize, search, and share your code snippets with syntax highlighting.",
            status: "launched",
            technologies: ["Vue.js", "Firebase", "Prism.js", "PWA"],
            version: "v1.5.2",
            users: "250+ users",
            live_url: "https://snippets.example.com",
            github_url: "https://github.com/yourusername/snippet-manager"
          }
        ]
      },
      dashboard: {
        enabled: false,
        title: "Dashboard & Analytics",
        subtitle: "Development metrics and insights",
        sections: {
          charts: false,
          recent_activity: false,
          skills_progress: false,
          statistics: false,
          code_quality: false,
          learning_progress: false
        }
      },
      footer: {
        text: "Built with Marked.js",
        link: "https://github.com/markedjs/marked",
        year: 2024
      }
    };
  }

  updateHeroContent() {
    if (!this.homeConfig?.hero) return;

    const hero = this.homeConfig.hero;
    
    // Update hero title
    const titleElement = document.querySelector('.hero-title');
    if (titleElement && hero.name) {
      titleElement.textContent = hero.name;
    }

    // Update hero intro
    const introElement = document.querySelector('.hero-intro');
    if (introElement && hero.intro) {
      introElement.innerHTML = hero.intro.map(paragraph => `<p>${paragraph}</p>`).join('');
    }

    // Update action buttons
    if (hero.actions) {
      const primaryBtn = document.querySelector('.btn-primary');
      if (primaryBtn) {
        primaryBtn.href = hero.actions.primary_link;
        const btnText = primaryBtn.querySelector('svg').nextSibling;
        if (btnText) btnText.textContent = hero.actions.primary_text;
      }

      const secondaryBtn = document.querySelector('.btn-secondary');
      if (secondaryBtn) {
        secondaryBtn.href = hero.actions.secondary_link;
        const btnText = secondaryBtn.querySelector('svg').nextSibling;
        if (btnText) btnText.textContent = hero.actions.secondary_text;
      }
    }
  }

  updateFooter() {
    if (!this.homeConfig?.footer) return;

    const footer = this.homeConfig.footer;
    const footerElement = document.querySelector('.footer p');
    
    if (footerElement) {
      footerElement.innerHTML = `&copy; ${footer.year} ${this.homeConfig.hero?.name || 'Your Name'}. ${footer.text ? `Built with <a href="${footer.link}" target="_blank">${footer.text}</a>.` : ''}`;
    }
  }

  updateSectionHeaders() {
    // Update freelance clients section
    if (this.homeConfig?.freelance_clients) {
      const section = this.homeConfig.freelance_clients;
      const titleElement = document.querySelector('#freelance-projects .section-title');
      const subtitleElement = document.querySelector('#freelance-projects .section-subtitle');
      const contactBtn = document.querySelector('#freelance-projects .btn-outline');
      
      if (titleElement && section.title) titleElement.textContent = section.title;
      if (subtitleElement && section.subtitle) subtitleElement.textContent = section.subtitle;
      if (contactBtn && section.contact_email && section.contact_text) {
        contactBtn.href = `mailto:${section.contact_email}`;
        contactBtn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
          ${section.contact_text}
        `;
      }
    }

    // Update latest products section
    if (this.homeConfig?.latest_products) {
      const section = this.homeConfig.latest_products;
      const titleElement = document.querySelector('#latest-products .section-title');
      const subtitleElement = document.querySelector('#latest-products .section-subtitle');
      const viewAllBtn = document.querySelector('#latest-products .btn-outline');
      
      if (titleElement && section.title) titleElement.textContent = section.title;
      if (subtitleElement && section.subtitle) subtitleElement.textContent = section.subtitle;
      if (viewAllBtn && section.view_all_link && section.view_all_text) {
        viewAllBtn.href = section.view_all_link;
        viewAllBtn.textContent = section.view_all_text;
      }
    }
  }

  async loadAllContent() {
    const sections = ["about", "projects", "contact"];

    for (const section of sections) {
      await this.loadContent(section);
    }
  }

  async loadContent(section) {
    if (this.contentCache.has(section)) {
      this.renderContent(section, this.contentCache.get(section));
      return;
    }

    try {
      const response = await fetch(`./content/${section}.md`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const markdown = await response.text();
      const html = marked.parse(markdown);

      this.contentCache.set(section, html);
      this.renderContent(section, html);
    } catch (error) {
      console.error(`Failed to load ${section}:`, error);
      this.renderError(section);
    }
  }

  renderContent(section, html) {
    const container = document.getElementById(`${section}-content`);
    if (container) {
      container.innerHTML = html;
      container.classList.add("fade-in");
      this.setupContentLinks(container);
    }
  }

  renderError(section) {
    const container = document.getElementById(`${section}-content`);
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
  setupDashboard() {
    // Control dashboard visibility based on configuration
    this.controlDashboardSections();
    
    // Initialize dashboard with configuration
    setTimeout(() => {
      if (window.DASHBOARD_CONFIG && this.isDashboardEnabled()) {
        this.initializeCharts();
        this.updateStats();
        this.initializeSkillsProgress();
        this.populateRecentActivity();
        this.initializeCodeQuality();
        this.initializeLearningProgress();
      }
    }, 100);
  }

  isDashboardEnabled() {
    return this.homeConfig?.dashboard?.enabled === true;
  }

  controlDashboardSections() {
    const dashboardSection = document.getElementById('dashboard');
    if (!dashboardSection) return;

    // Show/hide main dashboard section
    if (this.isDashboardEnabled()) {
      dashboardSection.style.display = 'block';
      
      // Update dashboard title and subtitle
      if (this.homeConfig?.dashboard?.title) {
        const titleElement = dashboardSection.querySelector('.dashboard-title');
        if (titleElement) titleElement.textContent = this.homeConfig.dashboard.title;
      }
      
      // Control individual sections
      this.controlDashboardSubSections();
    } else {
      dashboardSection.style.display = 'none';
    }
  }

  controlDashboardSubSections() {
    const sections = this.homeConfig?.dashboard?.sections;
    if (!sections) return;

    // Control charts section
    const chartElements = document.querySelectorAll('[data-section="charts"]');
    chartElements.forEach(el => {
      el.style.display = sections.charts ? 'block' : 'none';
    });

    // Control recent activity
    const activityElements = document.querySelectorAll('[data-section="recent_activity"]');
    activityElements.forEach(el => {
      el.style.display = sections.recent_activity ? 'block' : 'none';
    });

    // Control skills progress
    const skillsElements = document.querySelectorAll('[data-section="skills_progress"]');
    skillsElements.forEach(el => {
      el.style.display = sections.skills_progress ? 'block' : 'none';
    });

    // Control statistics
    const statsElements = document.querySelectorAll('[data-section="statistics"]');
    statsElements.forEach(el => {
      el.style.display = sections.statistics ? 'block' : 'none';
    });

    // Control code quality
    const qualityElements = document.querySelectorAll('[data-section="code_quality"]');
    qualityElements.forEach(el => {
      el.style.display = sections.code_quality ? 'block' : 'none';
    });

    // Control learning progress
    const learningElements = document.querySelectorAll('[data-section="learning_progress"]');
    learningElements.forEach(el => {
      el.style.display = sections.learning_progress ? 'block' : 'none';
    });
  }

  initializeCharts() {
    const config = window.DASHBOARD_CONFIG;
    if (!config) return;

    const isDark = this.currentTheme === "dark";

    // Initialize different chart types based on configuration
    if (config.techStack.enabled) {
      this.initTechStackChart(config.techStack, isDark);
    }

    if (config.recentProjects.enabled) {
      this.initRecentProjectsChart(config.recentProjects, isDark);
    }

    if (config.performanceMetrics.enabled) {
      this.initPerformanceChart(config.performanceMetrics, isDark);
    }
  }

  initTechStackChart(stackConfig, isDark) {
    const ctx = document.getElementById("projectChart");
    if (!ctx) return;

    const colors = isDark
      ? stackConfig.categories.colors.dark
      : stackConfig.categories.colors.light;
    const textColor = isDark ? "#737373" : "#737373";
    const backgroundColor = isDark ? "#0a0a0a" : "#ffffff";

    new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: stackConfig.categories.labels,
        datasets: [
          {
            data: stackConfig.categories.values,
            backgroundColor: colors,
            borderColor: backgroundColor,
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
              color: textColor,
              font: { size: 11 },
              padding: 15,
              usePointStyle: true,
            },
          },
        },
        cutout: "65%",
      },
    });
  }

  initRecentProjectsChart(projectsConfig, isDark) {
    const ctx = document.getElementById("activityChart");
    if (!ctx) return;

    const datasets = projectsConfig.data.datasets.map((dataset) => ({
      label: dataset.label,
      data: dataset.data,
      borderColor: isDark ? dataset.colors.dark : dataset.colors.light,
      backgroundColor:
        (isDark ? dataset.colors.dark : dataset.colors.light) + "20",
      borderWidth: 2,
      fill: projectsConfig.chartType === "line",
      tension: 0.4,
      pointBackgroundColor: isDark ? dataset.colors.dark : dataset.colors.light,
      pointBorderColor: isDark ? "#0a0a0a" : "#ffffff",
      pointBorderWidth: 2,
      pointRadius: 4,
    }));

    const textColor = isDark ? "#737373" : "#737373";
    const borderColor = isDark ? "#262626" : "#e5e5e5";

    new Chart(ctx, {
      type: projectsConfig.chartType,
      data: {
        labels: projectsConfig.data.labels,
        datasets: datasets,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: projectsConfig.showLegend,
            position: "bottom",
            labels: {
              color: textColor,
              font: { size: 11 },
              padding: 15,
              usePointStyle: true,
            },
          },
        },
        scales: {
          x: {
            grid: {
              color: borderColor,
              borderColor: borderColor,
            },
            ticks: {
              color: textColor,
              font: { size: 11 },
            },
          },
          y: {
            grid: {
              color: borderColor,
              borderColor: borderColor,
            },
            ticks: {
              color: textColor,
              font: { size: 11 },
            },
            beginAtZero: true,
          },
        },
        elements: {
          point: {
            hoverRadius: 6,
          },
        },
      },
    });
  }

  updateStats() {
    const config = window.DASHBOARD_CONFIG;
    if (!config || !config.statistics.enabled) return;

    const statsContainer = document.getElementById("dashboardStats");
    if (!statsContainer) return;

    const isDark = this.currentTheme === "dark";

    // Generate stats HTML
    const statsHTML = config.statistics.metrics
      .map((metric) => {
        const color = isDark ? metric.color.dark : metric.color.light;
        return `
                        <div class="stat-item">
                            <div class="stat-icon">${metric.icon}</div>
                            <span class="stat-number" id="${metric.id}" style="color: ${color}">0${metric.suffix}</span>
                            <span class="stat-label">${metric.label}</span>
                        </div>
                    `;
      })
      .join("");

    statsContainer.innerHTML = statsHTML;

    // Animate stat numbers based on configuration
    config.statistics.metrics.forEach((metric) => {
      this.animateNumber(
        metric.id,
        0,
        metric.value,
        metric.suffix,
        metric.animationDuration
      );
    });
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

  initPerformanceChart(metricsConfig, isDark) {
    const ctx = document.getElementById("performanceChart");
    if (!ctx) return;

    const data = metricsConfig.data;
    const colors = isDark ? data.colors.dark : data.colors.light;
    const textColor = isDark ? "#737373" : "#737373";
    const borderColor = isDark ? "#262626" : "#e5e5e5";

    if (metricsConfig.chartType === "radar") {
      new Chart(ctx, {
        type: "radar",
        data: {
          labels: data.labels,
          datasets: [
            {
              label: "Performance Metrics",
              data: data.scores,
              borderColor: colors[0],
              backgroundColor: colors[0] + "20",
              borderWidth: 2,
              pointBackgroundColor: colors[0],
              pointBorderColor: isDark ? "#0a0a0a" : "#ffffff",
              pointBorderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
          },
          scales: {
            r: {
              beginAtZero: true,
              max: metricsConfig.maxScore,
              grid: { color: borderColor },
              angleLines: { color: borderColor },
              pointLabels: {
                color: textColor,
                font: { size: 11 },
              },
              ticks: {
                color: textColor,
                font: { size: 10 },
                stepSize: 20,
              },
            },
          },
        },
      });
    }
  }

  initializeSkillsProgress() {
    const config = window.DASHBOARD_CONFIG;
    if (!config || !config.skillsProgress.enabled) return;

    const skillsContainer = document.getElementById("skillsProgress");
    if (!skillsContainer) return;

    const isDark = this.currentTheme === "dark";

    const skillsHTML = config.skillsProgress.skills
      .map((skill, index) => {
        const color = isDark ? skill.color.dark : skill.color.light;
        const delay = index * config.skillsProgress.animationDelay;

        return `
                        <div class="skill-item" style="animation-delay: ${delay}ms">
                            <div class="skill-info">
                                <span class="skill-name">${skill.name}</span>
                                <span class="skill-percentage">${skill.progress}%</span>
                            </div>
                            <div class="skill-bar">
                                <div class="skill-progress" style="width: ${skill.progress}%; background-color: ${color}"></div>
                            </div>
                        </div>
                    `;
      })
      .join("");

    skillsContainer.innerHTML = skillsHTML;
  }

  populateRecentActivity() {
    const config = window.DASHBOARD_CONFIG;
    if (!config || !config.recentActivity.enabled) return;

    const activityContainer = document.getElementById("recentActivity");
    if (!activityContainer) return;

    const activities = config.recentActivity.activities.slice(
      0,
      config.recentActivity.maxItems
    );

    const activityHTML = activities
      .map((activity) => {
        const date = new Date(activity.date);
        const formattedDate =
          config.recentActivity.dateFormat === "MMM DD"
            ? date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })
            : date.toLocaleDateString();

        return `
                        <div class="activity-item">
                            ${
                              config.recentActivity.showIcons
                                ? `<span class="activity-icon">${activity.icon}</span>`
                                : ""
                            }
                            <div class="activity-content">
                                <div class="activity-title">${
                                  activity.title
                                }</div>
                                <div class="activity-description">${
                                  activity.description
                                }</div>
                                <div class="activity-date">${formattedDate}</div>
                            </div>
                        </div>
                    `;
      })
      .join("");

    activityContainer.innerHTML = activityHTML;
  }

  initializeCodeQuality() {
    const config = window.DASHBOARD_CONFIG;
    if (!config || !config.codeQuality.enabled) return;

    const qualityContainer = document.getElementById("codeQuality");
    if (!qualityContainer) return;

    const isDark = this.currentTheme === "dark";
    const metrics = config.codeQuality.metrics;

    const qualityHTML = Object.entries(metrics)
      .map(([key, metric]) => {
        const color = isDark ? metric.color.dark : metric.color.light;

        return `
                        <div class="quality-metric">
                            <div class="metric-label">${metric.label}</div>
                            <div class="metric-value" style="color: ${color}">${metric.value}%</div>
                            <div class="metric-bar">
                                <div class="metric-progress" style="width: ${metric.value}%; background-color: ${color}"></div>
                            </div>
                        </div>
                    `;
      })
      .join("");

    qualityContainer.innerHTML = qualityHTML;
  }

  initializeLearningProgress() {
    const config = window.DASHBOARD_CONFIG;
    if (!config || !config.learningProgress.enabled) return;

    const learningContainer = document.getElementById("learningProgress");
    if (!learningContainer) return;

    const isDark = this.currentTheme === "dark";

    const learningHTML = config.learningProgress.currentLearning
      .map((item) => {
        const color = isDark ? item.color.dark : item.color.light;

        return `
                        <div class="learning-item">
                            <div class="learning-header">
                                <span class="learning-topic">${
                                  item.topic
                                }</span>
                                <span class="learning-percentage">${
                                  item.progress
                                }%</span>
                            </div>
                            <div class="learning-bar">
                                <div class="learning-progress" style="width: ${
                                  item.progress
                                }%; background-color: ${color}"></div>
                            </div>
                            ${
                              config.learningProgress.showTargets
                                ? `<div class="learning-target">${item.target}</div>`
                                : ""
                            }
                        </div>
                    `;
      })
      .join("");

    learningContainer.innerHTML = learningHTML;
  }

  async setupSocialLinks() {
    // Use the new TOML-based social configuration
    if (typeof window.socialConfig === "undefined") {
      console.warn("TOML social config not found");
      return;
    }

    const socialContainer = document.getElementById("social-links");
    if (!socialContainer) return;

    try {
      // Ensure the configuration is loaded
      await window.socialConfig.init();
      
      // Update social links using the TOML configuration
      await window.socialConfig.updateSocialLinks('#social-links');
    } catch (error) {
      console.error('Failed to setup social links:', error);
      // Fallback to default
      socialContainer.innerHTML = '<p>Social links not available</p>';
    }
  }

  async loadFreelanceProjects() {
    const container = document.getElementById('freelanceProjectsContainer');
    if (!container) {
      console.error('Freelance projects container not found');
      return;
    }

    console.log('Loading freelance projects...');
    // Show loading state
    container.innerHTML = '<div class="projects-loading"><div class="loading-spinner"></div>Loading projects...</div>';

    try {
      // Simulate API call - replace with actual data source
      const projects = await this.getFreelanceProjects();
      console.log('Freelance projects loaded:', projects);
      this.renderFreelanceProjects(container, projects);
    } catch (error) {
      console.error('Failed to load freelance projects:', error);
      container.innerHTML = '<p style="text-align: center; color: var(--text-muted);">Failed to load projects</p>';
    }
  }

  async getFreelanceProjects() {
    // Return clients from configuration if available
    if (this.homeConfig?.freelance_clients?.clients) {
      return this.homeConfig.freelance_clients.clients;
    }

    // Fallback data if configuration is not available
    return [
      {
        id: 1,
        name: "TechStart Inc.",
        logo: "🚀",
        logo_type: "emoji",
        status: "completed",
        period: "Oct-Dec 2024",
        project: "E-commerce Platform"
      },
      {
        id: 2,
        name: "DataCorp",
        logo: "📊",
        logo_type: "emoji",
        status: "completed",
        period: "Sep-Nov 2024",
        project: "Analytics Dashboard"
      },
      {
        id: 3,
        name: "AppStudio",
        logo: "📱",
        logo_type: "emoji",
        status: "in-progress",
        period: "Dec 2024 - Present",
        project: "Mobile App Backend"
      }
    ];
  }

  renderFreelanceProjects(container, projects) {
    if (!projects || projects.length === 0) {
      container.innerHTML = '<p style="text-align: center; color: var(--text-muted);">No clients available</p>';
      return;
    }

    const projectsHtml = projects.map((project, index) => {
      // Determine logo display based on type
      let logoHtml;
      if (project.logo_type === 'image') {
        logoHtml = `<img src="${project.logo}" alt="${project.name}" class="client-logo-img">`;
      } else {
        // Default to emoji or text
        logoHtml = `<span class="client-logo-emoji">${project.logo}</span>`;
      }

      return `
        <div class="client-box" style="animation: slideInUp 0.6s ease ${index * 0.1}s both" title="${project.project} - ${project.period}">
          <div class="client-logo">${logoHtml}</div>
          <div class="client-name">${project.name}</div>
          <div class="client-status status-${project.status}"></div>
        </div>
      `;
    }).join('');

    container.innerHTML = projectsHtml;
  }

  async loadLatestProducts() {
    const container = document.getElementById('productsContainer');
    if (!container) {
      console.error('Products container not found');
      return;
    }

    console.log('Loading latest products...');
    // Show loading state
    container.innerHTML = '<div class="products-loading"><div class="loading-spinner"></div>Loading products...</div>';

    try {
      // Simulate API call - replace with actual data source
      const products = await this.getLatestProducts();
      console.log('Products loaded:', products);
      this.renderLatestProducts(container, products);
    } catch (error) {
      console.error('Failed to load latest products:', error);
      container.innerHTML = '<p style="text-align: center; color: var(--text-muted);">Failed to load products</p>';
    }
  }

  async getLatestProducts() {
    console.log('getLatestProducts called');
    
    // Return products from configuration if available
    if (this.homeConfig?.latest_products?.products && this.homeConfig.latest_products.products.length > 0) {
      console.log('Returning products from config:', this.homeConfig.latest_products.products.length, 'products');
      return this.homeConfig.latest_products.products;
    }

    console.log('Using fallback products');
    // Fallback data if configuration is not available
    return [
      {
        id: 1,
        title: "Portfolio Builder",
        description: "A drag-and-drop portfolio builder for developers and designers.",
        status: "launched",
        technologies: ["React", "Node.js", "MongoDB", "Tailwind"],
        version: "v2.1.0",
        users: "500+ users",
        live_url: "https://portfoliobuilder.example.com",
        github_url: "https://github.com/yourusername/portfolio-builder"
      },
      {
        id: 2,
        title: "Code Snippet Manager", 
        description: "Organize, search, and share your code snippets with syntax highlighting.",
        status: "launched",
        technologies: ["Vue.js", "Firebase", "Prism.js", "PWA"],
        version: "v1.5.2",
        users: "250+ users",
        live_url: "https://snippets.example.com",
        github_url: "https://github.com/yourusername/snippet-manager"
      }
    ];
  }

  renderLatestProducts(container, products) {
    console.log('renderLatestProducts called with:', products);
    
    if (!products || products.length === 0) {
      console.warn('No products to render, showing fallback message');
      container.innerHTML = '<p style="text-align: center; color: var(--text-muted);">No products available</p>';
      return;
    }

    console.log('Rendering', products.length, 'products');
    const productsHtml = products.map((product, index) => `
      <div class="product-card" style="animation: slideInUp 0.6s ease ${index * 0.1}s both" onclick="this.classList.toggle('expanded')">
        <div class="product-header">
          <h3 class="product-title">${product.title}</h3>
          <span class="product-status status-${product.status}">${product.status}</span>
        </div>
        <p class="product-description">${product.description}</p>
        <div class="product-tech">
          ${product.technologies ? product.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('') : ''}
        </div>
        <div class="product-meta">
          <div>
            <div class="product-users">${product.users || ''}</div>
          </div>
          <div class="product-version">${product.version || ''}</div>
        </div>
        ${product.live_url || product.github_url ? `
          <div class="product-links">
            ${product.live_url ? `<a href="${product.live_url}" class="product-link" target="_blank" title="View Product" onclick="event.stopPropagation()">🚀</a>` : ''}
            ${product.github_url ? `<a href="${product.github_url}" class="product-link" target="_blank" title="View Code" onclick="event.stopPropagation()">📂</a>` : ''}
          </div>
        ` : ''}
      </div>
    `).join('');

    container.innerHTML = productsHtml;
    console.log('Products rendered successfully');
    
    // Add click handlers for product cards
    container.querySelectorAll('.product-card').forEach(card => {
      card.addEventListener('click', (e) => {
        e.stopPropagation();
        // Toggle expanded state with animation
        if (card.classList.contains('expanded')) {
          card.classList.remove('expanded');
          card.style.transform = '';
        } else {
          card.classList.add('expanded');
          card.style.transform = 'scale(1.02)';
        }
      });
    });
  }
}

// Dashboard-specific functionality
class DashboardManager {
  constructor(portfolioInstance) {
    this.portfolio = portfolioInstance;
    this.charts = {};
  }

  initialize() {
    // Set up dashboard after portfolio is loaded
    setTimeout(() => {
      this.portfolio.setupDashboard();
    }, 500);
  }

  updateChartsTheme() {
    // Re-initialize charts when theme changes
    setTimeout(() => {
      this.portfolio.initializeCharts();
    }, 100);
  }
}

// Initialize app when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    const portfolio = new MinimalPortfolio();
    const dashboard = new DashboardManager(portfolio);
    dashboard.initialize();

    // Update charts when theme changes
    document.getElementById("theme-toggle").addEventListener("click", () => {
      setTimeout(() => dashboard.updateChartsTheme(), 200);
    });
  });
} else {
  const portfolio = new MinimalPortfolio();
  const dashboard = new DashboardManager(portfolio);
  dashboard.initialize();

  // Update charts when theme changes
  document.getElementById("theme-toggle").addEventListener("click", () => {
    setTimeout(() => dashboard.updateChartsTheme(), 200);
  });
}
