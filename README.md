# Minimal Portfolio

A clean, minimal personal portfolio website built with vanilla HTML, CSS, and JavaScript. Features a multipage structure with Markdown content rendering.

## Features

- **Multipage Support** - Separate pages for About, Projects, Blog, and Contact
- **Markdown Content** - All content stored in markdown files for easy editing
- **Dark/Light Theme** - Automatic theme detection with manual toggle
- **Responsive Design** - Works perfectly on mobile and desktop
- **Fast Loading** - No frameworks, just clean vanilla code
- **SEO Friendly** - Proper meta tags and semantic HTML

## Structure

```
├── index.html          # Home page with hero section
├── about.html           # About page
├── projects.html        # Projects showcase
├── blog.html           # Blog page (NEW!)
├── contact.html        # Contact information
├── content/            # Markdown content files
│   ├── about.md
│   ├── projects.md
│   ├── blog.md         # Blog content (NEW!)
│   └── contact.md
└── package.json        # Development dependencies
```

## Getting Started

1. **Clone or download** this repository
2. **Edit content** - Update the markdown files in the `content/` directory
3. **Customize** - Update colors, fonts, and personal information in HTML files
4. **Deploy** - Upload to any static hosting service

## Development

To run locally with live reload:

```bash
npm install
npm run dev
```

This starts a local server at `http://localhost:3000`

## Customization

### Personal Information
- Update name and brand in all HTML files
- Edit social links in the hero section
- Modify meta descriptions for SEO

### Content
- Edit markdown files in the `content/` directory
- The content is automatically rendered from markdown to HTML
- Add new blog posts to `content/blog.md`

### Styling
- Colors are defined as CSS variables in `:root`
- Dark theme variables are in `[data-theme="dark"]`
- All spacing uses consistent scale defined in CSS variables

### Adding New Pages
1. Create a new HTML file following the existing pattern
2. Create corresponding markdown file in `content/`
3. Update navigation in all HTML files
4. Update the JavaScript to load the new content

## Blog

The blog page showcases:
- Recent blog posts with dates
- Topic categories
- Clean, readable layout
- Links to full articles (can be implemented as separate pages)

## Technologies

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS Grid/Flexbox
- **JavaScript** - Vanilla JS for interactivity
- **Marked.js** - Markdown to HTML conversion
- **Inter Font** - Clean, modern typography

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License - Feel free to use and modify for your own portfolio!

## Deployment

This portfolio can be deployed to:
- **Netlify** - Drag and drop the folder
- **Vercel** - Connect your GitHub repository
- **GitHub Pages** - Enable in repository settings
- **Any static hosting** - Upload the files

No build process required - it's ready to deploy as-is!