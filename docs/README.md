# 📚 Documentation Hub

> **Complete Guide to Your Minimal Portfolio**  
> Everything you need to configure, customize, and extend your portfolio website.

---

## 🚀 Quick Start

### 1. **First Time Setup**
```bash
# Clone and navigate to your portfolio
git clone https://github.com/NishikantaRay/minimal-portfolio.git
cd minimal-portfolio

# Start development server
npm install
npm run dev
```

### 2. **Essential Configuration**
Update these files with your information:
- `config/home.toml` - Your name, title, and hero section
- `config/resume.toml` - Your professional information with @mention support
- `config/social.toml` - Your social media links

### 3. **Content Creation**
Add your content to:
- `content/about.md` - About page content
- `content/projects.md` - Projects showcase
- `content/blog.md` - Blog posts and articles

## ✨ Latest Features (v2.0)

### 🎯 **TOML-First Architecture**
- **Complete Configuration Control**: Everything is now configurable through TOML files
- **No JavaScript Hardcoding**: All content, links, and settings come from configuration
- **Enhanced Manual TOML Parser**: Robust parsing for all resume sections

### 🔗 **@Mention System**
- **Dynamic Company Links**: Use @letsflo in your summary to create clickable "Lets Flo" links
- **Company URL Mapping**: Configure company URLs in `[companies]` section
- **Smart Text Processing**: Automatic mention detection and link generation

### 🌐 **Enhanced URL Support**
- **Project URLs**: Support for both `live_url` and `github_url` in projects
- **Institution Links**: Educational institutions now linkable with URLs
- **Company Links**: Work experience companies with clickable links
- **Professional Presentation**: All links styled with proper hover effects

### 📊 **Education System Improvements**
- **Marks Display**: Shows XII and X marks properly through `notes` field
- **Date Range Support**: Flexible date formats for all education entries
- **Institution URLs**: Clickable links to educational institutions
- **Enhanced Validation**: Better handling of graduation years and GPA display

### 🚀 **Production Ready**
- **Clean Console Output**: All debugging logs removed for production
- **Error Handling**: Comprehensive fallback systems
- **Performance Optimized**: Efficient TOML parsing and rendering
- **Professional Styling**: Dark theme support for all new link types

---

## 📖 Documentation Structure

### **🏠 Core Pages Configuration**

| Document | Purpose | Key Features |
|----------|---------|--------------|
| [`HOME_CONFIG.md`](./HOME_CONFIG.md) | Home page setup | Hero section, clients, products, dashboard |
| [`PROJECTS_CONFIG.md`](./PROJECTS_CONFIG.md) | Projects showcase | Analytics, filtering, GitHub integration |
| [`BLOG_CONFIG.md`](./BLOG_CONFIG.md) | Blog system | Posts, pagination, categories, search |
| [`RESUME_CONFIG.md`](./RESUME_CONFIG.md) | Interactive resume | Experience, skills, achievements |
| [`SOCIAL_CONFIG.md`](./SOCIAL_CONFIG.md) | Social links | Platforms, display options, icons |

### **🔧 Advanced Guides**

| Document | Purpose | For Who |
|----------|---------|----------|
| [`COMPLETE_FEATURES_GUIDE.md`](./COMPLETE_FEATURES_GUIDE.md) | All features & customization | Developers, Advanced users |
| [`DASHBOARD-CONFIG.md`](./DASHBOARD-CONFIG.md) | Analytics dashboard | Data-driven users |
| [`ENHANCED-CONFIG-PROPOSAL.md`](./ENHANCED-CONFIG-PROPOSAL.md) | Future enhancements | Contributors |

---

## 🎯 Common Use Cases & Examples

### **🎨 Personal Portfolio (Designer)**

**Goal:** Showcase design work with visual emphasis

