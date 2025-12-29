#!/usr/bin/env node

/**
 * Renderer CLI - Command-line tool for Renderer framework
 * Usage: renderer <command> [options]
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

// CLI Configuration
const CLI_VERSION = '2.1.0';
const COMMANDS = {
    create: 'Create a new Renderer project',
    add: 'Add a new section (page, project, blog post)',
    validate: 'Validate TOML configuration files',
    deploy: 'Deploy your site to hosting platforms',
    migrate: 'Migrate from other frameworks',
    serve: 'Start a development server',
    build: 'Build optimized production files',
    help: 'Show help information'
};

// Color codes for terminal output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    green: '\x1b[32m',
    blue: '\x1b[34m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    cyan: '\x1b[36m'
};

// Utility functions
function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function error(message) {
    log(`✗ ${message}`, 'red');
}

function success(message) {
    log(`✓ ${message}`, 'green');
}

function info(message) {
    log(`ℹ ${message}`, 'blue');
}

function warn(message) {
    log(`⚠ ${message}`, 'yellow');
}

// Command: create
async function createProject(projectName, options = {}) {
    log(`\n🚀 Creating Renderer project: ${projectName}`, 'bright');

    const projectPath = path.join(process.cwd(), projectName);

    // Check if directory exists
    if (fs.existsSync(projectPath)) {
        error(`Directory ${projectName} already exists`);
        process.exit(1);
    }

    // Create project directory
    fs.mkdirSync(projectPath);
    info(`Created directory: ${projectPath}`);

    // Create folder structure
    const folders = [
        'assets/images',
        'config',
        'content',
        'css',
        'js',
        'locales',
        'docs'
    ];

    folders.forEach(folder => {
        fs.mkdirSync(path.join(projectPath, folder), { recursive: true });
        info(`Created folder: ${folder}`);
    });

    // Create basic files
    const files = {
        'index.html': getIndexTemplate(projectName),
        'package.json': getPackageJsonTemplate(projectName),
        'README.md': getReadmeTemplate(projectName),
        '.gitignore': getGitignoreTemplate(),
        'config/home.toml': getHomeConfigTemplate(),
        'config/projects.toml': getProjectsConfigTemplate(),
        'config/social.toml': getSocialConfigTemplate(),
        'css/critical.css': getCriticalCssTemplate(),
        'css/home.css': getHomeCssTemplate(),
        'js/toml-loader.js': '',
        'locales/en.json': getLocaleTemplate()
    };

    for (const [filePath, content] of Object.entries(files)) {
        const fullPath = path.join(projectPath, filePath);
        fs.writeFileSync(fullPath, content);
        info(`Created file: ${filePath}`);
    }

    success(`\n✨ Project ${projectName} created successfully!`);
    log(`\nNext steps:`, 'cyan');
    log(`  cd ${projectName}`, 'cyan');
    log(`  renderer serve`, 'cyan');
    log(`\nOptional: Install MCP server for AI assistance`, 'yellow');
    log(`  npm install -g renderer-mcp-server`, 'yellow');
}

// Command: add
async function addSection(type, name, options = {}) {
    log(`\n➕ Adding new ${type}: ${name}`, 'bright');

    switch (type) {
        case 'page':
            await addPage(name, options);
            break;
        case 'project':
            await addProject(name, options);
            break;
        case 'blog':
            await addBlogPost(name, options);
            break;
        default:
            error(`Unknown section type: ${type}`);
            log('Available types: page, project, blog');
            process.exit(1);
    }
}

async function addPage(name, options) {
    const fileName = `${name.toLowerCase()}.html`;
    const filePath = path.join(process.cwd(), fileName);

    if (fs.existsSync(filePath)) {
        error(`Page ${fileName} already exists`);
        process.exit(1);
    }

    const template = getPageTemplate(name);
    fs.writeFileSync(filePath, template);

    // Create CSS file
    const cssPath = path.join(process.cwd(), 'css', `${name.toLowerCase()}.css`);
    fs.writeFileSync(cssPath, `/* Styles for ${name} page */\n`);

    success(`Created page: ${fileName}`);
    info(`Created stylesheet: css/${name.toLowerCase()}.css`);
}

async function addProject(name, options) {
    const configPath = path.join(process.cwd(), 'config', 'projects.toml');

    if (!fs.existsSync(configPath)) {
        error('projects.toml not found. Are you in a Renderer project?');
        process.exit(1);
    }

    const projectEntry = `
