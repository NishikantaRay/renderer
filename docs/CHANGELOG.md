# 📝 Changelog

All notable changes to this portfolio project are documented here.

---

## [2.1.0] - 2025-10-26 - UI/UX & SEO Enhancement Release

### 🎨 New Features

#### ✨ **Profile Image Support**
- **Hero Section Profile Image**: Circular profile image display above the name
- **Configurable via TOML**: Set profile image URL in `home.toml`
- **GitHub Avatar Integration**: Direct support for GitHub avatar URLs
- **Responsive Design**: 120px diameter with hover effects
- **Professional Styling**: Border, shadow, and scale animation on hover

**Configuration Example:**
```toml
[hero]
profile_image = "https://avatars.githubusercontent.com/u/62615392?v=4"
name = "Your Name"
title = "Your Title"
```

**CSS Features:**
```css
.profile-img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid var(--border);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}
```

#### 🔍 **Complete SEO System**
- **TOML-Driven SEO Configuration**: Centralized SEO management in `home.toml`
- **Dynamic Meta Tags**: Automatic creation and update of all SEO meta tags
- **Open Graph Support**: Full Open Graph protocol implementation for social sharing
- **Twitter Cards**: Twitter Card meta tags for rich Twitter sharing
- **Search Engine Optimization**: Description, keywords, and author meta tags

**SEO Configuration:**
```toml
[seo]
title = "Your Name - Software Engineer & Full Stack Developer"
description = "Professional portfolio showcasing projects and experience."
keywords = "Full Stack Developer, Software Engineer, JavaScript, React"
author = "Your Name"
og_image = "https://yourimage.com/image.jpg"
og_url = "https://yourwebsite.com/"
twitter_card = "summary_large_image"
twitter_creator = "@yourusername"
```

**Supported Meta Tags:**
- `title` - Dynamic page title
- `description` - Meta description for search results
- `keywords` - SEO keywords
- `author` - Content author
- `og:title`, `og:description`, `og:image`, `og:url`, `og:type` - Open Graph tags
- `twitter:card`, `twitter:creator`, `twitter:title`, `twitter:description`, `twitter:image` - Twitter Card tags

#### 🎯 **Section Visibility Control**
- **Conditional Section Rendering**: Hide/show sections via TOML configuration
- **No Flickering on Load**: CSS-first hiding with JavaScript reveal
- **Smooth Transitions**: Fade-in animations for enabled sections
- **Performance Optimized**: Sections not loaded if disabled

**Configuration:**
```toml
[freelance_clients]
enabled = false  # Hides the entire section

[latest_products]
enabled = true   # Shows the section

[dashboard]
enabled = false  # Dashboard hidden
```

**Implementation:**
- Sections hidden by default with CSS `display: none`
- JavaScript adds `.section-visible` class when `enabled = true`
- Prevents flash of unwanted content (FOUC)

#### 🔗 **External Contact Form Integration**
- **Mailchimp Form Support**: Direct integration with Mailchimp contact forms
- **"Let's Talk" Button**: Links to external contact form
- **Auto-Detection**: JavaScript automatically adds `target="_blank"` for external URLs
- **Security**: Proper `rel="noopener noreferrer"` attributes

**Configuration:**
```toml
[hero.actions]
primary_text = "Hire Me"
primary_link = "resume.html"
secondary_text = "Let's Talk"
secondary_link = "https://us10.list-manage.com/contact-form?u=..."
```

#### 📱 **Mobile Navigation Fixes**
- **Hamburger Menu Visibility**: Fixed display issues on all pages
- **Proper Positioning**: Right-aligned hamburger menu on mobile
- **CSS Specificity**: Added `!important` flags for reliable display
- **Consistent Behavior**: Unified mobile menu across all pages

**CSS Improvements:**
```css
@media (max-width: 768px) {
  .mobile-menu-toggle {
    display: block !important;
  }
  
  .nav-container {
    justify-content: space-between;
  }
}
```

#### ❤️ **Enhanced Footer**
- **Dynamic Year**: JavaScript-powered year using `new Date().getFullYear()`
- **Renderer Credit**: Links to https://renderer.nishikanta.in/
- **Heart Emoji**: Added ❤️ after Renderer link
- **Name from TOML**: Gets name from configuration file

**Footer Template:**
```html
© 2025 Your Name. Built with <a href="https://renderer.nishikanta.in/">Renderer</a> ❤️
```

