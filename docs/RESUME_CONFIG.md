# Resume Configuration Guide

This guide explains how to configure your resume content using the TOML configuration file with the latest v2.0 features.

## 🆕 Latest Features (v2.0)

### ✨ **TOML-First Architecture**
- Complete configuration control through TOML files
- No JavaScript hardcoding - everything configurable
- Enhanced manual TOML parser for all sections

### 🔗 **@Mention System**
- Use `@letsflo` in your summary to create clickable "Lets Flo" links
- Configure company URLs in `[companies]` section
- Automatic mention detection and professional link generation

### 🌐 **Enhanced URL Support**
- Project URLs with `live_url` and `github_url` support
- Institution URLs for educational backgrounds
- Company URLs for work experience
- Professional styling with hover effects

### 📊 **Education Improvements**
- Marks display through `notes` field for XII/X education
- Flexible date ranges and graduation year support
- Institution URL linking capabilities

## Configuration File Location

The resume content is configured in: `config/resume.toml`

## Section Overview

### 1. Personal Information

```toml
[personal]
name = "Your Full Name"
title = "Your Professional Title"
phone = "+1 (555) 123-4567"
email = "your.email@example.com"
website = "https://renderer.nishikanta.in"
github = "https://github.com/NishikantaRay"
linkedin = "https://linkedin.com/in/NishikantaRay"
location = "City, State"
```

### 2. Company URL Mapping (NEW in v2.0)

```toml
[companies]
letsflo = "https://letsflo.com"
teceads = "https://teceads.com"
techcorp = "https://techcorp.com"
# Add any company you mention in your resume
```

### 3. Professional Summary with @Mention Support

```toml
[summary]
text = "Experienced Full Stack Developer with 5+ years at @letsflo and other tech companies. Passionate about creating scalable applications and leading development teams."
```

**How @Mentions Work:**
- Write `@letsflo` in your summary text
- The system automatically converts it to a clickable "Lets Flo" link
- The URL comes from the `[companies]` section
- Works with any company defined in the companies section

### 4. Work Experience with Company URLs

```toml
[[experience]]
position = "Senior Software Engineer"
company = "Lets Flo"
company_url = "https://letsflo.com"
location = "San Francisco, CA"
start_date = "Jan 2022"
end_date = "Present"
is_current = true
achievements = [
    "Led development of microservices architecture serving 100k+ users",
    "Improved system performance by 60% through optimization",
    "Mentored junior developers and established coding standards"
]
```

**Company URL Features:**
- `company_url` field creates clickable company names
- Professional styling with hover effects
- Opens in new tab for better user experience

### 5. Education with Institution URLs and Marks

```toml
[[education]]
degree = "XII (Science)"
institution = "D.A.V. Public School"
institution_url = "https://davpublicschool.com"
location = "Bhubaneswar, Odisha"
graduation_year = "2019"
notes = "79.67%"  # This displays marks for XII/X education

[[education]]
degree = "X"
institution = "D.A.V. Public School"
institution_url = "https://davpublicschool.com"
location = "Bhubaneswar, Odisha"
graduation_year = "2017"
notes = "77.5%"   # Marks display for class X

[[education]]
degree = "Bachelor of Science in Computer Science"
institution = "University of California, Berkeley"
institution_url = "https://berkeley.edu"
location = "Berkeley, CA"
graduation_year = "2019"
gpa = "3.8"
relevant_coursework = [
    "Data Structures and Algorithms",
    "Software Engineering",
    "Database Systems"
]
honors = ["Cum Laude", "Dean's List"]
```

**Education Features:**
- `institution_url` creates clickable institution names
- `notes` field displays marks for XII/X education
- `gpa` field for university-level education
- Flexible date and graduation year support

### 6. Projects with Enhanced URL Support

