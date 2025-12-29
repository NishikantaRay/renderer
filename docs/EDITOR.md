# Visual TOML Editor - Complete Guide

The Visual TOML Editor is a powerful web-based GUI that makes editing Renderer configuration files effortless. No more manual TOML editing, syntax errors, or confusion!

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Getting Started](#getting-started)
4. [Supported Configurations](#supported-configurations)
5. [Interface Guide](#interface-guide)
6. [Usage Examples](#usage-examples)
7. [Advanced Features](#advanced-features)
8. [Keyboard Shortcuts](#keyboard-shortcuts)
9. [Tips & Best Practices](#tips--best-practices)
10. [Troubleshooting](#troubleshooting)

---

## Overview

The Visual TOML Editor ([editor.html](../editor.html)) is a standalone web application that provides a form-based interface for creating and editing TOML configuration files. It eliminates the need for manual TOML syntax knowledge while ensuring valid, well-formatted configuration files.

### Key Benefits

- ✅ **No TOML knowledge required** - Just fill out forms
- ✅ **Zero syntax errors** - Form validation prevents mistakes
- ✅ **Real-time preview** - See TOML output as you type
- ✅ **Syntax highlighting** - Beautiful, readable TOML display
- ✅ **Load existing configs** - Edit your current files
- ✅ **Multiple export options** - Download, copy, or validate
- ✅ **Dark/Light themes** - Comfortable viewing experience
- ✅ **Mobile-friendly** - Works on phones and tablets
- ✅ **Offline-capable** - No internet required after first load

---

## Features

### 🎨 User Interface

**Clean, Modern Design**
- Minimalist interface focused on content
- Smooth animations and transitions
- Responsive layout adapts to any screen size
- Accessible with keyboard navigation

**Dynamic Forms**
- Forms change based on selected configuration type
- Add/remove array items (projects, skills, experience)
- Conditional fields appear when needed
- Input validation with instant feedback

**Real-Time Preview**
- Live TOML output updates as you type
- Syntax-highlighted display using Prism.js
- Line numbers for easy reference
- Copy button for quick clipboard access

### ⚙️ Configuration Types

Supports all 5 Renderer configuration formats:

1. **Home** - Hero section, CTA buttons, about content
2. **Projects** - Portfolio projects with tags and links
3. **Blog** - Blog posts with metadata
4. **Resume** - Work experience, education, skills
5. **Social** - Social media links and contact info

### 🛠️ Tools & Actions

**Download**
- Save TOML file to your computer
- Automatic filename based on config type
- Preserves formatting and structure

**Copy to Clipboard**
- One-click copy of entire TOML content
- Visual feedback confirms copy success
- Works in all modern browsers

**Validate**
- Check TOML syntax validity
- Detailed error messages if issues found
- Success confirmation when valid

**Load Existing Config**
- Upload current TOML files
- Parse and populate forms automatically
- Edit existing configurations easily

**Reset Form**
- Clear all fields to start fresh
- Confirmation dialog prevents accidents
- Quick way to start over

### 🎨 Customization

**Theme Support**
- Light mode (default)
- Dark mode for low-light environments
- Theme preference saved in localStorage
- Smooth theme transitions

**Responsive Design**
- Desktop: Full-width with sidebar
- Tablet: Stacked layout
- Mobile: Single-column, touch-optimized
- Forms adapt to screen size

---

## Getting Started

### Method 1: Direct Access

```bash
# Open in browser
open /Users/nishikantaray/Desktop/Personal/renderer/editor.html

# Or if running a local server
http://localhost:3000/editor.html
```

### Method 2: From Project

```bash
# Start local server
cd /Users/nishikantaray/Desktop/Personal/renderer
python3 -m http.server 3000

# Open in browser
http://localhost:3000/editor.html
```

### Method 3: Via CLI (Future)

```bash
# Will open editor in default browser
renderer edit home
renderer edit projects
```

---

## Supported Configurations

### 1. Home Configuration

**Purpose**: Define hero section, tagline, CTAs, and about content

**Fields**:
- **Hero Section**
  - Name (Your full name)
  - Tagline (Professional title)
  - Description (Brief intro)
  - Image URL (Profile picture)

- **Call-to-Action Buttons**
  - Primary CTA (text + link)
  - Secondary CTA (text + link)

- **About Section**
  - Title (Section heading)
  - Content (Markdown-supported text)
  - Skills list (comma-separated)

**Example Output**:
```toml
[hero]
name = "John Doe"
tagline = "Full Stack Developer & Designer"
description = "I build beautiful, performant web experiences"
image = "./assets/images/profile.jpg"

[cta]
primary_text = "View My Work"
primary_link = "projects.html"
secondary_text = "Get In Touch"
secondary_link = "contact.html"

[about]
title = "About Me"
content = """
I'm a passionate developer with 5+ years of experience...
"""
skills = ["JavaScript", "React", "Node.js", "Python"]
```

### 2. Projects Configuration

**Purpose**: Showcase portfolio projects with images, tags, and links

**Fields** (Array - Add Multiple):
- Name (Project title)
- Description (What it does)
- Tags (Technologies used)
- Image (Screenshot/thumbnail)
- Demo URL (Live site)
- GitHub URL (Source code)
- Status (active/archived/in-progress)

**Features**:
- Add unlimited projects
- Remove individual projects
- Reorder projects (drag-drop in future)
- Tag management (comma-separated)

**Example Output**:
```toml
[[projects]]
name = "E-Commerce Platform"
description = "Full-stack online shopping platform with payment integration"
tags = ["React", "Node.js", "MongoDB", "Stripe"]
image = "./assets/images/ecommerce.jpg"
demo_url = "https://demo.example.com"
github_url = "https://github.com/username/ecommerce"
status = "active"

[[projects]]
name = "Weather App"
description = "Real-time weather forecasting with geolocation"
tags = ["JavaScript", "OpenWeather API", "CSS"]
image = "./assets/images/weather.jpg"
demo_url = "https://weather.example.com"
github_url = "https://github.com/username/weather"
status = "active"
```

### 3. Blog Configuration

**Purpose**: Define blog posts with metadata and content

**Fields** (Array - Add Multiple):
- Title (Post title)
- Date (Publication date)
- Author (Your name)
- Tags (Categories/topics)
- Excerpt (Brief summary)
- Content File (path to .md file)
- Featured (boolean)

**Features**:
- Date picker for publication dates
- Tag system for categorization
- Featured posts highlighting
- Markdown content support

**Example Output**:
```toml
[[posts]]
title = "Getting Started with Renderer"
date = "2024-12-29"
author = "John Doe"
tags = ["Tutorial", "Web Development"]
excerpt = "Learn how to build your portfolio with Renderer"
content_file = "./content/getting-started.md"
featured = true

[[posts]]
title = "Web Performance Optimization"
date = "2024-12-20"
author = "John Doe"
tags = ["Performance", "Best Practices"]
excerpt = "Tips and tricks for faster websites"
content_file = "./content/web-performance.md"
featured = false
```

### 4. Resume Configuration

**Purpose**: Professional resume with experience, education, and skills

**Sections**:

**Experience** (Array):
- Company
- Position
- Start Date / End Date
- Location
- Description
- Achievements (array)

**Education** (Array):
- Institution
- Degree
- Field of Study
- Start Date / End Date
- GPA (optional)
- Honors (array)

**Skills** (Object):
- Category (e.g., "Languages", "Frameworks")
- Items (array of skills)

**Certifications** (Array):
- Name
- Issuer
- Date
- Link

**Example Output**:
```toml
[[experience]]
company = "Tech Corp"
position = "Senior Developer"
start_date = "2022-01"
end_date = "Present"
location = "San Francisco, CA"
description = "Lead development of cloud-based applications"
achievements = [
    "Reduced load time by 60%",
    "Mentored 5 junior developers"
]

[[education]]
institution = "University of California"
degree = "Bachelor of Science"
field = "Computer Science"
start_date = "2016"
end_date = "2020"
gpa = "3.8"
honors = ["Dean's List", "Summa Cum Laude"]

[skills.languages]
items = ["JavaScript", "Python", "Go", "TypeScript"]

[skills.frameworks]
items = ["React", "Node.js", "Django", "Vue.js"]

[[certifications]]
name = "AWS Certified Solutions Architect"
issuer = "Amazon Web Services"
date = "2023-06"
link = "https://aws.amazon.com/certification/"
```

### 5. Social Configuration

**Purpose**: Social media links and contact information

**Fields**:
- GitHub
- LinkedIn
- Twitter/X
- Email
- Website
- Medium
- Dev.to
- YouTube
- Instagram
- Facebook
- Discord
- Telegram

**Features**:
- Only include links you want
- Validation for email format
- URL validation for social links
- Icons automatically matched

**Example Output**:
```toml
[social]
github = "https://github.com/username"
linkedin = "https://linkedin.com/in/username"
twitter = "https://twitter.com/username"
email = "hello@example.com"
website = "https://example.com"
medium = "https://medium.com/@username"
youtube = "https://youtube.com/c/username"
```

---

## Interface Guide

### Main Layout

```
┌─────────────────────────────────────────────────────────┐
│  Renderer Visual Editor              [🌙 Theme] [Help] │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Select Configuration Type:                             │
│  [Home] [Projects] [Blog] [Resume] [Social]            │
│                                                         │
├──────────────────┬──────────────────────────────────────┤
│                  │                                      │
│   FORM AREA      │      PREVIEW AREA                   │
│                  │                                      │
│   [Input fields] │   ```toml                           │
│   [Checkboxes]   │   [hero]                            │
│   [Text areas]   │   name = "..."                      │
│   [+ Add Item]   │   tagline = "..."                   │
│                  │   ```                               │
│                  │                                      │
│                  │   [📋 Copy]                         │
│                  │                                      │
├──────────────────┴──────────────────────────────────────┤
│                                                         │
│  [💾 Download] [📋 Copy] [✓ Validate]                 │
│  [📂 Load Existing] [🔄 Reset]                         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Form Controls

**Text Inputs**
- Single-line: Name, URL, email
- Auto-trim whitespace
- Placeholder text guides input

**Text Areas**
- Multi-line: Description, content
- Markdown-supported
- Auto-resize based on content

**Arrays**
- "Add Item" button creates new entry
- "Remove" button deletes entry
- Drag handles for reordering (future)

**Date Pickers**
- Native browser date selector
- Format: YYYY-MM-DD
- Validation for valid dates

**Checkboxes**
- Boolean fields (featured, active)
- Clear on/off state
- Labeled for clarity

### Action Buttons

**Download** (💾)
- Downloads TOML file
- Filename: `{type}.toml`
- Browser download dialog

**Copy** (📋)
- Copies to clipboard
- Toast notification confirms
- Fallback for older browsers

**Validate** (✓)
- Checks TOML syntax
- Shows errors or success
- Uses TOML parser

**Load Existing** (📂)
- Opens file picker
- Parses uploaded TOML
- Populates form fields

**Reset** (🔄)
- Clears all fields
- Confirmation dialog
- Cannot be undone

---

## Usage Examples

### Example 1: Creating Home Config

1. **Open Editor**
   ```bash
   open editor.html
   ```

2. **Select "Home" Type**
   - Click "Home" button at top

3. **Fill Hero Section**
   - Name: "Jane Smith"
   - Tagline: "Product Designer & UX Engineer"
   - Description: "I create delightful digital experiences"
   - Image: "./assets/images/jane.jpg"

4. **Add CTAs**
   - Primary Text: "View Portfolio"
   - Primary Link: "projects.html"
   - Secondary Text: "Contact Me"
   - Secondary Link: "contact.html"

5. **Add About Content**
   - Title: "About Me"
   - Content: (Write your bio)
   - Skills: "Figma, Sketch, React, TypeScript"

6. **Download**
   - Click "Download" button
   - Save as `config/home.toml`

### Example 2: Adding Multiple Projects

1. **Select "Projects" Type**

2. **Add First Project**
   - Name: "Portfolio Website"
   - Description: "Personal portfolio built with Renderer"
   - Tags: "HTML, CSS, JavaScript, TOML"
   - Image: "./assets/images/portfolio.jpg"
   - Demo: "https://mysite.com"
   - GitHub: "https://github.com/me/portfolio"
   - Status: "active"

3. **Click "Add Project"**

4. **Add Second Project**
   - (Fill in second project details)

5. **Add Third Project**
   - (Fill in third project details)

6. **Download**
   - Saves all projects in one file

### Example 3: Editing Existing Config

1. **Click "Load Existing Config"**

2. **Select File**
   - Choose `config/projects.toml`

3. **Forms Auto-Fill**
   - All existing data appears

4. **Edit as Needed**
   - Update descriptions
   - Change URLs
   - Add new projects

5. **Download Updated File**
   - Overwrites old config

---

## Advanced Features

### 1. Real-Time Validation

As you type, the editor validates:
- **Required fields** - Shows error if empty
- **URL format** - Checks http:// or https://
- **Email format** - Validates email@domain.com
- **Date format** - Ensures YYYY-MM-DD
- **TOML syntax** - Parses output for errors

### 2. Auto-Save (LocalStorage)

The editor automatically saves your work:
- Saves every field change
- Persists across browser sessions
- Warns before leaving page
- "Reset" clears saved data

To enable:
```javascript
// Already enabled by default
// Data stored in localStorage.renderer_editor_state
```

### 3. Import/Export Presets

Save and reuse common configurations:

**Save Preset**:
```javascript
// In browser console
const state = localStorage.getItem('renderer_editor_state');
// Copy and save this string
```

**Load Preset**:
```javascript
// Paste saved state
localStorage.setItem('renderer_editor_state', 'YOUR_STATE_STRING');
location.reload();
```

### 4. Batch Operations

Edit multiple configs efficiently:

1. Load `home.toml`
2. Edit and download
3. Switch to "Projects"
4. Load `projects.toml`
5. Edit and download
6. Repeat for all configs

### 5. Theme Customization

**Change Theme**:
```css
/* In editor.html, modify CSS variables */
:root {
  --primary-color: #your-color;
  --bg-color: #your-bg;
  --text-color: #your-text;
}
```

**Dark Mode Toggle**:
- Click moon/sun icon (top-right)
- Preference saved automatically
- Applied to preview and forms

---

## Keyboard Shortcuts

### General
- `Ctrl/Cmd + S` - Download config
- `Ctrl/Cmd + C` - Copy to clipboard (when preview focused)
- `Ctrl/Cmd + V` - Paste into field
- `Esc` - Close dialogs/modals

### Navigation
- `Tab` - Next field
- `Shift + Tab` - Previous field
- `Ctrl/Cmd + 1-5` - Switch config type (1=Home, 2=Projects, etc.)

### Editing
- `Ctrl/Cmd + Z` - Undo
- `Ctrl/Cmd + Y` - Redo
- `Ctrl/Cmd + A` - Select all (in text fields)

### Advanced
- `Alt + D` - Download
- `Alt + C` - Copy
- `Alt + V` - Validate
- `Alt + L` - Load existing
- `Alt + R` - Reset form

---

## Tips & Best Practices

### 1. Organization

**File Naming**:
- Keep TOML files in `config/` directory
- Use standard names: `home.toml`, `projects.toml`, etc.
- Don't rename config files

**Content Files**:
- Store markdown in `content/` directory
- Name descriptively: `about.md`, `project-description.md`
- Reference correctly in TOML: `"./content/about.md"`

### 2. Content Writing

**Descriptions**:
- Be concise but descriptive
- Use active voice
- Highlight key achievements
- Include keywords for SEO

**Tags**:
- Use consistent naming (capitalize properly)
- Separate with commas: "React, Node.js, MongoDB"
- Limit to 3-5 relevant tags per item
- Avoid redundant tags

**URLs**:
- Always include protocol: `https://`
- Test links before saving
- Use shortened URLs if needed
- Update broken links regularly

### 3. Images

**Paths**:
- Use relative paths: `./assets/images/photo.jpg`
- Don't use absolute paths: ❌ `/Users/...`
- Keep images in `assets/images/`

**Optimization**:
- Compress images before upload
- Use WebP format when possible
- Recommended sizes:
  - Profile: 400x400px
  - Project thumbnails: 800x600px
  - Blog headers: 1200x630px

### 4. Validation

**Before Downloading**:
1. Fill all required fields
2. Click "Validate" button
3. Fix any errors shown
4. Test preview looks correct
5. Then download

**After Downloading**:
1. Test in browser immediately
2. Check all links work
3. Verify images load
4. Validate with CLI: `renderer validate`

### 5. Version Control

**Git Workflow**:
```bash
# Before editing
git add config/
git commit -m "Backup configs before editing"

# After editing
git diff config/projects.toml  # Review changes
git add config/projects.toml
git commit -m "Update projects: Added new project XYZ"
```

---

## Troubleshooting

### Issue: Form Fields Not Appearing

**Cause**: JavaScript not loaded or blocked

**Solution**:
1. Check browser console for errors (F12)
2. Disable ad blockers temporarily
3. Try different browser (Chrome, Firefox, Safari)
4. Ensure JavaScript is enabled

### Issue: Cannot Load Existing Config

**Cause**: Invalid TOML syntax in file

**Solution**:
1. Open file in text editor
2. Check for syntax errors:
   - Missing quotes around strings
   - Unclosed brackets `[` or `]`
   - Invalid characters
3. Use online TOML validator
4. Fix errors manually, then reload

### Issue: Download Button Not Working

**Cause**: Browser blocking downloads

**Solution**:
1. Check browser permissions
2. Allow downloads from this site
3. Try "Copy" button instead
4. Paste into text editor and save manually

### Issue: Preview Not Updating

**Cause**: Form validation failing silently

**Solution**:
1. Check all required fields filled
2. Look for red error messages
3. Fix validation errors
4. Preview will update automatically

### Issue: Theme Not Persisting

**Cause**: LocalStorage disabled or cleared

**Solution**:
1. Enable cookies/localStorage in browser
2. Don't use Private/Incognito mode
3. Check browser storage settings
4. Theme will reset to light mode if storage unavailable

### Issue: Lost Work After Browser Crash

**Cause**: Auto-save not enabled or failed

**Solution**:
- **Prevention**: Download frequently as backup
- **Recovery**: Check browser history/cache
- **Future**: Enable auto-save feature (coming soon)

### Issue: Special Characters Not Working

**Cause**: Character encoding issue

**Solution**:
1. Use UTF-8 encoding
2. Avoid fancy quotes (" " instead of " ")
3. Use standard apostrophes (' instead of ')
4. Test with ASCII characters first

---

## Integration with Other Tools

### MCP Server

The Visual Editor complements the MCP Server:

**Workflow**:
1. **MCP generates** base config
2. **Editor refines** details visually
3. **CLI validates** final output
4. **Deploy** with confidence

**Example**:
```
AI (via MCP)              →  Generate home.toml template
↓
Visual Editor             →  Fill in personal details
↓
CLI (renderer validate)   →  Check for errors
↓
Git commit                →  Save changes
```

### CLI Tool

Use together for efficiency:

```bash
# Create new project with CLI
renderer create my-site

# Open editor to configure
open my-site/editor.html

# Validate with CLI
cd my-site
renderer validate

# Serve to preview
renderer serve
```

### VS Code Integration

Open editor in VS Code:

1. Install "Live Server" extension
2. Right-click `editor.html`
3. Select "Open with Live Server"
4. Edit and see live updates

---

## Future Enhancements

Coming soon:
- 🔄 **Drag-and-drop reordering** - Rearrange projects/posts
- 💾 **Auto-save** - Never lose work
- 🔍 **Search/filter** - Find configs quickly
- 📤 **Direct upload** - Push to GitHub
- 🎨 **Theme builder** - Customize appearance
- 🔌 **Plugin system** - Extend functionality
- 📱 **Mobile app** - Native iOS/Android
- 🌐 **Multi-language** - Localized interface
- 🤝 **Collaboration** - Share configs with team
- 📊 **Preview mode** - See final result

---

## FAQ

**Q: Do I need internet to use the editor?**  
A: No, after first load it works offline (thanks to service worker).

**Q: Can I edit multiple configs at once?**  
A: Not simultaneously, but you can quickly switch between types.

**Q: Is my data sent anywhere?**  
A: No, everything happens in your browser. No data is sent to servers.

**Q: Can I customize the editor appearance?**  
A: Yes, modify CSS variables in editor.html or use theme toggle.

**Q: What browsers are supported?**  
A: All modern browsers (Chrome, Firefox, Safari, Edge). IE not supported.

**Q: Can I use this for other projects?**  
A: Yes! It's open source and can be adapted for any TOML-based project.

**Q: How do I report bugs or request features?**  
A: Open an issue on GitHub or contact the maintainer.

---

## Resources

- **Live Demo**: [editor.html](../editor.html)
- **Source Code**: View `editor.html` for implementation
- **TOML Spec**: [toml.io](https://toml.io/)
- **Renderer Docs**: [README](../README.md)
- **MCP Server**: [MCP_SERVER.md](./MCP_SERVER.md)
- **CLI Tool**: [CLI.md](./CLI.md)

---

## Summary

The Visual TOML Editor makes configuration management effortless:

✅ **No coding required** - Point-and-click interface  
✅ **Error-free** - Built-in validation  
✅ **Fast** - Edit configs in minutes  
✅ **Flexible** - Supports all config types  
✅ **Beautiful** - Modern, clean design  
✅ **Free** - Open source and always will be

**Get started now**: Open [editor.html](../editor.html) and create your first config! 🚀

---

**Version**: 2.1.0  
**Last Updated**: December 29, 2024  
**Author**: Nishikanta Ray  
**License**: MIT
