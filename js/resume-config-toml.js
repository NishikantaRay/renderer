/**
 * TOML-based Resume Configuration
 * Loads resume content from config/resume.toml
 */

class ResumeConfig {
    constructor() {
        this.config = null;
        this.tomlParser = null;
    }

    // Initialize and load the TOML configuration
    async init() {
        try {
            console.log('Initializing resume configuration...');
            
            // Load TOML parser from CDN
            console.log('Loading TOML parser...');
            await this.loadTomlParser();
            console.log('TOML parser loaded successfully');
            
            // Load the configuration file
            console.log('Loading configuration file...');
            await this.loadConfig();
            console.log('Configuration loaded successfully');
            
            return true;
        } catch (error) {
            console.error('Failed to initialize resume configuration:', error);
            console.error('Using fallback configuration');
            // Fallback to default configuration
            this.setDefaultConfig();
            return false;
        }
    }

    // Load TOML parser dynamically
    async loadTomlParser() {
        return new Promise((resolve, reject) => {
            // Check if TOML parser is already loaded
            if (window.TOML) {
                this.tomlParser = window.TOML;
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@iarna/toml@2.2.5/lib/toml-browser.js';
            script.onload = () => {
                this.tomlParser = window.TOML;
                resolve();
            };
            script.onerror = () => reject(new Error('Failed to load TOML parser'));
            document.head.appendChild(script);
        });
    }

    // Load configuration from TOML file
    async loadConfig() {
        try {
            console.log('Attempting to load resume.toml...');
            const response = await fetch('./config/resume.toml');
            console.log('Fetch response:', response.status, response.statusText);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const tomlContent = await response.text();
            console.log('TOML content length:', tomlContent.length);
            console.log('First 100 chars:', tomlContent.substring(0, 100));
            
            this.config = this.tomlParser.parse(tomlContent);
            console.log('Resume configuration loaded successfully from TOML');
            console.log('Parsed config:', this.config);
        } catch (error) {
            console.error('Failed to load resume.toml:', error);
            console.error('Full error details:', error.message, error.stack);
            throw error;
        }
    }

    // Set default configuration as fallback
    setDefaultConfig() {
        // Try to use JavaScript config if available
        if (window.RESUME_CONFIG_JS) {
            console.log('Using JavaScript configuration as fallback');
            this.config = window.RESUME_CONFIG_JS;
            return;
        }
        
        // Otherwise use minimal default config
        console.log('Using minimal default configuration');
        this.config = {
            personal: {
                name: "Your Name",
                title: "Your Title",
                email: "your.email@example.com",
                phone: "+1 (555) 123-4567",
                website: "https://yourwebsite.com",
                github: "https://github.com/yourusername",
                linkedin: "https://linkedin.com/in/yourusername",
                location: "Your City, State"
            },
            summary: {
                text: "Professional summary goes here. Update config/resume.toml to customize your resume content."
            },
            experience: [],
            education: [],
            projects: [],
            skills: {},
            achievements: [],
            settings: {
                show_gpa: true,
                show_location: true,
                show_phone: true,
                date_format: "MMM YYYY",
                enable_download_button: true,
                enable_print_button: true
            }
        };
    }

    // Generate personal header HTML
    generatePersonalHeader() {
        const personal = this.config.personal;
        const settings = this.config.settings;
        
        return `
            <header class="resume-header">
                <h1 class="name">${personal.name}</h1>
                <p class="title">${personal.title}</p>
                <div class="contact-info">
                    ${settings.show_phone ? `<span>📞 ${personal.phone}</span>` : ''}
                    <a href="mailto:${personal.email}">✉️ ${personal.email}</a>
                    ${personal.github ? `<a href="${personal.github}" target="_blank">🔗 ${this.extractDomain(personal.github)}</a>` : ''}
                    ${personal.website ? `<a href="${personal.website}" target="_blank">🌐 ${this.extractDomain(personal.website)}</a>` : ''}
                    ${personal.linkedin ? `<a href="${personal.linkedin}" target="_blank">💼 ${this.extractDomain(personal.linkedin)}</a>` : ''}
                    ${settings.show_location && personal.location ? `<span>📍 ${personal.location}</span>` : ''}
                </div>
            </header>
        `;
    }

    // Generate summary section HTML
    generateSummary() {
        if (!this.config.summary || !this.config.summary.text) return '';
        
        return `
            <div class="summary">
                <p>${this.config.summary.text}</p>
            </div>
        `;
    }

    // Generate work experience section HTML
    generateExperience() {
        const experiences = this.config.experience || [];
        if (experiences.length === 0) return '';

        const experienceHtml = experiences.map(exp => `
            <div class="item">
                <div class="item-header">
                    <div>
                        <div class="item-title">${exp.position}</div>
                        <div class="item-company">${exp.company}</div>
                        ${this.config.settings.show_location && exp.location ? `<div class="item-location">${exp.location}</div>` : ''}
                    </div>
                    <div class="item-duration">${this.formatDateRange(exp.start_date, exp.end_date, exp.is_current)}</div>
                </div>
                ${exp.achievements && exp.achievements.length > 0 ? `
                    <div class="item-description">
                        <ul>
                            ${exp.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
            </div>
        `).join('');

        return `
            <section class="section">
                <h2 class="section-title">Work Experience</h2>
                ${experienceHtml}
            </section>
        `;
    }

    // Generate education section HTML
    generateEducation() {
        const educations = this.config.education || [];
        if (educations.length === 0) return '';

        const educationHtml = educations.map(edu => `
            <div class="item">
                <div class="item-header">
                    <div>
                        <div class="item-title">${edu.degree}</div>
                        <div class="item-company">${edu.institution}</div>
                        ${this.config.settings.show_location && edu.location ? `<div class="item-location">${edu.location}</div>` : ''}
                    </div>
                    <div class="item-duration">Graduated ${edu.graduation_year}</div>
                </div>
                <div class="item-description">
                    ${this.config.settings.show_gpa && edu.gpa ? `<p><strong>GPA:</strong> ${edu.gpa}</p>` : ''}
                    ${edu.relevant_coursework && edu.relevant_coursework.length > 0 ? `
                        <p><strong>Relevant Coursework:</strong> ${edu.relevant_coursework.join(', ')}</p>
                    ` : ''}
                    ${edu.honors && edu.honors.length > 0 ? `
                        <p><strong>Honors:</strong> ${edu.honors.join(', ')}</p>
                    ` : ''}
                </div>
            </div>
        `).join('');

        return `
            <section class="section">
                <h2 class="section-title">Education</h2>
                ${educationHtml}
            </section>
        `;
    }

    // Generate projects section HTML
    generateProjects() {
        const projects = this.config.projects || [];
        if (projects.length === 0) return '';

        const projectsHtml = projects.map(project => `
            <div class="item">
                <div class="item-header">
                    <div>
                        <div class="item-title">${project.name}</div>
                        <div class="item-company">${project.description}</div>
                        ${project.technologies && project.technologies.length > 0 ? `
                            <div class="item-location">Technologies: ${project.technologies.join(', ')}</div>
                        ` : ''}
                    </div>
                    <div class="item-duration">${this.formatDateRange(project.start_date, project.end_date)}</div>
                </div>
                ${project.highlights && project.highlights.length > 0 ? `
                    <div class="item-description">
                        <ul>
                            ${project.highlights.map(highlight => `<li>${highlight}</li>`).join('')}
                        </ul>
                        ${(project.live_url || project.github_url) ? `
                            <div class="project-links">
                                <span class="links-label">Project Links:</span>
                                <div class="links-container">
                                    ${project.live_url ? `<a href="${project.live_url}" target="_blank" class="project-link live-link">🚀 Live Demo</a>` : ''}
                                    ${project.github_url ? `<a href="${project.github_url}" target="_blank" class="project-link github-link">💻 GitHub</a>` : ''}
                                </div>
                            </div>
                        ` : ''}
                    </div>
                ` : ''}
            </div>
        `).join('');

        return `
            <section class="section">
                <h2 class="section-title">Projects</h2>
                ${projectsHtml}
            </section>
        `;
    }

    // Generate skills section HTML
    generateSkills() {
        const skills = this.config.skills || {};
        const skillCategories = Object.keys(skills).filter(key => skills[key].category && skills[key].technologies);
        
        if (skillCategories.length === 0) return '';

        const skillsHtml = skillCategories.map(key => {
            const skill = skills[key];
            return `
                <div class="skill-category">
                    <div class="skill-category-title">${skill.category}</div>
                    <div class="skill-list">${skill.technologies.join(', ')}</div>
                </div>
            `;
        }).join('');

        return `
            <section class="section">
                <h2 class="section-title">Technical Skills</h2>
                <div class="skills-grid">
                    ${skillsHtml}
                </div>
            </section>
        `;
    }

    // Generate achievements section HTML
    generateAchievements() {
        const achievements = this.config.achievements || [];
        if (achievements.length === 0) return '';

        const maxAchievements = this.config.settings.max_achievements_per_section || achievements.length;
        const displayAchievements = achievements.slice(0, maxAchievements);

        const achievementsHtml = displayAchievements.map(achievement => {
            let achievementText = `<strong>${achievement.title}</strong>`;
            if (achievement.issuer) {
                achievementText += ` - ${achievement.issuer}`;
            }
            if (achievement.date) {
                achievementText += ` (${achievement.date})`;
            }
            if (achievement.description) {
                achievementText += ` - ${achievement.description}`;
            }
            return `<li>${achievementText}</li>`;
        }).join('');

        return `
            <section class="section">
                <h2 class="section-title">Certifications & Achievements</h2>
                <ul class="achievement-list">
                    ${achievementsHtml}
                </ul>
            </section>
        `;
    }

    // Generate download section HTML
    generateDownloadSection() {
        const settings = this.config.settings;
        if (!settings.enable_download_button && !settings.enable_print_button) return '';

        let buttonsHtml = '';
        if (settings.enable_print_button) {
            buttonsHtml += '<button onclick="window.print()">📄 Download PDF Resume</button>';
        }
        if (settings.enable_download_button && settings.enable_print_button) {
            // Could add additional download functionality here
        }

        return buttonsHtml ? `
            <div class="download-btn">
                ${buttonsHtml}
            </div>
        ` : '';
    }

    // Generate complete resume HTML
    generateResumeHTML() {
        return `
            ${this.generatePersonalHeader()}
            ${this.generateSummary()}
            ${this.generateExperience()}
            ${this.generateEducation()}
            ${this.generateProjects()}
            ${this.generateSkills()}
            ${this.generateAchievements()}
            ${this.generateDownloadSection()}
        `;
    }

    // Helper method to extract domain from URL
    extractDomain(url) {
        try {
            const domain = new URL(url).hostname;
            return domain.replace('www.', '');
        } catch {
            return url;
        }
    }

    // Helper method to format date ranges
    formatDateRange(startDate, endDate, isCurrent = false) {
        const format = this.config.settings.date_format || "MMM YYYY";
        const formattedEnd = isCurrent ? "Present" : endDate;
        
        if (startDate && formattedEnd) {
            return `${startDate} – ${formattedEnd}`;
        }
        return startDate || formattedEnd || '';
    }

    // Update resume content in the DOM
    async updateResume(containerSelector = '.container') {
        const container = document.querySelector(containerSelector);
        
        if (!container) {
            console.warn(`No container found with selector: ${containerSelector}`);
            return;
        }

        // Ensure configuration is loaded
        if (!this.config) {
            await this.init();
        }

        // Generate and insert resume HTML
        const resumeHTML = this.generateResumeHTML();
        container.innerHTML = resumeHTML;
    }

    // Reload configuration
    async reload() {
        await this.loadConfig();
        await this.updateResume();
    }
}

// Create global instance
window.resumeConfig = new ResumeConfig();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ResumeConfig;
}