/**
 * Blog Configuration TOML Loader
 * Loads blog configuration from TOML file with JavaScript fallback
 */

class BlogConfigTOML {
    constructor() {
        this.config = null;
        this.isInitialized = false;
    }

    async init() {
        try {
            // Try to load TOML configuration first
            const tomlSuccess = await this.loadTOMLConfig();
            if (tomlSuccess) {
                this.isInitialized = true;
                return true;
            }
            
            // Force fallback to JavaScript configuration for debugging
            if (window.BLOG_CONFIG) {
                this.config = this.convertJSConfigToTOMLFormat(window.BLOG_CONFIG);
                this.isInitialized = true;
                return true;
            } else {
                console.error('No fallback configuration available');
                this.config = this.getDefaultConfig();
                this.isInitialized = false;
                return false;
            }
        } catch (error) {
            console.error('Error initializing blog config:', error);
            this.config = this.getDefaultConfig();
            this.isInitialized = false;
            return false;
        }
    }

    async loadTOMLConfig() {
        try {
            // Fetch TOML file first
            const response = await fetch('./config/blog.toml?t=' + Date.now());
            if (!response.ok) {
                throw new Error(`Failed to fetch blog.toml: ${response.status}`);
            }

            const tomlText = await response.text();
            
            // Try to parse with a simple TOML parser
            let tomlData;
            
            // Check if TOML parser is available
            let tomlParser = null;
            
            // Try different ways to access the TOML parser
            if (window.TOML) {
                tomlParser = window.TOML;
                tomlData = tomlParser.parse(tomlText);
            } else if (window.toml) {
                tomlParser = window.toml;
                tomlData = tomlParser.parse(tomlText);
            } else {
                // Use a simple TOML parser implementation
                tomlData = this.parseSimpleTOML(tomlText);
            }
            
            this.config = this.processTOMLConfig(tomlData);
            return true;
        } catch (error) {
            return false;
        }
    }

    parseSimpleTOML(tomlText) {
        // Simple TOML parser for basic structures
        const lines = tomlText.split('\n');
        const result = {};
        let currentSection = result;
        let currentSectionName = '';
        let currentArray = null;
        let currentArrayName = '';
        let multiLineValue = '';
        let multiLineKey = '';
        let inMultiLineArray = false;
        
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i].trim();
            
            // Skip empty lines and comments
            if (!line || line.startsWith('#')) continue;
            
            // Handle section headers
            if (line.startsWith('[') && line.endsWith(']')) {
                const sectionName = line.slice(1, -1);
                
                if (sectionName.startsWith('[') && sectionName.endsWith(']')) {
                    // Array of tables [[posts]]
                    const arrayName = sectionName.slice(1, -1);
                    if (!result[arrayName]) {
                        result[arrayName] = [];
                    }
                    currentArray = {};
                    result[arrayName].push(currentArray);
                    currentSection = currentArray;
                    currentArrayName = arrayName;
                } else {
                    // Regular section [blog]
                    if (!result[sectionName]) {
                        result[sectionName] = {};
                    }
                    currentSection = result[sectionName];
                    currentSectionName = sectionName;
                    currentArray = null;
                }
                continue;
            }
            
