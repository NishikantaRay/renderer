# Social Links Configuration Guide

This guide explains how to configure your social media links using the TOML configuration file.

## Configuration File Location

The social links are configured in: `config/social.toml`

## Basic Configuration

### Settings Section

```toml
[settings]
show_text = false        # Set to true to show text alongside icons
show_tooltips = true     # Show tooltips on hover
max_visible = 6          # Maximum number of links to display
icon_size = "20px"       # Size of the icons
spacing = "1rem"         # Spacing between links
```

### Adding Social Links

Each social link is configured as an array entry:

```toml
[[links]]
id = "github"                                    # Unique identifier
name = "GitHub"                                  # Display name (used in tooltips)
url = "https://github.com/yourusername"          # Your social media URL
icon = "fab fa-github"                           # Font Awesome icon class
target = "_blank"                                # Link target (_blank, _self)
enabled = true                                   # Set to false to hide this link
```

## Customization Examples

### 1. Update Your URLs

Replace the placeholder URLs with your actual social media profiles:

```toml
[[links]]
id = "github"
name = "GitHub"
url = "https://github.com/YOUR_ACTUAL_USERNAME"
icon = "fab fa-github"
target = "_blank"
enabled = true

[[links]]
id = "linkedin"
name = "LinkedIn"
url = "https://linkedin.com/in/YOUR_ACTUAL_USERNAME"
icon = "fab fa-linkedin"
target = "_blank"
enabled = true
```

### 2. Enable/Disable Links

To show or hide specific social links, change the `enabled` value:

```toml
# This link will be visible
[[links]]
id = "twitter"
enabled = true

# This link will be hidden
[[links]]
id = "instagram"
enabled = false
```

### 3. Add Custom Social Networks

You can add any social network by adding a new `[[links]]` section:

```toml
[[links]]
id = "custom-platform"
name = "My Custom Platform"
url = "https://mycustomplatform.com/profile"
icon = "fas fa-link"                # Use a generic link icon
target = "_blank"
enabled = true
```

### 4. Change Display Settings

```toml
[settings]
show_text = true         # Show text labels next to icons
show_tooltips = false    # Disable tooltips
max_visible = 4          # Show only 4 links maximum
icon_size = "24px"       # Make icons larger
spacing = "1.5rem"       # Increase spacing between links
```

## Available Icons

This configuration uses Font Awesome icons. Common social media icons include:

- `fab fa-github` - GitHub
- `fab fa-linkedin` - LinkedIn  
- `fab fa-twitter` - Twitter
- `fab fa-instagram` - Instagram
- `fab fa-youtube` - YouTube
- `fab fa-discord` - Discord
- `fab fa-mastodon` - Mastodon
- `fab fa-stack-overflow` - Stack Overflow
- `fab fa-codepen` - CodePen
- `fab fa-dribbble` - Dribbble
- `fab fa-behance` - Behance
- `fas fa-envelope` - Email
- `fas fa-globe` - Website
- `fas fa-link` - Generic link

## Testing Your Configuration

After making changes to `config/social.toml`:

1. Save the file
2. Refresh your website
3. The social links should update automatically

If there are any errors in the TOML syntax, check the browser console for error messages.

## Troubleshooting

### Links Not Appearing
- Check that `enabled = true` for the links you want to show
- Verify the TOML syntax is correct
- Check browser console for errors

### Icons Not Showing
- Ensure Font Awesome is loaded on your page
- Verify the icon class name is correct
- Check that the Font Awesome version supports the icon

### TOML Syntax Errors
- Make sure strings are quoted: `name = "GitHub"`
- Check that array entries use `[[links]]` format
- Verify proper indentation and formatting

## Example Complete Configuration

```toml
[settings]
show_text = false
show_tooltips = true
max_visible = 5
icon_size = "20px"
spacing = "1rem"

[[links]]
id = "github"
name = "GitHub"
url = "https://github.com/yourname"
icon = "fab fa-github"
target = "_blank"
enabled = true

[[links]]
id = "linkedin"
name = "LinkedIn"
url = "https://linkedin.com/in/yourname"
icon = "fab fa-linkedin"
target = "_blank"
enabled = true

[[links]]
id = "email"
name = "Email"
url = "mailto:your.email@example.com"
icon = "fas fa-envelope"
target = "_self"
enabled = true
```