/**
 * Dynamic Blog System
 * Single file to handle both blog index and individual posts with URL routing
 */

class BlogSystem {
    constructor() {
        this.blogConfig = null;
        this.currentTheme = localStorage.getItem('theme') || 
            (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        
        this.init();
    }

    async init() {
        this.setupTheme();
        this.setupEventListeners();
        
        // Initialize blog configuration
        await this.initializeBlogConfig();
        
        // Handle routing after config is loaded
        this.handleRouting();
    }

    async initializeBlogConfig() {
        try {
            if (window.blogConfigTOML) {
                const success = await window.blogConfigTOML.init();
                
                if (success && window.blogConfigTOML.isInitialized) {
                    this.blogConfig = window.blogConfigTOML;
                } else {
                    // Fall back to JavaScript configuration
                    if (window.BLOG_CONFIG) {
                        // Create a simple adapter to mimic the TOML config interface
                        this.blogConfig = {
                            config: window.BLOG_CONFIG,
                            isInitialized: true,
                            getPaginatedPosts: (page = 1) => {
                                const allPosts = window.BLOG_CONFIG.posts;
                                const postsPerPage = window.BLOG_CONFIG.pagination.postsPerPage;
                                const totalPosts = allPosts.length;
                                const totalPages = Math.ceil(totalPosts / postsPerPage);
                                const currentPage = Math.max(1, Math.min(page, totalPages));
                                
                                const startIndex = (currentPage - 1) * postsPerPage;
                                const endIndex = startIndex + postsPerPage;
                                const posts = allPosts.slice(startIndex, endIndex);
                                
                                return {
                                    posts,
                                    totalPages,
                                    currentPage,
                                    totalPosts,
                                    hasNext: currentPage < totalPages,
                                    hasPrev: currentPage > 1,
                                    nextPage: currentPage < totalPages ? currentPage + 1 : null,
                                    prevPage: currentPage > 1 ? currentPage - 1 : null
                                };
                            },
                            getPostById: (id) => window.BLOG_CONFIG.posts.find(post => post.id === id),
                            getPostNavigation: (currentPostId) => {
                                const posts = window.BLOG_CONFIG.posts;
                                const currentIndex = posts.findIndex(post => post.id === currentPostId);
                                
                                if (currentIndex === -1) return { prev: null, next: null };

                                const prev = currentIndex > 0 ? posts[currentIndex - 1] : null;
                                const next = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;

                                return { prev, next };
                            },
                            loadMarkdownContent: async (contentPath) => {
                                try {
                                    const response = await fetch(`./content/${contentPath}`);
                                    if (!response.ok) throw new Error(`Failed to load ${contentPath}: ${response.status}`);
                                    const markdown = await response.text();
                                    
                                    // Parse markdown using Marked.js if available
                                    let content = markdown;
                                    if (window.marked) {
                                        content = window.marked.parse(markdown);
                                    } else {
                                        // Basic markdown parsing fallback
                                        content = window.blogSystem.parseMarkdownBasic(markdown);
                                    }
                                    
                                    return { content, metadata: {} };
                                } catch (error) {
                                    // Fallback: try to get content from blog config
                                    const postId = contentPath.replace('.md', '');
                                    const post = window.BLOG_CONFIG.posts.find(p => p.id === postId);
                                    
                                    if (post && post.fallbackContent) {
                                        return { content: post.fallbackContent, metadata: {} };
                                    }
                                    
                                    return { content: '<p>Content not available: ' + error.message + '</p>', metadata: {} };
                                }
                            }
                        };
                    } else {
                        this.blogConfig = { posts: [] };
                    }
                }
            } else {
                if (window.BLOG_CONFIG) {
                    this.blogConfig = {
                        config: window.BLOG_CONFIG,
                        isInitialized: true,
                        getPaginatedPosts: (page = 1) => {
                            const allPosts = window.BLOG_CONFIG.posts;
                            const postsPerPage = window.BLOG_CONFIG.pagination.postsPerPage;
                            const totalPosts = allPosts.length;
                            const totalPages = Math.ceil(totalPosts / postsPerPage);
                            const currentPage = Math.max(1, Math.min(page, totalPages));
                            
                            const startIndex = (currentPage - 1) * postsPerPage;
                            const endIndex = startIndex + postsPerPage;
                            const posts = allPosts.slice(startIndex, endIndex);
                            
                            return {
                                posts,
                                totalPages,
                                currentPage,
                                totalPosts,
                                hasNext: currentPage < totalPages,
                                hasPrev: currentPage > 1,
                                nextPage: currentPage < totalPages ? currentPage + 1 : null,
                                prevPage: currentPage > 1 ? currentPage - 1 : null
                            };
                        },
                        getPostById: (id) => window.BLOG_CONFIG.posts.find(post => post.id === id),
                        getPostNavigation: (currentPostId) => {
                            const posts = window.BLOG_CONFIG.posts;
                            const currentIndex = posts.findIndex(post => post.id === currentPostId);
                            
                            if (currentIndex === -1) return { prev: null, next: null };

                            const prev = currentIndex > 0 ? posts[currentIndex - 1] : null;
                            const next = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;

                            return { prev, next };
                        },
                        loadMarkdownContent: async (contentPath) => {
                            try {
                                const response = await fetch(`./content/${contentPath}`);
                                if (!response.ok) throw new Error(`Failed to load ${contentPath}: ${response.status}`);
                                const markdown = await response.text();
                                
                                // Parse markdown using Marked.js if available
                                let content = markdown;
                                if (window.marked) {
                                    content = window.marked.parse(markdown);
                                } else {
                                    // Basic markdown parsing fallback
                                    content = window.blogSystem.parseMarkdownBasic(markdown);
                                }
                                
                                return { content, metadata: {} };
                            } catch (error) {
                                // Fallback: try to get content from blog config
                                const postId = contentPath.replace('.md', '');
                                const post = window.BLOG_CONFIG.posts.find(p => p.id === postId);
                                
                                if (post && post.fallbackContent) {
                                    return { content: post.fallbackContent, metadata: {} };
                                }
                                
                                return { content: '<p>Content not available: ' + error.message + '</p>', metadata: {} };
                            }
                        }
                    };
                } else {
                    this.blogConfig = { posts: [] };
                }
            }
        } catch (error) {
            this.blogConfig = { posts: [] };
        }
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
        
        // Check if blog config is available
        if (!this.blogConfig || !this.blogConfig.config || !this.blogConfig.config.posts) {
            app.innerHTML = '<div class="error">Blog configuration not loaded</div>';
            return;
        }
        
        // Get paginated posts
        const paginationData = this.blogConfig.getPaginatedPosts(page);
        const { posts, totalPages, currentPage, hasNext, hasPrev, nextPage, prevPage } = paginationData;
        
        // Create posts HTML
        const postsHtml = posts.map(post => this.createPostCard(post)).join('');
        
        // Create pagination HTML
        const paginationHtml = this.createPaginationHtml(currentPage, totalPages, hasNext, hasPrev, nextPage, prevPage);
        
        // Create full page structure matching CSS
        let indexHtml = '<header class="page-header">';
        indexHtml += '<h1 class="page-title">' + this.blogConfig.config.title + '</h1>';
        indexHtml += '<p class="page-subtitle">' + this.blogConfig.config.description + '</p>';
        indexHtml += '</header>';
        indexHtml += '<div class="content">';
        indexHtml += '<div class="blog-posts">' + postsHtml + '</div>';
        indexHtml += paginationHtml;
        indexHtml += '</div>';

        app.innerHTML = indexHtml;
        app.classList.add('fade-in');

        // Update document title
        document.title = this.blogConfig.config.title + ' - Blog';
        this.updateMetaDescription(this.blogConfig.config.description);
        this.setupContentLinks(app);
    }

    createPostCard(post) {
        const tagsHtml = post.tags.map(tag => '<span class="post-tag">' + tag + '</span>').join('');
        
        let cardHtml = '<a href="?post=' + post.id + '" class="blog-post" onclick="BlogSystem.navigateToPost(\'' + post.id + '\'); return false;">';
        
        if (post.image) {
            cardHtml += '<div class="post-image"><img src="' + post.image + '" alt="' + post.title + '" loading="lazy"></div>';
        }
        
        cardHtml += '<div class="post-content">';
        cardHtml += '<div class="post-header">';
        cardHtml += '<span class="post-date">' + post.date + '</span>';
        
        if (post.featured) {
            cardHtml += '<span class="post-badge featured">Featured</span>';
        }
        
        if (post.status) {
            cardHtml += '<span class="post-status status-' + post.status + '">' + post.status + '</span>';
        }
        
        cardHtml += '</div>';
        cardHtml += '<h2 class="post-title">' + post.title + '</h2>';
        cardHtml += '<p class="post-description">' + post.description + '</p>';
        
        if (post.tags && post.tags.length > 0) {
            cardHtml += '<div class="post-tags">' + tagsHtml + '</div>';
        }
        
        if (post.category) {
            cardHtml += '<div class="post-category">' + post.category + '</div>';
        }
        
        cardHtml += '</div></a>';
        
        return cardHtml;
    }

    createPaginationHtml(currentPage, totalPages, hasNext, hasPrev, nextPage, prevPage) {
        if (totalPages <= 1) return '';

        let paginationHtml = '<nav class="pagination">';
        
        // Previous button
        if (hasPrev) {
            paginationHtml += '<a href="?page=' + prevPage + '" class="pagination-btn" onclick="BlogSystem.navigateToPage(' + prevPage + '); return false;">← Previous</a>';
        } else {
            paginationHtml += '<span class="pagination-btn pagination-btn-disabled">← Previous</span>';
        }
        
        // Page numbers
        paginationHtml += '<div class="pagination-numbers">';
        for (let i = 1; i <= totalPages; i++) {
            const isActive = i === currentPage;
            const activeClass = isActive ? ' pagination-number-active' : '';
            paginationHtml += '<a href="?page=' + i + '" class="pagination-number' + activeClass + '" onclick="BlogSystem.navigateToPage(' + i + '); return false;">' + i + '</a>';
        }
        paginationHtml += '</div>';
        
        // Next button
        if (hasNext) {
            paginationHtml += '<a href="?page=' + nextPage + '" class="pagination-btn" onclick="BlogSystem.navigateToPage(' + nextPage + '); return false;">Next →</a>';
        } else {
            paginationHtml += '<span class="pagination-btn pagination-btn-disabled">Next →</span>';
        }

        paginationHtml += '</nav>';
        return paginationHtml;
    }

    async renderPost(postId) {
        // Check if blog config is available
        if (!this.blogConfig) {
            this.renderError('Blog configuration not loaded');
            return;
        }
        
        const post = this.blogConfig.getPostById(postId);
        
        if (!post) {
            this.renderError('Blog post not found');
            return;
        }

        // Show loading state
        const app = document.getElementById('app');
        app.innerHTML = '<div class="content"><a href="?" class="back-button" onclick="BlogSystem.navigateToIndex(); return false;">← Back to Blog</a><div class="loading">Loading post...</div></div>';

        try {
            // Load markdown content using TOML config
            const { content, metadata } = await this.blogConfig.loadMarkdownContent(post.contentPath);
            
            // Update document title
            document.title = post.title + ' - Blog';
            
            this.renderPostContent(content, post, metadata);
        } catch (error) {
            this.renderError('Failed to load blog post content');
        }
    }

    renderPostContent(content, post, metadata = {}) {
        const app = document.getElementById('app');
        
        // Get navigation links
        const navigation = this.blogConfig.getPostNavigation(post.id);
        const navHtml = this.createPostNavigation(navigation);
        
        // Create post metadata
        const tagsHtml = post.tags.map(tag => '<span class="article-tag">' + tag + '</span>').join('');
        const featuresHtml = post.features ? post.features.map(feature => '<li>' + feature + '</li>').join('') : '';
        const contributorsHtml = post.contributors ? post.contributors.map(contributor => '<span class="article-contributor">' + contributor + '</span>').join('') : '';
        
        let postHtml = '<div class="content">';
        postHtml += '<a href="?" class="back-button" onclick="BlogSystem.navigateToIndex(); return false;">← Back to Blog</a>';
        postHtml += '<article class="article">';
        
        if (post.image) {
            postHtml += '<div class="article-image"><img src="' + post.image + '" alt="' + post.title + '"></div>';
        }
        
        postHtml += '<header class="article-header">';
        postHtml += '<div class="article-meta">';
        postHtml += '<span>' + post.date + ' • ' + (post.readTime || '5 min read') + '</span>';
        postHtml += '<div>';
        
        if (post.status) {
            postHtml += '<span class="article-status status-' + post.status + '">' + post.status + '</span>';
        }
        
        if (post.featured) {
            postHtml += '<span class="article-badge featured">Featured</span>';
        }
        
        postHtml += '</div></div>';
        postHtml += '<h1 class="article-title">' + post.title + '</h1>';
        postHtml += '<p class="article-description">' + post.description + '</p>';
        
        if (post.repoUrl || post.demoUrl) {
            postHtml += '<div class="article-links">';
            if (post.demoUrl) {
                postHtml += '<a href="' + post.demoUrl + '" target="_blank" class="article-link demo">🚀 Live Demo</a>';
            }
            if (post.repoUrl) {
                postHtml += '<a href="' + post.repoUrl + '" target="_blank" class="article-link repo">💻 Repository</a>';
            }
            postHtml += '</div>';
        }
        
        if (featuresHtml) {
            postHtml += '<div class="article-features"><h3>Key Features:</h3><ul>' + featuresHtml + '</ul></div>';
        }
        
        postHtml += '</header>';
        postHtml += '<div class="article-content">' + content + '</div>';
        
        // Add tags and contributors at the bottom of the article
        if (post.tags && post.tags.length > 0) {
            postHtml += '<div class="article-tags">' + tagsHtml + '</div>';
        }
        
        if (contributorsHtml) {
            postHtml += '<div class="article-contributors">Contributors: ' + contributorsHtml + '</div>';
        }
        
        postHtml += navHtml;
        postHtml += '</article></div>';

        app.innerHTML = postHtml;
        app.classList.add('fade-in');

        // Update page metadata
        document.title = post.title + ' - Blog';
        this.updateMetaDescription(post.description);

        // Setup content links
        this.setupContentLinks(app);
    }

    createPostNavigation(navigation) {
        if (!navigation.prev && !navigation.next) return '';

        let navHtml = '<nav class="post-navigation">';
        
        if (navigation.prev) {
            navHtml += '<a href="?post=' + navigation.prev.id + '" class="nav-button nav-prev" onclick="BlogSystem.navigateToPost(\'' + navigation.prev.id + '\'); return false;">';
            navHtml += '<span class="nav-arrow">←</span>';
            navHtml += '<div class="nav-button-content">';
            navHtml += '<span class="nav-label">Previous</span>';
            navHtml += '<span class="nav-title">' + navigation.prev.title + '</span>';
            navHtml += '</div>';
            navHtml += '</a>';
        }
        
        if (navigation.next) {
            navHtml += '<a href="?post=' + navigation.next.id + '" class="nav-button nav-next" onclick="BlogSystem.navigateToPost(\'' + navigation.next.id + '\'); return false;">';
            navHtml += '<span class="nav-arrow">→</span>';
            navHtml += '<div class="nav-button-content">';
            navHtml += '<span class="nav-label">Next</span>';
            navHtml += '<span class="nav-title">' + navigation.next.title + '</span>';
            navHtml += '</div>';
            navHtml += '</a>';
        }
        
        navHtml += '</nav>';
        return navHtml;
    }

    renderError(message = 'Content not available') {
        const app = document.getElementById('app');
        
        let errorHtml = '<div class="content">';
        errorHtml += '<div class="error">';
        errorHtml += '<h2>' + message + '</h2>';
        errorHtml += '<p>Please try again later or <a href="?" onclick="BlogSystem.navigateToIndex(); return false;">return to the blog index</a>.</p>';
        errorHtml += '</div></div>';
        
        app.innerHTML = errorHtml;
        document.title = 'Error - Blog';
    }

    updateMetaDescription(description) {
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', description);
        }
    }

