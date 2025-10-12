/**
 * Global Blog Renderer
 * Centralized system for rendering blog pages with consistent styling and functionality
 */

// Prevent redeclaration if already loaded
if (typeof window.BlogRenderer === 'undefined') {
    window.BlogRenderer = class BlogRenderer {
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
                contentPath: '../content/typescript-modern-web.md'
            },
            {
                id: 'minimal-design',
                title: 'The Art of Minimal Design',
                description: 'Exploring the philosophy and practice of minimal design in creating beautiful, functional user experiences that prioritize clarity and purpose.',
                date: 'October 8, 2024',
                tags: ['Design', 'UX/UI', 'Philosophy'],
                contentPath: '../content/minimal-design.md'
            },
            {
                id: 'open-source-journey',
                title: 'My Journey into Open Source',
                description: 'From my first nervous pull request to becoming a maintainer, here\'s what I\'ve learned about contributing to open source projects and building meaningful connections in the developer community.',
                date: 'September 28, 2024',
                tags: ['Open Source', 'Community', 'Career'],
                contentPath: '../content/open-source-journey.md'
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
        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
                document.documentElement.setAttribute('data-theme', this.currentTheme);
                localStorage.setItem('theme', this.currentTheme);
            });
        }

        // Mobile menu toggle
        const mobileToggle = document.getElementById('mobile-menu-toggle');
        const navLinks = document.querySelector('.nav-links');
        
        if (mobileToggle && navLinks) {
            mobileToggle.addEventListener('click', () => {
                navLinks.classList.toggle('mobile-open');
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!mobileToggle.contains(e.target) && !navLinks.contains(e.target)) {
                    navLinks.classList.remove('mobile-open');
                }
            });
        }
    }

    determinePageType() {
        const currentPath = window.location.pathname;
        const filename = currentPath.split('/').pop() || 'index.html';
        
        console.log('Blog Renderer - Path:', currentPath, 'Filename:', filename);
        console.log('Blog Renderer - Available posts:', this.blogPosts.length);
        
        // Check if we're on the blog page (handles both /blog.html and /blog paths)
        if (filename === 'blog.html' || filename === 'blog' || currentPath.endsWith('/blog')) {
            console.log('Blog Renderer - Rendering blog index');
            this.renderBlogIndex();
        } else if (currentPath.includes('/blog/') && filename.endsWith('.html')) {
            // Handle individual blog posts in /blog/ directory
            if (this.isIndividualBlogPost(filename)) {
                this.renderIndividualPost(filename);
            }
        } else if (filename.endsWith('.html') && this.isIndividualBlogPost(filename)) {
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
        const contentContainer = document.getElementById('content');
        if (!contentContainer) return;

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
                <p class="post-excerpt">${post.description}</p>
                <div class="post-tags">
                    ${tagsHtml}
                </div>
            </a>
        `;
    }

    async renderIndividualPost(filename) {
        const postId = filename.replace('.html', '');
        const post = this.blogPosts.find(p => p.id === postId);
        
        if (!post) {
            this.renderError('Post not found');
            return;
        }

        try {
            // Determine the correct content path based on current location
            let contentPath = post.contentPath;
            const currentPath = window.location.pathname;
            
            // If we're in a subdirectory (/blog/), adjust the relative path
            if (currentPath.includes('/blog/')) {
                contentPath = contentPath.replace('../content/', '../content/').replace('./content/', '../content/');
            } else {
                contentPath = contentPath.replace('../content/', './content/');
            }
            
            const response = await fetch(contentPath);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const markdown = await response.text();
            const html = marked.parse(markdown);
            
            this.renderPostContent(html, post);
        } catch (error) {
            console.error('Failed to load content:', error);
            this.renderError('Failed to load blog post content');
        }
    }

    renderPostContent(html, post) {
        const contentContainer = document.getElementById('content');
        if (!contentContainer) return;

        // Update page metadata
        this.updatePageMetadata(post);

        contentContainer.innerHTML = html;
        this.addFadeInAnimation(contentContainer);
        this.setupContentLinks(contentContainer);
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
        const container = document.getElementById('content');
        if (container) {
            container.innerHTML = `
                <div style="color: var(--text-muted); text-align: center; padding: 2rem;">
                    <p>${message}</p>
                    <a href="blog.html" style="color: var(--text-accent); text-decoration: none; margin-top: 1rem; display: inline-block;">
                        ← Back to Blog
                    </a>
                </div>
            `;
        }
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
    };
}

// Auto-initialize when DOM is ready - always run this
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (window.BlogRenderer) {
            new window.BlogRenderer();
        }
    });
} else {
    if (window.BlogRenderer) {
        new window.BlogRenderer();
    }
}