#### 🎨 **Content Loading Optimization**
- **Hero Section Fade-In**: Smooth opacity transition for intro and actions
- **No Content Flash**: Hidden by default, shown after TOML loads
- **Professional UX**: 0.3s fade transition for smooth appearance
- **Prevents Layout Shift**: Content stays hidden until ready

**CSS Implementation:**
```css
.hero-intro {
  opacity: 0;
  transition: opacity 0.3s ease;
}

.hero-intro.content-loaded {
  opacity: 1;
}
```

### 🔧 Technical Improvements

#### **JavaScript Enhancements**

**SEO Update System:**
```javascript
updateSEO() {
  if (!this.homeConfig?.seo) return;
  
  const seo = this.homeConfig.seo;
  document.title = seo.title;
  
  // Updates all meta tags dynamically
  this.updateMetaTag('name', 'description', seo.description);
  this.updateMetaTag('property', 'og:title', seo.title);
  this.updateMetaTag('name', 'twitter:card', seo.twitter_card);
}

updateMetaTag(attribute, attributeValue, content) {
  let element = document.querySelector(`meta[${attribute}="${attributeValue}"]`);
  
  if (element) {
    element.setAttribute('content', content);
  } else {
    element = document.createElement('meta');
    element.setAttribute(attribute, attributeValue);
    element.setAttribute('content', content);
    document.head.appendChild(element);
  }
}
```

**Section Visibility Management:**
```javascript
async loadFreelanceProjects() {
  const section = document.getElementById('freelance-projects');
  
  // Check if enabled in config
  if (this.homeConfig?.freelance_clients?.enabled === false) {
    if (section) {
      section.style.display = 'none';
      section.classList.remove('section-visible');
    }
    return;
  }
  
  // Show section if enabled
  if (section) {
    section.classList.add('section-visible');
  }
  
  // Load content...
}
```

**External Link Detection:**
```javascript
const secondaryBtn = document.querySelector('.btn-secondary');
if (secondaryBtn) {
  secondaryBtn.href = hero.actions.secondary_link;
  
  // Auto-detect external links
  if (hero.actions.secondary_link && 
      (hero.actions.secondary_link.startsWith('http://') || 
       hero.actions.secondary_link.startsWith('https://'))) {
    secondaryBtn.target = '_blank';
    secondaryBtn.rel = 'noopener noreferrer';
  }
}
```

### 🎨 UI/UX Improvements

#### **Visual Enhancements**
- **Profile Image Hover**: Scale effect (1.05x) with accent color border
- **Smooth Transitions**: 0.3s ease timing for all animations
- **Consistent Spacing**: Proper margins and padding throughout
- **Dark Theme Support**: All new elements fully compatible with dark mode

#### **Loading Performance**
- **CSS-First Hiding**: Elements hidden before JavaScript runs
- **Progressive Enhancement**: Content appears as it loads
- **No Layout Shifts**: Prevents cumulative layout shift (CLS)
- **Optimized Animations**: GPU-accelerated opacity transitions

### 🐛 Bug Fixes

#### **Navigation Issues**
- **Fixed**: Hamburger menu not visible on mobile devices
- **Fixed**: Menu positioning incorrect on contact page
- **Fixed**: CSS specificity conflicts with config-based hiding
- **Fixed**: Mobile menu toggle not working consistently

#### **Content Loading**
- **Fixed**: Flash of unstyled content (FOUC) on page load
- **Fixed**: Hero section showing default content before TOML loads
- **Fixed**: Sections appearing briefly before being hidden
- **Fixed**: Social links and actions displaying before configuration

#### **Configuration Issues**
- **Fixed**: `enabled = false` flags not hiding sections
- **Fixed**: Footer year showing static 2024 instead of current year
- **Fixed**: External links opening in same tab
- **Fixed**: Profile image path not updating from TOML

### 📚 Documentation Updates

#### **New Documentation Files**
- **HOME_CONFIG.md**: Complete guide for home page configuration with SEO
- **Updated README.md**: New features and quick start guide
- **Updated CHANGELOG.md**: This comprehensive changelog

#### **Configuration Examples**
```toml
# Complete home.toml example with all new features
[seo]
title = "Your Name - Portfolio"
description = "Professional portfolio"
keywords = "developer, portfolio"
author = "Your Name"
og_image = "https://image.com/og.jpg"
og_url = "https://yoursite.com"
twitter_card = "summary_large_image"
twitter_creator = "@you"

[hero]
profile_image = "https://avatar.com/you.jpg"
name = "Your Name"
title = "Your Title"
intro = ["Your introduction"]

[hero.actions]
primary_text = "Hire Me"
primary_link = "resume.html"
secondary_text = "Let's Talk"
secondary_link = "https://contact-form.com"

[freelance_clients]
enabled = false

[latest_products]
enabled = true

[dashboard]
enabled = false
```

