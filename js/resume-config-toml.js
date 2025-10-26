/**
 * TOML-based Resume Configuration
 * Loads resume content from config/resume.toml
 */

class ResumeConfig {
    constructor() {
        this.config = null;
        this.tomlParser = null;
    }

        // Initialize resume configuration
    async init() {
        try {
            await this.loadTomlParser();
            await this.loadConfig();
        } catch (error) {
            this.setDefaultConfig();
        }
    }

    // Load TOML parser from CDN
    loadTomlParser() {
        return new Promise((resolve, reject) => {
            // Check if TOML parser is already loaded
            if (window.TOML) {
                this.tomlParser = window.TOML;
                resolve();
                return;
            }

            // Try js-toml first (more reliable)
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/js-toml@0.5.0/lib/toml.min.js';
            script.onload = () => {
                this.tomlParser = window.toml;
                resolve();
            };
            script.onerror = () => {
                // Try backup CDN
                const backupScript = document.createElement('script');
                backupScript.src = 'https://unpkg.com/js-toml@0.5.0/lib/toml.min.js';
                backupScript.onload = () => {
                    this.tomlParser = window.toml;
                    resolve();
                };
                backupScript.onerror = () => {
                    // Don't reject, just set parser to null so manual parsing can be used
                    this.tomlParser = null;
                    resolve();
                };
                document.head.appendChild(backupScript);
            };
            document.head.appendChild(script);
        });
    }

    // Load configuration from TOML file
    async loadConfig() {
        try {
            const response = await fetch('./config/resume.toml');
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const tomlContent = await response.text();
            
            // Try using the TOML parser first
            if (this.tomlParser && this.tomlParser.parse) {
                this.config = this.tomlParser.parse(tomlContent);
            } else {
                // Fallback to manual parsing for critical settings
                this.config = this.parseTomlManually(tomlContent);
            }
            
        } catch (error) {
            throw error;
        }
    }

        // Simple manual TOML parser - TOML-first approach
    parseTomlManually(tomlContent) {
        
        // Start with empty config structure - NO JavaScript fallback
        const config = {
            personal: {},
            summary: { text: "" },
            companies: {},
            experience: [],
            education: [],
            projects: [],
            skills: {},
            achievements: [],
            settings: {
                show_gpa: true,
                show_location: true,
                show_phone: false,
                date_format: "MMM YYYY",
                max_achievements_per_section: 10,
                enable_share_button: true
            }
        };
        
        // Parse personal section
        const personalMatch = tomlContent.match(/\[personal\]([\s\S]*?)(?=\n\[|\n#|$)/);
        if (personalMatch) {
            const personalSection = personalMatch[1];
            
            const nameMatch = personalSection.match(/name\s*=\s*"([^"]*)"/);
            if (nameMatch) config.personal.name = nameMatch[1];
            
            const titleMatch = personalSection.match(/title\s*=\s*"([^"]*)"/);
            if (titleMatch) config.personal.title = titleMatch[1];
            
            const phoneMatch = personalSection.match(/phone\s*=\s*"([^"]*)"/);
            if (phoneMatch) config.personal.phone = phoneMatch[1];
            
            const emailMatch = personalSection.match(/email\s*=\s*"([^"]*)"/);
            if (emailMatch) config.personal.email = emailMatch[1];
            
            const websiteMatch = personalSection.match(/website\s*=\s*"([^"]*)"/);
            if (websiteMatch) config.personal.website = websiteMatch[1];
            
