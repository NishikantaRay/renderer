# Dashboard Configuration Guide

## Overview

The dashboard section provides analytics, charts, and metrics for your portfolio. It can be completely enabled/disabled and each subsection can be individually controlled.

## Configuration

### Main Dashboard Control

```toml
[dashboard]
enabled = false  # Set to true to enable entire dashboard
title = "Dashboard & Analytics"
subtitle = "Development metrics and insights"
```

### Individual Section Controls

```toml
[dashboard.sections]
charts = false           # Recent Projects, Tech Stack, Performance charts
recent_activity = false  # Recent activity feed
skills_progress = false  # Skills progress bars
statistics = false       # Stats grid
code_quality = false     # Code quality metrics
learning_progress = false # Currently learning section
```

## Dashboard Sections

### 1. Charts (`charts`)
- **Recent Projects Chart**: Bar chart showing project activity
- **Tech Stack Distribution**: Doughnut chart of technologies used
- **Performance Metrics**: Performance indicators

### 2. Recent Activity (`recent_activity`)
- Feed of recent commits, projects, and activities
- Timeline-based display

### 3. Skills Progress (`skills_progress`)
- Progress bars for different skills
- Skill level indicators

### 4. Statistics (`statistics`)
- Key metrics and numbers
- Project counts, contributions, etc.

### 5. Code Quality (`code_quality`)
- Code quality metrics
- Test coverage, code reviews, etc.

### 6. Learning Progress (`learning_progress`)
- Currently learning technologies
- Learning progress indicators

## Example Configurations

### Completely Disabled (Default)
```toml
[dashboard]
enabled = false
```

### Enabled with Only Charts
```toml
[dashboard]
enabled = true
title = "Analytics Dashboard"

[dashboard.sections]
charts = true
recent_activity = false
skills_progress = false
statistics = false
code_quality = false
learning_progress = false
```

### Full Dashboard Enabled
```toml
[dashboard]
enabled = true
title = "Complete Dashboard"

[dashboard.sections]
charts = true
recent_activity = true
skills_progress = true
statistics = true
code_quality = true
learning_progress = true
```

### Minimal Dashboard (Skills & Stats Only)
```toml
[dashboard]
enabled = true
title = "Skills & Statistics"

[dashboard.sections]
charts = false
recent_activity = false
skills_progress = true
statistics = true
code_quality = false
learning_progress = false
```

## Implementation Details

- Dashboard sections are controlled via `data-section` attributes in HTML
- Each section can be individually shown/hidden via CSS `display` property
- Configuration is loaded from `config/home.toml`
- Fallback configuration ensures dashboard is disabled by default

## Customization

To enable the dashboard:

1. Edit `config/home.toml`
2. Set `dashboard.enabled = true`
3. Enable desired sections under `[dashboard.sections]`
4. Customize titles and subtitles as needed

The dashboard will automatically show/hide based on your configuration without requiring code changes.