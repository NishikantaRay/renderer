# Resume Configuration Guide

This guide explains how to configure your resume content using the TOML configuration file.

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
website = "https://yourwebsite.com"
github = "https://github.com/yourusername"
linkedin = "https://linkedin.com/in/yourusername"
location = "City, State"
```

### 2. Professional Summary

```toml
[summary]
text = "Your professional summary describing your experience, skills, and career objectives."
```

### 3. Work Experience

Add multiple work experiences using `[[experience]]` arrays:

```toml
[[experience]]
position = "Senior Software Engineer"
company = "Tech Company Inc."
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

### 4. Education

Add multiple educational backgrounds:

```toml
[[education]]
degree = "Bachelor of Science in Computer Science"
institution = "University of California, Berkeley"
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

### 5. Projects

Showcase your key projects:

```toml
[[projects]]
name = "E-Commerce Platform"
description = "Full-stack e-commerce solution with real-time inventory"
technologies = ["React", "Node.js", "MongoDB", "Stripe API"]
start_date = "Mar 2023"
end_date = "Aug 2023"
url = "https://github.com/yourusername/project"
highlights = [
    "Built scalable microservices architecture",
    "Implemented real-time inventory tracking",
    "Achieved 99.9% uptime"
]
```

### 6. Technical Skills

Organize skills by categories:

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

### 7. Certifications & Achievements

Add certifications, awards, and other achievements:

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

### 8. Settings

Customize display options:

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