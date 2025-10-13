/**
 * Dynamic Blog System
 * Single file to handle both blog index and individual posts with URL routing
 */

class BlogSystem {
    constructor() {
        this.config = window.BLOG_CONFIG || {};
        this.posts = this.config.posts || [];
        this.currentTheme = localStorage.getItem('theme') || 
            (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        
        this.init();
    }

    init() {
        this.setupTheme();
        this.setupEventListeners();
        this.handleRouting();
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
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Mobile navigation
        const mobileMenuButton = document.querySelector('.mobile-menu-button');
        const navLinks = document.querySelector('.nav-links');

        if (mobileMenuButton && navLinks) {
            mobileMenuButton.addEventListener('click', () => {
                navLinks.classList.toggle('mobile-open');
            });

            // Close mobile menu when clicking on a link
            navLinks.addEventListener('click', (e) => {
                if (e.target.classList.contains('nav-link')) {
                    navLinks.classList.remove('mobile-open');
                }
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.nav')) {
                    navLinks.classList.remove('mobile-open');
                }
            });
        }

        // Handle browser back/forward buttons
        window.addEventListener('popstate', () => this.handleRouting());
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        localStorage.setItem('theme', this.currentTheme);
    }

    handleRouting() {
        const urlParams = new URLSearchParams(window.location.search);
        const postId = urlParams.get('post');
        const page = parseInt(urlParams.get('page')) || 1;

        if (postId) {
            this.renderPost(postId);
        } else {
            this.renderIndex(page);
        }
    }

    renderIndex(page = 1) {
        const app = document.getElementById('app');
        
        // Get paginated posts
        const paginationData = this.config.getPaginatedPosts(page);
        const { posts, totalPages, currentPage, hasNext, hasPrev, nextPage, prevPage } = paginationData;
        
        // Create pagination HTML
        const paginationHtml = this.createPaginationHtml(currentPage, totalPages, hasNext, hasPrev, nextPage, prevPage);
        
        const html = `
            <header class="page-header">
                <h1 class="page-title">Blog</h1>
                <p class="page-subtitle">Thoughts on web development, technology, design, and everything in between.</p>
            </header>

            <div class="content">
                <div class="blog-posts">
                    ${posts.map(post => this.createPostCard(post)).join('')}
                </div>
                ${paginationHtml}
            </div>
        `;

        app.innerHTML = html;
        app.classList.add('fade-in');

        // Update page metadata
        const title = page > 1 ? `Blog - Page ${page}` : 'Blog - Personal Portfolio';
        document.title = title;
        this.updateMetaDescription('Thoughts on web development, technology, design, and everything in between.');
    }

    createPostCard(post) {
        const tagsHtml = post.tags.map(tag => `<span class="post-tag">${tag}</span>`).join('');
        
        return `
            <a href="?post=${post.id}" class="blog-post" onclick="BlogSystem.navigateToPost('${post.id}'); return false;">
                <div class="post-date">${post.date}</div>
                <h2 class="post-title">${post.title}</h2>
                <p class="post-description">${post.description}</p>
                <div class="post-tags">
                    ${tagsHtml}
                </div>
            </a>
        `;
    }

    createPostNavigation(navigation) {
        if (!navigation.prev && !navigation.next) {
            return '';
        }

        const prevHtml = navigation.prev ? `
            <a href="?post=${navigation.prev.id}" class="post-nav-link post-nav-prev" onclick="BlogSystem.navigateToPost('${navigation.prev.id}'); return false;">
                <div class="post-nav-direction">← Previous</div>
                <div class="post-nav-title">${navigation.prev.title}</div>
            </a>
        ` : '<div></div>';

        const nextHtml = navigation.next ? `
            <a href="?post=${navigation.next.id}" class="post-nav-link post-nav-next" onclick="BlogSystem.navigateToPost('${navigation.next.id}'); return false;">
                <div class="post-nav-direction">Next →</div>
                <div class="post-nav-title">${navigation.next.title}</div>
            </a>
        ` : '<div></div>';

        return `
            <nav class="post-navigation">
                ${prevHtml}
                ${nextHtml}
            </nav>
        `;
    }

