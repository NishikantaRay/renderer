class MinimalPortfolio {
  constructor() {
    this.currentTheme =
      localStorage.getItem("theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");
    this.contentCache = new Map();

    this.init();
  }

  init() {
    this.setupTheme();
    this.setupEventListeners();
    this.loadAllContent();
    this.setupNavigation();
    this.setupDashboard();
    this.setupSocialLinks();
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
    // Initialize dashboard with configuration
    setTimeout(() => {
      if (window.DASHBOARD_CONFIG) {
        this.initializeCharts();
        this.updateStats();
        this.initializeSkillsProgress();
        this.populateRecentActivity();
        this.initializeCodeQuality();
        this.initializeLearningProgress();
      }
    }, 100);
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

  setupSocialLinks() {
    // Check if social config is available
    if (typeof window.SOCIAL_CONFIG === "undefined") {
      console.warn("Social config not found");
      return;
    }

    const socialContainer = document.getElementById("social-links");
    if (!socialContainer) return;

    // Generate and insert social links HTML
    socialContainer.innerHTML = window.SOCIAL_CONFIG.generateSocialLinksHTML();
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