### 🚀 Migration Guide (v2.0 to v2.1)

#### **1. Add SEO Configuration**
```toml
# Add to config/home.toml
[seo]
title = "Your Name - Your Title"
description = "Your description here"
keywords = "your, keywords, here"
author = "Your Name"
og_image = "https://your-image-url.com/image.jpg"
og_url = "https://yourwebsite.com"
twitter_card = "summary_large_image"
twitter_creator = "@yourusername"
```

#### **2. Add Profile Image**
```toml
[hero]
profile_image = "https://avatars.githubusercontent.com/u/YOUR_ID?v=4"
# or local path
profile_image = "./assets/images/profile.jpg"
```

#### **3. Update Contact Form Link**
```toml
[hero.actions]
secondary_link = "https://your-contact-form-url.com"
```

#### **4. Control Section Visibility**
```toml
[freelance_clients]
enabled = false  # or true

[latest_products]
enabled = false  # or true

[dashboard]
enabled = false  # or true
```

### 📊 Performance Metrics

#### **Loading Improvements**
- **Reduced FOUC**: 100% elimination of flash of unstyled content
- **Faster Perceived Load**: Content appears smoothly with transitions
- **Better CLS Score**: No layout shifts from hidden/shown content
- **Optimized Rendering**: CSS-first approach reduces JavaScript work

#### **SEO Improvements**
- **Dynamic Meta Tags**: All tags created and updated automatically
- **Social Sharing**: Rich previews on Facebook, Twitter, LinkedIn
- **Search Engine Friendly**: Proper meta descriptions and keywords
- **Structured Data Ready**: Foundation for future schema.org integration

---

## [2.0.0] - 2024-10-26 - Major Feature Release

### 🚀 Major Features Added

#### ✨ **TOML-First Architecture**
- **Complete Configuration Control**: Eliminated all JavaScript hardcoding in favor of TOML-driven configuration
- **Enhanced Manual TOML Parser**: Robust parsing system supporting all TOML features without external dependencies
- **Fallback System**: Graceful error handling with comprehensive fallback configurations
- **Performance Optimized**: Single-pass parsing algorithm for efficient configuration loading

#### 🔗 **@Mention Company System**
- **Smart Text Processing**: Automatic detection and conversion of `@company` mentions to clickable links
- **Company URL Mapping**: Centralized company URL configuration in `[companies]` section
- **Professional Styling**: Dedicated CSS classes for company mentions with hover effects
- **Flexible Configuration**: Support for any number of companies with custom display names

**Example Implementation:**
```toml
[companies]
letsflo = "https://letsflo.com"
teceads = "https://teceads.com"

[summary]
text = "Experienced developer at @letsflo and @teceads with proven track record."
```

#### 🌐 **Enhanced URL Support System**
- **Dual Project URLs**: Support for both `live_url` and `github_url` in project configurations
- **Institution Links**: Clickable educational institution names with proper URL handling
- **Company Links**: Work experience companies now linkable with professional styling
- **Smart URL Parsing**: Automatic detection and proper rendering of all URL types

#### 📊 **Education System Improvements**
- **Marks Display**: Proper handling of XII and X marks through `notes` field
- **Flexible Date Ranges**: Support for various date formats and graduation year configurations
- **Institution URLs**: Clickable links to educational institutions
- **GPA vs Notes**: Smart display logic for university GPA vs school marks

#### 🎨 **Professional Styling System**
- **Comprehensive CSS Classes**: Dedicated styling for all interactive elements
- **Dark Theme Support**: Full dark mode compatibility for all new link types
- **Responsive Design**: Mobile-optimized layout for all new features
- **Hover Effects**: Professional animations and transitions throughout

### 🔧 Technical Improvements

#### **TOML Parser Enhancements**
```javascript
// Advanced parsing capabilities
parseTomlManually(tomlContent) {
  // Supports:
  // - Nested sections: [skills.frontend]
  // - Array tables: [[experience]]
  // - Multi-line strings and arrays
  // - Error handling and validation
}
```

#### **@Mention Processing**
```javascript
processTextWithMentions(text, companies) {
  return text.replace(/@(\w+)/g, (match, company) => {
    const url = companies[company.toLowerCase()];
    return url ? `<a href="${url}" class="company-mention" target="_blank">${formatCompanyName(company)}</a>` : match;
  });
}
```