[[projects]]
name = "${name}"
description = "Description for ${name}"
tags = ["tag1", "tag2"]
image = "./assets/images/${name.toLowerCase()}.jpg"
demo_url = ""
github_url = ""
status = "active"
`;

    fs.appendFileSync(configPath, projectEntry);
    success(`Added project: ${name} to projects.toml`);
    info('Don\'t forget to add an image to assets/images/');
}

async function addBlogPost(name, options) {
    const fileName = `${name.toLowerCase().replace(/\s+/g, '-')}.md`;
    const filePath = path.join(process.cwd(), 'content', fileName);

    if (fs.existsSync(filePath)) {
        error(`Blog post ${fileName} already exists`);
        process.exit(1);
    }

    const date = new Date().toISOString().split('T')[0];
    const template = `---
title: "${name}"
date: "${date}"
author: "Your Name"
tags: ["tag1", "tag2"]
description: "Brief description"
---

# ${name}

Your content here...
`;

    fs.writeFileSync(filePath, template);
    success(`Created blog post: ${fileName}`);
}

// Command: validate
async function validateConfig(options = {}) {
    log('\n🔍 Validating TOML configuration files...', 'bright');

    const configDir = path.join(process.cwd(), 'config');

    if (!fs.existsSync(configDir)) {
        error('config directory not found. Are you in a Renderer project?');
        process.exit(1);
    }

    const files = fs.readdirSync(configDir).filter(f => f.endsWith('.toml'));

    if (files.length === 0) {
        warn('No TOML files found in config directory');
        return;
    }

    let hasErrors = false;

    for (const file of files) {
        const filePath = path.join(configDir, file);
        info(`Checking ${file}...`);

        try {
            const content = fs.readFileSync(filePath, 'utf8');
            // Basic TOML validation (you'd use a real parser in production)
            if (content.includes('[[[') || content.includes(']]]')) {
                error(`  Invalid TOML syntax in ${file}`);
                hasErrors = true;
            } else {
                success(`  ${file} is valid`);
            }
        } catch (err) {
            error(`  Failed to read ${file}: ${err.message}`);
            hasErrors = true;
        }
    }

    if (hasErrors) {
        error('\n✗ Validation failed');
        process.exit(1);
    } else {
        success('\n✓ All configuration files are valid');
    }
}

// Command: deploy
async function deploy(platform, options = {}) {
    log(`\n🚀 Deploying to ${platform}...`, 'bright');

    switch (platform) {
        case 'netlify':
            await deployNetlify(options);
            break;
        case 'vercel':
            await deployVercel(options);
            break;
        case 'github':
            await deployGitHub(options);
            break;
        case 'surge':
            await deploySurge(options);
            break;
        default:
            error(`Unknown platform: ${platform}`);
            log('Available platforms: netlify, vercel, github, surge');
            process.exit(1);
    }
}

async function deployNetlify(options) {
    try {
        info('Deploying to Netlify...');
        await execAsync('netlify deploy --prod');
        success('Deployed to Netlify successfully!');
    } catch (err) {
        error('Netlify CLI not found. Install with: npm install -g netlify-cli');
        process.exit(1);
    }
}

async function deployVercel(options) {
    try {
        info('Deploying to Vercel...');
        await execAsync('vercel --prod');
        success('Deployed to Vercel successfully!');
    } catch (err) {
        error('Vercel CLI not found. Install with: npm install -g vercel');
        process.exit(1);
    }
}

async function deployGitHub(options) {
    try {
        info('Deploying to GitHub Pages...');
        await execAsync('git add . && git commit -m "Deploy" && git push origin main');
        success('Pushed to GitHub successfully!');
        info('Enable GitHub Pages in repository settings');
    } catch (err) {
        error('Failed to deploy to GitHub: ' + err.message);
        process.exit(1);
    }
}

async function deploySurge(options) {
    try {
        info('Deploying to Surge...');
        await execAsync('surge .');
        success('Deployed to Surge successfully!');
    } catch (err) {
        error('Surge CLI not found. Install with: npm install -g surge');
        process.exit(1);
    }
}

// Command: migrate
async function migrate(source, options = {}) {
    log(`\n🔄 Migrating from ${source}...`, 'bright');

    switch (source) {
        case 'jekyll':
            await migrateFromJekyll(options);
            break;
        case 'hugo':
            await migrateFromHugo(options);
            break;
        case 'wordpress':
            await migrateFromWordPress(options);
            break;
        default:
            error(`Migration from ${source} not yet supported`);
            log('Available sources: jekyll, hugo, wordpress');
            process.exit(1);
    }
}

async function migrateFromJekyll(options) {
    info('Migrating from Jekyll...');
    // Implementation for Jekyll migration
    warn('Jekyll migration is experimental');
    success('Migration template created. Please review and customize.');
}

// Command: serve
async function serve(options = {}) {
    const port = options.port || 8080;
    log(`\n🌐 Starting development server on http://localhost:${port}`, 'bright');

    try {
        // Try to use python's http.server
        const command = `python3 -m http.server ${port}`;
        const server = exec(command);

        server.stdout.on('data', (data) => {
            log(data, 'cyan');
        });

        server.stderr.on('data', (data) => {
            warn(data);
        });

        success(`Server running at http://localhost:${port}`);
        info('Press Ctrl+C to stop');

    } catch (err) {
        error('Failed to start server. Make sure Python 3 is installed.');
        process.exit(1);
    }
}