**Configuration Example:**
```toml
# config/home.toml
[hero]
name = "Alex Designer"
title = "UI/UX Designer & Visual Artist"
intro = [
    "I create beautiful, user-centered digital experiences.",
    "Specializing in modern web design and brand identity."
]

# config/projects.toml
[featured_projects]
enabled = true
show_categories = true
enable_hover_effects = true
show_features_list = true

[ui]
animations = true
smooth_scrolling = true
```

**Content Focus:**
- Visual project showcases in `content/projects.md`
- Design process articles in blog
- Creative achievements in resume

---

### **💻 Software Developer Portfolio**

**Goal:** Highlight technical skills and open source contributions

**Configuration Example:**
```toml
# config/home.toml
[dashboard]
enabled = true
title = "Development Stats"

[dashboard.stats]
total_projects = 30
github_repos = 25
contributions = 1200
years_experience = 5

# config/projects.toml
[opensource]
enabled = true
show_github_stats = true
github_username = "NishikantaRay"

[project_stats]
enabled = true
show_github_activity = true
show_technology_breakdown = true
```

**Content Focus:**
- Technical blog posts about coding
- Open source project documentation
- Detailed technical resume with projects

---

### **📝 Content Creator/Blogger Portfolio**

**Goal:** Emphasize writing and content creation

**Configuration Example:**
```toml
# config/blog.toml
[blog]
title = "Tech Insights Blog"
description = "Sharing knowledge about web development and design"

[settings]
enable_search = true
enable_categories = true
enable_social_sharing = true
enable_related_posts = true

# config/home.toml
[sections]
enabled_sections = ["latest-products", "dashboard"]

[latest_products]
title = "Latest Articles"
```

**Content Focus:**
- Rich blog content with categories and tags
- About page highlighting writing experience
- Social media integration for content sharing

---

### **🚀 Startup Founder Portfolio**

**Goal:** Show entrepreneurial journey and products

**Configuration Example:**
```toml
# config/home.toml
[freelance_clients]
enabled = true
title = "Trusted Partners"

[latest_products]
enabled = true
title = "Products & Ventures"

# Multiple products with status indicators
[[latest_products.products]]
name = "SaaS Platform"
status = "Live"
description = "B2B analytics dashboard"

[[latest_products.products]]
name = "Mobile App"
status = "Beta"
description = "Productivity app for teams"
```

**Content Focus:**
- Business-focused project descriptions
- Entrepreneurial blog content
- Leadership and business achievements

---

## ⚙️ Configuration Quick Reference

### **Essential TOML Syntax**

```toml
# Comments start with #
# Strings must be quoted
title = "My Portfolio"

# Booleans are lowercase
enabled = true
show_stats = false

# Numbers don't need quotes
posts_per_page = 6
years_experience = 5

# Arrays use square brackets
tags = ["React", "TypeScript", "Node.js"]

# Objects use [brackets]
[hero]
name = "Nishikanta Ray"
title = "Your Title"

# Arrays of objects use [[double brackets]]
[[experience]]
position = "Senior Developer"
company = "Tech Corp"
```

### **Common Configuration Patterns**

#### **Enable/Disable Features**
```toml
[feature_name]
enabled = true                    # Show this feature
title = "Custom Title"           # Override default title

[another_feature]
enabled = false                  # Hide this feature
```

#### **Display Settings**
```toml
[settings]
show_gpa = true                  # Show/hide specific fields
show_location = false
date_format = "MMM YYYY"        # Customize date display
max_items = 10                   # Limit number of items shown
```

#### **Social Links**
```toml
[[links]]
platform = "github"
url = "https://github.com/username"
username = "username"
show = true
```

#### **Content with Metadata**
```toml
[[posts]]
id = "unique-post-id"
title = "Post Title"
date = "2024-10-23"
tags = ["tag1", "tag2"]
featured = true
content_file = "post-filename.md"
```

---

## 🛠️ Development Workflow

### **1. Local Development**
```bash
# Start development server
npm run dev

# Open in browser
http://localhost:3000
```

