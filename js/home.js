class MinimalPortfolio {
  constructor() {
    this.currentTheme =
      localStorage.getItem("theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");
    this.contentCache = new Map();
    this.homeConfig = null;    this.init().catch(error => console.error('Failed to initialize portfolio:', error));
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
      
      // Try to load TOML configuration
      const response = await fetch('./config/home.toml');
      console.log('Fetch response status:', response.status, response.ok);
      
      if (response.ok) {
        const tomlText = await response.text();
        console.log('TOML text loaded, length:', tomlText.length);
        console.log('First 200 chars:', tomlText.substring(0, 200));
        
        // Use the shared TOML loader
        try {
          this.homeConfig = await window.tomlLoader.parse(tomlText);
          console.log('Home config loaded from TOML:', this.homeConfig);
        } catch (parseError) {
          console.warn('TOML parsing failed, using fallback config:', parseError.message);
          this.homeConfig = this.getHomeConfigFallback();
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
        name: "Nishikanta Ray",
        title: "Full-Stack Developer & Designer",
        profile_image: "https://ui-avatars.com/api/?name=Your+Name&size=240&background=0D8ABC&color=fff",
        intro: [
          "I'm a passionate Software Engineer with expertise in full-stack development and a keen interest in creating innovative solutions. Currently working at <a href='https://letsflo.co' target='_blank' rel='noopener noreferrer'>@letsflo</a> and actively contributing to the open-source community.",
        
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
        subtitle: "Companies and projects I've worked with",
        contact_email: "nishikantaray1@gmail.com",
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
            name: "DataCorp Analytics",
            logo: "📊",
            logo_type: "emoji",
            status: "completed",
            period: "Sep-Nov 2024",
            project: "Analytics Dashboard"
          },
          {
            id: 3,
            name: "StudyTub Platform",
            logo: "📚",
            logo_type: "emoji",
            status: "active",
            period: "2024 - Present",
            project: "Educational Platform"
          },
          {
            id: 4,
            name: "Open Source Community",
            logo: "🌟",
            logo_type: "emoji",
            status: "ongoing",
            period: "2021 - Present",
            project: "FlexiFrame CSS Library"
          },
          {
            id: 5,
            name: "VS Code Community",
            logo: "🔧",
            logo_type: "emoji",
            status: "active",
            period: "2023 - Present",
            project: "Bootstrap 5 Extension"
          },
          {
            id: 6,
            name: "GitHub Community",
            logo: "⭐",
            logo_type: "emoji",
            status: "active",
            period: "2021 - Present",
            project: "Open Source Contributions"
          }
        ]
      },
      latest_products: {
        enabled: true,
        title: "Latest Products",
        subtitle: "Tools, apps, and libraries I've built",
        view_all_text: "View All Products",
        view_all_link: "projects.html#products",
        products: [
          {
            id: 1,
            title: "FlexiFrame CSS Library",
            description: "A comprehensive CSS library with 25+ components and advanced layouts using Sass, designed for scalability and maintainability.",
            status: "launched",
            technologies: ["Sass", "CSS", "BEM", "Components"],
            version: "v1.0.0",
            users: "Community driven",
            live_url: "https://github.com/NishikantaRay/FlexiFrame",
            github_url: "https://github.com/NishikantaRay/FlexiFrame"
          },
          {
            id: 2,
            title: "Bootstrap 5 Extension",
            description: "VS Code extension for Bootstrap 5 with 19k+ installs, providing code snippets and IntelliSense support.",
            status: "launched",
            technologies: ["TypeScript", "VS Code API", "Bootstrap 5"],
            version: "v2.1.0",
            users: "19k+ installs",
            live_url: "https://marketplace.visualstudio.com/items?itemName=NishikantaRay.bootstrap5-snippets",
            github_url: "https://github.com/NishikantaRay/bootstrap5-snippets"
          },
          {
            id: 3,
            title: "Portfolio Template",
            description: "A modern, responsive portfolio template with TOML configuration and multiple themes.",
            status: "launched",
            technologies: ["HTML", "CSS", "JavaScript", "TOML"],
            version: "v1.5.0",
            users: "100+ users",
            live_url: "https://nishikanta.in",
            github_url: "https://github.com/NishikantaRay/portfolio"
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
    
    // Update profile image
    const profileImg = document.querySelector('.profile-img');
    if (profileImg && hero.profile_image) {
      profileImg.src = hero.profile_image;
      profileImg.alt = hero.name || 'Profile';
    }
    
    // Update hero title
    const titleElement = document.querySelector('.hero-title');
    if (titleElement && hero.name) {
      titleElement.textContent = hero.name;
    }

    // Update hero intro
    const introElement = document.querySelector('.hero-intro');
    if (introElement && hero.intro) {
      // Handle both string and array formats
      let introContent;
      if (Array.isArray(hero.intro)) {
        introContent = hero.intro.map(paragraph => `<p>${paragraph}</p>`).join('');
      } else if (typeof hero.intro === 'string') {
        introContent = `<p>${hero.intro}</p>`;
      } else {
        console.warn('Hero intro is not a string or array:', typeof hero.intro, hero.intro);
        introContent = '<p>Welcome to my portfolio</p>';
      }
      introElement.innerHTML = introContent;
      // Show the intro content with smooth fade-in
      introElement.classList.add('content-loaded');
    }

    // Update action buttons
    const actionsElement = document.querySelector('.hero-actions');
    if (hero.actions) {
      const primaryBtn = document.querySelector('.btn-primary');
      if (primaryBtn) {
        primaryBtn.href = hero.actions.primary_link;
        const btnText = primaryBtn.querySelector('svg').nextSibling;
        if (btnText) btnText.textContent = ' ' + hero.actions.primary_text;
      }

      const secondaryBtn = document.querySelector('.btn-secondary');
      if (secondaryBtn) {
        secondaryBtn.href = hero.actions.secondary_link;
        // Add target="_blank" if the link is external
        if (hero.actions.secondary_link && (hero.actions.secondary_link.startsWith('http://') || hero.actions.secondary_link.startsWith('https://'))) {
          secondaryBtn.target = '_blank';
          secondaryBtn.rel = 'noopener noreferrer';
        }
        const btnText = secondaryBtn.querySelector('svg').nextSibling;
        if (btnText) btnText.textContent = ' ' + hero.actions.secondary_text;
      }
    }
    
    // Show the actions with smooth fade-in
    if (actionsElement) {
      actionsElement.classList.add('content-loaded');
    }
  }

  updateFooter() {
    const footerElement = document.querySelector('.footer p');
    const currentYear = new Date().getFullYear();
    const name = this.homeConfig?.hero?.name || 'Your Name';
    
    if (footerElement) {
      footerElement.innerHTML = `&copy; ${currentYear} ${name}. Built with <a href="https://renderer.nishikanta.in/" target="_blank" rel="noopener noreferrer">Renderer</a> ❤️`;
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
      dashboardSection.classList.add('section-visible');
      dashboardSection.style.display = 'block';
      
      // Update dashboard title and subtitle
      if (this.homeConfig?.dashboard?.title) {
        const titleElement = dashboardSection.querySelector('.dashboard-title');
        if (titleElement) titleElement.textContent = this.homeConfig.dashboard.title;
      }
      
      // Control individual sections
      this.controlDashboardSubSections();
    } else {
      dashboardSection.classList.remove('section-visible');
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
      socialContainer.innerHTML = `
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
        <a href="https://youtube.com/@nishikantaray5637" target="_blank" class="social-link" title="YouTube">
          <span class="social-icon"><i class="fab fa-youtube"></i></span>
        </a>
        <a href="https://instagram.com/nishikanta.ray" target="_blank" class="social-link" title="Instagram">
          <span class="social-icon"><i class="fab fa-instagram"></i></span>
        </a>
      `;
    }
  }

  async loadFreelanceProjects() {
    const section = document.getElementById('freelance-projects');
    
    // Check if freelance section is enabled
    if (this.homeConfig?.freelance_clients?.enabled === false) {
      if (section) {
        section.style.display = 'none';
        section.classList.remove('section-visible');
      }
      console.log('Freelance projects section disabled');
      return;
    }

    // Show the section if enabled
    if (section) {
      section.classList.add('section-visible');
    }

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
    const section = document.getElementById('latest-products');
    
    // Check if latest products section is enabled
    if (this.homeConfig?.latest_products?.enabled === false) {
      if (section) {
        section.style.display = 'none';
        section.classList.remove('section-visible');
      }
      console.log('Latest products section disabled');
      return;
    }

    // Show the section if enabled
    if (section) {
      section.classList.add('section-visible');
    }

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
        github_url: "https://github.com/NishikantaRay/portfolio-builder"
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
        github_url: "https://github.com/NishikantaRay/snippet-manager"
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