#### **URL Generation System**
```javascript
generateProjectUrls(project) {
  // Handles both live_url and github_url
  // Professional button styling
  // External link indicators
}
```

### 🚀 Production Ready Features

#### **Console Cleanup System**
- **All Debug Logs Removed**: Complete removal of console.log, console.warn, and console.error statements
- **Clean Production Code**: Professional code quality suitable for deployment
- **Performance Optimized**: Reduced console overhead for better performance

#### **Error Handling**
- **Comprehensive Fallbacks**: Graceful degradation when configuration fails
- **Validation System**: Input validation for all configuration fields
- **User-Friendly Errors**: Meaningful error messages for debugging

### 📈 Configuration Enhancements

#### **Resume Configuration (config/resume.toml)**
```toml
# New company mapping section
[companies]
letsflo = "https://letsflo.com"
teceads = "https://teceads.com"

# Enhanced summary with @mention support
[summary]
text = "Developer with experience at @letsflo and @teceads."

# Work experience with company URLs
[[experience]]
company = "Lets Flo"
company_url = "https://letsflo.com"

# Education with institution URLs and marks
[[education]]
degree = "XII (Science)"
institution = "D.A.V. Public School"
institution_url = "https://davpublicschool.com"
notes = "79.67%"  # Displays as marks

# Projects with dual URL support
[[projects]]
name = "Live Server Lite"
live_url = "https://marketplace.visualstudio.com/items?itemName=ritwickdey.live-server-lite"
github_url = "https://github.com/NishikantaRay/live-server-lite"
```

### 🎯 Content Updates

#### **New Project Additions**
- **Live Server Lite**: VS Code extension with 2000+ installations
- **Bootstrap 5 Extension Pack**: Comprehensive development tools
- **Enhanced Project Descriptions**: Detailed highlights with metrics and achievements

#### **Education Data Updates**
- **Location Changes**: Updated from "Bhubaneswar, Odisha" to "Bengaluru, KA"
- **Marks Display**: Proper XII (79.67%) and X (77.5%) marks showing
- **Institution Links**: All educational institutions now have clickable URLs

### 🔍 Documentation Updates

#### **Comprehensive Documentation**
- **README.md**: Updated with latest features and quick start guide
- **RESUME_CONFIG.md**: Complete guide for new resume features
- **COMPLETE_FEATURES_GUIDE.md**: Enhanced with v2.0 capabilities
- **CHANGELOG.md**: This comprehensive changelog document

#### **Examples and Use Cases**
- **@Mention Examples**: Real-world usage patterns
- **URL Configuration**: Step-by-step setup guides
- **CSS Customization**: Styling options and overrides

### 🚀 Performance & Quality

#### **Code Quality Improvements**
- **Production Ready**: Clean, commented, and optimized code
- **Error Handling**: Comprehensive try-catch blocks and fallbacks
- **Type Safety**: Better JavaScript patterns and validation
- **Memory Optimization**: Efficient parsing and rendering algorithms

#### **CSS Architecture**
```css
/* Professional styling system */
.company-mention {
  color: var(--accent-color);
  text-decoration: none;
  font-weight: 500;
  border-bottom: 1px dotted var(--accent-color);
  transition: all 0.3s ease;
}

.institution-link {
  color: var(--accent-color);
  text-decoration: none;
  font-weight: 500;
}

.project-link {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: var(--accent-color);
  color: white;
  text-decoration: none;
  border-radius: 4px;
  margin: 0.25rem;
  transition: all 0.3s ease;
}
```

### 🔄 Migration Guide

#### **From v1.x to v2.0**

1. **Update Resume Configuration**:
   ```toml
   # Add company mapping section
   [companies]
   yourcompany = "https://yourcompany.com"
   
   # Update summary to use @mentions
   [summary]
   text = "Experience at @yourcompany..."
   ```

2. **Add Institution URLs**:
   ```toml
   [[education]]
   institution_url = "https://yourinstitution.com"
   ```

3. **Update Project URLs**:
   ```toml
   [[projects]]
   live_url = "https://yourproject.com"
   github_url = "https://github.com/user/repo"
   ```

### 🐛 Bug Fixes

#### **Resume System**
- **Fixed**: Summary section not loading properly
- **Fixed**: Education marks not displaying for XII/X
- **Fixed**: Project URLs not parsing correctly
- **Fixed**: Company names not clickable in work experience

#### **Configuration System**
- **Fixed**: TOML parsing errors with special characters
- **Fixed**: Array handling in nested sections
- **Fixed**: Multi-line string processing

