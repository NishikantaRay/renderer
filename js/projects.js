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
      this.renderFallbackContent();
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
      container.innerHTML = `
        <div class="projects-content">
          <p class="intro">Here are some of the projects I've worked on recently. Each represents a unique challenge and learning experience in modern web development.</p>
          
          <!-- Project Stats Overview -->
          <div class="project-stats">
            <div class="stat-card">
              <span class="stat-number">15+</span>
              <span class="stat-label">Projects Completed</span>
            </div>
            <div class="stat-card">
              <span class="stat-number">5</span>
              <span class="stat-label">Active Projects</span>
            </div>
            <div class="stat-card">
              <span class="stat-number">8+</span>
              <span class="stat-label">Open Source</span>
            </div>
            <div class="stat-card">
              <span class="stat-number">12+</span>
              <span class="stat-label">Technologies</span>
            </div>
          </div>
          
          <h2>Featured Work</h2>
          
          <div class="project-card" data-category="web-app" data-tech="react,typescript,nodejs">
            <h3>🌐 Modern Web App</h3>
            <p class="tech-stack"><em>React • TypeScript • Node.js • PostgreSQL</em></p>
            <p>A comprehensive full-stack web application featuring real-time collaboration, advanced data visualization, and progressive web app capabilities. Built with modern development practices and extensive testing coverage.</p>
            
            <div class="features">
              <strong>Key Features:</strong>
              <ul>
                <li>Real-time collaborative editing with WebSocket integration</li>
                <li>Advanced data visualization with D3.js and Chart.js</li>
                <li>Progressive Web App with offline functionality</li>
                <li>Comprehensive test coverage (90%+ code coverage)</li>
                <li>Responsive design optimized for all devices</li>
                <li>Role-based authentication and authorization</li>
              </ul>
            </div>
            
            <div class="project-links">
              <a href="https://example.com" target="_blank" rel="noopener noreferrer">🚀 Live Demo</a>
              <a href="https://github.com/yourusername/project" target="_blank" rel="noopener noreferrer">💻 GitHub</a>
              <a href="#" onclick="alert('Case study coming soon!')">📖 Case Study</a>
            </div>
          </div>

          <div class="project-card" data-category="dashboard" data-tech="vue,express,postgresql">
            <h3>📱 Mobile-First Dashboard</h3>
            <p class="tech-stack"><em>Vue.js • Express • PostgreSQL • Redis</em></p>
            <p>An intuitive analytics dashboard designed with mobile-first principles. Features interactive data visualizations, real-time updates, and accessibility compliance for enterprise use.</p>
            
            <div class="features">
              <strong>Key Features:</strong>
              <ul>
                <li>Interactive data visualizations with custom Vue components</li>
                <li>Real-time data updates using Server-Sent Events</li>
                <li>WCAG 2.1 AA accessibility compliance</li>
                <li>Advanced filtering and search capabilities</li>
                <li>Offline-first architecture with smart caching</li>
                <li>Multi-tenant support with role management</li>
              </ul>
            </div>
            
            <div class="project-links">
              <a href="https://example.com" target="_blank" rel="noopener noreferrer">🚀 Live Demo</a>
              <a href="https://github.com/yourusername/project" target="_blank" rel="noopener noreferrer">💻 GitHub</a>
              <a href="#" onclick="alert('Documentation available on GitHub!')">📚 Docs</a>
            </div>
          </div>

          <div class="project-card" data-category="design-system" data-tech="react,storybook,typescript">
            <h3>🎨 Component Design System</h3>
            <p class="tech-stack"><em>React • Storybook • TypeScript • Rollup</em></p>
            <p>A comprehensive design system and component library used across multiple products. Features automated testing, extensive documentation, and seamless integration workflows.</p>
            
            <div class="features">
              <strong>Key Features:</strong>
              <ul>
                <li>50+ reusable components with consistent API design</li>
                <li>Comprehensive Storybook documentation with examples</li>
                <li>Dark/light theme support with CSS custom properties</li>
                <li>Automated visual regression testing with Chromatic</li>
                <li>TypeScript definitions for enhanced developer experience</li>
                <li>Automated NPM publishing with semantic versioning</li>
              </ul>
            </div>
            
            <div class="project-links">
              <a href="https://example.com" target="_blank" rel="noopener noreferrer">🎨 Storybook</a>
              <a href="https://github.com/yourusername/project" target="_blank" rel="noopener noreferrer">💻 GitHub</a>
              <a href="#" onclick="alert('NPM package available!')">📦 NPM</a>
            </div>
          </div>

          <div class="project-card" data-category="tool" data-tech="javascript,markdown,css">
            <h3>🚀 Static Site Generator</h3>
            <p class="tech-stack"><em>JavaScript • Markdown • Sass • Rollup</em></p>
            <p>A fast, flexible static site generator optimized for blogs and documentation. Features hot reloading, plugin architecture, and exceptional build performance.</p>
            
            <div class="features">
              <strong>Key Features:</strong>
              <ul>
                <li>Lightning-fast builds with smart incremental compilation</li>
                <li>Plugin architecture for extensible functionality</li>
                <li>Hot module reloading for development efficiency</li>
                <li>SEO optimization with automatic meta tag generation</li>
                <li>Multiple theme support with easy customization</li>
                <li>Built-in syntax highlighting and code processing</li>
              </ul>
            </div>
            
            <div class="project-links">
              <a href="https://example.com" target="_blank" rel="noopener noreferrer">🚀 Live Demo</a>
              <a href="https://github.com/yourusername/project" target="_blank" rel="noopener noreferrer">💻 GitHub</a>
              <a href="#" onclick="alert('CLI tool available via NPM!')">⚡ CLI Tool</a>
            </div>
          </div>

          <h2>Open Source Contributions</h2>
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
          
          <p>I actively contribute to open source projects and maintain several popular repositories:</p>
          <ul style="list-style: none; padding: 0;">
            <li style="margin-bottom: 1rem; padding: 1rem; border: 1px solid var(--border); border-radius: 8px;">
              <strong>awesome-web-dev</strong> - Curated list of web development resources ⭐ 1.2k
              <br><small style="color: var(--text-muted);">Comprehensive collection of tools, libraries, and learning resources for modern web development</small>
            </li>
            <li style="margin-bottom: 1rem; padding: 1rem; border: 1px solid var(--border); border-radius: 8px;">
              <strong>react-hooks-collection</strong> - Useful React hooks library ⭐ 856
              <br><small style="color: var(--text-muted);">Production-ready custom React hooks for common use cases with TypeScript support</small>
            </li>
            <li style="margin-bottom: 1rem; padding: 1rem; border: 1px solid var(--border); border-radius: 8px;">
              <strong>css-grid-examples</strong> - CSS Grid layout examples ⭐ 432
              <br><small style="color: var(--text-muted);">Interactive examples and templates for CSS Grid layouts with responsive design patterns</small>
            </li>
          </ul>

          <h2>Side Projects</h2>
          
          <div class="side-projects">
            <div class="side-project">
              <h3>📝 Blog Platform</h3>
              <p>A minimalist blogging platform built with Next.js and markdown. Features automatic SEO optimization, comment system integration, and customizable themes.</p>
            </div>

            <div class="side-project">
              <h3>🔧 Developer Tools</h3>
              <p>A collection of CLI tools and browser extensions designed to improve developer productivity, including code formatters, build optimizers, and debugging utilities.</p>
            </div>

            <div class="side-project">
              <h3>🎯 Learning Projects</h3>
              <p>Experimental projects exploring cutting-edge technologies like WebAssembly, GraphQL federation, and serverless architectures to stay current with industry trends.</p>
            </div>

            <div class="side-project">
              <h3>🤖 AI-Powered Tools</h3>
              <p>Exploring machine learning integration in web applications, including natural language processing for content generation and computer vision for image analysis.</p>
            </div>
          </div>

          <div class="cta">
            <p><em>Interested in collaborating or learning more about any of these projects? <a href="contact.html">Let's connect!</a></em></p>
          </div>
        </div>
      `;
      container.classList.add("fade-in");
      this.setupContentLinks(container);
      this.addProjectInteractions();
    }
  }

  addProjectInteractions() {
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

    // Add filter functionality (can be extended)
    const techTags = document.querySelectorAll('[data-tech]');
    techTags.forEach(tag => {
      tag.addEventListener('click', (e) => {
        if (e.target.closest('.project-links')) return; // Don't filter when clicking links
        
        const tech = tag.getAttribute('data-tech');
        console.log('Project uses technologies:', tech);
        // Can implement filtering logic here
      });
    });

    // Animate stats on scroll
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