            const githubMatch = personalSection.match(/github\s*=\s*"([^"]*)"/);
            if (githubMatch) config.personal.github = githubMatch[1];
            
            const linkedinMatch = personalSection.match(/linkedin\s*=\s*"([^"]*)"/);
            if (linkedinMatch) config.personal.linkedin = linkedinMatch[1];
            
            const locationMatch = personalSection.match(/location\s*=\s*"([^"]*)"/);
            if (locationMatch) config.personal.location = locationMatch[1];
        }
        
        // Parse summary section
        const summaryMatch = tomlContent.match(/\[summary\]([\s\S]*?)(?=\n\[|\n#|$)/);
        if (summaryMatch) {
            const summarySection = summaryMatch[1];
            
            const textMatch = summarySection.match(/text\s*=\s*"((?:[^"\\]|\\.)*)"/s);
            if (textMatch) {
                const unescapedText = textMatch[1].replace(/\\"/g, '"').replace(/\\\\/g, '\\');
                config.summary = { text: unescapedText };
            }
        }
        
        // Parse companies section for @mention mappings
        const companiesMatches = tomlContent.match(/\[companies\.(\w+)\]([\s\S]*?)(?=\n\[|\n#|$)/g);
        if (companiesMatches) {
            companiesMatches.forEach(companyMatch => {
                const companyKeyMatch = companyMatch.match(/\[companies\.(\w+)\]/);
                if (companyKeyMatch) {
                    const companyKey = companyKeyMatch[1];
                    const company = {};
                    
                    const mentionMatch = companyMatch.match(/mention\s*=\s*"([^"]*)"/);
                    if (mentionMatch) company.mention = mentionMatch[1];
                    
                    const nameMatch = companyMatch.match(/name\s*=\s*"([^"]*)"/);
                    if (nameMatch) company.name = nameMatch[1];
                    
                    const urlMatch = companyMatch.match(/url\s*=\s*"([^"]*)"/);
                    if (urlMatch) company.url = urlMatch[1];
                    
                    config.companies[companyKey] = company;
                }
            });
        }
        
        // Parse experience sections
        const experienceMatches = tomlContent.match(/\[\[experience\]\]([\s\S]*?)(?=\n\[\[|\n\[(?!.*\])|$)/g);
        if (experienceMatches) {
            config.experience = experienceMatches.map(expMatch => {
                const exp = {};
                
                const positionMatch = expMatch.match(/position\s*=\s*"([^"]*)"/);
                if (positionMatch) exp.position = positionMatch[1];
                
                const companyMatch = expMatch.match(/company\s*=\s*"([^"]*)"/);
                if (companyMatch) exp.company = companyMatch[1];
                
                const companyUrlMatch = expMatch.match(/company_url\s*=\s*"([^"]*)"/);
                if (companyUrlMatch) exp.company_url = companyUrlMatch[1];
                
                const locationMatch = expMatch.match(/location\s*=\s*"([^"]*)"/);
                if (locationMatch) exp.location = locationMatch[1];
                
                const startDateMatch = expMatch.match(/start_date\s*=\s*"([^"]*)"/);
                if (startDateMatch) exp.start_date = startDateMatch[1];
                
                const endDateMatch = expMatch.match(/end_date\s*=\s*"([^"]*)"/);
                if (endDateMatch) exp.end_date = endDateMatch[1];
                
                const isCurrentMatch = expMatch.match(/is_current\s*=\s*(true|false)/);
                if (isCurrentMatch) exp.is_current = isCurrentMatch[1] === 'true';
                
                // Parse achievements array
                const achievementsMatch = expMatch.match(/achievements\s*=\s*\[([\s\S]*?)\]/);
                if (achievementsMatch) {
                    const achievementsStr = achievementsMatch[1];
                    const achievements = achievementsStr.match(/"([^"\\]*(\\.[^"\\]*)*)"/g);
                    if (achievements) {
                        exp.achievements = achievements.map(a => a.slice(1, -1).replace(/\\"/g, '"'));
                    }
                }
                
                return exp;
            });
        }
        
        // Parse education sections
        const educationMatches = tomlContent.match(/\[\[education\]\]([\s\S]*?)(?=\n\[\[|\n\[(?!.*\])|$)/g);
        if (educationMatches) {
            config.education = educationMatches.map(eduMatch => {
                const edu = {};
                
                const degreeMatch = eduMatch.match(/degree\s*=\s*"([^"]*)"/);
                if (degreeMatch) edu.degree = degreeMatch[1];
                
                const institutionMatch = eduMatch.match(/institution\s*=\s*"([^"]*)"/);
                if (institutionMatch) edu.institution = institutionMatch[1];
                
                const institutionUrlMatch = eduMatch.match(/institution_url\s*=\s*"([^"]*)"/);
                if (institutionUrlMatch) edu.institution_url = institutionUrlMatch[1];
                
                const locationMatch = eduMatch.match(/location\s*=\s*"([^"]*)"/);
                if (locationMatch) edu.location = locationMatch[1];
                
                const graduationYearMatch = eduMatch.match(/graduation_year\s*=\s*"([^"]*)"/);
                if (graduationYearMatch) edu.graduation_year = graduationYearMatch[1];
                
                const gpaMatch = eduMatch.match(/gpa\s*=\s*"([^"]*)"/);
                if (gpaMatch) edu.gpa = gpaMatch[1];
                
                const notesMatch = eduMatch.match(/notes\s*=\s*"([^"]*)"/);
                if (notesMatch) edu.notes = notesMatch[1];
                
                return edu;
            });
        }
        
        // Parse projects sections
        const projectMatches = tomlContent.match(/\[\[projects\]\]([\s\S]*?)(?=\n\[\[|\n\[(?!.*\])|$)/g);
        if (projectMatches) {
            config.projects = projectMatches.map(projMatch => {
                const proj = {};
                
                const nameMatch = projMatch.match(/name\s*=\s*"([^"]*)"/);
                if (nameMatch) proj.name = nameMatch[1];
                
                const descriptionMatch = projMatch.match(/description\s*=\s*"([^"]*)"/);
                if (descriptionMatch) proj.description = descriptionMatch[1];
                
                const startDateMatch = projMatch.match(/start_date\s*=\s*"([^"]*)"/);
                if (startDateMatch) proj.start_date = startDateMatch[1];
                
                const endDateMatch = projMatch.match(/end_date\s*=\s*"([^"]*)"/);
                if (endDateMatch) proj.end_date = endDateMatch[1];
                
                const liveUrlMatch = projMatch.match(/live_url\s*=\s*"([^"]*)"/);
                if (liveUrlMatch) proj.live_url = liveUrlMatch[1];
                
                const githubUrlMatch = projMatch.match(/github_url\s*=\s*"([^"]*)"/);
                if (githubUrlMatch) proj.github_url = githubUrlMatch[1];
                
                // Parse technologies array
                const technologiesMatch = projMatch.match(/technologies\s*=\s*\[([\s\S]*?)\]/);
                if (technologiesMatch) {
                    const techStr = technologiesMatch[1];
                    const technologies = techStr.match(/"([^"]*)"/g);
                    if (technologies) {
                        proj.technologies = technologies.map(t => t.slice(1, -1));
                    }
                }
                
                // Parse highlights array
                const highlightsMatch = projMatch.match(/highlights\s*=\s*\[([\s\S]*?)\]/);
                if (highlightsMatch) {
                    const highlightsStr = highlightsMatch[1];
                    const highlights = highlightsStr.match(/"([^"\\]*(\\.[^"\\]*)*)"/g);
                    if (highlights) {
                        proj.highlights = highlights.map(h => h.slice(1, -1).replace(/\\"/g, '"'));
                    }
                }
                
                return proj;
            });
        }
        
        // Parse skills sections
        const skillsMatches = tomlContent.match(/\[skills\.(\w+)\]([\s\S]*?)(?=\n\[|\n#|$)/g);
        if (skillsMatches) {
            skillsMatches.forEach(skillMatch => {
                const skillKeyMatch = skillMatch.match(/\[skills\.(\w+)\]/);
                if (skillKeyMatch) {
                    const skillKey = skillKeyMatch[1];
                    const skill = {};
                    
                    const categoryMatch = skillMatch.match(/category\s*=\s*"([^"]*)"/);
                    if (categoryMatch) skill.category = categoryMatch[1];
                    
                    const technologiesMatch = skillMatch.match(/technologies\s*=\s*\[([\s\S]*?)\]/);
                    if (technologiesMatch) {
                        const techStr = technologiesMatch[1];
                        const technologies = techStr.match(/"([^"]*)"/g);
                        if (technologies) {
                            skill.technologies = technologies.map(t => t.slice(1, -1));
                        }
                    }
                    
                    config.skills[skillKey] = skill;
                }
            });
        }
        
        // Parse achievements sections
        const achievementMatches = tomlContent.match(/\[\[achievements\]\]([\s\S]*?)(?=\n\[\[|\n\[(?!.*\])|$)/g);
        if (achievementMatches) {
            config.achievements = achievementMatches.map(achMatch => {
                const ach = {};
                
                const titleMatch = achMatch.match(/title\s*=\s*"([^"]*)"/);
                if (titleMatch) ach.title = titleMatch[1];
                
                const issuerMatch = achMatch.match(/issuer\s*=\s*"([^"]*)"/);
                if (issuerMatch) ach.issuer = issuerMatch[1];
                
                const dateMatch = achMatch.match(/date\s*=\s*"([^"]*)"/);
                if (dateMatch) ach.date = dateMatch[1];
                
                const typeMatch = achMatch.match(/type\s*=\s*"([^"]*)"/);
                if (typeMatch) ach.type = typeMatch[1];
                
                const descriptionMatch = achMatch.match(/description\s*=\s*"([^"]*)"/);
                if (descriptionMatch) ach.description = descriptionMatch[1];
                
                return ach;
            });
        }
        
        // Parse settings section
        const settingsMatch = tomlContent.match(/\[settings\]([\s\S]*?)(?=\n\[|\n#|$)/);
        if (settingsMatch) {
            const settingsSection = settingsMatch[1];
            
            const showPhoneMatch = settingsSection.match(/show_phone\s*=\s*(true|false)/);
            if (showPhoneMatch) {
                config.settings.show_phone = showPhoneMatch[1] === 'true';
            }
            
            const showLocationMatch = settingsSection.match(/show_location\s*=\s*(true|false)/);
            if (showLocationMatch) {
                config.settings.show_location = showLocationMatch[1] === 'true';
            }
            
            const showGpaMatch = settingsSection.match(/show_gpa\s*=\s*(true|false)/);
            if (showGpaMatch) {
                config.settings.show_gpa = showGpaMatch[1] === 'true';
            }
            
            const dateFormatMatch = settingsSection.match(/date_format\s*=\s*"([^"]*)"/);
            if (dateFormatMatch) {
                config.settings.date_format = dateFormatMatch[1];
            }
            
            const maxAchievementsMatch = settingsSection.match(/max_achievements_per_section\s*=\s*(\d+)/);
            if (maxAchievementsMatch) {
                config.settings.max_achievements_per_section = parseInt(maxAchievementsMatch[1]);
            }
            
            const enableShareMatch = settingsSection.match(/enable_share_button\s*=\s*(true|false)/);
            if (enableShareMatch) {
                config.settings.enable_share_button = enableShareMatch[1] === 'true';
            }
        }
        
        return config;
    }

    getMinimalConfig() {
        return {
            personal: {
                name: "John Doe",
                title: "Senior Full Stack Developer",
                phone: "+1 (555) 123-4567",
                email: "john.doe@email.com",
                website: "https://johndoe.dev",
                github: "https://github.com/johndoe",
                linkedin: "https://linkedin.com/in/johndoe",
                location: "San Francisco, CA"
            },
            summary: { 
                text: "Experienced Full Stack Developer with 5+ years of expertise in modern web technologies. Passionate about creating scalable applications and leading development teams. Currently working at @techcorp and actively contributing to the open-source community." 
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

    // Set default configuration as fallback
    setDefaultConfig() {
        // Try to use JavaScript config if available
        if (window.RESUME_CONFIG_JS) {
            this.config = window.RESUME_CONFIG_JS;
            return;
        }
        
        // Otherwise use minimal default config
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
                show_phone: false,
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

    // Process text to convert @mentions to links
    processTextWithMentions(text) {
        if (!text) return '';
        
        // Use company mappings from TOML configuration instead of hardcoded values
        const companyMappings = {};
        
        // Build mappings from TOML companies section
        if (this.config.companies) {
            Object.values(this.config.companies).forEach(company => {
                if (company.mention && company.name && company.url) {
                    companyMappings[company.mention] = {
                        name: company.name,
                        url: company.url
                    };
                }
            });
        }
        
        // Fallback to default mappings if no TOML companies found
        if (Object.keys(companyMappings).length === 0) {
            companyMappings['@letsflo'] = { name: 'Lets Flo', url: 'https://letsflo.in' };
            companyMappings['@teceads'] = { name: 'Teceads Solutions', url: 'https://teceads.com' };
        }
        
        // Replace @mentions with clickable links
        let processedText = text;
        for (const [mention, company] of Object.entries(companyMappings)) {
            const linkHtml = `<a href="${company.url}" target="_blank" rel="noopener noreferrer" class="company-mention">${company.name}</a>`;
            processedText = processedText.replace(new RegExp(mention, 'gi'), linkHtml);
        }
        
        return processedText;
    }

    // Generate summary section HTML
    generateSummary() {
        if (!this.config.summary || !this.config.summary.text) return '';
        
        const processedText = this.processTextWithMentions(this.config.summary.text);
        
        return `
            <div class="summary">
                <p>${processedText}</p>
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
                            ${exp.achievements.map(achievement => `<li>${this.processTextWithMentions(achievement)}</li>`).join('')}
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
                    ${edu.notes ? `<p>${edu.notes}</p>` : ''}
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
            } else {
                // Fallback to copying link
                await this.copyResumeLink();
            }
        } catch (error) {
            if (error.name === 'AbortError') {
            } else {
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