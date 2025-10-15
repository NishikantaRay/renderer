# Projects Configuration Guide

## Overview

The projects page is now fully configurable through the `config/projects.toml` file. This allows you to enable/disable any feature, customize content sections, and control the entire page behavior without editing HTML or JavaScript files.

## Configuration File Location

**File**: `config/projects.toml`

## Main Configuration Sections

### 1. Page Settings (`[page]`)

Controls the main page metadata and titles.

```toml
[page]
title = "Projects"                    # Main page title
subtitle = "A showcase of my recent work in web development, design, and open source contributions."
```

### 2. Content Settings (`[content]`)

Controls how content is loaded and displayed.

```toml
[content]
enable_markdown_content = true       # Load content from projects.md file
enable_fallback_content = true       # Show fallback content if markdown fails
show_intro = true                    # Show introduction paragraph
show_loading_indicator = true        # Show loading spinner while content loads
```

### 3. Navigation Settings (`[navigation]`)

Controls navigation bar features.

```toml
[navigation]
enabled = true                       # Show/hide entire navigation
show_theme_toggle = true             # Dark/light mode toggle button
show_mobile_menu = true              # Mobile hamburger menu
sticky_navigation = false            # Make navigation sticky on scroll
```

### 4. Featured Projects (`[featured_projects]`)

Controls the main featured projects section.

```toml
[featured_projects]
enabled = true                       # Show/hide featured projects section
title = "Featured Work"              # Section title
show_tech_stack = true               # Show technology badges under project titles
show_features_list = true            # Show "Key Features" lists for each project
show_project_links = true            # Show demo/github/case study links
enable_hover_effects = true          # Interactive hover animations on project cards
show_categories = true               # Project category labels
```

### 5. Project Statistics (`[project_stats]`)

Controls the project overview statistics section.

```toml
[project_stats]
enabled = true                       # Show/hide project stats section
title = "Project Overview"           # Section title
show_completed_count = true          # Show "Projects Completed" stat
show_active_count = true             # Show "Active Projects" stat
show_opensource_count = true         # Show "Open Source" contributions stat
show_technologies_count = true       # Show "Technologies" used stat
animate_numbers = true               # Animate statistics on scroll
```

### 6. Analytics Section (`[analytics]`)

Controls the comprehensive analytics dashboard.

```toml
[analytics]
enabled = true                       # Show/hide entire analytics section
title = "Project Analytics & Activity"
description = "Development metrics and project insights"
```

#### Analytics Sub-sections

**Charts** (`[analytics.charts]`)
```toml
[analytics.charts]
enabled = true                       # Enable charts subsection
weekly_activity = true               # Weekly development activity chart
project_distribution = true          # Project distribution by category chart
show_chart_descriptions = true       # Show descriptions under charts
```

**Timeline** (`[analytics.timeline]`)
```toml
[analytics.timeline]
enabled = true                       # Enable timeline subsection
title = "Recent Project Milestones"
description = "Latest project updates and achievements"
show_event_types = true              # Show event type indicators
max_events = 10                      # Maximum number of events to display
```

**Statistics** (`[analytics.statistics]`)
```toml
[analytics.statistics]
enabled = true                       # Enable statistics subsection
show_animated_stats = true           # Animate statistics numbers
show_stat_descriptions = true        # Show descriptions for statistics
```

### 7. Open Source Section (`[opensource]`)

Controls the open source contributions showcase.

```toml
[opensource]
enabled = true                       # Show/hide open source section
title = "Open Source Contributions"
show_github_stats = true             # Show GitHub statistics (stars, PRs, repos)
show_contribution_details = true     # Show individual project details
show_repository_links = true         # Show links to repositories
show_star_counts = true              # Show star counts for projects
```

### 8. Side Projects (`[side_projects]`)

Controls the side projects section.

```toml
[side_projects]
enabled = true                       # Show/hide side projects section
title = "Side Projects"
show_descriptions = true             # Show project descriptions
show_tech_focus = true               # Show technology focus areas
grid_layout = true                   # Use grid layout vs list layout
```

### 9. Contact CTA (`[contact_cta]`)

Controls the call-to-action section at the bottom.

```toml
[contact_cta]
enabled = true                       # Show/hide contact CTA
text = "Interested in collaborating or learning more about any of these projects?"
link_text = "Let's connect!"
link_url = "contact.html"
```

### 10. Footer (`[footer]`)

Controls the page footer.

```toml
[footer]
enabled = true                       # Show/hide footer
text = "Built with"
link_text = "Marked.js"
link_url = "https://github.com/markedjs/marked"
year = 2024
```

### 11. SEO Settings (`[seo]`)

Controls search engine optimization metadata.

```toml
[seo]
meta_description = "My projects - Developer, Designer, Creator"
og_title = "Projects - Your Name"
og_description = "A showcase of my recent work in web development, design, and open source contributions."
```

### 12. Performance Settings (`[performance]`)

Controls performance optimizations.

```toml
[performance]
lazy_load_images = true              # Lazy load images for better performance
preload_critical_content = true     # Preload above-fold content
enable_service_worker = false       # PWA capabilities
cache_content = true                 # Cache loaded content
```

### 13. Accessibility Settings (`[accessibility]`)

Controls accessibility features.

```toml
[accessibility]
high_contrast_mode = false           # High contrast theme option
focus_indicators = true              # Enhanced focus indicators
screen_reader_support = true         # Screen reader optimizations
keyboard_navigation = true           # Full keyboard navigation support
```

