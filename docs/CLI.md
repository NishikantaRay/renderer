# Renderer CLI Documentation

The Renderer CLI provides powerful commands to streamline your workflow.

## Installation

```bash
# Global installation (recommended)
npm install -g renderer

# Or use npx without installation
npx renderer <command>
```

## Commands

### `create` - Create New Project

Create a new Renderer project with complete scaffolding.

```bash
renderer create my-portfolio
```

This creates:
- Complete folder structure (assets, config, content, css, js)
- Basic HTML pages with navigation
- TOML configuration files
- Package.json with scripts
- README and .gitignore

### `add` - Add New Content

Add pages, projects, or blog posts to your existing project.

```bash
# Add a new page
renderer add page About

# Add a project entry
renderer add project "My Awesome App"

# Add a blog post
renderer add blog "Getting Started with Renderer"
```

**Page**: Creates HTML file + CSS stylesheet  
**Project**: Adds entry to `config/projects.toml`  
**Blog**: Creates markdown file in `content/`

### `validate` - Validate Configuration

Check all TOML configuration files for syntax errors.

```bash
renderer validate
```

Validates:
- `config/home.toml`
- `config/projects.toml`
- `config/blog.toml`
- `config/resume.toml`
- `config/social.toml`

### `serve` - Development Server

Start a local development server.

```bash
# Default port (8080)
renderer serve

# Custom port
renderer serve --port 3000
```

Opens your site at `http://localhost:8080` (or custom port).

### `build` - Production Build

Build optimized production files.

```bash
renderer build
```

Creates `dist/` folder with optimized:
- Minified CSS/JS
- Compressed images
- Optimized HTML

### `deploy` - Deploy to Hosting

Deploy your site to popular platforms.

```bash
# Deploy to Netlify
renderer deploy netlify

# Deploy to Vercel
renderer deploy vercel

# Deploy to GitHub Pages
renderer deploy github

# Deploy to Surge
renderer deploy surge
```

**Prerequisites**: Install platform CLI tools first.

### `migrate` - Migrate from Other Frameworks

Migrate content from Jekyll, Hugo, or WordPress.

```bash
# From Jekyll
renderer migrate jekyll

# From Hugo
renderer migrate hugo

# From WordPress
renderer migrate wordpress
```

Creates migration templates to help transfer content.

## Workflow Examples

### Starting a New Project

```bash
# 1. Create project
renderer create my-site
cd my-site

# 2. Start development server
renderer serve

# 3. Add content
renderer add project "First Project"
renderer add blog "Hello World"

# 4. Validate configuration
renderer validate

# 5. Build for production
renderer build

# 6. Deploy
renderer deploy netlify
```

### Adding Content to Existing Project

```bash
# Add multiple projects
renderer add project "Project Alpha"
renderer add project "Project Beta"

# Add blog posts
renderer add blog "2024 Year in Review"
renderer add blog "My Design Process"

# Validate changes
renderer validate
```

### Deployment Workflow

```bash
# 1. Build production files
renderer build

# 2. Test locally
renderer serve

# 3. Deploy
renderer deploy vercel

# Or use npm scripts
npm run build
npm run deploy
```

## Configuration

### Package.json Scripts

Add these to your `package.json`:

```json
{
  "scripts": {
    "dev": "renderer serve",
    "build": "renderer build",
    "validate": "renderer validate",
    "deploy": "renderer deploy netlify"
  }
}
```

Now you can use:

```bash
npm run dev
npm run build
npm run deploy
```

## Platform Setup

### Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
renderer deploy netlify
```

### Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
renderer deploy vercel
```

### GitHub Pages

```bash
# Push to GitHub
git remote add origin https://github.com/username/repo.git
git push -u origin main

# Deploy
renderer deploy github

# Enable GitHub Pages in repository settings
```

### Surge

```bash
# Install Surge CLI
npm install -g surge

# Deploy (will prompt for login on first use)
renderer deploy surge
```

## Advanced Usage

### Custom Templates

Override default templates by creating:
- `.renderer/templates/page.html`
- `.renderer/templates/project.toml`
- `.renderer/templates/blog.md`

### Environment Variables

Set deployment variables:

```bash
# .env file
NETLIFY_SITE_ID=your-site-id
VERCEL_PROJECT_ID=your-project-id
```

### Build Configuration

Create `.renderer.config.js`:

```javascript
module.exports = {
  build: {
    minify: true,
    optimizeImages: true,
    generateSitemap: true
  },
  deploy: {
    platform: 'netlify',
    branch: 'main'
  }
};
```

## Troubleshooting

### Command Not Found

```bash
# Ensure global installation
npm install -g renderer

# Or use full path
npx renderer <command>
```

### Permission Denied

```bash
# Make CLI executable
chmod +x node_modules/.bin/renderer
```

### TOML Validation Errors

```bash
# Run validator with details
renderer validate --verbose

# Check specific file
renderer validate config/projects.toml
```

## Tips & Best Practices

1. **Use `validate` frequently** - Run after any config changes
2. **Test locally first** - Use `serve` before deploying
3. **Version control** - Commit after using `add` commands
4. **Backup before migrate** - Keep original files safe
5. **Use npm scripts** - Shorter commands, easier to remember

## Getting Help

```bash
# Show help
renderer help

# Show version
renderer --version

# Get command-specific help
renderer create --help
```

## Integration with MCP Server

The CLI works seamlessly with the Renderer MCP Server:

1. **AI generates config** via MCP tools
2. **You validate** with `renderer validate`
3. **Test locally** with `renderer serve`
4. **Deploy** with `renderer deploy`

This creates a powerful AI + CLI workflow! 🚀

## Next Steps

- Read [Configuration Guide](./CONFIGURATION.md)
- Explore [Examples](./EXAMPLES.md)
- Check [MCP Server Docs](./MCP_SERVER.md)
- Join [Community](https://github.com/renderer/discussions)
