# Example: Enable Dashboard with Charts Only

# Copy this to your config/home.toml to enable dashboard with just charts

[dashboard]
enabled = true
title = "Analytics Dashboard"
subtitle = "Development metrics and insights"

[dashboard.sections]
charts = true             # Enable charts (Recent Projects, Tech Stack, Performance)
recent_activity = false   # Disable activity feed
skills_progress = false   # Disable skills progress
statistics = false        # Disable stats grid
code_quality = false      # Disable code quality metrics
learning_progress = false # Disable learning progress

# To enable all sections, set all to true:
# charts = true
# recent_activity = true
# skills_progress = true
# statistics = true
# code_quality = true
# learning_progress = true