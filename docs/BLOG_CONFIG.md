# Blog Configuration Documentation

This documentation explains how to configure and use the blog system in your portfolio.

## Configuration Files

### Main Configuration: `config/blog.toml`

The blog system uses a TOML configuration file that defines blog settings, pagination options, and all blog posts.

## Configuration Structure

### 1. Blog Settings (`[blog]`)

```toml
[blog]
title = "Personal Blog"                          # Blog page title
description = "Your blog description"            # Blog page subtitle
author = "Your Name"                            # Default author name
author_profile = "https://github.com/yourusername"  # Author profile URL
base_url = ""                                   # Base URL for blog (optional)
```

### 2. Pagination Settings (`[pagination]`)

```toml
[pagination]
posts_per_page = 6                              # Number of posts per page
enabled = true                                  # Enable/disable pagination
```

**Posts Per Page Options:**
- Set to `6` for 6 posts per page (recommended)
- Set to `12` for more posts per page
- Set to `3` for fewer posts per page
- Pagination automatically creates page navigation

### 3. Feature Settings (`[settings]`)

```toml
[settings]
enable_comments = true                          # Show comment sections
enable_social_sharing = true                   # Show social share buttons
enable_search = true                           # Enable blog search
enable_categories = true                       # Show category filters
enable_tags = true                             # Show tag filters
enable_related_posts = true                   # Show related posts
default_image = "https://example.com/default.jpg"  # Default post image
```

### 4. Blog Posts (`[[posts]]`)

Each blog post is defined as a `[[posts]]` section:

```toml
[[posts]]
id = "unique-post-id"                          # Unique identifier for the post
title = "Your Post Title"                      # Post title
description = "Post description for preview"   # Short description (meta)
date = "2024-10-15"                           # Publication date (YYYY-MM-DD)
tags = ["Tag1", "Tag2", "Tag3"]               # Array of tags
category = "Development"                       # Post category
content_file = "your-post.md"                 # Markdown file name in content/
author = "Author Name"                         # Post author (optional)
read_time = "8 min read"                      # Estimated reading time
featured = true                               # Mark as featured post
status = "published"                          # Post status (published/draft)
image = "https://example.com/image.jpg"       # Post header image
repo_url = "https://github.com/user/repo"    # Related repository
demo_url = "https://demo.example.com"         # Live demo URL
license = "MIT"                               # License type
contributors = ["Name1", "Name2"]             # Array of contributors
features = [                                  # Key features list
    "Feature 1",
    "Feature 2",
    "Feature 3"
]
related_posts = ["post-id-1", "post-id-2"]   # Related post IDs
```

## Content Files

### Markdown Files (`content/`)

Each post's content is stored in a separate Markdown file in the `content/` directory.

**File Structure:**
```
content/
├── typescript-modern-web.md
├── minimal-design.md
├── open-source-journey.md
└── web-performance-optimization.md
```

**Markdown File Format:**
```markdown
---
title: "Post Title"
date: "2024-10-15"
author: "Author Name"
description: "Post description"
tags: ["tag1", "tag2"]
---

# Your Post Title

Your post content goes here...

## Section Headers

Content with **bold** and *italic* text.

```code blocks```

- List items
- More items

[Links](https://example.com)
```

## Post Properties Explained

### Required Properties
- `id`: Unique identifier used in URLs
- `title`: Post title shown in listings and article page
- `description`: Brief description for post cards and meta tags
- `date`: Publication date in YYYY-MM-DD format
- `content_file`: Name of markdown file in content/ directory

### Optional Properties
- `tags`: Array of tags for categorization
- `category`: Post category for grouping
- `author`: Author name (defaults to blog.author)
- `read_time`: Estimated reading time display
- `featured`: Boolean to mark featured posts
- `status`: "published" or "draft"
- `image`: Header image URL
- `repo_url`: Related GitHub repository
- `demo_url`: Live demo or project URL
- `license`: License information
- `contributors`: Array of contributor names
- `features`: Array of key features/highlights
- `related_posts`: Array of related post IDs

## Configuration Examples

### Basic Blog Setup
```toml
[blog]
title = "My Development Blog"
description = "Sharing thoughts on web development and design"
author = "Jane Doe"

[pagination]
posts_per_page = 6
enabled = true

[[posts]]
id = "my-first-post"
title = "Hello World"
description = "My first blog post"
date = "2024-10-15"
content_file = "hello-world.md"
tags = ["introduction", "blogging"]
category = "General"
```

### Advanced Post Configuration
```toml
[[posts]]
id = "advanced-react-patterns"
title = "Advanced React Patterns"
description = "Deep dive into advanced React patterns and best practices"
date = "2024-10-15"
tags = ["React", "JavaScript", "Patterns", "Best Practices"]
category = "Development"
content_file = "advanced-react-patterns.md"
author = "Jane Doe"
read_time = "12 min read"
featured = true
status = "published"
image = "https://images.unsplash.com/photo-1633356122544-f134324a6cee"
repo_url = "https://github.com/janedoe/react-patterns"
demo_url = "https://react-patterns-demo.netlify.app"
license = "MIT"
contributors = ["Jane Doe", "React Community"]
features = [
    "Compound Components Pattern",
    "Render Props Pattern",
    "Custom Hooks",
    "Context API Best Practices"
]
related_posts = ["react-hooks-guide", "state-management"]
```

## Troubleshooting

### Posts Not Showing
1. Check that `content_file` matches actual file in `content/` directory
2. Verify date format is YYYY-MM-DD
3. Ensure `id` is unique for each post
4. Check browser console for loading errors

### Pagination Issues
1. Verify `posts_per_page` is a positive number
2. Check that `enabled = true` in pagination settings
3. Ensure you have enough posts to require pagination

### Images Not Loading
1. Use absolute URLs for images
2. Verify image URLs are accessible
3. Check for CORS issues with external images

## File Structure Overview
```
├── config/
│   └── blog.toml                    # Main blog configuration
├── content/                         # Markdown content files
│   ├── post-1.md
│   ├── post-2.md
│   └── ...
├── js/
│   ├── blog-config-toml.js         # TOML configuration loader
│   ├── blog-config.js              # JavaScript fallback config
│   └── blog-system.js              # Blog rendering system
├── css/
│   └── blog.css                    # Blog styling
└── blog.html                       # Blog page HTML
```