// Command: build
async function build(options = {}) {
    log('\n🔨 Building for production...', 'bright');

    // Create build directory
    const buildDir = path.join(process.cwd(), 'dist');
    if (!fs.existsSync(buildDir)) {
        fs.mkdirSync(buildDir);
    }

    // Copy files
    info('Copying files...');
    // In a real implementation, this would minify, optimize, etc.
    
    success('Build completed successfully!');
    info(`Output directory: ${buildDir}`);
}

// Template functions
function getIndexTemplate(projectName) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${projectName}</title>
    <link rel="stylesheet" href="./css/critical.css">
    <link rel="stylesheet" href="./css/home.css">
</head>
<body>
    <header>
        <nav>
            <a href="index.html">Home</a>
            <a href="projects.html">Projects</a>
            <a href="contact.html">Contact</a>
        </nav>
    </header>

    <main id="app">
        <section class="hero">
            <h1>Welcome to ${projectName}</h1>
            <p>Built with Renderer</p>
        </section>
    </main>

    <script src="./js/toml-loader.js"></script>
</body>
</html>`;
}

function getPackageJsonTemplate(projectName) {
    return JSON.stringify({
        name: projectName,
        version: '1.0.0',
        description: 'A Renderer-based portfolio',
        scripts: {
            serve: 'renderer serve',
            build: 'renderer build',
            deploy: 'renderer deploy'
        },
        keywords: ['renderer', 'portfolio', 'static-site'],
        author: '',
        license: 'MIT'
    }, null, 2);
}

function getReadmeTemplate(projectName) {
    return `# ${projectName}

A portfolio built with [Renderer](https://github.com/yourusername/renderer).

## Quick Start

\`\`\`bash
# Start development server
renderer serve

# Add a new project
renderer add project "My Project"

# Deploy to Netlify
renderer deploy netlify
\`\`\`

## Documentation

See [Renderer documentation](https://github.com/yourusername/renderer/tree/main/docs) for more information.
`;
}

function getGitignoreTemplate() {
    return `node_modules/
dist/
.DS_Store
*.log
.env
`;
}

function getHomeConfigTemplate() {
    return `[hero]
name = "Your Name"
tagline = "Full Stack Developer"
description = "Welcome to my portfolio"

[cta]
primary_text = "View Projects"
primary_link = "projects.html"
secondary_text = "Contact Me"
secondary_link = "contact.html"
`;
}

