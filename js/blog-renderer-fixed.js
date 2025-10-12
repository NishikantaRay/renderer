/**
 * Global Blog Renderer
 * Centralized system for rendering blog pages with consistent styling and functionality
 */

class BlogRenderer {
    constructor() {
        console.log('Blog Renderer - Constructor called');
        this.currentTheme = localStorage.getItem('theme') || 
            (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        
        // Use external blog configuration if available
        this.blogConfig = window.BLOG_CONFIG || {};
        console.log('Blog Renderer - Blog config:', this.blogConfig);
        this.blogPosts = this.blogConfig.posts || [
            {
                id: 'typescript-modern-web',
                title: 'Building Modern Web Applications with TypeScript',
                description: 'TypeScript has revolutionized the way we build web applications. Learn about best practices, implementation strategies, and why TypeScript has become essential for modern development.',
                date: 'October 12, 2024',
                tags: ['TypeScript', 'Web Development', 'JavaScript'],
                contentPath: 'typescript-modern-web.md'
            },
            {
                id: 'minimal-design',
                title: 'The Art of Minimal Design',
                description: 'Exploring the philosophy and practice of minimal design in creating beautiful, functional user experiences that prioritize clarity and purpose.',
                date: 'October 8, 2024',
                tags: ['Design', 'UX/UI', 'Philosophy'],
                contentPath: 'minimal-design.md'
            },
            {
                id: 'open-source-journey',
                title: 'My Journey into Open Source',
                description: 'From my first nervous pull request to becoming a maintainer, here\'s what I\'ve learned about contributing to open source projects and building meaningful connections in the developer community.',
                date: 'September 28, 2024',
                tags: ['Open Source', 'Community', 'Career'],
                contentPath: 'open-source-journey.md'
            }
        ];

        this.init();
    }

    init() {
        console.log('Blog Renderer - Initializing...');
        this.setupTheme();
        this.setupEventListeners();
        this.determinePageType();
        console.log('Blog Renderer - Initialization complete');
    }

    setupTheme() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        
        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                this.currentTheme = e.matches ? 'dark' : 'light';
                document.documentElement.setAttribute('data-theme', this.currentTheme);
            }
        });
    }

    setupEventListeners() {
        // Theme toggle functionality
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Mobile navigation
        const mobileMenuButton = document.querySelector('.mobile-menu-button');
        const navLinks = document.querySelector('.nav-links');

        if (mobileMenuButton && navLinks) {
            mobileMenuButton.addEventListener('click', () => {
                const isExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
                mobileMenuButton.setAttribute('aria-expanded', !isExpanded);
                navLinks.classList.toggle('active');
            });
        }
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        localStorage.setItem('theme', this.currentTheme);
    }

    determinePageType() {
        const currentPath = window.location.pathname;
        let filename = currentPath.split('/').pop() || 'index.html';
        
        console.log('Blog Renderer - Path:', currentPath, 'Filename:', filename);
        console.log('Blog Renderer - Available posts:', this.blogPosts.length);
        
        // Check if we're on the blog page (handles both /blog.html and /blog paths)
        if (filename === 'blog.html' || filename === 'blog' || currentPath.endsWith('/blog')) {
            console.log('Blog Renderer - Rendering blog index');
            this.renderBlogIndex();
        } else if (currentPath.includes('/blog/')) {
            // Handle individual blog posts in /blog/ directory
            // If filename doesn't have .html extension, add it for detection
            const testFilename = filename.endsWith('.html') ? filename : filename + '.html';
            console.log('Blog Renderer - Testing filename:', testFilename);
            
            if (this.isIndividualBlogPost(testFilename)) {
                console.log('Blog Renderer - Rendering individual post:', testFilename);
                this.renderIndividualPost(testFilename);
            } else {
                console.log('Blog Renderer - Not a recognized blog post:', testFilename);
            }
        } else if (filename.endsWith('.html') && this.isIndividualBlogPost(filename)) {
            console.log('Blog Renderer - Rendering individual post (fallback)');
            this.renderIndividualPost(filename);
        } else {
            console.log('Blog Renderer - No matching page type found');
        }
    }

    isIndividualBlogPost(filename) {
        const postId = filename.replace('.html', '');
        return this.blogPosts.some(post => post.id === postId);
    }

    renderBlogIndex() {
        console.log('Blog Renderer - renderBlogIndex called');
        const contentContainer = document.getElementById('content');
        if (!contentContainer) {
            console.error('Blog Renderer - Content container not found');
            return;
        }

        const blogPostsHtml = this.blogPosts.map(post => this.createBlogPostCard(post)).join('');
        
        contentContainer.innerHTML = `
            <div class="blog-posts">
                ${blogPostsHtml}
            </div>
        `;

        this.addFadeInAnimation(contentContainer);
    }

    createBlogPostCard(post) {
        const tagsHtml = post.tags.map(tag => `<span class="post-tag">${tag}</span>`).join('');
        
        return `
            <a href="blog/${post.id}.html" class="blog-post">
                <div class="post-date">${post.date}</div>
                <h2 class="post-title">${post.title}</h2>
                <p class="post-description">${post.description}</p>
                <div class="post-tags">
                    ${tagsHtml}
                </div>
            </a>
        `;
    }

    async renderIndividualPost(filename) {
        console.log('Rendering individual post:', filename);
        const postId = filename.replace('.html', '');
        const post = this.blogPosts.find(p => p.id === postId);
        console.log('Found post:', post);
        
        if (!post) {
            this.renderError('Post not found');
            return;
        }

        try {
            // Use absolute path for content to avoid relative path issues
            let contentPath = post.contentPath;
            
            // Convert relative paths to absolute paths
            if (contentPath.startsWith('../content/')) {
                contentPath = '/content/' + contentPath.replace('../content/', '');
            } else if (contentPath.startsWith('./content/')) {
                contentPath = '/content/' + contentPath.replace('./content/', '');
            } else if (!contentPath.startsWith('/')) {
                // If it doesn't start with /, assume it's relative to content
                contentPath = '/content/' + contentPath;
            }
            
            console.log('Final content path:', contentPath);
            const response = await fetch(contentPath);
            console.log('Fetch response:', response.status, response.ok);
            
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const markdown = await response.text();
            console.log('Markdown loaded, length:', markdown.length);
            const html = marked.parse(markdown);
            console.log('HTML parsed, length:', html.length);
            
            this.renderPostContent(html, post);
        } catch (error) {
            console.error('Failed to load content:', error);
            this.renderError('Failed to load blog post content');
        }
    }

    renderPostContent(html, post) {
        console.log('renderPostContent called');
        const contentContainer = document.getElementById('content');
        console.log('Content container found:', !!contentContainer);
        
        if (!contentContainer) {
            console.error('Content container not found!');
            return;
        }

        // Update page metadata
        this.updatePageMetadata(post);

        console.log('Setting innerHTML with HTML length:', html.length);
        contentContainer.innerHTML = html;
        this.addFadeInAnimation(contentContainer);
        this.setupContentLinks(contentContainer);
        console.log('Content rendered successfully');
    }

    updatePageMetadata(post) {
        // Update page title
        document.title = `${post.title} - Blog`;
        
        // Update meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', post.description);
        }

        // Update article header if it exists
        const articleDate = document.querySelector('.article-date');
        const articleTitle = document.querySelector('.article-title');
        const articleDescription = document.querySelector('.article-description');

        if (articleDate) articleDate.textContent = post.date;
        if (articleTitle) articleTitle.textContent = post.title;
        if (articleDescription) articleDescription.textContent = post.description;
    }

    addFadeInAnimation(container) {
        container.classList.add('fade-in');
    }

    setupContentLinks(container) {
        // Open external links in new tab
        container.querySelectorAll('a[href^="http"]').forEach(link => {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
        });
    }

    renderError(message = 'Content not available') {
        const contentContainer = document.getElementById('content');
        if (!contentContainer) return;

        contentContainer.innerHTML = `
            <div class="error-message">
                <h2>Oops!</h2>
                <p>${message}</p>
                <a href="/" class="back-home">← Back to Home</a>
            </div>
        `;

        this.addFadeInAnimation(contentContainer);
    }

    // Static method to get post navigation
    static getPostNavigation(currentPostId) {
        // Use configuration method if available
        if (window.BLOG_CONFIG && window.BLOG_CONFIG.getPostNavigation) {
            return window.BLOG_CONFIG.getPostNavigation(currentPostId);
        }
        
        // Fallback to instance method
        const blogRenderer = new BlogRenderer();
        const posts = blogRenderer.blogPosts;
        const currentIndex = posts.findIndex(post => post.id === currentPostId);
        
        if (currentIndex === -1) return { prev: null, next: null };

        const prev = currentIndex > 0 ? posts[currentIndex - 1] : null;
        const next = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;

        return { prev, next };
    }

    // Utility method to get all posts
    getAllPosts() {
        return this.blogPosts;
    }

    // Method to get a specific post by ID
    getPostById(id) {
        return this.blogPosts.find(post => post.id === id);
    }
}

// Export for global use
window.BlogRenderer = BlogRenderer;

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('DOM loaded, creating BlogRenderer instance...');
        new BlogRenderer();
    });
} else {
    console.log('DOM already loaded, creating BlogRenderer instance...');
    new BlogRenderer();
}