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
                website: "https://renderer.nishikanta.in",
                github: "https://github.com/NishikantaRay",
                linkedin: "https://linkedin.com/in/nishikantaray",
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
                enable_share_button: true
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
                        <div class="item-company">
                            ${exp.company_url ? 
                                `<a href="${exp.company_url}" target="_blank" class="company-link">${exp.company}</a>` : 
                                exp.company
                            }
                        </div>
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
                        <div class="item-company">
                            ${edu.institution_url ? 
                                `<a href="${edu.institution_url}" target="_blank" class="institution-link">${edu.institution}</a>` : 
                                edu.institution
                            }
                        </div>
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
        if (!settings.enable_share_button) return '';

        return this.generateShareSection();
    }

    // Generate share section HTML
    generateShareSection() {
        const settings = this.config.settings;
        if (!settings.enable_share_button) return '';

        return `
            <div class="share-section">
                <button onclick="window.resumeConfig.shareResume()" class="share-btn">🔗 Share Resume Link</button>
                <button onclick="window.resumeConfig.copyResumeLink()" class="copy-link-btn">📋 Copy Link</button>
            </div>
        `;
    }

    // Share resume functionality
    async shareResume() {
        const resumeUrl = window.location.href;
        const personalName = this.config.personal?.name || 'Professional';
        const shareData = {
            title: `${personalName} - Resume`,
            text: `Check out ${personalName}'s professional resume`,
            url: resumeUrl
        };

        try {
            if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
                await navigator.share(shareData);
                console.log('Resume shared successfully');
            } else {
                // Fallback to copying link
                await this.copyResumeLink();
            }
        } catch (error) {
            if (error.name === 'AbortError') {
                console.log('User cancelled sharing');
            } else {
                console.error('Error sharing:', error);
                // Fallback to copying link
                await this.copyResumeLink();
            }
        }
    }

    // Copy resume link to clipboard
    async copyResumeLink() {
        const resumeUrl = window.location.href;
        
        try {
            await navigator.clipboard.writeText(resumeUrl);
            this.showNotification('Resume link copied to clipboard! 📋', 'success');
        } catch (error) {
            console.error('Failed to copy link:', error);
            // Fallback for older browsers
            this.fallbackCopyLink(resumeUrl);
        }
    }

    // Fallback copy method for older browsers
    fallbackCopyLink(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            this.showNotification('Resume link copied to clipboard! 📋', 'success');
        } catch (error) {
            console.error('Failed to copy link:', error);
            this.showNotification('Failed to copy link. Please copy manually: ' + text, 'error');
        }
        
        document.body.removeChild(textArea);
    }

    // Show notification to user
    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.resume-notification');
        existingNotifications.forEach(notification => notification.remove());

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `resume-notification ${type}`;
        notification.textContent = message;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '12px 20px',
            borderRadius: '6px',
            color: 'white',
            fontWeight: '500',
            zIndex: '1000',
            transition: 'all 0.3s ease',
            transform: 'translateX(100%)',
            maxWidth: '300px',
            wordWrap: 'break-word'
        });

        // Set background color based on type
        if (type === 'success') {
            notification.style.background = '#10b981';
        } else if (type === 'error') {
            notification.style.background = '#ef4444';
        } else {
            notification.style.background = '#3b82f6';
        }

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
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

        console.log('Updating resume with config:', this.config);
        console.log('Experience items:', this.config.experience?.length || 0);
        console.log('Projects items:', this.config.projects?.length || 0);
        console.log('Education items:', this.config.education?.length || 0);

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