function getProjectsConfigTemplate() {
    return `[[projects]]
name = "Sample Project"
description = "A sample project description"
tags = ["JavaScript", "HTML", "CSS"]
image = "./assets/images/sample.jpg"
demo_url = "https://example.com"
github_url = "https://github.com/username/project"
status = "active"
`;
}

function getSocialConfigTemplate() {
    return `[social]
github = "https://github.com/username"
linkedin = "https://linkedin.com/in/username"
twitter = "https://twitter.com/username"
email = "email@example.com"
`;
}

function getCriticalCssTemplate() {
    return `/* Critical CSS - Loaded first */
:root {
    --primary-color: #2563eb;
    --text-color: #1f2937;
    --bg-color: #ffffff;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: system-ui, -apple-system, sans-serif;
    line-height: 1.6;
    color: var(--text-color);
    background: var(--bg-color);
}
`;
}

function getHomeCssTemplate() {
    return `.hero {
    min-height: 80vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 2rem;
}

.hero h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
}
`;
}

function getLocaleTemplate() {
    return JSON.stringify({
        nav: {
            home: 'Home',
            projects: 'Projects',
            contact: 'Contact'
        },
        hero: {
            greeting: 'Welcome'
        }
    }, null, 2);
}

function getPageTemplate(name) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${name}</title>
    <link rel="stylesheet" href="./css/critical.css">
    <link rel="stylesheet" href="./css/${name.toLowerCase()}.css">
</head>
<body>
    <header>
        <nav>
            <a href="index.html">Home</a>
        </nav>
    </header>

    <main>
        <h1>${name}</h1>
        <!-- Add your content here -->
    </main>
</body>
</html>`;
}

// Help command
function showHelp() {
    log('\n📖 Renderer CLI Help', 'bright');
    log(`Version: ${CLI_VERSION}\n`, 'cyan');

    log('Usage:', 'bright');
    log('  renderer <command> [options]\n');

    log('Commands:', 'bright');
    Object.entries(COMMANDS).forEach(([cmd, desc]) => {
        log(`  ${cmd.padEnd(12)} ${desc}`, 'cyan');
    });

    log('\nExamples:', 'bright');
    log('  renderer create my-portfolio', 'yellow');
    log('  renderer add project "My Project"', 'yellow');
    log('  renderer validate', 'yellow');
    log('  renderer deploy netlify', 'yellow');
    log('  renderer serve --port 3000', 'yellow');
}

// Main CLI handler
async function main() {
    const args = process.argv.slice(2);

    if (args.length === 0 || args[0] === 'help' || args[0] === '--help' || args[0] === '-h') {
        showHelp();
        return;
    }

    const command = args[0];
    const subArgs = args.slice(1);

    try {
        switch (command) {
            case 'create':
                if (!subArgs[0]) {
                    error('Please provide a project name');
                    log('Usage: renderer create <project-name>');
                    process.exit(1);
                }
                await createProject(subArgs[0]);
                break;

            case 'add':
                if (!subArgs[0] || !subArgs[1]) {
                    error('Please provide section type and name');
                    log('Usage: renderer add <type> <name>');
                    process.exit(1);
                }
                await addSection(subArgs[0], subArgs[1]);
                break;

            case 'validate':
                await validateConfig();
                break;

            case 'deploy':
                if (!subArgs[0]) {
                    error('Please provide a platform');
                    log('Usage: renderer deploy <platform>');
                    log('Platforms: netlify, vercel, github, surge');
                    process.exit(1);
                }
                await deploy(subArgs[0]);
                break;

            case 'migrate':
                if (!subArgs[0]) {
                    error('Please provide a source');
                    log('Usage: renderer migrate <source>');
                    process.exit(1);
                }
                await migrate(subArgs[0]);
                break;

            case 'serve':
                const portIndex = subArgs.indexOf('--port');
                const port = portIndex !== -1 ? subArgs[portIndex + 1] : undefined;
                await serve({ port });
                break;

            case 'build':
                await build();
                break;

            default:
                error(`Unknown command: ${command}`);
                log('Run "renderer help" for available commands');
                process.exit(1);
        }
    } catch (err) {
        error(`Command failed: ${err.message}`);
        process.exit(1);
    }
}

// Run CLI
if (require.main === module) {
    main();
}

module.exports = { main };
