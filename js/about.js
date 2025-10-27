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
  }

  async loadContent() {
    try {
      const response = await fetch("./content/about.md");
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const markdown = await response.text();
      const html = marked.parse(markdown);

      this.renderContent(html);
    } catch (error) {
      // Console error removed;
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
        <div class="about-content">
          <div class="intro-section">
            <p class="intro-text">I'm a passionate <strong>developer</strong> and <strong>designer</strong> who loves creating beautiful, functional digital experiences. With a focus on modern web technologies and user-centered design, I build applications that make a difference.</p>
          </div>

          <h2>What I Do</h2>
          <div class="what-i-do">
            <div class="service-item">
              <h3>🖥️ Frontend Development</h3>
              <p>Building responsive, accessible web applications</p>
            </div>
            <div class="service-item">
              <h3>🎨 UI/UX Design</h3>
              <p>Creating intuitive and beautiful user interfaces</p>
            </div>
            <div class="service-item">
              <h3>⚡ Full Stack Development</h3>
              <p>End-to-end application development</p>
            </div>
            <div class="service-item">
              <h3>🌟 Open Source</h3>
              <p>Contributing to the developer community</p>
            </div>
          </div>

          <h2>My Approach</h2>
          <div class="approach-section">
            <p>I believe in:</p>
            <ul class="approach-list">
              <li><strong>Clean, semantic code</strong> that's maintainable and scalable</li>
              <li><strong>User-first design</strong> that prioritizes accessibility and usability</li>
              <li><strong>Continuous learning</strong> and staying current with web standards</li>
              <li><strong>Collaboration</strong> and knowledge sharing</li>
            </ul>
          </div>

          <h2>Background</h2>
          <div class="background-section">
            <p>I have experience working with modern JavaScript frameworks, design systems, and cloud technologies. I enjoy solving complex problems and turning ideas into reality through code.</p>
            
            <p>When I'm not coding, you can find me:</p>
            <ul class="interests-list">
              <li>Reading about emerging technologies</li>
              <li>Contributing to open source projects</li>
              <li>Exploring new design trends</li>
              <li>Learning new programming languages</li>
            </ul>
          </div>

          <h2>Skills</h2>
          <div class="skills-section">
            <div class="skill-category">
              <h3>Frontend</h3>
              <div class="skills-grid">
                <span class="skill-tag">React</span>
                <span class="skill-tag">Vue.js</span>
                <span class="skill-tag">TypeScript</span>
                <span class="skill-tag">HTML5</span>
                <span class="skill-tag">CSS3</span>
                <span class="skill-tag">JavaScript (ES6+)</span>
                <span class="skill-tag">Responsive Design</span>
                <span class="skill-tag">CSS Grid/Flexbox</span>
                <span class="skill-tag">Webpack</span>
                <span class="skill-tag">Vite</span>
                <span class="skill-tag">Parcel</span>
              </div>
            </div>

            <div class="skill-category">
              <h3>Backend</h3>
              <div class="skills-grid">
                <span class="skill-tag">Node.js</span>
                <span class="skill-tag">Express</span>
                <span class="skill-tag">Python</span>
                <span class="skill-tag">Django/Flask</span>
                <span class="skill-tag">PostgreSQL</span>
                <span class="skill-tag">MongoDB</span>
                <span class="skill-tag">REST APIs</span>
                <span class="skill-tag">GraphQL</span>
              </div>
            </div>

            <div class="skill-category">
              <h3>Tools & Others</h3>
              <div class="skills-grid">
                <span class="skill-tag">Git</span>
                <span class="skill-tag">GitHub/GitLab</span>
                <span class="skill-tag">Figma</span>
                <span class="skill-tag">Adobe Creative Suite</span>
                <span class="skill-tag">Docker</span>
                <span class="skill-tag">AWS</span>
                <span class="skill-tag">Netlify/Vercel</span>
                <span class="skill-tag">Jest</span>
                <span class="skill-tag">Cypress</span>
              </div>
            </div>
          </div>

          <div class="cta-section">
            <p class="cta-text">Interested in working together? <a href="contact.html">Let's connect!</a></p>
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
