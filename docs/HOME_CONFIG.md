# Home Page Configuration Guide

The home page is now fully configurable through the `config/home.toml` file. This allows you to customize all content, sections, and settings without editing HTML or JavaScript files.

## Configuration Structure

### Hero Section
Configure the main hero section at the top of the page:

```toml
[hero]
name = "Nishikanta Ray"                    # Main title displayed
title = "Full-Stack Developer"       # Subtitle (optional)
intro = [                            # Array of intro paragraphs
    "First paragraph of introduction...",
    "Second paragraph with more details..."
]

[hero.actions]
primary_text = "Hire Me"             # Primary button text
primary_link = "resume.html"         # Primary button link
secondary_text = "Let's Talk"        # Secondary button text  
secondary_link = "#contact"          # Secondary button link
```

### Client Section
Configure the client logos showcase:

```toml
[freelance_clients]
enabled = true                       # Show/hide this section
title = "Trusted by Clients"        # Section title
subtitle = "Companies I've worked with"  # Section subtitle
contact_email = "your@email.com"    # Contact button email
contact_text = "Contact Me"         # Contact button text

[[freelance_clients.clients]]        # Add multiple client entries
id = 1
name = "Company Name"               # Client company name
logo = "🚀"                        # Emoji logo for the client
status = "completed"               # "completed" or "in-progress"
period = "Oct-Dec 2024"           # Work period
project = "Project Description"    # Brief project description
```

### Products Section
Configure the latest products showcase:

```toml
[latest_products]
enabled = true                      # Show/hide this section
title = "Latest Products"          # Section title
subtitle = "Tools and apps I've built"  # Section subtitle
view_all_text = "View All Products"    # View all button text
view_all_link = "projects.html#products"  # View all button link

[[latest_products.products]]        # Add multiple product entries
id = 1
title = "Product Name"             # Product title
description = "Product description..."  # Product description
status = "launched"                # "launched", "in-progress", etc.
technologies = ["React", "Node.js"]   # Array of technologies used
version = "v1.0.0"                # Current version
users = "100+ users"              # User count or metric
live_url = "https://example.com"   # Live product URL (optional)
github_url = "https://github.com/..."  # GitHub URL (optional)
```

### Footer Configuration
Configure the page footer:

```toml
[footer]
text = "Built with Marked.js"      # Footer text
link = "https://github.com/..."    # Footer link
year = 2024                        # Copyright year
```

### Section Controls
Control which sections appear and their order:

```toml
[sections]
enabled_sections = ["freelance-clients", "latest-products", "dashboard"]
```

## How It Works

1. **Configuration Loading**: The home page loads `config/home.toml` on initialization
2. **Dynamic Updates**: All content is populated from the configuration
3. **Fallback System**: If the TOML file fails to load, sensible defaults are used
4. **Real-time Changes**: Modify the TOML file and refresh to see changes

## Status Indicators

### Client Status Options:
- `completed` - Shows green dot
- `in-progress` - Shows orange pulsing dot

### Product Status Options:
- `launched` - Shows purple badge
- `in-progress` - Shows blue badge
- `beta` - Shows orange badge

## Best Practices

1. **Client Logos**: Use relevant emoji or simple text symbols
2. **Descriptions**: Keep product descriptions concise but descriptive
3. **Technologies**: List main technologies, not every dependency
4. **URLs**: Ensure all URLs are valid and accessible
5. **Status**: Keep status indicators up to date

## Customization Tips

- **Hero Intro**: Use 1-2 paragraphs for optimal readability
- **Client Count**: Add 6-8 clients for good visual balance
- **Product Count**: Show 2-4 products to avoid clutter
- **Contact Email**: Use your actual business email
- **Links**: Test all external links regularly

## File Location

The configuration file is located at:
```
config/home.toml
```

## Validation

The system includes:
- TOML syntax validation
- Fallback content if configuration fails
- Error handling for missing fields
- Console warnings for debugging

## Example Configuration

See the included `config/home.toml` file for a complete example with all available options and proper syntax.

## Troubleshooting

- **Changes not appearing**: Check browser console for TOML parsing errors
- **Missing content**: Verify TOML syntax with an online validator
- **Broken links**: Ensure all URLs in the configuration are correct
- **Layout issues**: Check that required fields are not empty