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
    this.setupAnalytics();
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
      const response = await fetch("./content/projects.md");
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const markdown = await response.text();
      const html = marked.parse(markdown);

      this.renderContent(html);
    } catch (error) {
      console.error("Failed to load content:", error);
      this.renderError();
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

    // Initialize Weekly Activity Chart
    if (config.weeklyActivity.enabled) {
      this.initWeeklyActivityChart(config.weeklyActivity, isDark);
    }

    // Initialize Project Stats Chart
    if (config.projectStats.enabled) {
      this.initProjectStatsChart(config.projectStats, isDark);
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

    if (!timelineContainer || !config.timeline.enabled) return;

    const timelineHTML = config.timeline.events
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

    if (!statsContainer || !config.stats.enabled) return;

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

    // Animate numbers
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
