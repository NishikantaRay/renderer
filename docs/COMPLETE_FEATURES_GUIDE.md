# Complete Features Guide & Documentation

> **The Ultimate Guide to Customizing Your Minimal Portfolio**  
> Everything you need to know about features, configuration, code snippets, and custom development.

---

## 📋 Table of Contents

1. [🏠 Home Page Features](#-home-page-features)
2. [🚀 Projects Page Features](#-projects-page-features)
3. [📝 Blog System Features](#-blog-system-features)
4. [📄 Resume Features](#-resume-features)
5. [🔗 Social Links Configuration](#-social-links-configuration)
6. [🎨 Theming & UI Features](#-theming--ui-features)
7. [⚙️ Configuration System](#️-configuration-system)
8. [💻 Custom Development](#-custom-development)
9. [🔧 Advanced Customization](#-advanced-customization)
10. [🚀 Deployment & Performance](#-deployment--performance)
11. [🐛 Troubleshooting Guide](#-troubleshooting-guide)

---

## 🏠 Home Page Features

### Hero Section Configuration

**Configuration File:** `config/home.toml`

```toml
[hero]
name = "Nishikanta Ray"
title = "Full-Stack Developer & Designer"
intro = [
    "I work on web development, user experience design, and modern frontend technologies among other digital things.",
    "This website is an archive of my work and thoughts. Currently, I'm into React, TypeScript, and building modern web applications."
]

[hero.actions]
primary_text = "Hire Me"
primary_link = "resume.html"
secondary_text = "Let's Talk"
secondary_link = "#contact"
```

### Available Sections

Enable/disable sections in your home page:

```toml
[sections]
enabled_sections = ["freelance-clients", "latest-products", "dashboard"]
```

### Freelance Clients Section

Show trusted client logos and testimonials:

```toml
[freelance_clients]
enabled = true
title = "Trusted by Clients"
subtitle = "Companies I've worked with"
contact_email = "your@email.com"
contact_text = "Contact Me"

[[freelance_clients.clients]]
name = "Tech Corp"
logo = "🏢"  # Can be emoji or image URL
description = "Enterprise web applications"
testimonial = "Exceptional developer with great attention to detail."
```

### Products Showcase

Display your products or services:

```toml
[latest_products]
enabled = true
title = "Latest Products"
subtitle = "Things I've built recently"

[[latest_products.products]]
name = "Portfolio Template"
description = "A minimal, configurable portfolio template"
tech_stack = ["HTML", "CSS", "JavaScript"]
link = "https://github.com/NishikantaRay/portfolio"
status = "Live"
```

### Dashboard Analytics

Show project statistics and metrics:

```toml
[dashboard]
enabled = true
title = "Project Dashboard"
subtitle = "Real-time project statistics"

[dashboard.stats]
total_projects = 25
github_repos = 15
contributions = 500
years_experience = 5
```

---

## 🚀 Projects Page Features

### Configuration File: `config/projects.toml`

### Page Settings

```toml
[page]
title = "Projects"
subtitle = "A showcase of my recent work in web development, design, and open source contributions."

[content]
enable_markdown_content = true     # Load content from projects.md
enable_fallback_content = true     # Show fallback if markdown fails
show_intro = true                  # Show introduction paragraph
show_loading_indicator = true      # Show loading spinner
```

### Navigation Features

```toml
[navigation]
enabled = true
show_theme_toggle = true           # Dark/light mode toggle
show_mobile_menu = true            # Mobile hamburger menu
sticky_navigation = false         # Make navigation sticky on scroll
```

### Featured Projects Section

```toml
[featured_projects]
enabled = true
title = "Featured Work"
show_tech_stack = true             # Show technology badges
show_features_list = true          # Show key features list
show_project_links = true          # Show demo/github/case study links
enable_hover_effects = true       # Interactive hover animations
show_categories = true             # Project category labels
```

### Project Analytics & Statistics

```toml
[project_stats]
enabled = true
title = "Project Statistics"
chart_type = "bar"                 # bar, line, pie, doughnut
time_period = "6months"            # 1month, 3months, 6months, 1year
show_github_activity = true       # GitHub contribution chart
show_technology_breakdown = true   # Technology usage pie chart
show_project_timeline = true      # Project completion timeline
```

### Open Source Section

```toml
[opensource]
enabled = true
title = "Open Source"
show_github_stats = true          # GitHub repository statistics
show_contribution_details = true   # Contribution graphs and details
github_username = "NishikantaRay"
repositories_limit = 10           # Number of repos to display
```

### Interactive Features

```toml
[interactive]
project_filtering = true           # Filter projects by technology/category
search_functionality = true       # Search through projects
sort_options = true               # Sort projects by date/tech/popularity
bookmarking = false               # Allow bookmarking projects
sharing_buttons = true            # Social sharing for individual projects
```

### UI Enhancements

```toml
[ui]
animations = true                 # CSS animations and transitions
smooth_scrolling = true           # Smooth scroll behavior
back_to_top = false              # Back to top button
breadcrumbs = false              # Page breadcrumbs
progress_indicator = false        # Reading/scroll progress indicator
```

### Accessibility Features

```toml
[accessibility]
high_contrast_mode = false        # High contrast color scheme
focus_indicators = true           # Enhanced focus indicators
screen_reader_labels = true       # ARIA labels for screen readers
keyboard_navigation = true        # Full keyboard navigation support
```

---

## 📝 Blog System Features

### Configuration File: `config/blog.toml`

### Blog Metadata

```toml
[blog]
title = "Personal Blog"
description = "Thoughts on web development and technology"
author = "Nishikanta Ray"
author_profile = "https://github.com/NishikantaRay"
base_url = "https://yourdomain.com"
```

### Pagination Settings

```toml
[pagination]
posts_per_page = 6
enabled = true
show_page_numbers = true
show_prev_next = true
```

### Feature Settings

```toml
[settings]
enable_comments = true                          # Show comment sections
enable_social_sharing = true                   # Show social share buttons
enable_search = true                           # Enable blog search
enable_categories = true                       # Show category filters
enable_tags = true                             # Show tag filters
enable_related_posts = true                   # Show related posts
default_image = "https://example.com/default.jpg"  # Default post image
```

### Adding Blog Posts

```toml
[[posts]]
id = "typescript-modern-web"
title = "Building Modern Web Applications with TypeScript"
description = "TypeScript best practices and implementation strategies"
date = "2024-10-12"
tags = ["TypeScript", "Web Development", "Best Practices"]
category = "Development"
content_file = "typescript-modern-web.md"  # File in content/ directory
author = "Nishikanta Ray"
read_time = "8 min read"
featured = true
status = "published"
image = "https://example.com/typescript-post.jpg"
repo_url = "https://github.com/NishikantaRay/typescript-examples"
demo_url = "https://typescript-demo.com"
license = "MIT"
contributors = ["John Doe", "Jane Smith"]
features = ["TypeScript Integration", "Modern Tooling", "Best Practices"]
related_posts = ["web-performance-optimization", "minimal-design"]
```

### Content File Structure

Create markdown files in the `content/` directory:

**File: `content/typescript-modern-web.md`**
```markdown
# Building Modern Web Applications with TypeScript

TypeScript has revolutionized the way we build web applications...

## Key Benefits

1. **Type Safety** - Catch errors at compile time
2. **Better IDE Support** - Enhanced autocomplete and refactoring
3. **Improved Code Quality** - Self-documenting code

## Code Example

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

class UserService {
  async getUser(id: number): Promise<User> {
    const response = await fetch(`/api/users/${id}`);
    return response.json();
  }
}
```

## Conclusion

TypeScript provides excellent developer experience...
```

---

## 📄 Resume Features

### Configuration File: `config/resume.toml`

## 🆕 Latest v2.0 Resume Features

### ✨ **TOML-First Architecture**
Complete configuration control through TOML files with no JavaScript hardcoding:

```toml
# Everything configurable through TOML
[personal]
name = "Nishikanta Ray"
title = "Full-Stack Developer"
location = "Bengaluru, KA"
email = "your@email.com"
```

### 🔗 **@Mention Company System**
Smart company mention processing with automatic link generation:

```toml
[companies]
letsflo = "https://letsflo.com"
teceads = "https://teceads.com"
microsoft = "https://microsoft.com"

[summary]
text = "Experienced developer with 5+ years at @letsflo and @teceads. Passionate about modern web technologies."
```

**How it Works:**
- Write `@letsflo` in your summary
- System converts to clickable "Lets Flo" link
- URL comes from `[companies]` section
- Professional styling with hover effects

### 🌐 **Enhanced URL Support**
Comprehensive URL linking system across all sections:

#### Work Experience URLs
```toml
[[experience]]
position = "Senior Full Stack Developer"
company = "Lets Flo"
company_url = "https://letsflo.com"
# Creates clickable company name
```

#### Education Institution URLs
```toml
[[education]]
degree = "XII (Science)"
institution = "D.A.V. Public School"
institution_url = "https://davpublicschool.com"
notes = "79.67%"  # Displays marks for XII/X
```

#### Project URLs (Dual Support)
```toml
[[projects]]
name = "Live Server Lite"
description = "VS Code extension with 2000+ installations"
live_url = "https://marketplace.visualstudio.com/items?itemName=ritwickdey.live-server-lite"
github_url = "https://github.com/NishikantaRay/live-server-lite"
highlights = [
    "2000+ installations on VS Code Marketplace",
    "Hot reload functionality for rapid development",
    "Cross-platform compatibility"
]
```

### 📊 **Education System Enhancements**
Advanced education configuration with multiple display options:

```toml
# XII/X Education with Marks
[[education]]
degree = "XII (Science)"
institution = "D.A.V. Public School"
institution_url = "https://davpublicschool.com"
location = "Bhubaneswar, Odisha"
graduation_year = "2019"
notes = "79.67%"  # Shows as marks for XII/X

# University Education with GPA
[[education]]
degree = "Bachelor of Technology in Computer Science"
institution = "Indian Institute of Technology"
institution_url = "https://iit.ac.in"
location = "Delhi, India"
graduation_year = "2021"
gpa = "8.5"       # Shows as CGPA for university
```

### 🎨 **Professional Styling System**
Automatic CSS class application for all interactive elements:

```css
/* Company mentions in summary */
.company-mention {
  color: var(--accent-color);
  font-weight: 500;
  border-bottom: 1px dotted var(--accent-color);
  transition: all 0.3s ease;
}

/* Institution links */
.institution-link {
  color: var(--accent-color);
  text-decoration: none;
  font-weight: 500;
}

/* Project URLs as buttons */
.project-link {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: var(--accent-color);
  color: white;
  border-radius: 4px;
  margin: 0.25rem;
  transition: all 0.3s ease;
}

/* Dark theme support */
[data-theme="dark"] .company-mention,
[data-theme="dark"] .institution-link {
  color: var(--accent-color-dark);
}
```

### 🔧 **Enhanced TOML Parser**
Manual TOML parsing system with advanced features:

```javascript
class TOMLParser {
  parseTomlManually(tomlContent) {
    // Advanced parsing with error handling
    // Supports all TOML features:
    // - Arrays: [[education]], [[projects]]
    // - Objects: [personal], [companies]
    // - Nested structures: [skills.frontend]
    // - Multi-line strings and arrays
    
    return {
      personal: { /* parsed personal info */ },
      companies: { /* company URL mappings */ },
      experience: [ /* work experience array */ ],
      education: [ /* education array */ ],
      projects: [ /* projects with URLs */ ]
    };
  }
}
```

### Personal Information

```toml
[personal]
name = "Nishikanta Ray"
title = "Full-Stack Developer"
email = "your@email.com"
phone = "+1234567890"
website = "https://renderer.nishikanta.in"
github = "https://github.com/NishikantaRay"
linkedin = "https://linkedin.com/in/NishikantaRay"
location = "Bengaluru, KA"
```

### Professional Summary with Smart @Mentions

```toml
[companies]
letsflo = "https://letsflo.com"
teceads = "https://teceads.com"

[summary]
text = """
Experienced Full Stack Developer with 5+ years of expertise at @letsflo and @teceads. 
Passionate about creating scalable applications and leading development teams. 
Proven track record of delivering high-quality software solutions.
"""
```

**@Mention Features:**
- Automatic detection of `@company` patterns
- Converts to clickable company links
- Professional styling with hover effects
- Fallback to plain text if company not in mapping

### Work Experience with Company URLs

```toml
[[experience]]
position = "Senior Full Stack Developer"
company = "Lets Flo"
company_url = "https://letsflo.com"
location = "Bengaluru, KA"
start_date = "2022-01"
end_date = "Present"
description = "Led development of scalable web applications using React and Node.js"
achievements = [
    "Increased application performance by 40% through optimization strategies",
    "Led a team of 5 developers in delivering critical features on time",
    "Implemented CI/CD pipelines reducing deployment time by 60%"
]
technologies = ["React", "Node.js", "TypeScript", "AWS"]
```

### Enhanced Education System

```toml
# High School with Marks Display
[[education]]
degree = "XII (Science)"
institution = "D.A.V. Public School"
institution_url = "https://davpublicschool.com"
location = "Bhubaneswar, Odisha"
graduation_year = "2019"
notes = "79.67%"

# University with GPA
[[education]]
degree = "Bachelor of Technology in Computer Science"
institution = "Indian Institute of Technology"
institution_url = "https://iit.ac.in"
location = "Delhi, India"
graduation_year = "2021"
gpa = "8.5"
achievements = [
    "Dean's List for 4 consecutive semesters",
    "Graduate Research Assistant in AI Lab"
]
```

**Education Features:**
- `notes` field for XII/X marks display
- `gpa` field for university-level education
- `institution_url` for clickable institution names
- Flexible date formats and graduation years

### Projects with Dual URL Support

```toml
[[projects]]
name = "Live Server Lite"
description = "A lightweight live server extension for VS Code development"
start_date = "2023"
end_date = "2024"
technologies = ["JavaScript", "Node.js", "VS Code API"]
live_url = "https://marketplace.visualstudio.com/items?itemName=ritwickdey.live-server-lite"
github_url = "https://github.com/NishikantaRay/live-server-lite"
highlights = [
    "2000+ installations on VS Code Marketplace",
    "Hot reload functionality for rapid development",
    "Lightweight alternative to traditional live servers",
    "Cross-platform compatibility and easy setup"
]

[[projects]]
name = "Bootstrap 5 Extension Pack"
description = "Comprehensive VS Code extension pack for Bootstrap 5 development"
start_date = "2023"
end_date = "2024"
technologies = ["Bootstrap 5", "CSS", "HTML", "VS Code Extensions"]
live_url = "https://marketplace.visualstudio.com/items?itemName=NishikantaRay.bootstrap5-snippets"
github_url = "https://github.com/NishikantaRay/bootstrap5-extension-pack"
highlights = [
    "Complete Bootstrap 5 snippet collection",
    "IntelliSense support for faster development",
    "Comprehensive component library integration",
    "Enhanced developer productivity tools"
]
```

**Project URL Features:**
- `live_url` for deployed/published projects
- `github_url` for source code repositories
- Both URLs render as styled buttons
- Professional spacing and presentation

### Skills with Enhanced Categories

```toml
[skills.frontend]
category = "Frontend Development"
technologies = ["React", "Vue.js", "Angular", "TypeScript", "Sass"]
proficiency = "Expert"

[skills.backend]
category = "Backend Development"
technologies = ["Node.js", "Python", "Java", "PostgreSQL", "MongoDB"]
proficiency = "Advanced"

[skills.tools]
category = "Tools & Technologies"
technologies = ["Docker", "AWS", "Git", "Jenkins", "Kubernetes"]
proficiency = "Intermediate"

[skills.mobile]
category = "Mobile Development"
technologies = ["React Native", "Flutter", "iOS", "Android"]
proficiency = "Intermediate"
```

### Achievements and Certifications

```toml
[[achievements]]
title = "AWS Certified Solutions Architect"
issuer = "Amazon Web Services"
date = "2023-05"
type = "certification"
description = "Professional certification in cloud architecture"

[[achievements]]
title = "Best Developer Award"
issuer = "Lets Flo"
date = "2023-12"
type = "award"
description = "Recognized for outstanding performance and innovation"

[[achievements]]
title = "Open Source Contributor"
issuer = "GitHub"
date = "2023"
type = "contribution"
description = "Active contributor to multiple open source projects"
```

### Advanced Display Settings

```toml
[settings]
show_gpa = true                    # Show GPA/CGPA information
show_location = true               # Show location information  
show_phone = true                  # Show phone number
date_format = "MMM YYYY"          # Date format: "Jan 2023"
enable_share_button = true         # Enable resume sharing
max_achievements_per_section = 5   # Limit achievements displayed
enable_company_links = true        # Enable company URL linking
enable_institution_links = true   # Enable institution URL linking
enable_project_urls = true         # Enable project URL buttons
enable_mentions = true             # Enable @mention processing
```

## Advanced TOML Features

### Manual TOML Parser Implementation

The resume system uses a sophisticated manual TOML parser:

```javascript
parseTomlManually(tomlContent) {
  const result = {};
  const lines = tomlContent.split('\n');
  let currentSection = null;
  let currentArray = null;
  let isInMultilineString = false;
  
  // Advanced parsing logic supporting:
  // - Nested sections: [skills.frontend]
  // - Array tables: [[experience]]
  // - Multi-line strings and arrays
  // - Error handling and validation
  
  return result;
}
```

### @Mention Processing System

```javascript
processTextWithMentions(text, companies) {
  if (!companies || typeof text !== 'string') return text;
  
  return text.replace(/@(\w+)/g, (match, company) => {
    const url = companies[company.toLowerCase()];
    if (url) {
      const displayName = this.formatCompanyName(company);
      return `<a href="${url}" class="company-mention" target="_blank">${displayName}</a>`;
    }
    return match;
  });
}

formatCompanyName(company) {
  // Converts "letsflo" to "Lets Flo"
  const nameMap = {
    'letsflo': 'Lets Flo',
    'teceads': 'Teceads'
  };
  return nameMap[company.toLowerCase()] || 
         company.charAt(0).toUpperCase() + company.slice(1);
}
```

### URL Generation and Styling

```javascript
generateProjectUrls(project) {
  let urlsHtml = '';
  
  if (project.live_url) {
    urlsHtml += `<a href="${project.live_url}" class="project-link" target="_blank">
      <i class="icon-external"></i> Live Demo
    </a>`;
  }
  
  if (project.github_url) {
    urlsHtml += `<a href="${project.github_url}" class="project-link github-link" target="_blank">
      <i class="icon-github"></i> GitHub
    </a>`;
  }
  
  return urlsHtml;
}
```

## Production Features

### Console Cleanup System
All debugging logs are removed for production:

```bash
# Automatic console cleanup
sed -i '' '/console\.log/d' js/resume-config-toml.js
sed -i '' '/console\.warn/d' js/resume-config-toml.js
sed -i '' '/console\.error/d' js/resume-config-toml.js
```

### Error Handling and Fallbacks

```javascript
class ResumeRenderer {
  constructor() {
    this.fallbackConfig = {
      personal: { name: "Name not configured" },
      companies: {},
      experience: [],
      education: [],
      projects: []
    };
  }
  
  async loadAndRender() {
    try {
      const config = await this.loadConfig();
      this.render(config);
    } catch (error) {
      console.warn('Using fallback configuration');
      this.render(this.fallbackConfig);
    }
  }
}
```

### Performance Optimizations

- **Efficient TOML Parsing**: Single-pass parsing algorithm
- **Lazy Loading**: Content loaded only when needed
- **Caching**: Configuration caching for better performance
- **Minification**: Production builds with minified code

---

## 🔗 Social Links Configuration

### Configuration File: `config/social.toml`

### Social Media Links

```toml
[social]
enabled = true
title = "Connect With Me"
subtitle = "Find me on social media and professional networks"

# Display settings
[display]
show_icons = true                  # Show social media icons
show_labels = true                 # Show platform names
open_in_new_tab = true            # Open links in new tab
show_follower_count = false       # Show follower counts (requires API)
layout = "horizontal"             # horizontal, vertical, grid

# Platform links
[[links]]
platform = "github"
url = "https://github.com/NishikantaRay"
username = "NishikantaRay"
icon = "🐙"                       # Custom icon (optional)
show = true

[[links]]
platform = "linkedin"
url = "https://linkedin.com/in/NishikantaRay"
username = "NishikantaRay"
icon = "💼"
show = true

[[links]]
platform = "twitter"
url = "https://twitter.com/NishikantaRay"
username = "@NishikantaRay"
icon = "🐦"
show = true

[[links]]
platform = "email"
url = "mailto:your@email.com"
username = "your@email.com"
icon = "📧"
show = true
```

### Custom Social Platform

```toml
[[links]]
platform = "custom"
name = "Portfolio"
url = "https://yourportfolio.com"
username = "View Portfolio"
icon = "🌐"
show = true
```

---

## 🎨 Theming & UI Features

### Theme System

The portfolio includes an automatic dark/light theme system:

**Features:**
- Automatic OS preference detection
- Manual theme toggle
- Persistent theme selection
- Smooth transitions between themes

**Custom CSS Variables:**

```css
:root {
  /* Light theme colors */
  --bg-color: #ffffff;
  --text-color: #333333;
  --accent-color: #0066cc;
  --border-color: #e1e5e9;
  --card-bg: #f8f9fa;
}

[data-theme="dark"] {
  /* Dark theme colors */
  --bg-color: #1a1a1a;
  --text-color: #e1e1e1;
  --accent-color: #4da6ff;
  --border-color: #333333;
  --card-bg: #2d2d2d;
}
```

### Responsive Design

**Breakpoints:**
- Mobile: `< 768px`
- Tablet: `768px - 1024px`
- Desktop: `> 1024px`

**CSS Grid Implementation:**

```css
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
}

@media (max-width: 768px) {
  .projects-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
```

---

## ⚙️ Configuration System

### TOML Configuration Loading

The portfolio uses a dynamic TOML configuration system:

**JavaScript Configuration Loader:**

```javascript
class ConfigLoader {
  constructor(configFile) {
    this.configFile = configFile;
    this.config = null;
  }

  async loadConfig() {
    try {
      const response = await fetch(`./config/${this.configFile}`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const tomlContent = await response.text();
      this.config = TOML.parse(tomlContent);
      return this.config;
    } catch (error) {
      console.warn(`Failed to load ${this.configFile}:`, error);
      return this.getFallbackConfig();
    }
  }

  isEnabled(section, feature = null) {
    if (feature) {
      return this.config[section]?.[feature] === true;
    }
    return this.config[section]?.enabled === true;
  }
}
```

### Configuration Validation

**Example validation function:**

```javascript
function validateConfig(config) {
  const errors = [];
  
  // Required fields validation
  if (!config.personal?.name) {
    errors.push("Personal name is required");
  }
  
  if (!config.personal?.email) {
    errors.push("Email is required");
  }
  
  // Date format validation
  config.experience?.forEach((exp, index) => {
    if (!isValidDate(exp.start_date)) {
      errors.push(`Invalid start_date in experience ${index + 1}`);
    }
  });
  
  return errors;
}
```

---

## 💻 Custom Development

### Adding New Features

#### 1. Create Configuration Section

Add to your TOML file:

```toml
[my_custom_feature]
enabled = true
title = "My Custom Feature"
setting1 = "value1"
setting2 = true
```

#### 2. Create JavaScript Handler

```javascript
class CustomFeature {
  constructor(config) {
    this.config = config;
  }

  render() {
    if (!this.config.my_custom_feature?.enabled) return;
    
    const container = document.querySelector('[data-section="custom-feature"]');
    if (!container) return;

    container.innerHTML = `
      <div class="custom-feature">
        <h2>${this.config.my_custom_feature.title}</h2>
        <p>Custom content here...</p>
      </div>
    `;
  }

  bindEvents() {
    // Add event listeners
    document.addEventListener('click', (e) => {
      if (e.target.matches('.custom-button')) {
        this.handleCustomAction(e);
      }
    });
  }

  handleCustomAction(event) {
    // Custom functionality
    console.log('Custom action triggered');
  }
}
```

#### 3. Add HTML Structure

```html
<section data-section="custom-feature" class="section">
  <!-- Content will be dynamically loaded -->
</section>
```

#### 4. Add CSS Styling

```css
.custom-feature {
  padding: 2rem;
  border-radius: 8px;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
}

.custom-feature h2 {
  color: var(--accent-color);
  margin-bottom: 1rem;
}
```

### Creating Custom Components

#### Modal Component Example

**HTML:**
```html
<div id="modal" class="modal" data-component="modal">
  <div class="modal-content">
    <span class="close">&times;</span>
    <div class="modal-body"></div>
  </div>
</div>
```

**CSS:**
```css
.modal {
  display: none;
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.4);
}

.modal-content {
  background-color: var(--bg-color);
  margin: 15% auto;
  padding: 20px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  width: 80%;
  max-width: 600px;
}
```

**JavaScript:**
```javascript
class Modal {
  constructor(modalId) {
    this.modal = document.getElementById(modalId);
    this.closeBtn = this.modal.querySelector('.close');
    this.bindEvents();
  }

  bindEvents() {
    this.closeBtn.addEventListener('click', () => this.close());
    window.addEventListener('click', (e) => {
      if (e.target === this.modal) this.close();
    });
  }

  open(content) {
    this.modal.querySelector('.modal-body').innerHTML = content;
    this.modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
}

// Usage
const modal = new Modal('modal');
modal.open('<h3>Project Details</h3><p>Project information...</p>');
```

### API Integration

#### GitHub API Integration

```javascript
class GitHubAPI {
  constructor(username) {
    this.username = username;
    this.baseUrl = 'https://api.github.com';
  }

  async getRepositories() {
    try {
      const response = await fetch(`${this.baseUrl}/users/${this.username}/repos`);
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch repositories:', error);
      return [];
    }
  }

  async getContributions() {
    try {
      const response = await fetch(`${this.baseUrl}/users/${this.username}/events`);
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch contributions:', error);
      return [];
    }
  }

  async renderRepositories(containerId) {
    const repos = await this.getRepositories();
    const container = document.getElementById(containerId);
    
    container.innerHTML = repos.map(repo => `
      <div class="repo-card">
        <h3><a href="${repo.html_url}" target="_blank">${repo.name}</a></h3>
        <p>${repo.description || 'No description'}</p>
        <div class="repo-stats">
          <span>⭐ ${repo.stargazers_count}</span>
          <span>🍴 ${repo.forks_count}</span>
          <span>👁️ ${repo.watchers_count}</span>
        </div>
      </div>
    `).join('');
  }
}

// Usage
const github = new GitHubAPI('NishikantaRay');
github.renderRepositories('github-repos');
```

---

## 🔧 Advanced Customization

### Custom Build Process

#### Package.json Scripts

```json
{
  "scripts": {
    "dev": "live-server --port=3000",
    "build": "npm run minify-css && npm run optimize-images",
    "minify-css": "cleancss -o dist/style.min.css css/*.css",
    "optimize-images": "imagemin assets/images/* --out-dir=dist/images",
    "deploy": "npm run build && gh-pages -d dist"
  },
  "devDependencies": {
    "live-server": "^1.2.1",
    "clean-css-cli": "^5.6.1",
    "imagemin-cli": "^7.0.0",
    "gh-pages": "^4.0.0"
  }
}
```

### Performance Optimization

#### Lazy Loading Implementation

```javascript
class LazyLoader {
  constructor() {
    this.imageObserver = new IntersectionObserver(this.handleImageIntersection.bind(this));
    this.contentObserver = new IntersectionObserver(this.handleContentIntersection.bind(this));
  }

  observeImages() {
    document.querySelectorAll('img[data-src]').forEach(img => {
      this.imageObserver.observe(img);
    });
  }

  observeContent() {
    document.querySelectorAll('[data-lazy-load]').forEach(element => {
      this.contentObserver.observe(element);
    });
  }

  handleImageIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove('lazy');
        this.imageObserver.unobserve(img);
      }
    });
  }

  handleContentIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;
        this.loadContent(element);
        this.contentObserver.unobserve(element);
      }
    });
  }

  async loadContent(element) {
    const contentUrl = element.dataset.lazyLoad;
    try {
      const response = await fetch(contentUrl);
      const content = await response.text();
      element.innerHTML = content;
      element.classList.add('loaded');
    } catch (error) {
      console.error('Failed to load content:', error);
    }
  }
}

// Initialize lazy loading
const lazyLoader = new LazyLoader();
lazyLoader.observeImages();
lazyLoader.observeContent();
```

#### Service Worker for Caching

```javascript
// sw.js
const CACHE_NAME = 'portfolio-v1';
const urlsToCache = [
  '/',
  '/css/home.css',
  '/css/projects.css',
  '/js/home.js',
  '/js/projects.js',
  '/config/home.toml',
  '/config/projects.toml'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});
```

**Register Service Worker:**

```javascript
// Register in your main JavaScript file
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}
```

### Analytics Integration

#### Google Analytics 4

```javascript
// Add to your HTML head
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

#### Custom Analytics Events

```javascript
class Analytics {
  constructor(trackingId) {
    this.trackingId = trackingId;
  }

  trackEvent(eventName, parameters = {}) {
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, parameters);
    }
  }

  trackPageView(pageName) {
    this.trackEvent('page_view', {
      page_title: pageName,
      page_location: window.location.href
    });
  }

  trackProjectView(projectName) {
    this.trackEvent('project_view', {
      project_name: projectName,
      page_location: window.location.href
    });
  }

  trackDownload(fileName) {
    this.trackEvent('file_download', {
      file_name: fileName,
      page_location: window.location.href
    });
  }
}

// Usage
const analytics = new Analytics('GA_MEASUREMENT_ID');
analytics.trackProjectView('E-commerce Platform');
```

---

## 🚀 Deployment & Performance

### GitHub Pages Deployment

#### 1. Setup GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm install
      
    - name: Build
      run: npm run build
      
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

#### 2. Manual Deployment

```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json
{
  "scripts": {
    "deploy": "gh-pages -d ."
  }
}

# Deploy
npm run deploy
```

### Netlify Deployment

#### 1. Create `netlify.toml`

```toml
[build]
  publish = "."
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*.css"
  [headers.values]
    Cache-Control = "public, max-age=31536000"

[[headers]]
  for = "/*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000"
```

#### 2. Environment Variables

```bash
# Set in Netlify dashboard
SITE_URL=https://yoursite.netlify.app
CONTACT_EMAIL=your@email.com
```

### Performance Optimization

#### Critical CSS Inlining

```html
<style>
  /* Critical above-the-fold CSS */
  .hero { /* styles */ }
  .nav { /* styles */ }
</style>

<link rel="preload" href="css/main.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="css/main.css"></noscript>
```

#### Image Optimization

```html
<!-- Use modern image formats with fallbacks -->
<picture>
  <source srcset="image.webp" type="image/webp">
  <source srcset="image.avif" type="image/avif">
  <img src="image.jpg" alt="Description" loading="lazy">
</picture>
```

#### Resource Hints

```html
<head>
  <!-- DNS prefetch for external resources -->
  <link rel="dns-prefetch" href="//fonts.googleapis.com">
  <link rel="dns-prefetch" href="//api.github.com">
  
  <!-- Preconnect to critical third-party origins -->
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  
  <!-- Preload critical resources -->
  <link rel="preload" href="fonts/Inter-Regular.woff2" as="font" type="font/woff2" crossorigin>
</head>
```

---

## 🐛 Troubleshooting Guide

### Common Issues

#### 1. TOML Configuration Not Loading

**Problem:** Configuration files not being read.

**Solutions:**
```javascript
// Check browser console for errors
console.error('TOML loading failed');

// Verify file path
fetch('./config/home.toml')
  .then(response => {
    if (!response.ok) {
      console.error('HTTP Error:', response.status);
    }
    return response.text();
  })
  .then(text => console.log('TOML content:', text));

// Validate TOML syntax
try {
  const parsed = TOML.parse(tomlContent);
  console.log('Valid TOML:', parsed);
} catch (error) {
  console.error('TOML syntax error:', error);
}
```

#### 2. Content Not Displaying

**Problem:** Configured content not showing on page.

**Debugging steps:**
```javascript
// Check if configuration loaded
console.log('Config:', window.homeConfig?.getConfig());

// Verify section is enabled
console.log('Section enabled:', window.homeConfig?.isEnabled('featured_projects'));

// Check DOM elements exist
const container = document.querySelector('[data-section="featured-projects"]');
console.log('Container found:', container);

// Verify CSS display properties
const styles = getComputedStyle(container);
console.log('Display:', styles.display, 'Visibility:', styles.visibility);
```

#### 3. Theme Toggle Not Working

**Problem:** Dark/light theme toggle not functioning.

**Solution:**
```javascript
// Check theme system initialization
console.log('Theme system:', window.themeSystem);

// Verify localStorage access
try {
  localStorage.setItem('test', 'test');
  localStorage.removeItem('test');
  console.log('localStorage available');
} catch (error) {
  console.error('localStorage not available:', error);
}

// Force theme update
document.documentElement.setAttribute('data-theme', 'dark');
```

#### 4. Mobile Responsiveness Issues

**Problem:** Layout breaking on mobile devices.

**CSS debugging:**
```css
/* Add debug borders */
* {
  border: 1px solid red !important;
}

/* Check viewport meta tag */
<meta name="viewport" content="width=device-width, initial-scale=1.0">

/* Verify media queries */
@media (max-width: 768px) {
  .debug-info::before {
    content: "Mobile view active";
    position: fixed;
    top: 0;
    left: 0;
    background: red;
    color: white;
    padding: 5px;
    z-index: 9999;
  }
}
```

### Debug Mode

Enable debug mode in your configuration:

```toml
[development]
debug_mode = true
show_config_overlay = true
log_performance = true
```

**Debug implementation:**
```javascript
class DebugMode {
  constructor(enabled) {
    this.enabled = enabled;
    if (enabled) {
      this.init();
    }
  }

  init() {
    this.createDebugOverlay();
    this.logPerformance();
    this.addDebugStyles();
  }

  createDebugOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'debug-overlay';
    overlay.innerHTML = `
      <div class="debug-panel">
        <h3>Debug Info</h3>
        <button onclick="this.toggleDebugInfo()">Toggle Config</button>
        <div class="debug-content"></div>
      </div>
    `;
    document.body.appendChild(overlay);
  }

  logPerformance() {
    console.log('Performance metrics:');
    console.log('DOM Content Loaded:', performance.getEntriesByType('navigation')[0].domContentLoadedEventEnd);
    console.log('Page Load:', performance.getEntriesByType('navigation')[0].loadEventEnd);
  }

  addDebugStyles() {
    const style = document.createElement('style');
    style.textContent = `
      #debug-overlay {
        position: fixed;
        top: 10px;
        right: 10px;
        z-index: 10000;
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 10px;
        border-radius: 5px;
        font-size: 12px;
        max-width: 300px;
      }
    `;
    document.head.appendChild(style);
  }
}
```

### Testing Checklist

#### Before Deployment

- [ ] All TOML files are valid syntax
- [ ] All images have alt text
- [ ] Links work correctly
- [ ] Mobile responsiveness tested
- [ ] Cross-browser compatibility checked
- [ ] Performance metrics acceptable
- [ ] Accessibility guidelines followed
- [ ] SEO meta tags present
- [ ] Form validation working
- [ ] Error handling implemented

#### Browser Testing

Test in these browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

#### Performance Testing

```javascript
// Performance measurement
function measurePerformance() {
  const navigation = performance.getEntriesByType('navigation')[0];
  const metrics = {
    DNS: navigation.domainLookupEnd - navigation.domainLookupStart,
    TCP: navigation.connectEnd - navigation.connectStart,
    Request: navigation.responseStart - navigation.requestStart,
    Response: navigation.responseEnd - navigation.responseStart,
    DOM: navigation.domContentLoadedEventEnd - navigation.responseEnd,
    Load: navigation.loadEventEnd - navigation.domContentLoadedEventEnd
  };
  
  console.table(metrics);
  return metrics;
}

// Call after page load
window.addEventListener('load', measurePerformance);
```

---

## 📚 Additional Resources

### Documentation Files

- [`HOME_CONFIG.md`](./HOME_CONFIG.md) - Detailed home page configuration
- [`PROJECTS_CONFIG.md`](./PROJECTS_CONFIG.md) - Complete projects page guide
- [`BLOG_CONFIG.md`](./BLOG_CONFIG.md) - Blog system documentation
- [`RESUME_CONFIG.md`](./RESUME_CONFIG.md) - Resume configuration guide
- [`SOCIAL_CONFIG.md`](./SOCIAL_CONFIG.md) - Social links setup

### External Dependencies

#### Required CDNs
```html
<!-- TOML Parser -->
<script src="https://cdn.jsdelivr.net/npm/js-toml@0.5.0/dist/toml.min.js"></script>

<!-- Markdown Parser -->
<script src="https://cdn.jsdelivr.net/npm/marked@9.1.2/marked.min.js"></script>

<!-- Chart.js for Analytics -->
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.js"></script>

<!-- Inter Font -->
<link rel="stylesheet" href="https://rsms.me/inter/inter.css">
```

#### Development Dependencies
```json
{
  "devDependencies": {
    "live-server": "^1.2.1",
    "clean-css-cli": "^5.6.1",
    "imagemin-cli": "^7.0.0",
    "gh-pages": "^4.0.0",
    "eslint": "^8.50.0",
    "prettier": "^3.0.0"
  }
}
```

### Code Style Guide

#### JavaScript
```javascript
// Use const/let instead of var
const config = await loadConfig();
let currentTheme = 'light';

// Use arrow functions for short functions
const formatDate = (date) => new Date(date).toLocaleDateString();

// Use template literals
const html = `<div class="card">${content}</div>`;

// Use destructuring
const { name, title, email } = personalInfo;

// Use async/await instead of promises
async function fetchData() {
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.error('Fetch failed:', error);
  }
}
```

#### CSS
```css
/* Use CSS custom properties */
:root {
  --primary-color: #0066cc;
  --spacing-unit: 1rem;
}

/* Use consistent naming convention */
.button-primary { }
.card-header { }
.nav-item { }

/* Use flexbox and grid for layouts */
.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-unit);
}

/* Mobile-first responsive design */
.element {
  /* Mobile styles first */
}

@media (min-width: 768px) {
  .element {
    /* Tablet and desktop styles */
  }
}
```

---

## 🎯 Next Steps

### 1. Quick Start
1. Fork the repository
2. Update `config/*.toml` files with your information
3. Customize `content/*.md` files
4. Deploy to GitHub Pages or Netlify

### 2. Customization
1. Review this documentation
2. Identify features you want to enable/disable
3. Modify configurations accordingly
4. Test thoroughly before deployment

### 3. Advanced Development
1. Study the existing JavaScript modules
2. Create custom features following the patterns
3. Add your own sections and components
4. Contribute back to the project

### 4. Maintenance
1. Keep dependencies updated
2. Monitor performance regularly
3. Test across different devices and browsers
4. Update content regularly

---

**Happy coding! 🚀**

> This documentation covers all major features and customization options. For specific implementation details, refer to the individual configuration guide files and examine the source code in the `js/` directory.