### **2. Content Updates**
```bash
# Edit configuration files
vim config/home.toml

# Update content
vim content/about.md

# Changes are live-reloaded automatically
```

### **3. Testing Configuration**
```javascript
// Check configuration in browser console
console.log('Home Config:', window.homeConfig?.getConfig());
console.log('Projects Config:', window.projectsConfig?.getConfig());

// Verify feature enabled
console.log('Feature enabled:', window.homeConfig?.isEnabled('dashboard'));
```

### **4. Build & Deploy**
```bash
# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy

# Or deploy to Netlify
# Just push to your repository if connected to Netlify
```

---

## 🎨 Styling & Themes

### **CSS Custom Properties**
The portfolio uses CSS custom properties for consistent theming:

```css
:root {
  /* Colors */
  --primary-color: #0066cc;
  --secondary-color: #6c757d;
  --success-color: #28a745;
  --warning-color: #ffc107;
  --danger-color: #dc3545;
  
  /* Layout */
  --max-width: 1200px;
  --border-radius: 8px;
  --box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  
  /* Typography */
  --font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-size-base: 1rem;
  --line-height-base: 1.6;
}
```

### **Dark Mode Override**
```css
[data-theme="dark"] {
  --bg-color: #1a1a1a;
  --text-color: #e1e1e1;
  --primary-color: #4da6ff;
  --card-bg: #2d2d2d;
  --border-color: #333333;
}
```

### **Custom Styling Example**
```css
/* Add to your CSS file */
.custom-section {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: 2rem;
  margin: 2rem 0;
}

.custom-button {
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: all 0.3s ease;
}

.custom-button:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}
```

---

## 📊 Examples by Industry

### **Frontend Developer**
```toml
# Focus on UI/UX skills and modern frameworks
[skills.frontend]
technologies = ["React", "Vue.js", "TypeScript", "Sass", "Tailwind CSS"]
proficiency = "Expert"

[skills.tools]
technologies = ["Webpack", "Vite", "Figma", "Storybook"]
proficiency = "Advanced"

# Show interactive projects
[featured_projects]
show_tech_stack = true
show_project_links = true
enable_hover_effects = true
```

### **Backend Developer**
```toml
# Emphasize server-side technologies
[skills.backend]
technologies = ["Node.js", "Python", "PostgreSQL", "Redis", "Docker"]
proficiency = "Expert"

[skills.cloud]
technologies = ["AWS", "Kubernetes", "CI/CD", "Monitoring"]
proficiency = "Advanced"

# Show system architecture and APIs
[opensource]
enabled = true
show_github_stats = true
```

### **Full-Stack Developer**
```toml
# Balance frontend and backend
[dashboard.stats]
total_projects = 40
github_repos = 30
contributions = 2000
years_experience = 7

# Show comprehensive project analytics
[project_stats]
enabled = true
show_technology_breakdown = true
show_project_timeline = true
```

### **DevOps Engineer**
```toml
# Focus on infrastructure and automation
[skills.devops]
technologies = ["Docker", "Kubernetes", "Terraform", "Jenkins"]
proficiency = "Expert"

[skills.monitoring]
technologies = ["Prometheus", "Grafana", "ELK Stack"]
proficiency = "Advanced"

# Highlight automation projects
[featured_projects]
show_categories = true  # Infrastructure, Automation, Monitoring
```

### **Data Scientist**
```toml
# Emphasize data and ML skills
[skills.data]
technologies = ["Python", "R", "TensorFlow", "PyTorch", "Jupyter"]
proficiency = "Expert"

[skills.visualization]
technologies = ["D3.js", "Tableau", "Power BI", "Matplotlib"]
proficiency = "Advanced"

# Show data-driven projects
[project_stats]
enabled = true
chart_type = "line"  # Good for showing trends
```

---

## 🔧 Troubleshooting Quick Fixes