```toml
[[projects]]
name = "Live Server Lite"
description = "A lightweight live server extension with hot reload for VS Code development"
technologies = ["JavaScript", "Node.js", "VS Code API"]
start_date = "2023"
end_date = "2024"
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
description = "Comprehensive VS Code extension pack for Bootstrap 5 development with snippets and utilities"
technologies = ["Bootstrap 5", "CSS", "HTML", "VS Code Extensions"]
start_date = "2023"
end_date = "2024"
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
- Both URLs display as styled buttons
- Professional presentation with proper spacing

### 7. Technical Skills

```toml
[skills.frontend]
category = "Frontend Development"
technologies = [
    "React", "Vue.js", "TypeScript", "JavaScript", "HTML5", "CSS3"
]

[skills.backend]
category = "Backend Development"
technologies = [
    "Node.js", "Python", "Django", "RESTful APIs", "GraphQL"
]
```

### 8. Certifications & Achievements

```toml
[[achievements]]
title = "AWS Certified Solutions Architect"
issuer = "Amazon Web Services"
date = "2023"
type = "certification"

[[achievements]]
title = "Tech Innovation Hackathon Winner"
issuer = "Local Tech Community"
date = "2023"
type = "award"
description = "Built AI-powered productivity app"
```

### 9. Settings

```toml
[settings]
show_gpa = true                          # Show GPA in education section
show_location = true                     # Show location information
show_phone = true                        # Show phone number
date_format = "MMM YYYY"                 # Date format: "MMM YYYY", "MM/YYYY", "YYYY"
max_achievements_per_section = 6         # Limit number of achievements shown
enable_download_button = true            # Show download/print button
enable_print_button = true               # Enable print functionality
```

## New Configuration Examples

### Adding @Mentions in Summary

```toml
[companies]
letsflo = "https://letsflo.com"
microsoft = "https://microsoft.com"
google = "https://google.com"

[summary]
text = "Senior developer with experience at @letsflo and @microsoft. Previously worked on projects with @google technologies."
```

**Result:** Creates clickable links for "Lets Flo", "Microsoft", and "Google"

### Adding Institution URLs

```toml
[[education]]
degree = "Master of Computer Applications"
institution = "Indian Institute of Technology"
institution_url = "https://iit.ac.in"
location = "Delhi, India"
graduation_year = "2021"
gpa = "3.9"
```

### Adding Project URLs

```toml
[[projects]]
name = "E-Commerce Platform"
description = "Full-stack e-commerce solution with real-time inventory"
technologies = ["React", "Node.js", "MongoDB", "Stripe API"]
start_date = "Mar 2023"
end_date = "Aug 2023"
live_url = "https://demo-ecommerce.com"
github_url = "https://github.com/NishikantaRay/ecommerce-platform"
highlights = [
    "Built scalable microservices architecture",
    "Implemented real-time inventory tracking",
    "Achieved 99.9% uptime",
    "Processed $1M+ in transactions"
]
```

## Advanced Features

### TOML-First Parser Features

The enhanced TOML parser now supports:
- **Manual Parsing**: No external dependencies
- **Array Handling**: Proper `[[section]]` and `[section]` distinction
- **String Processing**: Multi-line strings and special characters
- **Error Handling**: Graceful fallbacks for invalid syntax
- **Performance**: Optimized for large configuration files

### @Mention Processing

```javascript
// Automatic processing of mentions
processTextWithMentions(text, companies) {
  return text.replace(/@(\w+)/g, (match, company) => {
    const url = companies[company.toLowerCase()];
    return url ? `<a href="${url}" class="company-mention" target="_blank">${formatCompanyName(company)}</a>` : match;
  });
}
```

### URL Link Generation

All URLs are automatically processed with:
- Professional button styling
- External link indicators
- New tab opening
- Hover effects
- Responsive design

## CSS Classes for Styling

The system adds these CSS classes automatically:

```css
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

/* Dark theme support */
[data-theme="dark"] .company-mention,
[data-theme="dark"] .institution-link {
  color: var(--accent-color-dark);
}
```

## Customization Examples

### Adding a New Work Experience

```toml
[[experience]]
position = "Full Stack Developer"
company = "StartupXYZ"
location = "Remote"
start_date = "Jun 2020"
end_date = "Dec 2021"
is_current = false
achievements = [
    "Built responsive web applications for 50+ clients",
    "Improved code coverage from 45% to 85%",
    "Reduced API response time by 50%"
]
```

### Adding a New Skill Category

```toml
[skills.mobile]
category = "Mobile Development"
technologies = [
    "React Native", "Flutter", "iOS", "Android", "Xamarin"
]
```

### Adding Multiple Degrees

```toml
[[education]]
degree = "Master of Science in Computer Science"
institution = "Stanford University"
location = "Stanford, CA"
graduation_year = "2021"
gpa = "3.9"