    setupContentLinks(container) {
        // Add click handlers for internal links
        const links = container.querySelectorAll('a[href^="?"]');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const href = link.getAttribute('href');
                window.history.pushState({}, '', href);
                this.handleRouting();
            });
        });
    }

    // Static navigation methods for onclick handlers
    static navigateToPost(postId) {
        const newUrl = window.location.pathname + '?post=' + postId;
        window.history.pushState({ postId }, '', newUrl);
        window.blogSystem.handleRouting();
    }

    static navigateToIndex() {
        const newUrl = window.location.pathname;
        window.history.pushState({}, '', newUrl);
        window.blogSystem.handleRouting();
    }

    parseMarkdownBasic(markdown) {
        // Simple markdown parser fallback
        let content = markdown;

        // Basic markdown to HTML conversion
        content = content
            // Headers
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            // Bold
            .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
            // Italic
            .replace(/\*(.*?)\*/gim, '<em>$1</em>')
            // Links
            .replace(/\[([^\]]*)\]\(([^\)]*)\)/gim, '<a href="$2" target="_blank">$1</a>')
            // Code blocks
            .replace(/```([^`]*)```/gims, '<pre><code>$1</code></pre>')
            // Inline code
            .replace(/`([^`]*)`/gim, '<code>$1</code>')
            // Line breaks - convert double newlines to paragraphs
            .split('\n\n')
            .map(paragraph => paragraph.trim() ? `<p>${paragraph.replace(/\n/g, '<br>')}</p>` : '')
            .join('');

        return content;
    }

    static navigateToPage(page) {
        const newUrl = window.location.pathname + '?page=' + page;
        window.history.pushState({ page }, '', newUrl);
        window.blogSystem.handleRouting();
    }
}