### **Configuration Not Loading**
```javascript
// Check in browser console
fetch('./config/home.toml')
  .then(r => r.text())
  .then(text => console.log('TOML content:', text))
  .catch(err => console.error('Failed to load:', err));
```

### **Content Not Displaying**
```javascript
// Debug configuration loading
console.log('Config loaded:', window.homeConfig?.config);
console.log('Section enabled:', window.homeConfig?.isEnabled('hero'));

// Check DOM elements
const element = document.querySelector('[data-section="hero"]');
console.log('Element found:', element);
```

### **Styling Issues**
```css
/* Add temporary debug borders */
* { border: 1px solid red !important; }

/* Check responsive breakpoints */
body::before {
  content: "Mobile";
  position: fixed;
  top: 0;
  left: 0;
  background: red;
  color: white;
  padding: 5px;
  z-index: 9999;
}

@media (min-width: 768px) {
  body::before { content: "Tablet"; }
}

@media (min-width: 1024px) {
  body::before { content: "Desktop"; }
}
```

### **Performance Issues**
```javascript
// Measure loading performance
window.addEventListener('load', () => {
  const navigation = performance.getEntriesByType('navigation')[0];
  console.log('Page load time:', navigation.loadEventEnd - navigation.fetchStart, 'ms');
  console.log('DOM ready:', navigation.domContentLoadedEventEnd - navigation.fetchStart, 'ms');
});
```

---

## 📚 Additional Resources

### **External Documentation**
- [TOML Specification](https://toml.io/en/) - Understanding TOML syntax
- [Markdown Guide](https://www.markdownguide.org/) - Writing content in Markdown
- [Inter Font](https://rsms.me/inter/) - Typography used in the portfolio

### **Development Tools**
- [VS Code TOML Extension](https://marketplace.visualstudio.com/items?itemName=be5invis.toml) - Syntax highlighting
- [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) - Local development
- [Prettier](https://prettier.io/) - Code formatting

### **Deployment Platforms**
- [GitHub Pages](https://pages.github.com/) - Free hosting for GitHub repositories
- [Netlify](https://www.netlify.com/) - JAMstack deployment platform
- [Vercel](https://vercel.com/) - Frontend deployment platform

---

## 🎯 Getting Help

### **Common Questions**

**Q: How do I add a new page?**
A: Create an HTML file, add corresponding CSS/JS files, and update navigation in existing pages.

**Q: Can I use custom fonts?**
A: Yes! Add font links to HTML head and update CSS custom properties.

**Q: How do I add new social platforms?**
A: Add new entries to `config/social.toml` and update the JavaScript handler if needed.

**Q: Can I customize the color scheme?**
A: Absolutely! Modify CSS custom properties in `:root` and `[data-theme="dark"]` selectors.

### **Getting Support**
1. Check this documentation first
2. Review browser console for errors
3. Test with sample configurations
4. Open an issue on GitHub with details

---

## 🚀 Next Steps

### **For Beginners**
1. Start with basic configuration in `config/home.toml`
2. Add your content to `content/about.md`
3. Customize social links in `config/social.toml`
4. Deploy to GitHub Pages

### **For Advanced Users**
1. Review [`COMPLETE_FEATURES_GUIDE.md`](./COMPLETE_FEATURES_GUIDE.md)
2. Implement custom features using the JavaScript patterns
3. Optimize performance with advanced techniques
4. Contribute improvements back to the project

### **For Contributors**
1. Read [`ENHANCED-CONFIG-PROPOSAL.md`](./ENHANCED-CONFIG-PROPOSAL.md)
2. Follow the coding standards in the guide
3. Submit pull requests with new features
4. Help improve documentation

---

**Ready to build your amazing portfolio? Start with the configuration files and let your creativity shine! ✨**

> **💡 Pro Tip:** Begin with the examples that match your profession, then customize from there. The portfolio system is designed to grow with your needs!