    createPaginationHtml(currentPage, totalPages, hasNext, hasPrev, nextPage, prevPage) {
        if (totalPages <= 1) {
            return '';
        }

        const prevButton = hasPrev ? 
            `<a href="?page=${prevPage}" class="pagination-btn" onclick="BlogSystem.navigateToPage(${prevPage}); return false;">← Previous</a>` :
            `<span class="pagination-btn pagination-btn-disabled">← Previous</span>`;

        const nextButton = hasNext ? 
            `<a href="?page=${nextPage}" class="pagination-btn" onclick="BlogSystem.navigateToPage(${nextPage}); return false;">Next →</a>` :
            `<span class="pagination-btn pagination-btn-disabled">Next →</span>`;

        // Generate page numbers
        let pageNumbers = '';
        const maxVisible = 5;
        let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let end = Math.min(totalPages, start + maxVisible - 1);
        
        if (end - start + 1 < maxVisible) {
            start = Math.max(1, end - maxVisible + 1);
        }

        for (let i = start; i <= end; i++) {
            if (i === currentPage) {
                pageNumbers += `<span class="pagination-number pagination-number-active">${i}</span>`;
            } else {
                pageNumbers += `<a href="?page=${i}" class="pagination-number" onclick="BlogSystem.navigateToPage(${i}); return false;">${i}</a>`;
            }
        }

        return `
            <nav class="pagination">
                ${prevButton}
                <div class="pagination-numbers">
                    ${pageNumbers}
                </div>
                ${nextButton}
            </nav>
        `;
    }

    async renderPost(postId) {
        const post = this.posts.find(p => p.id === postId);
        
        if (!post) {
            this.renderError('Blog post not found');
            return;
        }

        // Show loading state
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="content">
                <a href="?" class="back-button" onclick="BlogSystem.navigateToIndex(); return false;">
                    ← Back to Blog
                </a>
                <div class="loading">Loading post...</div>
            </div>
        `;

        try {
            // Fetch and render content
            const response = await fetch(`/content/${post.contentPath}`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const markdown = await response.text();
            const html = marked.parse(markdown);
            
            this.renderPostContent(html, post);
        } catch (error) {
            console.error('Failed to load post:', error);
            this.renderError('Failed to load blog post content');
        }
    }

    renderPostContent(html, post) {
        const app = document.getElementById('app');
        
        // Get navigation links
        const navigation = this.config.getPostNavigation(post.id);
        const navHtml = this.createPostNavigation(navigation);
        
        const postHtml = `
            <div class="content">
                <a href="?" class="back-button" onclick="BlogSystem.navigateToIndex(); return false;">
                    ← Back to Blog
                </a>
                
                <article class="article">
                    <header class="article-header">
                        <div class="article-meta">${post.date} • ${post.readTime || '5 min read'}</div>
                        <h1 class="article-title">${post.title}</h1>
                        <p class="article-description">${post.description}</p>
                    </header>
                    
                    <div class="article-content">
                        ${html}
                    </div>
                    
                    ${navHtml}
                </article>
            </div>
        `;

        app.innerHTML = postHtml;
        app.classList.add('fade-in');

        // Update page metadata
        document.title = `${post.title} - Blog`;
        this.updateMetaDescription(post.description);

        // Setup content links
        this.setupContentLinks(app);
    }

    renderError(message = 'Content not available') {
        const app = document.getElementById('app');
        
        app.innerHTML = `
            <div class="content">
                <a href="?" class="back-button" onclick="BlogSystem.navigateToIndex(); return false;">
                    ← Back to Blog
                </a>
                
                <div class="error-message">
                    <h2>Oops!</h2>
                    <p>${message}</p>
                </div>
            </div>
        `;

        app.classList.add('fade-in');
    }

    updateMetaDescription(description) {
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', description);
        }
    }

    setupContentLinks(container) {
        // Open external links in new tab
        container.querySelectorAll('a[href^="http"]').forEach(link => {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
        });
    }

    // Static navigation methods
    static navigateToPost(postId) {
        const newUrl = `${window.location.pathname}?post=${postId}`;
        window.history.pushState({ postId }, '', newUrl);
        window.blogSystem.handleRouting();
    }

    static navigateToIndex() {
        const newUrl = window.location.pathname;
        window.history.pushState({}, '', newUrl);
        window.blogSystem.handleRouting();
    }

    static navigateToPage(page) {
        const newUrl = `${window.location.pathname}?page=${page}`;
        window.history.pushState({ page }, '', newUrl);
        window.blogSystem.handleRouting();
    }
}

// Initialize the blog system when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.blogSystem = new BlogSystem();
    });
} else {
    window.blogSystem = new BlogSystem();
}