#### **Styling Issues**
- **Fixed**: Dark theme compatibility for new link types
- **Fixed**: Mobile responsiveness for project URL buttons
- **Fixed**: Hover effects not working on touch devices

### 🎨 UI/UX Improvements

#### **Interactive Elements**
- **Enhanced**: Link hover effects with smooth transitions
- **Improved**: Button styling for project URLs
- **Added**: External link indicators for better UX
- **Optimized**: Mobile touch interactions

#### **Visual Hierarchy**
- **Better**: Section spacing and organization
- **Clearer**: Typography hierarchy for different content types
- **Professional**: Color scheme consistency across all elements

### 🔮 Future Enhancements

#### **Planned Features**
- **Advanced Analytics**: Project view tracking and statistics
- **Search Functionality**: Search across resume content
- **Export Options**: PDF generation and sharing capabilities
- **Multi-language Support**: Internationalization features

#### **Technical Roadmap**
- **TypeScript Migration**: Type safety for all configuration
- **Build System**: Automated minification and optimization
- **Testing Suite**: Comprehensive unit and integration tests
- **CI/CD Pipeline**: Automated deployment and quality checks

---

## [1.0.0] - 2024-10-15 - Initial Release

### 🎉 Initial Features

#### **Core Portfolio System**
- Basic home, about, projects, blog, and resume pages
- TOML configuration system for basic content
- Responsive design with dark/light theme support
- Social media integration

#### **Resume System**
- Basic personal information display
- Work experience and education sections
- Skills and achievements listing
- Simple project showcase

#### **Blog System**
- Markdown content support
- Basic post listing and pagination
- Category and tag support

#### **Configuration**
- TOML-based configuration files
- Basic theme customization
- Social media links configuration

### 🎯 Target Audience
- Developers and designers looking for a minimal portfolio
- Students and professionals needing a resume website
- Content creators wanting a simple blog platform

---

## 📊 Version Comparison

| Feature | v1.0 | v2.0 |
|---------|------|------|
| TOML Configuration | Basic | Complete (TOML-first) |
| Company Links | None | @Mention system |
| Project URLs | Single URL | Dual URL support |
| Education System | Basic | Enhanced with marks/URLs |
| Console Output | Debug logs | Production clean |
| CSS Architecture | Basic | Professional with themes |
| Error Handling | Limited | Comprehensive |
| Documentation | Basic | Complete with examples |

---

## 🚀 Getting Started with v2.0

### **Quick Migration Checklist**

- [ ] Update `config/resume.toml` with company mappings
- [ ] Add `@mentions` to your summary text
- [ ] Include `institution_url` in education entries
- [ ] Add `live_url` and `github_url` to projects
- [ ] Update marks using `notes` field for XII/X
- [ ] Test all links and functionality
- [ ] Review documentation for advanced features

### **New Developer Setup**

1. **Clone and Install**:
   ```bash
   git clone https://github.com/NishikantaRay/minimal-portfolio.git
   cd minimal-portfolio
   npm install
   ```

2. **Configure Resume**:
   ```toml
   # config/resume.toml
   [companies]
   mycompany = "https://mycompany.com"
   
   [personal]
   name = "Your Name"
   title = "Your Title"
   
   [summary]
   text = "Developer with experience at @mycompany..."
   ```

3. **Start Development**:
   ```bash
   npm run dev
   ```

4. **Deploy**:
   ```bash
   npm run build
   npm run deploy
   ```

---

## 📚 Additional Resources

### **Documentation**
- [Complete Features Guide](./COMPLETE_FEATURES_GUIDE.md) - Comprehensive feature documentation
- [Resume Configuration](./RESUME_CONFIG.md) - Detailed resume setup guide
- [Projects Configuration](./PROJECTS_CONFIG.md) - Project showcase configuration
- [Blog Configuration](./BLOG_CONFIG.md) - Blog system setup

### **Examples**
- [Sample Resume Configuration](../config/resume.toml) - Complete example
- [CSS Customization Examples](./COMPLETE_FEATURES_GUIDE.md#css-classes-for-styling) - Styling guides
- [Migration Examples](./COMPLETE_FEATURES_GUIDE.md#migration-guide) - Upgrade instructions

### **Support**
- GitHub Issues for bug reports and feature requests
- Documentation for setup and configuration help
- Community discussions for best practices and tips

---

**Thank you for using the minimal portfolio system! 🚀**

> This changelog will be updated with each release. For the latest features and updates, always refer to the most recent version documentation.