### 14. Interactive Features (`[interactive]`)

Controls interactive user features.

```toml
[interactive]
project_filtering = false            # Filter projects by technology/category
search_functionality = false        # Search through projects
sort_options = false                 # Sort projects by date/tech/popularity
bookmarking = false                  # Allow bookmarking projects
sharing_buttons = false              # Social sharing for individual projects
```

### 15. UI Enhancements (`[ui]`)

Controls user interface enhancements.

```toml
[ui]
animations = true                    # CSS animations and transitions
smooth_scrolling = true              # Smooth scroll behavior
back_to_top = false                  # Back to top button
breadcrumbs = false                  # Page breadcrumbs
progress_indicator = false           # Reading/scroll progress indicator
```

### 16. Development Features (`[development]`)

Controls development and debugging features.

```toml
[development]
debug_mode = false                   # Show debug information
performance_metrics = false         # Show performance timing
error_logging = false                # Log JavaScript errors
feature_flags = true                 # Enable experimental features
```

## Configuration Examples

### 1. Minimal Projects Page

Show only essential content without analytics:

```toml
[page]
title = "Projects"
subtitle = "My work showcase"

[content]
enable_markdown_content = true
enable_fallback_content = true
show_intro = true

[navigation]
enabled = true
show_theme_toggle = true
show_mobile_menu = true

[featured_projects]
enabled = true
title = "Featured Work"
show_tech_stack = true
show_features_list = false
show_project_links = true

[project_stats]
enabled = false

[analytics]
enabled = false

[opensource]
enabled = true
title = "Open Source"
show_github_stats = false
show_contribution_details = true

[side_projects]
enabled = false

[contact_cta]
enabled = true

[footer]
enabled = true
```

### 2. Analytics-Heavy Configuration

Focus on metrics and data visualization:

```toml
[analytics]
enabled = true
title = "Project Analytics & Insights"

[analytics.charts]
enabled = true
weekly_activity = true
project_distribution = true
show_chart_descriptions = true

[analytics.timeline]
enabled = true
max_events = 15

[analytics.statistics]
enabled = true
show_animated_stats = true

[project_stats]
enabled = true
animate_numbers = true

[featured_projects]
enabled = true
show_tech_stack = true
show_features_list = true

# Disable less important sections
[side_projects]
enabled = false

[contact_cta]
enabled = false
```

### 3. Performance-Optimized Configuration

Minimal features for maximum performance:

```toml
[performance]
lazy_load_images = true
preload_critical_content = true
cache_content = true

[ui]
animations = false                   # Disable animations
smooth_scrolling = false

[analytics]
enabled = false                      # Disable heavy analytics

[interactive]
project_filtering = false
search_functionality = false

[featured_projects]
enabled = true
show_features_list = false           # Reduce content
enable_hover_effects = false         # Disable animations
```

### 4. Accessibility-First Configuration

Enhanced accessibility features:

```toml
[accessibility]
high_contrast_mode = true
focus_indicators = true
screen_reader_support = true
keyboard_navigation = true

[ui]
animations = false                   # Disable for motion sensitivity
smooth_scrolling = false

[navigation]
enabled = true
show_theme_toggle = true             # Allow theme customization

[interactive]
project_filtering = true             # Enable keyboard-accessible filtering
search_functionality = true

[development]
debug_mode = false
performance_metrics = false
```

## Implementation Details

### How Configuration Works

1. **TOML Loading**: The `projects-config-toml.js` file loads and parses the TOML configuration
2. **Style Generation**: CSS rules are automatically generated based on enabled/disabled features
3. **Dynamic Content**: JavaScript conditionally renders content based on configuration
4. **Fallback System**: If configuration fails to load, sensible defaults are used

### Data Attributes

The HTML uses `data-section` and `data-feature` attributes that correspond to configuration options:

- `data-section="analytics"` → `[analytics] enabled`
- `data-section="featured-projects"` → `[featured_projects] enabled`
- `data-feature="theme-toggle"` → `[navigation] show_theme_toggle`

### CSS Classes

Some features add CSS classes for styling:
- `.high-contrast` for high contrast mode
- `.enhanced-focus` for enhanced focus indicators
- `.sticky` for sticky navigation

## Troubleshooting

### Configuration Not Loading

1. Check browser console for TOML parsing errors
2. Verify `config/projects.toml` file exists and is valid TOML syntax
3. Ensure TOML parser script is loaded before projects configuration

### Features Not Hiding

1. Check if the feature has a `data-section` or `data-feature` attribute
2. Verify the configuration key name matches exactly
3. Clear browser cache and reload

### Debug Mode

Enable debug mode to see current configuration:

```toml
[development]
debug_mode = true
```

This will show a debug overlay with current settings and configuration status.

## Best Practices

1. **Start Simple**: Begin with default configuration and gradually customize
2. **Test Performance**: Disable heavy features if page performance is important
3. **Consider Users**: Enable accessibility features when appropriate
4. **Use Fallbacks**: Always enable fallback content for reliability
5. **Document Changes**: Keep track of your customizations

## Migration from Previous Versions

If migrating from a version without configuration:

1. Copy your existing content to `content/projects.md`
2. Start with the default `config/projects.toml`
3. Gradually disable unwanted features
4. Test thoroughly after changes

The configuration system is designed to be backward compatible - existing pages will continue to work even without configuration files.