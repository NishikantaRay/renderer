class ResumeTheme {
  constructor() {
    this.currentTheme =
      localStorage.getItem("theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");
    this.init();
  }

  async init() {
    this.applyTheme();
    this.setupEventListeners();
    await this.loadResumeContent();
  }

  setupEventListeners() {
    document
      .getElementById("theme-toggle")
      .addEventListener("click", () => this.toggleTheme());
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        this.currentTheme = e.matches ? 'dark' : 'light';
        this.applyTheme();
      }
    });
  }

  async loadResumeContent() {
    try {
      // Initialize and load TOML configuration
      const success = await window.resumeConfig.init();
      
      if (success) {
        // Console log removed
      } else {
        // Console warn removed;
      }
      
      // Update resume content
      await window.resumeConfig.updateResume('#resume-container');
      
    } catch (error) {
      // Console error removed;
      this.renderError();
    }
  }

  renderError() {
    const container = document.getElementById('resume-container');
    if (container) {
      container.innerHTML = `
        <div class="error" style="text-align: center; padding: 2rem; color: var(--text-muted);">
          <h2>Resume Content Not Available</h2>
          <p>Please check the configuration file: config/resume.toml</p>
          <button onclick="location.reload()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: var(--text-accent); color: white; border: none; border-radius: 4px; cursor: pointer;">
            Retry Loading
          </button>
        </div>
      `;
    }
  }

  toggleTheme() {
    this.currentTheme = this.currentTheme === "light" ? "dark" : "light";
    this.applyTheme();
    localStorage.setItem("theme", this.currentTheme);
  }

  applyTheme() {
    document.documentElement.setAttribute("data-theme", this.currentTheme);
    document.getElementById("theme-toggle").innerHTML =
      this.currentTheme === "light" ? "🌙 Theme" : "☀️ Theme";
  }
}

document.addEventListener("DOMContentLoaded", () => new ResumeTheme());