            // Handle key-value pairs
            if (line.includes('=')) {
                const [key, ...valueParts] = line.split('=');
                const cleanKey = key.trim();
                let value = valueParts.join('=').trim();
                
                // Handle multi-line arrays
                if (value.startsWith('[') && !value.endsWith(']')) {
                    inMultiLineArray = true;
                    multiLineKey = cleanKey;
                    multiLineValue = value;
                    continue;
                }
                
                // Remove quotes
                if ((value.startsWith('"') && value.endsWith('"')) || 
                    (value.startsWith("'") && value.endsWith("'"))) {
                    value = value.slice(1, -1);
                }
                
                // Parse arrays
                if (value.startsWith('[') && value.endsWith(']')) {
                    const arrayContent = value.slice(1, -1);
                    if (arrayContent.trim()) {
                        value = arrayContent.split(',').map(item => {
                            item = item.trim();
                            if ((item.startsWith('"') && item.endsWith('"')) || 
                                (item.startsWith("'") && item.endsWith("'"))) {
                                return item.slice(1, -1);
                            }
                            return item;
                        });
                    } else {
                        value = [];
                    }
                }
                
                // Parse numbers and booleans
                if (value === 'true') value = true;
                else if (value === 'false') value = false;
                else if (!isNaN(value) && !isNaN(parseFloat(value))) {
                    value = parseFloat(value);
                }
                
                currentSection[cleanKey] = value;
            } else if (inMultiLineArray) {
                // Continue building multi-line array
                multiLineValue += ' ' + line;
                
                if (line.endsWith(']')) {
                    // End of multi-line array
                    inMultiLineArray = false;
                    
                    // Parse the complete array
                    let value = multiLineValue.trim();
                    if (value.startsWith('[') && value.endsWith(']')) {
                        const arrayContent = value.slice(1, -1);
                        value = arrayContent.split(',').map(item => {
                            item = item.trim();
                            if ((item.startsWith('"') && item.endsWith('"')) || 
                                (item.startsWith("'") && item.endsWith("'"))) {
                                return item.slice(1, -1);
                            }
                            return item;
                        }).filter(item => item); // Remove empty items
                    }
                    
                    currentSection[multiLineKey] = value;
                    multiLineValue = '';
                    multiLineKey = '';
                }
            }
        }
        
        return result;
    }

    processTOMLConfig(tomlData) {
        // Convert TOML structure to our expected format
        const config = {
            title: tomlData.blog?.title || 'Blog',
            description: tomlData.blog?.description || 'My Blog',
            author: tomlData.blog?.author || 'Blog Author',
            authorProfile: tomlData.blog?.author_profile || '',
            baseUrl: tomlData.blog?.base_url || '',
            
            pagination: {
                postsPerPage: tomlData.pagination?.posts_per_page || 6,
                enabled: tomlData.pagination?.enabled !== false
            },
            
            settings: {
                enableComments: tomlData.settings?.enable_comments !== false,
                enableSocialSharing: tomlData.settings?.enable_social_sharing !== false,
                enableSearch: tomlData.settings?.enable_search !== false,
                enableCategories: tomlData.settings?.enable_categories !== false,
                enableTags: tomlData.settings?.enable_tags !== false,
                enableRelatedPosts: tomlData.settings?.enable_related_posts !== false,
                defaultImage: tomlData.settings?.default_image || 'https://dummyimage.com/600x400/0066cc/ffffff&text=Blog+Post'
            },
            
            posts: (tomlData.posts || []).map(post => ({
                id: post.id,
                title: post.title,
                description: post.description,
                date: this.formatDate(post.date),
                dateISO: post.date,
                tags: post.tags || [],
                category: post.category || 'General',
                contentPath: post.content_file,
                author: post.author || tomlData.blog?.author || 'Blog Author',
                authorProfile: tomlData.blog?.author_profile || '',
                readTime: post.read_time || '5 min read',
                featured: post.featured === true,
                status: post.status || 'published',
                image: post.image || tomlData.settings?.default_image,
                repoUrl: post.repo_url || '',
                demoUrl: post.demo_url || '',
                license: post.license || 'MIT',
                contributors: post.contributors || [],
                features: post.features || [],
                related: post.related_posts || []
            }))
        };
        
        return config;
    }

    convertJSConfigToTOMLFormat(jsConfig) {
        console.log('Converting JS config to TOML format...');
        return {
            title: jsConfig.title,
            description: jsConfig.description,
            author: jsConfig.author || 'Blog Author',
            authorProfile: jsConfig.authorProfile || '',
            baseUrl: jsConfig.baseUrl || '',
            pagination: jsConfig.pagination,
            settings: {
                enableComments: true,
                enableSocialSharing: true,
                enableSearch: true,
                enableCategories: true,
                enableTags: true,
                enableRelatedPosts: true,
                defaultImage: 'https://dummyimage.com/600x400/0066cc/ffffff&text=Blog+Post'
            },
            posts: jsConfig.posts.map(post => ({
                ...post,
                related: post.related || [],
                fallbackContent: post.fallbackContent // Preserve fallback content
            }))
        };
    }

    getDefaultConfig() {
        return {
            title: 'Personal Blog',
            description: 'A personal blog',
            author: 'Blog Author',
            authorProfile: '',
            baseUrl: '',
            pagination: {
                postsPerPage: 6,
                enabled: true
            },
            settings: {
                enableComments: true,
                enableSocialSharing: true,
                enableSearch: true,
                enableCategories: true,
                enableTags: true,
                enableRelatedPosts: true,
                defaultImage: 'https://dummyimage.com/600x400/0066cc/ffffff&text=Blog+Post'
            },
            posts: []
        };
    }

    formatDate(dateString) {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch {
            return dateString;
        }
    }

    // Navigation between posts
    getPostNavigation(currentPostId) {
        const posts = this.config.posts;
        const currentIndex = posts.findIndex(post => post.id === currentPostId);
        
        if (currentIndex === -1) return { prev: null, next: null };

        const prev = currentIndex > 0 ? posts[currentIndex - 1] : null;
        const next = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;

        return { prev, next };
    }

    // Get post by ID
    getPostById(id) {
        return this.config.posts.find(post => post.id === id);
    }

    // Get all posts sorted by date (newest first)
    getAllPosts() {
        const sortedPosts = [...this.config.posts].sort((a, b) => new Date(b.dateISO) - new Date(a.dateISO));
        return sortedPosts;
    }

    // Get featured posts
    getFeaturedPosts() {
        return this.config.posts.filter(post => post.featured);
    }

    // Get posts by tag
    getPostsByTag(tag) {
        return this.config.posts.filter(post => 
            post.tags.some(postTag => postTag.toLowerCase() === tag.toLowerCase())
        );
    }

    // Get posts by category
    getPostsByCategory(category) {
        return this.config.posts.filter(post => 
            post.category.toLowerCase() === category.toLowerCase()
        );
    }

    // Get all unique tags
    getAllTags() {
        const allTags = this.config.posts.flatMap(post => post.tags);
        return [...new Set(allTags)].sort();
    }

    // Get all unique categories
    getAllCategories() {
        const allCategories = this.config.posts.map(post => post.category);
        return [...new Set(allCategories)].sort();
    }

    // Pagination methods
    getPaginatedPosts(page = 1) {
        if (!this.config.pagination.enabled) {
            return {
                posts: this.getAllPosts(),
                totalPages: 1,
                currentPage: 1,
                hasNext: false,
                hasPrev: false
            };
        }

        const allPosts = this.getAllPosts();
        const { postsPerPage } = this.config.pagination;
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
    }

    // Markdown loading methods
    async loadMarkdownContent(contentPath) {
        try {
            console.log('Attempting to load markdown content for:', contentPath);
            const response = await fetch(`./content/${contentPath}`);
            if (!response.ok) {
                throw new Error(`Failed to load ${contentPath}: ${response.status}`);
            }
            
            const markdown = await response.text();
            
            // Parse markdown using Marked.js if available, otherwise use basic parser
            let content = markdown;
            if (window.marked) {
                content = window.marked.parse(markdown);
            } else {
                // Use the blog system's basic markdown parser
                content = window.blogSystem ? window.blogSystem.parseMarkdownBasic(markdown) : this.parseMarkdown(markdown).content;
            }
            
            return { content, metadata: {} };
        } catch (error) {
            console.log('Failed to load markdown file, looking for fallback content...', error.message);
            
            // Fallback: try to get content from blog config
            const postId = contentPath.replace('.md', '');
            const post = this.config.posts.find(p => p.id === postId);
            
            if (post && post.fallbackContent) {
                console.log('Found fallback content for post:', postId);
                return { content: post.fallbackContent, metadata: {} };
            }
            
            // If no fallback content found, return error message
            console.error('No fallback content found for post:', postId);
            return { 
                content: '<div class="error"><h2>Content not available</h2><p>Sorry, this content is temporarily unavailable. Please try again later.</p></div>', 
                metadata: {} 
            };
        }
    }

    parseMarkdown(markdown) {
        // Simple markdown parser (you can enhance this or use a library like marked.js)
        let content = markdown;
        let metadata = {};

        // Extract frontmatter if present
        if (content.startsWith('---')) {
            const frontmatterEnd = content.indexOf('---', 3);
            if (frontmatterEnd !== -1) {
                const frontmatter = content.slice(3, frontmatterEnd);
                content = content.slice(frontmatterEnd + 3).trim();
                
                // Parse simple YAML-like frontmatter
                frontmatter.split('\n').forEach(line => {
                    const [key, ...values] = line.split(':');
                    if (key && values.length) {
                        metadata[key.trim()] = values.join(':').trim();
                    }
                });
            }
        }

        // Basic markdown to HTML conversion
        content = content
            // Headers
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            // Bold
            .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
            // Italic
            .replace(/\*(.*)\*/gim, '<em>$1</em>')
            // Links
            .replace(/\[([^\]]*)\]\(([^\)]*)\)/gim, '<a href="$2" target="_blank">$1</a>')
            // Code blocks
            .replace(/```([^`]*)```/gim, '<pre><code>$1</code></pre>')
            // Inline code
            .replace(/`([^`]*)`/gim, '<code>$1</code>')
            // Line breaks
            .replace(/\n\n/gim, '</p><p>')
            .replace(/\n/gim, '<br>');

        // Wrap in paragraphs
        if (!content.startsWith('<')) {
            content = '<p>' + content + '</p>';
        }

        return { content, metadata };
    }

    // Search functionality
    searchPosts(query) {
        const lowercaseQuery = query.toLowerCase();
        return this.config.posts.filter(post => {
            return (
                post.title.toLowerCase().includes(lowercaseQuery) ||
                post.description.toLowerCase().includes(lowercaseQuery) ||
                post.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
                post.category.toLowerCase().includes(lowercaseQuery)
            );
        });
    }
}

// Initialize global blog configuration
window.blogConfigTOML = new BlogConfigTOML();