[[education]]
degree = "Bachelor of Science in Computer Science"
institution = "UC Berkeley"
location = "Berkeley, CA"
graduation_year = "2019"
gpa = "3.7"
```

### Customizing Display Settings

```toml
[settings]
show_gpa = false                # Hide GPA information
show_location = false           # Hide location information
date_format = "YYYY"           # Show only years for dates
max_achievements_per_section = 3  # Show only top 3 achievements
```

## Field Reference

### Required Fields

**Personal Section:**
- `name` - Your full name
- `title` - Professional title
- `email` - Contact email

**Experience/Education/Projects:**
- `position`/`degree`/`name` - Title of the role/degree/project
- `company`/`institution` - Organization name

### Optional Fields

**Personal Section:**
- `phone`, `website`, `github`, `linkedin`, `location`

**Experience Section:**
- `location`, `achievements`, `is_current`

**Education Section:**
- `location`, `gpa`, `relevant_coursework`, `honors`

**Projects Section:**
- `technologies`, `url`, `highlights`

**Skills Section:**
- Any number of skill categories with `category` and `technologies`

**Achievements Section:**
- `issuer`, `date`, `type`, `description`

## Tips and Best Practices

### 1. **Keep Achievements Concise**
- Use bullet points for achievements
- Start with action verbs
- Include quantifiable results when possible

### 2. **Organize Skills Logically**
- Group related technologies together
- Order categories by importance
- Use consistent naming conventions

### 3. **Use Consistent Date Formats**
- Choose one format and stick to it
- Use "Present" for current positions
- Be consistent with month abbreviations

### 4. **Optimize for Print**
- Keep content concise for single-page resumes
- Use the `max_achievements_per_section` setting
- Test print preview regularly

### 5. **Regular Updates**
- Keep achievements current
- Add new skills as you learn them
- Update project descriptions periodically

## Testing Your Configuration

1. **Syntax Check**: Use `test-resume-toml.html` to verify TOML syntax
2. **Preview**: Check the resume preview in the test page
3. **Print Test**: Use print preview to ensure proper formatting
4. **Live Test**: View the actual resume page at `resume.html`

## Troubleshooting

### Common Issues

**TOML Syntax Errors:**
- Ensure strings are quoted: `name = "John Doe"`
- Use `[[section]]` for arrays, `[section]` for objects
- Check for proper indentation and formatting

**Content Not Showing:**
- Verify field names match the documentation
- Check browser console for errors
- Ensure all required fields are provided

**Formatting Issues:**
- Check date formats are consistent
- Verify array syntax for lists
- Ensure proper nesting for skill categories

### Error Messages

- **"Failed to load resume.toml"**: Check file exists and syntax is valid
- **"No container found"**: HTML structure issue, check resume.html
- **"TOML parser failed"**: Network issue or invalid TOML syntax

## Example Complete Configuration

See `config/resume.toml` for a complete example with all sections populated.

## Advanced Features

### Custom Date Formatting
```toml
[settings]
date_format = "MM/YYYY"    # 01/2023 format
# or
date_format = "YYYY"       # 2023 format only
```

### Conditional Display
```toml
[settings]
show_gpa = false          # Hide all GPA information
show_location = false     # Hide all location fields
show_phone = false        # Hide phone number
```

### Achievement Types
Use the `type` field to categorize achievements:
- `"certification"` - Professional certifications
- `"award"` - Awards and recognition
- `"speaking"` - Speaking engagements
- `"volunteer"` - Volunteer work
- `"contribution"` - Open source contributions

The resume configuration system provides complete flexibility to customize your resume content without touching any code! 🎉